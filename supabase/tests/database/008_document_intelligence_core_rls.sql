begin;

\ir helpers/rls_helpers.sql

select plan(28);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
values
  ('00000000-0000-4b00-8100-000000000001', 'authenticated', 'authenticated', 'document-core-a@example.test', '', now()),
  ('00000000-0000-4b00-8100-000000000002', 'authenticated', 'authenticated', 'document-core-b@example.test', '', now()),
  ('00000000-0000-4b00-8100-000000000003', 'authenticated', 'authenticated', 'document-core-multi-org@example.test', '', now());

insert into public.organizations (id, name, slug)
values
  ('00000000-0000-4b00-8200-000000000001', 'Document Core A', 'document-core-a'),
  ('00000000-0000-4b00-8200-000000000002', 'Document Core B', 'document-core-b');

insert into public.organization_memberships (organization_id, user_id, role)
values
  ('00000000-0000-4b00-8200-000000000001', '00000000-0000-4b00-8100-000000000001', 'owner'),
  ('00000000-0000-4b00-8200-000000000002', '00000000-0000-4b00-8100-000000000002', 'owner'),
  ('00000000-0000-4b00-8200-000000000001', '00000000-0000-4b00-8100-000000000003', 'owner'),
  ('00000000-0000-4b00-8200-000000000002', '00000000-0000-4b00-8100-000000000003', 'owner');

insert into public.workspaces (id, organization_id, suite_key, name, slug)
values
  ('00000000-0000-4b00-8300-000000000001', '00000000-0000-4b00-8200-000000000001', 'operations', 'Document Core Workspace A', 'document-core-workspace-a'),
  ('00000000-0000-4b00-8300-000000000002', '00000000-0000-4b00-8200-000000000002', 'operations', 'Document Core Workspace B', 'document-core-workspace-b');

insert into public.document_intelligence_documents (
  id, organization_id, workspace_id, status, retention_class, concurrency_token
)
values
  ('00000000-0000-4b00-8400-000000000001', '00000000-0000-4b00-8200-000000000001', '00000000-0000-4b00-8300-000000000001', 'review', 'standard', 'document-core-token-a'),
  ('00000000-0000-4b00-8400-000000000002', '00000000-0000-4b00-8200-000000000002', '00000000-0000-4b00-8300-000000000002', 'review', 'standard', 'document-core-token-b'),
  ('00000000-0000-4b00-8400-000000000003', '00000000-0000-4b00-8200-000000000001', '00000000-0000-4b00-8300-000000000001', 'review', 'standard', 'document-core-token-a2');

insert into public.document_intelligence_versions (
  id, document_id, organization_id, version_number, source_reference, concurrency_token
)
values
  ('00000000-0000-4b00-8500-000000000001', '00000000-0000-4b00-8400-000000000001', '00000000-0000-4b00-8200-000000000001', 1, 'private/documents/a.pdf', 'version-core-token-a'),
  ('00000000-0000-4b00-8500-000000000002', '00000000-0000-4b00-8400-000000000002', '00000000-0000-4b00-8200-000000000002', 1, 'private/documents/b.pdf', 'version-core-token-b'),
  ('00000000-0000-4b00-8500-000000000003', '00000000-0000-4b00-8400-000000000003', '00000000-0000-4b00-8200-000000000001', 1, 'private/documents/a-2.pdf', 'version-core-token-a2');

insert into public.document_intelligence_extractions (
  id, document_version_id, organization_id, attempt, provider, provider_version, schema_version, concurrency_token
)
values
  ('00000000-0000-4b00-8600-000000000001', '00000000-0000-4b00-8500-000000000001', '00000000-0000-4b00-8200-000000000001', 1, 'fixture', '2026-09', '1', 'extraction-core-token-a'),
  ('00000000-0000-4b00-8600-000000000002', '00000000-0000-4b00-8500-000000000002', '00000000-0000-4b00-8200-000000000002', 1, 'fixture', '2026-09', '1', 'extraction-core-token-b');

