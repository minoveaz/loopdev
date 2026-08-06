"""Mock data generator for testing bots without live exchange connection."""

import random
from datetime import datetime, timedelta
from typing import List, Tuple

class MockDataGenerator:
    """Generates realistic OHLCV data for backtesting and testing."""
    
    @staticmethod
    def generate_ohlcv(
        num_candles: int = 60,
        base_price: float = 71000,
        volatility: float = 0.002
    ) -> List[List]:
        """
        Generate realistic OHLCV candles.
        
        Args:
            num_candles: Number of 1m candles to generate
            base_price: Starting price
            volatility: Price volatility (0.002 = 0.2%)
        
        Returns:
            List of [timestamp, open, high, low, close, volume]
        """
        ohlcv = []
        current_time = datetime.now()
        current_price = base_price
        
        for i in range(num_candles):
            # Timestamp (in milliseconds, 1 minute apart)
            time_offset = (num_candles - i - 1) * 60  # seconds
            candle_time = current_time - timedelta(seconds=time_offset)
            timestamp = int(candle_time.timestamp() * 1000)
            
            # Price movement (random walk)
            price_change = random.gauss(0, volatility)  # Normal distribution
            open_price = current_price
            close_price = open_price * (1 + price_change)
            
            # High and low with realistic spread
            spread = abs(random.gauss(0, volatility / 2))
            high_price = max(open_price, close_price) * (1 + spread)
            low_price = min(open_price, close_price) * (1 - spread)
            
            # Volume (realistic variation)
            base_volume = 500
            volume = base_volume * random.uniform(0.5, 2.0)
            
            ohlcv.append([
                timestamp,
                round(open_price, 2),
                round(high_price, 2),
                round(low_price, 2),
                round(close_price, 2),
                round(volume, 2)
            ])
            
            current_price = close_price
        
        return ohlcv

# Example usage for testing
if __name__ == "__main__":
    gen = MockDataGenerator()
    ohlcv = gen.generate_ohlcv(60)
    print("Sample OHLCV data (last 3 candles):")
    for candle in ohlcv[-3:]:
        print(f"  Timestamp: {candle[0]}, Open: {candle[1]}, High: {candle[2]}, Low: {candle[3]}, Close: {candle[4]}, Vol: {candle[5]}")
