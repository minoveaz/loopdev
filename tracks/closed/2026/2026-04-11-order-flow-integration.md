---
id: order-flow-integration
title: Order Flow Integration
status: closed
created: 2026-04-11
updated: 2026-08-12
owner: quant
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/order-flow-integration_20260411
lead: null
branches: []
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
closed: 2026-08-12
---

# Order Flow Integration

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

# Implementation Plan: Order Flow Integration

## Phase 1: High-Density Data (Ingestor)
- [ ] Task: Update `MarketIngestor` to include `watch_order_book` for active pairs.
- [ ] Task: Implement `order_books` thread-safe dictionary in Ingestor.
- [ ] Task: Add L2 health heartbeat to `quant_system_health`.

## Phase 2: Microstructure Intelligence (Indicators)
- [ ] Task: Implement `calculate_order_imbalance(bids, asks)` in `indicators.py`.
- [ ] Task: Refactor `BaseStrategy` to support `analyze_order_book` hook.
- [ ] Task: Implement `SpreadMonitor` utility.

## Phase 3: Tactical Signal Refinement
- [ ] Task: Update `SignalEngine` to fetch latest order book before strategy execution.
- [ ] Task: Refactor **HF Scalper** to require a minimum Buy/Sell pressure ratio.
- [ ] Task: Audit Log integration: Log "SIGNAL_REJECTED_L2" when Order Flow contradicts the signal.

## Phase 4: Integration & UX
- [ ] Task: Add `order_book_snapshot` to the `logic_snapshot` in audit logs.
- [ ] Task: Verification: Compare Binance UI Walls with Bot detection.

---

### spec.md

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
