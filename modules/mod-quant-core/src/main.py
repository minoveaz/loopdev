from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
import os
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# --- CONFIGURACIÓN DE RUTAS ---
current_dir = Path(__file__).resolve().parent
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

# Importamos modelos industriales
from .core.models.trading import (
    ExchangeTestRequest, 
    BacktestRequest, 
    BalanceResponse, 
    AssetBalance, 
    AuditSessionResponse, 
    AuditEvent, 
    CandleData
)

import pandas as pd

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
    asyncio.create_task(strategy_manager.run())
    logger.success("Quant Core Engine Operational & Syncing with DB")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Quant Core Engine...")
    strategy_manager.stop()
    logger.success("Quant Core Engine Stopped Safely")

@app.get("/exchanges/{account_id}/balance", response_model=BalanceResponse)
async def get_exchange_balance(account_id: str):
    """
    Recupera el balance real del exchange y calcula el capital disponible neto.
    Lógica Industrial: Total Exchange - Capital Comprometido en Bots = Disponible.
    """
    logger.info(f"Vault: Fetching real-time balance for account {account_id}...")
    
    creds = await strategy_manager.vault.get_exchange_credentials(account_id)
    if not creds:
        raise HTTPException(status_code=404, detail="Exchange account not found or vault decryption failed.")
    
    connector = AsyncExchangeConnector(
        creds['exchange_id'],
        creds['api_key'],
        creds['api_secret'],
        creds['is_paper']
    )
    
    try:
        await connector.connect()
        balance_data = await connector.fetch_balance()
        
        if not balance_data["success"]:
            return {"success": False, "exchange_id": creds['exchange_id'], "balances": [], "total_usdt_equiv": 0, "available_trading_usdt": 0}

        bots_res = supabase.table("quant_bots")\
            .select("base_investment_usdt")\
            .eq("exchange_id", account_id)\
            .neq("status", "paused")\
            .execute()
        
        committed_capital = sum([float(b['base_investment_usdt'] or 0) for b in bots_res.data])
        
        asset_balances = [AssetBalance(**a) for a in balance_data["assets"]]
        usdt_balance = next((a.free for a in asset_balances if a.asset == 'USDT'), 0.0)
        
        available = max(0, usdt_balance - committed_capital)
        
        return {
            "success": True,
            "exchange_id": creds['exchange_id'],
            "balances": asset_balances,
            "total_usdt_equiv": usdt_balance,
            "available_trading_usdt": available
        }
        
    except Exception as e:
        logger.error(f"Balance API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await connector.close()

@app.get("/bots/{bot_id}/audit-session", response_model=AuditSessionResponse)
async def get_bot_audit_session(bot_id: str):
    """
    Agregador Industrial de Sesión de Trade.
    Une velas de mercado con hitos de decisión para reconstrucción visual.
    """
    try:
        # 1. Recuperar info básica del bot
        bot_res = supabase.table("quant_bots").select("*").eq("id", bot_id).execute()
        if not bot_res.data:
            raise HTTPException(status_code=404, detail="Bot not found")
        bot_data = bot_res.data[0]
        pair = bot_data['pair']

        # 2. Localizar eventos recientes
        audit_res = supabase.table("quant_audit_logs")\
            .select("*")\
            .eq("bot_id", bot_id)\
            .order("created_at", desc=True)\
            .limit(100)\
            .execute()
        
        events = audit_res.data
        if not events:
            return {
                "success": True, "bot_id": bot_id, "pair": pair, "side": None, 
                "entry_price": 0, "entry_time": None, "exit_time": None, 
                "candles": [], "events": [], "performance": {}
            }

        # Encontrar el ENTRY (hito de inicio de la sesión actual)
        entry_event = next((e for e in reversed(events) if e['event_type'] == 'ENTRY'), events[-1])
        entry_time = pd.to_datetime(entry_event['created_at']).tz_convert('UTC')
        
        # Margen visual de 15 minutos antes para ver el contexto
        start_fetch = (entry_time - pd.Timedelta(minutes=15)).isoformat()
        
        # 3. Recuperar Velas del periodo
        # Siempre usamos 'production' para el visualizador para coincidir con el SignalEngine
        env = 'production'
        market_res = supabase.table("quant_market_history")\
            .select("*")\
            .eq("pair", pair)\
            .eq("environment", env)\
            .gte("timestamp", start_fetch)\
            .order("timestamp", asc=True)\
            .execute()
        
        candles = [
            CandleData(
                t=c['timestamp'],
                o=strategy_manager.risk.from_cents(c['open']),
                h=strategy_manager.risk.from_cents(c['high']),
                l=strategy_manager.risk.from_cents(c['low']),
                c=strategy_manager.risk.from_cents(c['close']),
                v=float(c['volume'] or 0)
            ) for c in market_res.data
        ]

        # 4. Mapear Eventos tipados
        mapped_events = [
            AuditEvent(
                id=str(e['id']),
                event_type=e['event_type'],
                side=e['side'],
                price=strategy_manager.risk.from_cents(e['price']),
                pnl_pct=float(e['pnl_pct'] or 0),
                logic_snapshot=e['logic_snapshot'] or {},
                created_at=e['created_at']
            ) for e in events
        ]

        # 5. Cálculo de Performance
        perf = {
            "is_active": bot_data['current_entry_price'] > 0,
            "event_count": len(events)
        }

        return {
            "success": True,
            "bot_id": bot_id,
            "pair": pair,
            "side": bot_data.get('current_position_side'),
            "entry_price": strategy_manager.risk.from_cents(bot_data.get('current_entry_price', 0)),
            "entry_time": entry_event['created_at'],
            "exit_time": events[0]['created_at'] if events[0]['event_type'] == 'EXIT' else None,
            "candles": candles,
            "events": mapped_events,
            "performance": perf
        }

    except Exception as e:
        logger.error(f"Audit Session Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

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
    logger.info(f"Vault: Testing secure connection for account {req.exchangeAccountId}...")
    
    creds = await strategy_manager.vault.get_exchange_credentials(req.exchangeAccountId)
    
    if not creds:
        return {"success": False, "error": "Could not retrieve or decrypt credentials from Vault."}
    
    connector = AsyncExchangeConnector(
        creds['exchange_id'],
        creds['api_key'],
        creds['api_secret'],
        creds['is_paper']
    )
    
    try:
        await connector.connect()
        balance = await connector.fetch_balance()
        
        if isinstance(balance, dict) and not balance.get("success", True):
            return {"success": False, "error": balance.get("error", "Unknown error")}
            
        return {
            "success": True, 
            "message": "Vault connection verified successfully.",
            "account_info": "Authorized"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
    finally:
        await connector.close()

@app.post("/strategies/backtest")
async def run_strategy_backtest(req: BacktestRequest):
    """
    Run a backtest simulation for a strategy.
    Returns historical P&L, win rate, drawdown, and other metrics.
    """
    logger.info(f"Starting backtest for strategy: {req.strategyName}")
    
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
