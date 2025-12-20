from pydantic import BaseModel, EmailStr
from typing import Optional

# ------------------------- INPUTS -------------------------
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None

class Login(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None

class UserPasswordUpdate(BaseModel):
    old_password: str
    new_password: str


# ------------------------- OUTPUTS -------------------------
class UserOut(BaseModel):
    id: int
    email: EmailStr
    username: str
    full_name: Optional[str]
    role: str
    is_active: bool

    class Config:
        orm_mode = True  # important for SQLAlchemy model compatibility


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
