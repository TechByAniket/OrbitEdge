# OrbitEdge - Hotel Competitive Intelligence Platform

OrbitEdge is a specialized B2B SaaS platform for hotel revenue management. It actively tracks competitors in the Lonavala/Khandala region to provide live pricing, availability pressure, demand scores, revenue estimates, and AI-driven market insights.

## System Architecture

OrbitEdge is built using a modern, decoupled tech stack designed for automated intelligence:

- **Frontend**: Next.js 14 App Router, Tailwind CSS v4, Recharts, Lucide Icons.
- **Backend**: FastAPI (Python 3.12), asyncio.
- **Database**: Supabase (PostgreSQL) handling all persistent relational data.
- **Scraping Engine**: Playwright (Headless browser automation) via `MakeMyTripCollector`.
- **AI Intelligence**: `google.generativeai` connected to the `gemini-3.5-flash-lite` model for real-time natural language revenue advisory.

## Prerequisites

1. Node.js 18+ 
2. Python 3.12+
3. A Supabase Project
4. Gemini API Key (`GEMINI_API_KEY`)

## Setup Instructions

### 1. Database Setup (Supabase)
1. Go to your Supabase project's SQL Editor.
2. Run the full script provided in `init.sql` to generate all tables (`properties`, `competitors`, `tracking_runs`, `observations`, etc.).
3. Obtain your Supabase URL and Service Role Key.

### 2. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # On Windows
pip install -r requirements.txt
playwright install
```

Create a `.env` file in the `backend` directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Running the Application

**Start the Backend Server (Terminal 1):**
```bash
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload
```

**Start the Frontend App (Terminal 2):**
```bash
cd frontend
npm run dev
```

The dashboard will be available at `http://localhost:3000`.

## Automated Data Tracking

OrbitEdge collects data using an asynchronous Playwright scraper (`TrackerOrchestrator`). 
To start a tracking run:
1. Navigate to the **Overview** page on the Frontend.
2. Click the **Run Tracking** button in the top right.
3. The backend will spawn headless browsers to scrape MakeMyTrip, calculate demand metrics, trigger revenue alerts, and generate fresh AI insights.
4. View the history of all tracking operations on the `/tracking` page.

## AI Advisor System

The AI Advisor uses live SQL database queries combined with Gemini 3.5 Flash Lite to recommend rate changes and identify pricing opportunities. It prevents extreme discounting during inelastic demand periods and helps the primary property optimize Average Daily Rate (ADR) relative to market average.
