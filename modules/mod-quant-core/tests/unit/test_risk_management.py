
import pytest
from src.core.managers.risk_manager import RiskManager
from src.core.models.trading import BotModel, PositionSide

@pytest.fixture
def risk_manager():
    return RiskManager()

def test_break_even_shield_activation(risk_manager, mock_bot_long):
    """Verificar que el SL se mueve a Break-Even cuando hay ganancia."""
    # Precio sube para dar +0.5% de ganancia (supera el umbral de 0.25%)
    current_price = 60300.0 
    pnl_pct = 0.5
    
    updates = risk_manager.process_trailing_and_be(mock_bot_long, current_price, pnl_pct)
    
    assert "last_exit_targets" in updates
    # El sl_price debe ser ahora igual al be_price ($60,120)
    assert updates["last_exit_targets"]["sl_price"] == 6012000
    assert updates["current_action"] == "BE_SHIELD Active"

def test_trailing_stop_progression_short(risk_manager, mock_bot_short):
    """Verificar que el Trailing Stop en SHORTS persigue el precio hacia abajo."""
    # Precio cae de $60,000 a $58,000 (Ganancia considerable)
    current_price = 58000.0
    pnl_pct = 3.33 
    
    updates = risk_manager.process_trailing_and_be(mock_bot_short, current_price, pnl_pct)
    
    assert "current_position_min_price" in updates
    assert updates["current_position_min_price"] == 5800000 # Nuevo mínimo
    
    # Nuevo SL debe ser 58000 * (1 + 0.01) = 58580
    assert updates["last_exit_targets"]["sl_price"] == 5858000
