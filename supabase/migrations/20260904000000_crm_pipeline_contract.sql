-- CRM Pipeline contract (Issue #85).
-- This migration is additive and keeps the legacy `key`, `stage` and
-- `is_terminal` columns readable while introducing stable contract fields.

alter table public.crm_pipeline_stages
  add column if not exists stage_key text,
  add column if not exists active boolean not null default true,
  add column if not exists terminal_type text not null default 'open';

update public.crm_pipeline_stages
set stage_key = lower(regexp_replace(trim(coalesce(stage_key, key)), '[^a-zA-Z0-9_-]+', '-', 'g'))
where stage_key is null;

update public.crm_pipeline_stages
set terminal_type = case
  when lower(coalesce(stage_key, key)) = 'won' then 'won'
  when lower(coalesce(stage_key, key)) in ('lost', 'rejected', 'discarded') then 'lost'
  when is_terminal then 'won'
  else 'open'
end
where terminal_type is null or terminal_type = 'open';

alter table public.crm_pipeline_stages
  alter column stage_key set not null;

alter table public.crm_pipeline_stages
  drop constraint if exists crm_pipeline_stages_terminal_type_check;
alter table public.crm_pipeline_stages
  add constraint crm_pipeline_stages_terminal_type_check
  check (terminal_type in ('open', 'won', 'lost'));

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.crm_pipeline_stages'::regclass
      and conname = 'crm_pipeline_stages_stage_org_key'
  ) then
    alter table public.crm_pipeline_stages
      add constraint crm_pipeline_stages_stage_org_key unique (organization_id, stage_key);
  end if;
end
$$;

alter table public.crm_opportunities
  add column if not exists contact_id uuid,
  add column if not exists brand_id uuid,
  add column if not exists stage_key text,
  add column if not exists version integer not null default 1,
  add column if not exists assigned_to_user_id uuid,
  add column if not exists idempotency_key text,
  add column if not exists idempotency_fingerprint text;

-- Manual Opportunities are allowed to have no Lead. Existing rows all have a
-- Lead and are retained; the composite FK below still protects conversions.
alter table public.crm_opportunities
  alter column lead_id drop not null;

update public.crm_opportunities opportunity
set contact_id = lead.contact_id,
    brand_id = lead.brand_id,
    stage_key = lower(regexp_replace(trim(coalesce(opportunity.stage_key, opportunity.stage)), '[^a-zA-Z0-9_-]+', '-', 'g')),
    product_key = lower(regexp_replace(trim(coalesce(opportunity.product_key, opportunity.name)), '\s+', '-', 'g'))
from public.crm_leads lead
where lead.id = opportunity.lead_id
  and lead.organization_id = opportunity.organization_id;

update public.crm_opportunities
set stage_key = lower(regexp_replace(trim(coalesce(stage_key, stage)), '[^a-zA-Z0-9_-]+', '-', 'g'))
where stage_key is null;

update public.crm_opportunities
set product_key = lower(regexp_replace(trim(coalesce(product_key, name)), '\s+', '-', 'g'))
where product_key is null;

-- Keep legacy rows valid before making the contract fields mandatory.
alter table public.crm_opportunities
  alter column contact_id set not null,
  alter column stage_key set not null,
  alter column product_key set not null;

alter table public.crm_opportunities
  drop constraint if exists crm_opportunities_version_check;
alter table public.crm_opportunities
  add constraint crm_opportunities_version_check check (version > 0);

alter table public.crm_opportunities
  drop constraint if exists crm_opportunities_idempotency_key_check;
alter table public.crm_opportunities
  add constraint crm_opportunities_idempotency_key_check
  check (idempotency_key is null or length(trim(idempotency_key)) >= 8);

create unique index if not exists crm_opportunities_manual_idempotency_key
  on public.crm_opportunities(organization_id, idempotency_key)
  where idempotency_key is not null;

-- Create a read-compatible stage for every legacy Opportunity before adding
-- the stable composite reference. The first workspace owns a shared key; all
-- Opportunities remain organization-scoped.
insert into public.crm_pipeline_stages
  (organization_id, workspace_id, key, stage_key, label, position, active, terminal_type)
