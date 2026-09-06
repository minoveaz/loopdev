-- CRM Leads assignment integrity.
--
-- NO-GO preflight: this migration intentionally aborts before adding any
-- constraint when an existing Lead points to a missing, cross-organization,
-- inactive, or non-operational membership. Operators must reassign or clear
-- those rows before replaying the migration; no historical assignment is
-- rewritten silently.
do $$
declare
  invalid_assignment_count bigint;
begin
  select count(*)
    into invalid_assignment_count
    from public.crm_leads lead
    left join public.organization_memberships membership
      on membership.organization_id = lead.organization_id
     and membership.user_id = lead.assigned_to_user_id
     and membership.status = 'active'
     and membership.role in ('owner', 'admin', 'agent')
   where lead.assigned_to_user_id is not null
     and membership.user_id is null;

  if invalid_assignment_count > 0 then
    raise exception
      'NO-GO: % CRM Lead assignment(s) do not reference an active operational membership in the same organization',
      invalid_assignment_count
      using
        errcode = 'check_violation',
        hint = 'Clear or reassign invalid crm_leads.assigned_to_user_id values, then replay this migration.';
  end if;
end
$$;

-- The canonical membership primary key already provides the referenced
-- (organization_id, user_id) key. The composite FK prevents cross-organization
-- references even for privileged database writers.
do $$
begin
  if not exists (
    select 1
      from pg_constraint
     where conrelid = 'public.crm_leads'::regclass
       and conname = 'crm_leads_assignee_organization_fkey'
  ) then
    alter table public.crm_leads
      add constraint crm_leads_assignee_organization_fkey
      foreign key (organization_id, assigned_to_user_id)
      references public.organization_memberships(organization_id, user_id)
      not valid;
  end if;
end
$$;

alter table public.crm_leads
  validate constraint crm_leads_assignee_organization_fkey;

create or replace function public.crm_lead_assignee_is_operational(
  target_organization_id uuid,
  target_user_id uuid
)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select target_user_id is null
    or exists (
      select 1
        from public.organization_memberships membership
       where membership.organization_id = target_organization_id
         and membership.user_id = target_user_id
         and membership.status = 'active'
         and membership.role in ('owner', 'admin', 'agent')
    );
$$;

revoke all on function public.crm_lead_assignee_is_operational(uuid, uuid) from public;
grant execute on function public.crm_lead_assignee_is_operational(uuid, uuid) to authenticated;

create or replace function public.enforce_crm_lead_assignee()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.crm_lead_assignee_is_operational(
    new.organization_id,
    new.assigned_to_user_id
  ) then
    raise exception
      'CRM Lead assignee must be an active operational member of the same organization'
      using
        errcode = 'check_violation',
        constraint = 'crm_leads_assignee_operational_check';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_crm_lead_assignee() from public;

drop trigger if exists crm_leads_assignee_operational_check on public.crm_leads;
create trigger crm_leads_assignee_operational_check
before insert or update of organization_id, assigned_to_user_id
on public.crm_leads
for each row
execute function public.enforce_crm_lead_assignee();

-- Keep the invariant valid after assignment: an operational membership cannot
-- be suspended or downgraded while Leads are still assigned to it. Reassign or
-- clear those Leads first. Membership deletion is protected by the composite FK.
create or replace function public.prevent_invalid_crm_lead_assignee_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (
    new.status <> 'active'
    or new.role not in ('owner', 'admin', 'agent')
  ) and exists (
    select 1
      from public.crm_leads lead
     where lead.organization_id = new.organization_id
       and lead.assigned_to_user_id = new.user_id
  ) then
    raise exception
      'CRM Lead assignments must be cleared before membership suspension or role downgrade'
      using
        errcode = 'check_violation',
        constraint = 'crm_leads_assignee_membership_lifecycle_check';
  end if;

  return new;
end;
$$;

revoke all on function public.prevent_invalid_crm_lead_assignee_membership() from public;

drop trigger if exists crm_leads_assignee_membership_lifecycle_check
  on public.organization_memberships;
create trigger crm_leads_assignee_membership_lifecycle_check
before update of status, role
on public.organization_memberships
for each row
when (
  old.status is distinct from new.status
  or old.role is distinct from new.role
)
execute function public.prevent_invalid_crm_lead_assignee_membership();

-- Preserve the existing CRM permission/workspace checks and add the assignee
-- condition at the RLS write boundary as defense in depth.
drop policy if exists crm_leads_crm_insert on public.crm_leads;
create policy crm_leads_crm_insert on public.crm_leads
for insert to authenticated
with check (
  public.has_organization_permission(organization_id, 'crm.manage')
  and (workspace_id is null or public.can_access_workspace(workspace_id))
  and public.crm_lead_assignee_is_operational(organization_id, assigned_to_user_id)
);

drop policy if exists crm_leads_crm_update on public.crm_leads;
create policy crm_leads_crm_update on public.crm_leads
for update to authenticated
using (
  public.has_organization_permission(organization_id, 'crm.manage')
  and (workspace_id is null or public.can_access_workspace(workspace_id))
)
with check (
  public.has_organization_permission(organization_id, 'crm.manage')
  and (workspace_id is null or public.can_access_workspace(workspace_id))
  and public.crm_lead_assignee_is_operational(organization_id, assigned_to_user_id)
);
