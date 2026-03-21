import pandas as pd
import numpy as np
from typing import Dict, Any, Optional
from .base import BaseStrategy

class IntradayATRStrategy(BaseStrategy):
    """
    Port of the Legacy 2025 Bot Logic.
    Type: Mean Reversion / Breakout
    Indicators: sma20, bb_upper, bb_lower, atr
    Exit: Dynamic TP based on 1.5x ATR
    
    FIXED (2026-03-18):
    - ATR now uses Wilder's True Range (includes close-to-close gaps)
    - ATR uses EMA instead of SMA for faster reaction to volatility changes
    """

    def analyze(self, df: pd.DataFrame) -> pd.DataFrame:
        # 1. Indicators Calculation (Lowercase convention)
        df['sma20'] = df['close'].rolling(window=20).mean()
        df['std'] = df['close'].rolling(window=20).std()
        df['bb_upper'] = df['sma20'] + 2 * df['std']
        df['bb_lower'] = df['sma20'] - 2 * df['std']
        
        # ATR Calculation (Wilder's True Range - FIXED)
        # TR = MAX(High-Low, ABS(High-PrevClose), ABS(Low-PrevClose))
        df['tr'] = np.maximum(
            df['high'] - df['low'],
            np.maximum(
                np.abs(df['high'] - df['close'].shift()),
                np.abs(df['low'] - df['close'].shift())
            )
        )
        # Use EMA instead of SMA for faster volatility reaction
        df['atr'] = df['tr'].ewm(span=14, adjust=False).mean()
        
        return df

    def check_signal(self, row: pd.Series, previous_row: pd.Series) -> Optional[Dict[str, Any]]:
        # Ensure we have enough data
        if pd.isna(row.get('sma20')) or pd.isna(previous_row.get('sma20')):
            return None
        
        # FIXED (2026-03-18): Validate all inputs for NaN/Inf
        price = float(row['close'])
        if pd.isna(price) or np.isinf(price) or price <= 0:
            return None
        
        prev_price = float(previous_row['close'])
        if pd.isna(prev_price) or np.isinf(prev_price) or prev_price <= 0:
            return None
        
        sma = float(row['sma20'])
        prev_sma = float(previous_row['sma20'])
        if pd.isna(sma) or pd.isna(prev_sma):
            return None
        
        atr = float(row.get('atr', 0))
        if pd.isna(atr) or atr <= 0:
            return None  # ATR not ready yet

        # Crossover Logic - IMPROVED (v2)
        cross_above = prev_price < prev_sma and price > sma
        cross_above_gentle = prev_price <= sma and price > sma and abs(price - prev_sma) < atr  # Gentle cross (no filter)
        
        cross_below = prev_price > prev_sma and price < sma
        cross_below_gentle = prev_price >= sma and price < sma and abs(price - prev_sma) < atr  # Gentle cross (no filter)

        if cross_above or cross_above_gentle:
            # IMPROVED (v2): Reduce volatility filter for more frequent signals
            # Only require ATR > 0.2% of price (down from 0.5%)
            if atr >= price * 0.002:  # Changed from 0.005
                return {"side": "buy", "reason": "SMA20_CROSS_UP"}
        
        if cross_below or cross_below_gentle:
            # Same improvement for short signals
            if atr >= price * 0.002:  # Changed from 0.005
                return {"side": "sell", "reason": "SMA20_CROSS_DOWN"}

        return None

    def get_exit_price(self, entry_price: float, atr: float, side: str) -> float:
        """
        Legacy Exit Logic:
        TP = Entry + (1.5 * ATR) for Buy
        SL = Entry - (1 * ATR) for Buy
        
        FIXED (2026-03-18): Validate that exit prices are realistic
        """
        multiplier = 1.5
        
        # Validate inputs
        if entry_price <= 0 or pd.isna(entry_price):
            return 0.0
        
        # Use ATR if valid, otherwise fallback to percentage
        if not pd.isna(atr) and atr > 0:
            if side == 'buy':
                tp = entry_price + (multiplier * atr)
                # Sanity check: TP must be > entry price
                if tp <= entry_price:
                    tp = entry_price * 1.02  # Fallback: minimum 2%
                return tp
            else:
                tp = entry_price - (multiplier * atr)
                # Sanity check: TP must be < entry price
                if tp >= entry_price:
                    tp = entry_price * 0.98  # Fallback: minimum 2% down
                return tp
        else:
            # Fallback: use fixed percentage if ATR unavailable
            if side == 'buy':
                return entry_price * 1.025  # 2.5% TP
            else:
                return entry_price * 0.975  # 2.5% down

