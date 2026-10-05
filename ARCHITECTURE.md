# OrbitEdge

## AI-Powered Hotel Competitor & Revenue Intelligence Platform

OrbitEdge is a hotel and vacation-rental competitor intelligence platform that continuously tracks a selected property and its competitors on MakeMyTrip.

The system collects publicly observable pricing, availability, room, booking-condition and property information, stores historical snapshots in Supabase, detects changes, calculates market intelligence, and presents everything through a modern web dashboard.

---

# 1. Project Goal

OrbitEdge should provide a business owner with a single dashboard to answer:

* How is my property performing compared with competitors?
* Which competitors are selling faster?
* Which properties are becoming unavailable?
* Which properties are increasing or decreasing prices?
* Which properties are sold out?
* What is the current market price?
* What is the market demand signal?
* What are the estimated booking and revenue signals?
* How does the primary property compare with the market?
* What changed since the previous tracking run?
* What should the property consider doing based on current market conditions?

The primary property for the project is:

**ELITE HOTEL — Lonavala/Khandala**

The system contains:

* 1 primary property
* 53 competitors
* 54 total tracked properties

The architecture must allow more competitors to be added from the database without changing the application code.

---

# 2. Technology Stack

## Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Recharts
* Lucide React icons

The frontend should look like a modern SaaS analytics product rather than an academic dashboard.

---

## Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy
* Playwright

FastAPI handles:

* API endpoints
* business logic
* analytics
* tracking
* change detection
* revenue calculations
* demand calculations
* AI features

---

## Database

**Supabase PostgreSQL**

Supabase is the persistent source of truth for OrbitEdge.

The database stores:

* properties
* booking scenarios
* tracking runs
* observations
* changes
* analytics
* alerts
* AI insights

---

## Data Collection

**Python + Playwright**

Playwright is used to collect publicly observable MakeMyTrip booking information where permitted.

The collector must not bypass:

* CAPTCHA
* authentication
* security controls
* access restrictions
* anti-bot protections

If a property cannot be collected, the property should be marked as failed and the rest of the tracking process should continue.

---

# 3. Simplified Architecture

```text
                    ┌──────────────────────┐
                    │     MakeMyTrip       │
                    │   Public Booking UI  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Python Collector    │
                    │      Playwright      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    FastAPI Backend   │
                    │                      │
                    │ Tracking              │
                    │ Normalization         │
                    │ Change Detection      │
                    │ Analytics             │
                    │ Revenue Engine        │
                    │ Demand Engine         │
                    │ AI Intelligence       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Supabase PostgreSQL  │
                    │                      │
                    │ Historical Data       │
                    │ Properties            │
                    │ Observations          │
                    │ Changes               │
                    │ Metrics               │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Next.js UI       │
                    │                      │
                    │ Dashboard             │
                    │ Competitors           │
                    │ Pricing               │
                    │ Availability          │
                    │ Demand                │
                    │ Revenue               │
                    │ Alerts                │
                    │ AI Advisor             │
                    └──────────────────────┘
```

---

# 4. Project Structure

The project should be a single repository.

```text
OrbitEdge/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   │
│   │   ├── config/
│   │   │   └── settings.py
│   │   │
│   │   ├── api/
│   │   │   ├── properties.py
│   │   │   ├── tracking.py
│   │   │   ├── observations.py
│   │   │   ├── analytics.py
│   │   │   ├── alerts.py
│   │   │   └── ai.py
│   │   │
│   │   ├── models/
│   │   │   ├── property.py
│   │   │   ├── scenario.py
│   │   │   ├── observation.py
│   │   │   ├── tracking.py
│   │   │   └── change_event.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── property.py
│   │   │   ├── tracking.py
│   │   │   └── analytics.py
│   │   │
│   │   ├── services/
│   │   │   ├── tracking_service.py
│   │   │   ├── change_detection.py
│   │   │   ├── analytics_service.py
│   │   │   ├── revenue_service.py
│   │   │   ├── demand_service.py
│   │   │   ├── alert_service.py
│   │   │   └── ai_service.py
│   │   │
│   │   ├── collectors/
│   │   │   ├── base.py
│   │   │   └── makemytrip/
│   │   │       ├── collector.py
│   │   │       ├── parser.py
│   │   │       ├── normalizer.py
│   │   │       └── browser.py
│   │   │
│   │   └── utils/
│   │       ├── dates.py
│   │       └── hashing.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   ├── competitors/
│   │   ├── properties/
│   │   ├── pricing/
│   │   ├── availability/
│   │   ├── demand/
│   │   ├── revenue/
│   │   ├── alerts/
│   │   └── advisor/
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   ├── charts/
│   │   ├── tables/
│   │   ├── cards/
│   │   ├── filters/
│   │   └── ui/
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   ├── package.json
│   └── .env.example
│
├── data/
│   └── competitor_master.csv
│
├── ARCHITECTURE.md
├── README.md
└── .gitignore
```

