from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.fee import FeeStructure
from backend.app.schemas.domain import FeeOut

router = APIRouter(prefix="/fees", tags=["University Fee Structure"])

@router.get("", response_model=List[FeeOut])
def get_fees(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    q = db.query(FeeStructure)
    if category and category != "All":
        q = q.filter(FeeStructure.category == category)
    return q.all()
