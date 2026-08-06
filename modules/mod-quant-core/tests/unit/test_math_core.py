
import pytest
from src.core.utils.math_utils import calculate_pnl_pct, calculate_trailing_stop

def test_math_pnl_long():
    """Validación de PnL para compras."""
    # Subida del 10%
    assert calculate_pnl_pct(60000, 66000, "LONG") == 10.0
    # Bajada del 5%
    assert calculate_pnl_pct(60000, 57000, "LONG") == -5.0

def test_math_pnl_short():
    """Validación de PnL para ventas (Shorts)."""
    # Bajada del 10% -> Ganancia del 10%
    assert calculate_pnl_pct(60000, 54000, "SHORT") == 10.0
    # Subida del 5% -> Pérdida del 5%
    assert calculate_pnl_pct(60000, 63000, "SHORT") == -5.0

def test_trailing_stop_calculation():
    """Validación de niveles de Stop Loss dinámico."""
    # LONG: Máximo 100, Distancia 1% -> SL 99
    assert calculate_trailing_stop(100.0, 1.0, "LONG") == 99.0
    
    # SHORT: Mínimo 100, Distancia 1% -> SL 101
    assert calculate_trailing_stop(100.0, 1.0, "SHORT") == 101.0