select distinct on (opportunity.organization_id, opportunity.stage_key)
  opportunity.organization_id,
  opportunity.workspace_id,
  opportunity.stage_key,
  opportunity.stage_key,
  initcap(replace(opportunity.stage_key, '-', ' ')),
  row_number() over (
    partition by opportunity.organization_id
    order by opportunity.stage_key
  ) - 1,
  true,
  case
    when opportunity.stage_key = 'won' then 'won'
    when opportunity.stage_key in ('lost', 'rejected', 'discarded') then 'lost'
    else 'open'
  end
from public.crm_opportunities opportunity
where not exists (
  select 1
  from public.crm_pipeline_stages stage
  where stage.organization_id = opportunity.organization_id
    and stage.stage_key = opportunity.stage_key
)
order by opportunity.organization_id, opportunity.stage_key, opportunity.workspace_id nulls first;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.crm_opportunities'::regclass
      and conname = 'crm_opportunities_contact_org_fkey'
  ) then
    alter table public.crm_opportunities
      add constraint crm_opportunities_contact_org_fkey
      foreign key (contact_id, organization_id)
      references public.crm_contacts(id, organization_id) on delete restrict;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.crm_opportunities'::regclass
      and conname = 'crm_opportunities_brand_org_fkey'
  ) then
    alter table public.crm_opportunities
      add constraint crm_opportunities_brand_org_fkey
      foreign key (brand_id, organization_id)
      references public.brands(id, organization_id) on delete restrict;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.crm_opportunities'::regclass
      and conname = 'crm_opportunities_stage_org_fkey'
  ) then
    alter table public.crm_opportunities
      add constraint crm_opportunities_stage_org_fkey
      foreign key (organization_id, stage_key)
      references public.crm_pipeline_stages(organization_id, stage_key) on delete restrict;
  end if;
end
$$;

-- Compatibility for legacy SQL clients that only supplied lead_id and stage.
-- New API commands always send the contract fields explicitly.
create or replace function public.crm_opportunity_fill_contract_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  source_lead public.crm_leads%rowtype;
begin
  if new.lead_id is not null and (new.contact_id is null or new.brand_id is null) then
    select * into source_lead
    from public.crm_leads
    where id = new.lead_id and organization_id = new.organization_id;
    if new.contact_id is null then new.contact_id := source_lead.contact_id; end if;
    if new.brand_id is null then new.brand_id := source_lead.brand_id; end if;
  end if;
  new.stage_key := lower(regexp_replace(trim(coalesce(new.stage_key, new.stage)), '[^a-zA-Z0-9_-]+', '-', 'g'));
  if new.product_key is null then
    new.product_key := lower(regexp_replace(trim(new.name), '\s+', '-', 'g'));
  end if;
  insert into public.crm_pipeline_stages
    (organization_id, workspace_id, key, stage_key, label, position, active, terminal_type)
  values
    (new.organization_id, null, new.stage_key, new.stage_key,
     initcap(replace(new.stage_key, '-', ' ')), 0, true,
     case when new.stage_key = 'won' then 'won'
          when new.stage_key in ('lost', 'rejected', 'discarded') then 'lost'
          else 'open' end)
  on conflict (organization_id, stage_key) do nothing;
  return new;
end;
$$;

revoke all on function public.crm_opportunity_fill_contract_fields() from public;
drop trigger if exists crm_opportunity_fill_contract_fields on public.crm_opportunities;
create trigger crm_opportunity_fill_contract_fields
before insert on public.crm_opportunities
for each row execute function public.crm_opportunity_fill_contract_fields();

create index if not exists crm_opportunities_pipeline_cursor_idx
  on public.crm_opportunities(organization_id, workspace_id, stage_key, id);

