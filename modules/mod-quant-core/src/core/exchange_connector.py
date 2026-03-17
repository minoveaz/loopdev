import ccxt.async_support as ccxt
from loguru import logger
import asyncio
from typing import Dict, Any, List

class AsyncExchangeConnector:
    """
    Industrial-grade connector for crypto exchanges.
    Uses ccxt.async_support for high-concurrency operations.
    """
    def __init__(self, exchange_id: str, api_key: str, api_secret: str, paper_mode: bool = True):
        self.exchange_id = exchange_id
        self.api_key = api_key
        self.api_secret = api_secret
        self.paper_mode = paper_mode
        self.exchange = None
        
    async def connect(self):
        """Initialize the connection to the exchange."""
        exchange_class = getattr(ccxt, self.exchange_id)
        self.exchange = exchange_class({
            'apiKey': self.api_key,
            'secret': self.api_secret,
            'enableRateLimit': True,
        })
        
        if self.paper_mode:
            # Enable sandbox/testnet mode if supported
            if hasattr(self.exchange, 'set_sandbox_mode'):
                self.exchange.set_sandbox_mode(True)
                logger.info(f"Connected to {self.exchange_id} in SANDBOX mode")
            else:
                logger.warning(f"{self.exchange_id} does not support sandbox mode explicitly.")
        
        logger.success(f"Connection established with {self.exchange_id}")

    async def fetch_ohlcv(self, symbol: str, timeframe: str = '1m', limit: int = 100) -> List[List]:
        """Fetch historical candle data."""
        try:
            return await self.exchange.fetch_ohlcv(symbol, timeframe, limit=limit)
        except Exception as e:
            logger.error(f"Error fetching OHLCV for {symbol}: {e}")
            return []

    async def fetch_balance(self) -> Dict[str, Any]:
        """Fetch account balances."""
        try:
            return await self.exchange.fetch_balance()
        except Exception as e:
            logger.error(f"Error fetching balance: {e}")
            return {"error": str(e)}

    async def create_order(self, symbol: str, type: str, side: str, amount: float, price: float = None) -> Dict[str, Any]:
        """Execute an order on the exchange."""
        try:
            logger.info(f"Executing {side.upper()} {type.upper()} order for {amount} {symbol}")
            order = await self.exchange.create_order(symbol, type, side, amount, price)
            logger.success(f"Order executed successfully: {order['id']}")
            return order
        except Exception as e:
            logger.error(f"Execution failed for {symbol}: {e}")
            return {"error": str(e)}

    async def close(self):
        """Close the exchange connection."""
        if self.exchange:
            await self.exchange.close()
            logger.info(f"Closed connection to {self.exchange_id}")
