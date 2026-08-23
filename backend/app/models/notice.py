import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from backend.app.database import Base

class Notice(Base):
    __tablename__ = "notices"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), default="General", index=True) # 'Academic', 'Examinations', 'Fees', 'Placements', 'Scholarships'
    department = Column(String(100), default="All Departments")
    priority = Column(String(20), default="Normal") # 'High', 'Urgent', 'Normal'
    date = Column(DateTime, default=datetime.datetime.utcnow)
    effective_date = Column(DateTime, default=datetime.datetime.utcnow)
    expiry_date = Column(DateTime, nullable=True)
    attachment_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
