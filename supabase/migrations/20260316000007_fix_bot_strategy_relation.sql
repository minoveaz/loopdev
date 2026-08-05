-- Migration: Fix Bot to Strategy Relationship (V2 - Safe NULL)
-- Description: Converts strategy_id to UUID and establishes formal foreign key relationship.

-- 1. DROP NOT NULL CONSTRAINT TEMPORARILY
ALTER TABLE public.quant_bots ALTER COLUMN strategy_id DROP NOT NULL;

-- 2. Clear invalid UUID strings
UPDATE public.quant_bots SET strategy_id = NULL WHERE strategy_id !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

-- 3. Alter column type to UUID
ALTER TABLE public.quant_bots 
    ALTER COLUMN strategy_id TYPE UUID USING strategy_id::UUID;

-- 4. Add Foreign Key constraint
ALTER TABLE public.quant_bots
    ADD CONSTRAINT fk_bot_strategy
    FOREIGN KEY (strategy_id) 
    REFERENCES public.quant_strategies(id)
    ON DELETE SET NULL;

-- 5. Add index for performance
CREATE INDEX IF NOT EXISTS idx_quant_bots_strategy_id ON public.quant_bots(strategy_id);

COMMENT ON COLUMN public.quant_bots.strategy_id IS 'Formal reference to the trading protocol blueprint.';
