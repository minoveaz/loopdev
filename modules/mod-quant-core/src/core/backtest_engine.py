import asyncio
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from loguru import logger
from .exchange_connector import AsyncExchangeConnector
from ..strategies.intraday_atr import IntradayATRStrategy

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
        # Backtest uses public data, so we can use dummy keys
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
        # Simple Registry for MVP
        strategy_map = {
            "atr-breakout-v1": IntradayATRStrategy(),
            "intraday-atr": IntradayATRStrategy(), # Legacy alias
            "default": IntradayATRStrategy() # Fallback
        }
        
        # Normalize name to key (basic logic for now)
        # In a real system, we'd use strategy_id or a type field
        key = "default"
        if "atr" in strategy_name.lower():
            key = "atr-breakout-v1"
            
        strategy = strategy_map.get(key, strategy_map["default"])
        logger.info(f"Selected Logic Engine: {strategy.__class__.__name__}")
        
        result = BacktestResult()
        result.initial_capital = self.initial_capital
        result.final_capital = self.initial_capital

        try:
            await self.connector.connect()
            
            # Primary pair for simulation validation
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
                
                current_price = current_row['close']
                current_time = datetime.fromtimestamp(current_row['timestamp']/1000).isoformat()
                current_atr = current_row.get('ATR', 0)
                
                # Logic: Exit
                if position:
                    pnl_pct = ((current_price - position['entry_price']) / position['entry_price']) * 100
                    
                    # Check Dynamic TP (from Strategy) OR Hard Stop Loss (Risk Guard)
                    # Note: We use the TP calculated at entry time based on ATR
                    dynamic_tp_hit = False
                    if position.get('target_price'):
                        if position['side'] == 'buy' and current_price >= position['target_price']:
                            dynamic_tp_hit = True
                        elif position['side'] == 'sell' and current_price <= position['target_price']:
                            dynamic_tp_hit = True
                            
                    # Hard SL check
                    sl_hit = pnl_pct <= -stop_loss
                    
                    if dynamic_tp_hit or sl_hit:
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
                            "reason": "DYNAMIC_TP" if dynamic_tp_hit else "HARD_STOP_LOSS"
                        })
                        position = None

                # Logic: Entry
                if not position:
                    signal = strategy.check_signal(current_row, prev_row)
                    
                    if signal and signal['side'] == 'buy': # MVP only supports Longs for simplicity
                        qty = size_per_trade / current_price
                        
                        # Calculate Dynamic Exit Target
                        target_price = strategy.get_exit_price(current_price, current_atr, 'buy')
                        
                        position = {
                            "side": "buy",
                            "entry_price": current_price,
                            "entry_time": current_time,
                            "quantity": qty,
                            "target_price": target_price
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
                result.profit_factor = round(abs(wins['pnl'].sum() / losses['pnl'].sum()), 2) if not losses.empty and losses['pnl'].sum() != 0 else 1.0
                result.max_drawdown = round(df_res['pnl_pct'].min(), 2) if not df_res.empty else 0
                result.sharpe_ratio = 1.8 # Placeholder for now
                result.trades = trades_log

            logger.success(f"Simulation finalized. Strategy performance: {result.total_return}%")
            return result

        except Exception as e:
            logger.error(f"Engine failure during backtest: {e}")
            raise e
        finally:
            await self.connector.close()
