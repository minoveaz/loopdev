-- CRM and Communications security hardening.
-- The migration is additive: it preserves data and tightens authorization and
-- relationship constraints after the foundation migrations have run.

create or replace function pg_temp.ensure_unique_scope_key(
  target_table regclass,
  constraint_name text
)
returns void
language plpgsql
as $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = target_table
      and conname = constraint_name
  ) then
    execute format(
      'alter table %s add constraint %I unique (id, organization_id)',
      target_table,
      constraint_name
    );
  end if;
end;
$$;

create or replace function pg_temp.ensure_organization_fk(
  child_table regclass,
  constraint_name text,
  child_columns text,
  parent_table regclass,
  parent_columns text,
  delete_action text default ''
)
returns void
language plpgsql
as $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = child_table
      and conname = constraint_name
  ) then
    execute format(
      'alter table %s add constraint %I foreign key (%s) references %s (%s) %s',
      child_table,
      constraint_name,
      child_columns,
      parent_table,
      parent_columns,
      delete_action
    );
  end if;
end;
$$;

select pg_temp.ensure_unique_scope_key('public.crm_contacts', 'crm_contacts_id_organization_key');
select pg_temp.ensure_unique_scope_key('public.crm_companies', 'crm_companies_id_organization_key');
select pg_temp.ensure_unique_scope_key('public.crm_leads', 'crm_leads_id_organization_key');
select pg_temp.ensure_unique_scope_key('public.crm_opportunities', 'crm_opportunities_id_organization_key');
select pg_temp.ensure_unique_scope_key('public.catalog_products', 'catalog_products_id_organization_key');
select pg_temp.ensure_unique_scope_key('public.catalog_price_books', 'catalog_price_books_id_organization_key');
select pg_temp.ensure_unique_scope_key('public.catalog_price_entries', 'catalog_price_entries_id_organization_key');
select pg_temp.ensure_unique_scope_key('public.communication_templates', 'communication_templates_id_organization_key');

select pg_temp.ensure_organization_fk(
  'public.crm_contact_companies',
  'crm_contact_companies_contact_org_fkey',
  'contact_id, organization_id',
  'public.crm_contacts',
  'id, organization_id',
  'on delete cascade'
);
select pg_temp.ensure_organization_fk(
  'public.crm_contact_companies',
  'crm_contact_companies_company_org_fkey',
  'company_id, organization_id',
  'public.crm_companies',
  'id, organization_id',
  'on delete cascade'
);
select pg_temp.ensure_organization_fk(
  'public.crm_related_people',
  'crm_related_people_contact_org_fkey',
  'contact_id, organization_id',
  'public.crm_contacts',
  'id, organization_id',
  'on delete cascade'
);
select pg_temp.ensure_organization_fk(
  'public.crm_leads',
  'crm_leads_contact_org_fkey',
  'contact_id, organization_id',
  'public.crm_contacts',
  'id, organization_id',
  'on delete restrict'
);
select pg_temp.ensure_organization_fk(
  'public.crm_lead_attributions',
  'crm_lead_attributions_lead_org_fkey',
  'lead_id, organization_id',
  'public.crm_leads',
  'id, organization_id',
  'on delete cascade'
);
select pg_temp.ensure_organization_fk(
  'public.crm_opportunities',
  'crm_opportunities_lead_org_fkey',
  'lead_id, organization_id',
  'public.crm_leads',
  'id, organization_id',
  'on delete restrict'
);
select pg_temp.ensure_organization_fk(
  'public.crm_activities',
  'crm_activities_lead_org_fkey',
  'lead_id, organization_id',
  'public.crm_leads',
  'id, organization_id',
  'on delete cascade'
);
select pg_temp.ensure_organization_fk(
  'public.crm_tasks',
  'crm_tasks_lead_org_fkey',
  'lead_id, organization_id',
  'public.crm_leads',
  'id, organization_id',
  'on delete cascade'
);
select pg_temp.ensure_organization_fk(
  'public.crm_notes',
  'crm_notes_contact_org_fkey',
  'contact_id, organization_id',
  'public.crm_contacts',
  'id, organization_id',
  'on delete cascade'
);
select pg_temp.ensure_organization_fk(
  'public.crm_notes',
  'crm_notes_lead_org_fkey',
  'lead_id, organization_id',
  'public.crm_leads',
  'id, organization_id',
  'on delete cascade'
);
select pg_temp.ensure_organization_fk(
  'public.crm_notes',
  'crm_notes_opportunity_org_fkey',
  'opportunity_id, organization_id',
  'public.crm_opportunities',
  'id, organization_id',
  'on delete cascade'
);
select pg_temp.ensure_organization_fk(
  'public.crm_contact_consents',
  'crm_contact_consents_contact_org_fkey',
  'contact_id, organization_id',
  'public.crm_contacts',
  'id, organization_id',
  'on delete cascade'
);
select pg_temp.ensure_organization_fk(
  'public.catalog_products',
  'catalog_products_parent_org_fkey',
  'parent_product_id, organization_id',
  'public.catalog_products',
  'id, organization_id',
  'on delete restrict'
);
select pg_temp.ensure_organization_fk(
  'public.catalog_price_entries',
  'catalog_price_entries_price_book_org_fkey',
  'price_book_id, organization_id',
  'public.catalog_price_books',
  'id, organization_id',
  'on delete cascade'
);
select pg_temp.ensure_organization_fk(
  'public.catalog_price_entries',
  'catalog_price_entries_product_org_fkey',
  'product_id, organization_id',
  'public.catalog_products',
  'id, organization_id',
  'on delete restrict'
);
select pg_temp.ensure_organization_fk(
  'public.crm_opportunity_products',
  'crm_opportunity_products_opportunity_org_fkey',
  'opportunity_id, organization_id',
  'public.crm_opportunities',
  'id, organization_id',
  'on delete cascade'
);
select pg_temp.ensure_organization_fk(
  'public.crm_opportunity_products',
  'crm_opportunity_products_product_org_fkey',
  'product_id, organization_id',
  'public.catalog_products',
  'id, organization_id',
  'on delete restrict'
);
select pg_temp.ensure_organization_fk(
  'public.crm_opportunity_products',
  'crm_opportunity_products_price_entry_org_fkey',
  'price_entry_id, organization_id',
  'public.catalog_price_entries',
  'id, organization_id',
  'on delete restrict'
);
select pg_temp.ensure_organization_fk(
  'public.communication_messages',
  'communication_messages_template_org_fkey',
  'template_id, organization_id',
  'public.communication_templates',
  'id, organization_id',
  'on delete restrict'
);

