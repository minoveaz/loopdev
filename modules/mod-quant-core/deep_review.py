
import asyncio
from trades_report import supabase, from_cents
from datetime import datetime, timezone

async def detailed_review():
    # 1. Audit Logs
    res_audit = supabase.table("quant_audit_logs")\
        .select("*, quant_bots(pair)")\
        .gt("created_at", "2026-04-21T21:00:00")\
        .order("created_at")\
        .execute()
    
    # 2. Signals
    res_signals = supabase.table("quant_signals")\
        .select("*")\
        .gt("created_at", "2026-04-21T21:00:00")\
        .order("created_at")\
        .execute()

    # 3. Orders
    res_orders = supabase.table("quant_orders")\
        .select("*")\
        .gt("created_at", "2026-04-21T21:00:00")\
        .order("created_at")\
        .execute()

    print("--- DETALLE DE EVENTOS (AUDIT LOGS) ---")
    for a in res_audit.data:
        pair = a.get('quant_bots', {}).get('pair', 'N/A')
        print(f"{a['created_at']} | {a['event_type']:<15} | {pair:<10} | Precio: {from_cents(a['price']):>10.2f} | PNL: {a.get('pnl_pct', 'N/A')}")

    print("\n--- SEÑALES GENERADAS (SIGNALS) ---")
    for s in res_signals.data:
        # Usamos .get para evitar KeyErrors
        side = s.get('side', 'N/A')
        pair = s.get('pair', 'N/A')
        status = s.get('status', 'N/A')
        sig_type = s.get('signal_type', s.get('type', 'N/A'))
        print(f"{s['created_at']} | {side:<5} | {pair:<10} | STATUS: {status:<10} | TYPE: {sig_type}")

    print("\n--- ÓRDENES ENVIADAS (ORDERS) ---")
    for o in res_orders.data:
        side = o.get('side', 'N/A')
        pair = o.get('pair', 'N/A')
        price = from_cents(o.get('price', 0))
        status = o.get('status', 'N/A')
        print(f"{o['created_at']} | {side:<5} | {pair:<10} | PRICE: {price:>10.2f} | STATUS: {status}")

if __name__ == "__main__":
    asyncio.run(detailed_review())
