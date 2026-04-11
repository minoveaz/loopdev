# Implementation Plan: Ingestor Hardening

## Phase 1: Logging & Visibility
- [ ] Task: Add `RotatingFileHandler` to `MarketIngestor` to write to `ingestor.log`.
- [ ] Task: Integrate `AuditManager` into `MarketIngestor` for critical error reporting.
- [ ] Task: Register `INGESTOR_RESTART` and `INGESTOR_GAP` events in `quant_audit_logs`.

## Phase 2: Robust Connection Management
- [ ] Task: Implement `ExponentialBackoff` for CCXT reconnection attempts.
- [ ] Task: Enhance 502/503 error handling with a separate `monitor_connector` task.
- [ ] Task: Add a "Heartbeat" mechanism to the `quant_bots` table or a new `quant_system_health` table.

## Phase 3: Verification
- [ ] Task: Verify that `ingestor.log` is rotating and not filling disk.
- [ ] Task: Simulate a network disconnection and verify self-healing behavior.
- [ ] Task: Ensure no data gaps occur for at least 6 hours of continuous operation.
