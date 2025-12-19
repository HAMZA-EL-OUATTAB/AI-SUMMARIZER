import os
from fastapi import UploadFile
from app.core.config import settings
from PyPDF2 import PdfReader
from typing import Tuple

class FileService:
    def __init__(self):
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    def save_file(self, file: UploadFile, session_id: int) -> Tuple[str, int]:
        """Save uploaded file and return (path, size)"""
        # Create session folder
        session_dir = os.path.join(settings.UPLOAD_DIR, str(session_id))
        os.makedirs(session_dir, exist_ok=True)
        
        # Save file
        file_path = os.path.join(session_dir, file.filename)
        
        with open(file_path, "wb") as f:
            content = file.file.read()
            f.write(content)
            file_size = len(content)
        
        return file_path, file_size
    
    def extract_text(self, file_path: str, file_type: str) -> str:
        """Extract text from file"""
        if file_type == "pdf":
            return self._extract_pdf_text(file_path)
        elif file_type in ["txt", "md"]:
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        else:
            return ""
    
    def _extract_pdf_text(self, file_path: str) -> str:
        """Extract text from PDF"""
        try:
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages[:20]:  # Limit pages (FREE tier)
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            print(f"❌ PDF extraction error: {e}")
            return ""

# Global instance
file_service = FileService()