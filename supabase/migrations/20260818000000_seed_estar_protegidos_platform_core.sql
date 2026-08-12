-- Dev platform seed for the first SaaS customer.
-- This provisions the organization, brands and enabled workspaces only.
-- Financial Ops remains disabled until its suite is available.

do $$
declare
  customer_organization_id uuid;
  vitablue_brand_id uuid;
  protege_brand_id uuid;
  marketing_workspace_id uuid;
  crm_workspace_id uuid;
begin
  insert into public.organizations (name, slug, is_active)
  values ('Estar Protegidos', 'estar-protegidos', true)
  on conflict (slug) do update
    set name = excluded.name,
        is_active = excluded.is_active,
        updated_at = now()
  returning id into customer_organization_id;

  if customer_organization_id is null then
    select id into customer_organization_id
    from public.organizations
    where slug = 'estar-protegidos';
  end if;

  insert into public.brands (organization_id, name, status)
  select customer_organization_id, 'VitaBlue', 'draft'
  where not exists (
    select 1 from public.brands
    where organization_id = customer_organization_id and name = 'VitaBlue'
  )
  returning id into vitablue_brand_id;

  if vitablue_brand_id is null then
    select id into vitablue_brand_id
    from public.brands
    where organization_id = customer_organization_id and name = 'VitaBlue';
  end if;

  insert into public.brands (organization_id, name, status)
  select customer_organization_id, 'Protege tu Salud', 'draft'
  where not exists (
    select 1 from public.brands
    where organization_id = customer_organization_id and name = 'Protege tu Salud'
  )
  returning id into protege_brand_id;

  if protege_brand_id is null then
    select id into protege_brand_id
    from public.brands
    where organization_id = customer_organization_id and name = 'Protege tu Salud';
  end if;

  insert into public.workspaces (organization_id, suite_key, name, slug, status)
  values
    (customer_organization_id, 'marketing', 'Marketing Studio', 'marketing-studio', 'active'),
    (customer_organization_id, 'crm', 'Sales CRM', 'sales-crm', 'active')
  on conflict (organization_id, suite_key, slug) do update
    set name = excluded.name,
        status = excluded.status,
        updated_at = now();

  select id into marketing_workspace_id
  from public.workspaces
  where organization_id = customer_organization_id and suite_key = 'marketing' and slug = 'marketing-studio';

  select id into crm_workspace_id
  from public.workspaces
  where organization_id = customer_organization_id and suite_key = 'crm' and slug = 'sales-crm';

  insert into public.workspace_brands (workspace_id, organization_id, brand_id)
  values
    (marketing_workspace_id, customer_organization_id, vitablue_brand_id),
    (marketing_workspace_id, customer_organization_id, protege_brand_id),
    (crm_workspace_id, customer_organization_id, vitablue_brand_id),
    (crm_workspace_id, customer_organization_id, protege_brand_id)
  on conflict (workspace_id, brand_id) do nothing;
end;
$$;
