from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
import os
import asyncio
from dotenv import load_dotenv
from .core.strategy_manager import StrategyManager

load_dotenv()

app = FastAPI(
    title="LoopDev Quant Core",
    description="Industrial Algorithmic Trading Engine",
    version="0.0.1"
)

# Global manager instance
strategy_manager = StrategyManager()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing Quant Core Engine...")
    # Start the strategy manager background task
    asyncio.create_task(strategy_manager.start())
    logger.success("Quant Core Engine Operational & Syncing with DB")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Quant Core Engine...")
    strategy_manager.stop()
    logger.success("Quant Core Engine Stopped Safely")

@app.get("/health")
async def health_check():
    return {
        "status": "operational",
        "version": "0.0.1",
        "engine": "active"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
