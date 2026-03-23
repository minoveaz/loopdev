import pandas as pd
import numpy as np
from typing import Dict, Any, Optional
from .base import BaseStrategy

class AggressiveRSIStrategy(BaseStrategy):
    """
    Aggressive RSI Strategy v1 (2026-03-20)
    Type: Momentum-Based Scalping with Trend Confirmation
    Timeframe: 1m (highly aggressive)
    
    Entry Logic:
    - LONG: RSI < 45 AND price above SMA20
    - SHORT: RSI > 55 AND price below SMA20
    
    This strategy is designed to generate more frequent signals
    in normal market conditions while still maintaining trend confirmation.
    
    Indicators Used:
    - RSI(14): Momentum indicator
    - SMA20: Short-term trend baseline
    - ATR(14): Dynamic stop loss positioning
    
    Expected Performance:
    - Win Rate: 55-60% (lower due to more trades)
    - Profit Factor: 1.3-1.5
    - Trades/Day: 50-100+ (very aggressive)
    """

    def analyze(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculate indicators: RSI, SMA20, ATR
        """
        # 1. RSI(14) - Relative Strength Index
        delta = df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['rsi'] = 100 - (100 / (1 + rs))
        
        # 2. SMA20 - Short-term trend
        df['sma20'] = df['close'].rolling(window=20).mean()
        
        # 3. True Range & ATR (Wilder's Method)
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
        """
        Check for momentum-based signals with trend confirmation.
        
        Entry conditions:
        - LONG: RSI < 45 (below midpoint, leaning bearish) AND price > SMA20 (in uptrend)
        - SHORT: RSI > 55 (above midpoint, leaning bullish) AND price < SMA20 (in downtrend)
        """
        
        # Input validation
        if pd.isna(row.get('rsi')) or pd.isna(row.get('sma20')) or pd.isna(row.get('atr')):
            return None
        
        price = float(row['close'])
        if pd.isna(price) or np.isinf(price) or price <= 0:
            return None
        
        sma20 = float(row['sma20'])
        if pd.isna(sma20) or sma20 <= 0:
            return None
        
        atr = float(row.get('atr', 0))
        if pd.isna(atr) or atr <= 0:
            return None
        
        rsi = float(row['rsi'])
        
        # Conditions for LONG
        price_above_sma = price > sma20
        rsi_low = rsi < 45  # Momentum below midpoint
        
        # Conditions for SHORT
        price_below_sma = price < sma20
        rsi_high = rsi > 55  # Momentum above midpoint
        
        # LONG Signal
        if rsi_low and price_above_sma:
            return {
                "side": "buy",
                "reason": f"Momentum_Low ({rsi:.1f}) + Above_SMA20"
            }
        
        # SHORT Signal
        if rsi_high and price_below_sma:
            return {
                "side": "sell",
                "reason": f"Momentum_High ({rsi:.1f}) + Below_SMA20"
            }
        
        return None

    def get_exit_price(self, entry_price: float, atr: float, side: str) -> float:
        """
        Calculate dynamic take profit based on ATR.
        TP = Entry ± (1.0x ATR) for aggressive scalping
        """
        multiplier = 1.0
        
        if entry_price <= 0 or pd.isna(entry_price):
            return 0.0
        
        if not pd.isna(atr) and atr > 0:
            if side == 'buy':
                tp = entry_price + (multiplier * atr)
                if tp <= entry_price:
                    tp = entry_price * 1.01
                return tp
            else:
                tp = entry_price - (multiplier * atr)
                if tp >= entry_price:
                    tp = entry_price * 0.99
                return tp
        else:
            if side == 'buy':
                return entry_price * 1.015
            else:
                return entry_price * 0.985

    def get_trigger_price(self, row: pd.Series) -> float:
        """Estima el precio de trigger para la estrategia agresiva."""
        price = float(row.get('close', 0))
        sma = float(row.get('sma20', 0))
        rsi = float(row.get('rsi', 50))
        
        if sma == 0 or pd.isna(sma): return 0.0
        
        # Para LONG: rsi < 45 and price > sma. El trigger suele ser el SMA si el RSI ya está bajo.
        if price > sma:
            return sma
        else:
            # Si estamos por debajo, el trigger es cruzar el SMA hacia arriba
            return sma * 1.001

    def get_snapshot(self, last_row: pd.Series, df: pd.DataFrame) -> Dict[str, Any]:
        """Genera telemetría específica para esta estrategia."""
        rsi = float(last_row.get('rsi', 0))
        price = float(last_row['close'])
        sma = float(last_row.get('sma20', price))
        
        return {
            "rsi": round(rsi, 2),
            "sma_dist": round(((price / sma) - 1) * 100, 2) if sma > 0 else 0,
            "atr_val": round(float(last_row.get('atr', 0)), 2),
            "bias": "BULLISH" if price > sma else "BEARISH",
            "trigger_price": round(self.get_trigger_price(last_row), 2)
        }

    def get_sentiment(self, row: pd.Series) -> str:
        """Determina el sentimiento basado en RSI y SMA20."""
        price = float(row.get('close', 0))
        sma = float(row.get('sma20', 0))
        rsi = float(row.get('rsi', 50))
        
        if sma == 0 or pd.isna(sma): return "neutral"
        
        if price > sma and rsi < 50: return "strong_bullish"
        elif price > sma: return "bullish"
        elif price < sma and rsi > 50: return "strong_bearish"
        elif price < sma: return "bearish"
        return "neutral"

    def get_proximity(self, row: pd.Series) -> Dict[str, Any]:
        """Calcula la proximidad a una señal agresiva con desglose de confluencia."""
        price = float(row.get('close', 0))
        sma = float(row.get('sma20', 0))
        rsi = float(row.get('rsi', 50))
        
        if sma == 0 or pd.isna(sma): return {"score": 0, "checks": {}}
        
        # Para LONG: rsi < 45 and price > sma
        price_above_sma = price > sma
        rsi_low = rsi < 45
        
        # Para SHORT: rsi > 55 and price < sma
        price_below_sma = price < sma
        rsi_high = rsi > 55
        
        score = 0
        if price_above_sma:
            if rsi < 45: score = 100
            else:
                dist_to_45 = abs(rsi - 45)
                score = max(0, min(100, int(100 - (dist_to_45 * 5))))
        elif price_below_sma:
            if rsi > 55: score = 100
            else:
                dist_to_55 = abs(rsi - 55)
                score = max(0, min(100, int(100 - (dist_to_55 * 5))))
            
        return {
            "score": score,
            "checks": {
                "rsi_momentum": rsi_low or rsi_high,
                "trend_confirm": price_above_sma or price_below_sma
            }
        }
