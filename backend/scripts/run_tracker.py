import asyncio
import logging
from app.orchestrator.tracker import TrackerOrchestrator

# Configure standard logging to show output in the terminal
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

async def main():
    print("==================================================")
    print("Starting Real-Time MakeMyTrip Data Collection...")
    print("==================================================")
    
    orchestrator = TrackerOrchestrator()
    await orchestrator.run_tracking_cycle()
    
    print("==================================================")
    print("Tracking Cycle Complete! Real data is now live.")
    print("==================================================")

if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    asyncio.run(main())
