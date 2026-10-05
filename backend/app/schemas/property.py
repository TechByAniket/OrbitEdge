from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime
from uuid import UUID

class PropertyBase(BaseModel):
    property_code: str
    property_name: str
    property_type: Optional[str] = None
    market_area: Optional[str] = None
    selection_tier: Optional[str] = None
    mmt_url: Optional[str] = None
    source_platform: str = "MakeMyTrip"
    is_primary: bool = False
    tracking_enabled: bool = True
    rating: Optional[float] = None
    review_count: Optional[int] = None

class PropertyCreate(PropertyBase):
    pass

class PropertyUpdate(BaseModel):
    property_name: Optional[str] = None
    property_type: Optional[str] = None
    market_area: Optional[str] = None
    selection_tier: Optional[str] = None
    mmt_url: Optional[str] = None
    is_primary: Optional[bool] = None
    tracking_enabled: Optional[bool] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None

class PropertyResponse(PropertyBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
