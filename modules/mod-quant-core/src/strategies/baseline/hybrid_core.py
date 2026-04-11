
import pandas as pd
import numpy as np
from typing import Dict, Any, Optional
from .base import BaseStrategy

# Importamos indicadores industriales de alta precisión
from src.core.utils.indicators import calculate_rsi, calculate_sma, calculate_atr, calculate_sma_distance

class HybridCoreStrategy(BaseStrategy):
    """
    Hybrid Core Strategy v2 (Industrial Audit 2026-03-28)
    Type: Trend Follower with Volatility Breakout
    Core: Professional Bollinger Bands + SMA200 Trend Guard
    
    Mejoras V2:
    - Uso de indicadores Wilder/Profesionales desde indicators.py.
    - Filtro de Tendencia Mayor (SMA200) para confirmar rupturas.
    - Lógica de proximidad y sentimiento unificada.
    """

    def analyze(self, df: pd.DataFrame) -> pd.DataFrame:
        """Cálculo de indicadores industriales."""
        # 1. Tendencias
        df['sma20'] = calculate_sma(df['close'], period=20)
        df['sma200'] = calculate_sma(df['close'], period=200)
        
        # 2. Bollinger Bands (Basadas en SMA20 Industrial)
        std = df['close'].rolling(window=20).std()
        df['bb_upper'] = df['sma20'] + 2 * std
        df['bb_lower'] = df['sma20'] - 2 * std
        
        # 3. ATR Wilder para validación de ruptura y TP/SL
        df['atr'] = calculate_atr(df, period=14)
        
        return df

    def get_min_volatility(self) -> float:
        """Hybrid Core requiere volatilidad mínima de 0.10% para operar."""
        return 0.10

    def check_signal(self, row: pd.Series, previous_row: pd.Series, tf_data: Optional[Dict[str, pd.DataFrame]] = None) -> Optional[Dict[str, Any]]:
        """Lógica de ruptura de volatilidad con Confluencia Macro (V3)."""
        if pd.isna(row.get('bb_upper')) or pd.isna(row.get('atr')): 
            return None
        
        price = float(row['close'])
        upper = float(row['bb_upper'])
        lower = float(row['bb_lower'])
        atr = float(row['atr'])
        
        # --- CONFLUENCIA MACRO (V3) ---
        macro_bias = "NEUTRAL"
        if tf_data and '15m' in tf_data:
            df_15 = tf_data['15m']
            ma200_15 = df_15['close'].rolling(200).mean().iloc[-1]
            price15 = df_15['close'].iloc[-1]
            macro_bias = "BULLISH" if price15 > ma200_15 else "BEARISH"

        # El breakout debe ser significativo (al menos 0.3x ATR por encima de la banda)
        breakout_threshold = 0.3 * atr

        # 1. Ruptura Alcista (LONG)
        if price > (upper + breakout_threshold):
            if macro_bias == "BULLISH": # Confirmación de tendencia mayor
                return {
                    "side": "buy", 
                    "reason": f"V3_BB_BREAKOUT_UP (15m_UP)"
                }
        
        # 2. Ruptura Bajista (SHORT)
        if price < (lower - breakout_threshold):
            if macro_bias == "BEARISH": # Confirmación de tendencia mayor
                return {
                    "side": "short", 
                    "reason": f"V3_BB_BREAKOUT_DOWN (15m_DOWN)"
                }
            
        return None

    def get_exit_price(self, entry_price: float, atr: float, side: str) -> float:
        """Salidas dinámicas basadas en la volatilidad real."""
        multiplier = 1.5 
        if atr <= 0: return entry_price * (1.025 if side == 'buy' else 0.975)
        
        if side == 'buy':
            return entry_price + (multiplier * atr)
        else:
            return entry_price - (multiplier * atr)

    def get_snapshot(self, last_row: pd.Series, df: pd.DataFrame) -> Dict[str, Any]:
        """Telemetría enriquecida para el dashboard."""
        price = float(last_row['close'])
        upper = float(last_row.get('bb_upper', price))
        lower = float(last_row.get('bb_lower', price))
        sma200 = float(last_row.get('sma200', price))
        atr = float(last_row.get('atr', 0))
        
        return {
            "bb_dist_up": round(((upper / price) - 1) * 100, 2) if price > 0 else 0,
            "bb_dist_low": round(((price / lower) - 1) * 100, 2) if lower > 0 else 0,
            "atr_val": round(atr, 2),
            "trend_bias": "BULLISH" if price > sma200 else "BEARISH",
            "trigger_price": round(upper if price > sma200 else lower, 2)
        }

    def get_sentiment(self, row: pd.Series) -> str:
        """Determina el sentimiento industrial."""
        price = float(row['close'])
        sma200 = float(row.get('sma200', price))
        upper = float(row.get('bb_upper', price))
        lower = float(row.get('bb_lower', price))
        
        if price > upper and price > sma200: return "breakout_bullish"
        if price < lower and price < sma200: return "breakout_bearish"
        if price > sma200: return "bullish_zone"
        if price < sma200: return "bearish_zone"
        return "neutral"

    def get_proximity(self, row: pd.Series) -> Dict[str, Any]:
        """Calcula proximidad para la UI."""
        price = float(row['close'])
        upper = float(row.get('bb_upper', price))
        lower = float(row.get('bb_lower', price))
        sma200 = float(row.get('sma200', price))
        
        # Distancia a la banda que corresponde según tendencia
        side = "LONG" if price > sma200 else "SHORT"
        target_band = upper if side == "LONG" else lower
        
        dist_pct = abs(((price / target_band) - 1) * 100)
        score = max(0, min(100, int(100 - (dist_pct * 30))))
        
        return {
            "score": score,
            "side": side,
            "checks": {
                "trend_align": True,
                "vol_ready": True
            }
        }
