
import pandas as pd
import numpy as np
from typing import Dict, Any, Optional
from .base import BaseStrategy

# Importamos indicadores industriales de alta precisión
from src.core.utils.indicators import calculate_rsi, calculate_sma, calculate_atr, calculate_sma_distance

class HighFrequencyScalperStrategy(BaseStrategy):
    """
    HF_SCALPER_SNIPER v2 (Industrial Audit 2026-03-28)
    Type: High-Frequency Momentum / Scalping
    
    Mejoras V2:
    - RSI-7 con suavizado Wilder para filtrar micro-ruido.
    - ATR-14 Wilder para asegurar volatilidad mínima (Scalping Guard).
    - Lógica de entrada refinada con EMA9/21 y momentum filtrado.
    """
    
    def __init__(self):
        self.version = "2.0.0"
        self.vol_multiplier = 1.15 # Exigimos 15% más de volumen que la media

    def analyze(self, df: pd.DataFrame) -> pd.DataFrame:
        """Cálculo de indicadores para alta frecuencia."""
        # 1. EMAs para micro-tendencia
        df['ema9'] = df['close'].ewm(span=9, adjust=False).mean()
        df['ema21'] = df['close'].ewm(span=21, adjust=False).mean()
        
        # 2. RSI-7 Wilder (Más estable para scalping que el RSI simple)
        df['rsi'] = calculate_rsi(df['close'], period=7)
        
        # 3. ATR-14 Wilder para medir el 'pulso' del mercado
        df['atr'] = calculate_atr(df, period=14)
        
        # 4. Volumen promedio (últimos 5 minutos)
        df['vol_sma'] = df['volume'].rolling(window=5).mean()
        
        return df

    def check_signal(self, row: pd.Series, previous_row: pd.Series) -> Optional[Dict[str, Any]]:
        """
        Lógica de Sniper: Buscamos impulsos fuertes alineados con la micro-tendencia.
        """
        if pd.isna(row.get('rsi')) or pd.isna(row.get('ema9')):
            return None

        price = float(row['close'])
        ema9 = float(row['ema9'])
        ema21 = float(row['ema21'])
        rsi = float(row['rsi'])
        atr = float(row.get('atr', 0))
        vol = float(row.get('volume', 0))
        vol_avg = float(row.get('vol_sma', 0))
        
        # Filtros de Seguridad Scalping
        # 1. Volatilidad mínima: El ATR debe ser superior al costo de comisiones (0.20%)
        # Exigimos un 0.25% para asegurar que después de fees quede ganancia neta.
        vol_ready = vol > (vol_avg * self.vol_multiplier)
        atr_ready = atr > (price * 0.0025) 
        
        if not (vol_ready and atr_ready):
            return None

        # 2. Señal LONG (Compra)
        # Tendencia alcista (EMA9 > EMA21) + RSI ganando fuerza ( > 55)
        if ema9 > ema21 and rsi > 55 and price > ema9:
            return {
                "side": "buy",
                "reason": f"V2_HF_LONG (RSI:{rsi:.1f})"
            }
                
        # 3. Señal SHORT (Venta)
        # Tendencia bajista (EMA9 < EMA21) + RSI perdiendo fuerza ( < 45)
        if ema9 < ema21 and rsi < 45 and price < ema9:
            return {
                "side": "short",
                "reason": f"V2_HF_SHORT (RSI:{rsi:.1f})"
            }

        return None

    def get_snapshot(self, last_row: pd.Series, df: pd.DataFrame) -> Dict[str, Any]:
        """Telemetría para scalping."""
        rsi = float(last_row.get('rsi', 50))
        price = float(last_row['close'])
        ema9 = float(last_row.get('ema9', price))
        
        return {
            "rsi": round(rsi, 2),
            "ema_dist": round(calculate_sma_distance(price, ema9), 3),
            "vol_status": "HIGH" if last_row.get('volume', 0) > last_row.get('vol_sma', 0) else "LOW",
            "market_bias": self.get_sentiment(last_row).upper(),
            "atr_val": round(float(last_row.get('atr', 0)), 2),
            "logic_ver": self.version
        }

    def get_sentiment(self, row: pd.Series) -> str:
        ema9 = float(row.get('ema9', 0))
        ema21 = float(row.get('ema21', 0))
        if ema9 > ema21: return "bullish"
        if ema9 < ema21: return "bearish"
        return "neutral"

    def get_trigger_price(self, row: pd.Series) -> float:
        return float(row.get('ema9', 0))

    def get_proximity(self, row: pd.Series) -> Dict[str, Any]:
        """Calcula proximidad real considerando filtros de seguridad."""
        rsi = float(row.get('rsi', 50))
        ema9 = float(row.get('ema9', 0))
        ema21 = float(row.get('ema21', 0))
        price = float(row['close'])
        vol = float(row.get('volume', 0))
        vol_avg = float(row.get('vol_sma', 0))
        atr = float(row.get('atr', 0))

        if ema9 == 0 or ema21 == 0: return {"score": 0, "side": "NEUTRAL", "checks": {}}

        # 1. Filtros de Seguridad (Misma lógica que check_signal)
        vol_ready = vol > (vol_avg * self.vol_multiplier)
        atr_ready = atr > (price * 0.0002)
        
        score = 0
        side = "WAITING"
        
        if ema9 > ema21: # Tendencia Alcista
            side = "LONG"
            # Score base por RSI (buscamos momentum > 55)
            score = max(0, min(100, int((rsi - 30) * 2)))
        elif ema9 < ema21: # Tendencia Bajista
            side = "SHORT"
            # Score base por RSI (buscamos momentum < 45)
            score = max(0, min(100, int((70 - rsi) * 2)))
            
        # 2. Penalización por falta de confluencia técnica
        # Si los filtros de seguridad no pasan, limitamos el score al 70%
        if not (vol_ready and atr_ready):
            score = min(score, 70)
            
        return {
            "score": score,
            "side": side,
            "checks": {
                "trend_align": True,
                "vol_ready": bool(vol_ready),
                "atr_signal": bool(atr_ready)
            }
        }

    def get_exit_price(self, entry_price: float, atr: float, side: str) -> float:
        """Salidas quirúrgicas para HF Scalping."""
        # En HF, usamos 1.0x ATR para un TP rápido y seguro.
        multiplier = 1.0
        if atr <= 0: return entry_price * (1.005 if side == 'buy' else 0.995)
        
        if side == 'buy':
            return entry_price + (multiplier * atr)
        else:
            return entry_price - (multiplier * atr)
