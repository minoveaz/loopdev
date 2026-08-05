
import asyncio
from trades_report import supabase, from_cents
import pandas as pd
from datetime import datetime, timedelta

async def deep_analyze_losses():
    # 1. Traer eventos EXIT con PNL negativo
    res = supabase.table("quant_audit_logs")\
        .select("*, quant_bots(pair, base_investment_usdt)")\
        .eq("event_type", "EXIT")\
        .lt("pnl_pct", 0)\
        .order("created_at", desc=True)\
        .limit(10)\
        .execute()
    
    analysis_report = []

    for exit_ev in res.data:
        bot_id = exit_ev['bot_id']
        exit_time = exit_ev['created_at']
        pnl_pct = exit_ev['pnl_pct']
        pair = exit_ev.get('quant_bots', {}).get('pair', 'N/A')
        
        # 2. Buscar la señal que generó este EXIT
        # La señal debería tener un created_at muy cercano al audit log
        res_sig = supabase.table("quant_signals")\
            .select("signal_type, metadata")\
            .eq("bot_id", bot_id)\
            .eq("side", "EXIT")\
            .gte("created_at", (pd.to_datetime(exit_time) - timedelta(seconds=10)).isoformat())\
            .lte("created_at", exit_time)\
            .execute()
        
        sig_type = res_sig.data[0]['signal_type'] if res_sig.data else "UNKNOWN"
        sig_meta = res_sig.data[0]['metadata'] if res_sig.data else {}

        # 3. Buscar el ENTRY
        res_entry = supabase.table("quant_audit_logs")\
            .select("*")\
            .eq("bot_id", bot_id)\
            .eq("event_type", "ENTRY")\
            .lt("created_at", exit_time)\
            .order("created_at", desc=True)\
            .limit(1)\
            .execute()
        
        entry_price = from_cents(res_entry.data[0]['price']) if res_entry.data else 0
        
        analysis_report.append({
            "pair": pair,
            "exit_time": exit_time,
            "pnl": pnl_pct,
            "type": sig_type,
            "meta": sig_meta,
            "entry_price": entry_price
        })

    print("DEEP_ANALYSIS_START")
    for r in analysis_report:
        print(f"TIME: {r['exit_time']} | {r['pair']} | PNL: {r['pnl']}% | TYPE: {r['type']} | META: {r['meta']}")
    print("DEEP_ANALYSIS_END")

if __name__ == "__main__":
    asyncio.run(deep_analyze_losses())
