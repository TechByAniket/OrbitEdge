import os
import sys
import csv
import logging

# Ensure we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.utils.database import get_supabase_client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def import_properties(csv_path: str):
    supabase = get_supabase_client()
    
    with open(csv_path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        properties_to_insert = []
        
        for row in reader:
            # Skip empty rows
            if not row.get('competitor_id'):
                continue
                
            is_primary = row.get('competitor_id') == 'PRIMARY'
            tracking_enabled = str(row.get('tracking_enabled')).strip().upper() == 'TRUE'
            
            rating = None
            if row.get('current_rating'):
                try:
                    rating = float(row.get('current_rating'))
                except ValueError:
                    pass
                    
            review_count = None
            if row.get('review_count'):
                try:
                    review_count = int(float(row.get('review_count')))
                except ValueError:
                    pass
                    
            prop_data = {
                'property_code': row.get('competitor_id'),
                'property_name': row.get('property_name'),
                'property_type': row.get('property_type'),
                'market_area': row.get('market_area'),
                'selection_tier': row.get('selection_tier'),
                'mmt_url': row.get('mmt_url'),
                'source_platform': row.get('source_platform') or 'MakeMyTrip',
                'is_primary': is_primary,
                'tracking_enabled': tracking_enabled,
                'rating': rating,
                'review_count': review_count
            }
            properties_to_insert.append(prop_data)
            
    if not properties_to_insert:
        logger.warning("No properties found to insert.")
        return
        
    try:
        res = supabase.table('properties').upsert(properties_to_insert, on_conflict="property_code").execute()
        logger.info(f"Successfully imported {len(properties_to_insert)} properties.")
    except Exception as e:
        logger.error(f"Error importing properties: {e}")

if __name__ == "__main__":
    csv_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'data', 'competitor_master.csv')
    if not os.path.exists(csv_file):
        logger.error(f"CSV file not found at {csv_file}")
    else:
        import_properties(csv_file)
