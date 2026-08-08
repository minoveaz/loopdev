-- A workspace enables a suite for an organization. Its optional brand scope is
-- represented by workspace_brands; no links means organization-wide scope.
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  suite_key text not null check (suite_key in ('marketing', 'crm', 'operations', 'communications', 'health', 'quant', 'finance')),
  name text not null check (char_length(trim(name)) >= 2),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  status text not null default 'active' check (status in ('active', 'disabled', 'archived')),
  configuration jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, suite_key, slug),
  unique (id, organization_id)
);

alter table public.brands add constraint brands_id_organization_id_key unique (id, organization_id);

create table public.workspace_brands (
  workspace_id uuid not null,
  organization_id uuid not null,
  brand_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (workspace_id, brand_id),
  foreign key (workspace_id, organization_id) references public.workspaces(id, organization_id) on delete cascade,
  foreign key (brand_id, organization_id) references public.brands(id, organization_id) on delete cascade
);

create index idx_workspaces_organization_suite on public.workspaces(organization_id, suite_key);
create index idx_workspace_brands_brand on public.workspace_brands(brand_id);

create or replace function public.can_access_workspace(target_workspace_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.workspaces workspace
    where workspace.id = target_workspace_id
      and (public.is_platform_administrator() or public.has_organization_permission(workspace.organization_id, workspace.suite_key || '.read'))
  );
$$;
revoke all on function public.can_access_workspace(uuid) from public;
grant execute on function public.can_access_workspace(uuid) to authenticated;

create or replace function public.can_manage_workspace(target_workspace_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.workspaces workspace
    where workspace.id = target_workspace_id
      and (public.is_platform_administrator() or public.has_organization_permission(workspace.organization_id, 'settings.manage'))
  );
$$;
revoke all on function public.can_manage_workspace(uuid) from public;
grant execute on function public.can_manage_workspace(uuid) to authenticated;

alter table public.workspaces enable row level security;
alter table public.workspace_brands enable row level security;

create policy "authorized users can view workspaces" on public.workspaces for select to authenticated using (public.can_access_workspace(id));
create policy "platform and organization managers can create workspaces" on public.workspaces for insert to authenticated with check (public.is_platform_administrator() or public.has_organization_permission(organization_id, 'settings.manage'));
create policy "platform and organization managers can update workspaces" on public.workspaces for update to authenticated using (public.can_manage_workspace(id)) with check (public.is_platform_administrator() or public.has_organization_permission(organization_id, 'settings.manage'));
create policy "platform and organization managers can delete workspaces" on public.workspaces for delete to authenticated using (public.can_manage_workspace(id));
create policy "authorized users can view workspace brands" on public.workspace_brands for select to authenticated using (public.can_access_workspace(workspace_id));
create policy "workspace managers can manage workspace brands" on public.workspace_brands for all to authenticated using (public.can_manage_workspace(workspace_id)) with check (public.can_manage_workspace(workspace_id));

create trigger workspaces_updated_at before update on public.workspaces for each row execute procedure public.handle_updated_at();
