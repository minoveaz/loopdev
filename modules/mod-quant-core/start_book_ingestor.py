
import asyncio
import os
import signal
import sys
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client
from src.core.book_ingestor import BookIngestor
from src.core.managers.audit_manager import AuditManager

# --- CONFIGURACIÓN DE RUTAS ---
current_dir = Path(__file__).resolve().parent
env_path = current_dir / ".env"

if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    env_path = current_dir.parent.parent / "apps" / "loopdev-os" / ".env.local"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)

# --- MAPEO INTELIGENTE DE CREDENCIALES ---
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print(f"❌ FATAL: Credenciales de Supabase no encontradas.")
    sys.exit(1)

async def main():
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    audit = AuditManager(supabase)
    sentinel = BookIngestor(supabase, audit)
    
    loop = asyncio.get_running_loop()
    def shutdown():
        print("\n🛑 Deteniendo Book Ingestor...")
        sentinel.stop()
        sys.exit(0)

    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, shutdown)

    print("""
    ╔══════════════════════════════════════════════════════════╗
    ║           LOOPDEV OS - BOOK DATA SENTINEL                ║
    ║       -------------------------------------------        ║
    ║   > Status: ACTIVE                                       ║
    ║   > Mode: LEVEL 2 (Order Flow)                           ║
    ║   > Source: BINANCE ORDER BOOK                           ║
    ╚══════════════════════════════════════════════════════════╝
    """)
    
    await sentinel.run()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
