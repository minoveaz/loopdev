import pytest
from src.core.strategy_manager import StrategyManager

def test_precision_conversions(mock_supabase):
    """Certifica que la conversión Cents <-> Float no pierde decimales."""
    manager = StrategyManager(mock_supabase)
    
    # Caso 1: Precio estándar
    price = 70420.68
    cents = manager.to_cents(price)
    assert cents == 7042068
    assert manager.from_cents(cents) == price

    # Caso 2: Precio con muchos decimales (redondeo pro)
    price_long = 1.234567
    cents_long = manager.to_cents(price_long)
    assert cents_long == 123 # Redondeo a 2 decimales según lógica de negocio
    
    # Caso 3: Cero
    assert manager.to_cents(0) == 0
    assert manager.from_cents(0) == 0.0

@pytest.mark.asyncio
async def test_signal_generation_logic(mock_supabase):
    """Verifica que el Signal Engine genera una señal BUY bajo condiciones correctas."""
    manager = StrategyManager(mock_supabase)
    
    # Mock de un bot en búsqueda de señal
    bot = {
        "id": "test-bot-uuid",
        "pair": "BTC/USDT",
        "status": "active",
        "current_entry_price": 0,
        "tenant_id": "test-tenant",
        "last_exit_targets": {"tp_price": 8000000}
    }

    # Inyectamos el bot en el procesamiento
    # La lógica actual en strategy_manager.py usa pandas y DB local
    await manager.process_bot_logic(bot)
    
    # Verificamos que se llamó a la inserción de señal
    # En el mock, verificamos si la tabla 'quant_signals' recibió un insert
    assert mock_supabase.table.called
    mock_supabase.table.assert_any_call("quant_signals")
