-- Reusable pgTAP helpers for organization and workspace isolation tests.

create or replace function pg_temp.set_authenticated_user(target_user_id uuid)
returns void
language sql
as $$
  select set_config('request.jwt.claim.sub', target_user_id::text, true);
$$;

create or replace function pg_temp.has_policy_for(
  target_table text,
  target_command text
)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = target_table
      and lower(cmd) = lower(target_command)
  );
$$;

create or replace function pg_temp.has_scoped_fk(
  target_table text,
  target_parent_table text
)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from pg_constraint constraint_record
    join pg_class child_table on child_table.oid = constraint_record.conrelid
    join pg_namespace child_schema on child_schema.oid = child_table.relnamespace
    where child_schema.nspname = 'public'
      and child_table.relname = target_table
      and constraint_record.contype = 'f'
      and pg_get_constraintdef(constraint_record.oid) ilike
        format('%%organization_id%%references public.%s(id, organization_id)%%', target_parent_table)
  );
$$;
