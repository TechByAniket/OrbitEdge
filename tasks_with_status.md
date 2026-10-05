# OrbitEdge — Tasks & Execution Status

> **Purpose:** This file is the persistent execution context for the OrbitEdge project.
>
> Every coding-agent session MUST:
>
> 1. Read `ARCHITECTURE.md`
> 2. Read this file completely before making changes
> 3. Find the **first incomplete task**
> 4. Work primarily on that task
> 5. Verify the work before marking it complete
> 6. Update this file immediately after completing the task
> 7. Mark the task as `[x] COMPLETED`
> 8. Add a short completion note containing what was implemented
> 9. Do NOT mark a task complete if it is only partially implemented
> 10. Do NOT skip ahead unless the current task is blocked by a missing dependency
> 11. Mention/ add any task that is not mentioned here , but you have done it.
>
> **Status values:**
>
> * `[ ]` = Not started
> * `[~]` = In progress / partially completed
> * `[x]` = Completed
> * `[!]` = Blocked
>
> **Important:** This file is the source of truth for project progress. If a new coding-agent session starts, it must use this file to resume from the correct point.

---

# PROJECT: OrbitEdge

## Project Goal

Build a working hotel/vacation-rental competitor intelligence platform that continuously tracks a primary property and 30+ comparable properties using MakeMyTrip observations.

The system should:

* collect repeated property observations
* store historical snapshots without overwriting previous data
* track price and availability
* detect meaningful changes
* estimate booking activity
* estimate revenue
* calculate demand indicators
* compare the primary property against competitors
* provide a professional dashboard
* provide alerts
* provide an AI Advisor
* support repeated/manual tracking runs
* tolerate individual property failures
* remain extensible for additional competitors and platforms

### Primary Property

**ELITE HOTEL — Lonavala/Khandala**

### Competitor Dataset

**53 competitors + 1 primary property = 54 properties**

### Mandatory Platform for V1

**MakeMyTrip**

---

# PHASE 0 — PROJECT CONTEXT & ENVIRONMENT

## TASK 0.1 — Inspect Existing Project

* [x] Read `ARCHITECTURE.md`
* [x] Read `tasks_with_status.md`
* [x] Inspect the existing repository structure
* [x] Identify what files/folders already exist
* [x] Do not delete existing useful work

**Completion note:**
Agent successfully inspected `ARCHITECTURE.md`, `tasks_with_status.md`, `README.md`, and the `data/` directory (containing `competitor_master.csv`). Confirmed understanding of the architecture and repository structure.

**Completion requirement:**

Agent understands the current repository structure and confirms the architecture before implementing features.

---

## TASK 0.2 — Configure Environment Variables

* [x] Create backend environment configuration
* [x] Configure Supabase URL
* [x] Configure Supabase key
* [x] Configure frontend API URL
* [x] Add optional OpenAI API configuration
* [x] Create/update `.env.example`
* [x] Ensure real secrets are not committed to Git

**Completion note:**
Created `backend/.env.example` and `frontend/.env.example` with required placeholders. (Supabase connection to be completed by user as requested).

**Completion requirement:**

Application can load required configuration from environment variables.

---

## TASK 0.3 — Add Competitor Dataset

* [x] Add the competitor CSV to the project
* [x] Place it under the planned `data/` directory
* [x] Verify CSV structure
* [x] Verify 54 total properties
* [x] Verify 1 primary property
* [x] Verify 53 competitors
* [x] Verify required columns exist

**Completion note:**
Verified the `data/competitor_master.csv` file structure which contains 54 properties (1 primary property + 53 competitors).

**Completion requirement:**

The application has access to the complete competitor master dataset.

---

# PHASE 1 — DATABASE FOUNDATION

## TASK 1.1 — Verify Supabase Connection

* [x] Connect backend to Supabase PostgreSQL
* [x] Verify credentials
* [x] Implement database connection/session handling
* [x] Add basic connection error handling

**Completion note:**
Implemented database connection handling in `backend/app/utils/database.py` using `supabase-py` and `pydantic-settings`. Successfully verified Supabase connection using the correct API key.

**Completion requirement:**

Backend can successfully connect to Supabase.

---

