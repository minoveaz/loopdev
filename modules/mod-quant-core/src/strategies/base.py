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

