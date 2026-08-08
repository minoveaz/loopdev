-- Migration: Add Rules Engine column to Brands
-- Description: Enables persistent storage for declarative governance rules.

ALTER TABLE public.brands
ADD COLUMN IF NOT EXISTS rules_engine JSONB DEFAULT '{
  "rules": [],
  "globalPolicy": {
    "blockAlwaysPreventsPublish": true,
    "warnRequiresAcknowledgment": true
  }
}'::jsonb;

-- Comment for documentation
COMMENT ON COLUMN public.brands.rules_engine IS 'Stores the rules engine configuration (triggers, conditions, actions) modeled by RulesEngineSchema.';
