import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean
from backend.app.database import Base

class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), default="Merit") # 'Merit', 'Need-Based', 'Sports', 'Government'
    eligibility = Column(Text, nullable=False)
    income_limit = Column(Float, nullable=True) # in INR (e.g. 300000)
    min_cgpa = Column(Float, nullable=True) # e.g. 8.5
    award_amount = Column(String(100), nullable=False) # e.g. '50% Tuition Fee Waiver'
    deadline = Column(String(100), nullable=False) # e.g. 'September 15, 2026'
    application_url = Column(String(255), nullable=True)
    required_documents = Column(Text, nullable=True)
    contact_person = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
