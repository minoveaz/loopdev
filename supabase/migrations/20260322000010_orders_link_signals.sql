-- Vincular Órdenes con Señales (Audit Trail Link)
ALTER TABLE public.quant_orders 
ADD COLUMN IF NOT EXISTS signal_id UUID REFERENCES public.quant_signals(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.quant_orders.signal_id IS 'ID de la señal que originó esta orden (Vínculo Tier B -> Tier C).';