---

# 5. Database Architecture

Supabase PostgreSQL is the central database.

## Main Tables

```text
properties
booking_scenarios
tracking_runs
tracking_run_items
observations
change_events
property_metrics
market_metrics
alerts
ai_insights
```

---

# 6. Properties

Stores the primary property and all competitors.

```text
properties
------------------------------------------------
id
property_code
property_name
property_type
market_area
selection_tier
mmt_url
source_platform
is_primary
tracking_enabled
rating
review_count
created_at
updated_at
```

Example:

```text
PRIMARY → ELITE HOTEL
C001    → Le Tranquil Resort
C002    → Hill Forest Resort
...
C053    → Meritas Countryside Resort
```

The frontend should allow new properties to be added without changing code.

---

# 7. Booking Scenarios

Booking conditions must be configurable.

```text
booking_scenarios
------------------------------------------------
id
scenario_name
guests
rooms
stay_duration
date_type
is_active
created_at
```

Initial scenarios:

### Scenario 1

```text
2 guests
1 room
1 night
weekday
near-term
```

### Scenario 2

```text
2 guests
1 room
1 night
weekend
near-term
```

### Scenario 3

```text
4 guests
1 room
1 night
weekend
near-term
```

### Scenario 4

```text
2 guests
1 room
2 nights
weekend
future
```

### Scenario 5

```text
2 guests
2 rooms
1 night
weekend
future
```

The scenario system should support additional combinations later.

---

# 8. Tracking Runs

Every time OrbitEdge performs a tracking cycle, a tracking run is created.

```text
tracking_runs
------------------------------------------------
id
run_uuid
started_at
completed_at
status
total_properties
successful_properties
failed_properties
created_at
```

Possible statuses:

```text
PENDING
RUNNING
COMPLETED
PARTIAL
FAILED
```

---

# 9. Tracking Run Items

Each property/scenario combination gets an individual tracking record.

```text
tracking_run_items
------------------------------------------------
id
run_id
property_id
scenario_id
status
started_at
completed_at
error_message
retry_count
```

This ensures that if one property fails, other properties continue processing.

---

# 10. Observations

Every collected booking observation is stored historically.

```text
observations
------------------------------------------------
id
property_id
run_id
scenario_id
observed_at

check_in
check_out
stay_duration
guests
rooms_requested

room_type
available_units

price
discount
taxes
total_price
currency

breakfast_included
meal_plan
cancellation_policy

rating
review_count

source_url
raw_payload
content_hash

created_at
```

Historical observations must never simply overwrite previous observations.

---

# 11. Observation Example

```json
{
  "property": "ELITE HOTEL",
  "check_in": "2026-10-10",
  "check_out": "2026-10-11",
  "guests": 2,
  "rooms": 1,
  "room_type": "Deluxe Room",
  "available_units": 5,
  "price": 4200,
  "discount": 500,
  "taxes": 650,
  "breakfast_included": true,
  "rating": 4.3,
  "review_count": 1015
}
```

---

# 12. Change Detection

Every new observation is compared with the previous matching observation.

Matching conditions:

```text
property
scenario
check-in
check-out
guests
rooms
room type
```

The system detects:

