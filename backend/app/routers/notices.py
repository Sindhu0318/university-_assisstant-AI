from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.notice import Notice
from backend.app.schemas.domain import NoticeOut, NoticeCreate

router = APIRouter(prefix="/notices", tags=["University Notices"])

@router.get("", response_model=List[NoticeOut])
def get_notices(
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    limit: int = 50,
    db: Session = Depends(get_db)
):
    q = db.query(Notice).filter(Notice.is_active == True)
    if category and category != "All":
        q = q.filter(Notice.category == category)
    if priority and priority != "All":
        q = q.filter(Notice.priority == priority)
    return q.order_by(Notice.date.desc()).limit(limit).all()

@router.post("", response_model=NoticeOut)
def create_notice(notice_in: NoticeCreate, db: Session = Depends(get_db)):
    new_notice = Notice(
        title=notice_in.title,
        description=notice_in.description,
        category=notice_in.category or "General",
        department=notice_in.department or "All Departments",
        priority=notice_in.priority or "Normal",
        attachment_url=notice_in.attachment_url
    )
    db.add(new_notice)
    db.commit()
    db.refresh(new_notice)
    return new_notice

@router.delete("/{id}")
def delete_notice(id: int, db: Session = Depends(get_db)):
    notice = db.query(Notice).filter(Notice.id == id).first()
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    db.delete(notice)
    db.commit()
    return {"message": "Notice deleted successfully"}
