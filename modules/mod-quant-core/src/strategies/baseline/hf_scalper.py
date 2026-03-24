import pandas as pd
import numpy as np
from typing import Dict, Any, Optional
from .base import BaseStrategy

class HighFrequencyScalperStrategy(BaseStrategy):
    """
    HF_SCALPER_SNIPER v1.0
    Type: High-Frequency Momentum / Scalping
    Timeframe: 1m (Optimized for 5m trades)
    Direction: Bidirectional (Long & Short)
    """
    
    def __init__(self):
        self.version = "1.0.0"

    def analyze(self, df: pd.DataFrame) -> pd.DataFrame:
        # EMAs rápidas para detección de micro-tendencia
        df['ema9'] = df['close'].ewm(span=9, adjust=False).mean()
        df['ema21'] = df['close'].ewm(span=21, adjust=False).mean()
        
        # RSI corto (7) para reactividad máxima
        delta = df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=7).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=7).mean()
        rs = gain / loss
        df['rsi7'] = 100 - (100 / (1 + rs))
        
        # Volumen promedio
        df['vol_sma'] = df['volume'].rolling(window=5).mean()
        
        return df

    def get_snapshot(self, last_row, df):
        rsi = float(last_row.get('rsi7', 50))
        price = float(last_row['close'])
        ema9 = float(last_row.get('ema9', price))
        
        return {
            "rsi_7": round(rsi, 2),
            "ema_dist": round(((price / ema9) - 1) * 100, 3) if ema9 > 0 else 0,
            "vol_surge": "YES" if last_row.get('volume', 0) > last_row.get('vol_sma', 0) * 1.2 else "NO",
            "bias": self.get_sentiment(last_row).upper(),
            "logic_ver": self.version
        }

    def get_sentiment(self, row: pd.Series) -> str:
        ema9 = float(row.get('ema9', 0))
        ema21 = float(row.get('ema21', 0))
        if ema9 == 0 or ema21 == 0: return "neutral"
        
        if ema9 > ema21: return "bullish"
        if ema9 < ema21: return "bearish"
        return "neutral"

    def get_trigger_price(self, row: pd.Series) -> float:
        # En scalping, el trigger es la EMA9 (el imán del precio)
        return float(row.get('ema9', 0))

    def get_proximity(self, row: pd.Series) -> Dict[str, Any]:
        rsi = float(row.get('rsi7', 50))
        ema9 = float(row.get('ema9', 0))
        ema21 = float(row.get('ema21', 0))
        price = float(row.get('close', 0))
        
        if ema9 == 0 or ema21 == 0: return {"score": 0, "checks": {}}
        
        # Confluencias para LONG
        trend_up = ema9 > ema21
        rsi_oversold = rsi < 40
        price_near_ema = abs(price/ema9 - 1) < 0.001
        
        # Confluencias para SHORT
        trend_down = ema9 < ema21
        rsi_overbought = rsi > 60
        
        score = 0
        if trend_up:
            score = max(0, min(100, int(100 - (abs(rsi - 30) * 2))))
        elif trend_down:
            score = max(0, min(100, int(100 - (abs(rsi - 70) * 2))))
            
        return {
            "score": score,
            "checks": {
                "trend_align": trend_up or trend_down,
                "rsi_ready": rsi_oversold or rsi_overbought,
                "vol_confirm": row.get('volume', 0) > row.get('vol_sma', 0)
            }
        }

    def check_signal(self, row: pd.Series, previous_row: pd.Series) -> Optional[Dict[str, Any]]:
        ema9 = float(row['ema9'])
        ema21 = float(row['ema21'])
        rsi = float(row['rsi7'])
        price = float(row['close'])
        vol = float(row['volume'])
        vol_avg = float(row['vol_sma'])
        
        # --- UMBRAL SNIPER: Exigimos un 50% más de volumen que la media reciente ---
        vol_ready = vol > (vol_avg * 1.5)
        
        # --- LÓGICA LONG ---
        if ema9 > ema21 and rsi < 45:
            if price > ema9 and vol_ready:
                return {"side": "buy", "reason": "HF_MOMENTUM_LONG"}
                
        # --- LÓGICA SHORT ---
        if ema9 < ema21 and rsi > 55:
            if price < ema9 and vol_ready:
                return {"side": "sell", "reason": "HF_MOMENTUM_SHORT"}

        return None

    def get_exit_price(self, entry_price: float, atr: float, side: str) -> float:
        # Objetivos ultra-cortos para Scalping 5m
        if side == 'buy':
            return entry_price * 1.008 # 0.8% TP
        else:
            return entry_price * 0.992 # 0.8% SL
