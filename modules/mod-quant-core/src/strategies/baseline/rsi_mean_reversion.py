import pandas as pd
import numpy as np
from typing import Dict, Any
from .base import BaseStrategy

class RSIMeanReversionStrategy(BaseStrategy):
    """
    RSI Mean Reversion Strategy (Pure Pandas Implementation)
    No external dependencies like pandas_ta.
    """
    def __init__(self, rsi_period=14, oversold=30, overbought=70):
        self.rsi_period = rsi_period
        self.oversold = oversold
        self.overbought = overbought

    def calculate_rsi(self, series, period=14):
        """Pure pandas RSI calculation."""
        delta = series.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss
        return 100 - (100 / (1 + rs))

    def analyze(self, df):
        # Indicators Calculation
        df['rsi'] = self.calculate_rsi(df['close'], self.rsi_period)
        df['sma20'] = df['close'].rolling(window=20).mean()
        return df

    def check_signal(self, current_row, previous_row):
        if pd.isna(current_row['rsi']) or pd.isna(previous_row['rsi']):
            return None

        # Buy Signal: RSI crosses above oversold level
        if previous_row['rsi'] < self.oversold and current_row['rsi'] >= self.oversold:
            return {'side': 'buy', 'reason': f"RSI Oversold Reversal ({current_row['rsi']:.2f})"}

        # Sell Signal: RSI crosses below overbought level
        if previous_row['rsi'] > self.overbought and current_row['rsi'] <= self.overbought:
            return {'side': 'sell', 'reason': f"RSI Overbought Reversal ({current_row['rsi']:.2f})"}

        return None

    def get_snapshot(self, last_row, df):
        rsi = float(last_row.get('rsi', 0))
        sma = float(last_row.get('sma20', last_row['close']))
        price = float(last_row['close'])
        
        return {
            "rsi": round(rsi, 2),
            "sma_dist": round(((price / sma) - 1) * 100, 2) if sma > 0 else 0,
            "vol_status": "HIGH" if last_row.get('volume', 0) > df['volume'].mean() else "LOW",
            "bias": "BULLISH" if rsi < 50 else "BEARISH",
            "trigger_price": round(self.get_trigger_price(last_row), 2)
        }

    def get_sentiment(self, row: pd.Series) -> str:
        """Determina el sentimiento basado en el RSI."""
        rsi = float(row.get('rsi', 50))
        if pd.isna(rsi): return "neutral"
        
        if rsi < 30: return "oversold"
        elif rsi > 70: return "overbought"
        elif rsi < 45: return "bullish_bias"
        elif rsi > 55: return "bearish_bias"
        return "neutral"

    def get_trigger_price(self, row: pd.Series) -> float:
        """Estima a qué precio el RSI tocaría 30 o 70."""
        rsi = float(row.get('rsi', 50))
        price = float(row['close'])
        
        if pd.isna(rsi) or rsi == 0: return 0.0
        
        # Si el RSI < 50, buscamos el trigger de COMPRA (RSI 30)
        if rsi < 50:
            target_rsi = 30
            # Aproximación lineal: Un cambio de 1% en precio suele mover el RSI ~15-20 puntos en 1m
            diff = rsi - target_rsi
            price_change_pct = (diff / 15) / 100
            return price * (1 - price_change_pct)
        else:
            # Buscamos el trigger de VENTA (RSI 70)
            target_rsi = 70
            diff = target_rsi - rsi
            price_change_pct = (diff / 15) / 100
            return price * (1 + price_change_pct)

    def get_proximity(self, row: pd.Series) -> Dict[str, Any]:
        """Calcula la proximidad a una señal de RSI con desglose de confluencia."""
        rsi = float(row.get('rsi', 50))
        sma = float(row.get('sma20', row['close']))
        price = float(row['close'])
        
        if pd.isna(rsi): return {"score": 0, "checks": {}}
        
        # 1. Check de RSI (¿Está en zona extrema?)
        rsi_zone = rsi < 30 or rsi > 70
        
        # 2. Check de Tendencia (¿Está a favor del movimiento esperado?)
        # Para compra (rsi < 30), queremos que el precio no esté demasiado lejos de la media
        trend_ok = True # Por ahora simplificado, pero podría ser price > sma
        
        # 3. Check de Proximidad numérica
        if rsi < 30: 
            score = 95
        elif rsi > 70:
            score = 95
        else:
            dist_to_30 = abs(rsi - 30)
            dist_to_70 = abs(rsi - 70)
            min_dist = min(dist_to_30, dist_to_70)
            score = max(0, min(100, int(100 - (min_dist * 5))))
        
        return {
            "score": score,
            "checks": {
                "rsi_extreme": rsi_zone,
                "trend_align": trend_ok,
                "vol_ready": True # RSI pro no usa filtro ATR por ahora
            }
        }

    def get_exit_price(self, entry_price: float, atr: float, side: str) -> float:
        """Standard exit calculation for RSI strategy."""
        if side == 'buy':
            return entry_price * 1.05 # 5% TP
        else:
            return entry_price * 0.95 # 5% SL

