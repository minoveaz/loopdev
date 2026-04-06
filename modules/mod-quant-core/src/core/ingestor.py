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
        self.refresh_lock = asyncio.Lock() # Lock para evitar reinicios duplicados
        
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

    async def perform_backfill(self, pair: str, environment: str, timeframe: str = '1m'):
        connector = self.connectors[environment]
        try:
            res = self.supabase.table("quant_market_history") \
                .select("timestamp") \
                .eq("pair", pair) \
                .eq("environment", environment) \
                .eq("timeframe", timeframe) \
                .order("timestamp", desc=True) \
                .limit(1).execute()

            since = None
            if res.data:
                ts_str = res.data[0]['timestamp'].replace('Z', '+00:00')
                since = int(datetime.fromisoformat(ts_str).timestamp() * 1000) + 1000
            else:
                since = connector.milliseconds() - (86400000 * 7)

            ohlcv = await connector.fetch_ohlcv(pair, timeframe, since=since, limit=1000)
            if ohlcv:
                payload = [{
                    "pair": pair, "environment": environment, "timeframe": timeframe,
                    "open": self.to_cents(c[1]), "high": self.to_cents(c[2]), 
                    "low": self.to_cents(c[3]), "close": self.to_cents(c[4]),
                    "volume": float(c[5]),
                    "timestamp": datetime.fromtimestamp(c[0] / 1000, tz=timezone.utc).isoformat()
                } for c in ohlcv]
                
                self.supabase.table("quant_market_history").upsert(
                    payload, 
                    on_conflict="pair,environment,timeframe,timestamp"
                ).execute()
                logger.info(f"Backfill OK | {pair} | {timeframe} | +{len(payload)} candles")
        except Exception as e:
            logger.error(f"Backfill Err | {pair} | {timeframe}: {e}")

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

    async def stream_pair(self, pair: str, environment: str, timeframe: str = '1m'):
        mode = 'websocket'
        logger.info(f"Stream Start | {pair} | {timeframe} [{environment}]")
        
        polling_count = 0
        
        while self.is_running:
            connector = self.connectors[environment]
            try:
                start_time = datetime.now(timezone.utc)
                if mode == 'websocket':
                    candles = await connector.watch_ohlcv(pair, timeframe=timeframe)
                    last_candle = candles[-1]
                else:
                    # MODO POLLING: Intervalo ajustado por timeframe
                    wait_time = 10 if timeframe == '1m' else 30
                    await asyncio.sleep(wait_time)
                    candles = await connector.fetch_ohlcv(pair, timeframe=timeframe, limit=2)
                    last_candle = candles[-1]
                    polling_count += 1
                    
                    if polling_count >= 20:
                        mode = 'websocket'
                        polling_count = 0
                
                end_time = datetime.now(timezone.utc)
                latency_ms = int((end_time - start_time).total_seconds() * 1000)

                payload = {
                    "pair": pair, "environment": environment, "timeframe": timeframe,
                    "open": self.to_cents(last_candle[1]), "high": self.to_cents(last_candle[2]),
                    "low": self.to_cents(last_candle[3]), "close": self.to_cents(last_candle[4]),
                    "volume": float(last_candle[5]),
                    "timestamp": datetime.fromtimestamp(last_candle[0] / 1000, tz=timezone.utc).isoformat(),
                    "latency_ms": latency_ms
                }
                
                async with self.buffer_lock: self.buffer.append(payload)
                # Log selectivo para no saturar
                if timeframe == '1m' or datetime.now().second < 10:
                    logger.info(f"TICK | {pair} | {timeframe} | {payload['close']}c")
                
            except Exception as e:
                error_str = str(e).lower()
                if mode == 'websocket':
                    reason = "Connection Refused/502" if "502" in error_str else e
                    logger.warning(f"WS Failed for {pair} ({timeframe}). Switching to POLLING. Reason: {reason}")
                    mode = 'polling'
                
                # Gestión de errores críticos (502 / Bad Gateway)
                if "502" in error_str or "bad gateway" in error_str:
                    async with self.refresh_lock:
                        # Verificamos si otro proceso ya refrescó el conector mientras esperábamos
                        if self.connectors[environment] == connector:
                            logger.error(f"Binance Testnet is DOWN (502). Refreshing global session...")
                            try:
                                await connector.close()
                            except: pass
                            
                            await asyncio.sleep(60) # Espera larga para recuperación
                            
                            try:
                                new_connector = ccxtpro.binance({'options': {'defaultType': 'spot'}})
                                if environment == 'testnet': new_connector.set_sandbox_mode(True)
                                self.connectors[environment] = new_connector
                                logger.info(f"Global session refreshed for {environment}. Ready to retry.")
                            except: pass
                        else:
                            # Si ya fue refrescado, solo esperamos un poco antes de reintentar
                            await asyncio.sleep(10)
                else:
                    await asyncio.sleep(10)

    async def run(self):
        logger.info(f"{CLR_BOLD}{CLR_MAGENTA}Initializing Data Sentinel Service (V3 MULTI-TF)...{CLR_RESET}")
        await self.fetch_config()
        
        # 1. Resolver Pares
        config_pairs = [entry['pair'] for entry in self.active_pairs]
        try:
            bot_res = self.supabase.table("quant_bots").select("pair").in_("status", ["active", "paper_trading"]).execute()
            bot_pairs = list(set([b['pair'] for b in bot_res.data]))
        except Exception: bot_pairs = []
        all_pairs = list(set(config_pairs + bot_pairs))
        
        # 2. Definir Temporalidades Industriales
        timeframes = ['1m', '5m', '15m']
        logger.info(f"SENTINEL | Monitoring {len(all_pairs)} pairs across {timeframes}")

        # 3. Backfill & Stream para cada combinación (Modo Producción Maestra)
        tasks = []
        for pair in all_pairs:
            for tf in timeframes:
                await self.perform_backfill(pair, 'production', tf)
                tasks.append(self.stream_pair(pair, 'production', tf))
            
        tasks.append(self.flush_buffer())
        await asyncio.gather(*tasks)

    def stop(self):
        self.is_running = False
