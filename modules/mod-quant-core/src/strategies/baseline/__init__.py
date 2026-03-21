# Baseline Strategies (v0) - Deprecated
# These are kept for reference/backwards compatibility
# Use asset-specific strategies instead (e.g., bitcoin/, ethereum/)

from .rsi_mean_reversion import RSIMeanReversionStrategy
from .intraday_atr import IntradayATRStrategy
from .aggressive_rsi import AggressiveRSIStrategy
from .hybrid_core import HybridCoreStrategy

__all__ = [
    "RSIMeanReversionStrategy",
    "IntradayATRStrategy",
    "AggressiveRSIStrategy",
    "HybridCoreStrategy",
]
