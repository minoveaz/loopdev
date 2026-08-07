-- Migration: Brand Hub Initialization
-- Description: Sets up the core table for Brands and basic RLS policies.

-- 1. Asegurar que las extensiones necesarias existen
create extension if not exists "uuid-ossp";

-- 2. Tabla Base: BRANDS
-- Esta tabla refleja el contrato definido en @loopdev/contracts (BrandSchema)
create table if not exists public.brands (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null, -- FK a tenants (se asume existencia o se crea mock)
  name text not null check (char_length(name) >= 2),
  description text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  logo_url text,
  palette jsonb default '{}'::jsonb, -- Almacenará los tokens de color
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid default auth.uid() -- Auditoría automática
);

-- 3. Índices para performance
-- Siempre consultaremos por tenant_id, así que debe estar indexado.
create index if not exists idx_brands_tenant on public.brands(tenant_id);

-- 4. Seguridad: Row Level Security (RLS)
-- Primero, habilitamos RLS. Sin esto, la tabla es pública (peligroso).
alter table public.brands enable row level security;

-- Policy A: Lectura
-- Un usuario puede ver las marcas SI pertenece al mismo tenant.
-- (Esta lógica asume que tienes una forma de vincular auth.uid() -> tenant_id en una tabla memberships)
-- Por ahora, usaremos una política simplificada basada en metadata o tabla memberships futura.
-- TODO: Refinar cuando tengamos la tabla 'memberships' oficial.

-- Mock Policy (Simple):
-- Permitir todo si el usuario está autenticado y pasa el tenant_id correcto (Enforcement en App Layer por ahora)
-- Ojo: En producción real, esto debe hacer un JOIN con la tabla de miembros.
create policy "Users can view brands of their own tenant"
on public.brands
for select
using (
  auth.uid() is not null 
  -- AND (exists in memberships...) -> Pendiente de implementar modulo Auth
);

-- Policy B: Escritura
-- Igual que lectura, pero restringido a roles (futuro).
create policy "Users can create brands in their tenant"
on public.brands
for insert
with check (
  auth.uid() is not null
);

-- Policy C: Modificación
create policy "Users can update their tenant brands"
on public.brands
for update
using (auth.uid() is not null);

-- 5. Trigger para updated_at
-- Automatiza la actualización de la fecha.
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_brands_updated_at
before update on public.brands
for each row
execute procedure public.handle_updated_at();
