import pandas as pd
from typing import Dict, Any, Optional
from .base import BaseStrategy

class IntradayATRStrategy(BaseStrategy):
    """
    Port of the Legacy 2025 Bot Logic.
    Type: Mean Reversion / Breakout
    Indicators: SMA(20), BB(20, 2.0), ATR(14)
    Exit: Dynamic TP based on 1.5x ATR
    """

    def analyze(self, df: pd.DataFrame) -> pd.DataFrame:
        # 1. Indicators Calculation
        df['SMA20'] = df['close'].rolling(window=20).mean()
        df['std'] = df['close'].rolling(window=20).std()
        df['BB_upper'] = df['SMA20'] + 2 * df['std']
        df['BB_lower'] = df['SMA20'] - 2 * df['std']
        
        # ATR Calculation (Manual implementation matching legacy code)
        df['tr'] = df['high'] - df['low']
        # Legacy code calculated ATR as simple rolling mean of High-Low range
        # df['ATR'] = df['high'] - df['low'] -> df['ATR'].rolling(14).mean()
        # We stick to the legacy logic strictly for V1
        df['ATR'] = df['tr'].rolling(window=14).mean()
        
        return df

    def check_signal(self, row: pd.Series, previous_row: pd.Series) -> Optional[Dict[str, Any]]:
        """
        Entry Logic:
        - LONG if Price crosses ABOVE SMA20
        - SHORT if Price crosses BELOW SMA20
        """
        # Ensure we have enough data
        if pd.isna(row['SMA20']) or pd.isna(previous_row['SMA20']):
            return None

        price = row['close']
        prev_price = previous_row['close']
        sma = row['SMA20']
        prev_sma = previous_row['SMA20']

        # Crossover Logic
        cross_above = prev_price < prev_sma and price > sma
        cross_below = prev_price > prev_sma and price < sma

        if cross_above:
            return {"side": "buy", "reason": "SMA20_CROSS_UP"}
        
        if cross_below:
            return {"side": "sell", "reason": "SMA20_CROSS_DOWN"}

        return None

    def get_exit_price(self, entry_price: float, atr: float, side: str) -> float:
        """
        Legacy Exit Logic:
        TP = Entry + (1.5 * ATR) for Buy
        TP = Entry - (1.5 * ATR) for Sell
        """
        multiplier = 1.5
        
        if side == 'buy':
            return entry_price + (multiplier * atr)
        else:
            return entry_price - (multiplier * atr)
