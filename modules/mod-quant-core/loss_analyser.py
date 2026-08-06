
import asyncio
from trades_report import supabase, from_cents
import pandas as pd
from datetime import datetime, timedelta

async def analyze_losses():
    # 1. Traer todos los eventos EXIT con PNL negativo de los últimos 2 días
    res = supabase.table("quant_audit_logs")\
        .select("*, quant_bots(pair, base_investment_usdt)")\
        .eq("event_type", "EXIT")\
        .lt("pnl_pct", 0)\
        .order("created_at", desc=True)\
        .execute()
    
    exit_events = res.data
    analysis_report = []

    for exit_ev in exit_events:
        bot_id = exit_ev['bot_id']
        exit_time = exit_ev['created_at']
        exit_price = from_cents(exit_ev['price'])
        pnl_pct = exit_ev['pnl_pct']
        pair = exit_ev.get('quant_bots', {}).get('pair', 'N/A')
        
        # 2. Buscar el ENTRY previo para este bot
        res_entry = supabase.table("quant_audit_logs")\
            .select("*")\
            .eq("bot_id", bot_id)\
            .eq("event_type", "ENTRY")\
            .lt("created_at", exit_time)\
            .order("created_at", desc=True)\
            .limit(1)\
            .execute()
        
        if not res_entry.data:
            continue
            
        entry_ev = res_entry.data[0]
        entry_time = entry_ev['created_at']
        entry_price = from_cents(entry_ev['price'])
        
        # 3. Ver qué pasó en el mercado durante ese tiempo (OHLCV)
        # Traemos velas de 1m entre entry y exit
        res_hist = supabase.table("quant_market_history")\
            .select("high, low, close, timestamp")\
            .eq("pair", pair)\
            .eq("timeframe", "1m")\
            .gte("timestamp", entry_time)\
            .lte("timestamp", exit_time)\
            .order("timestamp")\
            .execute()
        
        history = res_hist.data
        if not history:
            max_drawdown = "N/A"
            volatility = "N/A"
        else:
            # Calcular Max Drawdown durante la operación
            closes = [h['close'] for h in history]
            # Como multiplicamos por 100 en la base de datos, dividimos para análisis
            closes = [c/100.0 for c in closes]
            lows = [h['low']/100.0 for h in history]
            
            min_price = min(lows)
            max_drawdown = ((min_price - entry_price) / entry_price) * 100
            
            # Volatilidad (rango High-Low promedio)
            ranges = [(h['high'] - h['low'])/100.0 for h in history]
            volatility = sum(ranges) / len(ranges) if ranges else 0

        analysis_report.append({
            "pair": pair,
            "entry_time": entry_time,
            "exit_time": exit_time,
            "entry_price": entry_price,
            "exit_price": exit_price,
            "pnl_pct": pnl_pct,
            "max_drawdown": max_drawdown,
            "avg_volatility_1m": volatility,
            "duration_mins": (pd.to_datetime(exit_time) - pd.to_datetime(entry_time)).total_seconds() / 60,
            "exit_reason": exit_ev.get('message', 'N/A')
        })

    print("LOSS_ANALYSIS_START")
    for r in analysis_report:
        print(f"PAIR: {r['pair']} | PNL: {r['pnl_pct']}% | DUR: {r['duration_mins']:.1f}m | MDD: {r['max_drawdown']:.2f}% | VOL: {r['avg_volatility_1m']:.2f} | REASON: {r['exit_reason']}")
    print("LOSS_ANALYSIS_END")

if __name__ == "__main__":
    asyncio.run(analyze_losses())
