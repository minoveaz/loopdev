-- CRM Configurable Field Groups and Sections Foundation
-- Additive migration: adds enriched core fields, JSONB attributes container, and section configs.

-- 1. Extend crm_contacts with enterprise core fields and JSONB attributes
alter table public.crm_contacts
  add column if not exists second_last_name text,
  add column if not exists preferred_name text,
  add column if not exists document_type text,
  add column if not exists document_number text,
  add column if not exists birth_date date,
  add column if not exists gender text,
  add column if not exists preferred_channel text,
  add column if not exists preferred_language text default 'es',
  add column if not exists address_line1 text,
  add column if not exists address_line2 text,
  add column if not exists city text,
  add column if not exists state_province text,
  add column if not exists postal_code text,
  add column if not exists country text default 'ES',
  add column if not exists job_title text,
  add column if not exists department text,
  add column if not exists attributes jsonb not null default '{}'::jsonb;

create index if not exists crm_contacts_document_idx
  on public.crm_contacts(organization_id, document_type, document_number)
  where document_number is not null;

create index if not exists crm_contacts_attributes_gin_idx
  on public.crm_contacts using gin (attributes);

-- 2. Extend crm_leads with qualification fields and JSONB attributes
alter table public.crm_leads
  add column if not exists estimated_budget numeric(14, 2),
  add column if not exists purchase_timeline text,
  add column if not exists lead_score integer,
  add column if not exists attributes jsonb not null default '{}'::jsonb;

create index if not exists crm_leads_attributes_gin_idx
  on public.crm_leads using gin (attributes);

-- 3. Create table for section field configurations per organization
create table if not exists public.crm_section_field_configs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  section_key text not null,
  enabled_groups jsonb not null default '[]'::jsonb,
  visible_fields jsonb not null default '[]'::jsonb,
  required_fields jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, section_key),
  check (length(trim(section_key)) > 0)
);

create index if not exists crm_section_field_configs_org_idx
  on public.crm_section_field_configs(organization_id);

alter table public.crm_section_field_configs enable row level security;

create policy crm_section_field_configs_read on public.crm_section_field_configs
  for select to authenticated
  using (public.has_organization_permission(organization_id, 'crm.read'));

create policy crm_section_field_configs_write on public.crm_section_field_configs
  for all to authenticated
  using (public.has_organization_permission(organization_id, 'crm.manage'))
  with check (public.has_organization_permission(organization_id, 'crm.manage'));
