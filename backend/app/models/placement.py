import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from backend.app.database import Base

class PlacementDrive(Base):
    __tablename__ = "placement_drives"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), nullable=False)
    tier = Column(String(50), nullable=False) # 'Tier 1 (Super Dream)', 'Tier 2 (Dream)', 'Tier 3 (Core/IT)'
    roles = Column(String(255), nullable=False) # 'Software Development Engineer', 'Data Scientist'
    ctc_lpa = Column(Float, nullable=False) # e.g. 24.5 LPA
    min_cgpa = Column(Float, default=6.0)
    max_backlogs = Column(Integer, default=0)
    eligible_branches = Column(String(255), default="CSE, ECE, IT, EEE, MECH, CIVIL")
    drive_date = Column(DateTime, nullable=True)
    registration_deadline = Column(DateTime, nullable=True)
    status = Column(String(50), default="Upcoming") # 'Upcoming', 'Ongoing', 'Completed'
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
