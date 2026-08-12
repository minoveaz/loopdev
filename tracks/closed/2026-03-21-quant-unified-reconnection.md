---
id: quant-unified-reconnection
title: Quant Unified Reconnection (Industrial Sync)
status: closed
created: 2026-03-21
updated: 2026-08-12
owner: quant
branch: null
areas: []
dependencies: []
blocked_by: []
supersedes: []
migration_source: conductor/tracks/20260321-quant-unified-reconnection
---

# Quant Unified Reconnection (Industrial Sync)

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

### index.md

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
- **Status:** Done. Mapping of legacy hooks and Cents-aware updates finalized.

### PHASE 2: DATA ADAPTERS & HOOKS REFACTOR (COMPLETED ✅)
- **Status:** Done. `useBotFleet.ts` refactored for BIGINT precision and real data.

### PHASE 3: VISUAL TELEMETRY LINK (Real-time Industrial UI) ✅
- **Focus:** 
    - **BotCardIndustrial Deep Integration:**
        - **BotCardHeader:** Heartbeat, Latency & Strategy Badge ✅.
        - **BotCardPrice:** Reactive Telemetry Standard ✅.
        - **BotCardState:** High-Fidelity Refactor (Confluence, Timer, Context, Scoreboard) ✅.
        - **PulseSparkline:** SVG High-Density Histogram with interactive scanner ✅.

### PHASE 4: COMMAND & CONTROL (Real-time Reactivity) ✅
- **Focus:** 
    - [x] **Manual Command Bus:** Implement `pending_command` in DB & Python Listener.
    - [x] **Parallel Execution:** Refactor engine to use `asyncio.gather` for scaling.
    - [x] **Functional Verification:** Confirm `MARKET_EXIT`, `TP_NOW` and `MOVE_TO_BE` buttons.

### PHASE 5: GLOBAL TELEMETRY & AUDIT DOCK 🔄
- **Focus:** 
    - [ ] **OperationalDock (UI Molecule):** Create the tabbed bottom panel (Positions | Activity | History).
    - [ ] **Unified Activity Stream:** Map `quant_signals` and manual commands into a single industrial feed.
    - [ ] **BotInspector Mapping:** Connect the side panel to the full `last_logic_snapshot`.

### PHASE 6: ADVANCED RISK MANAGEMENT (Trailing Stop) ✅
- **Focus:** 
    - [x] **DB Migration:** Added `current_position_max_price` and `trailing_stop_distance`.
    - [x] **Backend Logic:** Automatic SL trailing based on price peaks and dynamic distance.
    - [x] **Manual Selector:** Added `TrailingControlPopover` with presets.

### PHASE 7: HIGH-FIDELITY DEPLOYMENT (Intelligent Forms) ✅
- **Focus:** 
    - [x] **Style Categorization:** Added `trading_style` to strategies.
    - [x] **Smart Modal:** Auto-fill, Balance Check, and Risk Simulation.

---

## 🏗️ Technical Constraints
- **Precision:** Mandatory `/ 100` on all DB price reads.
- **Source of Truth:** All market data must come from `quant_market_history`.
- **Environment:** Maintain strict `testnet` scoping.

---

## 📝 Change Log
- **2026-03-23**: Finalized Trailing Stop Manual Control and Scalping Optimization (v1.2.0). All bot card tactical features completed.
- **2026-03-22**: Track moved to `IN_PROGRESS`. Fases 1 y 2 marcadas como completadas. Iniciado sub-plan para auditoría de `BotCardIndustrial` en la Fase 3.
- **2026-03-21**: Track created to bridge the 3-tier architecture with the legacy and UI layers.
