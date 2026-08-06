
import asyncio
from trades_report import supabase, from_cents
from datetime import datetime, timezone

async def check_open_and_latest():
    # 1. Ver posiciones abiertas en quant_bots
    bots_res = supabase.table("quant_bots").select("id, pair, current_entry_price, status").gt("current_entry_price", 0).execute()
    
    # 2. Ver los últimos 10 eventos de auditoría (sin importar si son EXIT o ENTRY)
    audit_res = supabase.table("quant_audit_logs")\
        .select("*, quant_bots(pair)")\
        .order("created_at", desc=True)\
        .limit(10)\
        .execute()

    print("--- POSICIONES ABIERTAS ACTUALMENTE ---")
    if not bots_res.data:
        print("No hay posiciones abiertas.")
    for b in bots_res.data:
        print(f"BOT_ID: {b['id']} | PAR: {b['pair']} | ENTRADA: {from_cents(b['current_entry_price'])} | STATUS: {b['status']}")

    print("\n--- ÚLTIMOS 10 EVENTOS DE AUDITORÍA ---")
    for a in audit_res.data:
        pair = a.get('quant_bots', {}).get('pair', 'N/A')
        price = from_cents(a['price'])
        print(f"{a['created_at']} | {a['event_type']:<6} | {pair:<10} | {price:>10.2f} | PNL: {a.get('pnl_pct', 'N/A')}%")

if __name__ == "__main__":
    asyncio.run(check_open_and_latest())