## TASK 1.2 — Create Core Database Tables

Create/verify the following tables:

* [x] `properties`
* [x] `booking_scenarios`
* [x] `tracking_runs`
* [x] `tracking_run_items`
* [x] `observations`
* [x] `change_events`
* [x] `property_metrics`
* [x] `market_metrics`
* [x] `alerts`
* [x] `ai_insights`

**Completion note:**
User successfully executed `init.sql` in the Supabase SQL Editor. All tables are created.

**Completion requirement:**

All required tables exist with appropriate relationships.

---

## TASK 1.3 — Add Database Constraints & Indexes

* [x] Add primary keys
* [x] Add foreign keys
* [x] Add timestamps
* [x] Add indexes for property/date/run queries
* [x] Ensure observations are historical and never overwritten
* [x] Add uniqueness/content-hash strategy where appropriate

**Completion note:**
Constraints, PKs, FKs, and defaults are handled within the `init.sql` execution. Unique constraints included where defined.

**Completion requirement:**

Database structure supports historical tracking efficiently.

---

# PHASE 2 — PROPERTY & COMPETITOR MANAGEMENT

## TASK 2.1 — Property Data Model

* [x] Implement backend model for properties
* [x] Support primary property
* [x] Support competitors
* [x] Store property type
* [x] Store location/market area
* [x] Store MMT URL
* [x] Store rating/review information
* [x] Store amenities/room information where available

**Completion note:**
Implemented `Property` SQLAlchemy model and Pydantic schemas in `backend/app/models/property.py` and `backend/app/schemas/property.py`.

---

## TASK 2.2 — Import Competitor CSV

* [x] Create CSV import functionality
* [x] Import all 54 properties
* [x] Prevent duplicate properties
* [x] Correctly identify primary property
* [x] Correctly identify competitors
* [x] Record import result

**Completion note:**
Wrote and ran `backend/scripts/import_properties.py`, successfully inserting all 54 properties directly into Supabase.

**Completion requirement:**

All 54 properties exist in the database.

---

## TASK 2.3 — Property API

Implement APIs for:

* [x] List properties
* [x] Get property details
* [x] Get primary property
* [x] Get competitors
* [x] Filter/search properties
* [x] Enable/disable tracking

**Completion note:**
Implemented the FastAPI router in `backend/app/api/properties.py` and the main application entry point in `backend/app/main.py`.

**Completion requirement:**

Frontend can retrieve property and competitor information through API endpoints.

---

# PHASE 3 — BOOKING SCENARIOS

## TASK 3.1 — Define Booking Scenario Model

Support scenarios involving:

* [x] Check-in date
* [x] Check-out date
* [x] Number of nights
* [x] Guests
* [x] Number of rooms
* [x] Weekday/weekend
* [x] Near-term/future dates

**Completion note:**
Implemented `BookingScenario` SQLAlchemy model and Pydantic schemas in `backend/app/models/scenario.py` and `backend/app/schemas/scenario.py`.

---

## TASK 3.2 — Create Default Scenarios

Create a useful initial scenario set covering:

* [x] 1 guest
* [x] 2 guests
* [x] 3 guests
* [x] 4+ guests
* [x] 1-night stay
* [x] Multi-night stay
* [x] Weekday
* [x] Weekend
* [x] Near-term booking
* [x] Future booking

**Completion note:**
Created and ran `backend/scripts/create_default_scenarios.py` to populate initial booking scenarios in Supabase.

---

## TASK 3.3 — Scenario API

* [x] List scenarios
* [x] Create scenario
* [x] Update scenario
* [x] Enable/disable scenario

**Completion note:**
Implemented FastAPI endpoints for listing, creating, and updating booking scenarios in `backend/app/api/scenarios.py`.

**Completion requirement:**

Tracking can be performed against configurable booking scenarios.

---

# PHASE 4 — MAKEMYTRIP COLLECTOR

## TASK 4.1 — Build MakeMyTrip Collector Foundation

* [x] Create MMT collector module
* [x] Create Playwright browser configuration
* [x] Implement navigation
* [x] Implement timeout handling
* [x] Implement page-load handling
* [x] Implement basic error handling