```text
Availability decrease
Availability increase
Sold out
Price increase
Price decrease
Discount increase
Discount decrease
Room type disappeared
Room type appeared
Meal option changed
Cancellation condition changed
Rating changed
Review count changed
```

---

# 13. Change Events

```text
change_events
------------------------------------------------
id
property_id
observation_id
previous_observation_id
event_type
old_value
new_value
absolute_change
percentage_change
severity
detected_at
```

Example:

```text
PRICE_INCREASE

Previous: ₹4,000
Current:  ₹4,500
Change:   +₹500
Change %: +12.5%
```

---

# 14. Availability Intelligence

Availability is treated as an observable demand signal.

Example:

```text
Previous availability = 8
Current availability  = 5
```

OrbitEdge calculates:

```text
Observed reduction = 3 units
```

This can become:

```text
Estimated rooms sold = 3
```

but the UI must clearly call it an **estimate**.

OrbitEdge must never claim that it knows the property's private confirmed bookings.

---

# 15. Revenue Estimation

Estimated room nights:

```text
estimated rooms sold × stay duration
```

Estimated gross booking value:

```text
estimated room nights × average observed selling price
```

Example:

```text
Estimated rooms sold = 3
Stay duration = 2 nights
Average observed price = ₹4,000

Estimated room nights = 6

Estimated gross booking value = ₹24,000
```

All such values must be labelled:

**Estimated**

---

# 16. Booking Velocity

Booking velocity measures observable availability reduction over time.

Example:

```text
10:00 AM → 8 rooms
02:00 PM → 6 rooms
06:00 PM → 4 rooms
```

Observed reduction:

```text
4 rooms
```

The system can calculate:

```text
rooms/hour
rooms/day
```

This becomes one input into demand intelligence.

---

# 17. Demand Intelligence

OrbitEdge generates a **Market Demand Score from 0–100**.

The score can consider:

```text
Availability pressure
Booking velocity
Sold-out frequency
Price movement
Weekend pressure
```

Example:

```text
Availability pressure     30%
Booking velocity          30%
Sold-out frequency        20%
Price movement             10%
Weekend pressure           10%
```

The weights should be configurable.

The score represents an analytical demand signal and not confirmed private demand.

---

# 18. Market Intelligence

OrbitEdge calculates:

```text
Average market price
Median market price
Lowest price
Highest price

Average availability
Availability reduction

Average discount
Weekend price premium

Sold-out frequency
Booking velocity

Market demand score
```

---

# 19. Competitor Ranking

Competitors can be ranked by:

```text
Price
Availability
Booking velocity
Demand score
Sold-out frequency
Discount
Rating
Review count
```

The dashboard should provide sortable rankings.

---

# 20. Primary Property Intelligence

The primary property, ELITE HOTEL, gets a dedicated comparison view.

Show:

```text
ELITE HOTEL price
Market median price
Price difference
Price rank

ELITE HOTEL availability
Market availability
Availability rank

ELITE HOTEL rating
Market average rating

ELITE HOTEL demand score
Market demand score
```

---

# 21. Dashboard

The frontend should feel like a modern hotel revenue-management SaaS product.

Use:

* Dark/light professional UI
* Clean cards
* Large KPI numbers
* Interactive charts
* Tables
* Badges
* Trend indicators
* Filters
* Responsive layout
* Smooth loading states
* Empty states
* Error states

Avoid making it look like a college project.

---

# 22. Main Navigation

```text
OrbitEdge
│
├── Overview
├── Competitors
├── Pricing
├── Availability
├── Demand
├── Revenue
├── Alerts
└── AI Advisor
```

---

# 23. Overview Dashboard

The Overview page is the main screen.

## KPI Cards

```text
Tracked Properties
54

Active Competitors
53

Market Average Price
₹X,XXX

Market Demand
XX/100

Sold Out
X

Availability Change
-X%

Estimated Room Nights
XXX

Estimated Revenue
₹XXX,XXX
```

---

## Main Charts

### Market Price Comparison

Bar chart:

```text
Property → Price
```

---

### Availability Comparison

```text
Property → Available Units
```

---

### Price Trend

Line chart:

