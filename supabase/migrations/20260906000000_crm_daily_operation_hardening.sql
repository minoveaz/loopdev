-- Daily Operation backend audit hardening.
-- CRM security is organization/workspace based. brand_id is a CRM identifier
-- within an organization, not an independent security boundary.

create or replace function public.crm_set_authenticated_actor()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null then
    if tg_table_name = 'crm_notes' and tg_op = 'INSERT' then
      new.author_user_id := auth.uid();
    end if;
    if tg_table_name = 'crm_tasks' and tg_op = 'INSERT' then
      new.created_by_user_id := auth.uid();
    end if;
    if tg_table_name in ('crm_tasks', 'crm_notes') then
      new.last_actor_user_id := auth.uid();
    elsif tg_table_name in ('crm_activities', 'crm_audit_events') then
      new.actor_user_id := auth.uid();
    elsif tg_table_name = 'crm_opportunity_stage_history' then
      new.actor_user_id := auth.uid();
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.crm_set_authenticated_actor() from public;

drop trigger if exists crm_tasks_authenticated_actor on public.crm_tasks;
create trigger crm_tasks_authenticated_actor
before insert or update on public.crm_tasks
for each row execute function public.crm_set_authenticated_actor();

drop trigger if exists crm_notes_authenticated_actor on public.crm_notes;
create trigger crm_notes_authenticated_actor
before insert or update on public.crm_notes
for each row execute function public.crm_set_authenticated_actor();

drop trigger if exists crm_activities_authenticated_actor on public.crm_activities;
create trigger crm_activities_authenticated_actor
before insert on public.crm_activities
for each row execute function public.crm_set_authenticated_actor();

drop trigger if exists crm_audit_events_authenticated_actor on public.crm_audit_events;
create trigger crm_audit_events_authenticated_actor
before insert on public.crm_audit_events
for each row execute function public.crm_set_authenticated_actor();

drop trigger if exists crm_opportunity_stage_history_authenticated_actor
  on public.crm_opportunity_stage_history;
create trigger crm_opportunity_stage_history_authenticated_actor
before insert on public.crm_opportunity_stage_history
for each row execute function public.crm_set_authenticated_actor();