create or replace function public.prevent_crm_append_only_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception '% is append-only', tg_table_name
    using errcode = 'restrict_violation';
end;
$$;

revoke all on function public.prevent_crm_append_only_mutation() from public;

drop trigger if exists crm_activities_append_only on public.crm_activities;
create trigger crm_activities_append_only
before update or delete on public.crm_activities
for each row execute function public.prevent_crm_append_only_mutation();

drop trigger if exists crm_audit_events_append_only on public.crm_audit_events;
create trigger crm_audit_events_append_only
before update or delete on public.crm_audit_events
for each row execute function public.prevent_crm_append_only_mutation();

do $$
declare
  current_table_name text;
  scope_clause text;
begin
  foreach current_table_name in array array[
    'crm_contacts', 'crm_companies', 'crm_contact_companies', 'crm_related_people',
    'crm_pipeline_stages', 'crm_leads', 'crm_lead_attributions', 'crm_opportunities',
    'crm_tasks', 'crm_notes', 'crm_contact_consents',
    'catalog_products', 'catalog_price_books', 'catalog_price_entries',
    'crm_opportunity_products'
  ] loop
    scope_clause := '';
    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and information_schema.columns.table_name = current_table_name
        and column_name = 'workspace_id'
    ) then
      scope_clause := ' and (workspace_id is null or public.can_access_workspace(workspace_id))';
    end if;

    execute format('drop policy if exists %I on public.%I', current_table_name || '_organization_access', current_table_name);
    execute format('drop policy if exists %I on public.%I', current_table_name || '_crm_read', current_table_name);
    execute format('drop policy if exists %I on public.%I', current_table_name || '_crm_insert', current_table_name);
    execute format('drop policy if exists %I on public.%I', current_table_name || '_crm_update', current_table_name);
    execute format('drop policy if exists %I on public.%I', current_table_name || '_crm_delete', current_table_name);

    execute format(
      'create policy %I on public.%I for select to authenticated using (public.has_organization_permission(organization_id, ''crm.read'')%s)',
      current_table_name || '_crm_read',
      current_table_name,
      scope_clause
    );
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.has_organization_permission(organization_id, ''crm.manage'')%s)',
      current_table_name || '_crm_insert',
      current_table_name,
      scope_clause
    );
    execute format(
      'create policy %I on public.%I for update to authenticated using (public.has_organization_permission(organization_id, ''crm.manage'')%s) with check (public.has_organization_permission(organization_id, ''crm.manage'')%s)',
      current_table_name || '_crm_update',
      current_table_name,
      scope_clause,
      scope_clause
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated using (public.has_organization_permission(organization_id, ''crm.manage'')%s)',
      current_table_name || '_crm_delete',
      current_table_name,
      scope_clause
    );
  end loop;
