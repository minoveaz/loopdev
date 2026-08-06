
import pytest
from src.core.models.trading import BotModel, PositionSide

@pytest.fixture
def mock_bot_long():
    """Bot en posición LONG configurado para pruebas."""
    return BotModel(
        id="test-bot-long",
        name="Long Tester",
        pair="BTC/USDT",
        status="active",
        current_entry_price=6000000, # $60,000.00
        current_position_side=PositionSide.LONG,
        base_investment_usdt=1000.0,
        trailing_stop_distance=1.0,
        current_position_max_price=6000000,
        last_exit_targets={
            "tp_price": 6100000, # $61,000
            "sl_price": 5900000, # $59,000
            "be_price": 6012000  # $60,120 (Entry + 0.2% fees)
        }
    )

@pytest.fixture
def mock_bot_short():
    """Bot en posición SHORT configurado para pruebas."""
    return BotModel(
        id="test-bot-short",
        name="Short Tester",
        pair="BTC/USDT",
        status="active",
        current_entry_price=6000000, # $60,000.00
        current_position_side=PositionSide.SHORT,
        base_investment_usdt=1000.0,
        trailing_stop_distance=1.0,
        current_position_min_price=6000000,
        last_exit_targets={
            "tp_price": 5900000, # $59,000
            "sl_price": 6100000, # $61,000
            "be_price": 5988000  # $59,880 (Entry - 0.2% fees)
        }
    )