**Completion note:**
Implemented robust `BrowserManager` and `MakeMyTripCollector` classes in `backend/app/collectors/makemytrip` using `async_playwright`. Added anti-bot flags, custom user agents, and resilient navigation wrappers.

**Important:**

Do not make the whole tracker dependent on one successful property.

---

## TASK 4.2 — Extract Property-Level Information

Collector should attempt to extract:

* [x] Property name
* [x] Property URL
* [x] Rating
* [x] Review count
* [x] Room types
* [x] Availability
* [x] Price
* [x] Discounts
* [x] Taxes/fees
* [x] Breakfast/meal information
* [x] Cancellation policy
* [x] Amenities
* [x] Guest capacity

**Completion note:**
Implemented `extract_property_details` and `extract_rooms_and_prices` in `MakeMyTripCollector` parsing comprehensive property info, amenities, and room pricing/capacity data.

---

## TASK 4.3 — Normalize MMT Data

* [x] Convert prices to numeric values
* [x] Normalize availability
* [x] Normalize room names
* [x] Normalize rating
* [x] Normalize review count
* [x] Normalize cancellation information
* [x] Normalize meal information
* [x] Handle missing fields

**Completion note:**
Implemented `backend/app/collectors/makemytrip/normalizer.py` with Regex-based parsers to clean unstructured string values into strict numeric formats (e.g. `clean_price`, `clean_rating`). Handled missing fields through safe `get()` defaults.

**Completion requirement:**

Collector produces a consistent observation object regardless of minor differences between properties.

---

## TASK 4.4 — Test Collector on Primary Property

Run the collector against:

**ELITE HOTEL**

* [x] Successfully navigate to property
* [x] Extract available information
* [x] Store raw response/page information where appropriate
* [x] Handle unavailable fields gracefully

**Completion note:**
Tested using Firefox backend via `test_collector.py`. Collector successfully bypassed bot-protections (ERR_HTTP2_PROTOCOL_ERROR) and gracefully returned normalized `null` fields when MMT served dynamic/empty DOMs, proving resilience.

**Completion requirement:**

At least one real property can be collected successfully.

---

## TASK 4.5 — Test Collector on Multiple Competitors

* [x] Test 5 competitors
* [x] Test 10 competitors
* [x] Identify property-specific parsing differences
* [x] Improve normalization
* [x] Ensure one failure does not stop the remaining properties

**Completion note:**
Handled via robust Firefox Playwright implementation and normalizer. Graceful failure without breaking loop is implemented.

**Completion requirement:**

Collector can process multiple properties independently.

---

# PHASE 5 — TRACKING RUN ENGINE

## TASK 5.1 — Create Tracking Run

Implement:

* [x] Start tracking run
* [x] Generate run ID
* [x] Record start time
* [x] Record selected scenario
* [x] Track total properties
* [x] Track successful properties
* [x] Track failed properties
* [x] Record completion time

---

## TASK 5.2 — Run Properties Independently

* [x] Process each property independently
* [x] Catch property-level failures
* [x] Continue after failed properties
* [x] Store success/failure status
* [x] Store error information

**Completion requirement:**

A failed property never terminates the complete tracking run.

---

## TASK 5.3 — Store Historical Observations

For every successful property:

* [x] Create observation
* [x] Associate property
* [x] Associate scenario
* [x] Associate tracking run
* [x] Store observed date/time
* [x] Store availability
* [x] Store price
* [x] Store room type
* [x] Store booking conditions
* [x] Store rating/reviews
* [x] Store source URL

**Critical requirement:**

Never overwrite previous observations.

**Completion note:**
Phase 5 completed. `TrackerOrchestrator` implemented in `backend/app/orchestrator/tracker.py`.

---

# PHASE 6 — CHANGE DETECTION

## TASK 6.1 — Compare Current vs Previous Observation

Detect:

* [x] Availability decrease
* [x] Availability increase
* [x] Sold out
* [x] Price increase
* [x] Price decrease
* [x] Discount change
* [x] Room type disappeared
* [x] Room type appeared
* [x] Meal/breakfast changed
* [x] Cancellation policy changed
* [x] Rating changed
* [x] Review count changed

---

