import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="student", nullable=False) # 'student', 'faculty', 'admin'
    department = Column(String(100), nullable=True, default="Computer Science")
    student_id = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True)
    preferred_language = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="uploader")
