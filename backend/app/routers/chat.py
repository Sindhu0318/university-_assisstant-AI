import uuid
import json
import asyncio
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.chat import Conversation, Message, Feedback
from backend.app.schemas.chat import ChatRequest, ChatResponse, ConversationOut, MessageOut, FeedbackCreate
from backend.app.services.rag_engine import run_rag_pipeline
from backend.app.utils.security import get_optional_user, get_current_user

router = APIRouter(prefix="/chat", tags=["AI Chat & Conversational RAG"])

@router.post("", response_model=ChatResponse)
def chat_endpoint(
    req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    user_id = current_user.id if current_user else 1 # Default to demo student if unauthenticated
    
    # 1. Resolve or create Conversation
    conv_id = req.conversation_id or str(uuid.uuid4())
    conv = db.query(Conversation).filter(Conversation.conversation_id == conv_id).first()
    if not conv:
        # Title will be first few words of message
        title_snippet = req.message.strip()[:40] + ("..." if len(req.message) > 40 else "")
        conv = Conversation(
            conversation_id=conv_id,
            user_id=user_id,
            title=title_snippet,
            language=req.language or "en"
        )
        db.add(conv)
        db.commit()

    # 2. Record user message
    user_msg_id = str(uuid.uuid4())
    db.add(Message(
        message_id=user_msg_id,
        conversation_id=conv_id,
        role="user",
        content=req.message,
        language=req.language or "en"
    ))
    db.commit()

    # 3. Execute Hybrid RAG Pipeline
    rag_result = run_rag_pipeline(
        db=db,
        query=req.message,
        preferred_language=req.language,
        uploaded_file_id=req.uploaded_file_id
    )

    # 4. Record assistant message
    asst_msg_id = str(uuid.uuid4())
    db.add(Message(
        message_id=asst_msg_id,
        conversation_id=conv_id,
        role="assistant",
        content=rag_result["answer"],
        language=rag_result["language"],
        sources=rag_result["sources"],
        latency_ms=rag_result["latency_ms"],
        query_intent=rag_result["query_intent"]
    ))
    db.commit()

    return {
        "conversation_id": conv_id,
        "message_id": asst_msg_id,
        "answer": rag_result["answer"],
        "language": rag_result["language"],
        "sources": rag_result["sources"],
        "suggested_followups": rag_result["suggested_followups"],
        "query_intent": rag_result["query_intent"],
        "latency_ms": rag_result["latency_ms"]
    }

@router.post("/stream")
async def chat_stream_endpoint(
    req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    user_id = current_user.id if current_user else 1
    conv_id = req.conversation_id or str(uuid.uuid4())
    
    # Pre-execute RAG pipeline
    rag_result = run_rag_pipeline(
        db=db,
        query=req.message,
        preferred_language=req.language,
        uploaded_file_id=req.uploaded_file_id
    )
    
    # Save conversation and messages
    conv = db.query(Conversation).filter(Conversation.conversation_id == conv_id).first()
    if not conv:
        conv = Conversation(
            conversation_id=conv_id,
            user_id=user_id,
            title=req.message.strip()[:40],
            language=req.language or "en"
        )
        db.add(conv)
        db.commit()

    user_msg_id = str(uuid.uuid4())
    asst_msg_id = str(uuid.uuid4())
    db.add(Message(message_id=user_msg_id, conversation_id=conv_id, role="user", content=req.message, language=req.language or "en"))
    db.add(Message(
        message_id=asst_msg_id,
        conversation_id=conv_id,
        role="assistant",
        content=rag_result["answer"],
        language=rag_result["language"],
        sources=rag_result["sources"],
        latency_ms=rag_result["latency_ms"],
        query_intent=rag_result["query_intent"]
    ))
    db.commit()

    async def event_generator():
        # First send metadata
        metadata_payload = {
            "type": "metadata",
            "conversation_id": conv_id,
            "message_id": asst_msg_id,
            "sources": rag_result["sources"],
            "suggested_followups": rag_result["suggested_followups"],
            "query_intent": rag_result["query_intent"],
            "latency_ms": rag_result["latency_ms"]
        }
        yield f"data: {json.dumps(metadata_payload)}\n\n"

        # Stream words/tokens
        words = rag_result["answer"].split(" ")
        for i, word in enumerate(words):
            chunk_payload = {
                "type": "content",
                "delta": word + (" " if i < len(words) - 1 else "")
            }
            yield f"data: {json.dumps(chunk_payload)}\n\n"
            await asyncio.sleep(0.015)
        
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/history", response_model=List[ConversationOut])
def get_chat_history(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    user_id = current_user.id if current_user else 1
    conversations = db.query(Conversation).filter(Conversation.user_id == user_id).order_by(Conversation.updated_at.desc()).all()
    return conversations

@router.get("/{conversation_id}", response_model=ConversationOut)
def get_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    conv = db.query(Conversation).filter(Conversation.conversation_id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv

@router.delete("/{conversation_id}")
def delete_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    conv = db.query(Conversation).filter(Conversation.conversation_id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    db.delete(conv)
    db.commit()
    return {"message": "Conversation deleted successfully"}

@router.patch("/{conversation_id}")
def rename_conversation(
    conversation_id: str,
    title_data: dict,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    conv = db.query(Conversation).filter(Conversation.conversation_id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    new_title = title_data.get("title")
    if new_title:
        conv.title = new_title.strip()
        db.commit()
    return {"conversation_id": conv.conversation_id, "title": conv.title}

@router.post("/feedback")
def submit_feedback(
    feedback_in: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    user_id = current_user.id if current_user else 1
    msg = db.query(Message).filter(Message.message_id == feedback_in.message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    
    existing_fb = db.query(Feedback).filter(Feedback.message_id == feedback_in.message_id).first()
    if existing_fb:
        existing_fb.is_helpful = feedback_in.is_helpful
        existing_fb.comment = feedback_in.comment
    else:
        fb = Feedback(
            message_id=feedback_in.message_id,
            user_id=user_id,
            is_helpful=feedback_in.is_helpful,
            comment=feedback_in.comment
        )
        db.add(fb)
    db.commit()
    return {"message": "Feedback recorded successfully"}