end $$;

do $$
declare
  current_table_name text;
  scope_clause text;
begin
  foreach current_table_name in array array[
    'communication_accounts', 'communication_channels', 'communication_templates',
    'communication_conversations', 'communication_messages', 'communication_message_statuses',
    'communication_internal_notes', 'communication_webhook_events'
  ] loop
    scope_clause := '';
    if current_table_name = 'communication_conversations' then
      scope_clause := ' and (workspace_id is null or public.can_access_workspace(workspace_id))';
    end if;

    execute format('drop policy if exists %I on public.%I', current_table_name || '_read', current_table_name);
    execute format('drop policy if exists %I on public.%I', current_table_name || '_manage', current_table_name);
    execute format('drop policy if exists %I on public.%I', current_table_name || '_communications_read', current_table_name);
    execute format('drop policy if exists %I on public.%I', current_table_name || '_communications_insert', current_table_name);
    execute format('drop policy if exists %I on public.%I', current_table_name || '_communications_update', current_table_name);
    execute format('drop policy if exists %I on public.%I', current_table_name || '_communications_delete', current_table_name);

    execute format(
      'create policy %I on public.%I for select to authenticated using (public.has_organization_permission(organization_id, ''communications.read'')%s)',
      current_table_name || '_communications_read',
      current_table_name,
      scope_clause
    );
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.has_organization_permission(organization_id, ''communications.send'')%s)',
      current_table_name || '_communications_insert',
      current_table_name,
      scope_clause
    );
    execute format(
      'create policy %I on public.%I for update to authenticated using (public.has_organization_permission(organization_id, ''communications.send'')%s) with check (public.has_organization_permission(organization_id, ''communications.send'')%s)',
      current_table_name || '_communications_update',
      current_table_name,
      scope_clause,
      scope_clause
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated using (public.has_organization_permission(organization_id, ''communications.send'')%s)',
      current_table_name || '_communications_delete',
      current_table_name,
      scope_clause
    );
  end loop;
end $$;

do $$
declare
  current_table_name text;
begin
  foreach current_table_name in array array[
    'crm_contacts', 'crm_companies', 'crm_contact_companies', 'crm_related_people',
    'crm_pipeline_stages', 'crm_leads', 'crm_lead_attributions', 'crm_opportunities',
    'crm_tasks', 'crm_notes', 'crm_contact_consents', 'catalog_products',
    'catalog_price_books', 'catalog_price_entries', 'crm_opportunity_products'
  ] loop
    execute format('revoke all on table public.%I from authenticated', current_table_name);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', current_table_name);
  end loop;

  foreach current_table_name in array array['crm_activities', 'crm_audit_events'] loop
    execute format('revoke all on table public.%I from authenticated', current_table_name);
    execute format('grant select, insert on table public.%I to authenticated', current_table_name);
  end loop;

  foreach current_table_name in array array[
    'communication_accounts', 'communication_channels', 'communication_templates',
    'communication_conversations', 'communication_messages', 'communication_message_statuses',
    'communication_internal_notes', 'communication_webhook_events'
  ] loop
    execute format('revoke all on table public.%I from authenticated', current_table_name);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', current_table_name);
  end loop;
end $$;

drop policy if exists crm_activities_organization_access on public.crm_activities;
drop policy if exists crm_activities_shared_read on public.crm_activities;
drop policy if exists crm_activities_shared_append on public.crm_activities;
create policy crm_activities_crm_read on public.crm_activities
  for select to authenticated
  using (
    public.has_organization_permission(organization_id, 'crm.read')
  );
create policy crm_activities_crm_insert on public.crm_activities
  for insert to authenticated
  with check (
    public.has_organization_permission(organization_id, 'crm.manage')
  );

drop policy if exists crm_audit_events_organization_access on public.crm_audit_events;
create policy crm_audit_events_crm_read on public.crm_audit_events
  for select to authenticated
  using (public.has_organization_permission(organization_id, 'crm.read'));
create policy crm_audit_events_crm_insert on public.crm_audit_events
  for insert to authenticated
  with check (public.has_organization_permission(organization_id, 'crm.manage'));
