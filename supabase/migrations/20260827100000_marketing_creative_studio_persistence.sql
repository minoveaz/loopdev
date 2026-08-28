-- Creative Studio persistence foundation.
-- Additive and non-destructive: CRM and existing Marketing Studio rows are untouched.
-- Project versions and variants are append-only in this phase.

create table if not exists public.marketing_creative_projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  brand_id uuid not null,
  workspace_id uuid not null,
  name text not null,
  description text,
  type text not null default 'social_post',
  status text not null default 'draft',
  current_version_number integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint marketing_creative_projects_organization_fkey
    foreign key (organization_id) references public.organizations(id) on delete restrict,
  constraint marketing_creative_projects_brand_fkey
    foreign key (brand_id, organization_id)
    references public.brands(id, organization_id) on delete restrict,
  constraint marketing_creative_projects_workspace_fkey
    foreign key (workspace_id, organization_id)
    references public.workspaces(id, organization_id) on delete restrict,
  constraint marketing_creative_projects_type_check
    check (type in ('social_post', 'story', 'advertisement', 'banner', 'other')),
  constraint marketing_creative_projects_status_check
    check (status in ('draft', 'in_review', 'approved', 'archived')),
  constraint marketing_creative_projects_version_check
    check (current_version_number >= 0),
  unique (id, organization_id)
);

create table if not exists public.marketing_creative_project_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  brand_id uuid not null,
  workspace_id uuid not null,
  project_id uuid not null,
  version_number integer not null,
  document jsonb not null default '{}'::jsonb,
  change_summary text,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint marketing_creative_project_versions_organization_fkey
    foreign key (organization_id) references public.organizations(id) on delete restrict,
  constraint marketing_creative_project_versions_brand_fkey
    foreign key (brand_id, organization_id)
    references public.brands(id, organization_id) on delete restrict,
  constraint marketing_creative_project_versions_workspace_fkey
    foreign key (workspace_id, organization_id)
    references public.workspaces(id, organization_id) on delete restrict,
  constraint marketing_creative_project_versions_project_fkey
    foreign key (project_id, organization_id)
    references public.marketing_creative_projects(id, organization_id) on delete cascade,
  constraint marketing_creative_project_versions_number_check
    check (version_number > 0),
  unique (project_id, version_number),
  unique (id, project_id, organization_id)
);

create table if not exists public.marketing_creative_variants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  brand_id uuid not null,
  workspace_id uuid not null,
  project_id uuid not null,
  project_version_id uuid not null,
  key text not null,
  channel text not null,
  format text not null,
  payload jsonb not null default '{}'::jsonb,
  width integer,
  height integer,
  status text not null default 'draft',
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint marketing_creative_variants_organization_fkey
    foreign key (organization_id) references public.organizations(id) on delete restrict,
  constraint marketing_creative_variants_brand_fkey
    foreign key (brand_id, organization_id)
    references public.brands(id, organization_id) on delete restrict,
  constraint marketing_creative_variants_workspace_fkey
    foreign key (workspace_id, organization_id)
    references public.workspaces(id, organization_id) on delete restrict,
  constraint marketing_creative_variants_project_fkey
    foreign key (project_id, organization_id)
    references public.marketing_creative_projects(id, organization_id) on delete cascade,
  constraint marketing_creative_variants_version_fkey
    foreign key (project_version_id, project_id, organization_id)
    references public.marketing_creative_project_versions(id, project_id, organization_id) on delete cascade,
  constraint marketing_creative_variants_key_check
    check (length(trim(key)) > 0),
  constraint marketing_creative_variants_channel_check
    check (channel in ('facebook', 'instagram', 'linkedin', 'tiktok', 'x', 'email', 'other')),
  constraint marketing_creative_variants_format_check
    check (format in ('square', 'portrait', 'landscape', 'story', 'custom')),
  constraint marketing_creative_variants_dimensions_check
    check ((width is null or width > 0) and (height is null or height > 0)),
  constraint marketing_creative_variants_status_check
    check (status in ('draft', 'approved', 'archived')),
  unique (project_version_id, key)
);

create index if not exists marketing_creative_projects_scope_idx
  on public.marketing_creative_projects(organization_id, workspace_id, brand_id, updated_at desc);
create index if not exists marketing_creative_project_versions_scope_idx
  on public.marketing_creative_project_versions(organization_id, project_id, version_number desc);
create index if not exists marketing_creative_variants_scope_idx
  on public.marketing_creative_variants(organization_id, project_version_id, created_at);

alter table public.marketing_creative_projects enable row level security;
alter table public.marketing_creative_project_versions enable row level security;
alter table public.marketing_creative_variants enable row level security;

grant select, insert, update on table public.marketing_creative_projects to authenticated;
grant select, insert on table public.marketing_creative_project_versions to authenticated;
grant select, insert on table public.marketing_creative_variants to authenticated;

create policy "organization marketing users can read creative projects"
on public.marketing_creative_projects for select to authenticated
using (public.has_organization_permission(organization_id, 'marketing.read'));

create policy "organization marketing editors can create creative projects"
on public.marketing_creative_projects for insert to authenticated
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing editors can update creative projects"
on public.marketing_creative_projects for update to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'))
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing users can read creative project versions"
on public.marketing_creative_project_versions for select to authenticated
using (public.has_organization_permission(organization_id, 'marketing.read'));

create policy "organization marketing editors can create creative project versions"
on public.marketing_creative_project_versions for insert to authenticated
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization marketing users can read creative variants"
on public.marketing_creative_variants for select to authenticated
using (public.has_organization_permission(organization_id, 'marketing.read'));

create policy "organization marketing editors can create creative variants"
on public.marketing_creative_variants for insert to authenticated
with check (public.has_organization_permission(organization_id, 'marketing.manage'));
