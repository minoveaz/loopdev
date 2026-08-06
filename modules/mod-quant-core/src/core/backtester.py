"""
Professional Backtesting Engine

Validates trading strategies on historical data before live deployment.
Follows industry standard: Backtest → Forward Test → Paper Trade → Live
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from loguru import logger
import json
from pathlib import Path

from .exchange_connector import AsyncExchangeConnector


@dataclass
class Trade:
    """Single trade record"""
    entry_price: float
    entry_time: datetime
    entry_signal: str  # "BUY" or "SELL"
    exit_price: Optional[float] = None
    exit_time: Optional[datetime] = None
    exit_signal: Optional[str] = None
    profit_pct: Optional[float] = None
    profit_abs: Optional[float] = None
    duration_hours: Optional[float] = None
    
    def close(self, exit_price: float, exit_time: datetime, exit_signal: str):
        """Close the trade"""
        self.exit_price = exit_price
        self.exit_time = exit_time
        self.exit_signal = exit_signal
        self.profit_pct = (exit_price - self.entry_price) / self.entry_price
        self.profit_abs = exit_price - self.entry_price
        if self.entry_time and exit_time:
            self.duration_hours = (exit_time - self.entry_time).total_seconds() / 3600
    
    def is_winner(self) -> bool:
        """Is this a profitable trade?"""
        return self.profit_pct > 0 if self.profit_pct is not None else False
    
    def to_dict(self) -> Dict:
        """Convert to dict for JSON serialization"""
        return {
            'entry_price': float(self.entry_price),
            'entry_time': self.entry_time.isoformat() if self.entry_time else None,
            'entry_signal': self.entry_signal,
            'exit_price': float(self.exit_price) if self.exit_price else None,
            'exit_time': self.exit_time.isoformat() if self.exit_time else None,
            'exit_signal': self.exit_signal,
            'profit_pct': float(self.profit_pct) if self.profit_pct else None,
            'profit_abs': float(self.profit_abs) if self.profit_abs else None,
            'duration_hours': float(self.duration_hours) if self.duration_hours else None,
        }


@dataclass
class BacktestResults:
    """Aggregated backtest results"""
    total_trades: int
    winning_trades: int
    losing_trades: int
    win_rate_pct: float
    profit_factor: float  # gross_profit / gross_loss (target > 1.5)
    avg_win_pct: float
    avg_loss_pct: float
    total_profit_pct: float
    sharpe_ratio: float  # Risk-adjusted returns (target > 1.0)
    max_drawdown_pct: float  # Worst peak-to-trough decline
    avg_trade_duration_hours: float
    trades: List[Trade]
    
    # Metadata
    strategy_name: str
    pair: str
    timeframe: str
    start_date: datetime
    end_date: datetime
    total_days: int
    
    def to_dict(self) -> Dict:
        """Convert to dict for JSON serialization"""
        return {
            'total_trades': self.total_trades,
            'winning_trades': self.winning_trades,
            'losing_trades': self.losing_trades,
            'win_rate_pct': float(self.win_rate_pct),
            'profit_factor': float(self.profit_factor),
            'avg_win_pct': float(self.avg_win_pct),
            'avg_loss_pct': float(self.avg_loss_pct),
            'total_profit_pct': float(self.total_profit_pct),
            'sharpe_ratio': float(self.sharpe_ratio),
            'max_drawdown_pct': float(self.max_drawdown_pct),
            'avg_trade_duration_hours': float(self.avg_trade_duration_hours),
            'strategy_name': self.strategy_name,
            'pair': self.pair,
            'timeframe': self.timeframe,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'total_days': self.total_days,
            'trades': [t.to_dict() for t in self.trades],
        }
    
    def print_summary(self):
        """Print human-readable summary"""
        print(f"""
╔════════════════════════════════════════════════════════════════╗
║                    BACKTEST RESULTS SUMMARY                    ║
╚════════════════════════════════════════════════════════════════╝

