# Quick Fix: Backend Restart (Copy-Paste Instructions)

## Problem Summary
✅ Migration executed → Columns created in Supabase  
❌ Frontend not showing metrics → Backend not detecting new columns

## Root Cause
Backend loads `allowed_fields` at startup. If migration happened while backend was running, backend never learned about new columns and uses JSON fallback.

## Solution: Restart Backend

### Step 1: Stop Backend
In your terminal where backend is running:
```bash
Ctrl+C
```

Wait 2-3 seconds until you see:
```
✅ Shutting down Quant Core Engine...
✅ Application shutdown complete
```

### Step 2: Start Backend Again
```bash
python -m src.main
```

Wait until you see:
```
✅ Started server process [xxxx]
✅ Application startup complete
✅ Uvicorn running on http://0.0.0.0:8000
```

### Step 3: Verify Success
Look for this in backend logs (~30 seconds after startup):
```
DEBUG | [RSI Pro Test] Metrics updated - Price: $X, SMA: $Y, ATR: Z
```

If you see this → ✅ Working! Metrics will appear on dashboard in ~40 seconds total.

If you see "Filtered out unknown fields..." → Backend didn't detect columns yet, restart again.

### Step 4: Check Dashboard
1. Open: http://localhost:3000/quant-ops/bots
2. Look for BotCard component
3. Should show: `currentPrice`, `currentSma`, `currentAtr` values

---

## Timeline
- **Now**: Restart backend (Ctrl+C + python -m src.main)
- **+10 sec**: Backend online, detecting new columns
- **+30 sec**: First metrics calculated and saved to DB
- **+35 sec**: Frontend polls and reads metrics
- **+40 sec**: Dashboard displays live values ✅

---

## Verification Checklist
- [ ] Backend stopped (Ctrl+C)
- [ ] Backend restarted (python -m src.main)
- [ ] See "Uvicorn running on http://0.0.0.0:8000"
- [ ] See "Metrics updated - Price: $..." in logs
- [ ] Waited 40 seconds
- [ ] Dashboard shows currentPrice, currentSma, currentAtr ✅

---

## If Still Not Working

### Check 1: Backend logs
```
✅ Good: "Metrics updated - Price: $..."
❌ Bad: "Filtered out unknown fields for bot..."
```
If bad → Restart backend again

### Check 2: Frontend DevTools
1. F12 → Network tab
2. Search for "quant_bots" API call
3. Response should contain:
   ```json
   {
     "last_price": 70509.34,
     "last_sma": 70707.70,
     "last_atr": 100.84,
     "last_metrics_update": "..."
   }
   ```

### Check 3: Clear frontend cache
```bash
F12 → Application → Clear cache
Ctrl+Shift+R (hard refresh)
```

### Check 4: Nuclear option
Restart backend one more time
```bash
Ctrl+C
sleep 3
python -m src.main
```

---

## Detailed Explanation
See: `/loopdev/FRONTEND_METRICS_TROUBLESHOOTING.md` for full troubleshooting guide.
