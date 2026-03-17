import asyncio
from loguru import logger
from typing import Dict, List
from supabase import create_client, Client
import os
from pathlib import Path
from dotenv import load_dotenv
from .exchange_connector import AsyncExchangeConnector
from ..strategies.filters import MarketRegimeFilter

class StrategyManager:
    """
    The orchestrator of the Quant Core.
    Responsible for syncing bots from DB and managing execution loops.
    """
    def __init__(self):
        # Load .env from the module root directory
        env_path = Path(__file__).parent.parent.parent / ".env"
        load_dotenv(dotenv_path=env_path)
        
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        logger.debug(f"SUPABASE_URL: {self.supabase_url}")
        logger.debug(f"SUPABASE_SERVICE_ROLE_KEY: {self.supabase_key[:50] if self.supabase_key else 'Not found'}...")
        
        if not self.supabase_url or not self.supabase_key:
            logger.error("Missing Supabase credentials! Check your .env file.")
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
            
        self.db: Client = create_client(self.supabase_url, self.supabase_key)
        self.active_bots: Dict[str, asyncio.Task] = {}
        self.is_running = False

    async def sync_bots_from_db(self):
        """Fetch active bots from Supabase and start their loops."""
        try:
            response = self.db.table("quant_bots").select("*").eq("status", "active").execute()
            bots = response.data
            
            logger.info(f"Syncing {len(bots)} active bots from database...")
            
            # Start new bots
            for bot_config in bots:
                bot_id = bot_config['id']
                if bot_id not in self.active_bots:
                    task = asyncio.create_task(self.bot_execution_loop(bot_config))
                    self.active_bots[bot_id] = task
                    logger.success(f"Started loop for bot: {bot_config['name']} ({bot_id})")
            
            # Stop bots that are no longer active in DB
            active_ids = [b['id'] for b in bots]
            for bot_id in list(self.active_bots.keys()):
                if bot_id not in active_ids:
                    self.active_bots[bot_id].cancel()
                    del self.active_bots[bot_id]
                    logger.warning(f"Stopped loop for bot: {bot_id} (inactive in DB)")

        except Exception as e:
            logger.error(f"Error syncing bots: {e}")

    async def bot_execution_loop(self, config: Dict):
        """The main lifecycle of a single trading bot instance."""
        bot_name = config['name']
        symbol = config['pair']
        
        # 1. Initialize Connector
        # Note: In production, we'd decrypt api_key/secret here via quant_security
        connector = AsyncExchangeConnector(
            exchange_id='binance', 
            api_key='MOCK_KEY', 
            api_secret='MOCK_SECRET',
            paper_mode=True
        )
        
        try:
            await connector.connect()
            
            while True:
                logger.debug(f"[{bot_name}] Heartbeat - Scanning {symbol}...")
                
                # 2. Fetch Market Data
                ohlcv = await connector.fetch_ohlcv(symbol, timeframe='1m', limit=60)
                if not ohlcv:
                    await asyncio.sleep(10)
                    continue
                
                import pandas as pd
                df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
                
                # 3. Apply Rescued Intelligence Filters
                regime = MarketRegimeFilter.calculate_regime(df)
                logger.info(f"[{bot_name}] Current Regime: {regime.upper()}")
                
                if regime == 'bearish' and config.get('use_market_regime_filter'):
                    logger.warning(f"[{bot_name}] Strategy paused: Market is bearish.")
                else:
                    # Strategy Logic would go here
                    pass

                # 4. Wait for next iteration (e.g. 30 seconds)
                await asyncio.sleep(30)

        except asyncio.CancelledError:
            logger.info(f"Bot execution loop cancelled for {bot_name}")
        except Exception as e:
            logger.error(f"Critical error in bot {bot_name}: {e}")
        finally:
            await connector.close()

    async def start(self):
        """Starts the background sync process."""
        self.is_running = True
        while self.is_running:
            await self.sync_bots_from_db()
            await asyncio.sleep(60) # Sync every minute

    def stop(self):
        self.is_running = False
        for task in self.active_bots.values():
            task.cancel()