📊 STRATEGY: {self.strategy_name}
🔀 PAIR: {self.pair} | ⏱️ TIMEFRAME: {self.timeframe}
📅 PERIOD: {self.start_date.strftime('%Y-%m-%d')} → {self.end_date.strftime('%Y-%m-%d')} ({self.total_days} days)

═══════════════════════════════════════════════════════════════════

📈 TRADE STATISTICS:
   Total Trades: {self.total_trades}
   ✅ Winners: {self.winning_trades} ({self.win_rate_pct:.1f}%)
   ❌ Losers: {self.losing_trades} ({100-self.win_rate_pct:.1f}%)
   Avg Trade Duration: {self.avg_trade_duration_hours:.1f} hours

═══════════════════════════════════════════════════════════════════

💰 PROFITABILITY:
   Total Profit: {self.total_profit_pct:+.2f}%
   Avg Win: {self.avg_win_pct:+.2f}%
   Avg Loss: {self.avg_loss_pct:+.2f}%
   Profit Factor: {self.profit_factor:.2f}x (target > 1.5)

═══════════════════════════════════════════════════════════════════

⚠️ RISK METRICS:
   Max Drawdown: {self.max_drawdown_pct:.2f}%
   Sharpe Ratio: {self.sharpe_ratio:.2f} (target > 1.0)

═══════════════════════════════════════════════════════════════════

