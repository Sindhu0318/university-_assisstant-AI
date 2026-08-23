from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.assessment import Assessment
from backend.app.schemas.domain import AssessmentOut

router = APIRouter(prefix="/assessments", tags=["Structured Academic Assessments"])

@router.get("", response_model=List[AssessmentOut])
def get_assessments(
    module: Optional[str] = Query(None, description="Module code e.g. AAA, BBB, CCC"),
    presentation: Optional[str] = Query(None, description="Presentation code e.g. 2013J, 2014B"),
    assessment_type: Optional[str] = Query(None, description="Type e.g. TMA, CMA, Exam"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    q = db.query(Assessment)
    if module:
        q = q.filter(Assessment.code_module == module.upper())
    if presentation:
        q = q.filter(Assessment.code_presentation == presentation.upper())
    if assessment_type:
        q = q.filter(Assessment.assessment_type == assessment_type.upper())
    
    return q.order_by(Assessment.code_module, Assessment.code_presentation, Assessment.date).offset(skip).limit(limit).all()

@router.get("/modules", response_model=List[str])
def get_unique_modules(db: Session = Depends(get_db)):
    results = db.query(Assessment.code_module).distinct().all()
    return sorted([r[0] for r in results])

@router.get("/presentations", response_model=List[str])
def get_unique_presentations(db: Session = Depends(get_db)):
    results = db.query(Assessment.code_presentation).distinct().all()
    return sorted([r[0] for r in results])

@router.get("/upcoming", response_model=List[AssessmentOut])
def get_upcoming_assessments(limit: int = 10, db: Session = Depends(get_db)):
    # Non-exam assessments with dates
    return db.query(Assessment).filter(Assessment.date.isnot(None)).order_by(Assessment.date).limit(limit).all()

@router.get("/module/{module_code}", response_model=List[AssessmentOut])
def get_assessments_by_module(module_code: str, db: Session = Depends(get_db)):
    results = db.query(Assessment).filter(Assessment.code_module == module_code.upper()).order_by(Assessment.code_presentation, Assessment.date).all()
    if not results:
        raise HTTPException(status_code=404, detail=f"No assessments found for module '{module_code}'")
    return results

@router.get("/presentation/{presentation_code}", response_model=List[AssessmentOut])
def get_assessments_by_presentation(presentation_code: str, db: Session = Depends(get_db)):
    results = db.query(Assessment).filter(Assessment.code_presentation == presentation_code.upper()).order_by(Assessment.code_module, Assessment.date).all()
    return results

@router.get("/{id}", response_model=AssessmentOut)
def get_assessment_by_id(id: int, db: Session = Depends(get_db)):
    result = db.query(Assessment).filter(Assessment.id == id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return result
