# Database table and suite readiness checklist

Use this checklist before introducing a business table or a suite that owns
organization data. It complements the platform
[Definition of Ready](./INFRA_DEFINITION_OF_READY.md) and
[Definition of Done](./INFRA_DEFINITION_OF_DONE.md).

## Definition of Ready

### Scope and ownership

- [ ] The table or suite has one named owner in `tracks/domains.md`.
- [ ] The business outcome, included scope, exclusions and rollback boundary
      are written in the active track.
- [ ] The organization, workspace and optional brand ownership model is
      explicit; `tenant_id` is only used at a documented legacy boundary.
- [ ] Read and mutation capabilities, membership roles and server-side context
      resolution are agreed.

### Data contract

- [ ] Every organization-owned table has a non-null `organization_id`
      referencing `public.organizations(id)`.
- [ ] Every relationship to another organization-owned record has a composite
      `(child_id, organization_id)` foreign key to `(id, organization_id)`.
- [ ] Workspace relationships use the same composite organization-aware
      constraint.
- [ ] Polymorphic references are explicitly documented and covered by a
      command-boundary validation; they are not an undocumented escape hatch.
- [ ] Financial values use the repository's BIGINT/cents contract where
      applicable.

### Security and validation plan

- [ ] RLS is enabled before the table is exposed to an application role.
- [ ] SELECT, INSERT, UPDATE and DELETE policies are separate and use
      membership/capability helpers; append-only tables intentionally omit
      UPDATE and DELETE.
- [ ] Grants are least privilege for the application role; no `PUBLIC`, `anon`
      or `ALL` grant is introduced.
- [ ] The pgTAP plan covers organization mismatch, workspace mismatch,
      inactive/unauthorized membership, and append-only behavior where relevant.
- [ ] `pnpm validate:supabase-governance` is included in the validation plan.

## Definition of Done

### Migration and database

- [ ] The migration is versioned, additive or has an approved rollback, and
      succeeds from a clean `supabase db reset`.
- [ ] The migration governance validator passes for the changed migrations.
- [ ] `supabase db lint --local` passes.
- [ ] Focused pgTAP tests pass with fixtures for at least two organizations.
- [ ] The migration does not widen existing grants or introduce a broad policy.

### Suite integration

- [ ] Shared contracts and server commands resolve organization/workspace
      context from authenticated membership, never from an unverified client
      parameter.
- [ ] API errors do not reveal SQL details, secrets or cross-organization
      existence.
- [ ] The suite consumes the canonical shell and shared contracts; it does not
      create parallel navigation or authorization primitives.
- [ ] Loading, empty, success and error states are represented for consumers.

### Evidence and handoff

- [ ] The active track records the objective, decisions, phase status, risks,
      validation results and residual blockers.
- [ ] The PR/CI evidence links the migration, tests, validator output and
      reset/lint result.
- [ ] Any Docker or remote-environment limitation is recorded as a blocker,
      not hidden behind a skipped test.
- [ ] The next consumer and one concrete handoff action are named.
