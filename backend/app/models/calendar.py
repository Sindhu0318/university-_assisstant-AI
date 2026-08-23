import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from backend.app.database import Base

class AcademicCalendar(Base):
    __tablename__ = "academic_calendar"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    event_type = Column(String(50), nullable=False) # 'Examination', 'Classes', 'Holiday', 'Registration', 'Results'
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    semester = Column(String(50), default="All") # 'Odd Semester', 'Even Semester', 'All'
    description = Column(Text, nullable=True)
    is_holiday = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
