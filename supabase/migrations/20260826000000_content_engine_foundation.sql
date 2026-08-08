-- Minimal persistent foundation for Content Engine.
-- Generation providers and workers remain out of scope for this migration.

create table if not exists public.content_briefs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  brand_id uuid not null,
  brand_version_id uuid,
  workspace_id uuid,
  campaign_id uuid,
  name text not null,
  objective text not null,
  audience text,
  locale text not null default 'es-ES',
  call_to_action text,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (organization_id) references public.organizations(id) on delete restrict,
  foreign key (brand_id, organization_id) references public.brands(id, organization_id) on delete restrict,
  foreign key (brand_version_id) references public.brand_context_versions(id) on delete restrict,
  foreign key (workspace_id, organization_id) references public.workspaces(id, organization_id) on delete restrict,
  foreign key (campaign_id) references public.marketing_campaign_records(id) on delete set null
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  brand_id uuid not null,
  brand_version_id uuid,
  workspace_id uuid,
  campaign_id uuid,
  brief_id uuid,
  type text not null,
  title text not null,
  locale text not null default 'es-ES',
  status text not null default 'draft',
  current_version integer not null default 1,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (organization_id) references public.organizations(id) on delete restrict,
  foreign key (brand_id, organization_id) references public.brands(id, organization_id) on delete restrict,
  foreign key (brand_version_id) references public.brand_context_versions(id) on delete restrict,
  foreign key (workspace_id, organization_id) references public.workspaces(id, organization_id) on delete restrict,
  foreign key (campaign_id) references public.marketing_campaign_records(id) on delete set null,
  foreign key (brief_id) references public.content_briefs(id) on delete set null,
  check (current_version > 0),
  check (type in ('social_post', 'email', 'landing_page', 'advertisement', 'script', 'other')),
  check (status in ('draft', 'in_review', 'approved', 'published', 'archived'))
);

create table if not exists public.content_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  brand_id uuid not null,
  workspace_id uuid,
  content_item_id uuid not null,
  version integer not null,
  body text not null,
  change_summary text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  foreign key (organization_id) references public.organizations(id) on delete restrict,
  foreign key (brand_id, organization_id) references public.brands(id, organization_id) on delete restrict,
  foreign key (workspace_id, organization_id) references public.workspaces(id, organization_id) on delete restrict,
  foreign key (content_item_id) references public.content_items(id) on delete cascade,
  unique (content_item_id, version),
  check (version > 0)
);

create table if not exists public.content_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  brand_id uuid,
  brand_version_id uuid,
  workspace_id uuid,
  brief_id uuid,
  content_item_id uuid,
  provider text not null,
  model text not null,
  status text not null,
  input_hash text not null,
  completed_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (organization_id) references public.organizations(id) on delete restrict,
  foreign key (brand_id, organization_id) references public.brands(id, organization_id) on delete restrict,
  foreign key (brand_version_id) references public.brand_context_versions(id) on delete restrict,
  foreign key (workspace_id, organization_id) references public.workspaces(id, organization_id) on delete restrict,
  foreign key (brief_id) references public.content_briefs(id) on delete set null,
  foreign key (content_item_id) references public.content_items(id) on delete set null,
  check (status in ('queued', 'running', 'completed', 'failed', 'cancelled'))
);

create index if not exists content_briefs_scope_idx on public.content_briefs(organization_id, brand_id, workspace_id);
create index if not exists content_items_scope_idx on public.content_items(organization_id, brand_id, workspace_id);
create index if not exists content_versions_item_idx on public.content_versions(content_item_id, version);
create index if not exists content_generation_jobs_scope_idx on public.content_generation_jobs(organization_id, brand_id, status);

do $$
declare table_name text;
begin
  foreach table_name in array array['content_briefs', 'content_items', 'content_versions', 'content_generation_jobs'] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', table_name);
    execute format('create policy %I on public.%I for select to authenticated using (public.has_organization_permission(organization_id, ''marketing.read''))', table_name || ' marketing users can read', table_name);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.has_organization_permission(organization_id, ''marketing.manage''))', table_name || ' marketing editors can create', table_name);
    execute format('create policy %I on public.%I for update to authenticated using (public.has_organization_permission(organization_id, ''marketing.manage'')) with check (public.has_organization_permission(organization_id, ''marketing.manage''))', table_name || ' marketing editors can update', table_name);
    execute format('create policy %I on public.%I for delete to authenticated using (public.has_organization_permission(organization_id, ''marketing.manage''))', table_name || ' marketing admins can delete', table_name);
  end loop;
end $$;
