import pandas as pd
import numpy as np
from typing import Literal

class MarketRegimeFilter:
    """
    Industrialized version of the legacy Market Signal logic.
    Identifies market regime based on momentum and volatility.
    """
    
    @staticmethod
    def calculate_regime(df: pd.DataFrame) -> Literal['bullish', 'bearish', 'neutral', 'volatile']:
        """
        Logic rescued from legacy bot:
        - 1: Bullish (> 0.5% growth in last hour)
        - 0: Neutral (Sideways "tonto")
        - -1: Bearish (< -0.5% decline)
        """
        if df.empty or len(df) < 2:
            return 'neutral'
            
        # Cumulative return calculation
        close_prices = df['close'].astype(float)
        hourly_return = (close_prices.iloc[-1] / close_prices.iloc[0]) - 1
        return_pct = hourly_return * 100
        
        # Volatility check (Std Dev of returns)
        returns = close_prices.pct_change().dropna()
        volatility = returns.std() * 100
        
        if volatility > 1.5: # Threshold for high volatility
            return 'volatile'
            
        if return_pct > 0.5:
            return 'bullish'
        elif return_pct < -0.5:
            return 'bearish'
        else:
            return 'neutral'

class OpeningRangeFilter:
    """
    Logic rescued from legacy bot TradingBot2025:
    Calculates the 2-hour opening range to prevent trading in over-extended markets.
    """
    @staticmethod
    def is_within_statistical_range(current_price: float, high_2h: float, low_2h: float, threshold: float = 0.7) -> bool:
        initial_range = high_2h - low_2h
        if initial_range <= 0:
            return True
            
        range_filled_pct = (current_price - low_2h) / initial_range
        return range_filled_pct < threshold
