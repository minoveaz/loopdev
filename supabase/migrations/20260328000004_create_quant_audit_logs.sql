-- Migration: Industrial Audit Trail
-- Description: Creates the quant_audit_logs table to store detailed trade lifecycle events.
-- Created: 2026-03-28

-- 1. Create the Audit Logs Table
CREATE TABLE IF NOT EXISTS public.quant_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_id UUID NOT NULL REFERENCES public.quant_bots(id) ON DELETE CASCADE,
    tenant_id UUID DEFAULT '00000000-0000-0000-0000-000000000000',
    pair TEXT NOT NULL,
    
    -- Event Context
    event_type TEXT NOT NULL, -- ENTRY, EXIT, BE_SHIELD_ACTIVATED, TRAILING_STOP_MOVED, MANUAL_EXIT
    side TEXT, -- LONG, SHORT
    price BIGINT NOT NULL, -- Price in cents
    pnl_pct DECIMAL(10, 4) DEFAULT 0.0,
    
    -- Full Strategy Context (Snapshot)
    logic_snapshot JSONB DEFAULT '{}'::jsonb,
    
    -- Timing
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_bot_id ON public.quant_audit_logs(bot_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.quant_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON public.quant_audit_logs(event_type);

-- 3. Documentation
COMMENT ON TABLE public.quant_audit_logs IS 'Chronological record of all bot decisions and risk management actions for post-trade analysis.';
COMMENT ON COLUMN public.quant_audit_logs.price IS 'Price at the time of the event, stored in cents (BIGINT).';
COMMENT ON COLUMN public.quant_audit_logs.logic_snapshot IS 'Complete state of strategy indicators and confluence checks at the moment of the event.';

-- 4. Notify PostgREST to refresh the schema cache
NOTIFY pgrst, 'reload schema';
