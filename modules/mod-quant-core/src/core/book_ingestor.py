
import asyncio
import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path
import ccxt.pro as ccxtpro
from datetime import datetime, timezone
from typing import Dict, Any
from .utils.indicators import calculate_order_imbalance, calculate_mid_price

# Configuración de Logging
logger = logging.getLogger("BOOK_INGESTOR")
logger.setLevel(logging.INFO)
log_file = Path("book_ingestor.log")
file_handler = RotatingFileHandler(log_file, maxBytes=10*1024*1024, backupCount=3)
file_formatter = logging.Formatter("%(asctime)s | %(levelname)s | %(message)s", datefmt='%Y-%m-%d %H:%M:%S')
file_handler.setFormatter(file_formatter)
logger.addHandler(file_handler)
console_handler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter("\033[35m%(asctime)s | %(levelname)s | [BOOK] %(message)s\033[0m", datefmt='%H:%M:%S'))
logger.addHandler(console_handler)

class BookIngestor:
    def __init__(self, supabase_client, audit_manager=None):
        self.supabase = supabase_client
        self.audit = audit_manager
        self.is_running = True
        self.connector = ccxtpro.binance({'options': {'defaultType': 'spot'}})
        self.active_pairs = []
        self.latest_metrics = {} # Almacena el último snapshot en memoria
        self.refresh_lock = asyncio.Lock()

    async def refresh_connector(self):
        """Destruye y recrea el conector de Binance asegurando limpieza total."""
        async with self.refresh_lock:
            logger.warning("REFRESH | Cleaning up corrupted resources...")
            try:
                # CCXT requiere cerrar el intercambio para liberar aiohttp
                await self.connector.close()
            except: pass
            
            await asyncio.sleep(10) # Cooldown más largo para DNS
            self.connector = ccxtpro.binance({
                'options': {'defaultType': 'spot'},
                'enableRateLimit': True
            })
            logger.info("REFRESH | New L2 connector created.")

    async def fetch_active_pairs(self):
        """Obtiene los pares que necesitan monitoreo de L2."""
        try:
            res = self.supabase.table("quant_bots").select("pair").in_("status", ["active", "paper_trading"]).execute()
            self.active_pairs = list(set([b['pair'] for b in res.data if b['pair'] != 'SYSTEM']))
            logger.info(f"Sync Pairs | Monitoring L2 for: {self.active_pairs}")
        except Exception as e:
            logger.error(f"Error fetching active pairs: {e}")

    async def stream_book(self, pair: str):
        """Escucha el Order Book con protección contra bucles de error."""
        logger.info(f"L2 Stream Start | {pair}")
        mode = 'websocket'
        consecutive_errors = 0
        last_recovery_attempt = datetime.now(timezone.utc)
        
        while self.is_running:
            try:
                # Si estamos en polling, intentamos volver a WS cada 10 min
                if mode == 'polling' and (datetime.now(timezone.utc) - last_recovery_attempt).total_seconds() > 600:
                    logger.info(f"AUTO-HEAL | Attempting to restore WebSocket for {pair}")
                    mode = 'websocket'
                    last_recovery_attempt = datetime.now(timezone.utc)

                if mode == 'websocket':
                    order_book = await self.connector.watch_order_book(pair, limit=20)
                else:
                    await asyncio.sleep(20) # Polling lento en modo recuperación
                    order_book = await self.connector.fetch_order_book(pair, limit=20)
                
                bids = order_book['bids']
                asks = order_book['asks']
                
                # 1. Cálculos de Microestructura
                imbalance = calculate_order_imbalance(bids, asks)
                mid_price = calculate_mid_price(bids, asks)
                
                # Cálculo de Spread %
                best_bid = float(bids[0][0])
                best_ask = float(asks[0][0])
                spread_pct = ((best_ask - best_bid) / mid_price) * 100 if mid_price > 0 else 0
                
                # Volumen total en el Top 20 (en USDT aprox)
                depth_usdt = sum([float(b[1]) * float(b[0]) for b in bids]) + sum([float(a[1]) * float(a[0]) for a in asks])

                # 2. Guardar en memoria para acceso rápido
                self.latest_metrics[pair] = {
                    "pair": pair,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "imbalance_pct": round(imbalance, 4),
                    "spread_pct": round(spread_pct, 4),
                    "mid_price": int(round(mid_price * 100)),
                    "depth_usdt": round(depth_usdt, 2)
                }
                
                # Éxito: Reseteamos errores
                if consecutive_errors > 0:
                    logger.info(f"RECOVERED | {pair} is back online.")
                    consecutive_errors = 0
                
            except Exception as e:
                error_str = str(e).lower()
                consecutive_errors += 1
                logger.error(f"L2 Error [{consecutive_errors}] for {pair}: {e}")
                
                # Detectamos corrupción de objeto o fallos de red críticos
                is_corrupted = "parse_frame" in error_str or "dns" in error_str or "timeout" in error_str
                
                if is_corrupted:
                    mode = 'polling' # Fallback inmediato a modo seguro
                    last_recovery_attempt = datetime.now(timezone.utc)
                    
                    if consecutive_errors >= 3:
                        if self.audit:
                            self.audit.log_system_event("BOOK_INGESTOR_CORRUPTED", f"Hard Reset triggered: {str(e)[:100]}", pair=pair)
                        await self.refresh_connector()
                        consecutive_errors = 0
                    else:
                        await asyncio.sleep(10)
                else:
                    await asyncio.sleep(20)

    async def persist_metrics(self):
        """Envía snapshots a la DB cada 15 segundos para no saturar Supabase."""
        while self.is_running:
            await asyncio.sleep(15)
            if not self.latest_metrics: continue
            
            try:
                payload = list(self.latest_metrics.values())
                self.supabase.table("quant_book_metrics").upsert(payload).execute()
                logger.info(f"L2_FLUSH | Persisted metrics for {len(payload)} pairs.")
            except Exception as e:
                logger.error(f"L2 Persist Error: {e}")

    async def update_health(self):
        """Reporta salud del ingestor de libros."""
        while self.is_running:
            try:
                payload = {
                    "component_id": "BOOK_INGESTOR",
                    "status": "ONLINE",
                    "last_heartbeat": datetime.now(timezone.utc).isoformat(),
                    "metadata": {
                        "active_pairs": self.active_pairs,
                        "monitored_count": len(self.latest_metrics),
                        "version": "1.0.0-L2"
                    }
                }
                self.supabase.table("quant_system_health").upsert(payload).execute()
            except Exception as e:
                logger.error(f"L2 Health Error: {e}")
            await asyncio.sleep(60)

    async def run(self):
        logger.info("Initializing L2 Order Flow Engine...")
        await self.fetch_active_pairs()
        
        if not self.active_pairs:
            logger.warning("No active pairs found for L2 monitoring. Waiting...")
            await asyncio.sleep(30)
            return await self.run()

        tasks = [self.stream_book(pair) for pair in self.active_pairs]
        tasks.append(self.persist_metrics())
        tasks.append(self.update_health())
        
        await asyncio.gather(*tasks)

    def stop(self):
        self.is_running = False
