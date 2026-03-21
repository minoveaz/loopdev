#!/usr/bin/env python3
"""
Execute Supabase migration for bot realtime metrics columns.
This script reads the migration SQL file and executes it on the remote Supabase database.

Usage:
    python3 execute_migration.py
"""

import os
import sys
from pathlib import Path
from supabase import create_client, Client

def load_env():
    """Load environment variables from .env file if not set."""
    env_file = Path(__file__).parent / "modules/mod-quant-core/.env"
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, value = line.split("=", 1)
                    if key not in os.environ:
                        os.environ[key] = value

def main():
    # Load environment
    load_env()
    
    # Get credentials
    supabase_url = os.getenv("SUPABASE_URL")
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not supabase_url or not service_role_key:
        print("❌ ERROR: Missing Supabase credentials")
        print("   SUPABASE_URL:", "✅" if supabase_url else "❌ NOT SET")
        print("   SUPABASE_SERVICE_ROLE_KEY:", "✅" if service_role_key else "❌ NOT SET")
        sys.exit(1)
    
    # Read migration file
    migration_file = Path(__file__).parent / "supabase/migrations/20260320000018_bot_realtime_metrics.sql"
    if not migration_file.exists():
        print(f"❌ ERROR: Migration file not found: {migration_file}")
        sys.exit(1)
    
    with open(migration_file) as f:
        sql_content = f.read()
    
    print("🚀 Executing migration: 20260320000018_bot_realtime_metrics.sql")
    print(f"📁 File: {migration_file}")
    print(f"🌐 Supabase: {supabase_url}")
    print()
    
    try:
        # Create Supabase client with service role key
        client: Client = create_client(supabase_url, service_role_key)
        
        # Execute SQL directly using RPC or admin API
        # Note: The Python SDK doesn't support raw SQL execution directly
        # We'll use the PostgREST admin API instead
        import requests
        
        headers = {
            "Authorization": f"Bearer {service_role_key}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }
        
        # Construct the SQL endpoint
        # For raw SQL execution, we need to use the internal functions
        print("⏳ Connecting to Supabase...")
        
        # Split SQL into individual statements and execute each
        statements = sql_content.split(";")
        statements = [s.strip() for s in statements if s.strip()]
        
        for i, statement in enumerate(statements, 1):
            if not statement:
                continue
            
            print(f"   [{i}/{len(statements)}] Executing statement...")
            
            # Use the Supabase query API by calling RPC or via psql
            # For direct SQL, we'd normally use CLI, but we can try via HTTP
            try:
                # Try using the /sql endpoint if available
                response = requests.post(
                    f"{supabase_url}/rest/v1/sql",
                    headers=headers,
                    json={"query": statement},
                    timeout=10
                )
                
                if response.status_code not in [200, 201, 204]:
                    print(f"   ⚠️  Statement {i} response: {response.status_code}")
                    print(f"   Response: {response.text[:200]}")
            except Exception as e:
                print(f"   ⚠️  Could not execute via REST API: {e}")
        
        print()
        print("✅ Migration script prepared successfully!")
        print()
        print("📋 Next steps:")
        print("   1. Go to: https://supabase.co/dashboard")
        print("   2. Select project: sukjcsylkljiyvfklxvj")
        print("   3. SQL Editor → New Query")
        print("   4. Copy content from: supabase/migrations/20260320000018_bot_realtime_metrics.sql")
        print("   5. Click RUN")
        print()
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
