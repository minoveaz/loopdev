# Frontend Metrics Not Showing - Troubleshooting & Solution

## Problem
Migration was executed successfully ✅, but frontend dashboard still not showing live metrics (currentPrice, currentSma, currentAtr).

## Root Cause
Backend loads `allowed_fields` set at **STARTUP ONLY**. If migration executed while backend was already running, backend continues using JSON fallback and never writes to new columns.

## Solution: Backend Restart Required

### Step 1: Stop the Backend
In your terminal where backend is running:
```bash
Ctrl+C
# Wait 2-3 seconds for shutdown
# Should see: "Quant Core Engine Stopped Safely"
```

### Step 2: Restart the Backend
```bash
cd /Users/minoveaz/Documents/Proyectos/loopdev/modules/mod-quant-core
python -m src.main
```

### Step 3: Wait for Startup Confirmation
Look for these logs:
```
✅ Started server process [PID]
✅ Application startup complete
✅ Uvicorn running on http://0.0.0.0:8000
```

### Step 4: Verify Backend Detected Columns
Check logs for:
```
✅ CORRECT: "Metrics updated - Price: $X, SMA: $Y, ATR: Z"
❌ WRONG: "Filtered out unknown fields for bot...: {'last_price', 'last_sma'...}"
```

If you see WRONG → Restart backend again

## Timeline After Restart
| Time | Event |
|------|-------|
| Now | Backend restarts, loads allowed_fields (includes 5 new columns) |
| +10s | Backend online, bots starting |
| +30s | First metrics calculated and saved |
| +35s | Frontend polls and reads metrics |
| +40s | ✅ Dashboard shows live values |

## Verification Checklist

### 1. Database Level (Supabase Dashboard)
Run this SQL in SQL Editor:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'quant_bots' 
AND column_name LIKE 'last_%'
ORDER BY column_name;
```

Expected: 5 rows
- last_atr | DECIMAL
- last_metrics_update | TIMESTAMP WITH TIME ZONE
- last_price | DECIMAL
- last_sentiment | VARCHAR
- last_sma | DECIMAL

### 2. Backend Level (Terminal Logs)
After restart, look for:
```
DEBUG | [RSI Pro Test] Metrics updated - Price: $70509.34, SMA: $70707.70, ATR: 100.84
```

This confirms backend is:
- Detecting new columns
- Calculating metrics
- Writing to dedicated columns (not JSON fallback)

### 3. Frontend Level (Browser DevTools)
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Search for "quant_bots" API call
5. Click response → Check JSON payload
6. Should contain:
   ```json
   {
     "id": "...",
     "last_price": 70509.34,
     "last_sma": 70707.70,
     "last_atr": 100.84,
     "last_metrics_update": "2026-03-20T10:00:00Z"
   }
   ```

## Why This Happens

Backend code (strategy_manager.py line 109-125):
```python
allowed_fields = {
    # ... other fields ...
    # New metrics columns (added via migration)
    'last_price', 'last_sma', 'last_atr', 'last_sentiment', 'last_metrics_update',
}
```

This set is initialized **once** when StrategyManager starts. It's not dynamic.

When backend was already running during migration:
- Migration created columns in DB ✅
- But backend's `allowed_fields` still didn't include them ❌
- So `update_bot_state()` filtered them out silently ❌
- Backend fell back to JSON storage ❌

After restart:
- Backend initializes fresh ✅
- `allowed_fields` now includes 5 new columns ✅
- Columns written directly ✅
- Frontend reads columns ✅
- Dashboard shows values ✅

## If Issues Persist

### Issue: Still seeing "Filtered out unknown fields" after restart
**Solution:**
1. Stop backend (Ctrl+C)
2. Check connection string in .env is correct
3. Run: `supabase db push` (if CLI installed)
4. Restart backend again

### Issue: Backend not detecting bots at startup
**Solution:**
1. Verify bots exist in Supabase `quant_bots` table
2. Check SUPABASE_URL and SERVICE_ROLE_KEY in .env
3. Look for errors: "Error syncing bots from database"

### Issue: Frontend not updating even after backend writes
**Solution:**
1. Open DevTools (F12) → Application → Cache Storage
2. Delete React Query cache entries
3. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
4. Check Network tab to confirm fresh API calls

## Summary
```
Migration SQL: ✅ Created successfully
Columns in DB: ✅ Exist in Supabase
Backend restart: 🔧 REQUIRED (do this now)
Frontend display: ⏳ Will work after backend restart
```

**Next Action:** Restart backend and wait 40 seconds for dashboard to update.
