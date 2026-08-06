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
