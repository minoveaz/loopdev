import pytest
from unittest.mock import MagicMock
import pandas as pd

@pytest.fixture
def mock_supabase():
    """Simula el cliente de Supabase con un cruce alcista claro."""
    client = MagicMock()
    
    # 1. Simular histórico: Una tendencia alcista clara para forzar señal
    # Precios subiendo de 100 a 200 para que el último tick sea muy alcista
    history_data = []
    for i in range(100):
        history_data.append({
            "timestamp": f"2026-03-21T10:{i:02d}:00Z",
            "close": (100 + i) * 100, # En Cents
            "open": (99 + i) * 100,
            "high": (101 + i) * 100,
            "low": (98 + i) * 100,
            "volume": 100
        })

    # Mock complejo para encadenar llamadas de Supabase
    client.table.return_value.select.return_value.eq.return_value.eq.return_value.order.return_value.limit.return_value.execute.return_value.data = history_data
    
    return client
