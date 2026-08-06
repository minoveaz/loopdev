
import os
import asyncio
import pandas as pd
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client
from loguru import logger

# --- CONFIGURACIÓN DE RUTAS ---
current_dir = Path(__file__).resolve().parent
env_path = current_dir / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    # Fallback to absolute path from project root if needed
    env_path = Path("loopdev/modules/mod-quant-core/.env")
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
    else:
        print(f"DEBUG: No se encontró .env en {env_path}")

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: No se encontraron las credenciales de Supabase.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

from quant_helpers import from_cents

async def get_latest_order():
    # 1. Verificar posiciones activas en quant_bots
    bots_res = supabase.table("quant_bots")\
        .select("id, pair, current_entry_price, current_position_side, last_exit_targets")\
        .gt("current_entry_price", 0)\
        .execute()
    
    print(f"\n🔍 ESTADO DE BOTS (POSICIONES ACTIVAS)")
    print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    if not bots_res.data:
        print("✅ No hay posiciones abiertas en este momento (Status: Scanning).")
    for b in bots_res.data:
        price = from_cents(b['current_entry_price'])
        print(f"🚀 POSICIÓN ACTIVA | {b['pair']} | {b['current_position_side']} @ ${price:,.2f}")

    # 2. Mostrar los últimos 3 eventos de auditoría para contexto
    res = supabase.table("quant_audit_logs")\
        .select("*, quant_bots(pair, base_investment_usdt)")\
        .order("created_at", desc=True)\
        .limit(3)\
        .execute()
    
    print(f"\n📊 ÚLTIMOS 3 EVENTOS DE AUDITORÍA")
    print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    if not res.data:
        print("No se encontraron logs de auditoría.")
        return

    for order in res.data:
        bot_info = order.get('quant_bots', {})
        pair = bot_info.get('pair', 'N/A')
        event_type = order.get('event_type', 'N/A')
        side = order.get('side', 'N/A')
        price = from_cents(order.get('price'))
        pnl_pct = order.get('pnl_pct', 0)
        created_at = order.get('created_at', 'N/A')
        
        indicator = "🔹"
        if event_type == 'ENTRY': indicator = "📥 ENTRY"
        elif event_type == 'EXIT': indicator = "📤 EXIT "
        
        msg = f"{indicator} | {pair} | ${price:,.2f} | {created_at}"
        if event_type == 'EXIT':
            color = "🟢" if pnl_pct > 0 else "🔴"
            msg += f" | {color} {pnl_pct:.2f}%"
        print(msg)
    print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

if __name__ == "__main__":
    asyncio.run(get_latest_order())