create table if not exists public.crm_opportunity_stage_history (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  opportunity_id uuid not null,
  from_stage_key text,
  to_stage_key text not null,
  origin text not null,
  reason text,
  actor_user_id uuid references auth.users(id) on delete set null,
  opportunity_version integer not null,
  created_at timestamptz not null default now(),
  constraint crm_opportunity_stage_history_opportunity_org_fkey
    foreign key (opportunity_id, organization_id)
    references public.crm_opportunities(id, organization_id) on delete cascade,
  constraint crm_opportunity_stage_history_from_stage_org_fkey
    foreign key (organization_id, from_stage_key)
    references public.crm_pipeline_stages(organization_id, stage_key),
  constraint crm_opportunity_stage_history_to_stage_org_fkey
    foreign key (organization_id, to_stage_key)
    references public.crm_pipeline_stages(organization_id, stage_key),
  constraint crm_opportunity_stage_history_origin_check
    check (origin in ('board', 'record', 'system', 'conversion', 'reopen')),
  constraint crm_opportunity_stage_history_version_check
    check (opportunity_version > 0)
);

create index if not exists crm_opportunity_stage_history_cursor_idx
  on public.crm_opportunity_stage_history(organization_id, opportunity_id, created_at desc, id desc);

create or replace function public.prevent_crm_opportunity_stage_history_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'crm_opportunity_stage_history is append-only'
    using errcode = 'restrict_violation';
end;
$$;

revoke all on function public.prevent_crm_opportunity_stage_history_mutation() from public;
drop trigger if exists crm_opportunity_stage_history_append_only
  on public.crm_opportunity_stage_history;
create trigger crm_opportunity_stage_history_append_only
before update or delete on public.crm_opportunity_stage_history
for each row execute function public.prevent_crm_opportunity_stage_history_mutation();

alter table public.crm_opportunity_stage_history enable row level security;

drop policy if exists crm_pipeline_stages_crm_read on public.crm_pipeline_stages;
drop policy if exists crm_pipeline_stages_crm_insert on public.crm_pipeline_stages;
drop policy if exists crm_pipeline_stages_crm_update on public.crm_pipeline_stages;
drop policy if exists crm_pipeline_stages_crm_delete on public.crm_pipeline_stages;
create policy crm_pipeline_stages_crm_read on public.crm_pipeline_stages
  for select to authenticated
  using (public.has_organization_permission(organization_id, 'crm.read'));
create policy crm_pipeline_stages_crm_insert on public.crm_pipeline_stages
  for insert to authenticated
  with check (public.has_organization_permission(organization_id, 'crm.manage'));
create policy crm_pipeline_stages_crm_update on public.crm_pipeline_stages
  for update to authenticated
  using (public.has_organization_permission(organization_id, 'crm.manage'))
  with check (public.has_organization_permission(organization_id, 'crm.manage'));
create policy crm_pipeline_stages_crm_delete on public.crm_pipeline_stages
  for delete to authenticated
  using (public.has_organization_permission(organization_id, 'crm.manage'));

drop policy if exists crm_opportunity_stage_history_crm_read
  on public.crm_opportunity_stage_history;
drop policy if exists crm_opportunity_stage_history_crm_insert
  on public.crm_opportunity_stage_history;
drop policy if exists crm_opportunity_stage_history_no_update
  on public.crm_opportunity_stage_history;
drop policy if exists crm_opportunity_stage_history_no_delete
  on public.crm_opportunity_stage_history;
create policy crm_opportunity_stage_history_crm_read
  on public.crm_opportunity_stage_history for select to authenticated
  using (public.has_organization_permission(organization_id, 'crm.read'));
create policy crm_opportunity_stage_history_crm_insert
  on public.crm_opportunity_stage_history for insert to authenticated
  with check (public.has_organization_permission(organization_id, 'crm.manage'));
create policy crm_opportunity_stage_history_no_update
  on public.crm_opportunity_stage_history for update to authenticated
  using (false)
  with check (false);
create policy crm_opportunity_stage_history_no_delete
  on public.crm_opportunity_stage_history for delete to authenticated
  using (false);

revoke all on table public.crm_opportunity_stage_history from authenticated;
grant select, insert on table public.crm_opportunity_stage_history to authenticated;
