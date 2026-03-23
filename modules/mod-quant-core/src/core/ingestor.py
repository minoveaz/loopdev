import asyncio
import logging
import pandas as pd
import ccxt.pro as ccxtpro
from datetime import datetime, timezone, timedelta
from typing import List, Dict
from postgrest.exceptions import APIError

# --- CONFIGURACIÓN DE COLORES ANSI ---
CLR_RESET = "\033[0m"
CLR_GREEN = "\033[32m"
CLR_CYAN = "\033[36m"
CLR_YELLOW = "\033[33m"
CLR_RED = "\033[31m"
CLR_MAGENTA = "\033[35m"
CLR_BOLD = "\033[1m"

# Formateador de Logging Custom
class IndustrialFormatter(logging.Formatter):
    def format(self, record):
        log_fmt = "%(asctime)s | %(levelname)s | [INGESTOR] %(message)s"
        if record.levelno == logging.INFO:
            if "OK" in record.msg or "FLUSH" in record.msg or "persisted" in record.msg:
                log_fmt = f"{CLR_GREEN}%(asctime)s | %(levelname)s | [INGESTOR] %(message)s{CLR_RESET}"
            elif "TICK" in record.msg:
                log_fmt = f"{CLR_CYAN}%(asctime)s | %(levelname)s | [INGESTOR] %(message)s{CLR_RESET}"
        elif record.levelno == logging.WARNING:
            log_fmt = f"{CLR_YELLOW}%(asctime)s | %(levelname)s | [INGESTOR] %(message)s{CLR_RESET}"
        elif record.levelno == logging.ERROR:
            log_fmt = f"{CLR_RED}{CLR_BOLD}%(asctime)s | %(levelname)s | [INGESTOR] %(message)s{CLR_RESET}"
        
        formatter = logging.Formatter(log_fmt, datefmt='%H:%M:%S')
        return formatter.format(record)

# Configuración de Logging
logger = logging.getLogger("INGESTOR")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(IndustrialFormatter())
logger.addHandler(handler)
# Evitar duplicados si se importa el módulo varias veces
logger.propagate = False

