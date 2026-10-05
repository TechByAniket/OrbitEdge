import asyncio
import random
from datetime import datetime, timedelta
from app.utils.database import get_supabase_client
from app.orchestrator.analytics_engine import AnalyticsEngine

async def main():
    print("Generating mock historical data for dashboard...")
    supabase = get_supabase_client()
    
    # 1. Get properties and a scenario
    props_res = supabase.table("properties").select("id, is_primary, property_name, property_type").eq("tracking_enabled", True).execute()
    properties = props_res.data
    
    scenario_res = supabase.table("booking_scenarios").select("id").limit(1).execute()
    scenario_id = scenario_res.data[0]["id"]
    
    # Create a completed dummy run
    run_res = supabase.table("tracking_runs").insert({
        "status": "COMPLETED",
        "total_properties": len(properties),
        "successful_properties": len(properties),
        "failed_properties": 0,
        "completed_at": datetime.now().isoformat()
    }).execute()
    run_id = run_res.data[0]["id"]
    
    print(f"Creating historical observations for {len(properties)} properties...")
    
    check_in = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
    check_out = (datetime.now() + timedelta(days=8)).strftime("%Y-%m-%d")
    
    observations = []
    
    for p in properties:
        is_primary = p["is_primary"]
        ptype = p.get("property_type", "Hotel")
        
        # Base price logic
        base_price = 4500 if is_primary else random.randint(2500, 12000)
        if ptype == "Luxury": base_price = random.randint(15000, 25000)
        elif ptype == "Budget": base_price = random.randint(1500, 3000)
        
        # Historical observation (2 days ago)
        old_price = base_price + random.randint(-500, 500)
        old_avail = random.randint(2, 10)
        old_obs = {
            "property_id": p["id"],
            "run_id": run_id,
            "scenario_id": scenario_id,
            "check_in": check_in,
            "check_out": check_out,
            "price": old_price,
            "available_units": old_avail,
            "rating": round(random.uniform(3.8, 4.9), 1),
            "review_count": random.randint(100, 2500),
            "created_at": (datetime.now() - timedelta(days=2)).isoformat()
        }
        
        # Current observation (now)
        new_price = old_price + random.randint(-400, 800)
        # 20% chance of sold out
        new_avail = 0 if random.random() < 0.2 else max(1, old_avail - random.randint(0, 3))
        
        new_obs = {
            "property_id": p["id"],
            "run_id": run_id,
            "scenario_id": scenario_id,
            "check_in": check_in,
            "check_out": check_out,
            "price": new_price,
            "available_units": new_avail,
            "rating": old_obs["rating"],
            "review_count": old_obs["review_count"] + random.randint(0, 5),
            "created_at": datetime.now().isoformat()
        }
        
        observations.extend([old_obs, new_obs])
    
    # Insert observations
    supabase.table("observations").insert(observations).execute()
    print("Observations inserted. Triggering change detection...")
    
    # Run change detection for the "new" observations
    from app.orchestrator.change_detector import ChangeDetector
    cd = ChangeDetector()
    
    # fetch all new obs to get their IDs
    new_obs_db = supabase.table("observations").select("*").order("created_at", desc=True).limit(len(properties)).execute()
    for obs in new_obs_db.data:
        cd.detect_changes(obs, obs["id"])
        
    print("Change detection complete. Running analytics engine...")
    engine = AnalyticsEngine()
    engine.run_analytics_cycle()
    print("All done! Dashboard is now fully populated.")

if __name__ == "__main__":
    asyncio.run(main())
