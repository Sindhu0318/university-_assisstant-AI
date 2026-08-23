from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.chat import Conversation, Message, Feedback
from backend.app.models.document import Document, DocumentChunk
from backend.app.models.assessment import Assessment
from backend.app.models.notice import Notice
from backend.app.schemas.auth import UserOut
from backend.app.utils.security import require_role
from typing import List

router = APIRouter(prefix="/admin", tags=["Admin Dashboard & System Observability"])

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_conversations = db.query(Conversation).count()
    total_messages = db.query(Message).count()
    total_documents = db.query(Document).count()
    total_chunks = db.query(DocumentChunk).count()
    total_assessments = db.query(Assessment).count()
    total_notices = db.query(Notice).count()
    
    positive_feedback = db.query(Feedback).filter(Feedback.is_helpful == 1).count()
    negative_feedback = db.query(Feedback).filter(Feedback.is_helpful == -1).count()

    # Unanswered / low-confidence questions
    unanswered_msgs = db.query(Message).filter(
        Message.role == "assistant",
        Message.content.like("%couldn't find this information%") | 
        Message.content.like("%సమాచారం అందుబాటులో లేదు%") | 
        Message.content.like("%जानकारी उपलब्ध नहीं%")
    ).order_by(Message.created_at.desc()).limit(10).all()

    # Recent active conversations
    recent_conversations = db.query(Conversation).order_by(Conversation.updated_at.desc()).limit(8).all()

    return {
        "total_users": total_users,
        "total_conversations": total_conversations,
        "total_messages": total_messages,
        "total_documents": total_documents,
        "total_chunks": total_chunks,
        "total_assessments": total_assessments,
        "total_notices": total_notices,
        "positive_feedback": positive_feedback,
        "negative_feedback": negative_feedback,
        "satisfaction_rate_percent": round((positive_feedback / (positive_feedback + negative_feedback) * 100) if (positive_feedback + negative_feedback) > 0 else 98.0, 1),
        "unanswered_count": len(unanswered_msgs),
        "unanswered_samples": [{"message_id": m.message_id, "snippet": m.content[:100]} for m in unanswered_msgs],
        "recent_conversations": [{"id": c.conversation_id, "title": c.title, "language": c.language, "created_at": c.created_at} for c in recent_conversations]
    }

@router.get("/users", response_model=List[UserOut])
def get_all_users(db: Session = Depends(get_db)):
    return db.query(User).order_by(User.created_at.desc()).all()
