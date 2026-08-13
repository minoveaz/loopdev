# DEPRECATED: LoopDev Quant Ops: 3-Tier Industrial Architecture

> Experimental product architecture retained for historical context only.

**Status:** Production-Ready (Testnet Certified)
**Last Update:** 2026-03-21
**Key Principle:** Data Independence & Layer Decoupling.

---

## 🏗️ The 3-Tier Model

### Tier A: Data Sentinel (The Ingestor)
- **Source:** `modules/mod-quant-core/src/core/ingestor.py`
- **Responsibility:** 24/7 market data capture.
- **Data Flow:** Binance (WS/REST) -> Memory Buffer -> Supabase (`quant_market_history`).
- **Features:** 7-day automatic backfill, deduplication, batch-upserts (15s), hybrid connectivity.

### Tier B: Signal Engine (The Brain)
- **Source:** `modules/mod-quant-core/src/core/strategy_manager.py` (Method: `run_signal_engine`)
- **Responsibility:** Strategy analysis and signal generation.
- **Data Flow:** Supabase (`quant_market_history`) -> Pandas -> `quant_signals`.
- **Constraint:** Uses **Cents Precision** (BIGINT). No direct external API calls for logic.

### Tier C: Execution Manager (The Hand)
- **Source:** `modules/mod-quant-core/src/core/strategy_manager.py` (Method: `run_execution_manager`)
- **Responsibility:** Order fulfillment and bot state synchronization.
- **Data Flow:** `quant_signals` (PENDING) -> Binance API -> Bot Update.

---

## 📊 Data Infrastructure (Supabase)

| Table | Purpose | Storage Format |
| :--- | :--- | :--- |
| `quant_market_history` | OHLCV Time-series | BIGINT (Cents) |
| `quant_market_config` | Active pairs control | JSONB / Boolean |
| `quant_signals` | Decoupled trade events | JSONB + Audit Metadata |
| `quant_bots` | Master fleet state | Telemetry + State |

---

## 🔐 Engineering Standards

1.  **Precision:** All prices stored as `Integer` (Cents). Formula: `cents = price * 100`.
2.  **Contracts:** Synchronized between TypeScript (`packages/contracts`) and Python (`models.py`).
3.  **Security:** Row-Level Security (RLS) enabled on all multi-tenant tables.
4.  **Environment:** Explicit partitioning between `testnet` and `production`.

---

## 🕹️ Operational Commands

- `startingestor`: Launches the Data Sentinel (Tier A).
- `startquant`: Launches the Trading Engine (Tier B + C).

---

## 🤖 AI Agent Instructions
When working on this module:
- **DO NOT** use `fetch_ohlcv` from Binance for strategy calculations. Use the local `quant_market_history` table.
- **ALWAYS** validate data using `TradeSignalModel` or `MarketCandleModel` (Pydantic).
- **NEVER** store raw floats for prices in the database.
