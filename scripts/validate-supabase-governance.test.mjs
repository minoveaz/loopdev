import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateSql } from './validate-supabase-governance.mjs';

const validMigration = `
  create table public.crm_examples (
    id uuid primary key,
    organization_id uuid not null references public.organizations(id),
    contact_id uuid not null,
    foreign key (contact_id, organization_id)
      references public.crm_contacts(id, organization_id)
  );
  alter table public.crm_examples enable row level security;
  create policy crm_examples_read on public.crm_examples for select using (true);
  create policy crm_examples_insert on public.crm_examples for insert with check (true);
  create policy crm_examples_update on public.crm_examples for update using (true) with check (true);
  create policy crm_examples_delete on public.crm_examples for delete using (true);
`;

test('accepts organization-owned tables with RLS, verb policies and scoped relationships', () => {
  assert.deepEqual(validateSql(validMigration), []);
});

test('rejects missing organization ownership and RLS controls', () => {
  const issues = validateSql(`
    create table public.crm_examples (id uuid primary key);
    create policy crm_examples_access on public.crm_examples for all using (true);
  `);
  assert.ok(issues.some((issue) => issue.includes('no organization_id')));
  assert.ok(issues.some((issue) => issue.includes('row level security')));
  assert.ok(issues.some((issue) => issue.includes('specific SQL verb')));
});

test('rejects cross-organization single-column relationships and excessive grants', () => {
  const issues = validateSql(`
    create table public.crm_examples (
      id uuid primary key,
      organization_id uuid not null references public.organizations(id),
      contact_id uuid references public.crm_contacts(id)
    );
    alter table public.crm_examples enable row level security;
    create policy crm_examples_read on public.crm_examples for select using (true);
    create policy crm_examples_insert on public.crm_examples for insert with check (true);
    create policy crm_examples_update on public.crm_examples for update using (true) with check (true);
    create policy crm_examples_delete on public.crm_examples for delete using (true);
    grant all privileges on table public.crm_examples to authenticated;
  `);
  assert.ok(issues.some((issue) => issue.includes('organization-aware composite foreign key')));
  assert.ok(issues.some((issue) => issue.includes('all privileges')));
});

test('keeps the CRM hardening migration free of static governance violations', () => {
  const migration = readFileSync(
    resolve('supabase/migrations/20260902000000_crm_security_hardening.sql'),
    'utf8',
  );
  assert.deepEqual(validateSql(migration, 'crm-hardening.sql'), []);
});

test('keeps the CRM Lead assignment barrier explicit and organization-scoped', () => {
  const migration = readFileSync(
    resolve('supabase/migrations/20260907000000_crm_lead_assignment_scope.sql'),
    'utf8',
  );
  assert.deepEqual(validateSql(migration, 'crm-lead-assignment-scope.sql'), []);
  assert.match(migration, /NO-GO preflight/);
  assert.match(
    migration,
    /foreign key \(organization_id, assigned_to_user_id\)[\s\S]*organization_memberships\(organization_id, user_id\)/,
  );
  assert.match(migration, /membership\.status = 'active'/);
  assert.match(migration, /membership\.role in \('owner', 'admin', 'agent'\)/);
});

test('accepts the Creative Studio policy contract without destructive policies', () => {
  const migration = readFileSync(
    resolve('supabase/migrations/20260827100000_marketing_creative_studio_persistence.sql'),
    'utf8',
  );
  assert.deepEqual(validateSql(migration, 'creative-studio.sql'), []);
});
