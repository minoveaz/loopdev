from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
import os
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# --- CONFIGURACIÓN DE RUTAS ---
current_dir = Path(__file__).resolve().parent
# El archivo reside en el módulo o en la app
env_path = current_dir.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    env_path = current_dir.parent.parent.parent / "apps" / "loopdev-os" / ".env.local"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)

# --- MAPEO INTELIGENTE DE CREDENCIALES ---
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.error(f"❌ FATAL: Credenciales de Supabase no encontradas.")
    # No salimos aquí para permitir que FastAPI muestre el error si es necesario
else:
    logger.info(f"✅ Supabase credentials loaded from {env_path}")

# --- INITIALIZE SUPABASE ---
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# THEN import and initialize the app
from .core.strategy_manager import StrategyManager
from .core.exchange_connector import AsyncExchangeConnector
from .core.backtest_engine import BacktestEngine
from .core.strategy_registry import get_full_registry
from .api.metrics_routes import router as metrics_router, set_strategy_manager
from .api.orders_routes import router as orders_router, set_strategy_manager as set_orders_sm
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(
    title="LoopDev Quant Core",
    description="Industrial Algorithmic Trading Engine",
    version="0.0.1"
)

# Global manager instance with injected client
strategy_manager = StrategyManager(supabase)

# Inject strategy manager into routes
set_strategy_manager(strategy_manager)
set_orders_sm(strategy_manager)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(metrics_router)
app.include_router(orders_router)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing Quant Core Engine (Tiers B & C)...")
    # Start the strategy manager background task (renamed from start to run)
    asyncio.create_task(strategy_manager.run())
    logger.success("Quant Core Engine Operational & Syncing with DB")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Quant Core Engine...")
    strategy_manager.stop()
    logger.success("Quant Core Engine Stopped Safely")

# --- MODELS ---
class ExchangeTestRequest(BaseModel):
    exchangeId: str
    apiKey: str
    apiSecret: str
    isPaper: bool = True

class BacktestRequest(BaseModel):
    strategyName: str
    pairs: List[str]
    sizePerTrade: float = 100.0
    maxPositions: int = 5
    stopLoss: float = 2.0  # % below entry
    takeProfit: float = 5.0  # % above entry
    days: int = 30
    initialCapital: float = 10000.0

@app.get("/health")
async def health_check():
    return {
        "status": "operational",
        "version": "0.0.1",
        "engine": "active"
    }

@app.get("/strategies/registry")
async def get_strategy_registry():
    """
    Returns the official catalog of trading protocols and their parameters.
    """
    return {"success": True, "registry": get_full_registry()}

@app.post("/exchanges/test")
async def test_exchange_connection(req: ExchangeTestRequest):
    logger.info(f"Testing connection for {req.exchangeId} (Paper: {req.isPaper})...")
    
    # Pass arguments POSITIONALLY: exchange_id, api_key, api_secret, paper_mode
    connector = AsyncExchangeConnector(
        req.exchangeId,
        req.apiKey,
        req.apiSecret,
        req.isPaper
    )
    
    try:
        await connector.connect()
        logger.info(f"Connected to {req.exchangeId}, now fetching balance...")
        
        balance = await connector.fetch_balance()
        
        if isinstance(balance, dict) and "error" in balance:
            error_msg = balance["error"]
            logger.error(f"Balance fetch failed: {error_msg}")
            return {"success": False, "error": error_msg}
        
        if not balance:
            logger.error("Failed to fetch balance - credentials may be invalid")
            return {"success": False, "error": "Invalid API credentials or insufficient permissions"}
            
        logger.success(f"Successfully authenticated and fetched balance for {req.exchangeId}")
        return {
            "success": True, 
            "message": "Connection verified successfully.",
            "account_info": "Authorized"
        }
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Test connection failed: {error_msg}")
        return {"success": False, "error": error_msg}
    finally:
        await connector.close()

@app.post("/strategies/backtest")
async def run_strategy_backtest(req: BacktestRequest):
    """
    Run a backtest simulation for a strategy.
    Returns historical P&L, win rate, drawdown, and other metrics.
    """
    logger.info(f"Starting backtest for strategy: {req.strategyName}")
    logger.info(f"Parameters: pairs={req.pairs}, size={req.sizePerTrade}, days={req.days}")
    
    try:
        engine = BacktestEngine(
            initial_capital=req.initialCapital,
            daily_loss_limit=10.0
        )
        
        result = await engine.run_backtest(
            strategy_name=req.strategyName,
            pairs=req.pairs,
            size_per_trade=req.sizePerTrade,
            stop_loss=req.stopLoss,
            take_profit=req.takeProfit,
            days=req.days
        )
        
        return {
            "success": True,
            "message": f"Backtest completed successfully",
            "result": {
                "strategyName": req.strategyName,
                "backtestPeriodDays": req.days,
                "totalTrades": result.total_trades,
                "winningTrades": result.winning_trades,
                "losingTrades": result.losing_trades,
                "winRate": result.win_rate,
                "totalReturn": result.total_return,
                "maxDrawdown": result.max_drawdown,
                "avgWin": result.avg_win,
                "avgLoss": result.avg_loss,
                "profitFactor": result.profit_factor,
                "sharpeRatio": result.sharpe_ratio,
                "initialCapital": result.initial_capital,
                "finalCapital": result.final_capital,
                "trades": result.trades
            }
        }
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Backtest failed: {error_msg}")
        return {"success": False, "error": error_msg}

if __name__ == "__main__":
    import uvicorn
    import socket
    
    port = 8000
    max_attempts = 10
    for attempt in range(max_attempts):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            result = sock.connect_ex(('127.0.0.1', port))
            sock.close()
            if result != 0: break
            port += 1
        except Exception:
            break
    
    try:
        logger.info(f"🚀 Starting Quant Core Engine on port {port}...")
        uvicorn.run(app, host="0.0.0.0", port=port)
    except Exception as e:
        if "Address already in use" in str(e):
            logger.error(f"❌ Port {port} is in use.")
        else:
            logger.error(f"❌ Failed to start server: {e}")
        raise
