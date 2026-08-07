-- Platform Core authorization catalog.
-- The membership role remains the source of assignment for now; this migration
-- introduces an explicit permission matrix without changing existing policies.

create table if not exists public.permissions (
  key text primary key check (key ~ '^[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)*$'),
  description text not null,
  scope text not null default 'organization'
    check (scope in ('organization', 'workspace', 'brand', 'record')),
  created_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  role text not null check (role in ('owner', 'admin', 'agent', 'viewer')),
  permission_key text not null references public.permissions(key) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role, permission_key)
);

create index if not exists idx_role_permissions_permission
  on public.role_permissions(permission_key);

grant select on public.permissions, public.role_permissions to authenticated;

insert into public.permissions (key, description, scope)
values
  ('organization.read', 'View organization context and configuration', 'organization'),
  ('organization.manage', 'Manage organization settings', 'organization'),
  ('members.read', 'View organization memberships', 'organization'),
  ('members.manage', 'Invite, update and remove memberships', 'organization'),
  ('settings.manage', 'Manage platform settings for the organization', 'organization'),
  ('crm.read', 'View CRM records and activity', 'record'),
  ('crm.manage', 'Create and update CRM records and activity', 'record'),
  ('marketing.read', 'View marketing campaigns and assets', 'workspace'),
  ('marketing.manage', 'Manage marketing campaigns and assets', 'workspace'),
  ('operations.read', 'View insurance operations', 'workspace'),
  ('operations.manage', 'Manage insurance operations', 'workspace'),
  ('communications.read', 'View customer communications', 'record'),
  ('communications.send', 'Send customer communications', 'record'),
  ('reports.read', 'View organization reports', 'organization')
on conflict (key) do nothing;

insert into public.role_permissions (role, permission_key)
select role, permission_key
from (
  values
    ('owner', 'organization.read'), ('owner', 'organization.manage'),
    ('owner', 'members.read'), ('owner', 'members.manage'),
    ('owner', 'settings.manage'), ('owner', 'crm.read'), ('owner', 'crm.manage'),
    ('owner', 'marketing.read'), ('owner', 'marketing.manage'),
    ('owner', 'operations.read'), ('owner', 'operations.manage'),
    ('owner', 'communications.read'), ('owner', 'communications.send'),
    ('owner', 'reports.read'),
    ('admin', 'organization.read'), ('admin', 'organization.manage'),
    ('admin', 'members.read'), ('admin', 'members.manage'),
    ('admin', 'settings.manage'), ('admin', 'crm.read'), ('admin', 'crm.manage'),
    ('admin', 'marketing.read'), ('admin', 'marketing.manage'),
    ('admin', 'operations.read'), ('admin', 'operations.manage'),
    ('admin', 'communications.read'), ('admin', 'communications.send'),
    ('admin', 'reports.read'),
    ('agent', 'organization.read'), ('agent', 'members.read'),
    ('agent', 'crm.read'), ('agent', 'crm.manage'),
    ('agent', 'marketing.read'), ('agent', 'operations.read'),
    ('agent', 'communications.read'), ('agent', 'communications.send'),
    ('agent', 'reports.read'),
    ('viewer', 'organization.read'), ('viewer', 'crm.read'),
    ('viewer', 'marketing.read'), ('viewer', 'operations.read'),
    ('viewer', 'communications.read'), ('viewer', 'reports.read')
) as matrix(role, permission_key)
on conflict (role, permission_key) do nothing;

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
      and mapping.permission_key = required_permission
  );
$$;

alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;

create policy "authenticated users can view permission catalog"
on public.permissions
for select
to authenticated
using (true);

create policy "authenticated users can view role permission catalog"
on public.role_permissions
for select
to authenticated
using (true);
