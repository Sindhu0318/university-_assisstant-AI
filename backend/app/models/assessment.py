import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from backend.app.database import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    code_module = Column(String(50), index=True, nullable=False) # e.g. AAA, BBB, CCC
    code_presentation = Column(String(50), index=True, nullable=False) # e.g. 2013J, 2014B
    id_assessment = Column(Integer, index=True, nullable=False) # e.g. 1752, 1753
    assessment_type = Column(String(20), index=True, nullable=False) # TMA, CMA, Exam
    date = Column(Integer, nullable=True) # relative course day (or None for Exam without set day)
    weight = Column(Float, nullable=False, default=0.0) # weightage percentage
    title = Column(String(255), nullable=True)
    description = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
