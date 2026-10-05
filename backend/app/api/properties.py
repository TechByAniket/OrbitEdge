from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from uuid import UUID
from app.utils.database import get_supabase_client
from app.schemas.property import PropertyResponse, PropertyCreate, PropertyUpdate

router = APIRouter()

@router.get("/", response_model=List[PropertyResponse])
def list_properties(
    is_primary: Optional[bool] = None,
    tracking_enabled: Optional[bool] = None,
    search: Optional[str] = None
):
    supabase = get_supabase_client()
    query = supabase.table("properties").select("*").order("is_primary", desc=True)
    
    if is_primary is not None:
        query = query.eq("is_primary", is_primary)
    
    if tracking_enabled is not None:
        query = query.eq("tracking_enabled", tracking_enabled)
        
    if search:
        query = query.ilike("property_name", f"%{search}%")
        
    res = query.execute()
    return res.data

@router.get("/primary", response_model=PropertyResponse)
def get_primary_property():
    supabase = get_supabase_client()
    res = supabase.table("properties").select("*").eq("is_primary", True).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Primary property not found")
    return res.data[0]

@router.get("/competitors", response_model=List[PropertyResponse])
def get_competitors(tracking_enabled: Optional[bool] = None):
    supabase = get_supabase_client()
    query = supabase.table("properties").select("*").eq("is_primary", False)
    if tracking_enabled is not None:
        query = query.eq("tracking_enabled", tracking_enabled)
    res = query.execute()
    return res.data

@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(property_id: UUID):
    supabase = get_supabase_client()
    res = supabase.table("properties").select("*").eq("id", str(property_id)).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Property not found")
    return res.data[0]

@router.patch("/{property_id}/tracking", response_model=PropertyResponse)
def toggle_tracking(property_id: UUID, enabled: bool):
    supabase = get_supabase_client()
    res = supabase.table("properties").update({"tracking_enabled": enabled}).eq("id", str(property_id)).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Property not found")
    return res.data[0]
