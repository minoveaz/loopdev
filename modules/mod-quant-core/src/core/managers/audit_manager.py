
import asyncio
from datetime import datetime, timezone
from loguru import logger
from supabase import Client
from typing import Dict, Any, Optional

class AuditManager:
    """
    Tier S+: Registrador de Vuelo (Flight Recorder).
    Encargado de documentar de forma inmutable el ciclo de vida de cada trade.
    Diseñado para ser 100% pasivo y no bloqueante.
    """
    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def log_event(
        self, 
        bot_id: str, 
        event_type: str, 
        pair: str, 
        price_cents: int, 
        side: Optional[str] = None, 
        pnl_pct: float = 0.0, 
        snapshot: Dict[str, Any] = {},
        tenant_id: str = '00000000-0000-0000-0000-000000000000'
    ):
        """
        Registra un hito en el historial de auditoría.
        Envuelto en try-except total para garantizar que un error de log no detenga el bot.
        """
        try:
            payload = {
                "bot_id": bot_id,
                "tenant_id": tenant_id,
                "pair": pair,
                "event_type": event_type,
                "side": side,
                "price": price_cents,
                "pnl_pct": pnl_pct,
                "logic_snapshot": snapshot,
                "created_at": datetime.now(timezone.utc).isoformat()
            }

            # Ejecución asíncrona para no retrasar el hilo principal del manager
            self.supabase.table("quant_audit_logs").insert(payload).execute()
            
            logger.debug(f"AUDIT | {event_type} recorded for bot {bot_id[:8]}")

        except Exception as e:
            # Fallo silencioso para el sistema, pero ruidoso para el log de errores
            logger.error(f"AUDIT_FAILURE: Could not record {event_type} for bot {bot_id}: {e}")

    def log_entry(self, bot: Any, price_cents: int, snapshot: Dict[str, Any]):
        """Helper rápido para entradas."""
        asyncio.create_task(self.log_event(
            bot_id=bot.id,
            event_type="ENTRY",
            pair=bot.pair,
            side=bot.current_position_side,
            price_cents=price_cents,
            snapshot=snapshot
        ))

    def log_exit(self, bot: Any, price_cents: int, pnl_pct: float, reason: str, snapshot: Dict[str, Any]):
        """Helper rápido para salidas."""
        # Enriquecemos el snapshot con la razón de salida
        enriched_snapshot = {**snapshot, "exit_reason": reason}
        asyncio.create_task(self.log_event(
            bot_id=bot.id,
            event_type="EXIT",
            pair=bot.pair,
            side=bot.current_position_side,
            price_cents=price_cents,
            pnl_pct=pnl_pct,
            snapshot=enriched_snapshot
        ))

    def log_risk_adjustment(self, bot: Any, event_type: str, price_cents: int, pnl_pct: float, snapshot: Dict[str, Any]):
        """Helper para movimientos de SL (BE_SHIELD / TRAILING)."""
        asyncio.create_task(self.log_event(
            bot_id=bot.id,
            event_type=event_type,
            pair=bot.pair,
            side=bot.current_position_side,
            price_cents=price_cents,
            pnl_pct=pnl_pct,
            snapshot=snapshot
        ))

    def log_system_event(self, event_type: str, message: str, pair: str = "GLOBAL", snapshot: Dict[str, Any] = {}):
        """
        Registra eventos de infraestructura (Ingestor, Conectividad, etc.) en la línea de tiempo unificada.
        Usa un UUID nulo para indicar que es un evento de sistema.
        """
        # Aseguramos el prefijo SYSTEM_ si no lo tiene
        full_event_type = f"SYSTEM_{event_type}" if not event_type.startswith("SYSTEM_") else event_type
        
        asyncio.create_task(self.log_event(
            bot_id="00000000-0000-0000-0000-000000000000",
            event_type=full_event_type,
            pair=pair,
            price_cents=0,
            snapshot={**snapshot, "system_message": message}
        ))
