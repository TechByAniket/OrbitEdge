from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class ScenarioBase(BaseModel):
    scenario_name: str
    guests: int
    rooms: int
    stay_duration: int
    date_type: str
    is_active: bool = True

class ScenarioCreate(ScenarioBase):
    pass

class ScenarioUpdate(BaseModel):
    scenario_name: Optional[str] = None
    guests: Optional[int] = None
    rooms: Optional[int] = None
    stay_duration: Optional[int] = None
    date_type: Optional[str] = None
    is_active: Optional[bool] = None

class ScenarioResponse(ScenarioBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