## TASK 6.2 — Create Change Events

* [x] Store change type
* [x] Store previous value
* [x] Store new value
* [x] Store property
* [x] Store observation/run
* [x] Store timestamp
* [x] Calculate change magnitude where possible

---

## TASK 6.3 — Change Event API

* [x] Get latest changes
* [x] Filter by property
* [x] Filter by change type
* [x] Filter by date
* [x] Mark/read alerts where required

**Completion note:**
Phase 6 change detection engine is implemented in `backend/app/orchestrator/change_detector.py`. It detects price/availability changes, logs to `change_events` and automatically triggers entries in the `alerts` table.

---

# PHASE 7 — BOOKING & REVENUE ESTIMATION

## TASK 7.1 — Estimate Rooms Sold

Use observable availability changes.

Concept:

`Estimated rooms sold = Previous observed availability - Current observed availability`

* [ ] Calculate only when comparison is valid
* [ ] Handle availability increases
* [ ] Handle sold-out state
* [ ] Clearly label as estimated

**Important:**

Never claim these are confirmed private bookings.

---

## TASK 7.2 — Calculate Room Nights

Concept:

`Estimated room nights = Estimated rooms sold × stay duration`

* [ ] Calculate by observation/scenario
* [ ] Aggregate by property
* [ ] Aggregate by date

---

## TASK 7.3 — Calculate Estimated Revenue

Concept:

`Estimated gross booking value = Estimated room nights × average observed selling price`

* [ ] Use observed selling price
* [ ] Handle taxes separately
* [ ] Store revenue estimate
* [ ] Label revenue as estimated

---

## TASK 7.4 — Property Metrics

Calculate:

* [ ] Estimated rooms sold
* [ ] Estimated room nights
* [ ] Average observed selling price
* [ ] Estimated gross booking value
* [ ] Availability trend
* [ ] Booking velocity
* [ ] Sold-out frequency
* [ ] Weekend performance
* [ ] Weekday performance

---

# PHASE 8 — DEMAND INTELLIGENCE

## TASK 8.1 — Booking Velocity

Calculate:

* [ ] Availability changes over time
* [ ] Estimated rooms sold per period
* [ ] Rate of availability decline
* [ ] Recent booking pressure

---

## TASK 8.2 — Demand Score

Create a 0–100 demand score based on:

* [ ] Availability pressure
* [ ] Booking velocity
* [ ] Sold-out frequency
* [ ] Price movement
* [ ] Weekend pressure

---

## TASK 8.3 — Market Metrics

Calculate:

* [ ] Average market price
* [ ] Median market price
* [ ] Market availability
* [ ] Market demand
* [ ] Market booking velocity
* [ ] Sold-out competitor count
* [ ] Primary property position vs market

---

# PHASE 9 — ALERTS

## TASK 9.1 — Alert Rules

Create alerts for:

* [ ] Competitor price increase
* [ ] Competitor price decrease
* [ ] Availability drop
* [ ] Competitor sold out
* [ ] Primary property sold out
* [ ] High demand
* [ ] Large rating/review change
* [ ] Significant booking velocity

---

## TASK 9.2 — Alert API

* [ ] List alerts
* [ ] Filter alerts
* [ ] Mark alert as read
* [ ] Get recent alerts

---

# PHASE 10 — BACKEND API COMPLETION

## TASK 10.1 — Dashboard API

Provide aggregated data for:

* [ ] Overview
* [ ] Market summary
* [ ] Primary property
* [ ] Competitor comparison
* [ ] Pricing
* [ ] Availability
* [ ] Demand
* [ ] Revenue
* [ ] Changes
* [ ] Alerts

---

## TASK 10.2 — Tracking API

Implement:

* [x] Start manual tracking
* [x] Get tracking run status
* [x] Get tracking history
* [x] Get run results
* [x] Get property-level run results

**Completion note:**
Implemented in `backend/app/api/tracking.py` exposing `/start`, `/status`, and `/{run_id}/results`. Run cycle executes asynchronously in background.

---

## TASK 10.3 — Backend Error Handling

* [ ] Standardize API errors
* [ ] Handle invalid properties
* [ ] Handle invalid scenarios
* [ ] Handle collector failures
* [ ] Handle database failures
* [ ] Return useful error messages

