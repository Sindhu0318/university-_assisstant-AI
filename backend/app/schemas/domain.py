from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AssessmentOut(BaseModel):
    id: int
    code_module: str
    code_presentation: str
    id_assessment: int
    assessment_type: str
    date: Optional[int] = None
    weight: float
    title: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True

class AssessmentCreate(BaseModel):
    code_module: str
    code_presentation: str
    id_assessment: int
    assessment_type: str
    date: Optional[int] = None
    weight: float
    title: Optional[str] = None
    description: Optional[str] = None

class NoticeOut(BaseModel):
    id: int
    title: str
    description: str
    category: str
    department: str
    priority: str
    date: datetime
    effective_date: datetime
    expiry_date: Optional[datetime] = None
    attachment_url: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True

class NoticeCreate(BaseModel):
    title: str
    description: str
    category: Optional[str] = "General"
    department: Optional[str] = "All Departments"
    priority: Optional[str] = "Normal"
    attachment_url: Optional[str] = None

class ScholarshipOut(BaseModel):
    id: int
    name: str
    category: str
    eligibility: str
    income_limit: Optional[float] = None
    min_cgpa: Optional[float] = None
    award_amount: str
    deadline: str
    application_url: Optional[str] = None
    required_documents: Optional[str] = None
    contact_person: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True

class CalendarOut(BaseModel):
    id: int
    title: str
    event_type: str
    start_date: datetime
    end_date: Optional[datetime] = None
    semester: str
    description: Optional[str] = None
    is_holiday: bool

    class Config:
        from_attributes = True

class FeeOut(BaseModel):
    id: int
    program: str
    category: str
    amount: float
    frequency: str
    due_date: str
    late_fee_policy: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True

class PlacementOut(BaseModel):
    id: int
    company_name: str
    tier: str
    roles: str
    ctc_lpa: float
    min_cgpa: float
    max_backlogs: int
    eligible_branches: str
    drive_date: Optional[datetime] = None
    registration_deadline: Optional[datetime] = None
    status: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class DocumentChunkOut(BaseModel):
    id: int
    chunk_index: int
    content: str
    section_title: Optional[str] = None
    page_number: Optional[int] = None
    token_count: int

    class Config:
        from_attributes = True

class DocumentOut(BaseModel):
    id: int
    document_id: str
    title: str
    category: str
    department: str
    document_type: str
    file_path: str
    file_size_bytes: int
    version: str
    effective_date: datetime
    status: str
    chunk_count: int
    created_at: datetime
    chunks: Optional[List[DocumentChunkOut]] = None

    class Config:
        from_attributes = True
