from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Any

from app.utils.database import get_supabase_client
from app.orchestrator.tracker import TrackerOrchestrator

router = APIRouter()
supabase = get_supabase_client()
orchestrator = TrackerOrchestrator()

class TrackingRunResponse(BaseModel):
    id: str
    status: str
    total_properties: int
    successful_properties: int
    failed_properties: int
    created_at: str
    completed_at: str | None

@router.post("/start", response_model=Dict[str, str])
async def start_tracking_run(background_tasks: BackgroundTasks):
    """
    Start a manual tracking run in the background.
    """
    # Check if a run is already in progress
    active_runs = supabase.table("tracking_runs").select("*").eq("status", "RUNNING").execute()
    if active_runs.data:
        raise HTTPException(status_code=400, detail="A tracking run is already in progress")

    background_tasks.add_task(orchestrator.run_tracking_cycle)
    return {"status": "accepted", "message": "Tracking run started in background"}

@router.get("/status", response_model=List[TrackingRunResponse])
def get_tracking_runs(limit: int = 10):
    """
    Get history of tracking runs.
    """
    runs = supabase.table("tracking_runs").select("*").order("created_at", desc=True).limit(limit).execute()
    return runs.data

@router.get("/{run_id}/results", response_model=List[Dict[str, Any]])
def get_run_results(run_id: str):
    """
    Get detailed results (observations) for a specific run.
    """
    observations = supabase.table("observations").select("*, properties(property_name), booking_scenarios(scenario_name)").eq("run_id", run_id).execute()
    return observations.data
