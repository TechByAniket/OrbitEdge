from fastapi import APIRouter, HTTPException
from typing import List, Optional
from uuid import UUID
from app.utils.database import get_supabase_client
from app.schemas.scenario import ScenarioResponse, ScenarioCreate, ScenarioUpdate

router = APIRouter()

@router.get("/", response_model=List[ScenarioResponse])
def list_scenarios(is_active: Optional[bool] = None):
    supabase = get_supabase_client()
    query = supabase.table("booking_scenarios").select("*").order("created_at")
    
    if is_active is not None:
        query = query.eq("is_active", is_active)
        
    res = query.execute()
    return res.data

@router.post("/", response_model=ScenarioResponse)
def create_scenario(scenario: ScenarioCreate):
    supabase = get_supabase_client()
    res = supabase.table("booking_scenarios").insert(scenario.model_dump()).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to create scenario")
    return res.data[0]

@router.patch("/{scenario_id}", response_model=ScenarioResponse)
def update_scenario(scenario_id: UUID, scenario: ScenarioUpdate):
    supabase = get_supabase_client()
    update_data = scenario.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided to update")
        
    res = supabase.table("booking_scenarios").update(update_data).eq("id", str(scenario_id)).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return res.data[0]

@router.patch("/{scenario_id}/active", response_model=ScenarioResponse)
def toggle_scenario_active(scenario_id: UUID, is_active: bool):
    supabase = get_supabase_client()
    res = supabase.table("booking_scenarios").update({"is_active": is_active}).eq("id", str(scenario_id)).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return res.data[0]
