
"""
LoopDev Quant Core - Math Utilities
Módulo de lógica pura para cálculos financieros y de gestión de riesgo.
Refactorizado para utilizar 'decimal.Decimal' y asegurar precisión industrial total.
"""

from decimal import Decimal, ROUND_HALF_UP
from typing import Union

def calculate_pnl_pct(entry_price: Union[float, Decimal], current_price: Union[float, Decimal], side: str = "LONG") -> float:
    """
    Calcula el porcentaje de Profit & Loss (PnL) con precisión de punto fijo.
    
    Lógica de Auditoría:
    - LONG: ((Actual - Entrada) / Entrada) * 100
    - SHORT: ((Entrada - Actual) / Entrada) * 100
    
    Args:
        entry_price: Precio de entrada de la posición.
        current_price: Precio de mercado actual.
        side: "LONG" o "SHORT".
        
    Returns:
        Porcentaje de PnL con precisión decimal.
    """
    # Convertimos a Decimal para evitar errores de precisión binaria (flotantes)
    entry = Decimal(str(entry_price))
    current = Decimal(str(current_price))
    
    if entry <= 0:
        return 0.0
        
    if side.upper() == "SHORT":
        # En SHORT, la ganancia es proporcional a cuánto ha caído el precio.
        pnl = ((entry - current) / entry) * 100
    else:
        # En LONG, la ganancia es proporcional a cuánto ha subido el precio.
        pnl = ((current - entry) / entry) * 100
        
    # Redondeamos a 4 decimales para cálculos internos (0.0001% de precisión)
    return float(pnl.quantize(Decimal("0.0001"), rounding=ROUND_HALF_UP))

def calculate_trailing_stop(current_extreme: Union[float, Decimal], distance_pct: Union[float, Decimal], side: str = "LONG") -> float:
    """
    Calcula el nivel de Stop Loss dinámico persiguiendo el precio extremo alcanzado.
    
    Lógica de Auditoría:
    - LONG: Persigue desde abajo (Máximo - Distancia%).
    - SHORT: Persigue desde arriba (Mínimo + Distancia%).
    
    Args:
        current_extreme: Punto más favorable (Pico en LONG, Valle en SHORT).
        distance_pct: Distancia en porcentaje (ej: 1.0 para 1%).
        side: Dirección de la posición.
        
    Returns:
        Precio del Stop Loss calculado con precisión total.
    """
    extreme = Decimal(str(current_extreme))
    dist = Decimal(str(distance_pct))
    
    if extreme <= 0 or dist <= 0:
        return 0.0
        
    multiplier = dist / 100
    
    if side.upper() == "SHORT":
        # El SL para un SHORT sube el precio mínimo por la distancia porcentual.
        # Fórmula: Mínimo * (1 + Distancia%)
        result = extreme * (1 + multiplier)
    else:
        # El SL para un LONG baja el precio máximo por la distancia porcentual.
        # Fórmula: Máximo * (1 - Distancia%)
        result = extreme * (1 - multiplier)
        
    return float(result.quantize(Decimal("0.00000001"), rounding=ROUND_HALF_UP))
