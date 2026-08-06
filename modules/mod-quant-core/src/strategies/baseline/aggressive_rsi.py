
import pandas as pd
import numpy as np
from typing import Dict, Any, Optional
from .base import BaseStrategy

# Importamos indicadores industriales de alta precisión
from src.core.utils.indicators import calculate_rsi, calculate_sma, calculate_atr, calculate_sma_distance

class AggressiveRSIStrategy(BaseStrategy):
    """
    Aggressive RSI Strategy v2 (Industrial Audit 2026-03-26)
    Type: Momentum-Based Scalping with Professional Indicators
    
    Mejoras V2:
    - Uso de RSI Wilder (suavizado EWM) para eliminar ruido en 1m.
    - ATR Wilder para cálculo exacto de volatilidad.
    - Lógica de SHORT refinada para evitar momentum alcista.
    """

    def analyze(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Cálculo de indicadores con precisión industrial.
        """
        # 1. RSI(14) - Utiliza suavizado de Wilder (EWM)
        df['rsi'] = calculate_rsi(df['close'], period=14)
        
        # 2. SMA20 - Tendencia base
        df['sma20'] = calculate_sma(df['close'], period=20)
        
        # 3. ATR(14) - Volatilidad con método Wilder
        df['atr'] = calculate_atr(df, period=14)
        
        return df

    def get_min_volatility(self) -> float:
        """Aggressive RSI requiere volatilidad mínima de 0.10% para operar."""
        return 0.10

    def check_signal(self, row: pd.Series, previous_row: pd.Series, tf_data: Optional[Dict[str, pd.DataFrame]] = None) -> Optional[Dict[str, Any]]:
        """Lógica de señal agresiva con Confluencia Macro (V3)."""
        if pd.isna(row.get('rsi')) or pd.isna(row.get('sma20')):
            return None
        
        price = float(row['close'])
        rsi = float(row['rsi'])
        sma20 = float(row['sma20'])
        
        # --- CONFLUENCIA MACRO (V3) ---
        macro_bias = "NEUTRAL"
        if tf_data and '15m' in tf_data:
            df_15 = tf_data['15m']
            ma200_15 = df_15['close'].rolling(200).mean().iloc[-1]
            price15 = df_15['close'].iloc[-1]
            macro_bias = "BULLISH" if price15 > ma200_15 else "BEARISH"

        # 1. Señal LONG
        if rsi < 45 and price > sma20 and macro_bias == "BULLISH":
            return {
                "side": "buy",
                "reason": f"V3_Momentum_LONG (15m_UP)"
            }
        
        # 2. Señal SHORT
        rsi_was_higher = rsi < float(previous_row.get('rsi', 100))
        if rsi > 55 and price < sma20 and rsi_was_higher and macro_bias == "BEARISH":
            return {
                "side": "short",
                "reason": f"V3_Momentum_SHORT (15m_DOWN)"
            }
        
        return None

    def get_exit_price(self, entry_price: float, atr: float, side: str) -> float:
        """
        Cálculo dinámico de Take Profit basado en ATR.
        La ejecución de esta lógica ahora es centralizada por el RiskManager
        utilizando este método como recomendación de la estrategia.
        """
        multiplier = 1.2 # Un poco más de aire que el 1.0 anterior para evitar ruido.
        
        if entry_price <= 0 or pd.isna(entry_price) or atr <= 0:
            return entry_price * (1.015 if side == 'buy' else 0.985)
        
        if side == 'buy':
            return entry_price + (multiplier * atr)
        else:
            return entry_price - (multiplier * atr)

    def get_snapshot(self, last_row: pd.Series, df: pd.DataFrame) -> Dict[str, Any]:
        """Telemetría enriquecida para el dashboard."""
        rsi = float(last_row.get('rsi', 0))
        price = float(last_row['close'])
        sma = float(last_row.get('sma20', price))
        
        return {
            "rsi": round(rsi, 2),
            "sma_dist": round(calculate_sma_distance(price, sma), 2),
            "atr_val": round(float(last_row.get('atr', 0)), 2),
            "bias": "BULLISH" if price > sma else "BEARISH",
            "trigger_price": round(sma, 2) # SMA actúa como pivote dinámico
        }

    def get_proximity(self, row: pd.Series) -> Dict[str, Any]:
        """Calcula qué tan cerca estamos de una señal para el visualizador del front."""
        rsi = float(row.get('rsi', 50))
        price = float(row['close'])
        sma = float(row.get('sma20', price))
        
        score = 0
        side = "WAITING"
        
        if price > sma: # Bias alcista
            side = "LONG"
            if rsi < 45: score = 100
            else: score = max(0, int(100 - (rsi - 45) * 4))
        elif price < sma: # Bias bajista
            side = "SHORT"
            if rsi > 55: score = 100
            else: score = max(0, int(100 - (55 - rsi) * 4))
            
        return {
            "score": score,
            "side": side,
            "checks": {
                "trend_align": True,
                "rsi_ready": rsi < 45 or rsi > 55
            }
        }
