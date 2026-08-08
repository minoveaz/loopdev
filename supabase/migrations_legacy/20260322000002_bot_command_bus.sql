-- 1. Añadir bus de comandos manuales a la tabla quant_bots
-- Este campo actúa como un buzón de mensajes del Frontend -> Backend (Tier D)
ALTER TABLE public.quant_bots 
ADD COLUMN IF NOT EXISTS pending_command TEXT DEFAULT NULL;

-- 2. Documentación técnica
COMMENT ON COLUMN public.quant_bots.pending_command IS 'Bus de comandos para intervenciones manuales (MARKET_EXIT, TP_NOW, MOVE_TO_BE).';
