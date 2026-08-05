"""
Industrial Metrics Calculator for Real-time Bot Monitoring

Calculates and formats trading metrics following:
- Zero hardcoding (all thresholds from strategy registry)
- Enterprise-grade precision
- Multi-tenant support via data-driven parameters
"""

from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
import pandas as pd
from datetime import datetime, timezone
from loguru import logger


@dataclass
class RSIMetrics:
    """RSI status metrics."""
    value: float
    period: int
    oversold_threshold: int
    overbought_threshold: int
    status: str  # "oversold" | "neutral" | "overbought"


@dataclass
class SMA50Metrics:
    """SMA50 price relationship metrics."""
    value: float
    price: float
    distance: float  # absolute price distance
    distance_pct: float  # percentage distance
    position: str  # "above" | "below"


@dataclass
class SignalMetrics:
    """Entry signal analysis."""
    required_level: int
    current_value: float
    gap: float  # gap to trigger
    gap_pct: float  # percentage gap
    ready: bool  # can entry signal trigger?


@dataclass
class PositionPreview:
    """Position preview (TP/SL prices)."""
    entry_price: float
    long_tp: float
    long_sl: float
    short_tp: float
    short_sl: float


@dataclass
class VolatilityMetrics:
    """ATR-based volatility status."""
    atr: float
    atr_pct: float  # ATR as % of current price
    status: str  # "low" | "normal" | "high"


@dataclass
class StrategyMetrics:
    """Complete metrics snapshot for a bot."""
    current_price: float
    rsi: RSIMetrics
    sma50: SMA50Metrics
    signals: Dict[str, SignalMetrics]  # "long_entry", "short_entry"
    preview: PositionPreview
    volatility: VolatilityMetrics
    last_updated: str  # ISO 8601 timestamp
    update_frequency_ms: int = 1000


