
import os
import asyncio
import pandas as pd
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime, timedelta

# --- CONFIGURACIÓN DE RUTAS ---
current_dir = Path(__file__).resolve().parent
env_path = current_dir / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    env_path = Path("loopdev/modules/mod-quant-core/.env")
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: No se encontraron las credenciales de Supabase.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

from quant_helpers import from_cents

async def generate_report():
    # Buscamos eventos de los últimos 7 días
    seven_days_ago = (datetime.now() - timedelta(days=7)).isoformat()
    
    # Traemos los logs de auditoría ordenados por fecha
    res = supabase.table("quant_audit_logs")\
        .select("*, quant_bots(pair, base_investment_usdt)")\
        .order("created_at", desc=True)\
        .limit(100)\
        .execute()
    
    if not res.data:
        print("No se encontraron operaciones recientes.")
        return

    # Procesar eventos para emparejar ENTRY y EXIT
    # Usaremos un diccionario temporal para guardar entradas mientras encontramos su salida
    events = res.data
    trades = []
    
    # Como están ordenados desc, recorremos para encontrar EXITS y luego sus ENTRYS previos
    for i, event in enumerate(events):
        if event['event_type'] == 'EXIT':
            exit_price = from_cents(event['price'])
            exit_time = pd.to_datetime(event['created_at'])
            pnl_pct = float(event.get('pnl_pct', 0))
            bot_id = event['bot_id']
            pair = event.get('quant_bots', {}).get('pair', 'N/A')
            investment = float(event.get('quant_bots', {}).get('base_investment_usdt', 100))
            
            # Buscar la entrada correspondiente (el ENTRY más cercano anterior en el tiempo)
            entry_price = 0.0
            entry_time = None
            
            for j in range(i + 1, len(events)):
                prev = events[j]
                if prev['bot_id'] == bot_id and prev['event_type'] == 'ENTRY':
                    entry_price = from_cents(prev['price'])
                    entry_time = pd.to_datetime(prev['created_at'])
                    break
            
            if entry_price > 0:
                pnl_usdt = (investment * pnl_pct) / 100
                trades.append({
                    "pair": pair,
                    "entry_time": entry_time,
                    "exit_time": exit_time,
                    "entry_price": entry_price,
                    "exit_price": exit_price,
                    "pnl_pct": pnl_pct,
                    "pnl_usdt": pnl_usdt
                })

    print(f"\n📈 REPORTE DE OPERACIONES CERRADAS (Últimos días)")
    print(f"{'FECHA/HORA (EXIT)':<20} | {'PAR':<10} | {'ENTRADA':<10} | {'SALIDA':<10} | {'% PNL':<8} | {'PNL $':<8}")
    print("-" * 85)
    
    total_pnl_usdt = 0
    for t in trades:
        color = "🟢" if t['pnl_pct'] > 0 else "🔴"
        date_str = t['exit_time'].strftime('%d/%m %H:%M')
        print(f"{date_str:<20} | {t['pair']:<10} | {t['entry_price']:>10.2f} | {t['exit_price']:>10.2f} | {color} {t['pnl_pct']:>5.2f}% | {t['pnl_usdt']:>7.2f} USDT")
        total_pnl_usdt += t['pnl_usdt']
    
    print("-" * 85)
    total_color = "🟢" if total_pnl_usdt >= 0 else "🔴"
    print(f"{'TOTAL ACUMULADO':<57} | {total_color} {total_pnl_usdt:>7.2f} USDT\n")

if __name__ == "__main__":
    asyncio.run(generate_report())
