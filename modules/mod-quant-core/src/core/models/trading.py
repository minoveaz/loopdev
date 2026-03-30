
"""
LoopDev Quant Core - Trading Models
Modelos de datos robustos utilizando Pydantic para validación y tipado estricto.
"""

from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum

class PositionSide(str, Enum):
    LONG = "LONG"
    SHORT = "SHORT"
    NEUTRAL = "NEUTRAL"
    BUY = "BUY"   # Soporte temporal para legacy
    SELL = "SELL" # Soporte temporal para legacy

class AssetBalance(BaseModel):
    """Representación de saldo para un activo específico."""
    asset: str
    free: float
    used: float
    total: float

class BalanceResponse(BaseModel):
    """Respuesta industrial de balance de cuenta."""
    success: bool
    exchange_id: str
    balances: List[AssetBalance]
    total_usdt_equiv: float
    available_trading_usdt: float # USDT libre para nuevos bots

class ExchangeTestRequest(BaseModel):
    """Solicitud de prueba de conexión segura."""
    exchangeAccountId: str # ID de la cuenta en la tabla quant_exchanges

class BacktestRequest(BaseModel):
    """Parámetros para ejecución de backtesting."""
    strategyName: str
    pairs: List[str]
    sizePerTrade: float = 100.0
    maxPositions: int = 5
    stopLoss: float = 2.0  # % below entry
    takeProfit: float = 5.0  # % above entry
    days: int = 30
    initialCapital: float = 10000.0

class ExitTargets(BaseModel):
    """Estructura de precios de salida (TP/SL/BE)"""
    model_config = ConfigDict(populate_by_name=True)
    
    tp_price: int = Field(alias="tpPrice", default=0)
    sl_price: int = Field(alias="slPrice", default=0)
    be_price: int = Field(alias="bePrice", default=0)

class BotModel(BaseModel):
    """
    Representación formal de un Bot de Trading en el sistema.
    """
    id: str
    name: str
    pair: str
    status: str
    current_entry_price: int = 0
    current_position_side: Optional[PositionSide] = PositionSide.NEUTRAL
    base_investment_usdt: float = 100.0
    trailing_stop_distance: float = 1.0
    
    # Precios extremos para Trailing Stop (en cents)
    current_position_max_price: int = 0
    current_position_min_price: int = 0
    
    # Objetivos de salida actuales
    last_exit_targets: Optional[Dict[str, Any]] = None
    
    # Telemetría
    current_pnl_pct: float = 0.0
    last_atr: Optional[int] = None
    
    @field_validator('current_position_side', mode='before')
    @classmethod
    def validate_side(cls, v):
        """Mapea valores legacy 'BUY'/'SELL' a los estados correctos 'LONG'/'SHORT'."""
        if isinstance(v, str):
            v_upper = v.upper()
            if v_upper == "BUY": return PositionSide.LONG
            if v_upper == "SELL": return PositionSide.SHORT
            return v_upper
        return v

    def get_side(self) -> PositionSide:
        """Helper para obtener el enum de dirección de forma segura."""
        if not self.current_position_side:
            return PositionSide.NEUTRAL
        return self.current_position_side

    @property
    def is_in_position(self) -> bool:
        """Determina si el bot tiene una posición activa basándose en el precio de entrada."""
        return self.current_entry_price > 0
