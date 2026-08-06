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
