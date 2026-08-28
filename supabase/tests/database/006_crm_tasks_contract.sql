begin;

\ir helpers/rls_helpers.sql

select plan(28);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-4100-8700-000000000001', 'authenticated', 'authenticated', 'tasks-a@example.test', '', now()),
  ('00000000-0000-4100-8700-000000000002', 'authenticated', 'authenticated', 'tasks-b@example.test', '', now()),
  ('00000000-0000-4100-8700-000000000003', 'authenticated', 'authenticated', 'tasks-viewer@example.test', '', now());

insert into public.organizations (id, name, slug)
values
  ('00000000-0000-4100-9700-000000000001', 'Tasks A', 'tasks-a'),
  ('00000000-0000-4100-9700-000000000002', 'Tasks B', 'tasks-b');

insert into public.organization_memberships (organization_id, user_id, role)
values
  ('00000000-0000-4100-9700-000000000001', '00000000-0000-4100-8700-000000000001', 'owner'),
  ('00000000-0000-4100-9700-000000000001', '00000000-0000-4100-8700-000000000002', 'admin'),
  ('00000000-0000-4100-9700-000000000001', '00000000-0000-4100-8700-000000000003', 'viewer'),
  ('00000000-0000-4100-9700-000000000002', '00000000-0000-4100-8700-000000000002', 'owner');

insert into public.brands (id, organization_id, name)
values
  ('00000000-0000-4100-9800-000000000001', '00000000-0000-4100-9700-000000000001', 'Tasks Brand A'),
  ('00000000-0000-4100-9800-000000000002', '00000000-0000-4100-9700-000000000002', 'Tasks Brand B');

insert into public.workspaces (id, organization_id, suite_key, name, slug)
values
  ('00000000-0000-4100-9900-000000000001', '00000000-0000-4100-9700-000000000001', 'crm', 'Tasks Workspace A', 'tasks-a'),
  ('00000000-0000-4100-9900-000000000002', '00000000-0000-4100-9700-000000000002', 'crm', 'Tasks Workspace B', 'tasks-b');

insert into public.crm_contacts (id, organization_id, first_name)
values
  ('00000000-0000-4100-9a00-000000000001', '00000000-0000-4100-9700-000000000001', 'Contact A'),
  ('00000000-0000-4100-9a00-000000000002', '00000000-0000-4100-9700-000000000002', 'Contact B');

insert into public.crm_leads (id, organization_id, contact_id, workspace_id, brand_id, stage, status, source)
values
  ('00000000-0000-4100-9b00-000000000001', '00000000-0000-4100-9700-000000000001', '00000000-0000-4100-9a00-000000000001', '00000000-0000-4100-9900-000000000001', '00000000-0000-4100-9800-000000000001', 'lead', 'cualificado', 'manual'),
  ('00000000-0000-4100-9b00-000000000002', '00000000-0000-4100-9700-000000000002', '00000000-0000-4100-9a00-000000000002', '00000000-0000-4100-9900-000000000002', '00000000-0000-4100-9800-000000000002', 'lead', 'cualificado', 'manual');

select ok(pg_temp.has_policy_for('crm_tasks', 'select'), 'Tasks expose a SELECT policy');
select ok(pg_temp.has_policy_for('crm_tasks', 'insert'), 'Tasks expose an INSERT policy');
select ok(pg_temp.has_policy_for('crm_tasks', 'update'), 'Tasks expose an UPDATE policy');
select ok(pg_temp.has_policy_for('crm_notes', 'update'), 'Notes expose an UPDATE policy');
select ok(pg_temp.has_policy_for('crm_timeline_events', 'select'), 'Timeline exposes a SELECT policy');
select ok(pg_temp.has_policy_for('crm_timeline_events', 'insert'), 'Timeline exposes an explicit deny INSERT policy');
select ok(pg_temp.has_scoped_fk('crm_tasks', 'crm_leads'), 'Legacy task lead relation remains scoped');
select ok(has_table_privilege('authenticated', 'public.crm_timeline_events', 'insert') = false, 'Timeline INSERT privilege is revoked');

set local role authenticated;
select pg_temp.set_authenticated_user('00000000-0000-4100-8700-000000000001');

select lives_ok($$
  insert into public.crm_tasks (
    id, organization_id, workspace_id, brand_id, relation_type, relation_id,
    lead_id, title, status, priority, created_by_user_id, last_actor_user_id,
    idempotency_key, idempotency_fingerprint, last_operation_key, last_operation_fingerprint
  ) values (
    '00000000-0000-4100-a400-000000000001',
    '00000000-0000-4100-9700-000000000001',
    '00000000-0000-4100-9900-000000000001',
    '00000000-0000-4100-9800-000000000001',
    'lead', '00000000-0000-4100-9b00-000000000001',
    '00000000-0000-4100-9b00-000000000001',
    'Call customer', 'open', 'normal',
    '00000000-0000-4100-8700-000000000002',
    '00000000-0000-4100-8700-000000000002',
    'tasks-create-001', 'fingerprint-001', 'tasks-create-001', 'fingerprint-001'
  )
$$, 'authorized task creation succeeds');

select is(
  (select count(*)::integer from public.crm_timeline_events
   where source_type = 'task' and source_id = '00000000-0000-4100-a400-000000000001'),
  1,
  'task creation appends one timeline event transactionally'
);

