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
