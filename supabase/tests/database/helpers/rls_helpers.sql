create or replace function pg_temp.has_policy_for(
  target_table text,
  target_command text
)
returns boolean
language sql
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
  child_table text,
  parent_table text
)
returns boolean
language sql
as $$
  select exists (
    select 1
    from pg_constraint constraint_row
    join pg_class child_relation on child_relation.oid = constraint_row.conrelid
    join pg_class parent_relation on parent_relation.oid = constraint_row.confrelid
    where constraint_row.contype = 'f'
      and child_relation.relname = child_table
      and parent_relation.relname = parent_table
      and array_position(
        constraint_row.conkey,
        (
          select attnum
          from pg_attribute
          where attrelid = child_relation.oid
            and attname = 'organization_id'
        )
      ) is not null
      and array_position(
        constraint_row.confkey,
        (
          select attnum
          from pg_attribute
          where attrelid = parent_relation.oid
            and attname = 'organization_id'
        )
      ) is not null
  );
$$;

create or replace function pg_temp.set_authenticated_user(user_id uuid)
returns void
language sql
as $$
  select set_config('request.jwt.claim.sub', user_id::text, true);
$$;
