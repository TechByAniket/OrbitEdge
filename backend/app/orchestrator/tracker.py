import logging
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.utils.database import get_supabase_client
from app.collectors.makemytrip.collector import MakeMyTripCollector
from app.collectors.makemytrip.normalizer import normalize_property_data

logger = logging.getLogger(__name__)

class TrackerOrchestrator:
    def __init__(self):
        self.supabase = get_supabase_client()
        self.collector = MakeMyTripCollector(headless=True)
        
    def _calculate_dates(self, date_type: str, stay_duration: int):
        """Helper to get checkin and checkout based on date_type"""
        today = datetime.now()
        # Basic logic: near = next week, future = next month
        
        days_ahead = 7 if "near" in (date_type or "").lower() else 30
        base_date = today + timedelta(days=days_ahead)
        
        if "weekend" in (date_type or "").lower():
            # Shift to next Saturday
            days_to_saturday = (5 - base_date.weekday()) % 7
            base_date += timedelta(days=days_to_saturday)
        else:
            # Shift to next Tuesday
            days_to_tuesday = (1 - base_date.weekday()) % 7
            base_date += timedelta(days=days_to_tuesday)
            
        checkin = base_date
        checkout = checkin + timedelta(days=stay_duration)
        return checkin, checkout

    async def _process_item(self, run_id: str, item: Dict[str, Any], property_data: Dict[str, Any], scenario_data: Dict[str, Any]):
        """Process a single property+scenario combination."""
        try:
            # Mark item as running
            self.supabase.table("tracking_run_items").update({"status": "RUNNING"}).eq("id", item["id"]).execute()
            
            checkin, checkout = self._calculate_dates(scenario_data.get("date_type", ""), scenario_data.get("stay_duration", 1))
            
            base_url = property_data.get("mmt_url")
            if not base_url:
                raise ValueError("Property missing mmt_url")
                
            # TODO: Append specific query parameters to URL for dates/guests
            raw_data = await self.collector.collect_property_data(base_url)
            
            if raw_data.get("status") != "success":
                raise Exception(raw_data.get("error", "Unknown collector error"))
                
            normalized = normalize_property_data(raw_data)
            
            # Save Observation
            observation = {
                "property_id": property_data["id"],
                "run_id": run_id,
                "scenario_id": scenario_data["id"],
                "check_in": checkin.strftime("%Y-%m-%d"),
                "check_out": checkout.strftime("%Y-%m-%d"),
                "stay_duration": scenario_data.get("stay_duration"),
                "guests": scenario_data.get("guests"),
                "rooms_requested": scenario_data.get("rooms"),
                "price": next((r["price"] for r in normalized.get("rooms", []) if r.get("price")), None),
                "rating": normalized.get("rating"),
                "review_count": normalized.get("review_count"),
                "source_url": base_url,
                "raw_payload": raw_data
            }
            
            self.supabase.table("observations").insert(observation).execute()
            
            # Mark item complete
            self.supabase.table("tracking_run_items").update({
                "status": "COMPLETED",
                "completed_at": datetime.now().isoformat()
            }).eq("id", item["id"]).execute()
            
            return True
        except Exception as e:
            logger.error(f"Error processing item {item['id']}: {e}")
            self.supabase.table("tracking_run_items").update({
                "status": "FAILED",
                "error_message": str(e),
                "completed_at": datetime.now().isoformat()
            }).eq("id", item["id"]).execute()
            return False

    async def run_tracking_cycle(self):
        """Main loop to process all active scenarios for all tracked properties."""
        logger.info("Starting tracking cycle...")
        
        # 1. Fetch data
        props_res = self.supabase.table("properties").select("*").eq("tracking_enabled", True).execute()
        scenarios_res = self.supabase.table("booking_scenarios").select("*").eq("is_active", True).execute()
        
        properties = props_res.data
        scenarios = scenarios_res.data
        
        if not properties or not scenarios:
            logger.info("No active properties or scenarios. Aborting.")
            return

        total_combinations = len(properties) * len(scenarios)
        
        # 2. Create Run
        run_res = self.supabase.table("tracking_runs").insert({
            "status": "RUNNING",
            "total_properties": total_combinations
        }).execute()
        run_id = run_res.data[0]["id"]
        
        # 3. Create Run Items
        items_to_insert = []
        for p in properties:
            for s in scenarios:
                items_to_insert.append({
                    "run_id": run_id,
                    "property_id": p["id"],
                    "scenario_id": s["id"],
                    "status": "PENDING"
                })
                
        # Batch insert items
        items_res = self.supabase.table("tracking_run_items").insert(items_to_insert).execute()
        items = items_res.data
        
        # 4. Process Loop
        await self.collector.initialize()
        
        success_count = 0
        failed_count = 0
        
        try:
            for i, item in enumerate(items):
                p = next(p for p in properties if p["id"] == item["property_id"])
                s = next(s for s in scenarios if s["id"] == item["scenario_id"])
                
                logger.info(f"Processing {i+1}/{total_combinations}: {p['property_name']} - {s['scenario_name']}")
                success = await self._process_item(run_id, item, p, s)
                if success:
                    success_count += 1
                else:
                    failed_count += 1
                    
        finally:
            await self.collector.close()
            
            # 5. Finalize Run
            status = "COMPLETED" if failed_count == 0 else ("FAILED" if success_count == 0 else "PARTIAL")
            self.supabase.table("tracking_runs").update({
                "status": status,
                "successful_properties": success_count,
                "failed_properties": failed_count,
                "completed_at": datetime.now().isoformat()
            }).eq("id", run_id).execute()
            
            logger.info(f"Tracking cycle finished. Status: {status}")
