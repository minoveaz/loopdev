
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
    """
    
    def __init__(self):
        self.version = "2.0.0"
        self.vol_multiplier = 1.15 # Exigimos 15% más de volumen que la media

    def analyze(self, df: pd.DataFrame) -> pd.DataFrame:
        """Cálculo de indicadores para alta frecuencia."""
        # 1. EMAs para micro-tendencia
        df['ema9'] = df['close'].ewm(span=9, adjust=False).mean()
        df['ema21'] = df['close'].ewm(span=21, adjust=False).mean()
        
        # 2. RSI-7 Wilder
        df['rsi'] = calculate_rsi(df['close'], period=7)
        
        # 3. ATR-14 Wilder
        df['atr'] = calculate_atr(df, period=14)
        
        # 4. Volumen promedio (últimos 5 minutos)
        df['vol_sma'] = df['volume'].rolling(window=5).mean()
        
        return df

    def get_min_volatility(self) -> float:
        """HF Scalper requiere menos volatilidad para operar (0.15%)."""
        return 0.15

    def check_signal(self, row: pd.Series, previous_row: pd.Series, tf_data: Optional[Dict[str, pd.DataFrame]] = None) -> Optional[Dict[str, Any]]:
        """Lógica de Sniper con Confluencia Multi-Timeframe (V3)."""
        if pd.isna(row.get('rsi')) or pd.isna(row.get('ema9')):
            return None

        price = float(row['close'])
        ema9 = float(row['ema9'])
        ema21 = float(row['ema21'])
        rsi = float(row['rsi'])
        vol = float(row.get('volume', 0))
        vol_avg = float(row.get('vol_sma', 0))
        
        # 1. Filtro de Volumen (Específico de Scalping)
        if vol <= (vol_avg * self.vol_multiplier):
            return None

        # 2. CONFLUENCIA MACRO (V3)
        # Solo operamos a favor de la tendencia de 15 minutos
        macro_bias = "NEUTRAL"
        if tf_data and '15m' in tf_data:
            df_15 = tf_data['15m']
            # Usamos una SMA simple de 20 en 15m para definir tendencia mayor
            ma15 = df_15['close'].rolling(20).mean().iloc[-1]
            price15 = df_15['close'].iloc[-1]
            macro_bias = "BULLISH" if price15 > ma15 else "BEARISH"

        # 3. Señal LONG (Compra)
        # Requiere: Micro-tendencia alcista (1m) + Macro-tendencia alcista (15m)
        if ema9 > ema21 and rsi > 55 and price > ema9:
            if macro_bias == "BULLISH":
                return {
                    "side": "buy",
                    "reason": f"V3_HF_LONG (Confluence_15m_UP)"
                }
            else:
                # Log opcional aquí si quisiéramos saber que se bloqueó por confluencia
                return None
                
        # 4. Señal SHORT (Venta)
        # Requiere: Micro-tendencia bajista (1m) + Macro-tendencia bajista (15m)
        if ema9 < ema21 and rsi < 45 and price < ema9:
            if macro_bias == "BEARISH":
                return {
                    "side": "short",
                    "reason": f"V3_HF_SHORT (Confluence_15m_DOWN)"
                }
            else:
                return None

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

        # Filtros de Seguridad sincronizados
        vol_ready = vol > (vol_avg * self.vol_multiplier)
        atr_ready = (atr / price) * 100 >= self.get_min_volatility() if price > 0 else False
        
        score = 0
        side = "WAITING"
        if ema9 > ema21:
            side = "LONG"
            score = max(0, min(100, int((rsi - 30) * 2)))
        elif ema9 < ema21:
            side = "SHORT"
            score = max(0, min(100, int((70 - rsi) * 2)))
            
        if not (vol_ready and atr_ready):
            score = min(score, 70)
            
        return {
            "score": score, "side": side,
            "checks": {"trend_align": True, "vol_ready": bool(vol_ready), "atr_signal": bool(atr_ready)}
        }

    def get_exit_price(self, entry_price: float, atr: float, side: str) -> float:
        """Salidas quirúrgicas para HF Scalping."""
        multiplier = 1.0
        if atr <= 0: return entry_price * (1.005 if side == 'buy' else 0.995)
        if side == 'buy':
            return entry_price + (multiplier * max(atr, entry_price * 0.006))
        else:
            return entry_price - (multiplier * max(atr, entry_price * 0.006))
