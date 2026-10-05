from fastapi import APIRouter
from typing import List, Dict, Any
from app.utils.database import get_supabase_client

router = APIRouter()
supabase = get_supabase_client()

@router.get("/", response_model=List[Dict[str, Any]])
def get_alerts(limit: int = 20, unread_only: bool = False):
    """
    Get the latest alerts.
    """
    query = supabase.table("alerts").select("*, properties(property_name)").order("created_at", desc=True).limit(limit)
    if unread_only:
        query = query.eq("is_read", False)
    return query.execute().data

@router.post("/{alert_id}/read")
def mark_alert_read(alert_id: str):
    """
    Mark an alert as read.
    """
    res = supabase.table("alerts").update({"is_read": True}).eq("id", alert_id).execute()
    return {"status": "success" if res.data else "error"}

@router.get("/changes", response_model=List[Dict[str, Any]])
def get_changes(limit: int = 50):
    """
    Get the latest change events across all properties.
    """
    query = supabase.table("change_events").select("*, properties(property_name)").order("detected_at", desc=True).limit(limit)
    return query.execute().data
