import pandas as pd
import numpy as np
from typing import Dict, Any, Optional
from .base import BaseStrategy

class HybridCoreStrategy(BaseStrategy):
    """
    Type: Trend Follower with Breakout Confirmation
    Core: Bollinger + SMA20 + ATR (NEW)
    
    FIXED (2026-03-18):
    - Added ATR calculation (True Range with EMA)
    - Now properly uses ATR in exit price calculations
    """

    def analyze(self, df: pd.DataFrame) -> pd.DataFrame:
        df['sma20'] = df['close'].rolling(window=20).mean()
        df['std'] = df['close'].rolling(window=20).std()
        df['bb_upper'] = df['sma20'] + 2 * df['std']
        df['bb_lower'] = df['sma20'] - 2 * df['std']
        
        # Add ATR calculation (same as IntradayATRStrategy)
        df['tr'] = np.maximum(
            df['high'] - df['low'],
            np.maximum(
                np.abs(df['high'] - df['close'].shift()),
                np.abs(df['low'] - df['close'].shift())
            )
        )
        df['atr'] = df['tr'].ewm(span=14, adjust=False).mean()
        
        return df

    def check_signal(self, row: pd.Series, previous_row: pd.Series) -> Optional[Dict[str, Any]]:
        if pd.isna(row.get('bb_upper')): 
            return None
        
        # FIXED (2026-03-18): Validate inputs
        price = float(row['close'])
        if pd.isna(price) or np.isinf(price) or price <= 0:
            return None
        
        upper = float(row['bb_upper'])
        lower = float(row['bb_lower'])
        if pd.isna(upper) or pd.isna(lower):
            return None
        
        atr = float(row.get('atr', 0))
        if pd.isna(atr) or atr <= 0:
            return None
        
        # 2026 Strategy: Cross Bollinger Band with ATR confirmation
        if price > upper:
            # Filter: Breakout must be significant
            breakout_magnitude = (price - upper) / atr if atr > 0 else 0
            if breakout_magnitude < 0.3:  # Breakout at least 0.3x ATR
                return None
            return {"side": "buy", "reason": "BB_BREAKOUT_UP"}
        
        if price < lower:
            # Same filter for short signals
            breakout_magnitude = (lower - price) / atr if atr > 0 else 0
            if breakout_magnitude < 0.3:
                return None
            return {"side": "sell", "reason": "BB_BREAKOUT_DOWN"}
            
        return None

    def get_exit_price(self, entry_price: float, atr: float, side: str) -> float:
        """
        Hybrid exit: Dynamic TP based on 1.5x ATR
        Fallback: Fixed 2.5% if ATR unavailable
        
        FIXED (2026-03-18): Now actually uses ATR as promised in registry
        """
        # Validate inputs
        if entry_price <= 0 or pd.isna(entry_price):
            return 0.0
        
        # Use ATR-based TP if available
        if not pd.isna(atr) and atr > 0:
            multiplier = 1.5  # 1.5x ATR as registered
            if side == 'buy':
                tp = entry_price + (multiplier * atr)
                # Sanity check
                if tp <= entry_price:
                    tp = entry_price * 1.025
                return tp
            else:
                tp = entry_price - (multiplier * atr)
                # Sanity check
                if tp >= entry_price:
                    tp = entry_price * 0.975
                return tp
        else:
            # Fallback to fixed percentage when ATR unavailable
            if side == 'buy':
                return entry_price * 1.025  # 2.5% TP
            else:
                return entry_price * 0.975  # 2.5% down

    def get_trigger_price(self, row: pd.Series) -> float:
        """Estima el trigger como la banda de Bollinger más cercana."""
        price = float(row.get('close', 0))
        upper = float(row.get('bb_upper', price))
        lower = float(row.get('bb_lower', price))
        
        dist_to_upper = abs(upper - price)
        dist_to_lower = abs(lower - price)
        
        return upper if dist_to_upper < dist_to_lower else lower

    def get_snapshot(self, last_row: pd.Series, df: pd.DataFrame) -> Dict[str, Any]:
        """Genera telemetría específica para esta estrategia."""
        price = float(last_row['close'])
        upper = float(last_row.get('bb_upper', price))
        lower = float(last_row.get('bb_lower', price))
        atr = float(last_row.get('atr', 0))
        
        return {
            "bb_dist_up": round(((upper / price) - 1) * 100, 2) if price > 0 else 0,
            "bb_dist_low": round(((price / lower) - 1) * 100, 2) if lower > 0 else 0,
            "atr_val": round(atr, 2),
            "vol_status": "HIGH" if atr > df['atr'].mean() else "LOW",
            "trigger_price": round(self.get_trigger_price(last_row), 2)
        }

    def get_sentiment(self, row: pd.Series) -> str:
        """Determina el sentimiento basado en Bollinger y SMA20."""
        price = float(row.get('close', 0))
        sma = float(row.get('sma20', 0))
        upper = float(row.get('bb_upper', 0))
        lower = float(row.get('bb_lower', 0))
        
        if sma == 0 or pd.isna(sma): return "neutral"
        
        if price > upper: return "overbought_breakout"
        elif price < lower: return "oversold_breakout"
        elif price > sma: return "bullish_zone"
        elif price < sma: return "bearish_zone"
        return "neutral"

    def get_proximity(self, row: pd.Series) -> Dict[str, Any]:
        """Calcula la proximidad a una ruptura de Bollinger con desglose."""
        price = float(row.get('close', 0))
        upper = float(row.get('bb_upper', 0))
        lower = float(row.get('bb_lower', 0))
        atr = float(row.get('atr', 0))
        
        if upper == 0 or lower == 0: return {"score": 0, "checks": {}}
        
        # Distancia a la banda más cercana
        dist_to_upper = abs(upper - price)
        dist_to_lower = abs(lower - price)
        min_dist = min(dist_to_upper, dist_to_lower)
        
        # Proximidad porcentual (basada en el ancho de la banda)
        band_width = upper - lower
        if band_width <= 0: score = 0
        else:
            score = max(0, min(100, int(100 - (min_dist / (band_width / 2) * 100))))
        
        # Confluencia: Ruptura significativa (0.3x ATR)
        vol_ready = atr > 0 # Simplificado para el check visual
        
        return {
            "score": score,
            "checks": {
                "bb_touch": score > 90,
                "vol_ready": vol_ready,
                "trend_align": True
            }
        }
