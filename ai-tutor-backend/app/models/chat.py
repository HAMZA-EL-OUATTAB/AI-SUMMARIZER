from sqlalchemy import Column, BigInteger, String, DateTime, Text, Enum, JSON, func, Float
from app.core.database import Base
import enum

class SenderEnum(enum.Enum):
    user = "user"
    ai = "ai"

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Message(Base):
    __tablename__ = "messages"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    chat_session_id = Column(BigInteger, nullable=False, index=True)
    sender = Column(Enum(SenderEnum), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())


class UploadedFile(Base):
    __tablename__ = "uploaded_files"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    chat_session_id = Column(BigInteger, nullable=False, index=True)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50))
    storage_path = Column(String(500), nullable=False)
    file_size = Column(BigInteger)
    uploaded_at = Column(DateTime, server_default=func.now())


class EnhancedContext(Base):
    __tablename__ = "enhanced_contexts"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    chat_session_id = Column(BigInteger, unique=True, nullable=False)
    summary_state = Column(Text)
    last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Summary(Base):
    __tablename__ = "summaries"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    chat_session_id = Column(BigInteger, nullable=False, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())


class MindMap(Base):
    __tablename__ = "mindmaps"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    chat_session_id = Column(BigInteger, unique=True, nullable=False)
    graph_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

