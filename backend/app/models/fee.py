import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from backend.app.database import Base

class FeeStructure(Base):
    __tablename__ = "fee_structures"

    id = Column(Integer, primary_key=True, index=True)
    program = Column(String(100), nullable=False) # 'B.Tech CSE', 'M.Tech', 'MBA', 'Hostel', 'Transport'
    category = Column(String(50), nullable=False) # 'Tuition', 'Hostel', 'Exam', 'Transport', 'Mess'
    amount = Column(Float, nullable=False)
    frequency = Column(String(50), default="Annual") # 'Annual', 'Per Semester', 'One-time'
    due_date = Column(String(100), nullable=False) # e.g. 'July 15 (Autumn) / Dec 15 (Spring)'
    late_fee_policy = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
