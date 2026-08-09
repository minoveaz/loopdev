-- CRM Core and Product Catalog foundation.
-- Additive migration: no legacy CRM or communications rows are modified.

create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  first_name text not null,
  last_name text,
  email text,
  email_normalized text generated always as (lower(nullif(trim(email), ''))) stored,
  phone text,
  phone_normalized text,
  company_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, email_normalized),
  unique (organization_id, phone_normalized),
  check (length(trim(first_name)) > 0)
);

create table if not exists public.crm_companies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  name text not null,
  legal_name text,
  tax_id text,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tax_id),
  check (length(trim(name)) > 0)
);

create table if not exists public.crm_contact_companies (
  organization_id uuid not null references public.organizations(id) on delete restrict,
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  company_id uuid not null references public.crm_companies(id) on delete cascade,
  role text not null default 'other',
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (contact_id, company_id),
  check (role in ('primary', 'employee', 'decision_maker', 'billing', 'other'))
);

create table if not exists public.crm_related_people (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  first_name text not null,
  last_name text,
  role text not null,
  date_of_birth date,
  is_contactable boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (role in ('family_member', 'household_member', 'beneficiary', 'insured', 'other')),
  check (is_contactable = false)
);

create table if not exists public.crm_pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  workspace_id uuid,
  key text not null,
  label text not null,
  position integer not null,
  is_terminal boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_id, key),
  check (position >= 0)
);

alter table public.crm_pipeline_stages
  add constraint crm_pipeline_stages_workspace_fkey
  foreign key (workspace_id, organization_id)
  references public.workspaces(id, organization_id) on delete restrict;

create table if not exists public.crm_leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  contact_id uuid not null references public.crm_contacts(id) on delete restrict,
  brand_id uuid,
  workspace_id uuid,
  stage text not null default 'lead',
  status text not null default 'active',
  source text not null default 'manual',
  campaign text,
  assigned_to_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (stage in ('lead', 'contacted', 'proposal', 'negotiation', 'won', 'lost', 'rejected', 'discarded')),
  check (status in ('active', 'inactive', 'stalled')),
  check (source in ('manual', 'website', 'facebook', 'instagram', 'whatsapp', 'email', 'referral', 'campaign', 'other'))
);

alter table public.crm_leads
  add constraint crm_leads_brand_fkey foreign key (brand_id, organization_id)
  references public.brands(id, organization_id) on delete restrict,
  add constraint crm_leads_workspace_fkey foreign key (workspace_id, organization_id)
  references public.workspaces(id, organization_id) on delete restrict;

create table if not exists public.crm_lead_attributions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  lead_id uuid not null references public.crm_leads(id) on delete cascade,
  source text not null,
  campaign text,
  medium text,
  content text,
  term text,
  captured_at timestamptz not null default now()
);

create table if not exists public.crm_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  lead_id uuid not null references public.crm_leads(id) on delete restrict,
  workspace_id uuid,
  name text not null,
  stage text not null default 'lead',
  amount numeric(14,2),
  currency text not null default 'EUR',
  probability integer,
  expected_close_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (amount is null or amount >= 0),
  check (probability is null or probability between 0 and 100),
  check (currency ~ '^[A-Z]{3}$')
);

alter table public.crm_opportunities
  add constraint crm_opportunities_workspace_fkey
  foreign key (workspace_id, organization_id)
  references public.workspaces(id, organization_id) on delete restrict;

create table if not exists public.crm_activities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  lead_id uuid not null references public.crm_leads(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  type text not null,
  summary text not null,
  details text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  check (type in ('note', 'call', 'status_change', 'task_created', 'task_completed', 'document', 'email', 'whatsapp'))
);

create table if not exists public.crm_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  lead_id uuid not null references public.crm_leads(id) on delete cascade,
  assigned_to_user_id uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'pending',
  priority text not null default 'medium',
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status in ('pending', 'completed', 'cancelled')),
  check (priority in ('low', 'medium', 'high'))
);

create table if not exists public.crm_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  contact_id uuid references public.crm_contacts(id) on delete cascade,
  lead_id uuid references public.crm_leads(id) on delete cascade,
  opportunity_id uuid references public.crm_opportunities(id) on delete cascade,
  author_user_id uuid not null references auth.users(id) on delete restrict,
  body text not null,
  visibility text not null default 'team',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (visibility in ('private', 'team', 'organization')),
  check (contact_id is not null or lead_id is not null or opportunity_id is not null)
);

