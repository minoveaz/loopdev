-- Platform Core foundation: organizations and memberships.
-- This migration is additive and intentionally does not migrate brands yet.

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) >= 2),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  legacy_tenant_id uuid unique references public.tenants(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_memberships (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'viewer' check (role in ('owner', 'admin', 'agent', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create index if not exists idx_org_memberships_user on public.organization_memberships(user_id);
create index if not exists idx_org_memberships_org on public.organization_memberships(organization_id);

grant select on public.organizations, public.organization_memberships to authenticated;

insert into public.organizations (name, slug, legacy_tenant_id)
select name, slug, id
from public.tenants
where not exists (
  select 1
  from public.organizations existing
  where existing.legacy_tenant_id = public.tenants.id
);

create or replace function public.is_organization_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_memberships membership
    where membership.organization_id = target_organization_id
      and membership.user_id = auth.uid()
  );
$$;

create or replace function public.has_organization_role(
  target_organization_id uuid,
  allowed_roles text[]
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_memberships membership
    where membership.organization_id = target_organization_id
      and membership.user_id = auth.uid()
      and membership.role = any(allowed_roles)
  );
$$;

alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;

create policy "members can view their organizations"
on public.organizations
for select
to authenticated
using (public.is_organization_member(id));

create policy "members can view their membership"
on public.organization_memberships
for select
to authenticated
using (user_id = auth.uid() or public.is_organization_member(organization_id));

create trigger organizations_updated_at
before update on public.organizations
for each row execute procedure public.handle_updated_at();
