from sqlalchemy import Column, BigInteger, String, DateTime, func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255))
    google_id = Column(String(255), unique=True, index=True)
    created_at = Column(DateTime, server_default=func.now())


class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, nullable=False)
    full_name = Column(String(255))
    avatar_url = Column(String(500))
    role = Column(String(50), default="student")