```text
Time → Average Market Price
```

---

### Availability Trend

Line chart:

```text
Time → Market Availability
```

---

### Demand Trend

```text
Time → Demand Score
```

---

# 24. Competitor Page

Show all properties in a powerful table.

Columns:

```text
Property
Type
Area
Rating
Reviews
Price
Discount
Availability
Demand
Price Change
Availability Change
```

Features:

```text
Search
Sort
Filter
Property type filter
Area filter
Price range
Rating
Demand
Availability
```

Clicking a property opens its detailed page.

---

# 25. Property Detail Page

Each property gets its own intelligence page.

Header:

```text
Property Name
Location
Rating
Reviews
Property Type
```

KPI cards:

```text
Current Price
Availability
Discount
Demand Score
Booking Velocity
```

Charts:

```text
Price History
Availability History
Demand History
```

Changes:

```text
Recent Price Changes
Recent Availability Changes
Recent Booking Signals
```

---

# 26. Pricing Page

Show:

```text
Market price distribution
Property price ranking
Price trends
Price increases
Price decreases
Weekend premium
Discount comparison
```

Important visual:

```text
ELITE HOTEL
₹4,200

Market Median
₹4,650

Difference
-₹450
```

---

# 27. Availability Page

Show:

```text
Current availability
Availability trend
Largest availability reductions
Fastest-selling properties
Sold-out properties
Sold-out frequency
Booking velocity
```

A leaderboard:

```text
FASTEST SELLING

1. Property A
2. Property B
3. Property C
4. Property D
5. Property E
```

---

# 28. Demand Page

Show:

```text
Market Demand Score
Property Demand Scores
Demand trend
Booking velocity
Availability pressure
Sold-out frequency
Weekend demand
```

Use a clear 0–100 demand visualization.

---

# 29. Revenue Page

Show:

```text
Estimated rooms sold
Estimated room nights
Average selling price
Estimated gross booking value
Revenue trend
Revenue by property
```

Always display a small explanation:

> Revenue values are estimates derived from observable availability changes and observed selling prices. They do not represent confirmed private hotel revenue.

---

# 30. Alerts Page

Show important market changes.

Examples:

```text
🔴 Competitor Sold Out

🟠 Competitor Price Increased 14%

🟡 Availability Dropped

🔵 Market Demand Increased

🟢 Primary Property Below Market Median
```

Each alert contains:

```text
Property
Event
Previous value
Current value
Change
Time
```

---

# 31. AI Advisor

OrbitEdge should have an AI-powered intelligence section.

The AI receives calculated market metrics rather than blindly interpreting raw scraped HTML.

Possible features:

### Market Summary

```text
What happened in the market today?
```

### Competitor Analysis

```text
Which competitors are performing strongly?
```

### Pricing Insight

```text
How does ELITE HOTEL's price compare?
```

### Demand Explanation

```text
Why is demand currently high?
```

### Ask OrbitEdge

User can ask:

```text
Which competitors are selling fastest?

Who increased prices today?

Why did market demand increase?

How does ELITE HOTEL compare with competitors?

Which properties are sold out?

What is the current market price?
```

The AI should answer using actual database-derived metrics.

---

# 32. Tracking Interface

OrbitEdge should include a simple tracking control.

Example:

```text
┌─────────────────────────────────────────┐
│         RUN MARKET TRACKING             │
│                                         │
│ Scenario: 2 Guests · 1 Room · Weekend  │
│                                         │
│ Properties: 54                          │
│                                         │
│             [ Start Tracking ]          │
└─────────────────────────────────────────┘
```

After starting:

```text
Tracking...

ELITE HOTEL          ✓
Le Tranquil Resort   ✓
Hill Forest Resort   ✓
Hotel Chandralok     ✓
...
```

The user can see the current run progress.

---

# 33. Tracking Flow

```text
User clicks "Start Tracking"
             ↓
FastAPI creates tracking run
             ↓
Load active properties
             ↓
Load selected scenario
             ↓
Collector visits each property
             ↓
Extract booking information
             ↓
Normalize data
             ↓
Store observation
             ↓
Compare with previous observation
             ↓
Create change events
             ↓
Calculate metrics
             ↓
Update dashboard
```