select ok(pg_temp.has_policy_for('document_intelligence_documents', 'select'), 'documents expose a SELECT policy');
select ok(pg_temp.has_policy_for('document_intelligence_documents', 'insert'), 'documents expose an INSERT policy');
select ok(pg_temp.has_policy_for('document_intelligence_documents', 'update'), 'documents expose an UPDATE policy');
select ok(pg_temp.has_policy_for('document_intelligence_documents', 'delete'), 'documents expose a DELETE policy');
select ok(pg_temp.has_policy_for('document_intelligence_versions', 'select'), 'versions expose a SELECT policy');
select ok(pg_temp.has_policy_for('document_intelligence_versions', 'insert'), 'versions expose an INSERT policy');
select ok(pg_temp.has_policy_for('document_intelligence_versions', 'update'), 'versions expose an UPDATE policy');
select ok(pg_temp.has_policy_for('document_intelligence_versions', 'delete'), 'versions expose a DELETE policy');
select ok(pg_temp.has_policy_for('document_intelligence_extractions', 'select'), 'extractions expose a SELECT policy');
select ok(pg_temp.has_policy_for('document_intelligence_extractions', 'insert'), 'extractions expose an INSERT policy');
select ok(pg_temp.has_policy_for('document_intelligence_extractions', 'update'), 'extractions expose an UPDATE policy');
select ok(pg_temp.has_policy_for('document_intelligence_extractions', 'delete'), 'extractions expose a DELETE policy');
select ok(pg_temp.has_scoped_fk('document_intelligence_versions', 'document_intelligence_documents'), 'versions enforce document organization ownership');
select ok(pg_temp.has_scoped_fk('document_intelligence_extractions', 'document_intelligence_versions'), 'extractions enforce version organization ownership');
select ok(pg_temp.has_scoped_fk('document_intelligence_documents', 'workspaces'), 'documents enforce workspace organization ownership');
select ok(
  exists (
    select 1
    from pg_constraint constraint_row
    join pg_class child_relation on child_relation.oid = constraint_row.conrelid
    join pg_class parent_relation on parent_relation.oid = constraint_row.confrelid
    where constraint_row.contype = 'f'
      and child_relation.relname = 'document_intelligence_documents'
      and parent_relation.relname = 'organizations'
  ),
  'documents reference the canonical organization'
);

set local role authenticated;
select pg_temp.set_authenticated_user('00000000-0000-4b00-8100-000000000001');

select is((select count(*)::integer from public.document_intelligence_documents), 2, 'a member reads only own organization documents');
select is((select count(*)::integer from public.document_intelligence_versions), 2, 'a member reads only own organization versions');
select is((select count(*)::integer from public.document_intelligence_extractions), 1, 'a member reads only own organization extractions');
select throws_ok(
  $$ insert into public.document_intelligence_documents (organization_id, workspace_id, retention_class, concurrency_token)
     values ('00000000-0000-4b00-8200-000000000002', '00000000-0000-4b00-8300-000000000002', 'standard', 'cross-org-document-token') $$,
  'new row violates row-level security policy for table "document_intelligence_documents"',
  'cross-organization document creation is rejected'
);
select throws_ok(
  $$ insert into public.document_intelligence_versions (document_id, organization_id, version_number, concurrency_token)
     values ('00000000-0000-4b00-8400-000000000002', '00000000-0000-4b00-8200-000000000002', 2, 'cross-org-version-token') $$,
  'new row violates row-level security policy for table "document_intelligence_versions"',
  'cross-organization version creation is rejected'
);
select throws_ok(
  $$ insert into public.document_intelligence_extractions (document_version_id, organization_id, attempt, provider, provider_version, schema_version, concurrency_token)
     values ('00000000-0000-4b00-8500-000000000002', '00000000-0000-4b00-8200-000000000002', 2, 'fixture', '2026-09', '1', 'cross-org-extraction-token') $$,
  'new row violates row-level security policy for table "document_intelligence_extractions"',
  'cross-organization extraction creation is rejected'
);
select lives_ok(
  $$ update public.document_intelligence_documents
     set status = 'approved'
     where id = '00000000-0000-4b00-8400-000000000001' $$,
  'an organization operator can update an own document'
);
select throws_ok(
  $$ update public.document_intelligence_documents
     set current_version_id = '00000000-0000-4b00-8500-000000000003'
     where id = '00000000-0000-4b00-8400-000000000001' $$,
  '23503',
  'insert or update on table "document_intelligence_documents" violates foreign key constraint "document_intelligence_documents_current_version_fkey"',
  'a document cannot point at another document version'
);
select pg_temp.set_authenticated_user('00000000-0000-4b00-8100-000000000003');
select throws_ok(
  $$ update public.document_intelligence_documents
     set organization_id = '00000000-0000-4b00-8200-000000000002',
         workspace_id = '00000000-0000-4b00-8300-000000000002'
     where id = '00000000-0000-4b00-8400-000000000001' $$,
  'document_intelligence organization_id is immutable',
  'a multi-organization member cannot move a document'
);
select throws_ok(
  $$ update public.document_intelligence_versions
     set organization_id = '00000000-0000-4b00-8200-000000000002',
         document_id = '00000000-0000-4b00-8400-000000000002'
     where id = '00000000-0000-4b00-8500-000000000001' $$,
  'document_intelligence organization_id is immutable',
  'a multi-organization member cannot move a document version'
);
select throws_ok(
  $$ update public.document_intelligence_extractions
     set organization_id = '00000000-0000-4b00-8200-000000000002',
         document_version_id = '00000000-0000-4b00-8500-000000000002'
     where id = '00000000-0000-4b00-8600-000000000001' $$,
  'document_intelligence organization_id is immutable',
  'a multi-organization member cannot move an extraction'
);
select pg_temp.set_authenticated_user('00000000-0000-4b00-8100-000000000001');
select is(
  (select count(*)::integer
   from public.document_intelligence_documents
   where id = '00000000-0000-4b00-8400-000000000002'),
  0,
  'an operator cannot observe or delete another organization document'
);

select * from finish();
rollback;
