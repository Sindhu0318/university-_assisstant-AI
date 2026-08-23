from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.calendar import AcademicCalendar
from backend.app.schemas.domain import CalendarOut

router = APIRouter(prefix="/calendar", tags=["Academic Calendar"])

@router.get("", response_model=List[CalendarOut])
def get_calendar_events(
    event_type: Optional[str] = Query(None),
    semester: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    q = db.query(AcademicCalendar)
    if event_type and event_type != "All":
        q = q.filter(AcademicCalendar.event_type == event_type)
    if semester and semester != "All":
        q = q.filter(AcademicCalendar.semester == semester)
    return q.order_by(AcademicCalendar.start_date).all()
