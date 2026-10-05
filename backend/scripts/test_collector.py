import os
import sys
import asyncio
import logging
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.utils.database import get_supabase_client
from app.collectors.makemytrip.collector import MakeMyTripCollector
from app.collectors.makemytrip.normalizer import normalize_property_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_primary_property():
    supabase = get_supabase_client()
    
    # Fetch primary property
    res = supabase.table("properties").select("*").eq("is_primary", True).execute()
    if not res.data:
        logger.error("Primary property not found in database!")
        return
        
    primary_property = res.data[0]
    mmt_url = primary_property.get("mmt_url")
    
    if not mmt_url:
        # Fallback to a known MMT url for testing if db doesn't have one
        mmt_url = "https://www.makemytrip.com/hotels/hotel-details/?hotelId=201407231454024222" # Placeholder ID for testing
        logger.warning(f"Primary property has no URL, using fallback: {mmt_url}")
        
    logger.info(f"Testing collector on: {primary_property['property_name']} ({mmt_url})")
    
    collector = MakeMyTripCollector(headless=True)
    await collector.initialize()
    
    try:
        raw_data = await collector.collect_property_data(mmt_url)
        logger.info(f"Raw Extracted Data:\n{json.dumps(raw_data, indent=2)}")
        
        if raw_data.get("status") == "success":
            normalized = normalize_property_data(raw_data)
            logger.info(f"Normalized Data:\n{json.dumps(normalized, indent=2)}")
        else:
            logger.error("Collection failed.")
            
    finally:
        await collector.close()

if __name__ == "__main__":
    asyncio.run(test_primary_property())
