# Specification: Order Flow & L2 Microstructure Integration

## 1. Objective
Enhance current trading strategies with real-time Order Book (Level 2) data to detect "Walls" and market pressure, reducing false entries and optimizing entry/exit prices.

## 2. Requirements
- **L2 Data Stream:** Real-time ingestion of top 20 bid/ask levels from Binance via WebSocket.
- **Order Imbalance Metric:** Calculate the volume ratio between buy and sell orders within a specific price range.
- **Spread Guard:** Monitor real-time spread to avoid entering during periods of low liquidity.
- **Non-blocking Architecture:** L2 processing must not interfere with the 1m/5m candle generation.

## 3. Engineering Standards
- **Refactored Ingestor:** Use specialized tasks for L2 streams.
- **Unified Audit:** Log "MARKET_PRESSURE_HIGH" events when significant walls are detected.
- **Zero Memory Leak:** Automatic cleanup of old order book snapshots.
