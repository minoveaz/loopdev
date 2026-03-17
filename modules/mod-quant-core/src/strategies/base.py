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
