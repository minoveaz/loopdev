
import asyncio
from trades_report import supabase

async def check_config():
    res = supabase.table("quant_bots").select("pair, config, status").execute()
    for b in res.data:
        print(f"PAIR: {b['pair']} | STATUS: {b['status']} | CONFIG: {b['config']}")

if __name__ == "__main__":
    asyncio.run(check_config())