create table if not exists public.crm_contact_consents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  channel text not null,
  purpose text not null,
  status text not null,
  source text,
  granted_at timestamptz,
  withdrawn_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, contact_id, channel, purpose),
  check (channel in ('email', 'whatsapp', 'instagram', 'facebook_messenger', 'sms', 'phone')),
  check (status in ('granted', 'withdrawn', 'not_requested'))
);

create table if not exists public.crm_audit_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  actor_user_id uuid references auth.users(id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  before_state jsonb,
  after_state jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.catalog_products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  brand_id uuid,
  provider_id uuid,
  parent_product_id uuid references public.catalog_products(id) on delete set null,
  sku text not null,
  name text not null,
  description text,
  type text not null,
  status text not null default 'draft',
  category text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, sku),
  check (type in ('product', 'service', 'plan', 'subscription', 'bundle')),
  check (status in ('draft', 'active', 'archived'))
);

alter table public.catalog_products
  add constraint catalog_products_brand_fkey foreign key (brand_id, organization_id)
  references public.brands(id, organization_id) on delete restrict;

create table if not exists public.catalog_price_books (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  brand_id uuid,
  name text not null,
  currency text not null,
  segment text,
  status text not null default 'draft',
  valid_from timestamptz,
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (currency ~ '^[A-Z]{3}$'),
  check (status in ('draft', 'active', 'archived'))
);

alter table public.catalog_price_books
  add constraint catalog_price_books_brand_fkey foreign key (brand_id, organization_id)
  references public.brands(id, organization_id) on delete restrict;

create table if not exists public.catalog_price_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  price_book_id uuid not null references public.catalog_price_books(id) on delete cascade,
  product_id uuid not null references public.catalog_products(id) on delete restrict,
  unit_price numeric(14,2) not null,
  currency text not null,
  billing_period text not null default 'one_time',
  min_quantity integer not null default 1,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (price_book_id, product_id),
  check (unit_price >= 0),
  check (currency ~ '^[A-Z]{3}$'),
  check (billing_period in ('one_time', 'monthly', 'quarterly', 'annual')),
  check (min_quantity > 0)
);

create table if not exists public.crm_opportunity_products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  opportunity_id uuid not null references public.crm_opportunities(id) on delete cascade,
  product_id uuid not null references public.catalog_products(id) on delete restrict,
  price_entry_id uuid references public.catalog_price_entries(id) on delete set null,
  quote_id uuid,
  quantity numeric(12,3) not null default 1,
  unit_price numeric(14,2),
  total_price numeric(14,2),
  currency text not null default 'EUR',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (quantity > 0),
  check (unit_price is null or unit_price >= 0),
  check (total_price is null or total_price >= 0),
  check (currency ~ '^[A-Z]{3}$')
);

create index if not exists crm_contacts_scope_idx on public.crm_contacts(organization_id);
create index if not exists crm_leads_scope_idx on public.crm_leads(organization_id, brand_id, workspace_id, stage, status);
create index if not exists crm_opportunities_scope_idx on public.crm_opportunities(organization_id, workspace_id, stage);
create index if not exists crm_activities_lead_idx on public.crm_activities(organization_id, lead_id, occurred_at desc);
create index if not exists crm_tasks_assignee_idx on public.crm_tasks(organization_id, assigned_to_user_id, status, due_at);
create index if not exists crm_audit_entity_idx on public.crm_audit_events(organization_id, entity_type, entity_id, created_at desc);
create index if not exists catalog_products_scope_idx on public.catalog_products(organization_id, brand_id, status);
create index if not exists catalog_price_entries_product_idx on public.catalog_price_entries(organization_id, product_id);

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'crm_contacts', 'crm_companies', 'crm_contact_companies', 'crm_related_people',
    'crm_pipeline_stages', 'crm_leads', 'crm_lead_attributions', 'crm_opportunities',
    'crm_activities', 'crm_tasks', 'crm_notes', 'crm_contact_consents', 'crm_audit_events',
    'catalog_products', 'catalog_price_books', 'catalog_price_entries', 'crm_opportunity_products'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', table_name);
    execute format('create policy %I on public.%I for all to authenticated using (public.has_organization_permission(organization_id, ''crm.read'')) with check (public.has_organization_permission(organization_id, ''crm.manage''))', table_name || '_organization_access', table_name);
  end loop;
end $$;
