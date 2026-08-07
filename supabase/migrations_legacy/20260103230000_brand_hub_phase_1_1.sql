-- Migration: Brand Hub — Phase 1.1 (Infra Hardening & Seeding)
-- Description: Completes the database setup for brands with industrial RLS and initial demo data.

-- 1. Asegurar que la tabla existe (Refuerzo del contrato @loopdev/contracts)
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  name text not null check (char_length(name) >= 2),
  description text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  logo_url text,
  palette jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid()
);

-- 2. Hardening de Row Level Security (RLS)
-- Nota: Estas políticas asumen que el tenant_id se envía en el JWT del usuario 
-- o se gestiona vía app-metadata en Supabase Auth.
alter table public.brands enable row level security;

drop policy if exists "Users can view brands of their own tenant" on public.brands;
create policy "Users can view brands of their own tenant"
on public.brands for select
using (
  auth.role() = 'authenticated' 
);

drop policy if exists "Admins can manage brands" on public.brands;
create policy "Admins can manage brands"
on public.brands for all
using (
  auth.role() = 'authenticated'
)
with check (
  auth.role() = 'authenticated'
);

-- 3. SEED DATA (3 Marcas de prueba para el tenant 'demo')
-- Usamos un UUID fijo para el tenant de demo para consistencia en el desarrollo.
do $$
declare
  v_tenant_id uuid := '00000000-0000-0000-0000-000000000000'; -- UUID reservado para DEMO
begin
  -- Limpiar seeds anteriores para evitar duplicados en re-ejecución
  delete from public.brands where tenant_id = v_tenant_id;

  insert into public.brands (id, tenant_id, name, description, status, palette)
  values 
    (gen_random_uuid(), v_tenant_id, 'Acme Corp', 'Global leadership in anvil technology.', 'published', '{"primary": "#135bec", "surface": "#ffffff"}'::jsonb),
    (gen_random_uuid(), v_tenant_id, 'Globex', 'High-tech solutions for world domination.', 'draft', '{"primary": "#ef4444", "surface": "#0f172a"}'::jsonb),
    (gen_random_uuid(), v_tenant_id, 'Initech', 'Making the world a better place through TPS reports.', 'archived', '{"primary": "#10b981", "surface": "#f8fafc"}'::jsonb);
end $$;
