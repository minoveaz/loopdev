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
    trading_style: str # SCALPING, DAY_TRADING, SWING
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
        trading_style="DAY_TRADING",
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
        trading_style="DAY_TRADING",
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
        trading_style="SCALPING",
        description="High-probability mean reversion strategy for high-frequency trading.",
        technical_summary="Detects RSI extremes (< 30 for long, > 70 for short). Optimized for 1m-5m timeframes with tight 1.5% profit targets.",
        recommended_timeframe="1m, 5m",
        parameters=[
            StrategyParameter(id="rsi_period", label="RSI Period", default=14, type="number", description="Window for RSI calculation.", min=7, max=21),
            StrategyParameter(id="oversold_level", label="Oversold Level", default=30, type="number", description="RSI threshold to trigger buy signal.", min=15, max=35),
            StrategyParameter(id="overbought_level", label="Overbought Level", default=70, type="number", description="RSI threshold to trigger sell signal.", min=65, max=85),
            StrategyParameter(id="sma_period", label="SMA Confirmation Period", default=50, type="number", description="Moving average for trend confirmation.", min=20, max=100),
            StrategyParameter(id="atr_tp_multiplier", label="ATR TP Multiplier", default=1.2, type="number", description="Optimized for scalping.", min=0.5, max=2.0),
            StrategyParameter(id="atr_sl_multiplier", label="ATR SL Multiplier", default=0.8, type="number", description="Optimized for scalping.", min=0.5, max=2.0)
        ]
    ),
    "aggressive-rsi-v1": StrategyDefinition(
        id="aggressive-rsi-v1",
        name="Aggressive RSI Scalper",
        category="Momentum",
        trading_style="SCALPING",
        description="Aggressive momentum strategy designed for high-frequency scalping.",
        technical_summary="Detects RSI momentum (< 45 for long, > 55 for short) and confirms with SMA20. Uses ultra-tight 1.0% targets.",
        recommended_timeframe="1m",
        parameters=[
            StrategyParameter(id="rsi_period", label="RSI Period", default=14, type="number", description="Window for RSI calculation.", min=7, max=21),
            StrategyParameter(id="rsi_lower", label="RSI Buy Threshold", default=45, type="number", description="RSI below this triggers buy signal.", min=30, max=50),
            StrategyParameter(id="rsi_upper", label="RSI Sell Threshold", default=55, type="number", description="RSI above this triggers sell signal.", min=50, max=70),
            StrategyParameter(id="sma_period", label="SMA Confirmation Period", default=20, type="number", description="Moving average for trend confirmation.", min=10, max=50),
            StrategyParameter(id="atr_tp_multiplier", label="ATR TP Multiplier", default=1.0, type="number", description="Optimized for aggressive scalping.", min=0.5, max=1.5)
        ]
    ),
    "hf-scalper-v1": StrategyDefinition(
        id="hf-scalper-v1",
        name="HF Scalper Sniper",
        category="High Frequency",
        trading_style="SCALPING",
        description="Ultra-fast bidirectional scalping protocol for 1m timeframes. Targets micro-momentum spikes.",
        technical_summary="Dual EMA (9/21) crossover with RSI7 extreme filtering. High sensitivity to volume surges. Designed for 5-15 minute trade duration.",
        recommended_timeframe="1m",
        parameters=[
            StrategyParameter(id="ema_fast", label="Fast EMA", default=9, type="number", description="Period for the trigger EMA.", min=5, max=15),
            StrategyParameter(id="ema_slow", label="Slow EMA", default=21, type="number", description="Period for the trend EMA.", min=15, max=50),
            StrategyParameter(id="rsi_period", label="RSI Period", default=7, type="number", description="Ultra-fast RSI window.", min=5, max=10),
            StrategyParameter(id="tp_pct", label="Take Profit %", default=0.8, type="number", description="Percentage target for exit.", min=0.3, max=2.0),
            StrategyParameter(id="sl_pct", label="Stop Loss %", default=0.6, type="number", description="Percentage risk limit.", min=0.3, max=1.5)
        ]
    )
}

def get_full_registry() -> List[StrategyDefinition]:
    return list(STRATEGY_REGISTRY.values())
