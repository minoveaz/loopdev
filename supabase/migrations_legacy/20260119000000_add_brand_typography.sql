-- Migration: Add Typography column to Brands
-- Description: Enables persistent storage for brand-specific typographic systems.

ALTER TABLE public.brands
ADD COLUMN IF NOT EXISTS typography JSONB DEFAULT '{
  "primary": {
    "family": "Inter",
    "type": "sans",
    "source": "google",
    "variants": [],
    "fallbacks": ["sans-serif"]
  },
  "baseSize": 16,
  "scaleRatio": 1.25,
  "lineHeightBase": 1.5,
  "aiOptimized": true
}'::jsonb;

-- Comment for documentation
COMMENT ON COLUMN public.brands.typography IS 'Stores the typographic system configuration (fonts, scales, ratios) modeled by TypographySystemSchema.';
