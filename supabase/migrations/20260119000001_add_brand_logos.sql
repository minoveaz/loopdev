-- Migration: Add Logos column to Brands
-- Description: Enables persistent storage for brand-specific logo assets (Isotype, Lockups).

ALTER TABLE public.brands
ADD COLUMN IF NOT EXISTS logos JSONB DEFAULT NULL;

-- Comment for documentation
COMMENT ON COLUMN public.brands.logos IS 'Stores the logo system assets (Isotype, Lockups, Variants) modeled by LogoSystemSchema.';