---

# 34. Automatic Tracking

OrbitEdge should support repeated tracking.

A simple scheduler inside the backend can periodically trigger tracking.

Default interval:

```text
6 hours
```

The interval should be configurable.

For the project demonstration, manual tracking through the dashboard must also be available.

This allows the same property to be tracked repeatedly and historical changes to be demonstrated immediately.

---

# 35. Error Handling

If one property fails:

```text
ELITE HOTEL       ✓
Competitor 01     ✓
Competitor 02     ✗
Competitor 03     ✓
Competitor 04     ✓
```

The failed property should be recorded.

The tracking process must continue.

The UI should show:

```text
52 successful
1 failed
1 skipped
```

---

# 36. Duplicate Prevention

Each observation gets a content hash based on its relevant booking conditions and collected values.

Example:

```text
property
scenario
dates
guests
rooms
room type
availability
price
```

This prevents accidental duplicate records from the same collection event.

---

# 37. Data Flow

```text
CSV
 │
 ▼
Properties
 │
 ▼
Booking Scenarios
 │
 ▼
Tracking Run
 │
 ▼
Playwright Collector
 │
 ▼
Normalized Observation
 │
 ▼
Supabase
 │
 ▼
Previous Observation
 │
 ▼
Change Detection
 │
 ├──────────────┐
 ▼              ▼
Analytics      Alerts
 │
 ├──────────────┐
 ▼              ▼
Demand        Revenue
 │              │
 └──────┬───────┘
        ▼
   AI Intelligence
        │
        ▼
   Next.js Dashboard
```

---

# 38. API Endpoints

## Properties

```http
GET    /api/properties
GET    /api/properties/{id}
POST   /api/properties
PATCH  /api/properties/{id}
```

## Scenarios

```http
GET /api/scenarios
POST /api/scenarios
```

## Tracking

```http
POST /api/tracking/run
GET  /api/tracking/runs
GET  /api/tracking/runs/{id}
```

## Observations

```http
GET /api/observations
GET /api/properties/{id}/observations
```

## Changes

```http
GET /api/changes
GET /api/properties/{id}/changes
```

## Analytics

```http
GET /api/analytics/overview
GET /api/analytics/pricing
GET /api/analytics/availability
GET /api/analytics/demand
GET /api/analytics/revenue
```

## Alerts

```http
GET /api/alerts
```

## AI

```http
POST /api/ai/ask
POST /api/ai/summary
POST /api/ai/recommendation
```

---

# 39. Environment Variables

Only environment variables that are genuinely required should be used.

Backend:

```env
SUPABASE_URL=
SUPABASE_KEY=
```

If AI features are enabled:

```env
OPENAI_API_KEY=
```

Frontend:

```env
NEXT_PUBLIC_API_URL=
```

No secrets should be hardcoded.

A `.env.example` file should be included.

---

# 40. Initial Data

The existing competitor CSV should be imported into Supabase.

The system should support:

```text
data/competitor_master.csv
```

The CSV contains:

* Primary property
* 53 competitors
* MakeMyTrip URLs
* Property types
* Market areas
* Selection tiers
* Other available metadata

After importing, Supabase becomes the application's operational source.

---

# 41. UI Design Direction

OrbitEdge should have a premium B2B SaaS appearance.

### Visual identity

```text
Brand:
OrbitEdge

Tagline:
Hotel Market Intelligence, Around You.
```

The design should communicate:

```text
Data
Intelligence
Market movement
Revenue
Competition
```

Use:

* Modern typography
* Compact sidebar
* Clean cards
* Subtle borders
* Professional charts
* Clear status badges
* Consistent spacing
* Responsive layout

Do not make every section a giant card.

---

# 42. Main Dashboard Layout

