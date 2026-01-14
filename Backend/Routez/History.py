from fastapi import APIRouter
from Core.Data_Store import historical_data

router = APIRouter()

@router.get("/api/history")
def get_history(limit: int = 1000, well_id: str | None = None):
    data = historical_data if well_id is None else [d for d in historical_data if d["well_id"] == well_id]
    return data[-limit:]