from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base

from app.api.v1 import chats, files
from app.api.auth.routes import router as auth_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# ROUTERS
# --------------------
app.include_router(auth_router, prefix="/api")      # ✅ /api/auth/*
app.include_router(chats.router, prefix="/api/v1")  # /api/v1/...
app.include_router(files.router, prefix="/api/v1")  # /api/v1/...

@app.get("/")
def root():
    return {"status": "running"}

@app.get("/health")
def health():
    return {"status": "ok"}
