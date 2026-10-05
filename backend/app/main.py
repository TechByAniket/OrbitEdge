from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import properties, scenarios, tracking, alerts, analytics, ai_advisor

app = FastAPI(
    title="OrbitEdge API",
    description="Backend API for OrbitEdge competitor tracking",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, restrict in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(properties.router, prefix="/api/properties", tags=["Properties"])
app.include_router(scenarios.router, prefix="/api/scenarios", tags=["Scenarios"])
app.include_router(tracking.router, prefix="/api/tracking", tags=["Tracking"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(ai_advisor.router, prefix="/api/ai", tags=["AI Advisor"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
