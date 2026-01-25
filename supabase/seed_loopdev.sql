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
    typography,
    logos
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
    }'::jsonb,
    '{
      "primary": {
        "isotype": {
          "url": "/assets/logo-isotype.svg",
          "rawSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7.5 7.5C6.11929 7.5 5 8.61929 5 10V14C5 15.3807 6.11929 16.5 7.5 16.5C8.88071 16.5 10 15.3807 10 14V10C10 8.61929 8.88071 7.5 7.5 7.5Z\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M16.5 7.5C15.1193 7.5 14 8.61929 14 10V14C14 15.3807 15.1193 16.5 16.5 16.5C17.8807 16.5 19 15.3807 19 14V10C19 8.61929 17.8807 7.5 16.5 7.5Z\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M10 12H14\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>",
          "format": "svg",
          "width": 24,
          "height": 24,
          "alt": "LoopDev Infinite Loop Symbol"
        },
        "horizontal": {
          "url": "/assets/logo-full.svg",
          "rawSvg": "<svg viewBox=\"0 0 120 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><g transform=\"translate(0,0)\"><svg viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7.5 7.5C6.11929 7.5 5 8.61929 5 10V14C5 15.3807 6.11929 16.5 7.5 16.5C8.88071 16.5 10 15.3807 10 14V10C10 8.61929 8.88071 7.5 7.5 7.5Z\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M16.5 7.5C15.1193 7.5 14 8.61929 14 10V14C14 15.3807 15.1193 16.5 16.5 16.5C17.8807 16.5 19 15.3807 19 14V10C19 8.61929 17.8807 7.5 16.5 7.5Z\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M10 12H14\" stroke=\"currentColor\" stroke-width=\"2\"/></svg></g><text x=\"32\" y=\"17\" font-family=\"Inter, sans-serif\" font-weight=\"800\" font-size=\"14\" fill=\"currentColor\">loop.dev</text></svg>",
          "format": "svg",
          "width": 120,
          "height": 24,
          "alt": "LoopDev Horizontal Logo"
        },
        "vertical": {
          "url": "/assets/logo-vertical.svg",
          "rawSvg": "<svg viewBox=\"0 0 64 64\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><g transform=\"translate(20,12) scale(1)\"><svg viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7.5 7.5C6.11929 7.5 5 8.61929 5 10V14C5 15.3807 6.11929 16.5 7.5 16.5C8.88071 16.5 10 15.3807 10 14V10C10 8.61929 8.88071 7.5 7.5 7.5Z\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M16.5 7.5C15.1193 7.5 14 8.61929 14 10V14C14 15.3807 15.1193 16.5 16.5 16.5C17.8807 16.5 19 15.3807 19 14V10C19 8.61929 17.8807 7.5 16.5 7.5Z\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M10 12H14\" stroke=\"currentColor\" stroke-width=\"2\"/></svg></g><text x=\"32\" y=\"52\" text-anchor=\"middle\" font-family=\"Inter, sans-serif\" font-weight=\"800\" font-size=\"8\" fill=\"currentColor\">loop.dev</text></svg>",
          "format": "svg",
          "width": 64,
          "height": 64,
          "alt": "LoopDev Vertical Stack"
        }
      },
      "monochrome": {
        "positive": {
          "isotype": { "rawSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7.5 7.5C6.11929 7.5 5 8.61929 5 10V14C5 15.3807 6.11929 16.5 7.5 16.5C8.88071 16.5 10 15.3807 10 14V10C10 8.61929 8.88071 7.5 7.5 7.5Z\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M16.5 7.5C15.1193 7.5 14 8.61929 14 10V14C14 15.3807 15.1193 16.5 16.5 16.5C17.8807 16.5 19 15.3807 19 14V10C19 8.61929 17.8807 7.5 16.5 7.5Z\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M10 12H14\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>", "format": "svg", "alt": "Monochrome Black" }
        },
        "negative": {
          "isotype": { "rawSvg": "<svg viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7.5 7.5C6.11929 7.5 5 8.61929 5 10V14C5 15.3807 6.11929 16.5 7.5 16.5C8.88071 16.5 10 15.3807 10 14V10C10 8.61929 8.88071 7.5 7.5 7.5Z\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M16.5 7.5C15.1193 7.5 14 8.61929 14 10V14C14 15.3807 15.1193 16.5 16.5 16.5C17.8807 16.5 19 15.3807 19 14V10C19 8.61929 17.8807 7.5 16.5 7.5Z\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M10 12H14\" stroke=\"currentColor\" stroke-width=\"2\"/></svg>", "format": "svg", "alt": "Monochrome White" }
        }
      },
      "specs": {
        "aspectRatio": "1:1 (Symbol) / 5:1 (Lockup)",
        "gridType": "8px Grid System",
        "strokeWeight": "2px (Fluid)",
        "minSize": 16,
        "clearSpace": "1x X-Height"
      }
    }'::jsonb
  )
  ON CONFLICT DO NOTHING;
END $$;
