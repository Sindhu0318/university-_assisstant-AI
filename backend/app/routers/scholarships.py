from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.scholarship import Scholarship
from backend.app.schemas.domain import ScholarshipOut

router = APIRouter(prefix="/scholarships", tags=["Scholarships & Financial Aid"])

@router.get("", response_model=List[ScholarshipOut])
def get_scholarships(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    q = db.query(Scholarship).filter(Scholarship.is_active == True)
    if category and category != "All":
        q = q.filter(Scholarship.category == category)
    return q.all()

@router.post("/match")
def match_scholarships(
    criteria: dict,
    db: Session = Depends(get_db)
):
    """
    Interactive scholarship assistant logic: Matches student's CGPA, income, and category.
    """
    cgpa = criteria.get("cgpa", 0.0)
    income = criteria.get("annual_income", 10000000.0)
    sports_winner = criteria.get("is_sports_winner", False)

    all_schol = db.query(Scholarship).filter(Scholarship.is_active == True).all()
    matched = []

    for s in all_schol:
        eligible = True
        reasons = []

        if s.min_cgpa and cgpa < s.min_cgpa:
            eligible = False
            reasons.append(f"Requires minimum CGPA of {s.min_cgpa} (Your CGPA: {cgpa})")

        if s.income_limit and income > s.income_limit:
            eligible = False
            reasons.append(f"Requires family income below Rs. {s.income_limit:,.0f} (Provided: Rs. {income:,.0f})")

        if s.category == "Sports" and not sports_winner:
            eligible = False
            reasons.append("Requires state/national sports achievement")

        matched.append({
            "scholarship": s,
            "is_eligible": eligible,
            "reasons": reasons
        })

    return matched
