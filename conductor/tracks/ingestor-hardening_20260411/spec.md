# Specification: Ingestor Hardening (Flight Recorder & Self-Healing)

## 1. Problem Statement
The current `MarketIngestor` lacks persistent logging and robust self-healing for long-term disconnections. On 2026-04-11 at 11:15 UTC, a data gap occurred, causing the `SignalEngine` to miss a high-probability trade.

## 2. Requirements
- **Persistent Logging:** All ingestor events (TICK, FLUSH, ERR) must be written to `loopdev/modules/mod-quant-core/ingestor.log`.
- **Enhanced Retry Mechanism:** Implement exponential backoff for connection errors.
- **Session Refresh:** Improved logic for handling 502/503 errors from Binance/CCXT.
- **Audit Integration:** Log "INGESTOR_GAP" or "INGESTOR_DISCONNECT" events to `quant_audit_logs`.
- **Health Heartbeat:** Update a central health record every 60 seconds to signal the ingestor is alive.

## 3. Technical Constraints
- Must not block the main `asyncio` loop.
- Logging should be non-blocking using `RotatingFileHandler`.
- Minimal performance impact on the tick-processing pipeline.
