import asyncio
import logging
import pandas as pd
from datetime import datetime, timezone
from typing import Dict, Optional
from supabase import Client
import ccxt.pro as ccxtpro

# Configuración Industrial
logging.basicConfig(level=logging.INFO, format='%(asctime)s | %(levelname)s | [%(name)s] %(message)s')
logger = logging.getLogger("QUANT_CORE")

class StrategyManager:
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client
        self.active_bots = {}
        self.connectors = {
            'testnet': ccxtpro.binance({'options': {'defaultType': 'spot'}}),
            'production': ccxtpro.binance({'options': {'defaultType': 'spot'}})
        }
        self.connectors['testnet'].set_sandbox_mode(True)
        self.is_running = True

    # --- UTILIDADES DE PRECISIÓN ---
    def from_cents(self, cents: int) -> float:
        return float(cents) / 100.0

    def to_cents(self, price: float) -> int:
        return int(round(price * 100))

    # --- TIER B: SIGNAL ENGINE (Lógica) ---
    async def run_signal_engine(self):
        """Monitoriza mercados locales y genera señales en quant_signals."""
        logger.info("Signal Engine (Tier B) started.")
        while self.is_running:
            try:
                # 1. Obtener bots activos
                res = self.supabase.table("quant_bots").select("*, quant_strategies(*)").in_("status", ["active", "paper_trading"]).execute()
                bots = res.data

                for bot in bots:
                    await self.process_bot_logic(bot)
                
                await asyncio.sleep(30) # Ciclo de escaneo de señales
            except Exception as e:
                logger.error(f"Signal Engine Error: {e}")
                await asyncio.sleep(10)

    async def process_bot_logic(self, bot: dict):
        """Calcula indicadores usando la DB local y genera señales si aplica."""
        pair = bot['pair']
        env = 'testnet' if bot['status'] == 'paper_trading' or bot['status'] == 'active' else 'production'
        
        # 1. Traer historial local (Tier A -> Tier B)
        res = self.supabase.table("quant_market_history") \
            .select("*") \
            .eq("pair", pair) \
            .eq("environment", env) \
            .order("timestamp", desc=True) \
            .limit(100).execute()
        
        if len(res.data) < 20: return # Necesitamos datos mínimos

        # 2. Convertir a DataFrame y revertir Cents a Float para cálculos
        df = pd.DataFrame(res.data).sort_values('timestamp')
        for col in ['open', 'high', 'low', 'close']:
            df[col] = df[col].apply(self.from_cents)

        # 3. Calcular Indicadores (Ejemplo simplificado, aquí iría tu lógica de estrategia)
        df['sma20'] = df['close'].rolling(20).mean()
        last_price = df['close'].iloc[-1]
        last_sma = df['sma20'].iloc[-1]
        
        # 4. Lógica de Disparo (Solo si no hay posición abierta)
        if bot['current_entry_price'] == 0:
            if last_price > last_sma: # Ejemplo: Cruce alcista
                await self.generate_signal(bot, 'BUY', last_price, {"reason": "SMA_CROSS_UP", "sma": last_sma})
        else:
            # Lógica de salida (TP/SL)
            # Tier B detecta la intención de salida, Tier C la ejecuta
            if last_price >= bot['last_exit_targets'].get('tp_price', 999999):
                await self.generate_signal(bot, 'EXIT', last_price, {"reason": "TARGET_TP_REACHED"})

    async def generate_signal(self, bot: dict, side: str, price: float, metadata: dict):
        """Inserta señal en la tabla desacoplada."""
        payload = {
            "tenant_id": bot['tenant_id'],
            "bot_id": bot['id'],
            "pair": bot['pair'],
            "side": side,
            "price": self.to_cents(price),
            "environment": 'testnet' if bot['status'] == 'paper_trading' or bot['status'] == 'active' else 'production',
            "status": "PENDING",
            "metadata": metadata
        }
        self.supabase.table("quant_signals").insert(payload).execute()
        logger.info(f"SIGNAL GENERATED | {bot['pair']} | {side} @ ${price}")

    # --- TIER C: EXECUTION MANAGER (Acción) ---
    async def run_execution_manager(self):
        """Escucha señales PENDING y las ejecuta en el exchange."""
        logger.info("Execution Manager (Tier C) started.")
        while self.is_running:
            try:
                # 1. Buscar señales pendientes
                res = self.supabase.table("quant_signals").select("*").eq("status", "PENDING").execute()
                signals = res.data

                for sig in signals:
                    await self.execute_trade(sig)
                
                await asyncio.sleep(5) # Alta frecuencia de ejecución
            except Exception as e:
                logger.error(f"Execution Manager Error: {e}")
                await asyncio.sleep(5)

    async def execute_trade(self, signal: dict):
        """Habla con Binance y actualiza el estado del bot."""
        bot_id = signal['bot_id']
        pair = signal['pair']
        side = signal['side']
        price = self.from_cents(signal['price'])
        
        logger.info(f"EXECUTING ORDER | {pair} | {side} @ ${price}")
        
        try:
            # Aquí iría la llamada real: await self.connectors['testnet'].create_order(...)
            # Por ahora simulamos éxito inmediato
            
            # 1. Marcar señal como ejecutada
            self.supabase.table("quant_signals").update({"status": "EXECUTED"}).eq("id", signal['id']).execute()
            
            # 2. Actualizar Bot (Entrada o Salida)
            update_payload = {
                "current_entry_price": signal['price'] if side == 'BUY' else 0,
                "current_action": f"In Position ({pair})" if side == 'BUY' else "Scanning Market",
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            self.supabase.table("quant_bots").update(update_payload).eq("id", bot_id).execute()
            
            logger.info(f"ORDER SUCCESS | Bot {bot_id} updated.")
        except Exception as e:
            logger.error(f"Execution Failed for signal {signal['id']}: {e}")
            self.supabase.table("quant_signals").update({"status": "REJECTED"}).eq("id", signal['id']).execute()

    async def run(self):
        """Lanza ambos motores en paralelo."""
        await asyncio.gather(
            self.run_signal_engine(),
            self.run_execution_manager()
        )
