from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

class Citation(BaseModel):
    document_id: str
    document_title: str
    category: Optional[str] = None
    section: Optional[str] = None
    page_number: Optional[int] = None
    version: Optional[str] = None
    effective_date: Optional[str] = None
    snippet: Optional[str] = None
    relevance_score: Optional[float] = None

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    language: Optional[str] = "en" # 'en', 'te', 'hi'
    uploaded_file_id: Optional[str] = None
    stream: Optional[bool] = False

class ChatResponse(BaseModel):
    conversation_id: str
    message_id: str
    answer: str
    language: str
    sources: List[Citation] = []
    suggested_followups: List[str] = []
    query_intent: Optional[str] = None
    latency_ms: Optional[float] = None

class FeedbackCreate(BaseModel):
    message_id: str
    is_helpful: int # 1 or -1
    comment: Optional[str] = None

class MessageOut(BaseModel):
    message_id: str
    role: str
    content: str
    language: str
    sources: Optional[List[Any]] = None
    created_at: datetime
    feedback: Optional[Any] = None

    class Config:
        from_attributes = True

class ConversationOut(BaseModel):
    conversation_id: str
    title: str
    language: str
    created_at: datetime
    updated_at: datetime
    messages: Optional[List[MessageOut]] = []

    class Config:
        from_attributes = True
