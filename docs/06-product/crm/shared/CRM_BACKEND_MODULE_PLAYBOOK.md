---
title: CRM backend-first module playbook
status: canonical
version: 1.0
created: 2026-08-18
updated: 2026-08-18
owner: crm
---

# CRM backend-first module playbook

This is the repeatable implementation process for Contacts, Leads, Pipeline,
Tasks and future CRM modules. It is an execution guide, not a replacement for
the approved module contract or the CRM pilot track.

## 1. Start here

Read only these authorities first:

1. This playbook.
2. `tracks/active/crm/2026-08-13-crm-pilot-execution.md`.
3. The module's five approved documents: UX, component audit, contract, impact
   assessment and implementation handoff.
4. The already-certified predecessor module, when a dependency exists.
5. The relevant schema migration, RLS hardening migration and database suite.

Before coding, record the module Issue, branch, dependencies, out-of-scope
items and Definition of Ready in the delivery track. Do not re-inventory the
whole repository unless a contract or schema conflict is found.

## 2. Standard delivery sequence

Use one vertical slice in this order:

```text
approved contract
  -> shared Zod schemas and error codes
  -> additive schema/migration
  -> organization-aware RLS and constraints
  -> service operations and mappers
  -> thin authorized API adapters
  -> deterministic fixtures
  -> contract/API/service/pgTAP tests
  -> reset + governance + typecheck/build
  -> handoff evidence and PR
```

The module must reuse `organization_id`, server-side authorization, shared
normalizers, cursor pagination, optimistic timestamps and the existing CRM
error/response conventions. Do not introduce a second tenant model, repository
pattern, authorization helper or fixture format.

## 3. Required implementation checklist

### Contracts

- Define read models, commands, queries, pagination and stable error codes.
- Validate every API input at the boundary with Zod.
- Define idempotency and concurrency before writing the mutation.
- Define lifecycle transitions and forbidden transitions explicitly.
- Keep provider fields synthetic and optional unless the module requires them.

### Database and security

- Add an additive migration only.
- Every organization-owned table has `organization_id` and RLS.
- Split policies by `SELECT`, `INSERT`, `UPDATE` and `DELETE`.
- Use composite organization-aware foreign keys for owned relationships.
- Add unique keys for idempotency and duplicate protection.
- Keep activities/audit events append-only.
- Add negative pgTAP cases for cross-organization reads, writes and references.

### Backend

- Reuse `apps/loopdev-os/src/services/crm/core.ts` for Contacts primitives and
  keep module-specific operations in a focused service file.
- Keep App Router adapters thin: parse, authorize, call service, map safe error.
- Never return raw Supabase errors, PII from another organization or stack traces.
- Return `409` for optimistic conflicts and duplicate/idempotency collisions
  where the contract defines them.

### Fixtures

- Use deterministic UUIDs and synthetic `example.test` identities.
- Load dependencies in order: organization/workspace/brand, contacts, leads,
  opportunities, tasks, notes, activities.
- Include happy path, negative path, retry/idempotency path and isolation path.
- Load the canonical local pack through `supabase/config.toml`.

## 4. Validation gate

Run the smallest applicable checks during development, then the full gate before
the PR:

```bash
pnpm exec vitest run --config vitest.config.ts <changed CRM tests>
supabase db reset --local --yes
supabase test db --local <top-level database suites 001-006; do not pass helpers/rls_helpers.sql as a standalone suite>
pnpm test:supabase-governance
pnpm docs:links:check
pnpm registries:check
node scripts/tracks/generate-tracks-index.mjs
node scripts/tracks/validate-tracks.mjs
git diff --check
pnpm validate:full
```

If `validate:full` needs local Supabase variables, use the local URL and
publishable key without committing them. Do not count the helper SQL file as an
independent pgTAP suite; execute only top-level suites.

## 5. Evidence template

Each module track and PR must record:

| Area       | Evidence                                                           |
| ---------- | ------------------------------------------------------------------ |
| Contract   | Schemas, envelopes, errors and contract tests                      |
| Schema/RLS | Migration, grants, policies, scoped FKs and pgTAP                  |
| Backend    | Service/API tests and authorization cases                          |
| Fixtures   | Reset output and scenario coverage                                 |
| Regression | Predecessor module tests still pass                                |
| Repository | Governance, links, registries, typecheck/build and full validation |
| Handoff    | Branch, Issue, PR, out-of-scope items and frontend dependency      |

## 6. Token-saving rules

- Start from this playbook and the module handoff; do not ask an agent to
  rediscover architecture already documented here.
- Search the predecessor service, route tests and `005_crm_security.sql` first.
- Batch reads of the contract, handoff, migration and nearest tests.
- Implement one coherent slice before re-reading unchanged files.
- Delegate implementation with the module name, Issue, exact references,
  out-of-scope list and required validation in one prompt.
- Treat CI and pgTAP output as evidence; do not repeat a passing suite without a
  code or migration change.

## 7. Definition of Done

A module is ready for PR when its contract, schema/RLS, service, API, fixtures,
tests, documentation and track evidence agree; the predecessor regression suite
passes; reset is reproducible; and no frontend primitive or shell implementation
was added to the backend branch.
