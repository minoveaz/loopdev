
import asyncio
from trades_report import supabase, from_cents
from datetime import datetime, timedelta

async def check_recent_trades():
    two_days_ago = (datetime.now() - timedelta(days=2)).isoformat()
    res = supabase.table("quant_audit_logs")\
        .select("*, quant_bots(pair, base_investment_usdt)")\
        .gt("created_at", two_days_ago)\
        .order("created_at", desc=True)\
        .execute()
    
    events = res.data
    trades = []
    
    for i, event in enumerate(events):
        if event['event_type'] == 'EXIT':
            exit_price = from_cents(event['price'])
            exit_time = event['created_at']
            pnl_pct = float(event.get('pnl_pct', 0))
            bot_id = event['bot_id']
            pair = event.get('quant_bots', {}).get('pair', 'N/A')
            investment = float(event.get('quant_bots', {}).get('base_investment_usdt', 100))
            
            entry_price = 0.0
            for j in range(i + 1, len(events)):
                prev = events[j]
                if prev['bot_id'] == bot_id and prev['event_type'] == 'ENTRY':
                    entry_price = from_cents(prev['price'])
                    break
            
            if entry_price > 0:
                pnl_usdt = (investment * pnl_pct) / 100
                trades.append({
                    "pair": pair,
                    "exit_time": exit_time,
                    "pnl_pct": pnl_pct,
                    "pnl_usdt": pnl_usdt
                })

    print(f"REPORT_START")
    for t in trades:
        print(f"{t['exit_time']} | {t['pair']} | {t['pnl_pct']}% | {t['pnl_usdt']} USDT")
    print(f"REPORT_END")

if __name__ == "__main__":
    asyncio.run(check_recent_trades())
