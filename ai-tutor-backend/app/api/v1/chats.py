from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.core.database import get_db
from app.models.chat import ChatSession, Message, SenderEnum
from app.models.user import User
from app.api.auth.routes import get_current_user
from app.services.context_engine import context_engine
from app.services.groq_service import groq_service

router = APIRouter(prefix="/chats", tags=["chats"])


class CreateChatRequest(BaseModel):
    title: str


class SendMessageRequest(BaseModel):
    content: str


@router.post("/")
def create_chat(
    request: CreateChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat = ChatSession(
        user_id=current_user.id,
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
def get_messages(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    messages = (
        db.query(Message)
        .filter(Message.chat_session_id == session_id)
        .order_by(Message.created_at)
        .all()
    )

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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()

    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    # User message
    user_msg = Message(
        chat_session_id=session_id,
        sender=SenderEnum.user,
        content=request.content
    )
    db.add(user_msg)
    db.commit()
    db.refresh(user_msg)

    context_engine.ingest_message(
        db=db,
        session_id=session_id,
        message_id=user_msg.id,
        text=request.content,
        sender="user"
    )

    context = context_engine.retrieve_context(
        session_id=session_id,
        query=request.content,
        top_k=3
    )

    system_prompt = """You are an intelligent educational AI tutor.
Provide clear explanations, use context, and be supportive.
"""

    messages = [{"role": "system", "content": system_prompt}]

    if context:
        messages.append({
            "role": "system",
            "content": f"Relevant context:\n{context}"
        })

    messages.append({
        "role": "user",
        "content": request.content
    })

    ai_response = groq_service.chat_completion(messages, max_tokens=500)

    ai_msg = Message(
        chat_session_id=session_id,
        sender=SenderEnum.ai,
        content=ai_response
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

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
