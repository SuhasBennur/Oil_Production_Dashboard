import asyncio
import random
from datetime import datetime
from typing import List, Dict

import pandas as pd
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Oil Production Live Stream")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store (for demo)
historical_data: List[Dict] = []

# Excel file name
EXCEL_FILE = "oil_production_data.xlsx"

# Initialize Excel with headers if not exists
def init_excel():
    try:
        pd.read_excel(EXCEL_FILE)
    except Exception:
        df_init = pd.DataFrame(columns=["timestamp", "well_id", "flow_rate", "pressure", "temperature"])
        df_init.to_excel(EXCEL_FILE, index=False)

init_excel()

def append_to_excel(row: Dict):
    df = pd.DataFrame([row])
    # Append without headers
    with pd.ExcelWriter(EXCEL_FILE, mode="a", if_sheet_exists="overlay", engine="openpyxl") as writer:
        sheet = writer.sheets.get("Sheet1")
        start_row = sheet.max_row if sheet else 0
        df.to_excel(writer, index=False, header=False, startrow=start_row)

@app.get("/api/history")
def get_history(limit: int = 1000, well_id: str | None = None):
    data = historical_data if well_id is None else [d for d in historical_data if d["well_id"] == well_id]
    return data[-limit:]

@app.get("/api/analytics")
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

@app.websocket("/ws/oil")
async def oil_stream(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            data_point = {
                "timestamp": datetime.utcnow().isoformat(),
                "well_id": f"WELL-{random.randint(1, 5)}",
                "flow_rate": round(random.uniform(800, 1200), 2),
                "pressure": round(random.uniform(1800, 2200), 2),
                "temperature": round(random.uniform(60, 90), 2),
            }
            historical_data.append(data_point)
            append_to_excel(data_point)
            await ws.send_json(data_point)
            await asyncio.sleep(1)  # 1-second cadence
    except Exception:
        await ws.close()