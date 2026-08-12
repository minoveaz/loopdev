---
id: quant-ops-suite
title: Quant Ops Suite - Industrial Engine (v1.0)
status: closed
created: 2026-01-20
updated: 2026-08-12
owner: quant
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/quant-ops-suite_20260120
lead: null
branches: []
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
closed: 2026-08-12
---

# Quant Ops Suite - Industrial Engine (v1.0)

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

# Plan: Quant Ops Suite - Industrial Engine (v1.0)

## Phase 1: The Spine (Contracts & Persistence)
- [x] Task: Create `src/trading/trading.schema.ts` in `@loopdev/contracts`.
- [x] Task: Create SQL Migrations for `quant_bots`, `quant_orders`, `quant_exchanges`.
- [x] Task: Implement `quant_security` (pgcrypto) for API Key vaulting in Supabase.

## Phase 2: Prototyping & Industrialization (The Lab & DS)
- [x] Task: Design `BotCommandCenter` layout in `labdev`.
- [x] Task: Industrialize `SimpleLineChart` in `@loopdev/ui`.
- [x] Task: Industrialize `MetricCard` in `@loopdev/ui`.
- [x] Task: Industrialize `PositionsDataTable` in `@loopdev/ui`.
- [x] Task: Industrialize `ActivityStream` in `@loopdev/ui`.
- [x] Task: Industrialize `RiskMeter` in `@loopdev/ui`.
- [ ] Task: Industrialize `BotCard` in `@loopdev/ui` (For Bot Fleet management).
- [ ] Task: Design `RiskControlPanel` for global system settings.

## Phase 3: The Brain (Strategy Engine)
- [x] Task: Scaffold Python/FastAPI service in `modules/mod-quant-core`.
- [x] Task: Implement `AsyncExchangeConnector` (ccxt base).
- [x] Task: Port legacy logic: `MarketRegimeFilter` & `OpeningRangeFilter`.
- [x] Task: Implement `StrategyManager` with real-time Supabase sync.
- [ ] Task: Port legacy logic: `DynamicATRStrategy` (The Core Entry/Exit).
- [ ] Task: Implement the `RiskEngine` middleware.

## Phase 4: Integration (The OS)
- [x] Task: Create `loopdev-os` suite route: `/quant-ops`.
- [ ] Task: Integrate WebSocket client for real-time updates.
- [ ] Task: Implement CRUD for Bot Configuration (The Deploy Form).
- [ ] Task: Implement the "Emergency Stop" global switch.

## Phase 5: Verification & Paper Trading
- [ ] Task: Implement `PaperExchangeAdapter` for simulation.
- [ ] Task: End-to-End test: From signal detection to virtual fill.
- [ ] Task: Conductor verification: `Quant Ops Operational`.

---

### spec.md

# Spec: Quant Ops Suite (v1.0)

> **Core Objective:** Transform legacy trading scripts into a professional, industrial-grade algorithmic trading platform integrated into LoopDev OS.
> **Status:** Definition
> **Owner:** Quant Team

## 1. Architectural Vision
The "Quant Ops" suite follows a **Separation of Concerns** architecture, decoupling market data, strategy logic, risk management, and execution.

### 1.1 Tech Stack
- **Dashboard (UI):** Next.js 16.1 (Existing LoopDev OS).
- **Core Engine (The Brain):** Python 3.12 (FastAPI + Asyncio) for heavy data processing.
- **Persistence:** PostgreSQL (via Supabase) for orders, bots, and audit logs.
- **Connectivity:** WebSockets for real-time price updates and execution status.
- **Library Base:** `ccxt` for exchange integration, `pandas` for technical analysis.

## 2. Technical Modules (The Spines)

### 2.1 Strategy Engine (Rescued Intelligence)
Industrialize the following legacy logics:
- **Market Regime Filter:** Identify Bull/Bear/Sideways using BTC momentum.
- **Initial Range Filter:** 2-hour opening range calculation to prevent over-extension.
- **ATR Dynamic Exit:** Take Profit calculated as 1.5 * ATR(14).
- **Martingale Rebuy (Controlled):** Strategic averaging down with strict max-rebuy limits (e.g., max 3).

### 2.2 Risk Engine (The Guardian)
Mandatory checks before any order execution:
- **Global Stop Loss:** Automatic halt if the portfolio drops below X%.
- **Daily Loss Limit:** Halts bot activity for the day if loss exceeds threshold.
- **Max Exposure:** Limits USDT amount per pair and per bot instance.

### 2.3 Persistence Layer (SQL)
Replace JSON/TXT files with relational tables:
- `quant_bots`: Configuration, strategy, risk parameters.
- `quant_orders`: Audit trail of every intent and execution.
- `quant_positions`: Real-time state of active trades (Entry Price, Avg Price, PnL).

## 3. Security Requirements
- **Vault:** API Keys must be encrypted in the database.
- **IP Whitelisting:** Mandatory for exchange API configuration.
- **Paper Trading Mode:** A virtual environment where the engine runs without real capital.

## 4. Success Criteria
1.  A bot can be started/paused from LoopDev OS.
2.  PnL is tracked in real-time without refreshing the page.
3.  The Risk Engine successfully blocks a "forbidden" order.
4.  Zero hardcoded credentials in the codebase.