```text
┌──────────────────────────────────────────────────────────┐
│ OrbitEdge                         Last tracked: 6:42 PM  │
├────────────┬─────────────────────────────────────────────┤
│            │                                             │
│ Overview   │  MARKET OVERVIEW                            │
│            │                                             │
│ Competitors│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ │
│            │  │ 54    │ │ ₹4.6K │ │ 67/100│ │  6    │ │
│ Pricing    │  │Hotels │ │ Avg   │ │Demand │ │Soldout│ │
│            │  └───────┘ └───────┘ └───────┘ └───────┘ │
│ Availability│                                            │
│            │  PRICE TREND                               │
│ Demand     │  ┌───────────────────────────────────────┐ │
│            │  │              Chart                    │ │
│ Revenue    │  │                                       │ │
│            │  └───────────────────────────────────────┘ │
│ Alerts     │                                             │
│            │  MARKET AVAILABILITY                       │
│ AI Advisor │  ┌──────────────────┐ ┌────────────────┐ │
│            │  │ Availability     │ │ Top Changes   │ │
│            │  │ Chart            │ │              │ │
│            │  └──────────────────┘ └────────────────┘ │
└────────────┴─────────────────────────────────────────────┘
```

---

# 43. Core Feature Set

OrbitEdge must provide these features:

### Property Management

* Primary property
* Competitor list
* Add competitor
* Enable/disable tracking

### Tracking

* Manual tracking
* Automatic tracking
* Booking scenarios
* Tracking progress
* Tracking history

### Data Collection

* Price
* Availability
* Room type
* Discounts
* Taxes
* Meals
* Cancellation
* Rating
* Reviews

### Intelligence

* Price changes
* Availability changes
* Sold-out detection
* Booking velocity
* Demand score
* Competitor ranking
* Market trends

### Revenue

* Estimated rooms sold
* Estimated room nights
* Average selling price
* Estimated gross booking value

### Dashboard

* Overview
* Competitors
* Pricing
* Availability
* Demand
* Revenue
* Historical trends
* Alerts

### AI

* Market summary
* Competitor explanation
* Pricing insight
* Demand explanation
* Ask OrbitEdge

---

# 44. Important Data Rule

OrbitEdge must clearly distinguish:

```text
OBSERVED
```

from:

```text
ESTIMATED
```

and:

```text
CONFIRMED
```

The system only has publicly observable booking information.

Therefore:

```text
Observed availability reduction
        ↓
Estimated booking signal
```

It must never be represented as a confirmed hotel booking.

Likewise:

```text
Estimated Revenue
```

must never be presented as the actual private revenue of a property.

---

# 45. Development Priority

Codex should implement OrbitEdge in this order:

```text
1. Create project structure
        ↓
2. Connect Supabase
        ↓
3. Import competitor data
        ↓
4. Build FastAPI backend
        ↓
5. Build MakeMyTrip collector
        ↓
6. Build booking scenarios
        ↓
7. Store observations
        ↓
8. Build change detection
        ↓
9. Build analytics
        ↓
10. Build revenue & demand calculations
        ↓
11. Build Next.js dashboard
        ↓
12. Build tracking controls
        ↓
13. Build alerts
        ↓
14. Build AI Advisor
        ↓
15. Polish UI
```

---

# 46. Final Product Architecture

```text
                         ORBITEDGE
                Hotel Market Intelligence
                            │
                            ▼
                  ┌───────────────────┐
                  │    Next.js UI     │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌───────────────────┐
                  │    FastAPI API    │
                  └─────────┬─────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
       Tracking         Analytics          AI
            │               │               │
            ▼               ▼               │
       Playwright       Change Detection    │
            │               │               │
            ▼               ▼               │
       MakeMyTrip       Revenue/Demand      │
            │               │               │
            └───────────────┼───────────────┘
                            ▼
                  ┌───────────────────┐
                  │ Supabase/Postgres │
                  │                   │
                  │ Historical Data   │
                  │ Properties        │
                  │ Observations      │
                  │ Changes           │
                  │ Metrics           │
                  │ Alerts            │
                  └───────────────────┘
```

---

# 47. OrbitEdge in One Sentence

> **OrbitEdge transforms repeated MakeMyTrip observations into a live competitive intelligence dashboard that helps hotel businesses understand market pricing, availability, demand and revenue opportunities.**
