import asyncio
import pandas as pd
from datetime import datetime, timezone
from typing import Dict, Optional
from supabase import Client
import ccxt.pro as ccxtpro
from loguru import logger

# Importación de Estrategias Estandarizadas
from src.strategies.baseline.rsi_mean_reversion import RSIMeanReversionStrategy
from src.strategies.baseline.intraday_atr import IntradayATRStrategy
from src.strategies.baseline.hybrid_core import HybridCoreStrategy
from src.strategies.baseline.aggressive_rsi import AggressiveRSIStrategy
from src.strategies.baseline.hf_scalper import HighFrequencyScalperStrategy

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
        
        # Registro interno de instancias de lógica (Actualizado para incluir todas)
        self.logic_engines = {
            "rsi-mean-rev-v1": RSIMeanReversionStrategy(),
            "atr-breakout-v1": IntradayATRStrategy(),
            "hybrid-core-v1": HybridCoreStrategy(),
            "aggressive-rsi-v1": AggressiveRSIStrategy(),
            "hf-scalper-v1": HighFrequencyScalperStrategy(),
            # Fallback
            "default": RSIMeanReversionStrategy()
        }

    # --- UTILIDADES DE PRECISIÓN ---
    def from_cents(self, cents: Optional[int]) -> float:
        if cents is None: return 0.0
        try:
            return float(cents) / 100.0
        except (TypeError, ValueError):
            return 0.0

    def to_cents(self, price: Optional[float]) -> int:
        if price is None: return 0
        try:
            return int(round(float(price) * 100))
        except (TypeError, ValueError):
            return 0

    # --- TIER B: SIGNAL ENGINE (Lógica) ---
    async def run_signal_engine(self):
        """Monitoriza mercados locales y genera señales en paralelo."""
        logger.info("Signal Engine (Tier B) started with Parallel Execution.")
        while self.is_running:
            try:
                res = self.supabase.table("quant_bots").select("*, quant_strategies(*)").in_("status", ["active", "paper_trading"]).execute()
                bots = res.data
                
                if len(bots) > 0:
                    logger.info(f"SIGNAL ENGINE | Evaluating {len(bots)} bots in parallel...")
                    # Crear tareas para todos los bots y ejecutarlas simultáneamente
                    tasks = [self.process_bot_logic(bot) for bot in bots]
                    await asyncio.gather(*tasks)
                else:
                    logger.debug("SIGNAL ENGINE | No active bots found.")
                
                await asyncio.sleep(30)
            except Exception as e:
                logger.error(f"Signal Engine Error: {e}")
                await asyncio.sleep(10)

    async def process_bot_logic(self, bot: dict):
        """Calcula indicadores usando la DB local y genera señales si aplica."""
        start_process_time = datetime.now(timezone.utc)
        pair = bot['pair']
        env = 'testnet' if bot['status'] in ['paper_trading', 'active'] else 'production'
        
        # Resolver ID semántico desde el JOIN con quant_strategies (usando core_id)
        strat_info = bot.get('quant_strategies', {})
        if isinstance(strat_info, list) and len(strat_info) > 0:
            strat_info = strat_info[0]
            
        # El campo real es core_id (ej: 'atr-breakout-v1')
        semantic_id = strat_info.get('core_id', bot['strategy_id'])
        
        # 1. Resolver el motor de lógica
        engine = self.logic_engines.get(semantic_id)
        if not engine:
            logger.warning(f"STRATEGY NOT FOUND | Bot: {bot['id'][:8]} | ID: '{semantic_id}' | Falling back to default.")
            engine = self.logic_engines["default"]
        
        # 2. Traer historial local (Tier A -> Tier B)
        res = self.supabase.table("quant_market_history") \
            .select("*") \
            .eq("pair", pair) \
            .eq("environment", env) \
            .order("timestamp", desc=True) \
            .limit(100).execute()
        
        if len(res.data) < 20: 
            logger.warning(f"INSUFFICIENT DATA | Bot: {bot['id'][:8]} | {pair} | Needs 20+ candles, got {len(res.data)}")
            return 

        # 3. Convertir a DataFrame y revertir Cents a Float para cálculos
        df = pd.DataFrame(res.data).sort_values('timestamp')
        for col in ['open', 'high', 'low', 'close']:
            df[col] = df[col].apply(self.from_cents)

        # 4. EJECUTAR LÓGICA DE LA ESTRATEGIA REAL
        df = engine.analyze(df)
        last_row = df.iloc[-1]
        prev_row = df.iloc[-2]
        current_price = last_row['close']
        
        # Snapshot técnico NATIVO de la estrategia (Diferenciación real)
        snapshot = engine.get_snapshot(last_row, df)
        sentiment = engine.get_sentiment(last_row)
        proximity_data = engine.get_proximity(last_row)
        trigger_price = engine.get_trigger_price(last_row)
        
        # Extraer score y checks
        proximity_score = proximity_data.get("score", 0)
        confluence_checks = proximity_data.get("checks", {})

        # 4.5 Cálculo de Latencia de Procesamiento (Tier B Internal)
        end_process_time = datetime.now(timezone.utc)
        process_latency = int((end_process_time - start_process_time).total_seconds() * 1000)

        # Inyectar datos en el snapshot para la UI
        snapshot["confluence"] = confluence_checks
        snapshot["trigger_price"] = trigger_price
        snapshot["node_latency"] = process_latency

        # Log de Evaluación (Visibilidad para el usuario)
        metrics_str = " | ".join([f"{k}: {v}" for k, v in snapshot.items() if k not in ['confluence', 'trigger_price', 'node_latency']])
        logger.info(f"EVALUATING | Bot: {bot['id'][:8]} | {pair} @ ${current_price:.2f} | Lat: {process_latency}ms | Prox: {proximity_score}% | {metrics_str}")


        # 5. Actualizar Telemetría del Bot en la DB (Usando CENTS)
        # Extraer historial de precios para el Sparkline (últimos 30)
        price_history = df['close'].tail(30).tolist()

        update_payload = {
            "last_price": self.to_cents(current_price),
            "last_sentiment": sentiment,
            "signal_strength": proximity_score,
            "last_logic_snapshot": snapshot,
            "price_history_1h": price_history,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }

        # --- REAL-TIME PnL & TRAILING STOP CALCULATION (Audit Fix) ---
        entry_price_raw = bot.get('current_entry_price')
        if entry_price_raw and entry_price_raw > 0:
            entry_price = self.from_cents(entry_price_raw)
            pnl_pct = ((current_price / entry_price) - 1) * 100
            investment = float(bot.get('base_investment_usdt') or 100)
            pnl_usdt = (pnl_pct / 100) * investment
            
            update_payload["current_pnl_pct"] = round(pnl_pct, 2)
            update_payload["current_pnl_usdt"] = self.to_cents(pnl_usdt)

            # --- TRAILING STOP LOGIC ---
            current_max = self.from_cents(bot.get('current_position_max_price') or 0)
            # 1. Actualizar el pico máximo si el precio actual es mayor
            if current_price > current_max:
                current_max = current_price
                update_payload["current_position_max_price"] = self.to_cents(current_max)
                logger.info(f"NEW PEAK REACHED | Bot: {bot['id'][:8]} | Max: ${current_max:.2f}")

            # 2. Lógica de Trailing Stop
            # Leer distancia configurada (Default 1.0%)
            dist_pct = float(bot.get('trailing_stop_distance') or 1.0)
            
            # Umbral de Activación: 0.8% si es automático, o inmediato si es una distancia pequeña (Manual)
            # Para Scalping (1m), 0.8% es un profit sólido para empezar a trailear.
            activation_threshold = 0.8 if dist_pct >= 1.0 else 0.1 

            if pnl_pct > activation_threshold:
                # El SL se sitúa a la distancia configurada del máximo
                trailing_sl = current_max * (1 - (dist_pct / 100))
                old_sl = self.from_cents(bot['last_exit_targets'].get('sl_price', 0))
                
                # Solo subir el SL, nunca bajarlo
                if trailing_sl > old_sl:
                    new_targets = bot.get('last_exit_targets', {})
                    new_targets['sl_price'] = self.to_cents(trailing_sl)
                    update_payload["last_exit_targets"] = new_targets
                    update_payload["current_action"] = f"Trailing Active ({dist_pct}%)"
                    logger.success(f"TRAILING SL UPDATED | Bot: {bot['id'][:8]} | New SL: ${trailing_sl:.2f} | Dist: {dist_pct}%")
        else:
            update_payload["current_pnl_pct"] = 0
            update_payload["current_pnl_usdt"] = 0
            update_payload["current_position_max_price"] = 0

        self.supabase.table("quant_bots").update(update_payload).eq("id", bot['id']).execute()

        # 6. Lógica de Disparo (Solo si no hay posición abierta)
        if bot['current_entry_price'] == 0:
            signal = engine.check_signal(last_row, prev_row)
            if signal and signal['side'] == 'buy':
                await self.generate_signal(bot, 'BUY', current_price, {"reason": signal['reason'], "snapshot": snapshot})
        else:
            # Lógica de salida (TP/SL)
            tp_price = self.from_cents(bot['last_exit_targets'].get('tp_price', 99999999))
            sl_price = self.from_cents(bot['last_exit_targets'].get('sl_price', 0))
            
            if current_price >= tp_price:
                await self.generate_signal(bot, 'EXIT', current_price, {"reason": "TARGET_TP_REACHED"})
            elif current_price <= sl_price:
                await self.generate_signal(bot, 'EXIT', current_price, {"reason": "HARD_STOP_LOSS_HIT"})

    async def generate_signal(self, bot: dict, side: str, price: float, metadata: dict):
        payload = {
            "tenant_id": bot['tenant_id'],
            "bot_id": bot['id'],
            "pair": bot['pair'],
            "side": side,
            "price": self.to_cents(price),
            "environment": 'testnet' if bot['status'] in ['paper_trading', 'active'] else 'production',
            "status": "PENDING",
            "metadata": metadata
        }
        self.supabase.table("quant_signals").insert(payload).execute()
        logger.success(f"SIGNAL GENERATED | {bot['pair']} | {side} @ ${price}")

    # --- TIER C: EXECUTION MANAGER ---
    async def run_execution_manager(self):
        logger.info("Execution Manager (Tier C) started.")
        while self.is_running:
            try:
                res = self.supabase.table("quant_signals").select("*").eq("status", "PENDING").execute()
                signals = res.data
                for sig in signals:
                    await self.execute_trade(sig)
                await asyncio.sleep(5)
            except Exception as e:
                logger.error(f"Execution Manager Error: {e}")
                await asyncio.sleep(5)

    async def execute_trade(self, signal: dict):
        bot_id = signal['bot_id']
        pair = signal['pair']
        side = signal['side']
        price = self.from_cents(signal['price'])
        masked_bot_id = f"{bot_id[:4]}...{bot_id[-4:]}"
        logger.info(f"EXECUTING ORDER | {pair} | {side} @ ${price} | Bot: {masked_bot_id}")
        
        try:
            # 1. Marcar señal como ejecutada
            self.supabase.table("quant_signals").update({"status": "EXECUTED"}).eq("id", signal['id']).execute()
            
            # 2. Preparar actualización del Bot
            update_payload = {
                "current_entry_price": signal['price'] if side == 'BUY' else 0,
                "current_action": f"In Position ({pair})" if side == 'BUY' else "Scanning Market",
                "current_position_opened_at": datetime.now(timezone.utc).isoformat() if side == 'BUY' else None,
                "current_position_max_price": signal['price'] if side == 'BUY' else 0,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }

            # 3. Si es salida (EXIT/SELL), calcular estadísticas de sesión
            if side != 'BUY':
                # Obtener estado actual del bot para acumular
                res = self.supabase.table("quant_bots").select("total_trades, winning_trades, losing_trades, avg_pnl_pct, current_pnl_pct").eq("id", bot_id).execute()
                if res.data:
                    old_stats = res.data[0]
                    final_pnl = float(old_stats.get('current_pnl_pct') or 0)
                    
                    new_total = int(old_stats.get('total_trades') or 0) + 1
                    is_win = final_pnl > 0
                    new_wins = int(old_stats.get('winning_trades') or 0) + (1 if is_win else 0)
                    new_losses = int(old_stats.get('losing_trades') or 0) + (0 if is_win else 1)
                    
                    # Calcular nuevo promedio móvil de PnL (Harden against None)
                    old_avg = float(old_stats.get('avg_pnl_pct') or 0)
                    new_avg = ((old_avg * (new_total - 1)) + final_pnl) / new_total
                    
                    update_payload.update({
                        "total_trades": new_total,
                        "winning_trades": new_wins,
                        "losing_trades": new_losses,
                        "avg_pnl_pct": round(new_avg, 2),
                        "current_pnl_pct": 0,
                        "current_pnl_usdt": 0
                    })
                    logger.success(f"SESSION STATS UPDATED | Bot: {masked_bot_id} | Result: {final_pnl}% | New Avg: {new_avg:.2f}%")

            # 4. Si es compra, calcular objetivos dinámicos (TP/SL)
            if side == 'BUY':
                # Necesitamos el bot para saber la estrategia
                res = self.supabase.table("quant_bots").select("*, quant_strategies(core_id)").eq("id", bot_id).execute()
                if res.data:
                    bot = res.data[0]
                    strat_info = bot.get('quant_strategies', {})
                    if isinstance(strat_info, list) and len(strat_info) > 0: strat_info = strat_info[0]
                    semantic_id = strat_info.get('core_id', 'default')
                    
                    engine = self.logic_engines.get(semantic_id, self.logic_engines["default"])
                    
                    # Calcular TP y SL (Harden against None in last_atr)
                    last_atr = self.from_cents(bot.get('last_atr')) or (price * 0.02) # Fallback 2%
                    
                    tp_price = engine.get_exit_price(price, last_atr, 'buy')
                    sl_price = price - (tp_price - price) # Simétrico por ahora si no hay método SL
                    
                    update_payload["last_exit_targets"] = {
                        "tp_price": self.to_cents(tp_price),
                        "sl_price": self.to_cents(sl_price),
                        "be_price": self.to_cents(price * 1.002) # Entry + 0.2% fee approx
                    }
                    logger.info(f"EXIT TARGETS SET | Bot: {masked_bot_id} | TP: ${tp_price:.2f} | SL: ${sl_price:.2f}")

            # 4. Actualizar Bot
            self.supabase.table("quant_bots").update(update_payload).eq("id", bot_id).execute()
            logger.success(f"ORDER SUCCESS | Bot {masked_bot_id} updated.")
        except Exception as e:
            logger.error(f"Execution Failed for signal {signal['id']}: {e}")
            self.supabase.table("quant_signals").update({"status": "REJECTED"}).eq("id", signal['id']).execute()

    # --- TIER D: COMMAND LISTENER (Reactividad Manual) ---
    async def run_command_listener(self):
        """Escucha comandos manuales desde el bus 'pending_command'."""
        logger.info("Command Listener (Tier D) active. Waiting for UI instructions.")
        while self.is_running:
            try:
                # 1. Buscar bots con comandos pendientes o pausados en posición
                res = self.supabase.table("quant_bots").select("*") \
                    .or_("pending_command.neq.null,status.eq.paused") \
                    .gt("current_entry_price", 0).execute()
                
                bots_to_process = res.data
                
                for bot in bots_to_process:
                    cmd = bot.get('pending_command')
                    bot_id = bot['id']
                    masked_id = bot_id[:8]
                    
                    # Caso A: Cierre de Emergencia (Pausado o Exit manual)
                    if bot['status'] == 'paused' or cmd in ['MARKET_EXIT', 'TP_NOW']:
                        reason = "MANUAL_INTERVENTION" if bot['status'] == 'paused' else f"UI_COMMAND_{cmd}"
                        logger.warning(f"EXECUTING MANUAL EXIT | Bot: {masked_id} | Reason: {reason}")
                        
                        hist = self.supabase.table("quant_market_history").select("close").eq("pair", bot['pair']).order("timestamp", desc=True).limit(1).execute()
                        if hist.data:
                            current_price = self.from_cents(hist.data[0]['close'])
                            await self.generate_signal(bot, 'EXIT', current_price, {"reason": reason})
                            # Resetear comando y asegurar que el bot sepa que está saliendo
                            self.supabase.table("quant_bots").update({"pending_command": None, "current_action": "Manual Exit in Progress..."}).eq("id", bot_id).execute()

                    # Caso B: Mover a Break-Even
                    elif cmd == 'MOVE_TO_BE':
                        logger.info(f"EXECUTING COMMAND | Bot: {masked_id} | Command: MOVE_TO_BE")
                        entry_price = self.from_cents(bot['current_entry_price'])
                        be_price = entry_price * 1.002 # Entry + 0.2% RT Fee
                        
                        new_targets = bot.get('last_exit_targets', {})
                        new_targets['sl_price'] = self.to_cents(be_price)
                        
                        self.supabase.table("quant_bots").update({
                            "last_exit_targets": new_targets,
                            "pending_command": None,
                            "current_action": "SL Adjusted to Break-Even"
                        }).eq("id", bot_id).execute()
                        logger.success(f"BREAK-EVEN SET | Bot: {masked_id} @ ${be_price:.2f}")

                    # Caso C: Ajustar Distancia de Trailing (Manual)
                    elif cmd and cmd.startswith('TRAIL_DISTANCE:'):
                        try:
                            new_dist = float(cmd.split(':')[1])
                            logger.info(f"EXECUTING COMMAND | Bot: {masked_id} | New Trail Dist: {new_dist}%")
                            
                            self.supabase.table("quant_bots").update({
                                "trailing_stop_distance": new_dist,
                                "pending_command": None,
                                "current_action": f"Trail Adjusted to {new_dist}%"
                            }).eq("id", bot_id).execute()
                            logger.success(f"TRAILING DISTANCE UPDATED | Bot: {masked_id} | Value: {new_dist}%")
                        except Exception as e:
                            logger.error(f"Failed to parse trail distance: {e}")
                            self.supabase.table("quant_bots").update({"pending_command": None}).eq("id", bot_id).execute()

                await asyncio.sleep(2) # Alta frecuencia: cada 2 segundos
            except Exception as e:
                logger.error(f"Command Listener Error: {e}")
                await asyncio.sleep(5)

    async def run(self):
        await asyncio.gather(
            self.run_signal_engine(),
            self.run_execution_manager(),
            self.run_command_listener()
        )
