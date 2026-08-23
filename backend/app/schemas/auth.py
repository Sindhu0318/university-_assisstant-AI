from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Optional[str] = "student" # 'student', 'faculty', 'admin'
    department: Optional[str] = "Computer Science"
    student_id: Optional[str] = None
    preferred_language: Optional[str] = "en"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    department: Optional[str] = None
    student_id: Optional[str] = None
    preferred_language: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    exp: Optional[int] = None
