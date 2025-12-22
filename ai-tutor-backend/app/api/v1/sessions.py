from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.chat import ChatSession
from app.api.auth.routes import get_current_user
from app.models.user import User

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.get("/", response_model=list[dict])
def list_chats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chats = (
        db.query(ChatSession)
        .filter(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.created_at.desc())
        .all()
    )

    return [
        {
            "id": chat.id,
            "title": chat.title,
            "created_at": chat.created_at.isoformat(),
        }
        for chat in chats
    ]


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = (
        db.query(ChatSession)
        .filter(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user.id
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )

    db.delete(session)
    db.commit()

    return None
