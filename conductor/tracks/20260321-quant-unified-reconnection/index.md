# Track: Quant Unified Reconnection (Industrial Sync)

**ID:** `quant-unified-reconnection`
**Status:** `IN_PROGRESS`
**Priority:** `CRITICAL`
**Owner:** `Quant_Architect`

## 🎯 Vision & Objective
Unify all existing frontend hooks, UI components, and Python strategies with the new 3-tier industrial architecture. Ensure 100% data consistency, financial precision (Cents), and real-time responsiveness across the LoopDev OS ecosystem.

---

## 📍 Roadmap & Phases (AI Skills Workflow)

### PHASE 1: DISCOVERY & INTEGRATION AUDIT (COMPLETED ✅)
- **Skill:** Discovery Analysis Skill
- **Focus:** Complete mapping of legacy hooks (`useBotFleet`, `usePortfolioStats`) and UI components that need "Cents-aware" updates.
- **Output:** Detailed Reconnection Blueprint.

### PHASE 2: DATA ADAPTERS & HOOKS REFACTOR (COMPLETED ✅)
- **Skill:** Contract Definition Skill & Infra Implementation Skill
- **Focus:** 
    - Refactor `useBotFleet.ts` to handle `BIGINT` Cents -> Float conversion.
    - Connect `usePortfolioStats` to the new `quant_market_history` for accurate equity tracking.
    - Remove all mock/fallback logic from data fetching.

### PHASE 3: VISUAL TELEMETRY LINK (Real-time Industrial UI) ✅
- **Skill:** Frontend Implementation Skill
- **Focus:** 
    - **BotCardIndustrial Deep Integration:**
        - **BotCardHeader:** Audited & Scaled ✅ (Heartbeat, Latency & Strategy Badge).
        - **BotCardPrice:** Audited & Scaled ✅ (Reactive Telemetry Standard).
        - **BotCardState:** High-Fidelity Refactor ✅:
            - [x] **Point 1: Dynamic Confluence** (Show [RSI] [VOL] [TREND] checks).
            - [x] **Point 2: Next Eval Timer** (Countdown MM:SS for next scan).
            - [x] **Point 3: Market Context** (Distance to Trigger: 0.5% / $68k).
            - [x] **Point 4: Quick Session History** (W/L Summary: 3W / 1L).
            - [x] **Point 5: Node Heartbeat** (Pulsing Latency Indicator: 14ms).
            - [x] **Point 6: Position Precision** (PnL USD/%, Capital Deployed, Est. Fees).
        - **BotCardMetrics:** Integrated into Adaptive Tactical Grid ✅.

### PHASE 4: COMMAND & CONTROL (Real-time Reactivity) ✅
- **Skill:** Backend/Fullstack Implementation
- **Focus:** 
    - [x] **Manual Command Bus:** Implement `pending_command` in DB & Python Listener.
    - [x] **Parallel Execution:** Refactor engine to use `asyncio.gather` for scaling.
    - [x] **Functional Verification:** Confirm `MARKET_EXIT` and `MOVE_TO_BE` execute real orders.
    - [x] **Smart UI Controls:** Disable protection buttons when safety is already achieved.

### PHASE 5: GLOBAL TELEMETRY & AUDIT DOCK 🔄
- **Focus:** 
    - [ ] **OperationalDock (UI Molecule):** Create the tabbed bottom panel (Positions | Activity | History).
    - [ ] **Unified Activity Stream:** Map `quant_signals` and manual commands into a single industrial feed.
    - [x] **PulseSparkline Link:** Connect charts to real `quant_market_history` DB candles ✅.
    - [ ] **BotInspector Mapping:** Connect the side panel to the full `last_logic_snapshot`.

### PHASE 6: ADVANCED RISK MANAGEMENT (Trailing Stop) ⏳
- **Focus:** 
    - [ ] **DB Migration:** Add `current_position_max_price` to track trade peaks.
    - [ ] **Backend Logic:** Implement automatic SL trailing based on price peaks.
    - [ ] **Manual Override:** Add "Activate Trailing" command to the UI buttons.
    - [ ] **Visual Sync:** Show the Stop Loss moving up in real-time on the card.


### PHASE 5: UNIFIED EVENT STREAM (Signals & Orders)
- **Skill:** Infra Implementation Skill
- **Focus:** 
    - Merge `quant_signals` and `quant_orders` into a unified `useActivityStream`.
    - Implement real-time Toasts for `Tier C` execution events.

### PHASE 6: FINAL GOVERNANCE & SMOKE TESTS
- **Skills:** Architecture Review, Security Audit, Release Readiness.
- **Focus:** Verify zero data leaks, latency < 200ms, and successful end-to-end trade flow.

---

## 🏗️ Technical Constraints
- **Precision:** Mandatory `/ 100` on all DB price reads.
- **Source of Truth:** All market data must come from `quant_market_history`.
- **Environment:** Maintain strict `testnet` scoping.

---

## 📝 Change Log
- **2026-03-22**: Track moved to `IN_PROGRESS`. Fases 1 y 2 marcadas como completadas. Iniciado sub-plan para auditoría de `BotCardIndustrial` en la Fase 3.
- **2026-03-21**: Track created to bridge the 3-tier architecture with the legacy and UI layers.