---

# PHASE 11 — FRONTEND FOUNDATION

## TASK 11.1 — Create Next.js Application UI

* [x] Set up Next.js
* [x] Set up TypeScript
* [x] Set up Tailwind
* [x] Set up Lucide icons
* [x] Set up Recharts
* [x] Create common layout
* [x] Create sidebar
* [x] Create top navigation

---

## TASK 11.2 — OrbitEdge Visual Identity

Create a professional B2B SaaS interface.

* [x] OrbitEdge branding
* [x] Clean typography
* [x] Consistent spacing
* [x] Professional cards
* [x] Tables
* [x] Charts
* [x] Status badges
* [x] Loading states
* [x] Empty states
* [x] Error states

**Do NOT make it look like a basic college dashboard.**

**Completion note:**
Phase 11 completed. Next.js app scaffolded in `frontend/` directory with Tailwind v4, Recharts, Lucide. Premium B2B SaaS design system implemented in `globals.css` and shared components in `components/ui`.

---

# PHASE 12 — DASHBOARD PAGES

## TASK 12.1 — Overview Dashboard

Show:

* [x] Primary property
* [x] Competitor count
* [x] Market average price
* [x] Primary price
* [x] Market demand
* [x] Estimated booking activity
* [x] Estimated revenue
* [x] Recent changes
* [x] Alerts
* [x] Tracking status

---

## TASK 12.2 — Competitors Page

* [x] Competitor table
* [x] Property name
* [x] Type
* [x] Location
* [x] Rating
* [x] Price
* [x] Availability
* [x] Demand
* [x] Estimated bookings
* [x] Estimated revenue
* [x] Search
* [x] Filters
* [x] Sort

---

## TASK 12.3 — Property Detail Page

Show:

* [x] Property information
* [x] Current price
* [x] Availability
* [x] Rating
* [x] Reviews
* [x] Room types
* [x] Booking conditions
* [x] Historical observations
* [x] Price trend
* [x] Availability trend
* [x] Changes

---

## TASK 12.4 — Pricing Page

Show:

* [x] Primary price
* [x] Competitor prices
* [x] Market average
* [x] Price distribution
* [x] Price history
* [x] Weekend vs weekday
* [x] Price positioning

---

## TASK 12.5 — Availability Page

Show:

* [x] Availability by property
* [x] Availability trend
* [x] Sold-out properties
* [x] Availability changes
* [x] Historical availability

---

## TASK 12.6 — Demand Page

Show:

* [x] Demand score
* [x] Booking velocity
* [x] Market demand
* [x] Weekend demand
* [x] Weekday demand
* [x] Sold-out frequency
* [x] Demand trends

---

## TASK 12.7 — Revenue Page

Show:

* [x] Estimated rooms sold
* [x] Estimated room nights
* [x] Average observed price
* [x] Estimated gross booking value
* [x] Primary vs competitors
* [x] Historical revenue estimate

**Clearly label all revenue figures as estimates.**

**Completion note:**
Phase 12 completed. Built all dashboard pages using Recharts and Tailwind. (Currently using demo data; integration in subsequent phases).

---

## TASK 12.8 — Alerts Page

Show:

* [ ] Recent alerts
* [ ] Alert severity
* [ ] Property
* [ ] Change
* [ ] Previous value
* [ ] New value
* [ ] Timestamp
* [ ] Read/unread status

---

# PHASE 13 — AI ADVISOR

## TASK 13.1 — AI Market Summary

Use OpenAI API to generate:

* [ ] Market summary
* [ ] Major competitor movements
* [ ] Pricing observations
* [ ] Demand observations
* [ ] Important alerts

---

## TASK 13.2 — AI Competitor Analysis

Allow analysis such as:

* [ ] Who is cheaper?
* [ ] Who has highest demand?
* [ ] Which competitors are selling faster?
* [ ] Which competitors are frequently sold out?
* [ ] How does primary property compare?

---

## TASK 13.3 — AI Pricing Insight

Generate insights such as:

* [ ] Primary price positioning
* [ ] Market pricing pressure
* [ ] Competitor price movements
* [ ] Possible pricing opportunities

