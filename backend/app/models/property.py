import uuid
from sqlalchemy import Column, String, Boolean, Numeric, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Property(Base):
    __tablename__ = "properties"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_code = Column(String(255), unique=True, nullable=False)
    property_name = Column(String(255), nullable=False)
    property_type = Column(String(255))
    market_area = Column(String(255))
    selection_tier = Column(String(255))
    mmt_url = Column(String)
    source_platform = Column(String(255), default="MakeMyTrip")
    is_primary = Column(Boolean, default=False)
    tracking_enabled = Column(Boolean, default=True)
    rating = Column(Numeric(3, 1))
    review_count = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