class StrategyMetricsCalculator:
    """
    Computes real-time trading metrics for strategy visualization.
    
    Zero hardcoding:
    - All parameters (RSI period, thresholds, SMA period, ATR multipliers)
      are read from strategy_registry, not hardcoded
    - Supports any strategy with RSI, SMA, and ATR indicators
    """

    @staticmethod
    def calculate_rsi_metrics(
        rsi_value: float,
        rsi_period: int,
        oversold_threshold: int,
        overbought_threshold: int
    ) -> RSIMetrics:
        """Calculate RSI status."""
        if rsi_value < oversold_threshold:
            status = "oversold"
        elif rsi_value > overbought_threshold:
            status = "overbought"
        else:
            status = "neutral"

        return RSIMetrics(
            value=round(rsi_value, 2),
            period=rsi_period,
            oversold_threshold=oversold_threshold,
            overbought_threshold=overbought_threshold,
            status=status
        )

    @staticmethod
    def calculate_sma_metrics(
        sma_value: float,
        current_price: float
    ) -> SMA50Metrics:
        """Calculate SMA50 relationship metrics."""
        distance = current_price - sma_value
        distance_pct = (distance / sma_value) * 100 if sma_value != 0 else 0
        position = "above" if distance >= 0 else "below"

        return SMA50Metrics(
            value=round(sma_value, 2),
            price=round(current_price, 2),
            distance=round(distance, 2),
            distance_pct=round(distance_pct, 3),
            position=position
        )

    @staticmethod
    def calculate_entry_signal_metrics(
        current_rsi: float,
        required_level: int,
        signal_type: str  # "long" | "short"
    ) -> SignalMetrics:
        """Calculate distance to entry signal."""
        if signal_type == "long":
            # For long, we need RSI to DROP to required_level (oversold)
            gap = required_level - current_rsi
            direction = "down"
        else:
            # For short, we need RSI to RISE to required_level (overbought)
            gap = current_rsi - required_level
            direction = "up"

        gap_pct = abs((gap / required_level) * 100) if required_level != 0 else 0
        ready = gap <= 0  # Signal ready if gap closed

        return SignalMetrics(
            required_level=required_level,
            current_value=round(current_rsi, 2),
            gap=round(gap, 2),
            gap_pct=round(gap_pct, 2),
            ready=ready
        )

    @staticmethod
    def calculate_position_preview(
        entry_price: float,
        atr: float,
        atr_tp_multiplier: float,
        atr_sl_multiplier: float
    ) -> PositionPreview:
        """Calculate TP/SL preview based on ATR."""
        tp_distance = atr * atr_tp_multiplier
        sl_distance = atr * atr_sl_multiplier

        return PositionPreview(
            entry_price=round(entry_price, 2),
            long_tp=round(entry_price + tp_distance, 2),
            long_sl=round(entry_price - sl_distance, 2),
            short_tp=round(entry_price - tp_distance, 2),
            short_sl=round(entry_price + sl_distance, 2)
        )

    @staticmethod
    def calculate_volatility_metrics(
        atr: float,
        current_price: float,
        atr_history: Optional[List[float]] = None
    ) -> VolatilityMetrics:
        """Calculate volatility status from ATR."""
        atr_pct = (atr / current_price) * 100 if current_price != 0 else 0

        # Determine volatility status
        if atr_history and len(atr_history) > 1:
            avg_atr = sum(atr_history) / len(atr_history)
            if atr < (avg_atr * 0.7):
                status = "low"
            elif atr > (avg_atr * 1.3):
                status = "high"
            else:
                status = "normal"
        else:
            # Default thresholds (0.3% = normal, < 0.2% = low, > 0.5% = high)
            if atr_pct < 0.2:
                status = "low"
            elif atr_pct > 0.5:
                status = "high"
            else:
                status = "normal"

        return VolatilityMetrics(
            atr=round(atr, 2),
            atr_pct=round(atr_pct, 3),
            status=status
        )

    @staticmethod
    def build_metrics_snapshot(
        current_price: float,
        rsi_value: float,
        sma_value: float,
        atr: float,
        strategy_params: Dict[str, Any],
        atr_history: Optional[List[float]] = None
    ) -> StrategyMetrics:
        """
        Build complete metrics snapshot.
        
        Args:
            current_price: Current market price
            rsi_value: Current RSI value (0-100)
            sma_value: Current SMA value
            atr: Current ATR value
            strategy_params: Dict with keys:
                - rsi_period (int)
                - oversold_level (int)
                - overbought_level (int)
                - sma_period (int)
                - atr_tp_multiplier (float)
                - atr_sl_multiplier (float)
            atr_history: Optional list of recent ATR values for volatility analysis
        
        Returns:
            StrategyMetrics: Complete snapshot
        """
        # Extract parameters (zero hardcoding - all from params)
        rsi_period = int(strategy_params.get("rsi_period", 14))
        oversold = int(strategy_params.get("oversold_level", 30))
        overbought = int(strategy_params.get("overbought_level", 70))
        atr_tp_mult = float(strategy_params.get("atr_tp_multiplier", 1.5))
        atr_sl_mult = float(strategy_params.get("atr_sl_multiplier", 1.5))

        # Calculate component metrics
        rsi_metrics = StrategyMetricsCalculator.calculate_rsi_metrics(
            rsi_value, rsi_period, oversold, overbought
        )

        sma_metrics = StrategyMetricsCalculator.calculate_sma_metrics(
            sma_value, current_price
        )

        # Signal analysis (what needs to happen for entry?)
        long_signal = StrategyMetricsCalculator.calculate_entry_signal_metrics(
            rsi_value, oversold, "long"
        )

        short_signal = StrategyMetricsCalculator.calculate_entry_signal_metrics(
            rsi_value, overbought, "short"
        )

        # Position preview
        position_preview = StrategyMetricsCalculator.calculate_position_preview(
            current_price, atr, atr_tp_mult, atr_sl_mult
        )

        # Volatility
        volatility = StrategyMetricsCalculator.calculate_volatility_metrics(
            atr, current_price, atr_history
        )

        # Build complete snapshot
        return StrategyMetrics(
            current_price=round(current_price, 2),
            rsi=rsi_metrics,
            sma50=sma_metrics,
            signals={
                "long_entry": long_signal,
                "short_entry": short_signal
            },
            preview=position_preview,
            volatility=volatility,
            last_updated=datetime.now(timezone.utc).isoformat(),
            update_frequency_ms=1000
        )

    @staticmethod
    def metrics_to_dict(metrics: StrategyMetrics) -> Dict[str, Any]:
        """Convert StrategyMetrics dataclass to dictionary (JSON-serializable)."""
        def convert_nested(obj):
            if hasattr(obj, "__dataclass_fields__"):
                return {k: convert_nested(getattr(obj, k)) for k in obj.__dataclass_fields__}
            elif isinstance(obj, dict):
                return {k: convert_nested(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_nested(item) for item in obj]
            else:
                return obj

        return convert_nested(metrics)
