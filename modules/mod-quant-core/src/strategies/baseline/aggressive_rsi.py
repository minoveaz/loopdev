
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

    def check_signal(self, row: pd.Series, previous_row: pd.Series) -> Optional[Dict[str, Any]]:
        """
        Evaluación de señales con filtros de momentum y tendencia.
        
        Lógica de Protección:
        - LONG: RSI < 45 (está barato o recuperando) Y Precio > SMA20 (tendencia alcista).
        - SHORT: RSI > 55 (está caro o agotándose) Y Precio < SMA20 (tendencia bajista).
        """
        # Validamos integridad de datos
        if pd.isna(row.get('rsi')) or pd.isna(row.get('sma20')) or pd.isna(row.get('atr')):
            return None
        
        price = float(row['close'])
        rsi = float(row['rsi'])
        sma20 = float(row['sma20'])
        
        # Filtros de Tendencia
        is_uptrend = price > sma20
        is_downtrend = price < sma20
        
        # 1. Señal LONG (Compra)
        # Buscamos momentum recuperándose bajo la SMA o soporte dinámico.
        if rsi < 45 and is_uptrend:
            return {
                "side": "buy",
                "reason": f"V2_Momentum_LONG (RSI:{rsi:.1f})"
            }
        
        # 2. Señal SHORT (Venta)
        # CORRECCIÓN: Entramos si el precio está bajo la SMA y el RSI está alto pero EMPEZANDO a bajar.
        # Esto evita entrar en corto mientras el precio sigue disparándose.
        rsi_was_higher = rsi < float(previous_row.get('rsi', 100))
        if rsi > 55 and is_downtrend and rsi_was_higher:
            return {
                "side": "short",
                "reason": f"V2_Momentum_SHORT (RSI:{rsi:.1f} ↓)"
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
