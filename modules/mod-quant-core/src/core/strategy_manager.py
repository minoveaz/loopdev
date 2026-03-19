import asyncio
from loguru import logger
from typing import Dict, List, Optional, TypeVar, Callable, Any
from supabase import create_client, Client
import os
from pathlib import Path
from dotenv import load_dotenv
import pandas as pd
from datetime import datetime, timezone
import uuid
import socket

from .exchange_connector import AsyncExchangeConnector
from .strategy_registry import STRATEGY_REGISTRY
from ..strategies.intraday_atr import IntradayATRStrategy
from ..strategies.hybrid_core import HybridCoreStrategy

T = TypeVar('T')

class StrategyManager:
    """
    Industrial Orchestrator for Live Paper Trading.
    Syncs bots from Supabase and executes strategy loops with Institutional Analytics.
    """
    
    def __init__(self):
        env_path = Path(__file__).parent.parent.parent / ".env"
        load_dotenv(dotenv_path=env_path)
        
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        self.supabase: Client = create_client(self.url, self.key)
        
        self.active_bots = {}  # bot_id -> asyncio.Task
        self.active_bot_data = {}  # bot_id -> bot_data (for metrics API access)
        self.is_running = False
        self.risk_settings = None
        
        self.strategies = {
            "atr-breakout-v1": IntradayATRStrategy(),
            "hybrid-core-v1": HybridCoreStrategy()
        }
        
        self.db_retry_config = {
            'max_retries': 3,
            'base_delay': 1.0,
            'max_delay': 10.0,
            'backoff_multiplier': 2.0
        }

    async def _retry_with_backoff(
        self, 
        func: Callable[..., Any], 
        *args,
        operation_name: str = "DB operation",
        **kwargs
    ) -> Optional[Any]:
        """Execute function with exponential backoff retry logic for network issues."""
        config = self.db_retry_config
        retry_count = 0
        last_error = None
        
        while retry_count <= config['max_retries']:
            try:
                return await func(*args, **kwargs) if asyncio.iscoroutinefunction(func) else func(*args, **kwargs)
            except (socket.gaierror, TimeoutError, ConnectionError, OSError) as e:
                last_error = e
                retry_count += 1
                
                if retry_count > config['max_retries']:
                    logger.error(
                        f"{operation_name} failed after {config['max_retries']} retries: {e}. "
                        f"Error type: {type(e).__name__}"
                    )
                    return None
                
                delay = min(
                    config['base_delay'] * (config['backoff_multiplier'] ** (retry_count - 1)),
                    config['max_delay']
                )
                logger.warning(
                    f"{operation_name} failed (attempt {retry_count}/{config['max_retries']}): {e}. "
                    f"Retrying in {delay:.1f}s..."
                )
                await asyncio.sleep(delay)
            except Exception as e:
                logger.error(f"{operation_name} failed with unexpected error: {e}")
                return None
        
        return None

    async def fetch_risk_settings(self):
        """Fetch global risk governance from Supabase with retry logic."""
        async def _fetch():
            res = self.supabase.table("quant_risk_settings").select("*").eq("tenant_id", "00000000-0000-0000-0000-000000000000").single().execute()
            self.risk_settings = res.data
        
        await self._retry_with_backoff(_fetch, operation_name="fetch_risk_settings")

    async def update_bot_state(self, bot_id: str, payload: dict):
        """Persists the complete bot state to the database with retry logic.
        
        Only updates fields that are known to exist in the quant_bots table.
        Silently filters unknown fields to maintain resilience.
        """
        # Conservative list of fields confirmed to exist in quant_bots
        # Based on: Supabase schema inspection
        allowed_fields = {
            # Core fields
            'id', 'tenant_id', 'name', 'pair', 'status', 'created_at', 'updated_at',
            
            # Investment configuration
            'base_investment_usdt',
            
            # Strategy & execution state  
            'current_action', 'current_entry_price', 'current_pnl_pct', 'current_pnl_usdt',
            'current_position_opened_at', 'last_exit_targets', 'last_logic_snapshot',
            
            # Optional monitoring fields (may or may not exist)
            'last_signal', 'signal_strength',
        }
        
        # Filter payload to only include allowed fields
        filtered_payload = {k: v for k, v in payload.items() if k in allowed_fields}
        
        # Log fields that were filtered out (DEBUG level)
        filtered_out = set(payload.keys()) - set(filtered_payload.keys())
        if filtered_out:
            logger.debug(f"Filtered out unknown fields for bot {bot_id}: {filtered_out}")
        
        if not filtered_payload:
            logger.debug(f"No valid fields to update for bot {bot_id} from payload: {list(payload.keys())}")
            return
        
        async def _update():
            self.supabase.table("quant_bots").update(filtered_payload).eq("id", bot_id).execute()
        
        await self._retry_with_backoff(_update, operation_name=f"update bot state for {bot_id}")

    async def get_macro_sentiment(self, connector, pair: str):
        """Analyzes the 4h trend to determine macro sentiment."""
        try:
            ohlcv = await connector.exchange.fetch_ohlcv(pair, timeframe='4h', limit=20)
            df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
            sma = df['close'].rolling(20).mean().iloc[-1]
            price = df['close'].iloc[-1]
            if pd.isna(sma): return 'neutral'
            return 'bullish' if price > sma else 'bearish'
        except Exception: return 'neutral'

    async def create_virtual_order(self, bot_data: dict, side: str, price: float, quantity: float, reason: str):
        """Creates a virtual order in the 'quant_orders' table with retry logic."""
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
        
        async def _insert():
            self.supabase.table("quant_orders").insert(payload).execute()
        
        result = await self._retry_with_backoff(_insert, operation_name=f"create virtual order for {bot_data['name']}")
        
        if result is not None:
            logger.success(f"[{bot_data['name']}] VIRTUAL ORDER: {side.upper()} {quantity:.6f} @ ${price:.2f}")
            return order_id
        else:
            logger.error(f"Failed to create virtual order for {bot_data['name']}")
            return None

    async def manage_position(self, bot_data: dict, current_price: float, snapshot: dict):
        """Checks if there's an open position and manages exits (TP/SL) with retry logic."""
        bot_id = bot_data['id']
        bot_name = bot_data['name']
        
        async def _fetch_position():
            res = self.supabase.table("quant_positions").select("*").eq("bot_id", bot_id).execute()
            return res.data[0] if res.data else None
        
        try:
            position = await self._retry_with_backoff(
                _fetch_position, 
                operation_name=f"fetch position for {bot_name}"
            )
            
            if position is None:
                return None, 0.0
            
            entry_price = float(position['entry_price'])
            qty = float(position['total_quantity'])
            
            pnl_pct = ((current_price - entry_price) / entry_price) * 100
            pnl_usdt = (current_price - entry_price) * qty
            
            # Risk Logic
            risk = bot_data.get('risk_profile', {})
            sl_pct = float(risk.get('globalStopLossPct', 5.0))
            tp_pct = 3.0 
            
            sl_price = entry_price * (1 - (sl_pct / 100))
            tp_price = entry_price * (1 + (tp_pct / 100))
            
            # Break-even Point (Entry + 0.2% to cover buy/sell fees)
            be_price = entry_price * 1.002
            
            exit_targets = {
                "sl_price": round(sl_price, 2), 
                "tp_price": round(tp_price, 2),
                "be_price": round(be_price, 2)
            }
            
            if current_price <= sl_price:
                await self.update_bot_state(bot_id, {
                    "current_action": "EXITING: STOP_LOSS",
                    "current_entry_price": 0,
                    "current_quantity": 0,
                    "last_exit_targets": {}
                })
                await self.create_virtual_order(bot_data, 'sell', current_price, qty, "STOP_LOSS")
                
                async def _delete_sl():
                    self.supabase.table("quant_positions").delete().eq("id", position['id']).execute()
                
                await self._retry_with_backoff(_delete_sl, operation_name=f"delete position for {bot_name}")
                return None, 0.0
            elif current_price >= tp_price:
                await self.update_bot_state(bot_id, {
                    "current_action": "EXITING: TAKE_PROFIT",
                    "current_entry_price": 0,
                    "current_quantity": 0,
                    "last_exit_targets": {}
                })
                await self.create_virtual_order(bot_data, 'sell', current_price, qty, "TAKE_PROFIT")
                
                async def _delete_tp():
                    self.supabase.table("quant_positions").delete().eq("id", position['id']).execute()
                
                await self._retry_with_backoff(_delete_tp, operation_name=f"delete position for {bot_name}")
                return None, 0.0
            
            # Update position in bot table
            await self.update_bot_state(bot_id, {
                "current_action": f"In Position | PnL: {pnl_pct:+.2f}%",
                "current_pnl_pct": round(pnl_pct, 2),
                "current_pnl_usdt": round(pnl_usdt, 2),
                "current_entry_price": entry_price,
                "current_quantity": qty,
                "current_position_opened_at": position.get('created_at'),
                "last_exit_targets": exit_targets,
                "last_logic_snapshot": snapshot
            })
            
            return position, qty
            
        except Exception as e:
            logger.error(f"Position management error: {e}", exc_info=True)
            return None, 0.0

    async def sync_bots_from_db(self):
        """Fetch active bots and start/stop their loops with retry logic."""
        async def _fetch_bots():
            response = self.supabase.table("quant_bots").select("*, quant_strategies(core_id)").in_("status", ["active", "paper_trading"]).execute()
            return {bot["id"]: bot for bot in response.data}
        
        try:
            await self.fetch_risk_settings()
            if self.risk_settings and self.risk_settings.get('kill_switch_active'):
                logger.warning("Kill switch activated, stopping all bots")
                for tid in list(self.active_bots.keys()):
                    self.active_bots[tid].cancel()
                    del self.active_bots[tid]
                    self.active_bot_data.pop(tid, None)  # Cleanup data too
                return
            
            active_db_bots = await self._retry_with_backoff(
                _fetch_bots, 
                operation_name="fetch active bots from DB"
            )
            
            if active_db_bots is None:
                logger.error("Could not fetch bots from database after retries")
                return
            
            for bot_id in list(self.active_bots.keys()):
                if bot_id not in active_db_bots:
                    logger.info(f"Stopping bot {bot_id} (no longer in DB)")
                    self.active_bots[bot_id].cancel()
                    del self.active_bots[bot_id]
                    self.active_bot_data.pop(bot_id, None)  # Cleanup data too
            
            for bot_id, bot_data in active_db_bots.items():
                if bot_id not in self.active_bots:
                    logger.info(f"Starting bot {bot_id}: {bot_data.get('name')}")
                    task = asyncio.create_task(self.bot_execution_loop(bot_data))
                    self.active_bots[bot_id] = task
                    self.active_bot_data[bot_id] = bot_data  # Store for metrics API
        except Exception as e:
            logger.error(f"Sync error (non-network related): {e}", exc_info=True)

    async def bot_execution_loop(self, bot_data):
        """Continuous execution loop with Advanced Analytics."""
        bot_id = bot_data['id']
        bot_name = bot_data['name']
        pair = bot_data['pair']
        
        strategy_info = bot_data.get('quant_strategies')
        core_id = strategy_info.get('core_id', 'atr-breakout-v1') if strategy_info else 'atr-breakout-v1'
        strategy = self.strategies.get(core_id, self.strategies['atr-breakout-v1'])
        
        connector = AsyncExchangeConnector('binance', 'PAPER_KEY', 'PAPER_SECRET', True)
        
        try:
            await connector.connect()
            logger.info(f"[{bot_name}] Core online. Watching {pair}")

            while True:
                # 1. Fetch Data
                ohlcv = await connector.exchange.fetch_ohlcv(pair, timeframe='1m', limit=60)
                df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
                current_price = float(df.iloc[-1]['close'])
                price_history = df['close'].tolist()
                
                # 2. Advanced Analytics: Macro Sentiment
                sentiment = await self.get_macro_sentiment(connector, pair)
                
                # 3. Strategy Analyze
                df = strategy.analyze(df)
                last_row = df.iloc[-1]
                snapshot = { "price": round(current_price, 2) }
                if 'sma20' in last_row and not pd.isna(last_row['sma20']): snapshot["sma20"] = round(float(last_row['sma20']), 2)
                if 'atr' in last_row and not pd.isna(last_row['atr']): snapshot["atr"] = round(float(last_row['atr']), 4)
                
                # Store metrics in active_bot_data for API access
                self.active_bot_data[bot_id].update({
                    "current_price": current_price,
                    "_current_rsi": float(last_row.get('rsi', 0)) if 'rsi' in last_row and not pd.isna(last_row['rsi']) else 0,
                    "_current_sma": float(last_row.get('sma50', last_row.get('sma20', 0))) if 'sma50' in last_row and not pd.isna(last_row['sma50']) else 0,
                    "_current_atr": float(last_row.get('atr', 0)) if 'atr' in last_row and not pd.isna(last_row['atr']) else 0,
                    "_atr_history": df['atr'].dropna().tail(20).tolist() if 'atr' in df else [],
                    "_metrics_snapshot": snapshot,
                    "core_id": core_id
                })

                # 4. Manage Position (Calculates PnL, Entry, BE, Qty)
                position, qty = await self.manage_position(bot_data, current_price, snapshot)
                
                # 5. Global Updates (History + Sentiment)
                await self.update_bot_state(bot_id, {
                    "price_history_1h": price_history,
                    "macro_sentiment": sentiment
                })

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
                        await self.update_bot_state(bot_id, {
                            "current_action": "EXECUTING VIRTUAL BUY...",
                            "current_entry_price": current_price,
                            "current_quantity": qty,
                            "current_position_opened_at": now_str
                        })
                    else:
                        await self.update_bot_state(bot_id, {
                            "current_action": f"Awaiting Signal ({pair} @ ${current_price})",
                            "current_pnl_pct": 0, "current_pnl_usdt": 0,
                            "current_entry_price": 0, "current_quantity": 0
                        })
                
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
    
    def stop(self):
        """Gracefully stop all bot execution loops."""
        self.is_running = False
        logger.info("Stopping Quant Core Orchestrator...")
        
        # Cancel all active bot tasks
        for bot_id, task in list(self.active_bots.items()):
            if not task.done():
                task.cancel()
                logger.info(f"Cancelled bot execution loop for {bot_id}")
        
        self.active_bots.clear()
        self.active_bot_data.clear()  # Cleanup bot data too
        logger.success("All bot execution loops stopped")
