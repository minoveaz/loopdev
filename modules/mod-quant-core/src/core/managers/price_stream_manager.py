
import asyncio
import ccxt.pro as ccxtpro
from loguru import logger
from typing import Dict, List

class PriceStreamManager:
    """
    Tier A+: Gestor de Flujos de Datos en Tiempo Real.
    Mantiene un caché en memoria de los últimos precios vía WebSockets.
    """
    def __init__(self, exchange_id: str = 'binance'):
        self.exchange_id = exchange_id
        self.exchange = None
        self.prices: Dict[str, float] = {}
        self.is_running = True
        self.monitored_pairs: List[str] = []
        self._streaming_tasks: Dict[str, asyncio.Task] = {}

    async def connect(self):
        """Inicializa la conexión WebSocket con configuración de estabilidad."""
        if self.exchange:
            await self.exchange.close()
            
        exchange_class = getattr(ccxtpro, self.exchange_id)
        self.exchange = exchange_class({
            'enableRateLimit': True,
            'options': {
                'defaultType': 'spot',
                'OHLCVLimit': 1000
            }
        })
        logger.info(f"PriceStreamManager: WebSocket initialized for {self.exchange_id}")

    def update_pairs(self, pairs: List[str]):
        """Actualiza la lista de pares y gestiona las tareas de streaming."""
        new_pairs = set(pairs)
        current_pairs = set(self.monitored_pairs)
        
        # Si no hay cambios reales, no hacemos nada para evitar logs ruidosos
        if new_pairs == current_pairs:
            return

        self.monitored_pairs = list(new_pairs)
        logger.info(f"PriceStreamManager: Updating pairs list -> {self.monitored_pairs}")
        
        # Cancelamos tareas de pares que ya no están
        for pair in current_pairs - new_pairs:
            if pair in self._streaming_tasks:
                self._streaming_tasks[pair].cancel()
                del self._streaming_tasks[pair]

    def get_price(self, pair: str) -> float:
        """Recupera el precio actual desde la memoria."""
        return self.prices.get(pair, 0.0)

    async def _stream_pair(self, pair: str):
        """Tarea individual para monitorear un par específico (Más estable)."""
        while self.is_running:
            try:
                ticker = await self.exchange.watch_ticker(pair)
                self.prices[pair] = float(ticker['last'])
            except asyncio.CancelledError:
                break
            except Exception as e:
                # Error de frame o red: esperamos y reintentamos
                await asyncio.sleep(1)

    async def run(self):
        """Bucle supervisor de tareas de streaming."""
        await self.connect()
        
        while self.is_running:
            try:
                # Lanzamos nuevas tareas para pares recién añadidos
                for pair in self.monitored_pairs:
                    if pair not in self._streaming_tasks:
                        task = asyncio.create_task(self._stream_pair(pair))
                        self._streaming_tasks[pair] = task
                
                await asyncio.sleep(2) # El supervisor solo chequea tareas cada 2s
                
            except Exception as e:
                logger.error(f"PriceStreamManager Supervisor Error: {e}")
                await asyncio.sleep(5)

    async def stop(self):
        """Cierra todas las conexiones y tareas."""
        self.is_running = False
        for task in self._streaming_tasks.values():
            task.cancel()
        if self.exchange:
            await self.exchange.close()
        logger.warning("PriceStreamManager: Stopped all streams.")
