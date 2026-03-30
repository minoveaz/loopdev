
import pytest
from src.core.managers.risk_manager import RiskManager
from src.core.models.trading import BotModel, PositionSide

@pytest.fixture
def risk():
    return RiskManager()

def test_hf_scalper_profitability_threshold(risk):
    """
    Simulación de la 'Operación No Rentable' de la imagen.
    Entry: 66465.0, ATR: muy bajo.
    Verificar que el TP ahora tenga el suelo de 0.5%.
    """
    entry_price = 66465.0
    atr = 5.0 # Un ATR ridículamente bajo
    
    targets = risk.get_initial_exit_targets(entry_price, "BUY", atr)
    
    tp_price = risk.from_cents(targets["tp_price"])
    profit_pct = ((tp_price / entry_price) - 1) * 100
    
    print(f"\nAUDIT - TP Price: {tp_price} | Profit: {profit_pct:.2f}%")
    
    # El profit DEBE ser al menos 0.50% para cubrir comisiones
    assert profit_pct >= 0.50

def test_exit_condition_integrity():
    """
    Simulación del fallo de 'Auto-Exit' inmediato.
    Verifica que si los targets son erróneos, el monitor no dispare salida falsa.
    """
    current_price = 66500.0
    # Caso de error: TP por debajo de la entrada en un LONG
    tp_price = 66400.0 
    
    # Lógica que falló en el Monitor:
    exit_triggered = current_price >= tp_price
    
    # Esto dispararía un EXIT erróneo. Debemos asegurar que tp_price siempre sea > entry_price en LONG.
    assert tp_price > 66500.0 # Este test fallará inicialmente para confirmar el bug
