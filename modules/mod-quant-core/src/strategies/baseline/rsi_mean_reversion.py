
import pandas as pd
import numpy as np
from typing import Dict, Any, Optional
from .base import BaseStrategy

# Importamos utilidades industriales de alta precisión
from src.core.utils.indicators import calculate_rsi, calculate_sma, calculate_atr, calculate_sma_distance

class RSIMeanReversionStrategy(BaseStrategy):
    """
    RSI Mean Reversion Strategy v2 (Industrial Audit 2026-03-27)
    Type: Mean Reversion Scalping with Industrial Indicators
    
    Mejoras V2:
    - RSI Wilder (EWM) para eliminar ruidos de falsos cruces.
    - Confirmación de tendencia con SMA200 (Solo compra si no es tendencia bajista extrema).
    - Salidas dinámicas basadas en ATR (1.5x ATR).
    """
    def __init__(self, rsi_period=14, oversold=30, overbought=70):
        self.rsi_period = rsi_period
        self.oversold = oversold
        self.overbought = overbought

    def analyze(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Cálculo de indicadores con precisión profesional.
        """
        # 1. RSI(14) - Utiliza suavizado de Wilder (EWM)
        df['rsi'] = calculate_rsi(df['close'], period=self.rsi_period)
        
        # 2. SMA20 y SMA200 - Tendencia de corto y largo plazo
        df['sma20'] = calculate_sma(df['close'], period=20)
        df['sma200'] = calculate_sma(df['close'], period=200)
        
        # 3. ATR(14) - Volatilidad con método Wilder para TP/SL dinámicos
        df['atr'] = calculate_atr(df, period=14)
        
        return df

    def check_signal(self, row: pd.Series, previous_row: pd.Series, tf_data: Optional[Dict[str, pd.DataFrame]] = None) -> Optional[Dict[str, Any]]:
        """Lógica de reversión con Confluencia Macro (V3)."""
        if pd.isna(row.get('rsi')) or pd.isna(previous_row.get('rsi')):
            return None

        rsi = float(row['rsi'])
        prev_rsi = float(previous_row['rsi'])
        price = float(row['close'])

        # --- CONFLUENCIA MACRO (V3) ---
        macro_bias = "NEUTRAL"
        rsi_15m = 50.0
        if tf_data and '15m' in tf_data:
            df_15 = tf_data['15m']
            ma15 = df_15['close'].rolling(20).mean().iloc[-1]
            price15 = df_15['close'].iloc[-1]
            rsi_15m = df_15['close'].diff().pipe(lambda d: (d.where(d>0,0)).ewm(alpha=1/14, adjust=False).mean() / ((-d.where(d<0,0)).ewm(alpha=1/14, adjust=False).mean()).pipe(lambda rs: 100 - (100/(1+rs)))).iloc[-1]
            macro_bias = "BULLISH" if price15 > ma15 else "BEARISH"

        # 1. Señal LONG (Cruce Alcista + Macro Bullish + No Agotado)
        if prev_rsi < self.oversold and rsi >= self.oversold:
            if macro_bias == "BULLISH" and rsi_15m < 70:
                return {
                    'side': 'buy', 
                    'reason': f"V3_RSI_Reversal_LONG (15m_UP)"
                }

        # 2. Señal SHORT (Cruce Bajista + Macro Bearish + No Agotado)
        if prev_rsi > self.overbought and rsi <= self.overbought:
            if macro_bias == "BEARISH" and rsi_15m > 30:
                return {
                    'side': 'short', 
                    'reason': f"V3_RSI_Reversal_SHORT (15m_DOWN)"
                }

        return None


    def get_snapshot(self, last_row: pd.Series, df: pd.DataFrame) -> Dict[str, Any]:
        """Telemetría específica para el dashboard de reversión."""
        rsi = float(last_row.get('rsi', 0))
        price = float(last_row['close'])
        sma20 = float(last_row.get('sma20', price))
        
        return {
            "rsi": round(rsi, 2),
            "sma_dist": round(calculate_sma_distance(price, sma20), 2),
            "vol_status": "HIGH" if last_row.get('volume', 0) > df['volume'].mean() else "LOW",
            "market_bias": "BULLISH" if rsi < 50 else "BEARISH",
            "trigger_price": round(self.get_trigger_price(last_row), 2)
        }

    def get_trigger_price(self, row: pd.Series) -> float:
        """Estima el precio de trigger basado en la distancia al nivel de RSI objetivo."""
        rsi = float(row.get('rsi', 50))
        price = float(row['close'])
        
        if pd.isna(rsi) or rsi == 0: return price
        
        # Estimación lineal mejorada para Wilder RSI
        if rsi < 50:
            target = self.oversold
            diff = rsi - target
            return price * (1 - (diff * 0.0005)) # ~0.05% por punto de RSI en 1m
        else:
            target = self.overbought
            diff = target - rsi
            return price * (1 + (diff * 0.0005))

    def get_proximity(self, row: pd.Series) -> Dict[str, Any]:
        """Calcula proximidad para la UI."""
        rsi = float(row.get('rsi', 50))
        
        score = 0
        side = "WAITING"
        if rsi < 50: 
            side = "LONG"
            score = max(0, min(100, int(100 - (abs(rsi - self.oversold) * 4))))
        else:
            side = "SHORT"
            score = max(0, min(100, int(100 - (abs(rsi - self.overbought) * 4))))
        
        return {
            "score": score,
            "side": side,
            "checks": {
                "rsi_extreme": rsi < 35 or rsi > 65,
                "trend_align": True
            }
        }

    def get_exit_price(self, entry_price: float, atr: float, side: str) -> float:
        """Cálculo de TP basado en ATR Wilder."""
        multiplier = 1.5 # Objetivo de reversión un poco más amplio
        if atr <= 0: return entry_price * (1.015 if side == 'buy' else 0.985)
        
        if side == 'buy':
            return entry_price + (multiplier * atr)
        else:
            return entry_price - (multiplier * atr)
