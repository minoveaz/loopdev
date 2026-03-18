from typing import Dict, List, Any
from pydantic import BaseModel

class StrategyParameter(BaseModel):
    id: str
    label: str
    default: Any
    type: str  # number, boolean, select
    description: str
    min: float = None
    max: float = None

class StrategyDefinition(BaseModel):
    id: str
    name: str
    category: str
    description: str
    technical_summary: str
    recommended_timeframe: str
    parameters: List[StrategyParameter]

# --- OFFICIAL CORE REGISTRY ---
STRATEGY_REGISTRY: Dict[str, StrategyDefinition] = {
    "hybrid-core-v1": StrategyDefinition(
        id="hybrid-core-v1",
        name="Industrial Hybrid Core",
        category="Trend Following",
        description="Superior trend-riding protocol combining 2025 Mean Reversion with 2021 Trailing Profit optimization.",
        technical_summary="Detection via SMA20 and Bollinger Bands. Exits are dynamically calculated using ATR and optimized with a 0.3% trailing callback once the target is reached.",
        recommended_timeframe="1h",
        parameters=[
            StrategyParameter(id="atr_multiplier", label="ATR TP Multiplier", default=1.5, type="number", description="Distance from entry to activate trailing stop.", min=1.0, max=5.0),
            StrategyParameter(id="trailing_callback", label="Trailing Callback %", default=0.3, type="number", description="Pullback distance from peak to trigger sell.", min=0.1, max=2.0),
            StrategyParameter(id="sma_period", label="SMA Trend Period", default=20, type="number", description="Period for the baseline trend moving average.", min=10, max=200)
        ]
    ),
    "atr-breakout-v1": StrategyDefinition(
        id="atr-breakout-v1",
        name="ATR Volatility Breakout",
        category="Volatility",
        description="Classic intraday breakout protocol focused on volatility spikes.",
        technical_summary="Uses 14-period ATR to set hard dynamic targets. Ideal for high-volatility sessions.",
        recommended_timeframe="15m",
        parameters=[
            StrategyParameter(id="atr_period", label="ATR Period", default=14, type="number", description="Window for volatility measurement.", min=7, max=50),
            StrategyParameter(id="tp_multiplier", label="Target Multiplier", default=1.5, type="number", description="Multiple of ATR for Take Profit.", min=1.0, max=3.0)
        ]
    ),
    "rsi-mean-rev-v1": StrategyDefinition(
        id="rsi-mean-rev-v1",
        name="RSI Mean Reversion Pro",
        category="Mean Reversion",
        description="High-probability mean reversion strategy for intraday scalping. Enters oversold/overbought with trend confirmation.",
        technical_summary="Detects RSI extremes (< 30 for long, > 70 for short) and confirms with price position relative to SMA50. Uses ATR for dynamic risk management. Exit via TP at 1.5x ATR or SL at opposite 1.5x ATR.",
        recommended_timeframe="5m, 15m",
        parameters=[
            StrategyParameter(id="rsi_period", label="RSI Period", default=14, type="number", description="Window for RSI calculation.", min=7, max=21),
            StrategyParameter(id="oversold_level", label="Oversold Level", default=30, type="number", description="RSI threshold to trigger buy signal.", min=15, max=35),
            StrategyParameter(id="overbought_level", label="Overbought Level", default=70, type="number", description="RSI threshold to trigger sell signal.", min=65, max=85),
            StrategyParameter(id="sma_period", label="SMA Confirmation Period", default=50, type="number", description="Moving average for trend confirmation.", min=20, max=100),
            StrategyParameter(id="atr_tp_multiplier", label="ATR TP Multiplier", default=1.5, type="number", description="Multiple of ATR for take profit distance.", min=1.0, max=3.0),
            StrategyParameter(id="atr_sl_multiplier", label="ATR SL Multiplier", default=1.5, type="number", description="Multiple of ATR for stop loss distance.", min=1.0, max=3.0)
        ]
    )
}

def get_full_registry() -> List[StrategyDefinition]:
    return list(STRATEGY_REGISTRY.values())
