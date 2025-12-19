from app.services.groq_service import groq_service
from app.services.vector_service import vector_service
from sqlalchemy.orm import Session
from app.models.chat import Message, SenderEnum, EnhancedContext
from typing import List, Dict
import json

class ContextEngine:
    """
    Core Context Engine:
    1. Ingests messages/files
    2. Creates embeddings
    3. Stores in vector DB
    4. Retrieves relevant context
    5. Builds prompts for AI
    """
    
    def ingest_message(
        self, 
        db: Session,
        session_id: int,
        message_id: int,
        text: str,
        sender: str
    ):
        """Process and store new message"""
        # Create embedding
        embedding = groq_service.create_embedding(text)
        
        # Store in vector DB
        vector_service.add_embedding(
            session_id=session_id,
            text=text,
            embedding=embedding,
            metadata={
                "type": "message",
                "sender": sender,
                "message_id": message_id
            },
            doc_id=f"msg_{message_id}"
        )
        
        # Update context summary
        self._update_context_summary(db, session_id)
    
    def ingest_file(
        self,
        db: Session,
        session_id: int,
        file_id: int,
        text: str
    ):
        """Process and store file content (chunked)"""
        # Simple chunking (500 chars per chunk)
        chunks = [text[i:i+500] for i in range(0, len(text), 500)]
        
        for idx, chunk in enumerate(chunks[:10]):  # Limit to 10 chunks (FREE tier)
            embedding = groq_service.create_embedding(chunk)
            
            vector_service.add_embedding(
                session_id=session_id,
                text=chunk,
                embedding=embedding,
                metadata={
                    "type": "file",
                    "file_id": file_id,
                    "chunk_index": idx
                },
                doc_id=f"file_{file_id}_chunk_{idx}"
            )
        
        self._update_context_summary(db, session_id)
    
    def retrieve_context(
        self,
        session_id: int,
        query: str,
        top_k: int = 3
    ) -> str:
        """Retrieve relevant context for a query"""
        # Create query embedding
        query_embedding = groq_service.create_embedding(query)
        
        # Search vector DB
        results = vector_service.search_similar(
            session_id=session_id,
            query_embedding=query_embedding,
            top_k=top_k
        )
        
        # Format context
        if results["documents"] and results["documents"][0]:
            context_parts = []
            for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
                context_parts.append(f"[{meta.get('type', 'unknown')}]: {doc}")
            return "\n\n".join(context_parts)
        
        return ""
    
    def _update_context_summary(self, db: Session, session_id: int):
        """Update session context summary"""
        context = db.query(EnhancedContext).filter(
            EnhancedContext.chat_session_id == session_id
        ).first()
        
        if not context:
            context = EnhancedContext(
                chat_session_id=session_id,
                summary_state="Context initialized"
            )
            db.add(context)
        else:
            context.summary_state = f"Updated at {context.last_updated}"
        
        db.commit()

# Global instance
context_engine = ContextEngine()