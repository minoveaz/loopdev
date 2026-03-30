
import asyncio
from datetime import datetime, timezone
from loguru import logger
from supabase import Client

# Importamos modelos, gestor de riesgos y auditoría
from src.core.models.trading import BotModel
from src.core.managers.risk_manager import RiskManager
from src.core.managers.price_stream_manager import PriceStreamManager
from src.core.managers.audit_manager import AuditManager

class PositionMonitor:
    """
    Tier B+: Monitor de Posiciones Ultra-Rápido.
    Documenta ajustes de riesgo en el Audit Trail.
    """
    def __init__(self, supabase: Client, risk_manager: RiskManager, signal_generator_func, price_stream: PriceStreamManager, audit_manager: AuditManager):
        self.supabase = supabase
        self.risk = risk_manager
        self.generate_signal = signal_generator_func
        self.price_stream = price_stream
        self.audit = audit_manager
        self.is_running = True

    async def _safe_db_query(self, func, *args, **kwargs):
        """Ejecutor seguro de queries con reintento."""
        max_retries = 3
        for attempt in range(max_retries):
            try:
                return func(*args, **kwargs).execute()
            except Exception as e:
                if attempt < max_retries - 1:
                    await asyncio.sleep((attempt + 1) * 2)
                else: raise e

    async def _has_pending_exit(self, bot_id: str) -> bool:
        """Verifica si ya hay una señal de salida pendiente para evitar spam."""
        res = self.supabase.table("quant_signals")\
            .select("id")\
            .eq("bot_id", bot_id)\
            .eq("status", "PENDING")\
            .eq("side", "EXIT")\
            .execute()
        return len(res.data) > 0

    async def run(self):
        logger.info("Position Monitor (Tier B+) Online - Spam Protection Active.")
        while self.is_running:
            try:
                # 1. Buscar bots con posición abierta
                res = await self._safe_db_query(
                    self.supabase.table("quant_bots").select("*").gt, "current_entry_price", 0
                )
                
                if not res.data:
                    await asyncio.sleep(2)
                    continue

                pairs_in_position = [b['pair'] for b in res.data]
                self.price_stream.update_pairs(pairs_in_position)

                for raw_bot in res.data:
                    try:
                        bot = BotModel(**raw_bot)
                        pair = bot.pair
                        current_price = self.price_stream.get_price(pair)
                        
                        if current_price <= 0:
                            hist = await self._safe_db_query(
                                self.supabase.table("quant_market_history").select("close").eq("pair", pair).order("timestamp", desc=True).limit, 1
                            )
                            if hist.data:
                                current_price = self.risk.from_cents(hist.data[0]['close'])
                            else: continue

                        pnl_data = self.risk.calculate_pnl(bot, current_price)
                        # 4. Check de Salidas (SL/TP)
                        targets = bot.last_exit_targets or {}
                        tp_price = self.risk.from_cents(targets.get('tp_price', 999999999))
                        sl_price = self.risk.from_cents(targets.get('sl_price', 0))
                        entry_price = self.risk.from_cents(bot.current_entry_price)
                        side = bot.get_side()

                        exit_triggered = False
                        if side == "SHORT":
                            # --- SANITY CHECK SHORT (Refinado) ---
                            # El TP debe ser inferior a la entrada. El SL no se valida contra la entrada porque es dinámico.
                            if tp_price < entry_price:
                                if current_price >= sl_price and sl_price > 0: exit_triggered = "HARD_STOP_LOSS_HIT"
                                elif current_price <= tp_price: exit_triggered = "TAKE_PROFIT_HIT"
                        else:
                            # --- SANITY CHECK LONG (Refinado) ---
                            # El TP debe ser superior a la entrada.
                            if tp_price > entry_price:
                                if current_price <= sl_price and sl_price > 0: exit_triggered = "HARD_STOP_LOSS_HIT"
                                elif current_price >= tp_price: exit_triggered = "TAKE_PROFIT_HIT"

                        if exit_triggered:
                            # --- PROTECCIÓN ANTI-SPAM ---
                            if not await self._has_pending_exit(bot.id):
                                logger.warning(f"AUTO-EXIT | Bot: {bot.id[:8]} | {exit_triggered}")
                                await self.generate_signal(raw_bot, 'EXIT', current_price, {"reason": exit_triggered, "pnl_pct": pnl_data['current_pnl_pct']})
                            else:
                                logger.info(f"EXIT PENDING | Bot: {bot.id[:8]} | Skipping duplicate signal.")
                        else:
                            risk_updates = self.risk.process_trailing_and_be(bot, current_price, pnl_data['current_pnl_pct'])
                            
                            if risk_updates:
                                # --- AUDIT LOG (PASIVO) ---
                                try:
                                    # Identificamos el tipo de evento basándonos en la acción reportada por RiskManager
                                    action = risk_updates.get("current_action", "")
                                    event = "BE_SHIELD_ACTIVATED" if "BE_SHIELD" in action else "TRAILING_STOP_MOVED"
                                    
                                    self.audit.log_risk_adjustment(
                                        bot, event, self.risk.to_cents(current_price), 
                                        pnl_data['current_pnl_pct'], bot.last_logic_snapshot or {}
                                    )
                                except Exception as audit_err:
                                    logger.error(f"Audit log failed: {audit_err}")

                            if risk_updates or (datetime.now(timezone.utc).second % 15 == 0):
                                update_payload = {
                                    **pnl_data, **risk_updates, 
                                    "last_price": self.risk.to_cents(current_price), 
                                    "updated_at": datetime.now(timezone.utc).isoformat()
                                }
                                await self._safe_db_query(self.supabase.table("quant_bots").update(update_payload).eq, "id", bot.id)
                    except Exception as bot_err:
                        logger.error(f"Error processing Bot {raw_bot.get('id')[:8]}: {bot_err}")
                        continue

                await asyncio.sleep(1) 
            except Exception as e:
                logger.error(f"Position Monitor Loop Error: {e}")
                await asyncio.sleep(5)
