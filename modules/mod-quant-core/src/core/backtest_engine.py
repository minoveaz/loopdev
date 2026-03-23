import asyncio
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from loguru import logger
from .exchange_connector import AsyncExchangeConnector
from ..strategies.baseline.intraday_atr import IntradayATRStrategy
from ..strategies.baseline.hybrid_core import HybridCoreStrategy

class BacktestResult:
    def __init__(self):
        self.total_trades = 0
        self.winning_trades = 0
        self.losing_trades = 0
        self.win_rate = 0.0
        self.total_return = 0.0
        self.max_drawdown = 0.0
        self.avg_win = 0.0
        self.avg_loss = 0.0
        self.profit_factor = 0.0
        self.sharpe_ratio = 0.0
        self.initial_capital = 0.0
        self.final_capital = 0.0
        self.trades = []

class BacktestEngine:
    """
    Industrial Backtesting Engine for LoopDev Quant Core.
    Simulates strategy execution using historical data.
    """
    
    def __init__(self, initial_capital=10000.0, daily_loss_limit=5.0):
        self.initial_capital = initial_capital
        self.daily_loss_limit = daily_loss_limit
        self.connector = AsyncExchangeConnector(
            exchange_id='binance', 
            api_key='BACKTEST_ONLY', 
            api_secret='BACKTEST_ONLY', 
            paper_mode=True
        )

    async def run_backtest(self, strategy_name, pairs, size_per_trade=100, stop_loss=2.0, take_profit=5.0, days=30):
        """
        Runs a full historical simulation.
        """
        logger.info(f"🚀 Executing historical simulation for: {strategy_name}")
        
        # 1. STRATEGY RESOLUTION
        strategy_map = {
            "atr-breakout-v1": IntradayATRStrategy(),
            "hybrid-core-v1": HybridCoreStrategy(),
            "default": IntradayATRStrategy()
        }
        
        key = "default"
        if "hybrid" in strategy_name.lower():
            key = "hybrid-core-v1"
        elif "atr" in strategy_name.lower():
            key = "atr-breakout-v1"
            
        strategy = strategy_map.get(key, strategy_map["default"])
        logger.info(f"Selected Logic Engine: {strategy.__class__.__name__}")
        
        result = BacktestResult()
        result.initial_capital = self.initial_capital
        result.final_capital = self.initial_capital

        try:
            await self.connector.connect()
            
            # Primary pair for simulation
            pair = pairs[0] if pairs else "BTC/USDT"
            
            # 2. DATA INGESTION
            logger.info(f"Downloading historical data for {pair} ({days} days)...")
            ohlcv = await self.connector.exchange.fetch_ohlcv(pair, timeframe='1h', limit=24*days)
            df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
            
            # 3. STRATEGY ANALYSIS
            df = strategy.analyze(df)
            
            capital = self.initial_capital
            position = None
            trades_log = []

            for i in range(1, len(df)):
                current_row = df.iloc[i]
                prev_row = df.iloc[i-1]
                
                current_price = float(current_row['close'])
                # FIXED (2026-03-18): Case mismatch - should be 'atr' not 'ATR'
                current_atr = float(current_row.get('atr', 0))
                
                # Validate price
                if pd.isna(current_price) or np.isinf(current_price) or current_price <= 0:
                    continue
                
                current_time = datetime.fromtimestamp(current_row['timestamp']/1000).isoformat()
                
                # Logic: Exit
                if position:
                    if position['entry_price'] <= 0:
                        # FIXED (2026-03-18): Validate entry price to prevent division by zero
                        logger.warning(f"Invalid entry price: {position['entry_price']}, closing position")
                        position = None
                        continue
                    
                    pnl_pct = ((current_price - position['entry_price']) / position['entry_price']) * 100
                    
                    exit_triggered = False
                    exit_reason = ""

                    # Hybrid Trailing logic check
                    if isinstance(strategy, HybridCoreStrategy):
                        # Update peak price
                        if current_price > position.get('max_price', 0):
                            position['max_price'] = current_price
                        
                        # Check for Trailing Activation (hit ATR target)
                        if not position.get('trailing_active'):
                            if current_price >= position['target_price']:
                                position['trailing_active'] = True
                                logger.debug(f"Trailing Activated at {current_price}")
                        
                        # Trigger exit if callback pullback hit (-0.3%)
                        if position.get('trailing_active'):
                            if strategy.calculate_trailing_stop(current_price, position['max_price']):
                                exit_triggered = True
                                exit_reason = "TRAILING_STOP_CALLBACK"
                    else:
                        # Standard ATR Target check
                        if current_price >= position['target_price']:
                            exit_triggered = True
                            exit_reason = "DYNAMIC_TP"

                    # Risk Guard: Hard Stop Loss (Always active)
                    if not exit_triggered and pnl_pct <= -stop_loss:
                        exit_triggered = True
                        exit_reason = "HARD_STOP_LOSS"
                    
                    if exit_triggered:
                        pnl_val = (position['quantity'] * current_price) - (position['quantity'] * position['entry_price'])
                        capital += pnl_val
                        
                        trades_log.append({
                            "entry_time": position['entry_time'],
                            "exit_time": current_time,
                            "pair": pair,
                            "side": position['side'],
                            "entry_price": position['entry_price'],
                            "exit_price": current_price,
                            "quantity": position['quantity'],
                            "pnl": round(pnl_val, 2),
                            "pnl_pct": round(pnl_pct, 2),
                            "reason": exit_reason
                        })
                        position = None

                # Logic: Entry
                if not position:
                    signal = strategy.check_signal(current_row, prev_row)
                    
                    if signal and signal['side'] == 'buy':
                        # FIXED (2026-03-18): Validate capital before entry
                        if size_per_trade > capital:
                            logger.warning(f"Insufficient capital: {capital} < {size_per_trade}")
                            continue
                        
                        qty = size_per_trade / current_price
                        # FIXED (2026-03-18): Validate quantity
                        if qty <= 0 or np.isnan(qty):
                            logger.warning(f"Invalid quantity calculated: {qty}")
                            continue
                        
                        target_price = strategy.get_exit_price(current_price, current_atr, 'buy')
                        # FIXED (2026-03-18): Validate target price
                        if target_price <= current_price:
                            logger.warning(f"Invalid target price: {target_price} <= entry {current_price}")
                            continue
                        
                        capital -= size_per_trade  # Deduct capital for this trade
                        
                        position = {
                            "side": "buy",
                            "entry_price": current_price,
                            "entry_time": current_time,
                            "quantity": qty,
                            "target_price": target_price,
                            "max_price": current_price,
                            "trailing_active": False
                        }

            # 4. METRICS AGGREGATION
            if trades_log:
                df_res = pd.DataFrame(trades_log)
                wins = df_res[df_res['pnl'] > 0]
                losses = df_res[df_res['pnl'] <= 0]
                
                result.total_trades = len(trades_log)
                result.winning_trades = len(wins)
                result.losing_trades = len(losses)
                result.win_rate = round((len(wins) / len(trades_log)) * 100, 2)
                result.final_capital = round(capital, 2)
                result.total_return = round(((capital - self.initial_capital) / self.initial_capital) * 100, 2)
                result.avg_win = round(wins['pnl'].mean(), 2) if not wins.empty else 0
                result.avg_loss = round(losses['pnl'].mean(), 2) if not losses.empty else 0
                
                # FIXED (2026-03-18): Proper profit factor calculation with division by zero protection
                if not losses.empty and losses['pnl'].sum() < 0:
                    result.profit_factor = round(abs(wins['pnl'].sum()) / abs(losses['pnl'].sum()), 2)
                else:
                    result.profit_factor = 0.0 if (not wins.empty and wins['pnl'].sum() <= 0) else 1.0
                
                result.max_drawdown = round(df_res['pnl_pct'].min(), 2) if not df_res.empty else 0
                
                # FIXED (2026-03-18): Calculate real Sharpe ratio instead of hardcoded value
                if len(df_res) > 1:
                    returns = df_res['pnl_pct'].values / 100.0
                    mean_return = np.mean(returns)
                    std_return = np.std(returns)
                    # Annualize using sqrt(252) for hourly data
                    result.sharpe_ratio = round((mean_return / (std_return + 1e-8)) * np.sqrt(252), 2)
                else:
                    result.sharpe_ratio = 0.0
                
                result.trades = trades_log

            logger.success(f"Simulation finalized. Strategy performance: {result.total_return}%")
            return result

        except Exception as e:
            logger.error(f"Engine failure during backtest: {e}")
            raise e
        finally:
            await self.connector.close()
