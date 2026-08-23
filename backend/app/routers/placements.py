from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.placement import PlacementDrive
from backend.app.schemas.domain import PlacementOut

router = APIRouter(prefix="/placements", tags=["Placements & Career Training"])

@router.get("", response_model=List[PlacementOut])
def get_placements(
    tier: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    q = db.query(PlacementDrive)
    if tier and tier != "All":
        q = q.filter(PlacementDrive.tier == tier)
    if status and status != "All":
        q = q.filter(PlacementDrive.status == status)
    return q.order_by(PlacementDrive.drive_date).all()
