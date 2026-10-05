from fastapi import APIRouter
from typing import Dict, Any, List
from app.utils.database import get_supabase_client

router = APIRouter()
supabase = get_supabase_client()

@router.get("/dashboard", response_model=Dict[str, Any])
def get_dashboard_summary():
    """
    Get aggregated data for the Overview dashboard.
    """
    # 1. Get Market Metrics
    market_res = supabase.table("market_metrics").select("*").order("calculated_at", desc=True).limit(1).execute()
    market = market_res.data[0] if market_res.data else {}

    # 2. Get Primary Property Metrics
    primary_res = supabase.table("properties").select("id, property_name, price:observations(price)").eq("is_primary", True).order("created_at", foreign_table="observations", desc=True).limit(1).execute()
    primary = primary_res.data[0] if primary_res.data else {}
    
    primary_metrics = {}
    if primary.get("id"):
        pm_res = supabase.table("property_metrics").select("*").eq("property_id", primary["id"]).order("calculated_at", desc=True).limit(1).execute()
        primary_metrics = pm_res.data[0] if pm_res.data else {}
        
    # 3. Get Recent Movements (Change Events)
    changes = supabase.table("change_events").select("*, properties(property_name)").order("detected_at", desc=True).limit(5).execute()
    
    # 4. Get active properties count
    count_res = supabase.table("properties").select("id", count="exact").eq("tracking_enabled", True).execute()
    total_props = count_res.count if hasattr(count_res, 'count') else len(count_res.data)

    return {
        "market": market,
        "primary": {
            "info": primary,
            "metrics": primary_metrics
        },
        "recent_movements": changes.data,
        "total_properties_tracked": total_props
    }

@router.get("/competitors", response_model=List[Dict[str, Any]])
def get_competitors_ranking():
    """
    Get detailed competitor metrics for the Competitors table.
    """
    # Fetch properties and their latest metrics/observations
    props = supabase.table("properties").select("*, property_metrics(*), observations(*)").eq("tracking_enabled", True).execute()
    
    results = []
    for p in props.data:
        metrics = p.get("property_metrics", [])
        obs = p.get("observations", [])
        
        # Sort by latest
        latest_metric = sorted(metrics, key=lambda x: x["calculated_at"], reverse=True)[0] if metrics else {}
        latest_obs = sorted(obs, key=lambda x: x["created_at"], reverse=True)[0] if obs else {}
        
        results.append({
            "id": p["id"],
            "name": p["property_name"],
            "type": p["property_type"],
            "location": p["location"],
            "is_primary": p["is_primary"],
            "price": latest_obs.get("price"),
            "rating": latest_obs.get("rating"),
            "reviews": latest_obs.get("review_count"),
            "availability": "Sold Out" if latest_obs.get("available_units") == 0 else "Available",
            "demand": latest_metric.get("booking_velocity", 0),
            "est_revenue": latest_metric.get("estimated_gross_booking_value", 0),
            "last_updated": latest_obs.get("created_at")
        })
        
    return results
