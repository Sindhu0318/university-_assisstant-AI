import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(String(100), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), default="New Conversation")
    language = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    message_id = Column(String(100), unique=True, index=True, nullable=False)
    conversation_id = Column(String(100), ForeignKey("conversations.conversation_id"), nullable=False)
    role = Column(String(20), nullable=False) # 'user', 'assistant', 'system'
    content = Column(Text, nullable=False)
    language = Column(String(10), default="en")
    sources = Column(JSON, nullable=True) # list of citation objects
    latency_ms = Column(Float, nullable=True)
    query_intent = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")
    feedback = relationship("Feedback", back_populates="message", uselist=False, cascade="all, delete-orphan")

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    message_id = Column(String(100), ForeignKey("messages.message_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_helpful = Column(Integer, nullable=False) # 1 for helpful, -1 for not helpful
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    message = relationship("Message", back_populates="feedback")
