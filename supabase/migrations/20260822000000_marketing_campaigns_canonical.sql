-- Canonical Marketing Studio campaigns.
-- The legacy table remains available during the migration window.

create table if not exists public.marketing_campaign_records (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  organization_id uuid not null,
  brand_id uuid not null,
  workspace_id uuid not null,
  name text not null,
  objective text not null default '',
  status text not null default 'draft',
  starts_at timestamptz,
  ends_at timestamptz,
  budget numeric,
  currency text not null default 'EUR',
  platforms text[] not null default '{}',
  copies jsonb not null default '{}',
  assets jsonb not null default '[]',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint marketing_campaign_records_organization_fkey
    foreign key (organization_id) references public.organizations(id) on delete restrict,
  constraint marketing_campaign_records_brand_fkey
    foreign key (brand_id, organization_id)
    references public.brands(id, organization_id) on delete restrict,
  constraint marketing_campaign_records_workspace_fkey
    foreign key (workspace_id, organization_id)
    references public.workspaces(id, organization_id) on delete restrict,
  constraint marketing_campaign_records_currency_check
    check (currency ~ '^[A-Z]{3}$'),
  constraint marketing_campaign_records_budget_check
    check (budget is null or budget >= 0)
);

insert into public.marketing_campaign_records (
  legacy_id,
  organization_id,
  brand_id,
  workspace_id,
  name,
  objective,
  status,
  starts_at,
  platforms,
  copies,
  assets,
  created_at,
  updated_at
)
select
  legacy.id,
  legacy.organization_id,
  legacy.brand_id,
  legacy.workspace_id,
  legacy.name,
  coalesce(legacy.objective, ''),
  case
    when legacy.status in ('draft', 'in_review', 'approved', 'scheduled', 'active', 'paused', 'completed', 'archived')
      then legacy.status
    else 'draft'
  end,
  legacy.start_date::timestamptz,
  coalesce(legacy.platforms, '{}'),
  coalesce(legacy.copies, '{}'),
  coalesce(legacy.assets, '[]'),
  coalesce(legacy.created_at, now()),
  coalesce(legacy.updated_at, now())
from public.marketing_campaigns legacy
where not exists (
  select 1
  from public.marketing_campaign_records canonical
  where canonical.legacy_id = legacy.id
);

create index if not exists marketing_campaign_records_scope_idx
  on public.marketing_campaign_records(organization_id, workspace_id, brand_id);

alter table public.marketing_campaign_records enable row level security;

create policy "organization marketing users can read campaign records"
on public.marketing_campaign_records for select to authenticated
using (public.has_organization_permission(organization_id, 'marketing.read'));

create policy "organization marketing editors can create campaign records"
on public.marketing_campaign_records for insert to authenticated
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing editors can update campaign records"
on public.marketing_campaign_records for update to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'))
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing admins can delete campaign records"
on public.marketing_campaign_records for delete to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'));
