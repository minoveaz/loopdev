---
id: ingestor-hardening
title: Ingestor Hardening
status: closed
created: 2026-04-11
updated: 2026-08-12
owner: quant
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/ingestor-hardening_20260411
lead: null
branches: []
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
closed: 2026-08-12
---

# Ingestor Hardening

## Outcome

Track histórico consolidado. El resultado y la evidencia original se preservan a continuación.

## Fases

Las fases históricas se conservan en el historial migrado.

## Criterios de cierre

- [x] Consolidado en el sistema de tracks de un archivo.
- [x] Cerrado por la política de migración aprobada explícitamente por el usuario el 2026-08-12.

## Cierre

Cerrado durante la migración de gobernanza de tracks con aprobación explícita del usuario.

## Historial migrado

### plan.md

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

---

### spec.md

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