class MarketIngestor:
    def __init__(self, supabase_client):
        self.supabase = supabase_client
        self.active_pairs = []
        self.buffer = []
        self.buffer_lock = asyncio.Lock()
        
        self.connectors = {
            'testnet': ccxtpro.binance({'options': {'defaultType': 'spot'}}),
            'production': ccxtpro.binance({'options': {'defaultType': 'spot'}})
        }
        self.connectors['testnet'].set_sandbox_mode(True)
        self.is_running = True

    def to_cents(self, price: float) -> int:
        return int(round(price * 100))

    async def fetch_config(self):
        try:
            res = self.supabase.table("quant_market_config").select("*").eq("is_active", True).execute()
            self.active_pairs = res.data
            logger.info(f"Sync Config | {CLR_MAGENTA}Active: {[p['pair'] for p in self.active_pairs]}{CLR_RESET}")
        except Exception as e:
            logger.error(f"Config Error: {e}")

    async def perform_backfill(self, pair: str, environment: str):
        connector = self.connectors[environment]
        try:
            res = self.supabase.table("quant_market_history") \
                .select("timestamp") \
                .eq("pair", pair) \
                .eq("environment", environment) \
                .order("timestamp", desc=True) \
                .limit(1).execute()

            since = None
            if res.data:
                ts_str = res.data[0]['timestamp'].replace('Z', '+00:00')
                since = int(datetime.fromisoformat(ts_str).timestamp() * 1000) + 1000
            else:
                since = connector.milliseconds() - (86400000 * 7)

            ohlcv = await connector.fetch_ohlcv(pair, '1m', since=since, limit=1000)
            if ohlcv:
                payload = [{
                    "pair": pair, "environment": environment, "timeframe": '1m',
                    "open": self.to_cents(c[1]), "high": self.to_cents(c[2]), 
                    "low": self.to_cents(c[3]), "close": self.to_cents(c[4]),
                    "volume": float(c[5]),
                    "timestamp": datetime.fromtimestamp(c[0] / 1000, tz=timezone.utc).isoformat()
                } for c in ohlcv]
                
                self.supabase.table("quant_market_history").upsert(
                    payload, 
                    on_conflict="pair,environment,timeframe,timestamp"
                ).execute()
                logger.info(f"Backfill OK | {pair} | +{len(payload)} candles")
        except Exception as e:
            logger.error(f"Backfill Err | {pair}: {e}")

    async def flush_buffer(self):
        while self.is_running:
            await asyncio.sleep(15)
            
            async with self.buffer_lock:
                if not self.buffer: continue
                seen = set()
                payload_to_send = []
                for tick in reversed(self.buffer):
                    key = (tick['pair'], tick['timestamp'], tick['environment'])
                    if key not in seen:
                        payload_to_send.append(tick)
                        seen.add(key)
                self.buffer = []
            
            try:
                self.supabase.table("quant_market_history").upsert(
                    payload_to_send, 
                    on_conflict="pair,environment,timeframe,timestamp"
                ).execute()
                logger.info(f"BUFFER_FLUSH | {len(payload_to_send)} unique ticks persisted.")
            except Exception as e:
                logger.error(f"Flush Error: {e}")
                if "duplicate key" not in str(e):
                    async with self.buffer_lock: self.buffer.extend(payload_to_send)

    async def stream_pair(self, pair: str, environment: str):
        connector = self.connectors[environment]
        mode = 'websocket'
        logger.info(f"Stream Start | {pair} [{environment}]")
        
        while self.is_running:
            try:
                start_time = datetime.now(timezone.utc)
                if mode == 'websocket':
                    candles = await connector.watch_ohlcv(pair, timeframe='1m')
                    last_candle = candles[-1]
                else:
                    await asyncio.sleep(20)
                    candles = await connector.fetch_ohlcv(pair, timeframe='1m', limit=2)
                    last_candle = candles[-1]
                
                end_time = datetime.now(timezone.utc)
                latency_ms = int((end_time - start_time).total_seconds() * 1000)

                payload = {
                    "pair": pair, "environment": environment, "timeframe": '1m',
                    "open": self.to_cents(last_candle[1]), "high": self.to_cents(last_candle[2]),
                    "low": self.to_cents(last_candle[3]), "close": self.to_cents(last_candle[4]),
                    "volume": float(last_candle[5]),
                    "timestamp": datetime.fromtimestamp(last_candle[0] / 1000, tz=timezone.utc).isoformat(),
                    "latency_ms": latency_ms
                }
                
                async with self.buffer_lock: self.buffer.append(payload)
                logger.info(f"TICK | {pair} | {payload['close']}c | {latency_ms}ms")
                
            except Exception as e:
                if mode == 'websocket':
                    logger.warning(f"WS Failed for {pair}. Mode: POLLING.")
                    mode = 'polling'
                await asyncio.sleep(10)

    async def run(self):
        logger.info(f"{CLR_BOLD}{CLR_MAGENTA}Initializing Data Sentinel Service...{CLR_RESET}")
        await self.fetch_config()
        
        # 1. Extraer pares de la config
        config_pairs = [entry['pair'] for entry in self.active_pairs]
        
        # 2. Extraer pares usados por bots actuales (Escalabilidad dinámica)
        try:
            bot_res = self.supabase.table("quant_bots").select("pair").in_("status", ["active", "paper_trading"]).execute()
            bot_pairs = list(set([b['pair'] for b in bot_res.data]))
        except Exception:
            bot_pairs = []
            
        all_pairs = list(set(config_pairs + bot_pairs))
        logger.info(f"SENTINEL | Monitoring {len(all_pairs)} pairs: {all_pairs}")

        for pair in all_pairs:
            await self.perform_backfill(pair, 'testnet')
            
        tasks = [self.stream_pair(pair, 'testnet') for pair in all_pairs]
        tasks.append(self.flush_buffer())
        await asyncio.gather(*tasks)

    def stop(self):
        self.is_running = False