create or replace function public.crm_can_read_private_note_body(
  target_organization_id uuid,
  target_author_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() is not null
    and (
      auth.uid() = target_author_user_id
      or exists (
        select 1
        from public.organization_memberships membership
        where membership.organization_id = target_organization_id
          and membership.user_id = auth.uid()
          and membership.role in ('owner', 'admin')
      )
    );
$$;

revoke all on function public.crm_can_read_private_note_body(uuid, uuid) from public;
grant execute on function public.crm_can_read_private_note_body(uuid, uuid) to authenticated;

-- The base table is no longer a direct authenticated read boundary. The view
-- applies organization/workspace authorization and redacts private bodies
-- before PostgREST can serialize them.
revoke all on table public.crm_notes from authenticated;
grant insert, update, delete on table public.crm_notes to authenticated;
grant select (
  id,
  organization_id,
  workspace_id,
  brand_id,
  relation_type,
  relation_id,
  contact_id,
  lead_id,
  opportunity_id,
  author_user_id,
  visibility,
  version,
  idempotency_key,
  idempotency_fingerprint,
  last_actor_user_id,
  last_operation_key,
  last_operation_fingerprint,
  created_at,
  updated_at
) on table public.crm_notes to authenticated;

drop view if exists public.crm_notes_visible;
create view public.crm_notes_visible
with (security_barrier = true)
as
select
  note.id,
  note.organization_id,
  note.workspace_id,
  note.brand_id,
  note.relation_type,
  note.relation_id,
  note.contact_id,
  note.lead_id,
  note.opportunity_id,
  note.author_user_id,
  note.visibility,
  case
    when note.visibility <> 'private'
      or public.crm_can_read_private_note_body(note.organization_id, note.author_user_id)
    then note.body
    else null
  end as body,
  (
    note.visibility <> 'private'
    or public.crm_can_read_private_note_body(note.organization_id, note.author_user_id)
  ) as can_read_body,
  note.version,
  note.idempotency_key,
  note.idempotency_fingerprint,
  note.last_actor_user_id,
  note.last_operation_key,
  note.last_operation_fingerprint,
  note.created_at,
  note.updated_at
from public.crm_notes note
where public.has_organization_permission(note.organization_id, 'crm.read')
  and (note.workspace_id is null or public.can_access_workspace(note.workspace_id));

grant select on public.crm_notes_visible to authenticated;

create or replace function public.crm_audit_lead_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.crm_audit_events (
    organization_id,
    entity_type,
    entity_id,
    action,
    before_state,
    after_state,
    metadata
  )
  values (
    new.organization_id,
    'lead',
    new.id,
    case when tg_op = 'INSERT' then 'created' else 'updated' end,
    case when tg_op = 'UPDATE' then jsonb_build_object('status', old.status) else null end,
    jsonb_build_object(
      'status', new.status,
      'source', new.source,
      'workspaceId', new.workspace_id,
      'brandId', new.brand_id
    ),
    jsonb_build_object(
      'event', case when tg_op = 'INSERT' then 'created' else 'mutation' end
    )
  );
  return new;
end;
$$;

revoke all on function public.crm_audit_lead_change() from public;
drop trigger if exists crm_leads_audit_change on public.crm_leads;
create trigger crm_leads_audit_change
after insert or update on public.crm_leads
for each row execute function public.crm_audit_lead_change();

create or replace function public.crm_audit_opportunity_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.crm_audit_events (
    organization_id,
    entity_type,
    entity_id,
    action,
    before_state,
    after_state,
    metadata
  )
  values (
    new.organization_id,
    'opportunity',
    new.id,
    case
      when tg_op = 'INSERT' then 'created'
      when new.stage_key is distinct from old.stage_key then 'stage_changed'
      else 'updated'
    end,
    case
      when tg_op = 'UPDATE' then jsonb_build_object(
        'stageKey', old.stage_key,
        'version', old.version
      )
      else null
    end,
    jsonb_build_object(
      'stageKey', new.stage_key,
      'version', new.version,
      'origin', new.origin
    ),
    jsonb_build_object(
      'event', case
        when tg_op = 'INSERT' then 'created'
        when new.stage_key is distinct from old.stage_key then 'stage_changed'
        else 'mutation'
      end
    )
  );
  return new;
end;
$$;

revoke all on function public.crm_audit_opportunity_change() from public;
drop trigger if exists crm_opportunities_audit_change on public.crm_opportunities;
create trigger crm_opportunities_audit_change
after insert on public.crm_opportunities
for each row
when (new.origin = 'lead_conversion')
execute function public.crm_audit_opportunity_change();

-- A single transaction owns the conversion and reconciliation. The lead row
-- lock serializes retries, while the unique conversion index protects callers
-- that race through another database boundary.
create or replace function public.crm_convert_lead(
  target_organization_id uuid,
  target_lead_id uuid,
  target_product_key text,
  target_name text,
  target_amount numeric default null,
  target_currency text default 'EUR',
  target_probability integer default null,
  target_expected_close_at timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  lead_row public.crm_leads%rowtype;
  opportunity_row public.crm_opportunities%rowtype;
  normalized_product_key text;
begin
  if auth.uid() is null
    or not public.has_organization_permission(target_organization_id, 'crm.manage') then
    raise exception 'CRM conversion is not authorized'
      using errcode = 'insufficient_privilege';
  end if;

  normalized_product_key := lower(
    regexp_replace(trim(target_product_key), '\s+', '-', 'g')
  );

  select *
    into lead_row
    from public.crm_leads
   where id = target_lead_id
     and organization_id = target_organization_id
   for update;

  if not found then
    raise exception 'CRM lead not found'
      using errcode = 'no_data_found';
  end if;

  if lead_row.status not in ('cualificado', 'convertido') then
    raise exception 'CRM lead is not qualified for conversion'
      using errcode = 'check_violation';
  end if;

  select *
    into opportunity_row
    from public.crm_opportunities
   where organization_id = target_organization_id
     and lead_id = target_lead_id
     and product_key = normalized_product_key
     and origin = 'lead_conversion'
   for update;

  if found then
    if lead_row.status <> 'convertido' then
      update public.crm_leads
         set status = 'convertido', updated_at = now()
       where id = target_lead_id
         and organization_id = target_organization_id;
    end if;
    return jsonb_build_object('opportunityId', opportunity_row.id, 'created', false);
  end if;

  insert into public.crm_opportunities (
    organization_id,
    lead_id,
    contact_id,
    brand_id,
    workspace_id,
    name,
    stage,
    stage_key,
    origin,
    product_key,
    amount,
    currency,
    probability,
    expected_close_at
  )
  values (
    target_organization_id,
    lead_row.id,
    lead_row.contact_id,
    lead_row.brand_id,
    lead_row.workspace_id,
    target_name,
    'qualified',
    'qualified',
    'lead_conversion',
    normalized_product_key,
    target_amount,
    target_currency,
    target_probability,
    target_expected_close_at
  )
  returning * into opportunity_row;

  update public.crm_leads
     set status = 'convertido', updated_at = now()
   where id = target_lead_id
     and organization_id = target_organization_id
     and status = 'cualificado';

  return jsonb_build_object('opportunityId', opportunity_row.id, 'created', true);
end;
$$;

revoke all on function public.crm_convert_lead(
  uuid, uuid, text, text, numeric, text, integer, timestamptz
) from public;
grant execute on function public.crm_convert_lead(
  uuid, uuid, text, text, numeric, text, integer, timestamptz
) to authenticated;
