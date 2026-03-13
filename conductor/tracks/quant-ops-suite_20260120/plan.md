# Plan: Quant Ops Suite - Industrial Engine (v1.0)

## Phase 1: The Spine (Contracts & Persistence)
- [ ] Task: Create `src/trading/trading.schema.ts` in `@loopdev/contracts`.
    - Define `BotConfigSchema`, `OrderIntentSchema`, `PositionSchema`.
- [ ] Task: Create SQL Migrations for `quant_bots`, `quant_orders`, `quant_exchanges`.
- [ ] Task: Implement `pgcrypto` or similar for API Key vaulting in Supabase.

## Phase 2: Prototyping (The Lab)
- [ ] Task: Design `BotCommandCenter` layout in `labdev`.
- [ ] Task: Create `BotPerformanceChart` component (using lightweight charts).
- [ ] Task: Create `ActivePositionsTable` with real-time indicators.
- [ ] Task: Design `RiskControlPanel` for global system settings.

## Phase 3: The Brain (Strategy Engine)
- [ ] Task: Scaffold Python/FastAPI service in `modules/mod-quant-core`.
- [ ] Task: Implement `AsyncExchangeConnector` (ccxt base).
- [ ] Task: Port legacy logic: `MarketRegimeFilter`.
- [ ] Task: Port legacy logic: `OpeningRangeFilter`.
- [ ] Task: Port legacy logic: `DynamicATRStrategy`.
- [ ] Task: Implement the `RiskEngine` middleware.

## Phase 4: Integration (The OS)
- [ ] Task: Create `loopdev-os` suite route: `/quant-ops`.
- [ ] Task: Integrate WebSocket client for real-time updates.
- [ ] Task: Implement CRUD for Bot Configuration.
- [ ] Task: Implement the "Emergency Stop" global switch.

## Phase 5: Verification & Paper Trading
- [ ] Task: Implement `PaperExchangeAdapter` for simulation.
- [ ] Task: End-to-End test: From signal detection to virtual fill.
- [ ] Task: Conductor verification: `Quant Ops Operational`.
