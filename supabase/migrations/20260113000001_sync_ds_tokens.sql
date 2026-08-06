-- Sync with Official Design System Tokens (color.css)
UPDATE public.brands
SET palette = '{
  "tokens": [
    {
      "id": "brand-primary",
      "name": "brand.primary",
      "description": "LoopDev Designer Primary Blue.",
      "group": "core",
      "role": "bg",
      "resolvesTo": { "light": "#135BEC", "dark": "#135BEC" }
    },
    {
      "id": "brand-energy",
      "name": "brand.secondary",
      "description": "LoopDev Designer Energy Yellow.",
      "group": "core",
      "role": "bg",
      "resolvesTo": { "light": "#FFD025", "dark": "#FFD025" }
    },
    {
      "id": "status-success",
      "name": "status.success",
      "description": "Positive validation state.",
      "group": "semantic",
      "role": "status",
      "resolvesTo": { "light": "#22c55e", "dark": "#22c55e" }
    },
    {
      "id": "status-error",
      "name": "status.error",
      "description": "Critical error state.",
      "group": "semantic",
      "role": "status",
      "resolvesTo": { "light": "#ef4444", "dark": "#ef4444" }
    },
    {
      "id": "surface-canvas",
      "name": "surface.canvas",
      "description": "Main environment background (Space).",
      "group": "neutral",
      "role": "bg",
      "resolvesTo": { "light": "#f8fafc", "dark": "#0F1115" }
    }
  ]
}'::jsonb
WHERE name = 'LoopDev';
