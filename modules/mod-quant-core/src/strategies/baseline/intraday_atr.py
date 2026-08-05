
import pandas as pd
import numpy as np
from typing import Dict, Any, Optional
from .base import BaseStrategy

# Importamos utilidades industriales de alta precisión
from src.core.utils.indicators import calculate_rsi, calculate_sma, calculate_atr, calculate_sma_distance

class IntradayATRStrategy(BaseStrategy):
    """
    Intraday ATR Breakout Strategy v2 (Industrial Audit 2026-03-27)
    Type: Trend Follower / Breakout
    
    Mejoras V2:
    - ATR Wilder para dimensionar rupturas con precisión industrial.
    - Filtro de Tendencia Mayor (SMA200) para evitar "fakeouts" contra tendencia.
    - Lógica de proximidad refinada para el dashboard.
    """
    
    def __init__(self, atr_threshold=0.0005):
        self.version = "2.0.0"
        self.atr_threshold = atr_threshold

    def analyze(self, df: pd.DataFrame) -> pd.DataFrame:
        """Cálculo de indicadores con precisión profesional."""
        # 1. SMA20 (Corto plazo) y SMA200 (Tendencia Mayor)
        df['sma20'] = calculate_sma(df['close'], period=20)
        df['sma200'] = calculate_sma(df['close'], period=200)
        
        # 2. Bandas de Bollinger para visualización de volatilidad
        std = df['close'].rolling(window=20).std()
        df['bb_upper'] = df['sma20'] + 2 * std
        df['bb_lower'] = df['sma20'] - 2 * std
        
        # 3. ATR Wilder para validación de ruptura
        df['atr'] = calculate_atr(df, period=14)
        
        return df

    def check_signal(self, row: pd.Series, previous_row: pd.Series, tf_data: Optional[Dict[str, pd.DataFrame]] = None) -> Optional[Dict[str, Any]]:
        """Lógica de ruptura con Confluencia Macro (V3)."""
        if pd.isna(row.get('sma20')) or pd.isna(previous_row.get('sma20')):
            return None
        
        price = float(row['close'])
        prev_price = float(previous_row['close'])
        sma20 = float(row['sma20'])
        prev_sma20 = float(previous_row['sma20'])
        atr = float(row.get('atr', 0))
        
        # --- CONFLUENCIA MACRO (V3) ---
        macro_bias = "NEUTRAL"
        if tf_data and '15m' in tf_data:
            df_15 = tf_data['15m']
            ma15 = df_15['close'].rolling(20).mean().iloc[-1]
            price15 = df_15['close'].iloc[-1]
            macro_bias = "BULLISH" if price15 > ma15 else "BEARISH"

        # Filtro de Volatilidad Mínima (Profitability Guard)
        vol_ready = atr >= (price * self.atr_threshold)

        # 1. Ruptura Alcista (LONG)
        # Requiere: Cruce 1m + Macro Tendencia 15m Alcista
        if prev_price < prev_sma20 and price > sma20:
            if macro_bias == "BULLISH" and vol_ready:
                return {
                    "side": "buy", 
                    "reason": f"V3_ATR_Breakout_LONG (15m_UP)"
                }
        
        # 2. Ruptura Bajista (SHORT)
        # Requiere: Cruce 1m + Macro Tendencia 15m Bajista
        if prev_price > prev_sma20 and price < sma20:
            if macro_bias == "BEARISH" and vol_ready:
                return {
                    "side": "short", 
                    "reason": f"V3_ATR_Breakout_SHORT (15m_DOWN)"
                }

        return None

    def get_snapshot(self, last_row: pd.Series, df: pd.DataFrame) -> Dict[str, Any]:
        """Telemetría específica para el dashboard de rupturas."""
        atr = float(last_row.get('atr', 0))
        price = float(last_row['close'])
        sma20 = float(last_row.get('sma20', price))
        sma200 = float(last_row.get('sma200', price))
        
        return {
            "atr_vol": round(atr, 2),
            "sma_dist": round(calculate_sma_distance(price, sma20), 2),
            "vol_status": "HIGH" if atr > df['atr'].mean() else "LOW",
            "trend_status": "BULLISH" if price > sma200 else "BEARISH",
            "trigger_price": round(sma20, 2),
            "logic_ver": self.version
        }

    def get_exit_price(self, entry_price: float, atr: float, side: str) -> float:
        """Salidas optimizadas para seguimiento de tendencia."""
        multiplier = 2.0 # Buscamos recorridos más largos en breakouts
        if atr <= 0: return entry_price * (1.025 if side == 'buy' else 0.975)
        
        if side == 'buy':
            return entry_price + (multiplier * atr)
        else:
            return entry_price - (multiplier * atr)

    def get_sentiment(self, row: pd.Series) -> str:
        """Determina el sesgo basado en la relación con SMA20 y SMA200."""
        price = float(row['close'])
        sma20 = float(row.get('sma20', price))
        sma200 = float(row.get('sma200', price))
        
        if price > sma200 and price > sma20: return "strong_bullish"
        if price < sma200 and price < sma20: return "strong_bearish"
        return "neutral"

    def get_trigger_price(self, row: pd.Series) -> float:
        """El trigger es el valor actual de la SMA20."""
        return float(row.get('sma20', 0))

    def get_proximity(self, row: pd.Series) -> Dict[str, Any]:
        """Calcula proximidad para la UI."""
        price = float(row['close'])
        sma20 = float(row.get('sma20', price))
        sma200 = float(row.get('sma200', price))
        atr = float(row.get('atr', 0))
        
        # 1. Distancia al cruce
        dist_pct = abs(calculate_sma_distance(price, sma20))
        score = max(0, min(100, int(100 - (dist_pct * 40))))
        
        # 2. Alineación con tendencia mayor
        side = "LONG" if price > sma200 else "SHORT"
        
        return {
            "score": score,
            "side": side,
            "checks": {
                "trend_align": (side == "LONG" and price > sma200) or (side == "SHORT" and price < sma200),
                "vol_ready": atr >= (price * self.atr_threshold)
            }
        }
