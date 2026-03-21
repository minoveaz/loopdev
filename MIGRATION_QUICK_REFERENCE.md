# Real-time Metrics Migration - Quick Reference

## 🚀 Migration File Created

**Location**: `/loopdev/supabase/migrations/20260320000018_bot_realtime_metrics.sql`

## ✅ What's Inside

5 new columns:
- `last_price` - Current market price
- `last_sma` - Simple Moving Average (20 periods)
- `last_atr` - Average True Range (14 periods)
- `last_sentiment` - Market sentiment indicator
- `last_metrics_update` - Timestamp of last update

2 performance indices:
- `idx_quant_bots_metrics_update` - For efficient polling
- `idx_quant_bots_last_price` - For price-based queries

## 🔧 How to Execute

### Option 1: Supabase Dashboard (Easiest)
```
1. Go to: https://supabase.co/dashboard
2. Project: sukjcsylkljiyvfklxvj
3. SQL Editor → "+ New Query"
4. Copy entire content from:
   /loopdev/supabase/migrations/20260320000018_bot_realtime_metrics.sql
5. Click: RUN (green button)
6. Wait: 2-3 seconds
7. Success: "Success" message in console
```

### Option 2: Supabase CLI
```bash
cd /Users/minoveaz/Documents/Proyectos/loopdev
supabase db push
```

### Option 3: psql (Advanced)
```bash
psql <connection-string> < supabase/migrations/20260320000018_bot_realtime_metrics.sql
```

## 📋 SQL Content (for copy-paste)

```sql
-- Migration: Bot Real-time Metrics Columns
-- Description: Adds dedicated columns for real-time bot metrics (price, SMA, ATR) to enable efficient dashboard updates.

ALTER TABLE public.quant_bots 
    ADD COLUMN IF NOT EXISTS last_price DECIMAL(20, 8),
    ADD COLUMN IF NOT EXISTS last_sma DECIMAL(20, 8),
    ADD COLUMN IF NOT EXISTS last_atr DECIMAL(20, 8),
    ADD COLUMN IF NOT EXISTS last_sentiment VARCHAR(50),
    ADD COLUMN IF NOT EXISTS last_metrics_update TIMESTAMPTZ;

COMMENT ON COLUMN public.quant_bots.last_price IS 'The most recent price fetched from the exchange for this trading pair.';
COMMENT ON COLUMN public.quant_bots.last_sma IS 'The Simple Moving Average (20 periods) calculated from the last 60 candles.';
COMMENT ON COLUMN public.quant_bots.last_atr IS 'The Average True Range (14 periods) for volatility measurement.';
COMMENT ON COLUMN public.quant_bots.last_sentiment IS 'Market sentiment derived from macro analysis or market regime detection (bullish/bearish/neutral).';
COMMENT ON COLUMN public.quant_bots.last_metrics_update IS 'Timestamp when these metrics were last updated by the backend strategy manager.';

CREATE INDEX IF NOT EXISTS idx_quant_bots_metrics_update 
    ON public.quant_bots(last_metrics_update DESC);

CREATE INDEX IF NOT EXISTS idx_quant_bots_last_price 
    ON public.quant_bots(last_price);

NOTIFY pgrst, 'reload schema';
```

## ⏱️ Time Required

- Execution: **< 5 seconds**
- Full process (including verification): **~2 minutes**

## ✅ After Migration

- Backend automatically detects new columns
- Frontend starts reading live metrics
- No code changes needed
- No server restart required (but recommended)

## 🔍 Verification

To verify migration was successful:

```sql
-- Check columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'quant_bots' 
AND column_name LIKE 'last_%';

-- Should return 5 rows:
-- last_price | DECIMAL
-- last_sma | DECIMAL
-- last_atr | DECIMAL
-- last_sentiment | VARCHAR
-- last_metrics_update | TIMESTAMPTZ
```

## 🎯 What Happens Next

1. **Backend** (strategy_manager.py)
   - Every 60s: Fetches OHLCV from Binance
   - Calculates SMA20 and ATR14
   - Updates last_price, last_sma, last_atr, last_metrics_update

2. **Frontend** (useBotFleet.ts)
   - Every 5s: Polls Supabase for metrics
   - Maps to currentPrice, currentSma, currentAtr
   - Renders in BotCard component

3. **Dashboard** (http://localhost:3000/quant-ops/bots)
   - Displays live price updates
   - Shows SMA and ATR values
   - Updates every 5-60 seconds (depending on backend loop)

## 📞 If Something Goes Wrong

**Error: Column already exists**
- Safe to ignore - migration uses `IF NOT EXISTS`
- Run again if needed

**Error: Permission denied**
- Ensure using SERVICE_ROLE_KEY (not ANON_KEY)
- This key has full admin access

**Error: Index already exists**
- Safe to ignore - migration uses `CREATE INDEX IF NOT EXISTS`

**Metrics not showing in dashboard**
1. Verify migration executed successfully
2. Check backend logs: `backend running? active bots?`
3. Wait 60 seconds for first metrics to be calculated
4. Refresh frontend page

## 📚 Related Files

- Backend: `/loopdev/modules/mod-quant-core/src/core/strategy_manager.py`
- Frontend: `/loopdev/apps/loopdev-os/src/hooks/trading/useBotFleet.ts`
- Plan: `/Users/minoveaz/.copilot/session-state/.../plan.md`

---

**Status**: ✅ Ready to execute  
**Last Updated**: 2026-03-20  
**Estimated Completion**: ~15 minutes after execution
