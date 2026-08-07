-- Platform Core: make Brand Hub data tenant-safe through organizations.
-- `tenant_id` remains temporarily as a legacy compatibility column; all new
-- authorization is based exclusively on `organization_id`.

alter table public.brands
  add column if not exists organization_id uuid;

-- Organizations created by the foundation migration retain their legacy tenant
-- link, so the backfill is deterministic and cannot merge unrelated tenants.
update public.brands brand
set organization_id = organization.id
from public.organizations organization
where brand.organization_id is null
  and organization.legacy_tenant_id = brand.tenant_id;

do $$
begin
  if exists (select 1 from public.brands where organization_id is null) then
    raise exception
      'Cannot migrate brands to organizations: one or more legacy tenant_id values have no organization mapping';
  end if;
end;
$$;

alter table public.brands
  alter column organization_id set not null,
  add constraint brands_organization_id_fkey
    foreign key (organization_id)
    references public.organizations(id)
    on delete restrict;

create index if not exists idx_brands_organization
  on public.brands(organization_id);

drop policy if exists "Admins can manage brands" on public.brands;
drop policy if exists "Users can create brands" on public.brands;
drop policy if exists "Users can view brands" on public.brands;
drop policy if exists "Users can view brands of their own tenant" on public.brands;

create policy "organization members can view brands"
on public.brands
for select
to authenticated
using (public.has_organization_permission(organization_id, 'marketing.read'));

create policy "organization managers can create brands"
on public.brands
for insert
to authenticated
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization managers can update brands"
on public.brands
for update
to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'))
with check (public.has_organization_permission(organization_id, 'marketing.manage'));

create policy "organization managers can delete brands"
on public.brands
for delete
to authenticated
using (public.has_organization_permission(organization_id, 'marketing.manage'));