🎯 VERDICT:
""")
        
        checks = []
        if self.total_trades == 0:
            checks.append("❌ NO TRADES GENERATED - Strategy logic may be broken")
        else:
            checks.append(f"✅ Generated {self.total_trades} trades")
        
        if self.win_rate_pct >= 55:
            checks.append(f"✅ Win rate {self.win_rate_pct:.1f}% (excellent)")
        elif self.win_rate_pct >= 50:
            checks.append(f"⚠️  Win rate {self.win_rate_pct:.1f}% (marginal)")
        else:
            checks.append(f"❌ Win rate {self.win_rate_pct:.1f}% (too low)")
        
        if self.profit_factor >= 1.5:
            checks.append(f"✅ Profit factor {self.profit_factor:.2f} (good)")
        elif self.profit_factor >= 1.2:
            checks.append(f"⚠️  Profit factor {self.profit_factor:.2f} (marginal)")
        else:
            checks.append(f"❌ Profit factor {self.profit_factor:.2f} (poor)")
        
        if self.max_drawdown_pct <= 15:
            checks.append(f"✅ Max drawdown {self.max_drawdown_pct:.1f}% (acceptable)")
        elif self.max_drawdown_pct <= 25:
            checks.append(f"⚠️  Max drawdown {self.max_drawdown_pct:.1f}% (high)")
        else:
            checks.append(f"❌ Max drawdown {self.max_drawdown_pct:.1f}% (too high)")
        
        if self.sharpe_ratio >= 1.0:
            checks.append(f"✅ Sharpe ratio {self.sharpe_ratio:.2f} (good)")
        else:
            checks.append(f"⚠️  Sharpe ratio {self.sharpe_ratio:.2f} (low)")
        
        for check in checks:
            print(f"   {check}")
        
        print("\n" + "═" * 65 + "\n")


class Backtester:
    """
    Professional backtesting engine for trading strategies
    
    Usage:
        backtester = Backtester(
            strategy=MyStrategy(),
            pair="BTC/USDT",
            timeframe="15m"
        )
        results = await backtester.run(
            start_date="2026-01-01",
            end_date="2026-03-20"
        )
        results.print_summary()
    """
    
    def __init__(self, strategy, pair: str = "BTC/USDT", timeframe: str = "15m"):
        """
        Initialize backtester
        
        Args:
            strategy: Strategy object with evaluate() method
            pair: Trading pair (BTC/USDT, ETH/USDT, etc.)
            timeframe: Candle timeframe (15m, 1h, 4h, 1d)
        """
        self.strategy = strategy
        self.pair = pair
        self.timeframe = timeframe
        self.exchange = AsyncExchangeConnector()
        
    async def run(
        self,
        start_date: str,
        end_date: str,
        initial_capital: float = 100.0,
        fee_pct: float = 0.075,  # Binance spot trading fee
    ) -> BacktestResults:
        """
        Run backtest on historical data
        
        Args:
            start_date: Start date (YYYY-MM-DD)
            end_date: End date (YYYY-MM-DD)
            initial_capital: Starting capital for P&L calculations
            fee_pct: Trading fee percentage (both sides)
        
        Returns:
            BacktestResults with detailed metrics
        """
        logger.info(f"Starting backtest: {self.strategy.__class__.__name__} on {self.pair}")
        
        # Load historical data
        candles = await self._load_candles(start_date, end_date)
        logger.info(f"Loaded {len(candles)} candles from {start_date} to {end_date}")
        
        if len(candles) == 0:
            logger.error(f"No candle data found for {self.pair}")
            return self._create_empty_results(start_date, end_date)
        
        # Run strategy on each candle
        trades = []
        current_position = None  # Track open position
        equity_curve = [initial_capital]
        
        for i, candle in enumerate(candles):
            # Evaluate strategy
            signal = self.strategy.evaluate(candle)
            
            if signal == "BUY" and current_position is None:
                # Enter long position
                current_position = Trade(
                    entry_price=candle['close'],
                    entry_time=candle['time'],
                    entry_signal="BUY"
                )
                logger.debug(f"BUY @ {candle['close']} on {candle['time']}")
            
            elif signal == "SELL" and current_position is not None:
                # Close position
                exit_price = candle['close']
                fee_cost = (current_position.entry_price + exit_price) * fee_pct / 100
                current_position.close(
                    exit_price=exit_price - fee_cost,
                    exit_time=candle['time'],
                    exit_signal="SELL"
                )
                trades.append(current_position)
                logger.debug(f"SELL @ {exit_price} | Profit: {current_position.profit_pct:+.2f}%")
                current_position = None
                
                # Update equity
                equity_change = current_position.profit_pct if current_position else 0
                new_equity = equity_curve[-1] * (1 + equity_change)
                equity_curve.append(new_equity)
        
        logger.info(f"Backtest complete. Generated {len(trades)} trades.")
        
        # Calculate metrics
        return self._calculate_results(
            trades=trades,
            equity_curve=equity_curve,
            start_date=datetime.fromisoformat(start_date),
            end_date=datetime.fromisoformat(end_date)
        )
    
    async def _load_candles(self, start_date: str, end_date: str) -> List[Dict]:
        """Load historical candles from exchange"""
        # This would call the real exchange API
        # For now, return empty list (you'll implement this)
        logger.warning("_load_candles not implemented - using mock data")
        return []
    
    def _calculate_results(
        self,
        trades: List[Trade],
        equity_curve: List[float],
        start_date: datetime,
        end_date: datetime
    ) -> BacktestResults:
        """Calculate backtest metrics"""
        
        if len(trades) == 0:
            return self._create_empty_results(start_date, end_date)
        
        # Trade metrics
        total_trades = len(trades)
        winners = [t for t in trades if t.is_winner()]
        losers = [t for t in trades if not t.is_winner()]
        
        winning_trades = len(winners)
        losing_trades = len(losers)
        win_rate_pct = (winning_trades / total_trades * 100) if total_trades > 0 else 0
        
        # Profitability
        gross_profit = sum(t.profit_abs for t in winners) if winners else 0
        gross_loss = abs(sum(t.profit_abs for t in losers)) if losers else 0
        profit_factor = gross_profit / gross_loss if gross_loss > 0 else 0
        
        avg_win_pct = (sum(t.profit_pct for t in winners) / len(winners) * 100) if winners else 0
        avg_loss_pct = (sum(t.profit_pct for t in losers) / len(losers) * 100) if losers else 0
        total_profit_pct = sum(t.profit_pct for t in trades) * 100 if trades else 0
        
        # Risk metrics
        max_drawdown_pct = self._calculate_max_drawdown(equity_curve)
        sharpe_ratio = self._calculate_sharpe_ratio(equity_curve)
        
        # Duration
        durations = [t.duration_hours for t in trades if t.duration_hours]
        avg_trade_duration_hours = np.mean(durations) if durations else 0
        
        return BacktestResults(
            total_trades=total_trades,
            winning_trades=winning_trades,
            losing_trades=losing_trades,
            win_rate_pct=win_rate_pct,
            profit_factor=profit_factor,
            avg_win_pct=avg_win_pct,
            avg_loss_pct=avg_loss_pct,
            total_profit_pct=total_profit_pct,
            sharpe_ratio=sharpe_ratio,
            max_drawdown_pct=max_drawdown_pct,
            avg_trade_duration_hours=avg_trade_duration_hours,
            trades=trades,
            strategy_name=self.strategy.__class__.__name__,
            pair=self.pair,
            timeframe=self.timeframe,
            start_date=start_date,
            end_date=end_date,
            total_days=(end_date - start_date).days,
        )
    
    @staticmethod
    def _calculate_max_drawdown(equity_curve: List[float]) -> float:
        """Calculate maximum peak-to-trough decline"""
        if len(equity_curve) < 2:
            return 0
        
        peak = equity_curve[0]
        max_dd = 0
        
        for value in equity_curve:
            if value > peak:
                peak = value
            dd = (peak - value) / peak
            if dd > max_dd:
                max_dd = dd
        
        return max_dd * 100
    
    @staticmethod
    def _calculate_sharpe_ratio(equity_curve: List[float], rf_rate: float = 0.02) -> float:
        """
        Calculate Sharpe ratio
        
        Sharpe = (return - risk_free_rate) / volatility
        Target: > 1.0 for good strategies
        """
        if len(equity_curve) < 2:
            return 0
        
        # Calculate returns
        returns = np.diff(equity_curve) / equity_curve[:-1]
        
        # Annualized metrics (assuming 252 trading days)
        avg_return = np.mean(returns) * 252
        volatility = np.std(returns) * np.sqrt(252)
        
        if volatility == 0:
            return 0
        
        sharpe = (avg_return - rf_rate) / volatility
        return sharpe
    
    def _create_empty_results(
        self,
        start_date: str | datetime,
        end_date: str | datetime
    ) -> BacktestResults:
        """Create empty results when no trades generated"""
        return BacktestResults(
            total_trades=0,
            winning_trades=0,
            losing_trades=0,
            win_rate_pct=0,
            profit_factor=0,
            avg_win_pct=0,
            avg_loss_pct=0,
            total_profit_pct=0,
            sharpe_ratio=0,
            max_drawdown_pct=0,
            avg_trade_duration_hours=0,
            trades=[],
            strategy_name=self.strategy.__class__.__name__,
            pair=self.pair,
            timeframe=self.timeframe,
            start_date=start_date if isinstance(start_date, datetime) else datetime.fromisoformat(start_date),
            end_date=end_date if isinstance(end_date, datetime) else datetime.fromisoformat(end_date),
            total_days=((end_date if isinstance(end_date, datetime) else datetime.fromisoformat(end_date)) - (start_date if isinstance(start_date, datetime) else datetime.fromisoformat(start_date))).days,
        )
    
    async def save_results(self, results: BacktestResults, filepath: Optional[str] = None):
        """Save backtest results to JSON file"""
        if filepath is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filepath = f"backtest_results_{timestamp}.json"
        
        output_path = Path(filepath)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w') as f:
            json.dump(results.to_dict(), f, indent=2)
        
        logger.info(f"Backtest results saved to {filepath}")
