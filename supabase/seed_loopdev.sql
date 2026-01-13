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
    palette
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
    }'::jsonb
  )
  ON CONFLICT DO NOTHING;
END $$;
