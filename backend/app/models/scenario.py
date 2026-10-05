import uuid
from sqlalchemy import Column, String, Boolean, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class BookingScenario(Base):
    __tablename__ = "booking_scenarios"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_name = Column(String(255), nullable=False)
    guests = Column(Integer, nullable=False)
    rooms = Column(Integer, nullable=False)
    stay_duration = Column(Integer, nullable=False)
    date_type = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
