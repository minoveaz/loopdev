# Real-Time Metrics Debugging Guide

## Problem
Backend updates metrics every 60 seconds, but frontend shows static values (looks like hardcoded data).

## Solution Steps

### Step 1: Hard Refresh Browser Cache
**This is THE most important step!**

The QueryProvider was updated but your browser might have the old version cached.

**Option A: DevTools Method (Recommended)**
1. Open DevTools: `F12`
2. Right-click on the Refresh button
3. Select: **"Empty cache and hard refresh"**
4. Wait for page to fully load

**Option B: Keyboard Shortcut**
- **Windows/Linux**: `Ctrl+Shift+R`
- **Mac**: `Cmd+Shift+R`

Wait 3-5 seconds for complete reload.

---

### Step 2: Check Console Logs
After hard refresh, look for console messages:

1. `F12` → **Console** tab
2. You should see logs like:
   ```
   [Bot RSI Pro Test] Price: $70570.20, SMA: $70707.7, ATR: 100.84
   ```

3. **Expected behavior**: These logs appear **every 5 seconds**
   ```
   [Bot RSI Pro Test] Price: $70570.20...
   [Bot RSI Pro Test] Price: $70575.33...  ← Price changed!
   [Bot RSI Pro Test] Price: $70580.50...  ← Price changed again!
   ```

**If you see these logs:**
- ✅ React Query IS refetching correctly
- ✅ Data IS updating from backend
- ❌ But UI not showing updates = BotCard rendering issue

**If you DON'T see logs:**
- ❌ React Query NOT refetching
- Problem with QueryProvider or hook configuration

---

### Step 3: Verify Network Requests
Check if API calls happen every 5 seconds:

1. `F12` → **Network** tab
2. Filter for: `quant_bots`
3. Refresh page
4. Watch for requests

**Expected (CORRECT):**
```
GET /rest/v1/quant_bots?...  [5.0s]
GET /rest/v1/quant_bots?...  [10.0s]
GET /rest/v1/quant_bots?...  [15.0s]
```
Requests appear every 5 seconds = ✅

**Unexpected (WRONG):**
```
GET /rest/v1/quant_bots?...  [Initial load only]
(No more requests)
```
Only one request = ❌ Problem with refetchInterval

---

### Step 4: Verify Dashboard Updates

After hard refresh, watch the dashboard for 30 seconds:

**Expected (CORRECT):**
- Values change every 5-10 seconds
- Example:
  - t=0s: LIVE_MARKET_PRICE: $70570.20
  - t=5s: LIVE_MARKET_PRICE: $70575.33 ✅ CHANGED
  - t=10s: LIVE_MARKET_PRICE: $70580.50 ✅ CHANGED

**Unexpected (WRONG):**
- Values never change
- Always shows: $70570.20, ATR: 100.8363, SMA: 70707.7

---

## What to Tell Me Next

After following these steps, tell me:

1. **Did you hard refresh?** (Ctrl+Shift+R)
   - [ ] Yes
   - [ ] No

2. **Console logs - what do you see?**
   - [ ] See logs like "[Bot RSI Pro Test] Price: ..."
   - [ ] Don't see any logs
   - [ ] See errors

3. **Network tab - do requests repeat?**
   - [ ] Yes, every 5 seconds ✅
   - [ ] No, only one request
   - [ ] Can't find quant_bots requests

4. **Dashboard - do values update?**
   - [ ] Yes, change every 5-10 seconds ✅
   - [ ] No, stay the same
   - [ ] Change but rarely

---

## Files Modified

1. **QueryProvider.tsx** - Changed `staleTime` from 60000 to 0
   - Location: `/apps/loopdev-os/src/providers/QueryProvider.tsx`
   - Change: `staleTime: 0` enables refetchInterval

2. **useBotFleet.ts** - Added console logging
   - Location: `/apps/loopdev-os/src/hooks/trading/useBotFleet.ts`
   - Shows when data updates

---

## Common Issues & Solutions

| Symptom | Cause | Solution |
|---------|-------|----------|
| Console logs but UI doesn't update | BotCard not re-rendering | Force reload entire browser |
| No console logs | Cache issue | Hard refresh (Ctrl+Shift+R) |
| Requests only once | staleTime not working | Verify QueryProvider changes saved |
| Browser shows 404 on quant_bots | Supabase connection | Check NEXT_PUBLIC_SUPABASE_URL in .env |

---

## Next Steps After Verification

Once you confirm which scenario you're in:
- **Scenario A**: Logs show + values update = ✅ WORKING, clean up console.log
- **Scenario B**: Logs show + values don't update = BotCard has rendering issue
- **Scenario C**: No logs at all = QueryProvider config issue

Tell me which scenario and I'll fix it immediately!
