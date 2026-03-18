import asyncio
from loguru import logger
from typing import Dict, List, Optional
from supabase import create_client, Client
import os
from pathlib import Path
from dotenv import load_dotenv
import pandas as pd
from datetime import datetime, timezone
import uuid

from .exchange_connector import AsyncExchangeConnector
from .strategy_registry import STRATEGY_REGISTRY
from ..strategies.intraday_atr import IntradayATRStrategy
from ..strategies.hybrid_core import HybridCoreStrategy
from ..strategies.rsi_mean_reversion import RSIMeanReversionStrategy

class StrategyManager:
    """
    Industrial Orchestrator for Live Paper Trading.
    Syncs bots from Supabase and executes strategy loops.
    """
    
    def __init__(self):
        env_path = Path(__file__).parent.parent.parent / ".env"
        load_dotenv(dotenv_path=env_path)
        
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        self.supabase: Client = create_client(self.url, self.key)
        
        self.active_bots = {} 
        self.is_running = False
        self.risk_settings = None
        
        self.strategies = {
            "atr-breakout-v1": IntradayATRStrategy(),
            "hybrid-core-v1": HybridCoreStrategy(),
            "rsi-mean-rev-v1": RSIMeanReversionStrategy()
        }

    async def fetch_risk_settings(self):
        """Fetch global risk governance from Supabase."""
        try:
            res = self.supabase.table("quant_risk_settings").select("*").eq("tenant_id", "00000000-0000-0000-0000-000000000000").single().execute()
            self.risk_settings = res.data
        except Exception: pass

    async def update_bot_state(self, bot_id: str, action: str, snapshot: dict = None, exit_targets: dict = None, pnl: dict = None, entry_price: float = 0.0, opened_at: str = None):
        """Persists the complete bot state to the database."""
        try:
            payload = {
                "current_action": action,
                "current_entry_price": entry_price
            }
            if opened_at: payload["current_position_opened_at"] = opened_at
            if snapshot: payload["last_logic_snapshot"] = snapshot
            if exit_targets: payload["last_exit_targets"] = exit_targets
            
            if pnl:
                payload["current_pnl_pct"] = pnl.get("pct", 0.0)
                payload["current_pnl_usdt"] = pnl.get("usdt", 0.0)
            
            self.supabase.table("quant_bots").update(payload).eq("id", bot_id).execute()
        except Exception: pass

    async def create_virtual_order(self, bot_data: dict, side: str, price: float, quantity: float, reason: str):
        """Creates a virtual order in the 'quant_orders' table."""
        try:
            order_id = str(uuid.uuid4())
            payload = {
                "id": order_id,
                "tenant_id": bot_data['tenant_id'],
                "bot_id": bot_data['id'],
                "side": side,
                "type": "market",
                "status": "filled",
                "quantity": quantity,
                "price": price,
                "filled_quantity": quantity,
                "average_fill_price": price,
                "signal_source": reason,
                "exchange_order_id": f"VIRTUAL_{order_id[:8]}"
            }
            self.supabase.table("quant_orders").insert(payload).execute()
            logger.success(f"[{bot_data['name']}] VIRTUAL ORDER: {side.upper()} {quantity:.6f} @ ${price:.2f} ({reason})")
            return order_id
        except Exception as e:
            logger.error(f"Failed to create virtual order: {e}")
            return None

    async def manage_position(self, bot_data: dict, current_price: float, snapshot: dict):
        """Checks if there's an open position and manages exits (TP/SL)."""
        bot_id = bot_data['id']
        bot_name = bot_data['name']
        
        try:
            res = self.supabase.table("quant_positions").select("*").eq("bot_id", bot_id).execute()
            if not res.data:
                return None
            
            position = res.data[0]
            entry_price = float(position['entry_price'])
            opened_at = position.get('created_at', datetime.now(timezone.utc).isoformat())
            qty = float(position['total_quantity'])
            
            pnl_pct = ((current_price - entry_price) / entry_price) * 100
            pnl_usdt = (current_price - entry_price) * qty
            pnl_data = {"pct": round(pnl_pct, 2), "usdt": round(pnl_usdt, 2)}
            
            risk = bot_data.get('risk_profile', {})
            sl_pct = float(risk.get('globalStopLossPct', 5.0))
            tp_pct = 3.0 
            
            sl_price = entry_price * (1 - (sl_pct / 100))
            tp_price = entry_price * (1 + (tp_pct / 100))
            exit_targets = {"sl_price": round(sl_price, 2), "tp_price": round(tp_price, 2)}
            
            if current_price <= sl_price:
                await self.update_bot_state(bot_id, f"EXITING: STOP_LOSS", snapshot, {}, pnl_data, 0.0, None)
                await self.create_virtual_order(bot_data, 'sell', current_price, qty, "STOP_LOSS")
                self.supabase.table("quant_positions").delete().eq("id", position['id']).execute()
                # Also reset opened_at in bot table
                self.supabase.table("quant_bots").update({"current_position_opened_at": None}).eq("id", bot_id).execute()
                return None
            elif current_price >= tp_price:
                await self.update_bot_state(bot_id, f"EXITING: TAKE_PROFIT", snapshot, {}, pnl_data, 0.0, None)
                await self.create_virtual_order(bot_data, 'sell', current_price, qty, "TAKE_PROFIT")
                self.supabase.table("quant_positions").delete().eq("id", position['id']).execute()
                self.supabase.table("quant_bots").update({"current_position_opened_at": None}).eq("id", bot_id).execute()
                return None
            
            logger.info(f"[{bot_name}] In Position | PnL: {pnl_pct:+.2f}% | SL: ${sl_price:.2f} | TP: ${tp_price:.2f}")
            await self.update_bot_state(bot_id, f"In Position | PnL: {pnl_pct:+.2f}%", snapshot, exit_targets, pnl_data, entry_price, opened_at)
            return position
            
        except Exception as e:
            logger.error(f"Position management error: {e}")
            return None

    async def sync_bots_from_db(self):
        """Fetch active bots and start/stop their loops."""
        try:
            await self.fetch_risk_settings()
            if self.risk_settings and self.risk_settings.get('kill_switch_active'):
                for tid in list(self.active_bots.keys()):
                    self.active_bots[tid].cancel()
                    del self.active_bots[tid]
                return

            response = self.supabase.table("quant_bots").select("*, quant_strategies(core_id)").in_("status", ["active", "paper_trading"]).execute()
            active_db_bots = {bot["id"]: bot for bot in response.data}
            
            for bot_id in list(self.active_bots.keys()):
                if bot_id not in active_db_bots:
                    self.active_bots[bot_id].cancel()
                    del self.active_bots[bot_id]
            
            for bot_id, bot_data in active_db_bots.items():
                if bot_id not in self.active_bots:
                    task = asyncio.create_task(self.bot_execution_loop(bot_data))
                    self.active_bots[bot_id] = task
        except Exception as e:
            logger.error(f"Sync error: {e}")

    async def bot_execution_loop(self, bot_data):
        """Continuous execution loop with technical snapshots."""
        bot_id = bot_data['id']
        bot_name = bot_data['name']
        pair = bot_data['pair']
        
        strategy_info = bot_data.get('quant_strategies')
        core_id = strategy_info.get('core_id', 'atr-breakout-v1') if strategy_info else 'atr-breakout-v1'
        strategy = self.strategies.get(core_id, self.strategies['atr-breakout-v1'])
        
        connector = AsyncExchangeConnector('binance', 'PAPER_KEY', 'PAPER_SECRET', True)
        
        try:
            await connector.connect()
            while True:
                ohlcv = await connector.exchange.fetch_ohlcv(pair, timeframe='1m', limit=100)
                df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
                last_bar = df.iloc[-1]
                current_price = float(last_bar['close'])
                
                df = strategy.analyze(df)
                last_row = df.iloc[-1]
                
                snapshot = { "price": round(current_price, 2) }
                if 'sma20' in last_row and not pd.isna(last_row['sma20']): snapshot["sma20"] = round(float(last_row['sma20']), 2)
                if 'atr' in last_row and not pd.isna(last_row['atr']): snapshot["atr"] = round(float(last_row['atr']), 4)

                position = await self.manage_position(bot_data, current_price, snapshot)
                
                if not position:
                    signal = strategy.check_signal(last_row, df.iloc[-2])
                    if signal and signal['side'] == 'buy':
                        now_str = datetime.now(timezone.utc).isoformat()
                        qty = float(bot_data['base_investment_usdt']) / current_price
                        await self.create_virtual_order(bot_data, 'buy', current_price, qty, signal['reason'])
                        self.supabase.table("quant_positions").insert({
                            "tenant_id": bot_data['tenant_id'], "bot_id": bot_id, "pair": pair, "entry_price": current_price,
                            "average_price": current_price, "total_quantity": qty, "total_invested_usdt": bot_data['base_investment_usdt'],
                            "created_at": now_str
                        }).execute()
                        await self.update_bot_state(bot_id, "EXECUTING VIRTUAL BUY...", snapshot, {}, {"pct": 0, "usdt": 0}, current_price, now_str)
                    else:
                        await self.update_bot_state(bot_id, f"Awaiting Signal ({pair} @ ${current_price})", snapshot, {}, {"pct": 0, "usdt": 0}, 0.0, None)
                
                await asyncio.sleep(60)
        except asyncio.CancelledError: logger.info(f"Loop stopped for {bot_name}")
        except Exception as e: logger.error(f"Critical error in {bot_name}: {e}")
        finally: await connector.close()

    async def start(self):
        self.is_running = True
        logger.info("Quant Core Orchestrator Online.")
        while self.is_running:
            await self.sync_bots_from_db()
            await asyncio.sleep(10)
