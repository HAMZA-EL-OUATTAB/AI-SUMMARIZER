from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "AI Tutor Backend"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    DATABASE_URL: str = "mysql+pymysql://root:@localhost:3306/ai_tutor_db"
    GROQ_API_KEY: str = ""
    GROQ_EMBEDDING_MODEL: str = "nomic-embed-text-v1"
    GROQ_CHAT_MODEL: str = "llama-3.3-70b-versatile"
    CHROMA_PERSIST_DIR: str = "./chroma_db"
    SECRET_KEY: str = "your-secret-key-change-this"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()