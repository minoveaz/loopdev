begin;

\ir helpers/rls_helpers.sql

select plan(15);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-4b00-8f00-000000000001', 'authenticated', 'authenticated', 'document-cleanup-a@example.test', '', now()),
  ('00000000-0000-4b00-8f00-000000000002', 'authenticated', 'authenticated', 'document-cleanup-b@example.test', '', now()),
  ('00000000-0000-4b00-8f00-000000000003', 'authenticated', 'authenticated', 'document-cleanup-multi-org@example.test', '', now());

insert into public.organizations (id, name, slug)
values
  ('00000000-0000-4b00-9000-000000000001', 'Document Cleanup A', 'document-cleanup-a'),
  ('00000000-0000-4b00-9000-000000000002', 'Document Cleanup B', 'document-cleanup-b');

insert into public.organization_memberships (organization_id, user_id, role)
values
  ('00000000-0000-4b00-9000-000000000001', '00000000-0000-4b00-8f00-000000000001', 'owner'),
  ('00000000-0000-4b00-9000-000000000002', '00000000-0000-4b00-8f00-000000000002', 'owner'),
  ('00000000-0000-4b00-9000-000000000001', '00000000-0000-4b00-8f00-000000000003', 'owner'),
  ('00000000-0000-4b00-9000-000000000002', '00000000-0000-4b00-8f00-000000000003', 'owner');

insert into public.document_intelligence_documents (id, organization_id, status, retention_class, concurrency_token)
values
  ('00000000-0000-4b00-9100-000000000001', '00000000-0000-4b00-9000-000000000001', 'uploaded', 'temporary_source', 'cleanup-document-token-a'),
  ('00000000-0000-4b00-9100-000000000002', '00000000-0000-4b00-9000-000000000002', 'uploaded', 'temporary_source', 'cleanup-document-token-b');

insert into public.document_intelligence_cleanup_jobs (
  id, organization_id, document_id, retention_class, due_at, idempotency_key
)
values
  ('00000000-0000-4b00-9200-000000000001', '00000000-0000-4b00-9000-000000000001', '00000000-0000-4b00-9100-000000000001', 'temporary_source', now(), 'cleanup-job-a'),
  ('00000000-0000-4b00-9200-000000000002', '00000000-0000-4b00-9000-000000000002', '00000000-0000-4b00-9100-000000000002', 'temporary_source', now(), 'cleanup-job-b');

select ok(pg_temp.has_policy_for('document_intelligence_cleanup_jobs', 'select'), 'cleanup jobs expose a SELECT policy');
select ok(pg_temp.has_policy_for('document_intelligence_cleanup_jobs', 'insert'), 'cleanup jobs expose an INSERT policy');
select ok(pg_temp.has_policy_for('document_intelligence_cleanup_jobs', 'update'), 'cleanup jobs expose an UPDATE policy');
select ok(not pg_temp.has_policy_for('document_intelligence_cleanup_jobs', 'delete'), 'cleanup jobs have no DELETE policy');
select ok(pg_temp.has_scoped_fk('document_intelligence_cleanup_jobs', 'document_intelligence_documents'), 'cleanup jobs enforce document organization ownership');
select ok(has_table_privilege('authenticated', 'public.document_intelligence_cleanup_jobs', 'delete') = false, 'cleanup DELETE privilege is revoked');

set local role authenticated;
select pg_temp.set_authenticated_user('00000000-0000-4b00-8f00-000000000001');

select is((select count(*)::integer from public.document_intelligence_cleanup_jobs), 1, 'an operator reads only own cleanup jobs');
select lives_ok(
  $$ update public.document_intelligence_cleanup_jobs
     set status = 'retrying', attempt = 1, last_error_code = 'STORAGE_DELETE_FAILED', next_retry_at = now()
     where id = '00000000-0000-4b00-9200-000000000001' $$,
  'an operator can record a retryable cleanup failure'
);
select throws_ok(
  $$ insert into public.document_intelligence_cleanup_jobs (
       organization_id, document_id, retention_class, due_at, idempotency_key
     ) values (
       '00000000-0000-4b00-9000-000000000002', '00000000-0000-4b00-9100-000000000002',
       'temporary_source', now(), 'cleanup-cross-org'
     ) $$,
  'new row violates row-level security policy for table "document_intelligence_cleanup_jobs"',
  'cross-organization cleanup scheduling is rejected'
);
select is(
  (select count(*)::integer
   from public.document_intelligence_cleanup_jobs
   where id = '00000000-0000-4b00-9200-000000000002'),
  0,
  'an operator cannot observe another organization cleanup job'
);

select pg_temp.set_authenticated_user('00000000-0000-4b00-8f00-000000000002');
select is((select count(*)::integer from public.document_intelligence_cleanup_jobs), 1, 'the second operator sees only its cleanup job');
select is(
  (select count(*)::integer
   from public.document_intelligence_cleanup_jobs
   where id = '00000000-0000-4b00-9200-000000000001'),
  0,
  'cross-organization cleanup recovery cannot observe or mutate the job'
);

select lives_ok(
  $$ update public.document_intelligence_cleanup_jobs
     set status = 'completed', completed_at = now()
     where id = '00000000-0000-4b00-9200-000000000002' $$,
  'an operator can mark an own cleanup job complete'
);
select is(
  (select status from public.document_intelligence_cleanup_jobs where id = '00000000-0000-4b00-9200-000000000002'),
  'completed',
  'cleanup completion is durable'
);
select pg_temp.set_authenticated_user('00000000-0000-4b00-8f00-000000000003');
select throws_ok(
  $$ update public.document_intelligence_cleanup_jobs
     set organization_id = '00000000-0000-4b00-9000-000000000002',
         document_id = '00000000-0000-4b00-9100-000000000002'
     where id = '00000000-0000-4b00-9200-000000000001' $$,
  'document_intelligence organization_id is immutable',
  'a multi-organization member cannot move a cleanup job'
);

select * from finish();
rollback;
