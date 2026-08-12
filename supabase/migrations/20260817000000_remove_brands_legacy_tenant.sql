-- Brand Hub no longer uses the legacy tenant boundary.
-- organization_id is the sole authorization and ownership boundary for brands.

do $$
begin
  if exists (
    select 1
    from public.brands
    where organization_id is null
  ) then
    raise exception 'Cannot remove brands.tenant_id while a brand has no organization_id';
  end if;
end;
$$;

drop index if exists public.idx_brands_tenant;

alter table public.brands
  drop column if exists tenant_id;
