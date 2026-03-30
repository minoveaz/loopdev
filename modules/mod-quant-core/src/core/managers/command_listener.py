
import asyncio
from loguru import logger
from supabase import Client
from typing import Dict, Any

class CommandListener:
    """
    Tier D: Bus de Comandos de Intervención.
    Escucha y ejecuta órdenes manuales desde la UI con limpieza atómica.
    """
    
    def __init__(self, supabase: Client, risk_manager, execution_manager):
        self.supabase = supabase
        self.risk = risk_manager
        self.execution = execution_manager

    async def run(self):
        logger.info("Command Listener (Tier D) active. Atomic cleanup protocol enabled.")
        while True:
            try:
                # 1. Buscar bots con comandos pendientes o pausados que estén en posición
                res = self.supabase.table("quant_bots").select("*") \
                    .or_("pending_command.neq.null,status.eq.paused") \
                    .gt("current_entry_price", 0).execute()
                
                for bot in res.data:
                    cmd = bot.get('pending_command')
                    bot_id = bot['id']
                    
                    # --- LIMPIEZA ATÓMICA PREVENTIVA ---
                    # Borramos el comando inmediatamente para evitar re-procesamiento por latencia.
                    if cmd:
                        self.supabase.table("quant_bots").update({"pending_command": None}).eq("id", bot_id).execute()
                    
                    # Caso A: Cierre de Emergencia
                    if bot['status'] == 'paused' or cmd in ['MARKET_EXIT', 'TP_NOW']:
                        reason = "MANUAL_INTERVENTION" if bot['status'] == 'paused' else f"UI_COMMAND_{cmd}"
                        logger.warning(f"MANUAL EXIT TRIGGERED | Bot: {bot_id[:8]} | Reason: {reason}")
                        
                        # Obtener último precio para el registro de salida
                        hist = self.supabase.table("quant_market_history").select("close").eq("pair", bot['pair']).order("timestamp", desc=True).limit(1).execute()
                        if hist.data:
                            current_price = self.risk.from_cents(hist.data[0]['close'])
                            # Ejecutamos la salida física
                            await self.execution.execute_trade({
                                "bot_id": bot_id, 
                                "pair": bot['pair'], 
                                "side": "EXIT", 
                                "price": self.risk.to_cents(current_price), 
                                "id": "MANUAL", 
                                "metadata": {"reason": reason}
                            })

                    # Caso B: Mover a Break-Even
                    elif cmd == 'MOVE_TO_BE':
                        entry_price = self.risk.from_cents(bot['current_entry_price'])
                        side = bot.get('current_position_side', 'LONG')
                        be_price = entry_price * 1.002 if side == 'LONG' else entry_price * 0.998
                        
                        new_targets = bot.get('last_exit_targets', {}).copy()
                        new_targets['sl_price'] = self.risk.to_cents(be_price)
                        
                        self.supabase.table("quant_bots").update({
                            "last_exit_targets": new_targets,
                            "current_action": "SL Adjusted to Break-Even (Manual)"
                        }).eq("id", bot_id).execute()
                        logger.success(f"MANUAL BE SET | Bot: {bot_id[:8]}")

                    # Caso C: Ajustar Distancia Trailing
                    elif cmd and cmd.startswith('TRAIL_DISTANCE:'):
                        new_dist = float(cmd.split(':')[1])
                        self.supabase.table("quant_bots").update({
                            "trailing_stop_distance": new_dist
                        }).eq("id", bot_id).execute()
                        logger.success(f"TRAIL DISTANCE UPDATED | Bot: {bot_id[:8]} -> {new_dist}%")

                await asyncio.sleep(2)
            except Exception as e:
                logger.error(f"Command Listener Error: {e}")
                await asyncio.sleep(5)
