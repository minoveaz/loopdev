-- Update Brand Palette to v1.5 (Semantic Tokens)
UPDATE public.brands
SET palette = '{
  "tokens": [
    {
      "id": "t1",
      "name": "brand.primary",
      "description": "Main brand color used for primary actions and structure.",
      "group": "core",
      "role": "bg",
      "resolvesTo": { "light": "#135bec", "dark": "#135bec" }
    },
    {
      "id": "t2",
      "name": "brand.accent",
      "description": "High-energy color for AI features and highlights.",
      "group": "core",
      "role": "bg",
      "resolvesTo": { "light": "#ffcc00", "dark": "#ffcc00" }
    },
    {
      "id": "t3",
      "name": "status.success",
      "description": "Positive validation and success states.",
      "group": "semantic",
      "role": "status",
      "resolvesTo": { "light": "#10b981", "dark": "#059669" }
    },
    {
      "id": "t4",
      "name": "status.error",
      "description": "Critical errors and blocking states.",
      "group": "semantic",
      "role": "status",
      "resolvesTo": { "light": "#ef4444", "dark": "#dc2626" }
    },
    {
      "id": "t5",
      "name": "surface.canvas",
      "description": "Main page background color.",
      "group": "neutral",
      "role": "bg",
      "resolvesTo": { "light": "#f8fafc", "dark": "#0d121b" }
    }
  ]
}'::jsonb
WHERE name = 'LoopDev';
