import os
import json
import logging
from fastapi import APIRouter
from typing import Dict, Any, List
from app.utils.database import get_supabase_client
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)
router = APIRouter()
supabase = get_supabase_client()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

@router.get("/insights", response_model=List[Dict[str, Any]])
def get_ai_insights():
    """
    Generate dynamic AI-style insights based on current market conditions.
    Uses Gemini LLM if GEMINI_API_KEY is configured.
    """
    market_res = supabase.table("market_metrics").select("*").order("calculated_at", desc=True).limit(1).execute()
    primary_res = supabase.table("properties").select("id, property_name").eq("is_primary", True).limit(1).execute()
    
    market = market_res.data[0] if market_res.data else {}
    primary_id = primary_res.data[0]["id"] if primary_res.data else None
    
    pm_res = supabase.table("property_metrics").select("*").eq("property_id", primary_id).order("calculated_at", desc=True).limit(1).execute() if primary_id else None
    primary_metrics = pm_res.data[0] if pm_res and pm_res.data else {}

    # Extract core context variables
    demand_score = market.get("market_demand_score", 0)
    avg_price = market.get("avg_market_price", 0)
    primary_price = primary_metrics.get("avg_observed_price", 0)
    
    # 1. Use Gemini LLM if available
    if api_key:
        try:
            model = genai.GenerativeModel('gemini-3.5-flash-lite')
            prompt = f"""
            You are an expert Hotel Revenue Management AI. Analyze the following live market data and provide exactly 3 actionable insights in JSON format.
            Data:
            - Market Demand Score: {demand_score}/100
            - Market Average Price: Rs. {avg_price}
            - Our Hotel Price: Rs. {primary_price}
            
            Return ONLY a valid JSON array of objects. Each object must have:
            - id (string, e.g. "1")
            - type (string: "opportunity", "warning", or "insight")
            - title (string: short punchy title)
            - content (string: 2 sentences explaining the situation and recommendation)
            - impact (string: "High", "Medium", or "Low")
            - timestamp (string: ISO format)
            """
            
            response = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(response_mime_type="application/json")
            )
            raw_text = response.text.strip()
            
            insights = json.loads(raw_text)
            return insights
            
        except Exception as e:
            logger.error(f"Gemini API failed: {e}. Falling back to rule-based insights.")

    # 2. Fallback to static logic if LLM fails or no key
    insights = []
    
    if demand_score > 75:
        insights.append({
            "id": "1",
            "type": "opportunity",
            "title": "High Market Compression Detected",
            "content": f"Market demand is surging (Score: {demand_score:.0f}/100). Competitors are selling out rapidly. You can safely push rates by 10-15%.",
            "impact": "High",
            "timestamp": datetime.now().isoformat()
        })
    else:
        insights.append({
            "id": "1",
            "type": "warning",
            "title": "Soft Market Demand",
            "content": f"Market demand is relatively soft (Score: {demand_score:.0f}/100). Consider launching a targeted flash sale.",
            "impact": "Medium",
            "timestamp": datetime.now().isoformat()
        })
        
    if primary_price < avg_price * 0.9:
        insights.append({
            "id": "2",
            "type": "opportunity",
            "title": "Rate Parity Opportunity",
            "content": "Your current rate is significantly below the market average. Recommend immediate rate correction.",
            "impact": "High",
            "timestamp": datetime.now().isoformat()
        })
    elif primary_price > avg_price * 1.2:
        insights.append({
            "id": "2",
            "type": "warning",
            "title": "Price Resistance Risk",
            "content": "Your rates are positioned 20%+ above the market average. You risk booking pace dropping.",
            "impact": "Medium",
            "timestamp": datetime.now().isoformat()
        })
        
    insights.append({
        "id": "3",
        "type": "insight",
        "title": "Booking Velocity Trend",
        "content": "The market is trending towards premium stays for the next 14 days.",
        "impact": "Low",
        "timestamp": datetime.now().isoformat()
    })
    
    return insights
