-- Migration: Multi-Timeframe Optimization
-- Description: Adds specialized indexes to handle 1m, 5m and 15m data efficiently.
-- Created: 2026-04-02

-- 1. Specialized index for Strategy Engine (Fastest possible lookups for latest candles)
CREATE INDEX IF NOT EXISTS idx_market_history_strategy_fast_lookup 
ON public.quant_market_history (pair, timeframe, environment, timestamp DESC);

-- 2. Index for High-Fidelity Audit Replay (Visual Sync)
CREATE INDEX IF NOT EXISTS idx_market_history_audit_time_lookup
ON public.quant_market_history (timeframe, timestamp DESC);

-- 3. Optimization for Data Sentinel (Backfill integrity checks)
CREATE INDEX IF NOT EXISTS idx_market_history_sentinel_sync
ON public.quant_market_history (pair, timeframe, timestamp);

-- Notify PostgREST to refresh the schema cache
NOTIFY pgrst, 'reload schema';
