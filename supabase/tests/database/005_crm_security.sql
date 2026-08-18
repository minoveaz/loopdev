begin;

\ir helpers/rls_helpers.sql

select plan(26);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-4000-8700-000000000001', 'authenticated', 'authenticated', 'crm-security-a@example.test', '', now()),
  ('00000000-0000-4000-8700-000000000002', 'authenticated', 'authenticated', 'crm-security-b@example.test', '', now());

insert into public.organizations (id, name, slug)
values
  ('00000000-0000-4000-9700-000000000001', 'CRM Security A', 'crm-security-a'),
  ('00000000-0000-4000-9700-000000000002', 'CRM Security B', 'crm-security-b');

insert into public.organization_memberships (organization_id, user_id, role)
values
  ('00000000-0000-4000-9700-000000000001', '00000000-0000-4000-8700-000000000001', 'owner'),
  ('00000000-0000-4000-9700-000000000002', '00000000-0000-4000-8700-000000000002', 'viewer');

insert into public.brands (id, organization_id, name)
values
  ('00000000-0000-4000-9800-000000000001', '00000000-0000-4000-9700-000000000001', 'CRM Security Brand A'),
  ('00000000-0000-4000-9800-000000000002', '00000000-0000-4000-9700-000000000002', 'CRM Security Brand B');

insert into public.workspaces (id, organization_id, suite_key, name, slug)
values
  ('00000000-0000-4000-9900-000000000001', '00000000-0000-4000-9700-000000000001', 'crm', 'CRM Security Workspace A', 'crm-security-workspace-a'),
  ('00000000-0000-4000-9900-000000000002', '00000000-0000-4000-9700-000000000002', 'crm', 'CRM Security Workspace B', 'crm-security-workspace-b');

insert into public.crm_contacts (id, organization_id, first_name, email)
values
  ('00000000-0000-4000-9a00-000000000001', '00000000-0000-4000-9700-000000000001', 'Contact A', 'a@crm-security.test'),
  ('00000000-0000-4000-9a00-000000000002', '00000000-0000-4000-9700-000000000002', 'Contact B', 'b@crm-security.test');

insert into public.crm_leads (id, organization_id, contact_id, workspace_id, stage, source)
values
  ('00000000-0000-4000-9b00-000000000001', '00000000-0000-4000-9700-000000000001', '00000000-0000-4000-9a00-000000000001', '00000000-0000-4000-9900-000000000001', 'lead', 'manual'),
  ('00000000-0000-4000-9b00-000000000002', '00000000-0000-4000-9700-000000000002', '00000000-0000-4000-9a00-000000000002', '00000000-0000-4000-9900-000000000002', 'lead', 'manual');

insert into public.crm_activities (id, organization_id, lead_id, type, summary)
values
  ('00000000-0000-4000-9c00-000000000001', '00000000-0000-4000-9700-000000000001', '00000000-0000-4000-9b00-000000000001', 'note', 'Activity A'),
  ('00000000-0000-4000-9c00-000000000002', '00000000-0000-4000-9700-000000000002', '00000000-0000-4000-9b00-000000000002', 'note', 'Activity B');

select ok(pg_temp.has_policy_for('crm_contacts', 'select'), 'CRM contacts expose a SELECT policy');
select ok(pg_temp.has_policy_for('crm_contacts', 'insert'), 'CRM contacts expose an INSERT policy');
select ok(pg_temp.has_policy_for('crm_contacts', 'update'), 'CRM contacts expose an UPDATE policy');
select ok(pg_temp.has_policy_for('crm_contacts', 'delete'), 'CRM contacts expose a DELETE policy');
select ok(pg_temp.has_scoped_fk('crm_leads', 'crm_contacts'), 'CRM leads enforce contact organization ownership');
select ok(pg_temp.has_scoped_fk('crm_contact_companies', 'crm_contacts'), 'contact companies enforce contact organization ownership');
select ok(pg_temp.has_policy_for('crm_audit_events', 'select'), 'CRM audit events expose a SELECT policy');
select ok(pg_temp.has_policy_for('crm_audit_events', 'insert'), 'CRM audit events expose an INSERT policy');
select ok(not pg_temp.has_policy_for('crm_audit_events', 'update'), 'CRM audit events have no UPDATE policy');
select ok(not pg_temp.has_policy_for('crm_audit_events', 'delete'), 'CRM audit events have no DELETE policy');
select is(
  (select count(*)::integer from pg_policies where schemaname = 'public' and tablename like 'crm_%' and lower(cmd) = 'all'),
  0,
  'CRM policies are declared per SQL verb'
);
select ok(pg_temp.has_scoped_fk('crm_activities', 'crm_leads'), 'CRM activities enforce lead organization ownership');

