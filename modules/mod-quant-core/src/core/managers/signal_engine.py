import asyncio
import pandas as pd
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from loguru import logger
from supabase import Client

class SignalEngine:
    """
    Tier B: Motor de Generación de Señales.
    Analiza el mercado y decide las entradas basándose en las estrategias.
    Resiliente a cortes de conexión HTTP/2 y soporte Multi-Timeframe.
    """
    def __init__(self, supabase: Client, risk_manager, logic_engines, audit_manager):
        self.supabase = supabase
        self.risk = risk_manager
        self.logic_engines = logic_engines
        self.audit = audit_manager
        self.is_running = True

    async def _safe_db_query(self, func, *args, **kwargs):
        """Ejecutor seguro de queries con reintento para fallos de red/conexión."""
        max_retries = 3
        for attempt in range(max_retries):
            try:
                return func(*args, **kwargs).execute()
            except Exception as e:
                if attempt < max_retries - 1:
                    wait_time = (attempt + 1) * 2
                    logger.warning(f"SIGNAL_DB_RETRY | Attempt {attempt+1}: {e}. Retrying in {wait_time}s...")
                    await asyncio.sleep(wait_time)
                else: raise e

    async def process_bot_logic(self, bot: Dict[str, Any]):
        """Evaluación profunda de entrada para un bot con soporte Multi-Timeframe."""
        # --- FILTRO DE SEGURIDAD (V3.2) ---
        # No procesamos el bot de sistema ni pares que no sean activos de trading.
        if bot.get('pair') == 'SYSTEM' or bot.get('id') == '00000000-0000-0000-0000-000000000000':
            return

        start_time = datetime.now(timezone.utc)
        pair = bot['pair']
        env = 'production'
        timeframes = ['1m', '5m', '15m', '1h']
        
        try:
            # 1. Resolver motor de estrategia
            strat_info = bot.get('quant_strategies', {})
            if isinstance(strat_info, list): strat_info = strat_info[0]
            engine = self.logic_engines.get(strat_info.get('core_id', 'default'))
            # 2. Obtener historial de mercado Multi-Timeframe en paralelo
            tf_data = {}
            for tf in timeframes:
                res = await self._safe_db_query(
                    self.supabase.table("quant_market_history").select("*")
                    .eq("pair", pair).eq("environment", env).eq("timeframe", tf)
                    .order("timestamp", desc=True).limit, 250
                )

                # Umbral dinámico: 1m necesita más datos para indicadores reactivos.
                # 1h/15m solo necesitan suficiente para una media móvil simple.
                min_required = 50 if tf == '1m' else 20

                if len(res.data) < min_required: 
                    logger.warning(f"Insufficent data for {pair} in {tf} ({len(res.data)}/{min_required} candles). Skipping.")
                    return

                df = pd.DataFrame(res.data).sort_values('timestamp')

                for col in ['open', 'high', 'low', 'close']:
                    df[col] = df[col].apply(self.risk.from_cents)
                tf_data[tf] = df

            # 3. Análisis de Indicadores
            df_main = tf_data['1m']
            df_main = engine.analyze(df_main)
            
            last_row, prev_row = df_main.iloc[-1], df_main.iloc[-2]
            current_price = last_row['close']

            # 4. Telemetría y Proximidad
            snapshot = engine.get_snapshot(last_row, df_main)
            sentiment = engine.get_sentiment(last_row)
            proximity = engine.get_proximity(last_row)
            
            # Inyectar indicadores de tendencia mayor en el snapshot para la UI
            # --- V3 UPGRADE: SMA200 en 15m como Tendencia Institucional ---
            df_15 = tf_data['15m']
            ma200_15 = df_15['close'].rolling(200).mean().iloc[-1]
            price_15 = df_15['close'].iloc[-1]
            
            snapshot["multi_tf"] = {
                "tf_5m_bias": "BULLISH" if tf_data['5m']['close'].iloc[-1] > tf_data['5m']['close'].rolling(20).mean().iloc[-1] else "BEARISH",
                "tf_15m_trend": "BULLISH" if price_15 > ma200_15 else "BEARISH",
                "tf_1h_bias": "BULLISH" if tf_data['1h']['close'].iloc[-1] > tf_data['1h']['close'].rolling(20).mean().iloc[-1] else "BEARISH"
            }
            
            # 4. Payload de Telemetría
            update_payload = {
                "last_price": self.risk.to_cents(current_price),
                "last_sma": self.risk.to_cents(last_row.get('sma20', 0)),
                "last_atr": self.risk.to_cents(last_row.get('atr', 0)),
                "last_sentiment": sentiment,
                "signal_strength": proximity.get('score', 0),
                "price_history_1h": df_main['close'].tail(30).tolist(),
                "last_metrics_update": datetime.now(timezone.utc).isoformat()
            }

            snapshot.update({
                "confluence": proximity.get('checks', {}), 
                "node_latency": int((datetime.now(timezone.utc) - start_time).total_seconds() * 1000)
            })
            update_payload["last_logic_snapshot"] = snapshot

            # 5. Persistir telemetría
            await self._safe_db_query(self.supabase.table("quant_bots").update(update_payload).eq, "id", bot['id'])

            # --- LOG DE TELEMETRÍA ---
            rsi = snapshot.get('rsi', 0)
            vol_status = snapshot.get('vol_status') or snapshot.get('volume_status', 'N/A')
            bias = snapshot.get('bias') or snapshot.get('market_bias') or snapshot.get('trend_bias', 'N/A')
            prox_side = proximity.get('side', 'N/A')
            logger.info(f"EVALUATING | Bot: {bot['id'][:8]} | {pair} @ ${current_price:.2f} | Prox: {proximity['score']}% ({prox_side}) | rsi: {rsi:.2f} | vol: {vol_status} | bias: {bias}")

            # 6. Disparo de Señal de Entrada
            if bot.get('current_entry_price', 0) == 0:
                # --- PROTECCIÓN ANTI-CHURN (COOLDOWN) ---
                last_lifecycle_event = bot.get('current_position_opened_at')
                if last_lifecycle_event:
                    last_event_time = pd.to_datetime(last_lifecycle_event).tz_convert('UTC')
                    diff_seconds = (datetime.now(timezone.utc) - last_event_time).total_seconds()
                    if diff_seconds < 300:
                        logger.info(f"COOLDOWN | Bot: {bot['id'][:8]} | Resting after EXIT ({int(300 - diff_seconds)}s remaining)")
                        return

                # Pasamos tf_data (Multi-Timeframe Context) a la estrategia
                signal_data = engine.check_signal(last_row, prev_row, tf_data=tf_data)
                
                if signal_data:
                    # --- INDUSTRIAL SIGNAL AUDIT (The Profitability Guard) ---
                    atr = float(last_row.get('atr', 0))
                    atr_pct = (atr / current_price) * 100 if current_price > 0 else 0
                    min_volatility_req = engine.get_min_volatility()
                    
                    if atr_pct < min_volatility_req:
                        reason_msg = f"Low Volatility (ATR {atr_pct:.2f}% < {min_volatility_req}% req.)"
                        logger.warning(f"SIGNAL SUPPRESSED | Bot: {bot['id'][:8]} | Reason: {reason_msg}")
                        
                        # --- AUDITORÍA DE SEÑAL SUPRIMIDA (V3.2) ---
                        # Registramos el evento para análisis de "missed opportunities"
                        asyncio.create_task(self.audit.log_event(
                            bot_id=bot['id'],
                            event_type="SIGNAL_SUPPRESSED",
                            pair=pair,
                            price_cents=self.risk.to_cents(current_price),
                            side=signal_data['side'].upper(),
                            snapshot={**snapshot, "suppression_reason": reason_msg}
                        ))
                        return

                    # --- V3.1 PROFIT BOOST CALCULATION ---
                    # Calculamos confluencia total para decidir agresividad
                    confluence_score = 1.0
                    bias_15m = snapshot.get("multi_tf", {}).get("tf_15m_trend")
                    bias_1h = snapshot.get("multi_tf", {}).get("tf_1h_bias")
                    
                    # Si el sesgo de 15m y 1h coincide con el trade, aumentamos agresividad
                    side_upper = signal_data['side'].upper()
                    is_bullish_trade = side_upper in ["BUY", "LONG"]
                    
                    matches = 0
                    if is_bullish_trade:
                        if bias_15m == "BULLISH": matches += 1
                        if bias_1h == "BULLISH": matches += 1
                    else:
                        if bias_15m == "BEARISH": matches += 1
                        if bias_1h == "BEARISH": matches += 1
                    
                    # Multiplicador: 1.0 (Normal), 1.5 (Fuerte), 2.0 (Super-Tendencia)
                    confluence_score = 1.0 + (matches * 0.5)
                    snapshot["trend_strength"] = confluence_score

                    await self.generate_signal(bot, side_upper, current_price, {"reason": signal_data['reason'], "snapshot": snapshot, "profit_boost": confluence_score})
                else:
                    logger.info(f"NO_SIGNAL | Bot: {bot['id'][:8]} | Strategy: {strat_info.get('core_id')} | Technical criteria not met.")

        except Exception as e:
            logger.error(f"SignalEngine Error for bot {bot['id'][:8]}: {e}")

    async def generate_signal(self, bot: dict, side: str, price: float, metadata: dict):
        """Genera la intención de trade en quant_signals."""
        payload = {
            "bot_id": bot['id'],
            "tenant_id": bot.get('tenant_id', '00000000-0000-0000-0000-000000000000'),
            "pair": bot['pair'],
            "side": side,
            "price": self.risk.to_cents(price),
            "status": "PENDING",
            "environment": 'testnet' if bot['status'] in ['paper_trading', 'active'] else 'production',
            "metadata": metadata
        }
        self.supabase.table("quant_signals").insert(payload).execute()
        logger.success(f"SIGNAL GENERATED | {bot['pair']} | {side} @ ${price}")

    async def run(self):
        logger.info("Signal Engine (Tier B) running at 30s interval.")
        while self.is_running:
            try:
                res = self.supabase.table("quant_bots").select("*, quant_strategies(*)").in_("status", ["active", "paper_trading"]).execute()
                if res.data:
                    await asyncio.gather(*[self.process_bot_logic(bot) for bot in res.data])
                await asyncio.sleep(30)
            except Exception as e:
                logger.error(f"Signal Engine Loop Error: {e}")
                await asyncio.sleep(10)
