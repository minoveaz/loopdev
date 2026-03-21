# Real-Time Rendering Fix - Complete Solution

## Problem
Backend updated metrics every 60 seconds and were reflected in console logs, but UI never displayed updates (appeared hardcoded/static).

## Root Cause
Object identity issue: Props were recreated every render even though data was the same:
```typescript
// ❌ WRONG - Creates new object every render
<BotCard bot={{ ...bot, macroSentiment: bot.macroSentiment }} />
// Even if bot data is identical, props object is new → React can't detect change
```

## Solution

### 1. Page Level: Memoize Props with useMemo
**File:** `/apps/loopdev-os/src/app/quant-ops/bots/page.tsx`

```typescript
// Import useMemo
import React, { useState, useMemo } from 'react';

// In map function:
const memoizedBot = useMemo(() => ({
  ...bot,
  macroSentiment: bot.macroSentiment,
  priceHistory: bot.priceHistory
}), [
  bot.id,
  bot.name,
  bot.pair,
  bot.status,
  bot.currentPrice,      // ← Critical for real-time
  bot.currentSma,        // ← Critical for real-time
  bot.currentAtr,        // ← Critical for real-time
  // ... other deps
]);

<BotCard bot={memoizedBot} liveState={memoizedLiveState} />
```

**Why:** Only recreates object when actual data changes, not on every parent re-render.

### 2. Component Level: Wrap with React.memo
**File:** `/ds/packages/ui/src/components/composites/trading/BotCard/index.tsx`

```typescript
// Extract to separate component
const BotCardComponent: React.FC<BotCardProps> = ({ bot, ... }) => {
  // ... component code
};

// Wrap with React.memo and custom comparison
export const BotCardIndustrial = React.memo(BotCardComponent, (prevProps, nextProps) => {
  // Return true if props are EQUAL (DON'T re-render)
  const botEqual = 
    prevProps.bot.id === nextProps.bot.id &&
    prevProps.bot.currentPrice === nextProps.bot.currentPrice &&
    prevProps.bot.currentSma === nextProps.bot.currentSma &&
    prevProps.bot.currentAtr === nextProps.bot.currentAtr &&
    prevProps.bot.macroSentiment === nextProps.bot.macroSentiment;
  
  const liveStateEqual = 
    prevProps.liveState?.currentAction === nextProps.liveState?.currentAction &&
    prevProps.liveState?.openPosition?.pnlPct === nextProps.liveState?.openPosition?.pnlPct;
  
  return botEqual && liveStateEqual; // true = skip re-render
});
```

**Why:** Custom comparison only checks relevant fields, ignoring irrelevant prop changes.

## Data Flow (Fixed)

```
Backend: Updates metrics every 60s
    ↓
Supabase: Persists in database
    ↓
React Query: Refetches every 5s (staleTime: 0)
    ↓
useBotFleet: Maps data to props
    ↓
useMemo: Memoizes props (stable references)
    ↓
React.memo: Compares props with custom function
    ↓
BotCard: Only re-renders when data ACTUALLY changes
    ↓
UI: Updates in real-time ✅
```

## Verification Steps

1. **Hard Refresh Browser**
   - Mac: `Cmd+Shift+R`
   - Windows: `Ctrl+Shift+R`

2. **Check Console (F12 → Console)**
   ```
   [Bot RSI Pro Test] Price: $70493.28, SMA: $70547.83, ATR: 50.0809
   [Bot RSI Pro Test] Price: $70494.10, SMA: $70548.15, ATR: 50.1203  ← Changed!
   ```
   Should see logs with changing values every 5 seconds.

3. **Watch Dashboard**
   - Values should update every 5-10 seconds
   - Price, SMA, ATR should visibly change

4. **Network Tab (F12 → Network)**
   - Filter for `quant_bots`
   - Should see requests every 5 seconds
   - Each response should have new values

## Files Modified

| File | Change | Impact |
|------|--------|--------|
| `/apps/loopdev-os/src/app/quant-ops/bots/page.tsx` | Added useMemo for bot & liveState props | Props stable only when data changes |
| `/ds/packages/ui/src/components/composites/trading/BotCard/index.tsx` | Wrapped with React.memo + custom comparison | Component only re-renders on actual changes |

## Configuration Already in Place

✅ `QueryProvider.tsx`: `staleTime: 0` (allows refetch every 5s)
✅ `useBotFleet.ts`: `refetchInterval: 5000` (polls every 5s)
✅ Database: `last_price, last_sma, last_atr` columns mapped

## Performance Impact

- **Positive:** Prevents unnecessary re-renders (React.memo)
- **Minimal overhead:** useMemo only runs when dependencies change
- **Better UX:** Real-time updates now visible

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Still no updates | Browser cache | Hard refresh (Cmd+Shift+R) |
| Console logs but no UI update | Component not detecting props | Clear site data in DevTools |
| Updates every 60s instead of 5s | staleTime still wrong | Restart dev server |
| Only updating sometimes | Conditional rendering issue | Check BotCard isLoading state |

## Related Documentation

- **Real-Time Debugging:** `/loopdev/REAL_TIME_DEBUGGING.md`
- **Migration Reference:** `/loopdev/MIGRATION_QUICK_REFERENCE.md`
- **Backend Strategy Manager:** `/loopdev/modules/mod-quant-core/src/core/strategy_manager.py`
