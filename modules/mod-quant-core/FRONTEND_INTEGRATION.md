# Frontend Integration - RSI Mean Reversion Strategy

## Quick Answer: Where is RSI Strategy in Frontend?

✅ **The strategy IS already in the frontend system!**

## How Frontend Gets Strategies

```
Frontend (http://localhost:3000)
  ↓
useStrategies() hook calls
  ↓
fetch('http://localhost:8000/strategies/registry')
  ↓
Backend Python (FastAPI)
  ↓
GET /strategies/registry endpoint
  ↓
Returns: { success: true, registry: [...3 strategies including RSI...] }
  ↓
Frontend dropdown shows all available strategies
```

## To See RSI Strategy in Frontend

### Step 1: Start Python Backend
```bash
cd /Users/minoveaz/Documents/Proyectos/loopdev/modules/mod-quant-core
source venv/bin/activate
python3 src/main.py
```

Wait for this message:
```
✓ "Quant Core Engine Operational & Syncing with DB"
✓ "Application startup complete"
```

### Step 2: Open Frontend
Go to: `http://localhost:3000/quant-ops/strategies`

### Step 3: Click "New Strategy Blueprint"
The modal will show Strategy Core Selection dropdown with:
- Industrial Hybrid Core
- ATR Volatility Breakout
- **RSI Mean Reversion Pro** ← NEW!

### Step 4: Select RSI Mean Reversion Pro
You'll see form fields for:
- Strategy name
- Exchange selection
- Trading pairs
- Mode (paper/live)
- Parameters:
  - RSI Period (14)
  - Oversold Level (30)
  - Overbought Level (70)
  - SMA Confirmation Period (50)
  - ATR TP Multiplier (1.5)
  - ATR SL Multiplier (1.5)

### Step 5: Create Bot
Click "Create Strategy" and bot will be:
- Created in Supabase database
- Visible in strategies grid
- Ready for paper trading

## Technical Details

### Backend Registry Location
- **File:** `src/core/strategy_registry.py`
- **Entry:** Lines 49-61
- **ID:** `rsi-mean-rev-v1`

### Backend API Endpoint
- **URL:** `http://localhost:8000/strategies/registry`
- **Method:** GET
- **Handler:** `src/main.py` lines 77-82

### Frontend Hook
- **File:** `apps/loopdev-os/src/hooks/trading/useStrategies.ts`
- **Line:** 120-126
- **Function:** `useStrategies()`
- **Response:** `strategyRegistry` state

### Frontend Page
- **File:** `apps/loopdev-os/src/app/quant-ops/strategies/page.tsx`
- **Component:** `CreateStrategyModal`
- **Props:** `availableCores={strategyRegistry}`

## Response Format

When you hit `/strategies/registry`, you get JSON like:

```json
{
  "success": true,
  "registry": [
    {
      "id": "hybrid-core-v1",
      "name": "Industrial Hybrid Core",
      "category": "Trend Following",
      "description": "...",
      "technical_summary": "...",
      "recommended_timeframe": "1h",
      "parameters": [...]
    },
    {
      "id": "atr-breakout-v1",
      "name": "ATR Volatility Breakout",
      ...
    },
    {
      "id": "rsi-mean-rev-v1",
      "name": "RSI Mean Reversion Pro",
      "category": "Mean Reversion",
      "description": "High-probability mean reversion strategy...",
      "recommended_timeframe": "5m, 15m",
      "parameters": [
        {
          "id": "rsi_period",
          "label": "RSI Period",
          "default": 14,
          "type": "number",
          "min": 7,
          "max": 21
        },
        ...
      ]
    }
  ]
}
```

## Troubleshooting

### Strategy not appearing in dropdown?

1. **Check if Python server is running:**
   ```bash
   curl http://localhost:8000/health
   # Should return: {"status": "operational", ...}
   ```

2. **Check if registry endpoint works:**
   ```bash
   curl http://localhost:8000/strategies/registry
   # Should return JSON with "rsi-mean-rev-v1"
   ```

3. **Check if strategy is in registry file:**
   ```bash
   grep "rsi-mean-rev-v1" src/core/strategy_registry.py
   # Should show the strategy definition
   ```

4. **Reload frontend page:**
   - Press `Ctrl+R` in browser
   - Clear cache and hard reload: `Ctrl+Shift+R`

5. **Check browser console:**
   - Open DevTools: `F12`
   - Check Network tab for `strategy-registry` request
   - Check Console for any errors

## What Happens When You Create a Bot

1. Frontend sends POST to backend with:
   ```json
   {
     "name": "RSI Mean Reversion - BTC/USDT",
     "core_id": "rsi-mean-rev-v1",
     "pairs": ["BTC/USDT"],
     "parameters": {
       "rsi_period": 14,
       "oversold_level": 30,
       "overbought_level": 70,
       ...
     }
   }
   ```

2. Backend saves to Supabase `quant_strategies` table with:
   - `core_id = "rsi-mean-rev-v1"`
   - `parameters = {...}`

3. When StrategyManager syncs:
   - Loads bot from database
   - Gets `core_id = "rsi-mean-rev-v1"`
   - Instantiates `RSIMeanReversionStrategy()`
   - Starts paper trading

## Architecture Diagram

```
┌─────────────────────────────────────┐
│     Frontend                        │
│  (React/Next.js)                    │
│                                     │
│  Page: /quant-ops/strategies        │
│  Hook: useStrategies()              │
│  Component: CreateStrategyModal     │
└──────────────┬──────────────────────┘
               │ fetch('/strategies/registry')
               ↓
┌─────────────────────────────────────┐
│     Backend (FastAPI)               │
│     Port: 8000                      │
│                                     │
│  GET /strategies/registry           │
│  Handler: get_strategy_registry()   │
└──────────────┬──────────────────────┘
               │ return get_full_registry()
               ↓
┌─────────────────────────────────────┐
│     Strategy Registry               │
│     (strategy_registry.py)          │
│                                     │
│  STRATEGY_REGISTRY dict:            │
│  ├─ "hybrid-core-v1"                │
│  ├─ "atr-breakout-v1"               │
│  └─ "rsi-mean-rev-v1" ← NEW!        │
└─────────────────────────────────────┘
```

## Next Steps

1. **Start backend:** `python3 src/main.py`
2. **Open frontend:** `http://localhost:3000/quant-ops/strategies`
3. **Create bot:** Click "New Strategy Blueprint" → Select RSI → Submit
4. **Monitor:** Bot appears in strategies grid
5. **Trade:** Activate and start paper trading

All data is saved to Supabase `quant_strategies` table.
