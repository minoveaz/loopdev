-- 1. Añadir columna signal_strength a la tabla quant_bots
-- Tipo: INTEGER (0-100)
-- Default: 0

ALTER TABLE public.quant_bots 
ADD COLUMN IF NOT EXISTS signal_strength INTEGER DEFAULT 0;

-- 2. Comentario técnico para PostgREST
COMMENT ON COLUMN public.quant_bots.signal_strength IS 'Real-time proximity to a trade signal (0-100). Managed by Tier B Engine.';
