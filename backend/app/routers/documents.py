import os
import uuid
import aiofiles
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.config import settings
from backend.app.models.user import User
from backend.app.models.document import Document, DocumentChunk
from backend.app.schemas.domain import DocumentOut
from backend.app.services.ingestion_service import extract_text_from_file, split_text_into_chunks
from backend.app.services.embedding_service import get_embedding
from backend.app.utils.security import get_optional_user

router = APIRouter(prefix="/documents", tags=["Knowledge Base & Document Ingestion"])

@router.get("", response_model=List[DocumentOut])
def get_documents(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(Document)
    if category:
        q = q.filter(Document.category == category)
    return q.order_by(Document.created_at.desc()).all()

@router.post("/upload", response_model=DocumentOut)
async def upload_document(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    category: Optional[str] = Form("Academic Regulations"),
    department: Optional[str] = Form("All"),
    version: Optional[str] = Form("1.0"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    doc_id = f"DOC-{uuid.uuid4().hex[:8].upper()}"
    file_ext = os.path.splitext(file.filename)[1].lower()
    save_filename = f"{doc_id}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, save_filename)
    
    # Save file to disk
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
        file_size = len(content)

    doc_title = title or os.path.splitext(file.filename)[0].replace("_", " ").title()
    doc_type = file_ext.replace(".", "").upper() if file_ext else "TXT"

    # Create document record
    new_doc = Document(
        document_id=doc_id,
        title=doc_title,
        category=category or "General",
        department=department or "All",
        document_type=doc_type,
        file_path=file_path,
        file_size_bytes=file_size,
        version=version or "1.0",
        uploaded_by=current_user.id if current_user else None,
        status="processing"
    )
    db.add(new_doc)
    db.commit()

    # Ingestion pipeline: Text extraction -> Chunking -> Embedding -> Storage
    try:
        pages = extract_text_from_file(file_path)
        chunks_to_insert = []
        chunk_idx = 0
        
        for p in pages:
            split_chunks = split_text_into_chunks(p["text"], chunk_size=500, chunk_overlap=80)
            for sc in split_chunks:
                emb = get_embedding(sc["content"])
                chunk_obj = DocumentChunk(
                    document_id=doc_id,
                    chunk_index=chunk_idx,
                    content=sc["content"],
                    section_title=sc.get("section", "General"),
                    page_number=p.get("page", 1),
                    token_count=len(sc["content"].split()),
                    embedding=emb
                )
                chunks_to_insert.append(chunk_obj)
                chunk_idx += 1

        if chunks_to_insert:
            db.bulk_save_objects(chunks_to_insert)
            new_doc.chunk_count = len(chunks_to_insert)
            new_doc.status = "indexed"
        else:
            new_doc.status = "indexed" # empty doc
            
        db.commit()
        db.refresh(new_doc)
        return new_doc
    except Exception as e:
        new_doc.status = "failed"
        db.commit()
        raise HTTPException(status_code=500, detail=f"Ingestion pipeline failed: {str(e)}")

@router.get("/{doc_id}", response_model=DocumentOut)
def get_document_detail(doc_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.document_id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.delete("/{doc_id}")
def delete_document(doc_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.document_id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Remove file if exists
    if os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception:
            pass

    db.delete(doc)
    db.commit()
    return {"message": f"Document {doc_id} deleted successfully"}

@router.post("/{doc_id}/reindex")
def reindex_document(doc_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.document_id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Delete existing chunks
    db.query(DocumentChunk).filter(DocumentChunk.document_id == doc_id).delete()
    
    if os.path.exists(doc.file_path):
        pages = extract_text_from_file(doc.file_path)
        chunks_to_insert = []
        chunk_idx = 0
        for p in pages:
            split_chunks = split_text_into_chunks(p["text"], chunk_size=500, chunk_overlap=80)
            for sc in split_chunks:
                emb = get_embedding(sc["content"])
                chunk_obj = DocumentChunk(
                    document_id=doc_id,
                    chunk_index=chunk_idx,
                    content=sc["content"],
                    section_title=sc.get("section", "General"),
                    page_number=p.get("page", 1),
                    token_count=len(sc["content"].split()),
                    embedding=emb
                )
                chunks_to_insert.append(chunk_obj)
                chunk_idx += 1

        db.bulk_save_objects(chunks_to_insert)
        doc.chunk_count = len(chunks_to_insert)
        doc.status = "indexed"
        db.commit()
        
    return {"message": f"Document {doc_id} reindexed successfully", "chunk_count": doc.chunk_count}