set local role authenticated;
select pg_temp.set_authenticated_user('00000000-0000-4000-8700-000000000001');

select is((select count(*)::integer from public.crm_contacts), 1, 'organization member reads own contacts');
select is((select count(*)::integer from public.crm_activities), 1, 'organization member reads own workspace activity');
select ok(
  not exists (select 1 from public.crm_contacts where organization_id = '00000000-0000-4000-9700-000000000002'),
  'organization member cannot read another organization contacts'
);
select lives_ok(
  $$ update public.crm_contacts set first_name = 'Updated A' where id = '00000000-0000-4000-9a00-000000000001' $$,
  'organization owner can update a contact'
);
select throws_ok(
  $$ insert into public.crm_contacts (organization_id, first_name, email) values ('00000000-0000-4000-9700-000000000001', 'Duplicate', 'a@crm-security.test') $$,
  'duplicate key value violates unique constraint "crm_contacts_organization_id_email_normalized_key"',
  'duplicate contact insert is rejected by the scoped unique key'
);
select throws_ok(
  $$ insert into public.crm_contacts (organization_id, first_name) values ('00000000-0000-4000-9700-000000000002', 'Cross organization') $$,
  'new row violates row-level security policy for table "crm_contacts"',
  'organization member cannot insert another organization contact'
);
select throws_ok(
  $$ insert into public.crm_contacts (organization_id, first_name, email) values ('00000000-0000-4000-9700-000000000002', 'Cross organization', 'cross@crm-security.test') $$,
  'new row violates row-level security policy for table "crm_contacts"',
  'organization member cannot create another organization contact'
);
select throws_ok(
  $$ insert into public.crm_leads (organization_id, contact_id, workspace_id, stage, source)
     values ('00000000-0000-4000-9700-000000000001', '00000000-0000-4000-9a00-000000000001', '00000000-0000-4000-9900-000000000002', 'lead', 'manual') $$,
  'new row violates row-level security policy for table "crm_leads"',
  'organization member cannot write into another workspace organization'
);

select ok(has_table_privilege('authenticated', 'public.crm_audit_events', 'update') = false, 'audit UPDATE privilege is revoked');
select ok(has_table_privilege('authenticated', 'public.crm_audit_events', 'delete') = false, 'audit DELETE privilege is revoked');
select lives_ok(
  $$ insert into public.crm_audit_events (organization_id, entity_type, entity_id, action) values ('00000000-0000-4000-9700-000000000001', 'contact', '00000000-0000-4000-9a00-000000000001', 'created') $$,
  'authorized CRM command can append an audit event'
);

reset role;
select throws_ok(
  $$ update public.crm_audit_events set action = 'updated' where entity_id = '00000000-0000-4000-9a00-000000000001' $$,
  'crm_audit_events is append-only',
  'audit events reject UPDATE even for a privileged database role'
);
select throws_ok(
  $$ delete from public.crm_audit_events where entity_id = '00000000-0000-4000-9a00-000000000001' $$,
  'crm_audit_events is append-only',
  'audit events reject DELETE even for a privileged database role'
);
select throws_ok(
  $$ insert into public.crm_leads (organization_id, contact_id, workspace_id, stage, source)
     values ('00000000-0000-4000-9700-000000000001', '00000000-0000-4000-9a00-000000000002', '00000000-0000-4000-9900-000000000001', 'lead', 'manual') $$,
  'insert or update on table "crm_leads" violates foreign key constraint "crm_leads_contact_org_fkey"',
  'composite CRM foreign keys reject cross-organization links'
);

select * from finish();
rollback;
