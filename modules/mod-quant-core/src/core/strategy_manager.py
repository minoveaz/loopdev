
import asyncio
from typing import Dict, List
from supabase import Client
import ccxt.pro as ccxtpro
from loguru import logger

# --- Motores Especializados ---
from .managers.risk_manager import RiskManager
from .managers.execution_manager import ExecutionManager
from .managers.command_listener import CommandListener
from .managers.signal_engine import SignalEngine
from .managers.position_monitor import PositionMonitor
from .managers.price_stream_manager import PriceStreamManager
from .managers.credential_vault import CredentialVault
from .managers.audit_manager import AuditManager

# --- Estrategias ---
from src.strategies.baseline.rsi_mean_reversion import RSIMeanReversionStrategy
from src.strategies.baseline.intraday_atr import IntradayATRStrategy
from src.strategies.baseline.hybrid_core import HybridCoreStrategy
from src.strategies.baseline.aggressive_rsi import AggressiveRSIStrategy
from src.strategies.baseline.hf_scalper import HighFrequencyScalperStrategy

class StrategyManager:
    """
    Orquestador Central (Tier A).
    Refactorizado para Alta Disponibilidad y Concurrencia Protegida.
    """
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client
        self.is_running = True
        self.tasks: List[asyncio.Task] = []
        
        # 0. Motor de Precios Real-time (WebSocket)
        self.price_stream = PriceStreamManager()
        
        # 0.1 Bóveda de Seguridad (Vault)
        self.vault = CredentialVault(self.supabase)
        
        # 0.2 Registrador de Vuelo (Audit Trail)
        self.audit = AuditManager(self.supabase)

        # 1. Registro de Estrategias
        self.logic_engines = {
            "rsi-mean-rev-v1": RSIMeanReversionStrategy(),
            "atr-breakout-v1": IntradayATRStrategy(),
            "hybrid-core-v1": HybridCoreStrategy(),
            "aggressive-rsi-v1": AggressiveRSIStrategy(),
            "hf-scalper-v1": HighFrequencyScalperStrategy(),
            "default": RSIMeanReversionStrategy()
        }

        # 2. Inicialización de Capas
        self.risk = RiskManager()
        
        # Brazo Ejecutor (Tier C) - Inyectamos Audit
        self.execution = ExecutionManager(self.supabase, self.risk, self.logic_engines, self.audit)
        self.signal_engine = SignalEngine(self.supabase, self.risk, self.logic_engines, self.audit)
        
        # Vigilante de Posiciones (Tier B+) - Inyectamos flujo de precios y Audit
        self.position_monitor = PositionMonitor(self.supabase, self.risk, self.signal_engine.generate_signal, self.price_stream, self.audit)
        
        # Oído de Comandos UI (Tier D)
        self.commands = CommandListener(self.supabase, self.risk, self.execution)

    async def run(self):
        """
        Lanza y Supervisa todos los motores.
        Implementa un patrón de 'Supervisor' para evitar caídas totales.
        """
        logger.success("LoopDev Orchestrator V2 Online - High Availability Mode")
        
        # Sincronizamos pares activos inicialmente
        try:
            res = self.supabase.table("quant_bots").select("pair").eq("status", "active").execute()
            active_pairs = [b['pair'] for b in res.data]
            self.price_stream.update_pairs(active_pairs)
        except Exception as e:
            logger.error(f"Initial pair sync failed: {e}")

        # Definimos los servicios críticos
        services = [
            ("PriceStream", self.price_stream.run),
            ("SignalEngine", self.signal_engine.run),
            ("Execution", self.execution.run),
            ("Monitor", self.position_monitor.run),
            ("Commands", self.commands.run)
        ]

        while self.is_running:
            try:
                # Creamos las tareas para cada servicio
                self.tasks = [asyncio.create_task(s[1](), name=s[0]) for s in services]
                
                # Esperamos a que alguna tarea termine (o falle)
                done, pending = await asyncio.wait(
                    self.tasks, 
                    return_when=asyncio.FIRST_EXCEPTION
                )

                for task in done:
                    name = task.get_name()
                    if task.exception():
                        logger.error(f"CRITICAL: Service '{name}' failed with error: {task.exception()}")
                    else:
                        logger.warning(f"Service '{name}' stopped unexpectedly.")

                # Si el orquestador sigue vivo, intentamos reiniciar tras un cooldown
                if self.is_running:
                    logger.info("Initiating service recovery in 5 seconds...")
                    for p in pending: p.cancel()
                    await asyncio.sleep(5)

            except Exception as e:
                logger.fatal(f"Orchestrator Global Error: {e}")
                await asyncio.sleep(10)

    def stop(self):
        """Parada controlada."""
        self.is_running = False
        for t in self.tasks: t.cancel()
        logger.warning("Graceful Shutdown Initiated.")
