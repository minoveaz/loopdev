"""
RSI Mean Reversion Strategy - Backtest Script
Tests the new strategy against historical data (BTC/USDT 15m, last 30 days)
"""

import asyncio
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import sys
from pathlib import Path

# Add module to path
sys.path.insert(0, str(Path(__file__).parent / ".."))

from src.core.exchange_connector import AsyncExchangeConnector
from src.strategies.rsi_mean_reversion import RSIMeanReversionStrategy

class SimpleBacktestEngine:
    """Minimal backtest engine for single-pair validation"""
    
    def __init__(self):
        self.connector = AsyncExchangeConnector(
            exchange_id='binance',
            api_key='BACKTEST',
            api_secret='BACKTEST',
            paper_mode=True
        )
        self.strategy = RSIMeanReversionStrategy()
    
    async def run(self, pair='BTC/USDT', timeframe='15m', limit=100):
        """Run a quick backtest"""
        print(f"\n{'='*70}")
        print(f"RSI Mean Reversion Backtest")
        print(f"{'='*70}")
        print(f"Pair: {pair}")
        print(f"Timeframe: {timeframe}")
        print(f"Candles: {limit}")
        
        try:
            await self.connector.connect()
            
            # Fetch OHLCV data
            ohlcv = await self.connector.exchange.fetch_ohlcv(pair, timeframe=timeframe, limit=limit)
            df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
            
            # Analyze
            df = self.strategy.analyze(df)
            
            # Simulate trading
            trades = []
            in_position = False
            entry_price = 0
            entry_idx = 0
            position_type = None
            
            for i in range(1, len(df)):
                current_row = df.iloc[i]
                previous_row = df.iloc[i-1]
                
                # Check for entry signal
                if not in_position:
                    signal = self.strategy.check_signal(current_row, previous_row)
                    if signal:
                        entry_price = float(current_row['close'])
                        entry_idx = i
                        position_type = signal['side']
                        in_position = True
                        atr = float(current_row.get('atr', 0))
                        tp = self.strategy.get_exit_price(entry_price, atr, position_type)
                        sl = self.strategy.get_exit_price(entry_price, atr, 'sell' if position_type == 'buy' else 'buy')
                        
                        print(f"\n[ENTRY #{len(trades)+1}] {signal['side'].upper()}")
                        print(f"  Time: {current_row['timestamp']}")
                        print(f"  Price: ${entry_price:.2f}")
                        print(f"  RSI: {current_row.get('rsi', 'N/A'):.1f}")
                        print(f"  Reason: {signal['reason']}")
                        print(f"  TP: ${tp:.2f} | SL: ${sl:.2f}")
                
                # Check for exit (TP/SL)
                elif in_position:
                    current_price = float(current_row['close'])
                    rsi = float(current_row.get('rsi', 50))
                    atr = float(current_row.get('atr', 0))
                    tp = self.strategy.get_exit_price(entry_price, atr, position_type)
                    sl = self.strategy.get_exit_price(entry_price, atr, 'sell' if position_type == 'buy' else 'buy')
                    
                    # Simple TP/SL exit
                    exit_reason = None
                    if position_type == 'buy':
                        if current_price >= tp:
                            exit_reason = 'TP'
                            exit_price = tp
                        elif current_price <= sl:
                            exit_reason = 'SL'
                            exit_price = sl
                    else:  # sell
                        if current_price <= tp:
                            exit_reason = 'TP'
                            exit_price = tp
                        elif current_price >= sl:
                            exit_reason = 'SL'
                            exit_price = sl
                    
                    if exit_reason:
                        pnl = (exit_price - entry_price) if position_type == 'buy' else (entry_price - exit_price)
                        pnl_pct = (pnl / entry_price) * 100
                        
                        trade = {
                            'entry_time': df.iloc[entry_idx]['timestamp'],
                            'exit_time': current_row['timestamp'],
                            'entry_price': entry_price,
                            'exit_price': exit_price,
                            'pnl': pnl,
                            'pnl_pct': pnl_pct,
                            'type': position_type,
                            'exit_reason': exit_reason
                        }
                        trades.append(trade)
                        
                        print(f"[EXIT] {exit_reason}")
                        print(f"  Price: ${exit_price:.2f}")
                        print(f"  PnL: ${pnl:.2f} ({pnl_pct:+.2f}%)")
                        print(f"  Duration: {(current_row['timestamp'] - df.iloc[entry_idx]['timestamp']).total_seconds() / 60:.0f}m")
                        
                        in_position = False
            
            # Summary
            print(f"\n{'='*70}")
            print("BACKTEST SUMMARY")
            print(f"{'='*70}")
            if trades:
                wins = sum(1 for t in trades if t['pnl'] > 0)
                losses = sum(1 for t in trades if t['pnl'] <= 0)
                total_return = sum(t['pnl_pct'] for t in trades)
                avg_win = np.mean([t['pnl_pct'] for t in trades if t['pnl'] > 0]) if wins > 0 else 0
                avg_loss = np.mean([t['pnl_pct'] for t in trades if t['pnl'] <= 0]) if losses > 0 else 0
                
                print(f"Total Trades: {len(trades)}")
                print(f"Winning: {wins} ({wins/len(trades)*100:.1f}%)")
                print(f"Losing: {losses} ({losses/len(trades)*100:.1f}%)")
                print(f"Total Return: {total_return:+.2f}%")
                print(f"Avg Win: {avg_win:+.2f}%")
                print(f"Avg Loss: {avg_loss:+.2f}%")
                if losses > 0:
                    profit_factor = (sum(t['pnl'] for t in trades if t['pnl'] > 0)) / abs(sum(t['pnl'] for t in trades if t['pnl'] <= 0))
                    print(f"Profit Factor: {profit_factor:.2f}x")
            else:
                print("No trades executed")
            
            print(f"{'='*70}\n")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()
        finally:
            await self.connector.close()

async def main():
    engine = SimpleBacktestEngine()
    await engine.run(pair='BTC/USDT', timeframe='15m', limit=200)

if __name__ == '__main__':
    asyncio.run(main())
