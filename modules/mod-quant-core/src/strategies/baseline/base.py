from abc import ABC, abstractmethod
import pandas as pd
from typing import Dict, Any, Optional

class BaseStrategy(ABC):
    """
    Abstract Base Class for all Quant Ops strategies.
    Enforces a standard interface for analysis and signal generation.
    """
    
    @abstractmethod
    def analyze(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Applies indicators and logic to the DataFrame.
        Should return the DataFrame with added signal columns.
        """
        pass

    @abstractmethod
    def check_signal(self, row: pd.Series, previous_row: pd.Series) -> Optional[Dict[str, Any]]:
        """
        Evaluates a single candle (and its predecessor) for entry signals.
        Returns a dictionary with 'side', 'type', etc. if a signal exists, else None.
        """
        pass
    
    @abstractmethod
    def get_exit_price(self, entry_price: float, atr: float, side: str) -> float:
        """
        Calculates dynamic take profit or stop loss levels.
        """
        pass
    
    def get_sentiment(self, row: pd.Series) -> str:
        """
        Calculates the current market sentiment (bullish/bearish/neutral).
        Default implementation uses price position relative to a median (if available).
        """
        return "neutral"
    
    def get_proximity(self, row: pd.Series) -> Dict[str, Any]:
        """
        Calculates how close we are to a signal (0 to 100) and returns
        the breakdown of specific confluence checks.
        
        Returns:
            Dict: {
                "score": int (0-100),
                "checks": Dict[str, bool] (e.g., {"rsi": True, "trend": False})
            }
        """
        return {
            "score": 0,
            "checks": {}
        }
    
    def get_trigger_price(self, row: pd.Series) -> float:
        """
        Estimates the price at which a signal would be triggered.
        Used for the 'Distance to Trigger' UI element.
        """
        return 0.0
    
    def get_snapshot(self, last_row: pd.Series, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Generates a dictionary of technical metrics for the bot telemetry.
        Default implementation returns price-based info.
        """
        return {
            "price": float(last_row.get('close', 0)),
            "volume": float(last_row.get('volume', 0)),
            "timestamp": str(last_row.get('timestamp', ''))
        }
    
    def calculate_trailing_stop(self, current_price: float, max_price: float, callback_pct: float = 0.3) -> bool:
        """
        Determines if a trailing stop should be triggered.
        
        Args:
            current_price: Current market price
            max_price: Highest price reached since entry
            callback_pct: Percentage pullback to trigger exit (default 0.3%)
        
        Returns:
            True if trailing stop should be triggered, False otherwise
            
        ADDED (2026-03-18): Was missing, now implemented in base class
        """
        if max_price <= 0 or current_price <= 0:
            return False
        
        # Calculate pullback percentage from highest point
        pullback = ((max_price - current_price) / max_price) * 100
        
        # Trigger if pullback exceeds callback threshold
        return pullback >= callback_pct

