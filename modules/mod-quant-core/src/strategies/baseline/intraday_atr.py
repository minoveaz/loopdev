import pandas as pd
import numpy as np
from typing import Dict, Any, Optional
from .base import BaseStrategy

class IntradayATRStrategy(BaseStrategy):
    """
    Port of the Legacy 2025 Bot Logic (Pure Pandas Implementation).
    Type: Mean Reversion / Breakout
    VERSION: 1.1.0 (2026-03-22) - ATR Filter Sensitivity Update
    """
    
    def __init__(self, atr_threshold=0.0005):
        self.version = "1.1.0"
        self.atr_threshold = atr_threshold

    def analyze(self, df: pd.DataFrame) -> pd.DataFrame:
        # Indicators Calculation (Pure Pandas)
        df['sma20'] = df['close'].rolling(window=20).mean()
        df['std'] = df['close'].rolling(window=20).std()
        df['bb_upper'] = df['sma20'] + 2 * df['std']
        df['bb_lower'] = df['sma20'] - 2 * df['std']
        
        # ATR Calculation (Wilder's True Range)
        high_low = df['high'] - df['low']
        high_cp = np.abs(df['high'] - df['close'].shift())
        low_cp = np.abs(df['low'] - df['close'].shift())
        df['tr'] = np.maximum(high_low, np.maximum(high_cp, low_cp))
        
        # Use EMA for ATR
        df['atr'] = df['tr'].ewm(span=14, adjust=False).mean()
        
        return df

    def get_snapshot(self, last_row, df):
        """Genera telemetría específica para esta estrategia."""
        atr = float(last_row.get('atr', 0))
        price = float(last_row['close'])
        sma = float(last_row.get('sma20', price))
        sentiment = self.get_sentiment(last_row)
        
        return {
            "atr_vol": round(atr, 2),
            "sma_dist": round(((price / sma) - 1) * 100, 2) if sma > 0 else 0,
            "vol_status": "HIGH" if atr > df['atr'].mean() else "LOW",
            "bias": sentiment.upper(),
            "market_regime": "VOLATILE" if atr > df['atr'].mean() * 1.2 else "STABLE",
            "trigger_price": round(float(last_row.get('sma20', 0)), 2),
            "logic_ver": self.version
        }

    def check_signal(self, row: pd.Series, previous_row: pd.Series) -> Optional[Dict[str, Any]]:
        # Ensure we have enough data
        if pd.isna(row.get('sma20')) or pd.isna(previous_row.get('sma20')):
            return None
        
        price = float(row['close'])
        prev_price = float(previous_row['close'])
        sma = float(row['sma20'])
        prev_sma = float(previous_row['sma20'])
        atr = float(row.get('atr', 0))
        
        if pd.isna(price) or pd.isna(prev_price) or pd.isna(sma) or pd.isna(prev_sma) or pd.isna(atr) or atr <= 0:
            return None

        # Crossover Logic
        if prev_price < prev_sma and price > sma:
            # SENSITIVITY CHECK: Changed from 0.002 to 0.0005 for 1m stability
            if atr >= price * self.atr_threshold:
                return {"side": "buy", "reason": f"SMA20_CROSS_UP (ATR_OK: {atr:.2f})"}
        
        if prev_price > prev_sma and price < sma:
            if atr >= price * self.atr_threshold:
                return {"side": "sell", "reason": f"SMA20_CROSS_DOWN (ATR_OK: {atr:.2f})"}

        return None

    def get_exit_price(self, entry_price: float, atr: float, side: str) -> float:
        multiplier = 1.5
        if entry_price <= 0 or pd.isna(entry_price):
            return 0.0
        
        if not pd.isna(atr) and atr > 0:
            if side == 'buy':
                return entry_price + (multiplier * atr)
            else:
                return entry_price - (multiplier * atr)
        else:
            return entry_price * (1.025 if side == 'buy' else 0.975)

    def get_sentiment(self, row: pd.Series) -> str:
        """Determina el sesgo del mercado basado en la SMA20."""
        price = float(row.get('close', 0))
        sma = float(row.get('sma20', 0))
        
        if sma == 0 or pd.isna(sma):
            return "neutral"
            
        if price > sma:
            return "bullish"
        elif price < sma:
            return "bearish"
        
        return "neutral"

    def get_trigger_price(self, row: pd.Series) -> float:
        """En esta estrategia, el trigger es el cruce con la SMA20."""
        return float(row.get('sma20', 0))

    def get_proximity(self, row: pd.Series) -> Dict[str, Any]:
        """Calcula la proximidad a un cruce de SMA con filtro de volatilidad."""
        price = float(row.get('close', 0))
        sma = float(row.get('sma20', 0))
        atr = float(row.get('atr', 0))
        
        if sma == 0 or pd.isna(sma):
            return {"score": 0, "checks": {}}
            
        # 1. Check de Cruce (Proximidad al precio)
        dist_pct = abs((price / sma) - 1) * 100
        score = max(0, min(100, int(100 - (dist_pct * 50))))
        
        # 2. Check de Volatilidad (Filtro v1.1.0)
        vol_ready = atr >= price * self.atr_threshold
        
        return {
            "score": score if vol_ready else min(score, 99), # Cap at 99 if vol is missing
            "checks": {
                "price_cross": score > 90,
                "vol_ready": vol_ready,
                "trend_align": True # Siempre activo para esta lógica base
            }
        }
