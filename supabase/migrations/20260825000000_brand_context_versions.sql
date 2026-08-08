-- Immutable Brand Hub snapshots consumed by Content Engine and Campaign Orchestrator.
create table if not exists public.brand_context_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  brand_id uuid not null,
  version_number integer not null,
  status text not null default 'draft',
  snapshot jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint brand_context_versions_status_check
    check (status in ('draft', 'in_review', 'approved', 'published')),
  constraint brand_context_versions_number_check
    check (version_number > 0),
  constraint brand_context_versions_organization_fkey
    foreign key (organization_id) references public.organizations(id) on delete restrict,
  constraint brand_context_versions_brand_fkey
    foreign key (brand_id, organization_id)
    references public.brands(id, organization_id) on delete restrict,
  constraint brand_context_versions_unique_number
    unique (brand_id, version_number)
);

alter table public.marketing_campaign_records
  add column if not exists brand_version_id uuid;

alter table public.marketing_campaign_records
  drop constraint if exists marketing_campaign_records_brand_version_fkey;

alter table public.marketing_campaign_records
  add constraint marketing_campaign_records_brand_version_fkey
  foreign key (brand_version_id) references public.brand_context_versions(id) on delete restrict;

create index if not exists brand_context_versions_scope_idx
  on public.brand_context_versions(organization_id, brand_id, status);

create index if not exists marketing_campaign_records_brand_version_idx
  on public.marketing_campaign_records(brand_version_id);

alter table public.brand_context_versions enable row level security;

create policy "organization marketing users can read brand context versions"
on public.brand_context_versions for select to authenticated
using (public.has_organization_permission(organization_id, 'marketing.read'));

create policy "organization marketing editors can create brand context versions"
on public.brand_context_versions for insert to authenticated
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing editors can update brand context versions"
on public.brand_context_versions for update to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'))
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing admins can delete brand context versions"
on public.brand_context_versions for delete to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'));

grant select, insert, update, delete on table public.brand_context_versions to authenticated;
grant select, insert, update, delete on table public.marketing_campaign_records to authenticated;
