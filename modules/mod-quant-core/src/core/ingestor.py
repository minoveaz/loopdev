import asyncio
import logging
import os
from logging.handlers import RotatingFileHandler
from pathlib import Path
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
        # Por defecto sin colores para archivos
        log_fmt = "%(asctime)s | %(levelname)s | [INGESTOR] %(message)s"
        
        # Si es el StreamHandler (consola), aplicamos colores
        if not any(isinstance(h, RotatingFileHandler) for h in logger.handlers if h.formatter == self):
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

# Handler para Consola
console_handler = logging.StreamHandler()
console_handler.setFormatter(IndustrialFormatter())
logger.addHandler(console_handler)

# Handler para Archivo (Rotativo 10MB x 5 archivos)
log_file = Path("ingestor.log")
file_handler = RotatingFileHandler(log_file, maxBytes=10*1024*1024, backupCount=5)
file_formatter = logging.Formatter("%(asctime)s | %(levelname)s | [INGESTOR] %(message)s", datefmt='%Y-%m-%d %H:%M:%S')
file_handler.setFormatter(file_formatter)
logger.addHandler(file_handler)

# Evitar duplicados
logger.propagate = False

class MarketIngestor:
    def __init__(self, supabase_client, audit_manager=None):
        self.supabase = supabase_client
        self.audit = audit_manager
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

    def to_units(self, price: float) -> int:
        """Convert price to cents (BIGINT) for financial precision."""
        return int(float(price) * 100)

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
                    "open": self.to_units(c[1]), "high": self.to_units(c[2]), 
                    "low": self.to_units(c[3]), "close": self.to_units(c[4]),
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
                    key = (tick['pair'], tick['timestamp'], tick['environment'], tick['timeframe'])
                    if key not in seen:
                        payload_to_send.append(tick)
                        seen.add(key)
                self.buffer = []
            
            try:
                if payload_to_send:
                    self.supabase.table("quant_market_history").upsert(
                        payload_to_send, 
                        on_conflict="pair,environment,timeframe,timestamp"
                    ).execute()
                    logger.info(f"BUFFER_FLUSH | {len(payload_to_send)} unique ticks persisted.")
            except Exception as e:
                logger.error(f"Flush Error: {e}")
                if "duplicate key" not in str(e).lower():
                    async with self.buffer_lock: self.buffer.extend(payload_to_send)

    async def update_heartbeat(self):
        """Envía un latido de salud a la base de datos cada 60 segundos."""
        while self.is_running:
            try:
                payload = {
                    "component_id": "INGESTOR_SENTINEL",
                    "status": "ONLINE",
                    "last_heartbeat": datetime.now(timezone.utc).isoformat(),
                    "metadata": {
                        "active_pairs": [p['pair'] for p in self.active_pairs],
                        "buffer_size": len(self.buffer),
                        "version": "3.2.2-Hardened"
                    }
                }
                self.supabase.table("quant_system_health").upsert(payload).execute()
                logger.debug("HEARTBEAT | Ingestor health status updated.")
            except Exception as e:
                logger.error(f"Heartbeat Error: {e}")
            
            await asyncio.sleep(60)

    async def stream_pair(self, pair: str, environment: str, timeframe: str = '1m'):
        mode = 'websocket'
        logger.info(f"Stream Start | {pair} | {timeframe} [{environment.upper()}]")
        
        retry_delay = 5 
        max_retry_delay = 300 
        last_ws_attempt = datetime.now(timezone.utc)
        last_success_ts = datetime.now(timezone.utc)
        
        while self.is_running:
            connector = self.connectors[environment]
            start_time = datetime.now(timezone.utc) # Fix: defined at the very start of the loop
            try:
                now = start_time
                
                # --- AUTO-BACKFILL TRAS CAÍDA DE RED ---
                gap_seconds = (now - last_success_ts).total_seconds()
                if gap_seconds > 180: # Aumentado a 3 min para dar margen
                    logger.warning(f"RECOVERY | Gap detected ({int(gap_seconds)}s). Fetching missing candles for {pair}...")
                    await self.perform_backfill(pair, environment, timeframe)
                
                # AUTO-HEAL WS
                if mode == 'polling' and (now - last_ws_attempt).total_seconds() > 300:
                    logger.info(f"AUTO-HEAL | Attempting to restore WebSocket for {pair} ({timeframe})")
                    mode = 'websocket'
                    last_ws_attempt = now

                if mode == 'websocket':
                    candles = await connector.watch_ohlcv(pair, timeframe=timeframe)
                    last_candle = candles[-1]
                else:
                    wait_time = 15 if timeframe == '1m' else 45
                    await asyncio.sleep(wait_time)
                    candles = await connector.fetch_ohlcv(pair, timeframe=timeframe, limit=2)
                    last_candle = candles[-1]
                
                # Actualizamos marca de éxito
                last_success_ts = datetime.now(timezone.utc)
                retry_delay = 5
                
                end_time = datetime.now(timezone.utc)
                latency_ms = int((end_time - start_time).total_seconds() * 1000)

                payload = {
                    "pair": pair, "environment": environment, "timeframe": timeframe,
                    "open": self.to_units(last_candle[1]), "high": self.to_units(last_candle[2]),
                    "low": self.to_units(last_candle[3]), "close": self.to_units(last_candle[4]),
                    "volume": float(last_candle[5]),
                    "timestamp": datetime.fromtimestamp(last_candle[0] / 1000, tz=timezone.utc).isoformat(),
                    "latency_ms": latency_ms
                }
                
                async with self.buffer_lock:
                    self.buffer.append(payload)
                
                # Log selectivo
                if timeframe == '1m' or datetime.now().second < 10:
                    logger.info(f"TICK | {pair} | {timeframe} | {payload['close']}")
                
            except Exception as e:
                error_str = str(e).lower()
                force_refresh = "parse_frame" in error_str or "parse_control_frame" in error_str or "502" in error_str
                
                if mode == 'websocket':
                    logger.warning(f"WS Failed for {pair} ({timeframe}). Switching to POLLING. Reason: {e}")
                    mode = 'polling'
                
                if force_refresh:
                    async with self.refresh_lock:
                        if self.connectors[environment] == connector:
                            logger.error(f"Exchange {environment.upper()} is DOWN/Unstable. Refreshing session in {retry_delay}s...")
                            try:
                                await connector.close() # Important: explicit close
                            except: pass
                            
                            await asyncio.sleep(retry_delay) 
                            
                            try:
                                new_connector = ccxtpro.binance({'options': {'defaultType': 'spot'}})
                                if environment == 'testnet': new_connector.set_sandbox_mode(True)
                                self.connectors[environment] = new_connector
                                logger.info(f"Global session refreshed for {environment.upper()}.")
                            except: pass
                            retry_delay = min(retry_delay * 2, max_retry_delay)
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
        
        # Filtramos 'SYSTEM' y cualquier otro par no válido
        all_pairs = list(set(config_pairs + bot_pairs))
        all_pairs = [p for p in all_pairs if p and p != 'SYSTEM']
        
        # 2. Definir Temporalidades Industriales
        timeframes = ['1m', '5m', '15m', '1h']
        logger.info(f"SENTINEL | Monitoring {len(all_pairs)} pairs across {timeframes}")

        # 3. Backfill & Stream para cada combinación (Modo Producción Maestra)
        tasks = []
        for pair in all_pairs:
            for tf in timeframes:
                await self.perform_backfill(pair, 'production', tf)
                tasks.append(self.stream_pair(pair, 'production', tf))
            
        tasks.append(self.flush_buffer())
        tasks.append(self.update_heartbeat())
        await asyncio.gather(*tasks)

    def stop(self):
        self.is_running = False
