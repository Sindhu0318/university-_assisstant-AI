from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.app.models.document import Document, DocumentChunk
from backend.app.services.embedding_service import get_embedding, cosine_similarity

class VectorSearchResult:
    def __init__(
        self,
        chunk_id: int,
        document_id: str,
        document_title: str,
        category: str,
        section_title: Optional[str],
        page_number: Optional[int],
        content: str,
        score: float,
        version: str,
        effective_date: str,
    ):
        self.chunk_id = chunk_id
        self.document_id = document_id
        self.document_title = document_title
        self.category = category
        self.section_title = section_title
        self.page_number = page_number
        self.content = content
        self.score = score
        self.version = version
        self.effective_date = effective_date

def search_similar_chunks(
    db: Session,
    query: str,
    top_k: int = 5,
    category_filter: Optional[str] = None,
    document_id_filter: Optional[str] = None,
    min_score_threshold: float = 0.12
) -> List[VectorSearchResult]:
    """
    Performs cosine similarity vector search over indexed document chunks in the database.
    """
    query_vec = get_embedding(query)
    
    q = db.query(DocumentChunk, Document).join(Document, DocumentChunk.document_id == Document.document_id)
    
    if category_filter:
        q = q.filter(Document.category == category_filter)
    if document_id_filter:
        q = q.filter(Document.document_id == document_id_filter)
        
    results = q.all()
    if not results:
        return []
    
    scored_candidates = []
    for chunk, doc in results:
        if not chunk.embedding:
            continue
        sim = cosine_similarity(query_vec, chunk.embedding)
        if sim >= min_score_threshold:
            scored_candidates.append((
                sim,
                VectorSearchResult(
                    chunk_id=chunk.id,
                    document_id=doc.document_id,
                    document_title=doc.title,
                    category=doc.category,
                    section_title=chunk.section_title or "General",
                    page_number=chunk.page_number or 1,
                    content=chunk.content,
                    score=sim,
                    version=doc.version or "1.0",
                    effective_date=doc.effective_date.strftime("%Y-%m-%d") if doc.effective_date else "Current"
                )
            ))
            
    scored_candidates.sort(key=lambda x: x[0], reverse=True)
    return [item[1] for item in scored_candidates[:top_k]]
