-- Communications Core phase 2: account onboarding and WhatsApp template lifecycle.

alter table public.communication_accounts
  add column if not exists provider_metadata jsonb not null default '{}'::jsonb,
  add column if not exists connected_at timestamptz,
  add column if not exists last_health_checked_at timestamptz,
  add column if not exists last_error_code text;

alter table public.communication_templates
  add column if not exists account_id uuid,
  add column if not exists name text,
  add column if not exists category text,
  add column if not exists parameter_names jsonb not null default '[]'::jsonb;

alter table public.communication_templates
  add constraint communication_templates_account_org_fkey
    foreign key (account_id, organization_id)
    references public.communication_accounts(id, organization_id)
    on delete restrict,
  add constraint communication_templates_category_check
    check (category in ('authentication', 'marketing', 'utility'));

create table if not exists public.communication_account_onboardings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  brand_id uuid,
  state_hash text not null,
  status text not null default 'pending',
  expires_at timestamptz not null,
  completed_at timestamptz,
  failure_code text,
  created_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, state_hash),
  check (status in ('pending', 'connected', 'failed', 'expired'))
);

alter table public.communication_account_onboardings
  add constraint communication_account_onboardings_brand_org_fkey
    foreign key (brand_id, organization_id)
    references public.brands(id, organization_id)
    on delete restrict;

alter table public.communication_account_onboardings enable row level security;
revoke all on table public.communication_account_onboardings from authenticated;
grant select, insert, update on table public.communication_account_onboardings to authenticated;
create policy communication_account_onboardings_read on public.communication_account_onboardings
  for select to authenticated
  using (public.has_organization_permission(organization_id, 'communications.manage-accounts'));
create policy communication_account_onboardings_insert on public.communication_account_onboardings
  for insert to authenticated
  with check (public.has_organization_permission(organization_id, 'communications.manage-accounts'));
create policy communication_account_onboardings_update on public.communication_account_onboardings
  for update to authenticated
  using (public.has_organization_permission(organization_id, 'communications.manage-accounts'))
  with check (public.has_organization_permission(organization_id, 'communications.manage-accounts'));

create index if not exists communication_templates_account_sync_idx
  on public.communication_templates(organization_id, account_id, status, updated_at desc);
create index if not exists communication_account_onboardings_pending_idx
  on public.communication_account_onboardings(organization_id, status, expires_at);