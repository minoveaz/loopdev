
"""
LoopDev Quant Core - Industrial Indicators
Módulo de cálculo de indicadores técnicos con precisión profesional.
Implementa el suavizado de Wilder (estándar en Binance/TradingView).
"""

import pandas as pd
import numpy as np

def calculate_rsi(series: pd.Series, period: int = 14) -> pd.Series:
    """
    Calcula el RSI (Relative Strength Index) utilizando el suavizado de Wilder.
    
    Diferencia Técnica:
    - Tradicional: Usa media móvil simple (causa ruido y señales falsas).
    - Wilder (Este): Usa Media Móvil Exponencial (EWM) con alpha = 1/periodo.
      Esto da más peso a los datos recientes pero mantiene una memoria histórica suave.
    
    Args:
        series: Serie de precios de cierre.
        period: Ventana de tiempo (estándar 14).
        
    Returns:
        Serie de Pandas con valores de 0 a 100.
    """
    delta = series.diff()
    
    # Separamos ganancias (ups) y pérdidas (downs)
    gain = (delta.where(delta > 0, 0))
    loss = (-delta.where(delta < 0, 0))
    
    # Aplicamos el suavizado de Wilder (Exponential Moving Average con alpha = 1/period)
    # Comportamiento idéntico a TradingView (RSI con Wilder's Smoothing)
    avg_gain = gain.ewm(alpha=1/period, min_periods=period, adjust=False).mean()
    avg_loss = loss.ewm(alpha=1/period, min_periods=period, adjust=False).mean()
    
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    
    return rsi

def calculate_sma(series: pd.Series, period: int = 20) -> pd.Series:
    """Calcula la Media Móvil Simple (SMA)."""
    return series.rolling(window=period).mean()

def calculate_atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
    """
    Calcula el ATR (Average True Range) utilizando el método de Wilder.
    Vital para dimensionar Stop Loss dinámicos y volatilidad.
    
    Args:
        df: DataFrame que debe contener columnas ['high', 'low', 'close'].
        period: Ventana de tiempo (estándar 14).
    """
    # 1. Calculamos el True Range (TR)
    # El TR es el máximo de: 
    # a) High actual - Low actual
    # b) abs(High actual - Close previo)
    # c) abs(Low actual - Close previo)
    high_low = df['high'] - df['low']
    high_close = np.abs(df['high'] - df['close'].shift())
    low_close = np.abs(df['low'] - df['close'].shift())
    
    ranges = pd.concat([high_low, high_close, low_close], axis=1)
    true_range = ranges.max(axis=1)
    
    # 2. El ATR es el suavizado de Wilder del True Range
    atr = true_range.ewm(alpha=1/period, min_periods=period, adjust=False).mean()
    
    return atr

def calculate_sma_distance(price: float, sma: float) -> float:
    """
    Calcula la distancia porcentual entre el precio y la SMA.
    Útil para detectar sobre-extensiones del mercado.
    """
    if sma <= 0: return 0.0
    return ((price / sma) - 1) * 100