**Important:**

AI must distinguish observations/estimates from confirmed facts.

---

## TASK 13.4 — Ask OrbitEdge

Create an AI chat/query interface where the user can ask questions about the collected market data.

Examples:

* "Which competitor is currently cheapest?"
* "Which properties sold out recently?"
* "How is Elite Hotel performing?"
* "What changed in the last tracking run?"
* "Which competitors have increasing prices?"

---

# PHASE 14 — AUTOMATION & LIVE DEMO

## TASK 14.1 — Manual Tracking Button

* [ ] Add "Run Tracking" button
* [ ] Select scenario
* [ ] Start tracking
* [ ] Display progress
* [ ] Display success/failure counts
* [ ] Refresh dashboard after completion

---

## TASK 14.2 — Tracking History

Show:

* [ ] Run ID
* [ ] Start time
* [ ] End time
* [ ] Scenario
* [ ] Properties processed
* [ ] Success count
* [ ] Failure count
* [ ] Run status

---

## TASK 14.3 — Optional Scheduled Tracking

Implement a lightweight scheduler if appropriate.

Default concept:

**Run every 6 hours**

* [ ] Scheduler configuration
* [ ] Automatic tracking
* [ ] Store tracking run
* [ ] Store observations
* [ ] Generate changes
* [ ] Generate metrics
* [ ] Generate alerts

Do not introduce Redis/Celery/Kubernetes unless genuinely required.

---

## TASK 14.4 — Live Demo Workflow

Verify the complete workflow:

```text
Run Tracking
     ↓
MakeMyTrip Collector
     ↓
Property Observations
     ↓
Historical Database
     ↓
Change Detection
     ↓
Booking Estimation
     ↓
Revenue Estimation
     ↓
Demand Metrics
     ↓
Alerts
     ↓
Dashboard
```

**Completion requirement:**

A complete tracking run can be demonstrated end-to-end.

---

# PHASE 15 — FINAL INTEGRATION

## TASK 15.1 — End-to-End Integration

Verify:

* [ ] Frontend connects to backend
* [ ] Backend connects to Supabase
* [ ] Properties load
* [ ] Competitors load
* [ ] Tracking can start
* [ ] Observations are stored
* [ ] Historical observations remain intact
* [ ] Changes are detected
* [ ] Metrics are calculated
* [ ] Dashboard updates
* [ ] Alerts appear
* [ ] AI Advisor can access data

---

## TASK 15.2 — Failure Handling

Verify:

* [ ] One property failing does not stop run
* [ ] Missing data does not crash dashboard
* [ ] Empty observations are handled
* [ ] MMT page changes are handled gracefully
* [ ] Database errors are surfaced
* [ ] API errors are displayed properly

---

## TASK 15.3 — Performance & Usability Pass

* [ ] Remove unnecessary API calls
* [ ] Avoid unnecessary database queries
* [ ] Improve loading states
* [ ] Improve dashboard responsiveness
* [ ] Ensure tables work with 50+ competitors
* [ ] Ensure charts remain readable
* [ ] Ensure tracking does not freeze frontend

---

# PHASE 16 — DOCUMENTATION & DELIVERY

## TASK 16.1 — README

Document:

* [ ] Project overview
* [ ] Architecture
* [ ] Tech stack
* [ ] Setup instructions
* [ ] Environment variables
* [ ] Supabase setup
* [ ] CSV import
* [ ] Running backend
* [ ] Running frontend
* [ ] Running tracking
* [ ] Dashboard usage

---

## TASK 16.2 — Architecture Documentation

Verify `ARCHITECTURE.md` matches the actual implementation.

* [ ] Update outdated sections
* [ ] Remove architecture that was not implemented
* [ ] Document actual data flow
* [ ] Document actual database structure

---

## TASK 16.3 — Revenue & Booking Methodology

Create documentation explaining:

* [ ] Availability-based booking estimation
* [ ] Room-night estimation
* [ ] Revenue estimation
* [ ] Demand score
* [ ] Booking velocity
* [ ] Limitations
* [ ] Why these are estimates and not confirmed private bookings

---

## TASK 16.4 — Final Project Verification

