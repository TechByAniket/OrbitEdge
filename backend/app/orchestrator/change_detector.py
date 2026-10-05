import logging
from typing import Dict, Any, List
from datetime import datetime
from app.utils.database import get_supabase_client

logger = logging.getLogger(__name__)

class ChangeDetector:
    def __init__(self):
        self.supabase = get_supabase_client()

    def detect_changes(self, new_obs: Dict[str, Any], new_obs_id: str) -> List[Dict[str, Any]]:
        """
        Compare the new observation against the previous observation for the same property and scenario.
        Creates change events and alerts if meaningful changes are found.
        """
        property_id = new_obs["property_id"]
        scenario_id = new_obs["scenario_id"]
        check_in = new_obs["check_in"]

        # Fetch the immediately previous observation
        res = self.supabase.table("observations")\
            .select("*")\
            .eq("property_id", property_id)\
            .eq("scenario_id", scenario_id)\
            .eq("check_in", check_in)\
            .neq("id", new_obs_id)\
            .order("created_at", desc=True)\
            .limit(1)\
            .execute()
            
        if not res.data:
            logger.info(f"No previous observation found for property {property_id} scenario {scenario_id}. Skipping change detection.")
            return []

        prev_obs = res.data[0]
        change_events = []
        alerts = []

        # 1. Price Change
        new_price = new_obs.get("price")
        old_price = prev_obs.get("price")
        
        if new_price is not None and old_price is not None and new_price != old_price:
            abs_change = float(new_price) - float(old_price)
            pct_change = (abs_change / float(old_price)) * 100 if float(old_price) > 0 else 0
            
            event_type = "PRICE_INCREASE" if abs_change > 0 else "PRICE_DECREASE"
            severity = "warning" if abs_change > 0 else "positive"
            
            # Create event
            event = {
                "property_id": property_id,
                "observation_id": new_obs_id,
                "previous_observation_id": prev_obs["id"],
                "event_type": event_type,
                "old_value": str(old_price),
                "new_value": str(new_price),
                "absolute_change": abs_change,
                "percentage_change": pct_change,
                "severity": severity
            }
            change_events.append(event)
            
            # Create alert
            direction = "increased" if abs_change > 0 else "decreased"
            alerts.append({
                "property_id": property_id,
                "alert_type": "PRICE_CHANGE",
                "message": f"Price {direction} by ₹{abs(abs_change):.0f} ({pct_change:+.1f}%)",
                "severity": severity
            })

        # 2. Availability / Sold Out Change
        new_avail = new_obs.get("available_units")
        old_avail = prev_obs.get("available_units")
        
        if new_avail is not None and old_avail is not None and new_avail != old_avail:
            abs_change = int(new_avail) - int(old_avail)
            
            event_type = "AVAILABILITY_CHANGE"
            severity = "neutral"
            if new_avail == 0:
                event_type = "SOLD_OUT"
                severity = "negative"
            elif abs_change < 0:
                event_type = "AVAILABILITY_DECREASE"
                severity = "warning"
                
            event = {
                "property_id": property_id,
                "observation_id": new_obs_id,
                "previous_observation_id": prev_obs["id"],
                "event_type": event_type,
                "old_value": str(old_avail),
                "new_value": str(new_avail),
                "absolute_change": abs_change,
                "percentage_change": 0,
                "severity": severity
            }
            change_events.append(event)
            
            if event_type == "SOLD_OUT":
                alerts.append({
                    "property_id": property_id,
                    "alert_type": "SOLD_OUT",
                    "message": f"Property is now sold out for check-in {check_in}",
                    "severity": "negative"
                })
            elif event_type == "AVAILABILITY_DECREASE":
                alerts.append({
                    "property_id": property_id,
                    "alert_type": "AVAILABILITY_DROP",
                    "message": f"Availability dropped from {old_avail} to {new_avail}",
                    "severity": "warning"
                })

        # 3. Insert events and alerts
        if change_events:
            ev_res = self.supabase.table("change_events").insert(change_events).execute()
            
            # Attach change_event_ids to alerts
            if alerts and ev_res.data:
                for i, alert in enumerate(alerts):
                    if i < len(ev_res.data):
                        alert["change_event_id"] = ev_res.data[i]["id"]
                
                self.supabase.table("alerts").insert(alerts).execute()
                logger.info(f"Inserted {len(change_events)} change events and {len(alerts)} alerts for property {property_id}")

        return change_events
