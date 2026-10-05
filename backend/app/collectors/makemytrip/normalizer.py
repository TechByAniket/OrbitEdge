import re
from typing import Dict, Any, Optional

def clean_price(price_str: Optional[str]) -> Optional[float]:
    """Convert '₹ 4,500' or 'Rs 4500' to 4500.0"""
    if not price_str:
        return None
    # Remove all non-digit and non-period characters
    cleaned = re.sub(r'[^\d.]', '', price_str)
    try:
        return float(cleaned) if cleaned else None
    except ValueError:
        return None

def extract_availability(avail_str: Optional[str]) -> Optional[int]:
    """Convert 'Only 2 rooms left' to 2. If 'sold out' return 0. If None/standard return None."""
    if not avail_str:
        return None
    avail_str = avail_str.lower()
    
    if "sold out" in avail_str:
        return 0
        
    match = re.search(r'(\d+)\s*room', avail_str)
    if match:
        try:
            return int(match.group(1))
        except ValueError:
            pass
    return None

def clean_rating(rating_str: Optional[str]) -> Optional[float]:
    """Convert '4.3 / 5' or '4.3' to 4.3"""
    if not rating_str:
        return None
    match = re.search(r'(\d+\.\d+|\d+)', rating_str)
    if match:
        try:
            return float(match.group(1))
        except ValueError:
            pass
    return None

def clean_review_count(review_str: Optional[str]) -> Optional[int]:
    """Convert '1,234 reviews' or '(1234)' to 1234"""
    if not review_str:
        return None
    cleaned = re.sub(r'[^\d]', '', review_str)
    try:
        return int(cleaned) if cleaned else None
    except ValueError:
        return None

def normalize_property_data(raw_data: Dict[str, Any]) -> Dict[str, Any]:
    """Take the raw parsed dictionary from the collector and normalize the values."""
    normalized = {
        "url": raw_data.get("url"),
        "status": raw_data.get("status"),
        "property_name": raw_data.get("property_name"),
        "rating": clean_rating(raw_data.get("rating")),
        "review_count": clean_review_count(raw_data.get("review_count")),
        "amenities": raw_data.get("amenities", [])
    }
    
    normalized_rooms = []
    for room in raw_data.get("rooms", []):
        norm_room = {
            "room_type": room.get("room_type"),
            "price": clean_price(room.get("price")),
            "discount": clean_price(room.get("discount")),
            "taxes": clean_price(room.get("taxes")),
            "meal_plan": room.get("meal_plan"),
            "breakfast_included": room.get("breakfast_included", False),
            "cancellation_policy": room.get("cancellation_policy")
        }
        
        # Room-level availability (if extracted in the future)
        avail_text = room.get("availability_text")
        if avail_text:
            norm_room["available_units"] = extract_availability(avail_text)
            
        normalized_rooms.append(norm_room)
        
    normalized["rooms"] = normalized_rooms
    
    return normalized
