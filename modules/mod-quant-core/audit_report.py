
import json
from src.main import supabase
from datetime import datetime

def run_audit():
    print("🚀 INICIANDO AUDITORÍA PROFUNDA DE OPERACIONES RECIENTES\n")
    
    # 1. Obtener las últimas 10 órdenes
    try:
        orders_res = supabase.table('quant_orders').select('*, quant_bots(name)').order('created_at', desc=True).limit(10).execute()
        orders = orders_res.data
    except Exception as e:
        print(f"Error recuperando órdenes: {e}")
        return

    if not orders:
        print("No se encontraron órdenes recientes.")
        return

    print(f"{'FECHA':<25} | {'BOT':<15} | {'ACCIÓN':<10} | {'PRECIO':<10} | {'PNL %':<10}")
    print("-" * 80)
    
    for o in orders:
        date = o['created_at'][:19].replace('T', ' ')
        bot_name = o.get('quant_bots', {}).get('name', 'N/A')
        side = o['side']
        price = o['price'] / 100
        pnl = o.get('pnl_pct', 0)
        print(f"{date:<25} | {bot_name:<15} | {side:<10} | ${price:<9.2f} | {pnl:<10.2f}%")

    # 2. Obtener la Caja Negra (Audit Trail) para entender el contexto
    print("\n📜 DETALLE TÉCNICO DE LA CAJA NEGRA (AUDIT TRAIL)")
    print("-" * 80)
    
    try:
        # Traemos los últimos 15 eventos de auditoría
        audit_res = supabase.table('quant_audit_logs').select('*').order('created_at', desc=True).limit(15).execute()
        audit = audit_res.data
    except Exception as e:
        print(f"Error recuperando logs de auditoría: {e}")
        return

    for a in audit:
        date = a['created_at'][:19].replace('T', ' ')
        event = a['event_type']
        price = a['price'] / 100
        snapshot = a.get('logic_snapshot', {})
        
        # Intentar extraer info de la estrategia
        rsi = snapshot.get('rsi', 'N/A')
        # Si es EXIT, ver por qué
        reason = snapshot.get('exit_reason') or snapshot.get('reason', 'N/A')
        
        print(f"[{date}] {event:<20} @ ${price:<9.2f} | RSI: {rsi:<6} | Razón: {reason}")

if __name__ == "__main__":
    run_audit()
