begin;

\ir helpers/rls_helpers.sql

select plan(15);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-4b00-8a00-000000000001', 'authenticated', 'authenticated', 'document-audit-a@example.test', '', now()),
  ('00000000-0000-4b00-8a00-000000000002', 'authenticated', 'authenticated', 'document-audit-b@example.test', '', now());

insert into public.organizations (id, name, slug)
values
  ('00000000-0000-4b00-8b00-000000000001', 'Document Audit A', 'document-audit-a'),
  ('00000000-0000-4b00-8b00-000000000002', 'Document Audit B', 'document-audit-b');

insert into public.organization_memberships (organization_id, user_id, role)
values
  ('00000000-0000-4b00-8b00-000000000001', '00000000-0000-4b00-8a00-000000000001', 'owner'),
  ('00000000-0000-4b00-8b00-000000000002', '00000000-0000-4b00-8a00-000000000002', 'owner');

insert into public.document_intelligence_documents (id, organization_id, status, retention_class, concurrency_token)
values
  ('00000000-0000-4b00-8c00-000000000001', '00000000-0000-4b00-8b00-000000000001', 'review', 'standard', 'audit-document-token-a'),
  ('00000000-0000-4b00-8c00-000000000002', '00000000-0000-4b00-8b00-000000000002', 'review', 'standard', 'audit-document-token-b');

insert into public.document_intelligence_versions (id, document_id, organization_id, version_number, concurrency_token)
values
  ('00000000-0000-4b00-8d00-000000000001', '00000000-0000-4b00-8c00-000000000001', '00000000-0000-4b00-8b00-000000000001', 1, 'audit-version-token-a'),
  ('00000000-0000-4b00-8d00-000000000002', '00000000-0000-4b00-8c00-000000000002', '00000000-0000-4b00-8b00-000000000002', 1, 'audit-version-token-b');

insert into public.document_intelligence_extractions (
  id, document_version_id, organization_id, attempt, provider, provider_version, schema_version, concurrency_token
)
values
  ('00000000-0000-4b00-8e00-000000000001', '00000000-0000-4b00-8d00-000000000001', '00000000-0000-4b00-8b00-000000000001', 1, 'fixture', '2026-09', '1', 'audit-extraction-token-a'),
  ('00000000-0000-4b00-8e00-000000000002', '00000000-0000-4b00-8d00-000000000002', '00000000-0000-4b00-8b00-000000000002', 1, 'fixture', '2026-09', '1', 'audit-extraction-token-b');

select ok(pg_temp.has_policy_for('document_intelligence_audit_events', 'select'), 'audit events expose a SELECT policy');
select ok(pg_temp.has_policy_for('document_intelligence_audit_events', 'insert'), 'audit events expose an INSERT policy');
select ok(not pg_temp.has_policy_for('document_intelligence_audit_events', 'update'), 'audit events have no UPDATE policy');
select ok(not pg_temp.has_policy_for('document_intelligence_audit_events', 'delete'), 'audit events have no DELETE policy');
select ok(pg_temp.has_scoped_fk('document_intelligence_audit_events', 'document_intelligence_documents'), 'audit events enforce document organization ownership');
select ok(pg_temp.has_scoped_fk('document_intelligence_audit_events', 'document_intelligence_versions'), 'audit events enforce version organization ownership');
select ok(pg_temp.has_scoped_fk('document_intelligence_audit_events', 'document_intelligence_extractions'), 'audit events enforce extraction organization ownership');
select ok(has_table_privilege('authenticated', 'public.document_intelligence_audit_events', 'update') = false, 'audit UPDATE privilege is revoked');
select ok(has_table_privilege('authenticated', 'public.document_intelligence_audit_events', 'delete') = false, 'audit DELETE privilege is revoked');

set local role authenticated;
select pg_temp.set_authenticated_user('00000000-0000-4b00-8a00-000000000001');

select lives_ok(
  $$ insert into public.document_intelligence_audit_events (
       organization_id, actor_type, actor_user_id, event_type, document_id,
       document_version_id, extraction_id, correlation_id, metadata
     ) values (
       '00000000-0000-4b00-8b00-000000000001', 'user', '00000000-0000-4b00-8a00-000000000001',
       'approved', '00000000-0000-4b00-8c00-000000000001',
       '00000000-0000-4b00-8d00-000000000001', '00000000-0000-4b00-8e00-000000000001',
       'audit-correlation-a', '{"reason_code":"reviewed"}'::jsonb
     ) $$,
  'an organization operator can append an own audit event'
);
select is((select count(*)::integer from public.document_intelligence_audit_events), 1, 'the actor can read own audit events');

select pg_temp.set_authenticated_user('00000000-0000-4b00-8a00-000000000002');
select is((select count(*)::integer from public.document_intelligence_audit_events), 0, 'another organization cannot read audit events');
select throws_ok(
  $$ insert into public.document_intelligence_audit_events (
       organization_id, actor_type, actor_user_id, event_type, document_id, correlation_id
     ) values (
       '00000000-0000-4b00-8b00-000000000001', 'user', '00000000-0000-4b00-8a00-000000000002',
       'retry_requested', '00000000-0000-4b00-8c00-000000000001', 'audit-cross-org'
     ) $$,
  'new row violates row-level security policy for table "document_intelligence_audit_events"',
  'cross-organization audit append is rejected'
);

reset role;
select throws_ok(
  $$ update public.document_intelligence_audit_events set event_type = 'rejected' $$,
  'document_intelligence_audit_events is append-only',
  'audit events reject UPDATE'
);
select throws_ok(
  $$ delete from public.document_intelligence_audit_events $$,
  'document_intelligence_audit_events is append-only',
  'audit events reject DELETE'
);

select * from finish();
rollback;
