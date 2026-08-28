-- Seed: LoopDev Brand
-- Description: Inserts the official LoopDev brand into the system.

DO $$
DECLARE
  v_organization_id uuid;
BEGIN
  select id into strict v_organization_id
  from public.organizations
  where slug = 'estar-protegidos';

  INSERT INTO public.brands (
    name, 
    description, 
    status, 
    organization_id,
    palette,
    typography,
    logos,
    rules_engine
  )
  VALUES (
    'LoopDev',
    'The Operating System for Modern Engineering Teams. Built for scale, governed by rules.',
    'published',
    v_organization_id,
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
    }'::jsonb,
    '{
      "rules": [
        {
          "id": "r1",
          "name": "WCAG Contrast — Body Text",
          "domain": "visual",
          "status": "active",
          "scope": { "target": "colorToken", "filter": "role == ''bg''" },
          "logic": { "metric": "contrastRatio", "operator": "<", "threshold": 4.5 },
          "enforcement": { "severity": "BLOCK", "blockPublish": true, "requiresAck": true, "allowOverride": false },
          "approval": { "required": true, "approverRole": "design" },
          "explain": {
            "why": "Low contrast reduces readability for users with visual impairments.",
            "risk": "WCAG 2.1 AA failure. High bounce rate from mobile users.",
            "howToFix": "Increase the contrast ratio above 4.5:1 or use the standard surface.canvas background.",
            "doExample": "White text over Loop Blue (#135BEC)",
            "dontExample": "Light Grey text over White background"
          },
          "updatedAt": "2026-01-19T00:00:00Z",
          "updatedBy": "System"
        },
        {
          "id": "r2",
          "name": "Forbidden Language — Absolute Claims",
          "domain": "identity",
          "status": "active",
          "scope": { "target": "claim", "filter": "context == ''marketing''" },
          "logic": { "metric": "forbiddenWords", "operator": "contains", "threshold": ["guaranteed", "perfect", "never"] },
          "enforcement": { "severity": "BLOCK", "blockPublish": true, "requiresAck": true, "allowOverride": true },
          "approval": { "required": true, "approverRole": "legal" },
          "explain": {
            "why": "Absolute claims create legal liability and reduce brand trust through hyperbole.",
            "risk": "FTC/EU compliance audit failure. Brand perceived as ''marketing-heavy'' rather than ''engineering-first''.",
            "howToFix": "Use soft indicators like ''Optimized'', ''Designed for'', or ''Consistent''.",
            "doExample": "Designed for 99.9% uptime",
            "dontExample": "Guaranteed 100% success"
          },
          "updatedAt": "2026-01-19T00:00:00Z",
          "updatedBy": "Legal_Bot"
        },
        {
          "id": "r3",
          "name": "Minimum Font Size (Mobile)",
          "domain": "typography",
          "status": "active",
          "scope": { "target": "fontScale", "filter": "device == ''mobile''" },
          "logic": { "metric": "fontSize", "operator": "<", "threshold": 14 },
          "enforcement": { "severity": "WARN", "blockPublish": false, "requiresAck": true, "allowOverride": true },
          "approval": { "required": false },
          "explain": {
            "why": "Small font sizes significantly impact mobile accessibility.",
            "risk": "Poor user experience on small screens. Accessibility score reduction.",
            "howToFix": "Ensure the base font size for body text is at least 14px (ideally 16px).",
            "doExample": "Body text at 16px",
            "dontExample": "Captions at 10px for main content"
          },
          "updatedAt": "2026-01-19T00:00:00Z",
          "updatedBy": "System"
        }
      ],
      "globalPolicy": {
        "blockAlwaysPreventsPublish": true,
        "warnRequiresAcknowledgment": true
      }
    }'::jsonb
  )
  ON CONFLICT DO NOTHING;
END $$;
