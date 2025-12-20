from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer

from app.schemas.auth import (
    UserCreate, Login, TokenResponse, UserOut, UserUpdate, UserPasswordUpdate
)
from app.models.user import User
from app.core.database import get_db
from app.core.security import (
    get_password_hash, verify_password, create_access_token, decode_token
)

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ---------------- Helper: Get current user from token ----------------
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = int(payload.get("sub"))
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ------------------------- SIGNUP -------------------------
@router.post("/signup", response_model=TokenResponse)
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    user = User(
        email=payload.email,
        username=payload.username,
        full_name=payload.full_name or "",
        hashed_password=get_password_hash(payload.password),
        role="user",
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(subject=str(user.id))

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


# ------------------------- LOGIN -------------------------
@router.post("/login", response_model=TokenResponse)
def login(payload: Login, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(subject=str(user.id))
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


# ------------------------- GET PROFILE -------------------------
@router.get("/profile", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


# ------------------------- UPDATE PROFILE -------------------------
@router.put("/profile", response_model=UserOut)
def update_profile(payload: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.email = payload.email or current_user.email
    current_user.username = payload.username or current_user.username
    current_user.full_name = payload.full_name or current_user.full_name
    db.commit()
    db.refresh(current_user)
    return current_user


# ------------------------- UPDATE PASSWORD -------------------------
@router.put("/profile/password")
def update_password(payload: UserPasswordUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(payload.old_password, current_user.hashed_password):
        raise HTTPException(status_code=401, detail="Old password incorrect")
    current_user.hashed_password = get_password_hash(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


# ------------------------- DELETE ACCOUNT -------------------------
@router.delete("/profile")
def delete_account(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.delete(current_user)
    db.commit()
    return {"message": "Account deleted successfully"}