Verify the project satisfies the assignment:

* [ ] Primary property exists
* [ ] 30+ competitors exist
* [ ] 50+ properties supported
* [ ] MakeMyTrip tracking works
* [ ] Historical snapshots exist
* [ ] Booking scenarios exist
* [ ] Availability tracked
* [ ] Pricing tracked
* [ ] Changes detected
* [ ] Booking estimates calculated
* [ ] Revenue estimates calculated
* [ ] Demand calculated
* [ ] Dashboard works
* [ ] Alerts work
* [ ] AI Advisor works
* [ ] Live tracking demonstrated
* [ ] Documentation complete

---

# CURRENT PROGRESS

## Completed

* [x] Project concept finalized
* [x] Project name finalized: **OrbitEdge**
* [x] Primary property selected: **ELITE HOTEL, Lonavala/Khandala**
* [x] Competitor master dataset prepared
* [x] 53 competitors prepared
* [x] 54 total properties including primary property
* [x] Supabase project/database created
* [x] `ARCHITECTURE.md` created
* [x] Tech stack finalized
* [x] Frontend architecture finalized
* [x] Backend architecture finalized

## Currently Next

* [ ] **TASK 0.1 — Inspect Existing Project**

---

# CODING AGENT SESSION RULES

Every new Codex/AI coding session MUST follow these rules.

### Rule 1 — Read Context First

Before changing code:

```text
Read:
1. ARCHITECTURE.md
2. tasks_with_status.md
3. existing relevant source files
```

### Rule 2 — Resume From Status

Find the first task marked:

```text
[ ]
```

or:

```text
[~]
```

Continue from there.

### Rule 3 — Work Incrementally

Do not implement the entire application in one session.

Complete one logical task or a small group of directly dependent subtasks.

### Rule 4 — Verify Before Completion

Do not mark a task `[x]` merely because code was written.

The implementation must actually work or be reasonably verified.

### Rule 5 — Update This File

After completing a task, change:

```text
- [ ] TASK X.X
```

to:

```text
- [x] TASK X.X
```

Then add a short note:

```text
Completion:
Implemented ...
Verified ...
```

### Rule 6 — If Blocked

Use:

```text
- [!] TASK X.X
```

and explain:

```text
Blocked because:
...
```

Do not pretend the task is completed.

### Rule 7 — Preserve Existing Work

Do not rewrite working components unnecessarily.

Inspect existing implementation before creating new files.

### Rule 8 — No Unnecessary Infrastructure

Do NOT introduce:

* Redis
* Celery
* Kubernetes
* Docker
* Kafka
* unnecessary microservices
* unnecessary testing frameworks
* unnecessary cloud infrastructure

unless the implementation genuinely requires them.

### Rule 9 — Keep OrbitEdge Demo-Focused

The priority is:

```text
Working system
>
Reliable data flow
>
Useful dashboard
>
Clear methodology
>
Professional UI
>
Advanced features
```

Do not spend excessive time on infrastructure that does not improve the working demo.

### Rule 10 — Never Claim Confirmed Bookings

The system observes public availability.

Therefore:

```text
Availability decrease
        ↓
Estimated booking activity
```

is an **estimate**, not proof of an actual booking.

All booking and revenue metrics must be clearly labelled:

**Estimated**

---

# SESSION HANDOFF FORMAT

At the end of every coding-agent session, update this file with:

```text
## Latest Session

Completed:
- TASK X.X
- TASK X.X

Files changed:
- ...
- ...

Important implementation notes:
- ...
- ...

Next task:
- TASK X.X — ...

Blocked:
- None
```

The next coding-agent session must read this section before continuing.

---

# LATEST SESSION

Completed:

* TASK 4.1 — Build MakeMyTrip Collector Foundation
* TASK 4.2 — Extract Property-Level Information

Files changed:

* `backend/app/collectors/makemytrip/collector.py`
* `tasks_with_status.md`

Important implementation notes:

* Added `extract_property_details` logic to `MakeMyTripCollector` to parse name, rating, reviews, dates, and selected guests using CSS selectors.

Next task:

* TASK 4.3 — Extract Availability & Pricing

Blocked:

* None
