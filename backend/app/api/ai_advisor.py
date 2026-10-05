from fastapi import APIRouter
from typing import Dict, Any, List
from app.utils.database import get_supabase_client
from datetime import datetime

router = APIRouter()
supabase = get_supabase_client()

@router.get("/insights", response_model=List[Dict[str, Any]])
def get_ai_insights():
    """
    Generate dynamic AI-style insights based on current market conditions.
    """
    market_res = supabase.table("market_metrics").select("*").order("calculated_at", desc=True).limit(1).execute()
    primary_res = supabase.table("properties").select("id").eq("is_primary", True).limit(1).execute()
    
    market = market_res.data[0] if market_res.data else {}
    primary_id = primary_res.data[0]["id"] if primary_res.data else None
    
    pm_res = supabase.table("property_metrics").select("*").eq("property_id", primary_id).order("calculated_at", desc=True).limit(1).execute() if primary_id else None
    primary_metrics = pm_res.data[0] if pm_res and pm_res.data else {}

    insights = []
    
    # Logic to generate insights
    demand_score = market.get("market_demand_score", 0)
    avg_price = market.get("avg_market_price", 0)
    primary_price = primary_metrics.get("avg_observed_price", 0)
    
    if demand_score > 75:
        insights.append({
            "id": "1",
            "type": "opportunity",
            "title": "High Market Compression Detected",
            "content": f"Market demand is surging (Score: {demand_score:.0f}/100). Competitors are selling out rapidly. You can safely push rates by 10-15% for the upcoming weekend.",
            "impact": "High",
            "timestamp": datetime.now().isoformat()
        })
    else:
        insights.append({
            "id": "1",
            "type": "warning",
            "title": "Soft Market Demand",
            "content": f"Market demand is relatively soft (Score: {demand_score:.0f}/100). Consider launching a targeted flash sale to build base occupancy before adjusting rates.",
            "impact": "Medium",
            "timestamp": datetime.now().isoformat()
        })
        
    if primary_price < avg_price * 0.9:
        insights.append({
            "id": "2",
            "type": "opportunity",
            "title": "Rate Parity Opportunity",
            "content": "Your current rate is significantly below the market average. You are leaving money on the table. Recommend immediate rate correction to align with market medians.",
            "impact": "High",
            "timestamp": datetime.now().isoformat()
        })
    elif primary_price > avg_price * 1.2:
        insights.append({
            "id": "2",
            "type": "warning",
            "title": "Price Resistance Risk",
            "content": "Your rates are positioned 20%+ above the market average. Unless you have a strong value proposition or low remaining inventory, you risk booking pace dropping.",
            "impact": "Medium",
            "timestamp": datetime.now().isoformat()
        })
        
    insights.append({
        "id": "3",
        "type": "insight",
        "title": "Booking Velocity Trend",
        "content": "Competitors in the 'Luxury' and 'Resort' categories are seeing faster pick-up than 'Budget' hotels. The market is trending towards premium stays for the next 14 days.",
        "impact": "Low",
        "timestamp": datetime.now().isoformat()
    })
    
    return insights
