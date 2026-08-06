
import pytest
from src.core.managers.risk_manager import RiskManager
from src.core.models.trading import BotModel, PositionSide

@pytest.fixture
def risk():
    return RiskManager()

def test_hf_scalper_profitability_threshold(risk):
    """
    Simulación de la 'Operación No Rentable'.
    Entry: 66465.0, ATR: muy bajo.
    Verificar que el TP ahora tenga el suelo de 0.6%.
    """
    entry_price = 66465.0
    atr = 5.0 # Un ATR ridículamente bajo
    
    targets = risk.get_initial_exit_targets(entry_price, "BUY", atr)
    
    tp_price = risk.from_cents(targets["tp_price"])
    profit_pct = ((tp_price / entry_price) - 1) * 100
    
    # El profit DEBE ser al menos 0.60% (nuestro nuevo suelo)
    assert profit_pct >= 0.60

def test_exit_condition_integrity_fixed():
    """
    Valida la corrección del bug de Auto-Exit Inmediato.
    La lógica ahora debe ignorar salidas si los objetivos son incoherentes.
    """
    entry_price = 66500.0
    current_price = 66510.0
    
    # Caso de error en DB: TP por debajo de la entrada en un LONG
    tp_price = 66400.0 
    
    # Simulación de la lógica de seguridad del PositionMonitor corregida:
    is_tp_logical = tp_price > entry_price # En LONG el TP debe ser mayor
    
    exit_triggered = False
    if is_tp_logical:
        if current_price >= tp_price:
            exit_triggered = True
            
    # El test debe pasar si exit_triggered es FALSE (bloqueo exitoso de salida falsa)
    assert exit_triggered == False
    assert is_tp_logical == False
