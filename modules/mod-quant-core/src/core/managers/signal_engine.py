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
    """
    def __init__(self, supabase: Client, risk_manager, logic_engines):
        self.supabase = supabase
        self.risk = risk_manager
        self.logic_engines = logic_engines
        self.is_running = True

    async def process_bot_logic(self, bot: Dict[str, Any]):
        """Evaluación profunda de entrada para un bot."""
        start_time = datetime.now(timezone.utc)
        pair = bot['pair']
        env = 'testnet' if bot['status'] in ['paper_trading', 'active'] else 'production'
        
        try:
            # 1. Resolver motor de estrategia
            strat_info = bot.get('quant_strategies', {})
            if isinstance(strat_info, list): strat_info = strat_info[0]
            engine = self.logic_engines.get(strat_info.get('core_id', 'default'))

            # 2. Obtener historial de mercado (Aumentado a 250 para estabilidad SMA200/Wilder)
            res = self.supabase.table("quant_market_history").select("*").eq("pair", pair).eq("environment", env).order("timestamp", desc=True).limit(250).execute()
            if len(res.data) < 50: return

            df = pd.DataFrame(res.data).sort_values('timestamp')
            for col in ['open', 'high', 'low', 'close']:
                df[col] = df[col].apply(self.risk.from_cents)
            
            df = engine.analyze(df)
            last_row, prev_row = df.iloc[-1], df.iloc[-2]
            current_price = last_row['close']

            # 3. Telemetría y Proximidad
            snapshot = engine.get_snapshot(last_row, df)
            sentiment = engine.get_sentiment(last_row)
            proximity = engine.get_proximity(last_row)
            
            # 4. Payload de Telemetría (Real-time precision)
            update_payload = {
                "last_price": self.risk.to_cents(current_price),
                "last_sma": self.risk.to_cents(last_row.get('sma20', 0)),
                "last_atr": self.risk.to_cents(last_row.get('atr', 0)),
                "last_sentiment": sentiment,
                "signal_strength": proximity.get('score', 0),
                "price_history_1h": df['close'].tail(30).tolist(),
                "last_metrics_update": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }

            # Inyectar snapshot y latencia
            snapshot.update({
                "confluence": proximity.get('checks', {}), 
                "node_latency": int((datetime.now(timezone.utc) - start_time).total_seconds() * 1000)
            })
            update_payload["last_logic_snapshot"] = snapshot

            # 5. Persistir telemetría en DB
            self.supabase.table("quant_bots").update(update_payload).eq("id", bot['id']).execute()

            # --- LOG DE TELEMETRÍA (El Pulso) ---
            rsi = snapshot.get('rsi', 0)
            vol_status = snapshot.get('vol_status') or snapshot.get('volume_status', 'N/A')
            bias = snapshot.get('bias') or snapshot.get('market_bias') or snapshot.get('trend_bias', 'N/A')
            prox_side = proximity.get('side', 'N/A')
            logger.info(f"EVALUATING | Bot: {bot['id'][:8]} | {pair} @ ${current_price:.2f} | Prox: {proximity['score']}% ({prox_side}) | rsi: {rsi:.2f} | vol: {vol_status} | bias: {bias}")

            # 6. Disparo de Señal de Entrada (Solo si no hay posición)
            if bot.get('current_entry_price', 0) == 0:
                # --- PROTECCIÓN ANTI-CHURN: 5m COOLDOWN ---
                updated_at_str = bot.get('updated_at')
                if updated_at_str:
                    # Usamos pandas.to_datetime por su alta flexibilidad con formatos ISO en Python < 3.11
                    last_update = pd.to_datetime(updated_at_str).tz_convert('UTC')
                    diff_seconds = (datetime.now(timezone.utc) - last_update).total_seconds()
                    # Si el bot acaba de cerrar (hace menos de 300s / 5m), esperamos.
                    if diff_seconds < 300:
                        logger.info(f"COOLDOWN | Bot: {bot['id'][:8]} | Waiting {int(300 - diff_seconds)}s before next evaluation.")
                        return

                signal_data = engine.check_signal(last_row, prev_row)
                if signal_data:
                    await self.generate_signal(bot, signal_data['side'].upper(), current_price, {"reason": signal_data['reason'], "snapshot": snapshot})

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
