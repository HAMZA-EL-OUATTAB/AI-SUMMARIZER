from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.chat import ChatSession, Message, SenderEnum
from app.services.context_engine import context_engine
from app.services.groq_service import groq_service
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/chats", tags=["chats"])

class CreateChatRequest(BaseModel):
    user_id: int
    title: str

class SendMessageRequest(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: int
    sender: str
    content: str
    created_at: str

@router.post("/")
def create_chat(request: CreateChatRequest, db: Session = Depends(get_db)):
    """Create new chat session"""
    chat = ChatSession(
        user_id=request.user_id,
        title=request.title
    )
    db.add(chat)
    db.commit()
    db.refresh(chat)
    
    return {
        "id": chat.id,
        "title": chat.title,
        "created_at": str(chat.created_at)
    }

@router.get("/{session_id}/messages")
def get_messages(session_id: int, db: Session = Depends(get_db)):
    """Get all messages in a chat"""
    messages = db.query(Message).filter(
        Message.chat_session_id == session_id
    ).order_by(Message.created_at).all()
    
    return [
        {
            "id": msg.id,
            "sender": msg.sender.value,
            "content": msg.content,
            "created_at": str(msg.created_at)
        }
        for msg in messages
    ]

@router.post("/{session_id}/messages")
def send_message(
    session_id: int,
    request: SendMessageRequest,
    db: Session = Depends(get_db)
):
    """Send message and get AI response"""
    
    # 1. Save user message
    user_msg = Message(
        chat_session_id=session_id,
        sender=SenderEnum.user,
        content=request.content
    )
    db.add(user_msg)
    db.commit()
    db.refresh(user_msg)
    
    # 2. Ingest into context engine
    context_engine.ingest_message(
        db=db,
        session_id=session_id,
        message_id=user_msg.id,
        text=request.content,
        sender="user"
    )
    
    # 3. Retrieve relevant context
    context = context_engine.retrieve_context(
        session_id=session_id,
        query=request.content,
        top_k=3
    )
    
    # 4. Build prompt and get AI response
    system_prompt = """You are an intelligent educational AI tutor. 
Your role is to:
- Provide clear, accurate explanations
- Use the provided context from previous conversations
- Encourage critical thinking
- Be patient and supportive

Use the context below to give accurate, contextual responses."""
    
    messages = [
        {"role": "system", "content": system_prompt}
    ]
    
    if context:
        messages.append({
            "role": "system",
            "content": f"Relevant context from this session:\n{context}"
        })
    
    messages.append({
        "role": "user",
        "content": request.content
    })
    
    ai_response = groq_service.chat_completion(messages, max_tokens=500)
    
    # 5. Save AI response
    ai_msg = Message(
        chat_session_id=session_id,
        sender=SenderEnum.ai,
        content=ai_response
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)
    
    # 6. Ingest AI response
    context_engine.ingest_message(
        db=db,
        session_id=session_id,
        message_id=ai_msg.id,
        text=ai_response,
        sender="ai"
    )
    
    return {
        "user_message": {
            "id": user_msg.id,
            "content": user_msg.content,
            "created_at": str(user_msg.created_at)
        },
        "ai_message": {
            "id": ai_msg.id,
            "content": ai_msg.content,
            "created_at": str(ai_msg.created_at)
        }
    }
