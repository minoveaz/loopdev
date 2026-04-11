
from typing import Dict, Any, Optional
from datetime import datetime, timezone
from loguru import logger

# Importamos las utilidades de lógica pura y los modelos industriales
from src.core.utils.math_utils import calculate_pnl_pct, calculate_trailing_stop
from src.core.models.trading import BotModel, PositionSide, ExitTargets

class RiskManager:
    """
    Cerebro de gestión de riesgos y cálculos matemáticos (Tier B).
    Refactorizado para ser el ÚNICO lugar que calcula precios de salida.
    """
    
    @staticmethod
    def from_cents(cents: Optional[int]) -> float:
        """Convierte valores enteros (cents) de la DB a Floats legibles."""
        if cents is None: return 0.0
        try:
            return float(cents) / 100.0
        except (TypeError, ValueError):
            return 0.0

    @staticmethod
    def to_cents(price: Optional[float]) -> int:
        """Convierte Floats a enteros (cents) para almacenamiento seguro en DB (BIGINT)."""
        if price is None: return 0
        try:
            # Redondeo industrial antes de convertir a entero.
            return int(round(float(price) * 100))
        except (TypeError, ValueError):
            return 0

    def get_initial_exit_targets(self, entry_price: float, side: str, atr: float, aggression_multiplier: float = 1.0) -> Dict[str, int]:
        """
        ÚNICA FUENTE DE VERDAD para objetivos de salida.
        Ahora con Multiplicador de Agresividad para capturar movimientos > 1%.
        """
        side_norm = PositionSide.LONG if side.upper() in ["BUY", "LONG"] else PositionSide.SHORT
        
        # --- INDUSTRIAL PROFIT FLOOR: 0.60% ---
        min_tp_dist = entry_price * 0.006
        
        # --- OPTIMIZACIÓN V3.1: DINAMISMO DE RATIO ---
        # El riesgo (SL) es constante según ATR.
        # El beneficio (TP) escala con la agresividad (Trend Strength).
        sl_dist = max(atr, entry_price * 0.003) 
        
        # Multiplicador base 2.0x (Ratio 1:2). 
        # Si aggression_multiplier es 2.0 (Super-Trend), el ratio sube a 1:4.
        tp_dist = max(sl_dist * 2.0 * aggression_multiplier, min_tp_dist)

        if side_norm == PositionSide.LONG:
            tp_price = entry_price + tp_dist
            sl_price = entry_price - sl_dist
            be_price = entry_price * 1.002
        else:
            tp_price = entry_price - tp_dist
            sl_price = entry_price + sl_dist
            be_price = entry_price * 0.998
            
        return {
            "tp_price": self.to_cents(tp_price),
            "sl_price": self.to_cents(sl_price),
            "be_price": self.to_cents(be_price)
        }

    def calculate_pnl(self, bot: BotModel, current_price: float) -> Dict[str, Any]:
        """Calcula el PnL utilizando el modelo de Bot oficial."""
        if not bot.is_in_position:
            return {"current_pnl_pct": 0.0, "current_pnl_usdt": 0}

        entry_price = self.from_cents(bot.current_entry_price)
        side = bot.get_side().value
        
        # 1. Porcentaje puro de ganancia/pérdida
        pnl_pct = calculate_pnl_pct(entry_price, current_price, side)
        
        # 2. Beneficio nominal en USDT
        pnl_usdt = (pnl_pct / 100.0) * bot.base_investment_usdt
        
        return {
            "current_pnl_pct": pnl_pct,
            "current_pnl_usdt": self.to_cents(pnl_usdt)
        }

    def process_trailing_and_be(self, bot: BotModel, current_price: float, pnl_pct: float) -> Dict[str, Any]:
        """
        Orquesta la protección dinámica de capital y ganancias (Trailing/BE).
        """
        update_data = {}
        side = bot.get_side()
        
        # Recuperamos objetivos actuales (en cents)
        last_targets = bot.last_exit_targets or {}
        be_price_raw = last_targets.get('be_price', 0)
        current_sl_raw = last_targets.get('sl_price', 0)
        
        # --- 1. AUTO BREAK-EVEN SHIELD (V3.2 Optimizado) ---
        # Si pnl_pct > 0.50%, protegemos la entrada con un pequeño margen.
        # Subimos de 0.25% -> 0.50% para dar aire a la operación.
        if pnl_pct >= 0.50:
            # El BE price ahora es más ajustado (0.05% en lugar de 0.2%)
            # be_price original era entry * 1.002 (0.2%). Lo bajamos a 1.0005 (0.05%)
            tight_be_price = self.from_cents(bot.current_entry_price) * (1.0005 if side == PositionSide.LONG else 0.9995)
            tight_be_raw = self.to_cents(tight_be_price)

            is_sl_unprotected = False
            if side == PositionSide.LONG:
                is_sl_unprotected = current_sl_raw < tight_be_raw
            else:
                is_sl_unprotected = current_sl_raw > tight_be_raw or current_sl_raw == 0

            if is_sl_unprotected:
                new_targets = last_targets.copy()
                new_targets['sl_price'] = tight_be_raw
                update_data["last_exit_targets"] = new_targets
                update_data["current_action"] = "BE_SHIELD Active"
                logger.info(f"PROTECTION | Bot {bot.id[:8]} -> SL to Tight Break-Even (0.05%).")

        # --- 2. TRAILING STOP LOGIC ---
        dist_pct = bot.trailing_stop_distance
        # Activación dinámica: Si el target es > 1%, esperamos a tener al menos 0.4% de profit
        activation_threshold = 0.4 
        
        if pnl_pct > activation_threshold:
            if side == PositionSide.LONG:
                current_max = self.from_cents(bot.current_position_max_price)
                if current_price > current_max:
                    current_max = current_price
                    update_data["current_position_max_price"] = self.to_cents(current_max)
                
                trailing_sl = calculate_trailing_stop(current_max, dist_pct, "LONG")
                if trailing_sl > self.from_cents(current_sl_raw):
                    new_targets = update_data.get("last_exit_targets", last_targets).copy()
                    new_targets['sl_price'] = self.to_cents(trailing_sl)
                    update_data["last_exit_targets"] = new_targets
                    update_data["current_action"] = f"Trailing {dist_pct}%"
            else:
                current_min = self.from_cents(bot.current_position_min_price)
                if current_min == 0 or current_price < current_min:
                    current_min = current_price
                    update_data["current_position_min_price"] = self.to_cents(current_min)
                
                trailing_sl = calculate_trailing_stop(current_min, dist_pct, "SHORT")
                if current_sl_raw == 0 or trailing_sl < self.from_cents(current_sl_raw):
                    new_targets = update_data.get("last_exit_targets", last_targets).copy()
                    new_targets['sl_price'] = self.to_cents(trailing_sl)
                    update_data["last_exit_targets"] = new_targets
                    update_data["current_action"] = f"Trailing {dist_pct}%"

        return update_data
