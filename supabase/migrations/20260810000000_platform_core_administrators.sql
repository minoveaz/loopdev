-- Platform Core: global LoopDev administration is deliberately separate from
-- organization memberships. Initial platform owners are provisioned through a
-- protected server-side/admin workflow, never from the browser.

create table public.platform_administrators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('owner', 'admin')),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

grant select on public.platform_administrators to authenticated;

create or replace function public.is_platform_administrator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.platform_administrators administrator
    where administrator.user_id = auth.uid()
  );
$$;

revoke all on function public.is_platform_administrator() from public;
grant execute on function public.is_platform_administrator() to authenticated;

create or replace function public.has_platform_role(required_role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.platform_administrators administrator
    where administrator.user_id = auth.uid()
      and administrator.role = required_role
  );
$$;

revoke all on function public.has_platform_role(text) from public;
grant execute on function public.has_platform_role(text) to authenticated;

alter table public.platform_administrators enable row level security;

create policy "platform administrators can view platform administrators"
on public.platform_administrators
for select
to authenticated
using (public.is_platform_administrator());

create policy "platform owners can manage platform administrators"
on public.platform_administrators
for all
to authenticated
using (public.has_platform_role('owner'))
with check (public.has_platform_role('owner'));

alter policy "members can view their organizations"
on public.organizations
using (public.is_organization_member(id) or public.is_platform_administrator());

alter policy "members can view their membership"
on public.organization_memberships
using (
  user_id = auth.uid()
  or public.is_organization_member(organization_id)
  or public.is_platform_administrator()
);

create policy "platform administrators can manage organizations"
on public.organizations
for all
to authenticated
using (public.is_platform_administrator())
with check (public.is_platform_administrator());

create policy "platform administrators can manage organization memberships"
on public.organization_memberships
for all
to authenticated
using (public.is_platform_administrator())
with check (public.is_platform_administrator());

alter policy "organization members can view brands"
on public.brands
using (
  public.has_organization_permission(organization_id, 'marketing.read')
  or public.is_platform_administrator()
);

alter policy "organization managers can create brands"
on public.brands
with check (
  public.has_organization_permission(organization_id, 'marketing.manage')
  or public.is_platform_administrator()
);

alter policy "organization managers can update brands"
on public.brands
using (
  public.has_organization_permission(organization_id, 'marketing.manage')
  or public.is_platform_administrator()
)
with check (
  public.has_organization_permission(organization_id, 'marketing.manage')
  or public.is_platform_administrator()
);

alter policy "organization managers can delete brands"
on public.brands
using (
  public.has_organization_permission(organization_id, 'marketing.manage')
  or public.is_platform_administrator()
);
