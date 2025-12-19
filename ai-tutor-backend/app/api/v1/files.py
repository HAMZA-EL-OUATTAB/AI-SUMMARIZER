from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.chat import UploadedFile
from app.services.file_service import file_service
from app.services.context_engine import context_engine

router = APIRouter(prefix="/files", tags=["files"])

@router.post("/upload/{session_id}")
async def upload_file(
    session_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload and process file"""
    
    # 1. Validate file type
    allowed_types = ["pdf", "txt", "md"]
    file_ext = file.filename.split(".")[-1].lower()
    
    if file_ext not in allowed_types:
        raise HTTPException(400, "File type not supported")
    
    # 2. Save file
    file_path, file_size = file_service.save_file(file, session_id)
    
    # 3. Save to database
    uploaded_file = UploadedFile(
        chat_session_id=session_id,
        filename=file.filename,
        file_type=file_ext,
        storage_path=file_path,
        file_size=file_size
    )
    db.add(uploaded_file)
    db.commit()
    db.refresh(uploaded_file)
    
    # 4. Extract text
    text = file_service.extract_text(file_path, file_ext)
    
    # 5. Ingest into context engine
    if text:
        context_engine.ingest_file(
            db=db,
            session_id=session_id,
            file_id=uploaded_file.id,
            text=text
        )
    
    return {
        "id": uploaded_file.id,
        "filename": uploaded_file.filename,
        "file_type": uploaded_file.file_type,
        "file_size": uploaded_file.file_size,
        "text_extracted": len(text) > 0,
        "uploaded_at": str(uploaded_file.uploaded_at)
    }