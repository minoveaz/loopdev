import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

# Query column information
res = supabase.rpc('get_column_info', {'table_name': 'quant_market_history'}).execute()
print(res.data)
