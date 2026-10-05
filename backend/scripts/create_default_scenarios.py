import os
import sys
import logging

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.utils.database import get_supabase_client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DEFAULT_SCENARIOS = [
    {
        "scenario_name": "Solo, 1-Night Weekday (Near-term)",
        "guests": 1,
        "rooms": 1,
        "stay_duration": 1,
        "date_type": "weekday_near"
    },
    {
        "scenario_name": "Couple, 1-Night Weekend (Near-term)",
        "guests": 2,
        "rooms": 1,
        "stay_duration": 1,
        "date_type": "weekend_near"
    },
    {
        "scenario_name": "Couple, 2-Night Weekend (Future)",
        "guests": 2,
        "rooms": 1,
        "stay_duration": 2,
        "date_type": "weekend_future"
    },
    {
        "scenario_name": "Small Family (3 guests), 1-Night Weekend (Near-term)",
        "guests": 3,
        "rooms": 1,
        "stay_duration": 1,
        "date_type": "weekend_near"
    },
    {
        "scenario_name": "Group (4 guests), 2 Rooms, 2-Night Weekend (Future)",
        "guests": 4,
        "rooms": 2,
        "stay_duration": 2,
        "date_type": "weekend_future"
    }
]

def create_scenarios():
    supabase = get_supabase_client()
    
    # Check if scenarios already exist to prevent duplicate generation
    existing = supabase.table("booking_scenarios").select("id").limit(1).execute()
    if existing.data:
        logger.info("Booking scenarios already exist. Skipping default creation.")
        return
        
    try:
        res = supabase.table("booking_scenarios").insert(DEFAULT_SCENARIOS).execute()
        logger.info(f"Successfully inserted {len(res.data)} default booking scenarios.")
    except Exception as e:
        logger.error(f"Error inserting default scenarios: {e}")

if __name__ == "__main__":
    create_scenarios()
