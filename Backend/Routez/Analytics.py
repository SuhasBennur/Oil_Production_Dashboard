from fastapi import APIRouter
from Core.Data_Store import historical_data

router = APIRouter()

@router.get("/api/analytics")
def get_analytics():
    if not historical_data:
        return {"max_flow": 0, "avg_pressure": 0, "avg_temperature": 0, "by_well": {}}

    max_flow = max(d["flow_rate"] for d in historical_data)
    avg_pressure = sum(d["pressure"] for d in historical_data) / len(historical_data)
    avg_temperature = sum(d["temperature"] for d in historical_data) / len(historical_data)

    by_well = {}
    for d in historical_data:
        by_well[d["well_id"]] = by_well.get(d["well_id"], 0) + d["flow_rate"]

    return {
        "max_flow": max_flow,
        "avg_pressure": round(avg_pressure, 2),
        "avg_temperature": round(avg_temperature, 2),
        "by_well": by_well,
    }