import logging
import asyncio
from typing import Dict, Any, Optional
from playwright.async_api import BrowserContext, Page, TimeoutError

from app.collectors.makemytrip.browser import BrowserManager

logger = logging.getLogger(__name__)

class MakeMyTripCollector:
    def __init__(self, headless: bool = True):
        self.browser_manager = BrowserManager(headless=headless)
        self.context: Optional[BrowserContext] = None

    async def initialize(self):
        """Start the browser context."""
        self.context = await self.browser_manager.start()

    async def close(self):
        """Clean up the browser."""
        await self.browser_manager.stop()

    async def safe_navigate(self, page: Page, url: str, timeout: int = 60000) -> bool:
        """
        Navigate to a URL with error and timeout handling.
        """
        try:
            logger.info(f"Navigating to {url}")
            await page.goto(url, timeout=timeout, wait_until='domcontentloaded')
            
            # Wait a bit for dynamic content and any overlays to render
            await page.wait_for_timeout(3000)
            return True
        except TimeoutError:
            logger.error(f"Timeout while navigating to {url}")
            return False
        except Exception as e:
            logger.error(f"Navigation failed for {url}: {str(e)}")
            return False

    async def extract_property_details(self, page: Page) -> Dict[str, Any]:
        """Extract property-level details from the page."""
        details = {
            "property_name": None,
            "rating": None,
            "review_count": None,
            "selected_dates": None,
            "selected_guests_rooms": None
        }
        
        try:
            # Note: Selectors may need adjustment based on MMT's live DOM changes.
            
            # Extract Property Name
            name_elem = await page.query_selector("h1, .prmProperty")
            if name_elem:
                details["property_name"] = (await name_elem.inner_text()).strip()
                
            # Extract Rating
            rating_elem = await page.query_selector(".rating span, #detpg_hotel_rating")
            if rating_elem:
                details["rating"] = (await rating_elem.inner_text()).strip()
                
            # Extract Review Count
            review_elem = await page.query_selector(".reviewText, #detpg_hotel_reviews_count")
            if review_elem:
                details["review_count"] = (await review_elem.inner_text()).strip()
                
            # Extract Check-in/Check-out
            date_elem = await page.query_selector("#detpg_hotel_date, .mmt-checkin-checkout")
            if date_elem:
                details["selected_dates"] = (await date_elem.inner_text()).strip()
                
            # Extract Guests/Rooms
            guest_elem = await page.query_selector("#detpg_hotel_guest, .mmt-room-guest")
            if guest_elem:
                details["selected_guests_rooms"] = (await guest_elem.inner_text()).strip()
                
            # Extract Amenities
            amenity_elems = await page.query_selector_all(".amenityWrapper, .facility-item")
            amenities = []
            for elem in amenity_elems:
                text = await elem.inner_text()
                if text:
                    amenities.append(text.strip())
            details["amenities"] = amenities
                
        except Exception as e:
            logger.error(f"Error extracting property details: {e}")
            
        return details

    async def extract_rooms_and_prices(self, page: Page) -> Dict[str, Any]:
        """Extract room availability and pricing details."""
        rooms_data = []
        
        try:
            # Note: Selectors may need adjustment based on MMT's live DOM changes.
            room_cards = await page.query_selector_all(".roomWrap, .room-card")
            
            for card in room_cards:
                room = {}
                
                # Room Type
                type_elem = await card.query_selector(".roomType, .room-name")
                if type_elem:
                    room["room_type"] = (await type_elem.inner_text()).strip()
                    
                # Price
                price_elem = await card.query_selector(".roomPrice, .price-display")
                if price_elem:
                    room["price"] = (await price_elem.inner_text()).strip()
                    
                # Discounts & Taxes
                discount_elem = await card.query_selector(".discount, .discount-tag")
                if discount_elem:
                    room["discount"] = (await discount_elem.inner_text()).strip()
                    
                taxes_elem = await card.query_selector(".taxesInfo, .taxes")
                if taxes_elem:
                    room["taxes"] = (await taxes_elem.inner_text()).strip()
                    
                # Meal Info / Breakfast
                meal_elem = await card.query_selector(".mealInfo, .breakfast-included")
                if meal_elem:
                    room["meal_plan"] = (await meal_elem.inner_text()).strip()
                    room["breakfast_included"] = "breakfast" in room.get("meal_plan", "").lower()
                    
                # Cancellation Policy
                cancel_elem = await card.query_selector(".cancellationPolicy, .free-cancellation")
                if cancel_elem:
                    room["cancellation_policy"] = (await cancel_elem.inner_text()).strip()
                    
                rooms_data.append(room)
                
        except Exception as e:
            logger.error(f"Error extracting room details: {e}")
            
        return {"rooms": rooms_data, "available_units": len(rooms_data)}

    async def collect_property_data(self, url: str) -> Dict[str, Any]:
        """
        Base method to collect data from a MakeMyTrip property page.
        """
        if not self.context:
            raise RuntimeError("Collector not initialized. Call initialize() first.")
            
        page = await self.context.new_page()
        data = {"url": url, "status": "failed", "error": None}
        
        try:
            success = await self.safe_navigate(page, url)
            if not success:
                data["error"] = "Navigation failed or timed out"
                return data
                
            # Basic setup successful
            data["status"] = "success"
            data["title"] = await page.title()
            
            # Phase 4.2 - Extract property details
            property_details = await self.extract_property_details(page)
            data.update(property_details)
            
            # Extract rooms, prices, discounts, and taxes
            rooms_data = await self.extract_rooms_and_prices(page)
            data.update(rooms_data)
            
        except Exception as e:
            logger.error(f"Unexpected error collecting data: {str(e)}")
            data["error"] = str(e)
        finally:
            await page.close()
            
        return data