select lives_ok($$
  update public.crm_tasks
     set status = 'completed',
         version = 2,
         last_actor_user_id = '00000000-0000-4100-8700-000000000001',
         last_operation_key = 'tasks-complete-001',
         last_operation_fingerprint = 'fingerprint-002'
   where id = '00000000-0000-4100-a400-000000000001'
$$, 'authorized task completion succeeds');

select is(
  (select count(*)::integer from public.crm_timeline_events
   where source_type = 'task' and source_id = '00000000-0000-4100-a400-000000000001'),
  2,
  'task completion appends a second timeline event'
);

select throws_ok($$
  update public.crm_tasks set status = 'in_progress', version = 3
   where id = '00000000-0000-4100-a400-000000000001'
$$, 'CRM task status transition is not allowed', 'terminal task cannot move to in_progress');

select throws_ok($$
  insert into public.crm_tasks (
    organization_id, workspace_id, relation_type, relation_id, lead_id,
    title, status, priority, created_by_user_id
  ) values (
    '00000000-0000-4100-9700-000000000001',
    '00000000-0000-4100-9900-000000000001',
    'lead', '00000000-0000-4100-9b00-000000000002',
    '00000000-0000-4100-9b00-000000000002',
    'Cross tenant', 'open', 'normal',
    '00000000-0000-4100-8700-000000000001'
  )
$$, 'CRM relation is outside the organization scope', 'cross-organization relation is rejected');

select lives_ok($$
  insert into public.crm_notes (
    organization_id, workspace_id, brand_id, relation_type, relation_id,
    lead_id, author_user_id, body, visibility, idempotency_key,
    idempotency_fingerprint, last_operation_key, last_operation_fingerprint
  ) values (
    '00000000-0000-4100-9700-000000000001',
    '00000000-0000-4100-9900-000000000001',
    '00000000-0000-4100-9800-000000000001',
    'lead', '00000000-0000-4100-9b00-000000000001',
    '00000000-0000-4100-9b00-000000000001',
    '00000000-0000-4100-8700-000000000002',
    'Confidential note body', 'private', 'notes-create-001',
    'note-fingerprint-001', 'notes-create-001', 'note-fingerprint-001'
  )
$$, 'authorized note creation succeeds');

select is(
  (select count(*)::integer from public.crm_timeline_events
   where source_type = 'note' and source_id = (
     select id from public.crm_notes where idempotency_key = 'notes-create-001'
   )),
  1,
  'note creation appends one timeline event'
);

select ok(
  has_column_privilege('authenticated', 'public.crm_notes', 'body', 'select') = false,
  'authenticated clients cannot directly select private note bodies'
);

select is(
  (select body from public.crm_notes_visible where id = (select id from public.crm_notes where idempotency_key = 'notes-create-001')),
  'Confidential note body',
  'note author can read private body through secure view'
);

select is(
  (select author_user_id from public.crm_notes where idempotency_key = 'notes-create-001'),
  '00000000-0000-4100-8700-000000000001'::uuid,
  'authenticated actor overrides spoofed note author'
);

reset role;
select pg_temp.set_authenticated_user('00000000-0000-4100-8700-000000000002');
set local role authenticated;
select is(
  (select body from public.crm_notes_visible where id = (select id from public.crm_notes where idempotency_key = 'notes-create-001')),
  'Confidential note body',
  'organization moderator can read private body'
);

reset role;
select pg_temp.set_authenticated_user('00000000-0000-4100-8700-000000000003');
set local role authenticated;
select is(
  (select body from public.crm_notes_visible where id = (select id from public.crm_notes where idempotency_key = 'notes-create-001')),
  null,
  'non-author non-moderator cannot read private body'
);

reset role;
set local role authenticated;
select throws_ok($$
  select body from public.crm_notes where id = (select id from public.crm_notes where idempotency_key = 'notes-create-001')
$$, 'permission denied for table crm_notes', 'base note table body read is denied');

reset role;
select pg_temp.set_authenticated_user('00000000-0000-4100-8700-000000000001');
set local role authenticated;
select lives_ok($$
  select public.crm_convert_lead(
    '00000000-0000-4100-9700-000000000001',
    '00000000-0000-4100-9b00-000000000001',
    'Core Product',
    'Converted Lead'
  )
$$, 'lead conversion succeeds atomically');
select is(
  (select status from public.crm_leads where id = '00000000-0000-4100-9b00-000000000001'),
  'convertido',
  'lead status reconciles with conversion'
);
select is(
  (select count(*)::integer from public.crm_opportunities
   where lead_id = '00000000-0000-4100-9b00-000000000001' and origin = 'lead_conversion'),
  1,
  'conversion creates one opportunity'
);
select is(
  (public.crm_convert_lead(
    '00000000-0000-4100-9700-000000000001',
    '00000000-0000-4100-9b00-000000000001',
    'Core Product',
    'Converted Lead'
  )->>'created'),
  'false',
  'conversion retry reconciles without duplicate opportunity'
);

select is(
  (select count(*)::integer from public.crm_timeline_events
   where summary like '%Confidential note body%'
      or metadata::text like '%Confidential note body%'),
  0,
  'timeline never stores note bodies'
);

reset role;
select throws_ok($$
  update public.crm_timeline_events
     set summary = 'tampered'
   where source_type = 'task'
$$, 'crm_timeline_events is append-only', 'timeline events reject UPDATE');

reset role;
select * from finish();
rollback;
