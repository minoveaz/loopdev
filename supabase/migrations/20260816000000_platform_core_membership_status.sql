-- Membership lifecycle. Only active memberships authorize organization access.

alter table public.organization_memberships
  add column if not exists status text not null default 'active';

alter table public.organization_memberships
  drop constraint if exists organization_memberships_status_check;

alter table public.organization_memberships
  add constraint organization_memberships_status_check
  check (status in ('pending', 'active', 'suspended', 'revoked'));

create index if not exists idx_org_memberships_user_status
  on public.organization_memberships(user_id, status);

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
      and membership.status = 'active'
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
      and membership.status = 'active'
      and membership.role = any(allowed_roles)
  );
$$;

create or replace function public.has_organization_permission(
  target_organization_id uuid,
  required_permission text
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
    join public.role_permissions mapping on mapping.role = membership.role
    where membership.organization_id = target_organization_id
      and membership.user_id = auth.uid()
      and membership.status = 'active'
      and mapping.permission_key = required_permission
  );
$$;
