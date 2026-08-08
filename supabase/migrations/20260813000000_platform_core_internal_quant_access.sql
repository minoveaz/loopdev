-- Close legacy public reads while Quant completes its structural move from
-- tenant_id to organization_id. Market reference data remains shared only
-- among users authorized for Quant in at least one organization.

create or replace function public.has_any_organization_permission(required_permission text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_platform_administrator()
    or exists (
      select 1
      from public.organization_memberships membership
      join public.role_permissions mapping on mapping.role = membership.role
      where membership.user_id = auth.uid()
        and mapping.permission_key = required_permission
    );
$$;

revoke all on function public.has_any_organization_permission(text) from public;
grant execute on function public.has_any_organization_permission(text) to authenticated;

create or replace function public.can_view_legacy_tenant(target_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_platform_administrator()
    or exists (
      select 1
      from public.organizations organization_record
      where organization_record.legacy_tenant_id = target_tenant_id
        and public.is_organization_member(organization_record.id)
    );
$$;

revoke all on function public.can_view_legacy_tenant(uuid) from public;
grant execute on function public.can_view_legacy_tenant(uuid) to authenticated;

-- Table privileges are required before RLS policies are evaluated. Only reads
-- are granted here; operational writes continue through protected backends.
grant select on public.tenants to authenticated;
grant select on public.quant_assets to authenticated;
grant select on public.quant_market_config to authenticated;
grant select on public.quant_market_history to authenticated;

drop policy if exists "Anyone can view active tenants" on public.tenants;
drop policy if exists "Certified assets are viewable by all users" on public.quant_assets;
drop policy if exists "Allow read access to market config" on public.quant_market_config;
drop policy if exists "Allow public read access to market history" on public.quant_market_history;
drop policy if exists "Public read access for market data" on public.quant_market_history;

create policy "organization members can view their legacy tenant"
on public.tenants
for select
to authenticated
using (public.can_view_legacy_tenant(id));

create policy "quant users can view assets"
on public.quant_assets
for select
to authenticated
using (public.has_any_organization_permission('quant.read'));

create policy "quant users can view market config"
on public.quant_market_config
for select
to authenticated
using (public.has_any_organization_permission('quant.read'));

create policy "quant users can view market history"
on public.quant_market_history
for select
to authenticated
using (public.has_any_organization_permission('quant.read'));
