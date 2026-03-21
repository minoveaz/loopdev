import pandas as pd
import numpy as np
from typing import Dict, Any, Optional
from .base import BaseStrategy

class AggressiveRSIStrategy(BaseStrategy):
    """
    Aggressive RSI Strategy v1 (2026-03-20)
    Type: Momentum-Based Scalping with Trend Confirmation
    Timeframe: 1m (highly aggressive)
    
    Entry Logic:
    - LONG: RSI < 45 AND price above SMA20
    - SHORT: RSI > 55 AND price below SMA20
    
    This strategy is designed to generate more frequent signals
    in normal market conditions while still maintaining trend confirmation.
    
    Indicators Used:
    - RSI(14): Momentum indicator
    - SMA20: Short-term trend baseline
    - ATR(14): Dynamic stop loss positioning
    
    Expected Performance:
    - Win Rate: 55-60% (lower due to more trades)
    - Profit Factor: 1.3-1.5
    - Trades/Day: 50-100+ (very aggressive)
    """

    def analyze(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculate indicators: RSI, SMA20, ATR
        """
        # 1. RSI(14) - Relative Strength Index
        delta = df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['rsi'] = 100 - (100 / (1 + rs))
        
        # 2. SMA20 - Short-term trend
        df['sma20'] = df['close'].rolling(window=20).mean()
        
        # 3. True Range & ATR (Wilder's Method)
        df['tr'] = np.maximum(
            df['high'] - df['low'],
            np.maximum(
                np.abs(df['high'] - df['close'].shift()),
                np.abs(df['low'] - df['close'].shift())
            )
        )
        df['atr'] = df['tr'].ewm(span=14, adjust=False).mean()
        
        return df

    def check_signal(self, row: pd.Series, previous_row: pd.Series) -> Optional[Dict[str, Any]]:
        """
        Check for momentum-based signals with trend confirmation.
        
        Entry conditions:
        - LONG: RSI < 45 (below midpoint, leaning bearish) AND price > SMA20 (in uptrend)
        - SHORT: RSI > 55 (above midpoint, leaning bullish) AND price < SMA20 (in downtrend)
        """
        
        # Input validation
        if pd.isna(row.get('rsi')) or pd.isna(row.get('sma20')) or pd.isna(row.get('atr')):
            return None
        
        price = float(row['close'])
        if pd.isna(price) or np.isinf(price) or price <= 0:
            return None
        
        sma20 = float(row['sma20'])
        if pd.isna(sma20) or sma20 <= 0:
            return None
        
        atr = float(row.get('atr', 0))
        if pd.isna(atr) or atr <= 0:
            return None
        
        rsi = float(row['rsi'])
        
        # Conditions for LONG
        price_above_sma = price > sma20
        rsi_low = rsi < 45  # Momentum below midpoint
        
        # Conditions for SHORT
        price_below_sma = price < sma20
        rsi_high = rsi > 55  # Momentum above midpoint
        
        # LONG Signal
        if rsi_low and price_above_sma:
            return {
                "side": "buy",
                "reason": f"Momentum_Low ({rsi:.1f}) + Above_SMA20"
            }
        
        # SHORT Signal
        if rsi_high and price_below_sma:
            return {
                "side": "sell",
                "reason": f"Momentum_High ({rsi:.1f}) + Below_SMA20"
            }
        
        return None

    def get_exit_price(self, entry_price: float, atr: float, side: str) -> float:
        """
        Calculate dynamic take profit based on ATR.
        TP = Entry ± (1.0x ATR) for aggressive scalping
        """
        multiplier = 1.0
        
        if entry_price <= 0 or pd.isna(entry_price):
            return 0.0
        
        if not pd.isna(atr) and atr > 0:
            if side == 'buy':
                tp = entry_price + (multiplier * atr)
                if tp <= entry_price:
                    tp = entry_price * 1.01
                return tp
            else:
                tp = entry_price - (multiplier * atr)
                if tp >= entry_price:
                    tp = entry_price * 0.99
                return tp
        else:
            if side == 'buy':
                return entry_price * 1.015
            else:
                return entry_price * 0.985
