-- OrbitEdge Database Initialization Script

-- 1. properties
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_code VARCHAR(255) UNIQUE NOT NULL,
    property_name VARCHAR(255) NOT NULL,
    property_type VARCHAR(255),
    market_area VARCHAR(255),
    selection_tier VARCHAR(255),
    mmt_url TEXT,
    source_platform VARCHAR(255) DEFAULT 'MakeMyTrip',
    is_primary BOOLEAN DEFAULT FALSE,
    tracking_enabled BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3, 1),
    review_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. booking_scenarios
CREATE TABLE IF NOT EXISTS booking_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_name VARCHAR(255) NOT NULL,
    guests INTEGER NOT NULL,
    rooms INTEGER NOT NULL,
    stay_duration INTEGER NOT NULL,
    date_type VARCHAR(255) NOT NULL, -- e.g. weekday, weekend
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. tracking_runs
CREATE TABLE IF NOT EXISTS tracking_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_uuid UUID UNIQUE DEFAULT gen_random_uuid(),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'PENDING',
    total_properties INTEGER DEFAULT 0,
    successful_properties INTEGER DEFAULT 0,
    failed_properties INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. tracking_run_items
CREATE TABLE IF NOT EXISTS tracking_run_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID REFERENCES tracking_runs(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    scenario_id UUID REFERENCES booking_scenarios(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'PENDING',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0
);

-- 5. observations
CREATE TABLE IF NOT EXISTS observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    run_id UUID REFERENCES tracking_runs(id) ON DELETE CASCADE,
    scenario_id UUID REFERENCES booking_scenarios(id) ON DELETE CASCADE,
    observed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    check_in DATE,
    check_out DATE,
    stay_duration INTEGER,
    guests INTEGER,
    rooms_requested INTEGER,
    room_type VARCHAR(255),
    available_units INTEGER,
    price NUMERIC,
    discount NUMERIC,
    taxes NUMERIC,
    total_price NUMERIC,
    currency VARCHAR(10) DEFAULT 'INR',
    breakfast_included BOOLEAN,
    meal_plan VARCHAR(255),
    cancellation_policy TEXT,
    rating NUMERIC(3, 1),
    review_count INTEGER,
    source_url TEXT,
    raw_payload JSONB,
    content_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. change_events
CREATE TABLE IF NOT EXISTS change_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    observation_id UUID REFERENCES observations(id) ON DELETE CASCADE,
    previous_observation_id UUID REFERENCES observations(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    absolute_change NUMERIC,
    percentage_change NUMERIC,
    severity VARCHAR(50),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. property_metrics
CREATE TABLE IF NOT EXISTS property_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    estimated_rooms_sold INTEGER,
    estimated_room_nights INTEGER,
    avg_observed_price NUMERIC,
    estimated_gross_booking_value NUMERIC,
    availability_trend VARCHAR(50),
    booking_velocity NUMERIC,
    sold_out_frequency NUMERIC,
    weekend_performance NUMERIC,
    weekday_performance NUMERIC
);

-- 8. market_metrics
CREATE TABLE IF NOT EXISTS market_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    avg_market_price NUMERIC,
    median_market_price NUMERIC,
    lowest_price NUMERIC,
    highest_price NUMERIC,
    avg_availability NUMERIC,
    market_demand_score NUMERIC,
    market_booking_velocity NUMERIC,
    sold_out_competitor_count INTEGER
);

-- 9. alerts
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    change_event_id UUID REFERENCES change_events(id) ON DELETE CASCADE,
    alert_type VARCHAR(100),
    message TEXT NOT NULL,
    severity VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. ai_insights
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insight_type VARCHAR(100),
    content TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
