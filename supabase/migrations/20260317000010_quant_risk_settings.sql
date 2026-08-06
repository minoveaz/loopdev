-- Migration: Global Risk Control Settings
-- Description: Establishes account-level safety parameters and emergency controls.

CREATE TABLE IF NOT EXISTS public.quant_risk_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL UNIQUE REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    -- Emergency Controls
    kill_switch_active BOOLEAN DEFAULT false,
    
    -- Global Account Limits
    max_daily_loss_usdt DECIMAL DEFAULT 500.0,
    max_total_exposure_usdt DECIMAL DEFAULT 5000.0,
    max_concurrent_bots INTEGER DEFAULT 10,
    
    -- Notifications
    alert_threshold_pct DECIMAL DEFAULT 80.0, -- Alert when reaching 80% of any limit
    
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed default settings for the demo tenant
INSERT INTO public.quant_risk_settings (tenant_id, kill_switch_active, max_daily_loss_usdt, max_total_exposure_usdt)
VALUES ('00000000-0000-0000-0000-000000000000', false, 500.0, 5000.0)
ON CONFLICT (tenant_id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.quant_risk_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own risk settings" ON public.quant_risk_settings FOR ALL USING (tenant_id = auth.uid() OR tenant_id = '00000000-0000-0000-0000-000000000000');

COMMENT ON TABLE public.quant_risk_settings IS 'Global safety and risk governance parameters for the trading engine.';
