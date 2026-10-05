import logging
from typing import Dict, Any, List
from datetime import datetime, timedelta
from statistics import median, mean
from app.utils.database import get_supabase_client

logger = logging.getLogger(__name__)

class AnalyticsEngine:
    def __init__(self):
        self.supabase = get_supabase_client()

    def run_analytics_cycle(self):
        """
        Calculates property metrics and market metrics based on recent observations and change events.
        """
        logger.info("Starting analytics calculation cycle...")
        
        # 1. Fetch properties
        props_res = self.supabase.table("properties").select("id").eq("tracking_enabled", True).execute()
        properties = props_res.data
        if not properties:
            logger.info("No active properties to analyze.")
            return

        seven_days_ago = (datetime.now() - timedelta(days=7)).isoformat()
        
        all_property_metrics = []
        market_prices = []
        market_velocities = []
        sold_out_count = 0

        # Calculate metrics for each property
        for p in properties:
            pid = p["id"]
            
            # Get latest observation for current price/availability
            latest_obs_res = self.supabase.table("observations")\
                .select("price, available_units")\
                .eq("property_id", pid)\
                .order("created_at", desc=True)\
                .limit(1)\
                .execute()
                
            current_price = latest_obs_res.data[0].get("price") if latest_obs_res.data else 0
            current_avail = latest_obs_res.data[0].get("available_units") if latest_obs_res.data else 0
            
            if current_price:
                market_prices.append(float(current_price))
            if current_avail == 0:
                sold_out_count += 1
                
            # Get availability decreases (rooms sold) over last 7 days
            changes_res = self.supabase.table("change_events")\
                .select("*")\
                .eq("property_id", pid)\
                .in_("event_type", ["AVAILABILITY_DECREASE", "SOLD_OUT"])\
                .gte("detected_at", seven_days_ago)\
                .execute()
                
            est_rooms_sold = 0
            for ev in changes_res.data:
                # absolute_change is typically negative for drops, so we take absolute value
                change_val = abs(ev.get("absolute_change") or 1) 
                est_rooms_sold += change_val

            # Simplified Room Nights (assuming avg 2 nights per booking for calculation if exact scenario not linked)
            est_room_nights = est_rooms_sold * 2
            
            avg_observed_price = current_price or 0
            est_gross_booking_value = est_room_nights * float(avg_observed_price)
            
            # Booking velocity (rooms sold per week scaled to 0-100 score relative to max possible)
            # Simplistic scaling for demo: 10 rooms/week = ~50 score
            booking_velocity = min(100, (est_rooms_sold / 10) * 50) if est_rooms_sold > 0 else 0
            market_velocities.append(booking_velocity)

            # Sold out frequency
            sold_out_res = self.supabase.table("change_events")\
                .select("id")\
                .eq("property_id", pid)\
                .eq("event_type", "SOLD_OUT")\
                .gte("detected_at", seven_days_ago)\
                .execute()
            sold_out_freq = len(sold_out_res.data)

            metric = {
                "property_id": pid,
                "estimated_rooms_sold": est_rooms_sold,
                "estimated_room_nights": est_room_nights,
                "avg_observed_price": float(avg_observed_price),
                "estimated_gross_booking_value": est_gross_booking_value,
                "availability_trend": "DECREASING" if est_rooms_sold > 5 else ("STABLE" if est_rooms_sold > 0 else "FLAT"),
                "booking_velocity": booking_velocity,
                "sold_out_frequency": sold_out_freq,
                "weekend_performance": 0,
                "weekday_performance": 0
            }
            all_property_metrics.append(metric)

        # Insert Property Metrics
        if all_property_metrics:
            self.supabase.table("property_metrics").insert(all_property_metrics).execute()
            
        # Calculate Market Metrics
        avg_market_price = mean(market_prices) if market_prices else 0
        median_market_price = median(market_prices) if market_prices else 0
        lowest_price = min(market_prices) if market_prices else 0
        highest_price = max(market_prices) if market_prices else 0
        
        avg_velocity = mean(market_velocities) if market_velocities else 0
        
        # Demand Score Formula: Blend of average booking velocity + sold out pressure
        sold_out_pressure = (sold_out_count / len(properties)) * 100 if properties else 0
        demand_score = min(100, (avg_velocity * 0.6) + (sold_out_pressure * 0.4))
        
        market_metric = {
            "avg_market_price": avg_market_price,
            "median_market_price": median_market_price,
            "lowest_price": lowest_price,
            "highest_price": highest_price,
            "avg_availability": 0, # Not strictly tracked yet
            "market_demand_score": demand_score,
            "market_booking_velocity": avg_velocity,
            "sold_out_competitor_count": sold_out_count
        }
        
        self.supabase.table("market_metrics").insert(market_metric).execute()
        logger.info(f"Analytics cycle completed. Calculated metrics for {len(all_property_metrics)} properties. Market Demand Score: {demand_score:.1f}")

if __name__ == "__main__":
    engine = AnalyticsEngine()
    engine.run_analytics_cycle()
