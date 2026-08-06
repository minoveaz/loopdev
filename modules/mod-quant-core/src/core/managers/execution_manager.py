
import json
import asyncio
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from loguru import logger
from supabase import Client

# Importamos modelos, gestor de riesgos y auditoría
from src.core.models.trading import BotModel
from src.core.managers.risk_manager import RiskManager
from src.core.managers.audit_manager import AuditManager

class ExecutionManager:
    """
    Tier C: Brazo Ejecutor del Motor.
    Procesa las señales pendientes y ejecuta trades con auditoría industrial.
    """
    def __init__(self, supabase: Client, risk_manager: RiskManager, logic_engines, audit_manager: AuditManager):
        self.supabase = supabase
        self.risk = risk_manager
        self.logic_engines = logic_engines
        self.audit = audit_manager
        self.is_running = True

    async def execute_trade(self, signal: Dict[str, Any]):
        """Ejecución física de una señal en la base de datos y auditoría."""
        bot_id = signal['bot_id']
        pair = signal['pair']
        side = signal['side']
        price = self.risk.from_cents(signal['price'])
        
        # Corrección de signal_id: Si es "MANUAL", usamos None para que la DB acepte el UUID nulo.
        raw_signal_id = signal.get('id')
        db_signal_id = None if raw_signal_id == "MANUAL" else raw_signal_id
        
        masked_bot_id = f"{bot_id[:4]}...{bot_id[-4:]}"
        logger.info(f"EXECUTING ORDER | {pair} | {side} @ ${price} | Bot: {masked_bot_id}")
        
        try:
            # 0. Datos del bot
            res_bot = self.supabase.table("quant_bots").select("*, quant_strategies(core_id)").eq("id", bot_id).execute()
            if not res_bot.data: 
                raise Exception(f"Bot {bot_id} not found")
            
            # Instanciamos el modelo (el modelo ya es flexible con campos faltantes)
            bot_data = res_bot.data[0]
            bot = BotModel(**bot_data)

            # 1. Marcar señal como ejecutada (si no es manual)
            if db_signal_id:
                self.supabase.table("quant_signals").update({"status": "EXECUTED"}).eq("id", db_signal_id).execute()
            
            # 2. Payload base para la actualización del Bot
            is_entry = side in ['BUY', 'SHORT', 'SELL']
            pos_side = "LONG" if side == "BUY" else "SHORT" if side in ["SHORT", "SELL"] else None
            
            update_payload = {
                "current_entry_price": signal['price'] if is_entry else 0,
                "current_position_side": pos_side if is_entry else None,
                "current_action": f"In Position ({pair})" if is_entry else "Scanning Market",
                # IMPORTANTE: Grabamos el timestamp tanto en entrada como en salida
                # Esto nos sirve de referencia inmutable para el Cooldown (Anti-Churn)
                "current_position_opened_at": datetime.now(timezone.utc).isoformat(),
                "current_position_max_price": signal['price'] if is_entry else 0,
                "current_position_min_price": signal['price'] if is_entry else 0,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }

            final_pnl = 0.0

            # 3. Stats en Cierre (EXIT)
            if not is_entry:
                # --- VALIDACIÓN DE INTEGRIDAD ---
                if not bot.is_in_position:
                    logger.warning(f"DUPLICATE EXIT IGNORED | Bot {masked_bot_id} is already out of position.")
                    if db_signal_id:
                        self.supabase.table("quant_signals").update({"status": "REJECTED"}).eq("id", db_signal_id).execute()
                    return

                final_pnl = float(bot.current_pnl_pct or 0)
                
                if db_signal_id:
                    meta = signal.get('metadata') or {}
                    if isinstance(meta, str): meta = json.loads(meta)
                    meta['pnl_pct'] = final_pnl
                    self.supabase.table("quant_signals").update({"metadata": meta}).eq("id", db_signal_id).execute()
                
                # Cálculo de promedios
                new_total = int(bot_data.get('total_trades') or 0) + 1
                new_wins = int(bot_data.get('winning_trades') or 0) + (1 if final_pnl > 0 else 0)
                new_losses = int(bot_data.get('losing_trades') or 0) + (0 if final_pnl > 0 else 1)
                old_avg = float(bot_data.get('avg_pnl_pct') or 0)
                new_avg = ((old_avg * (new_total - 1)) + final_pnl) / new_total
                
                update_payload.update({
                    "total_trades": new_total, "winning_trades": new_wins, 
                    "losing_trades": new_losses, "avg_pnl_pct": round(new_avg, 2),
                    "current_pnl_pct": 0, "current_pnl_usdt": 0
                })

            # 4. Cálculo de TP/SL
            if is_entry:
                # Recuperar multiplicador de agresividad de la señal
                meta = signal.get('metadata') or {}
                if isinstance(meta, str): meta = json.loads(meta)
                boost = float(meta.get('profit_boost', 1.0))
                
                last_atr = self.risk.from_cents(bot_data.get('last_atr')) or (price * 0.02)
                exit_targets = self.risk.get_initial_exit_targets(price, side, last_atr, aggression_multiplier=boost)
                update_payload["last_exit_targets"] = exit_targets
                
                if boost > 1.0:
                    logger.success(f"PROFIT BOOST | Level: {boost}x | Bot {masked_bot_id} aiming for high-yield trade.")

            # 5. Registro de Orden
            investment = float(bot.base_investment_usdt or 100)
            quantity_raw = (investment / price) if price > 0 else 0
            
            order_payload = {
                "bot_id": bot_id,
                "tenant_id": bot_data.get('tenant_id', '00000000-0000-0000-0000-000000000000'),
                "signal_id": db_signal_id, # Usamos el ID corregido (None si era "MANUAL")
                "side": side,
                "type": "MARKET",
                "status": "FILLED",
                "price": signal['price'],
                "quantity": self.risk.to_cents(quantity_raw),
                "fee_usdt": self.risk.to_cents(investment * 0.001),
                "pnl_pct": final_pnl
            }
            self.supabase.table("quant_orders").insert(order_payload).execute()

            # 6. Sincronización Final
            self.supabase.table("quant_bots").update(update_payload).eq("id", bot_id).execute()
            logger.success(f"ORDER SUCCESS | Bot {masked_bot_id} updated.")

            # --- AUDIT LOG (PASIVO) ---
            try:
                # Recuperar snapshot actual para el log de auditoría
                logic_snapshot = bot_data.get('last_logic_snapshot') or {}
                if is_entry:
                    self.audit.log_entry(bot, signal['price'], logic_snapshot)
                else:
                    self.audit.log_exit(bot, signal['price'], final_pnl, side, logic_snapshot)
            except Exception as audit_err:
                logger.error(f"Audit log failed (non-blocking): {audit_err}")
            
        except Exception as e:
            logger.error(f"Execution Failed: {e}")
            if db_signal_id:
                self.supabase.table("quant_signals").update({"status": "REJECTED"}).eq("id", db_signal_id).execute()

    async def run(self):
        logger.info("Execution Manager (Tier C) running at 5s interval.")
        while self.is_running:
            try:
                res = self.supabase.table("quant_signals").select("*").eq("status", "PENDING").execute()
                for signal in res.data:
                    await self.execute_trade(signal)
                await asyncio.sleep(5)
            except Exception as e:
                logger.error(f"Execution Manager Loop Error: {e}")
                await asyncio.sleep(5)
