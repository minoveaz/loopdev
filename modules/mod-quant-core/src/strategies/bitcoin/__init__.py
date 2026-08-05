"""
Bitcoin-Specific Strategies

These strategies are optimized for BTC/USDT trading with parameters
tuned for Bitcoin's volatility, liquidity, and behavior patterns.
"""

from .btc_trend_following import BTCTrendFollowing

__all__ = ["BTCTrendFollowing"]

