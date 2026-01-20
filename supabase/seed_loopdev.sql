-- Seed: LoopDev Brand
-- Description: Inserts the official LoopDev brand into the system.

DO $$
DECLARE
  v_tenant_id uuid := '00000000-0000-0000-0000-000000000000'; -- Tenant DEMO (Ajustar si es necesario)
BEGIN
  INSERT INTO public.brands (
    name, 
    description, 
    status, 
    tenant_id, 
    palette,
    typography
  )
  VALUES (
    'LoopDev',
    'The Operating System for Modern Engineering Teams. Built for scale, governed by rules.',
    'published',
    v_tenant_id,
    '{
      "primary": "#135bec",
      "surface": "#0d121b",
      "accent": "#00f2ff",
      "typography": "#ffffff"
    }'::jsonb,
    '{
      "primary": {
        "family": "Inter",
        "type": "sans",
        "source": "google",
        "sourceUrl": "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap",
        "license": "OFL (Open Font License)",
        "description": "Designed for computer screens, Inter features a tall x-height to aid in readability of mixed-case and lower-case text.",
        "variants": [
          {"weight": 400, "style": "normal", "usage": "Body text"},
          {"weight": 600, "style": "normal", "usage": "UI emphasis"},
          {"weight": 900, "style": "normal", "usage": "Display headings"}
        ],
        "fallbacks": ["system-ui", "-apple-system", "sans-serif"]
      },
      "secondary": {
        "family": "JetBrains Mono",
        "type": "mono",
        "source": "google",
        "license": "OFL (Open Font License)",
        "description": "A typeface for developers. Its characters have increased height for better readability in code.",
        "variants": [
          {"weight": 400, "style": "normal", "usage": "Code blocks"},
          {"weight": 700, "style": "normal", "usage": "Technical data keys"}
        ],
        "fallbacks": ["Menlo", "Monaco", "monospace"]
      },
      "baseSize": 16,
      "scaleRatio": 1.25,
      "lineHeightBase": 1.5,
      "aiOptimized": true
    }'::jsonb
  )
  ON CONFLICT DO NOTHING;
END $$;
