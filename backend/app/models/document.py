import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from backend.app.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(String(100), unique=True, index=True, nullable=False) # e.g. DOC-ACAD-2026-01
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, default="Academic Regulations")
    department = Column(String(100), default="All")
    document_type = Column(String(50), default="PDF") # 'PDF', 'DOCX', 'TXT', 'IMAGE', 'MD'
    file_path = Column(String(500), nullable=False)
    file_size_bytes = Column(Integer, default=0)
    version = Column(String(20), default="1.0")
    effective_date = Column(DateTime, default=datetime.datetime.utcnow)
    expiry_date = Column(DateTime, nullable=True)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(50), default="indexed") # 'pending', 'processing', 'indexed', 'failed'
    chunk_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    uploader = relationship("User", back_populates="documents")
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(String(100), ForeignKey("documents.document_id"), nullable=False, index=True)
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    section_title = Column(String(255), nullable=True)
    page_number = Column(Integer, nullable=True)
    token_count = Column(Integer, default=0)
    meta_info = Column(JSON, nullable=True)
    # Storing embedding array as JSON for universal SQL (SQLite & Postgres compatible)
    embedding = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    document = relationship("Document", back_populates="chunks")
