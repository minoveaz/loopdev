---
title: Communications Core Docker and Supabase Handoff
status: active
owner: crm
program_track: tracks/active/crm/2026-08-29-communications-core-implementation.md
updated: 2026-08-30
---

# Communications Core Docker and Supabase Handoff

## Purpose

This is the single operational handoff for every Communications Core phase that requires Docker, Supabase CLI, PostgreSQL, pgTAP, generated database types, or an authorized Meta environment. Follow the phases in order. Do not use this document to authorize production traffic, real credentials, or a change outside the active track.

## Scope and safety rules

- Work from `feature/communications-core-implementation` after fetching `origin/develop`; preserve unrelated changes.
- `organization_id` is the isolation boundary. Estar Protegidos is one organization with multiple brands; `brand_id` never grants cross-organization access.
- `communication_*` is canonical. Do not add consumers, routes, contracts, or writes to legacy `communications_*` or `communication_entity_links`.
- `loopdev-whatsapp-webhook` is the single public Meta endpoint. Do not configure Meta to call `/api/webhooks/whatsapp`.
- Never place WABA IDs, phone-number IDs, access tokens, app secrets, verification tokens, pilot-user identities, raw provider payloads, or production URLs in Git, fixtures, test output, screenshots, or issue comments.
- Use only the authorized Supabase Dev project for `--linked` operations. Do not link or push to production.
- Stop and record the blocker if reset, lint, pgTAP, generated types, migrations, RLS, or required tests fail. Do not bypass a failure with manual SQL changes.

## One-time environment verification

From the repository root in PowerShell:

```powershell
docker version
pnpm exec supabase --version
pnpm install --frozen-lockfile
pnpm exec supabase status
```

Expected: Docker is running, the CLI reports a version, dependencies are installed, and local Supabase services are healthy. If `supabase status` reports no local project, run the repository-approved local start procedure and repeat status. Do not run destructive cleanup commands on an existing environment with data that has not been approved for reset.

## Standard evidence commands

Use these commands at the end of each database-changing phase:

```powershell
pnpm exec supabase db reset --local --yes
pnpm exec supabase migration list --local
pnpm exec supabase db lint --local
pnpm exec supabase test db --local supabase/tests/database/007_communications_core_security.sql
pnpm validate:changed
git diff --check
```

`helpers/rls_helpers.sql` is imported by top-level pgTAP suites and must never be run as a standalone suite. Before an authorized Dev apply, run:

```powershell
pnpm exec supabase migration list --linked
pnpm exec supabase db push --linked --dry-run
```

Apply with `pnpm exec supabase db push --linked` only after the dry run, review, and explicit approval for that phase. Regenerate types after every approved schema change:

```powershell
pnpm exec supabase gen types typescript --linked --schema public | Set-Content -Encoding utf8 apps/loopdev-os/src/types/database.types.ts
pnpm --filter @loopdev/contracts typecheck
pnpm typecheck
git diff -- apps/loopdev-os/src/types/database.types.ts
```

## Phase 1: Contracts, authorization, and CRM inbound contact

### Files prepared

- `packages/contracts/src/communications/communications.ts`
- `packages/contracts/src/crm/crm.ts`
- `supabase/migrations/20260907000000_communications_phase1_authorization.sql`
- `supabase/tests/database/007_communications_core_security.sql`
- `supabase/functions/loopdev-whatsapp-webhook/index.ts`

### Execute

1. Check that local migrations are not missing or reordered:

```powershell
pnpm exec supabase migration list --local
pnpm exec supabase db reset --local --yes
pnpm exec supabase db lint --local
```

2. Run the focused Communications pgTAP suite:

```powershell
pnpm exec supabase test db --local supabase/tests/database/007_communications_core_security.sql
```

Expected: 18 assertions pass. It covers granular permissions, `service_role`-only CRM contact resolution, E.164 validation, pending identity status, and cross-organization account isolation.

3. Regenerate `apps/loopdev-os/src/types/database.types.ts` from the authorized Dev schema after the local schema is accepted. Review that it includes `crm_contacts.identity_status`, `communication_accounts.outbound_enabled`, `communication_conversations.last_activity_at`, and `crm_resolve_whatsapp_inbound_contact`.

4. Run the available application checks:

```powershell
pnpm exec vitest run packages/contracts/src/communications/__tests__/communications.test.ts packages/contracts/src/crm/__tests__/crm.test.ts apps/loopdev-os/src/services/communications/whatsapp.test.ts apps/loopdev-os/src/services/communications/whatsappSignature.test.ts
pnpm test:supabase-governance
pnpm validate:changed
```

### Exit criteria

- Migration reset and lint are green.
- `007_communications_core_security.sql` is green without edits made directly in the database.
- Generated types match the applied schema and application typecheck is green.
- The Edge Function resolves inbound contacts only through the CRM RPC.
- The active track records command results and marks Fase 1 complete.

### Rollback

Do not delete data or manually reverse the migration. If validation fails before Dev apply, fix the migration in the branch and rerun reset. If an approved Dev apply needs rollback, create a new additive migration that restores safe policies or disables the affected write path, then record the incident in the track.

## Phase 2: Meta accounts, Embedded Signup, and templates

### Prerequisites

- Phase 1 exit criteria passed.
- An administrator can use the authorized Meta Dev application; secrets remain in the approved server-side secret store.
- No WABA, Phone Number ID, token, or pilot-user identity is committed.

### Execute

1. Apply and review `supabase/migrations/20260908000000_communications_phase2_accounts_templates.sql`. It adds account health metadata, hashed onboarding state, template account scope and template metadata without persisting credentials or authorization codes.
2. Run local reset, lint and the focused pgTAP suite:

```powershell
pnpm exec supabase db reset --local --yes
pnpm exec supabase db lint --local
pnpm exec supabase test db --local supabase/tests/database/008_communications_accounts_templates.sql
```

3. Run unit tests for the injected credentials resolver, text/template dispatch, template normalization and normalized provider errors:

```powershell
pnpm exec vitest run packages/contracts/src/communications/__tests__/communications.test.ts apps/loopdev-os/src/services/communications/whatsapp.test.ts
```

4. In the authorized Dev project, run `migration list --linked` and `db push --linked --dry-run`. Apply only after approval. Regenerate types and run typecheck.
5. Configure Edge Function secret references through the secret manager, not source code. Verify only that required names are present; never print values.

### Exit criteria

- Account and template lifecycle is tenant-safe and audited.
- Embedded Signup and reconnect paths are server-side and admin-only.
- Only approved templates from the same organization/account can be selected for send.
- Local pgTAP, unit tests, generated types and static governance are green.

### Rollback

Disable onboarding and template dispatch with a server-side feature flag or account state. Keep account, audit and template history readable to authorized administrators. Do not remove provider evidence or secrets from the vault as a rollback shortcut.

## Phase 3: Inbound, outbound, delivery, and endpoint migration

### Prerequisites

- Phase 2 exit criteria passed.
- `loopdev-whatsapp-webhook` remains the configured public Meta endpoint.
- The Next.js webhook has no new traffic configuration and remains only until equivalence is proven.

### Execute

1. Extend the Edge Function to verify signature, resolve account and organization, register an idempotent event, call the CRM RPC, and enqueue durable processing. It must not write CRM tables directly.
2. Add pure unit fixtures for text, interactive, delivery, malformed and duplicate events. Fixtures must be redacted and contain no real identifiers.
3. Run `supabase/tests/database/009_communications_inbound_delivery.sql` after the local reset. It covers two organizations, duplicate event IDs, scoped foreign keys and delivery history. Extend it with the Estar Protegidos multi-brand scenario when the protected pilot configuration exists.
4. Add provider tests for text inside the $24$-hour window, approved template outside it, invalid parameters, disconnected account, kill switch and normalized provider errors.
5. Prove Edge Function equivalence against the legacy Next webhook with the same redacted fixtures. Then remove the public Next webhook route or convert it to a non-public internal adapter. Do not leave two public receiver paths.
6. Run local reset, lint, pgTAP, unit tests and `pnpm validate:changed`. Use `db push --linked --dry-run` before any approved Dev apply.

### Exit criteria

- One public webhook endpoint exists.
- Inbound contact resolution is CRM-owned; new inbound conversations are `open` and unassigned.
- Duplicate provider events do not duplicate contacts, channels, conversations, messages, delivery states or audit evidence.
- Free text is rejected outside the window; templates are rejected unless approved and same-scope.

### Rollback

Set the organization/account kill switch to pause outbound and retries. Preserve inbound read access, delivery history and audit. If the Edge Function rollout fails, route Meta only to the last verified canonical Edge Function deployment; do not reactivate the Next route unless an approved incident decision records its exact deduplication behavior.

## Phase 4: Worker, retries, retention, and operational controls

### Prerequisites

- Phase 3 exit criteria passed.
- A durable queue/worker mechanism is approved and available in the Dev environment.

### Execute

1. Implement a server-only worker identity with least privilege. Its inputs must resolve organization from persisted event/account records; it must not trust a client-supplied organization ID.
2. Move delivery processing, retries and purge execution to the worker. Remove any browser or public API mutation path for them.
3. Apply `supabase/migrations/20260909000000_communications_phase4_worker_controls.sql`. It enables `pgmq`, creates the `communications_core` queue, adds an organization-level outbound control, legal hold/purge markers and retention-run evidence.
4. Run the focused pgTAP suite:

```powershell
pnpm exec supabase db reset --local --yes
pnpm exec supabase db lint --local
pnpm exec supabase test db --local supabase/tests/database/010_communications_worker_controls.sql
```

5. Confirm the queue API exposed by the local Supabase/pgmq version before implementing the adapter that performs `receive`, `acknowledge` and `fail`. Do not guess RPC names or bypass the queue with direct table writes.
6. Add migrations and pgTAP tests for bounded retries, idempotent delivery update, account/organization kill switch, `last_activity_at`, 24-month message/note retention, 36-month delivery/audit retention, purge `dry-run`, and legal-hold-ready exclusion fields.
7. Add structured observability for trace ID, organization/account identifiers and normalized error class. Assert logs never include message bodies, tokens or raw Meta payloads.
8. Run failure drills: provider unavailable, duplicate delivery event, retry limit reached, kill switch enabled, purge dry run and worker restart.
9. Run reset, lint, focused pgTAP, unit tests and `pnpm validate:full` if shared worker/queue infrastructure changes.

### Exit criteria

- Only the limited worker performs durable provider/delivery/retry/purge mutations.
- Kill switch blocks outbound and retries by organization/account while reads and evidence remain available.
- Retention and purge behavior are deterministic, dry-run capable and audited.
- Failure drills have recorded evidence and no sensitive content appears in logs.

### Rollback

Enable the kill switch, pause the worker queue and preserve read/audit paths. Do not delete queued or failed records before incident analysis. Use additive migrations to disable unsafe worker actions if code rollback is insufficient.

## Phase 5: Estar Protegidos activation and Inbox handoff

### Prerequisites

- Phases 1 through 4 passed with evidence in the active track.
- Explicit user approval for the activation step.
- Authorized administrator has completed Embedded Signup in the approved environment.
- WABA, Phone Number ID, server-side secret references and pilot users are configured outside Git.

### Execute

1. Confirm the account belongs to the Estar Protegidos organization and validate each configured brand association remains in that same organization.
2. Enable the pilot for one organization and the approved users only. Confirm the kill switch is off for the selected account and that no other organization is enabled.
3. Advance in order: inbound only, outbound text inside the customer window, approved templates, then broader availability. Record the validation result and approver for each advance.
4. Test an authorized agent, an `admin`/`owner`, a `viewer`, a second organization, and at least two brands inside Estar Protegidos. Verify no cross-organization reads, writes, account visibility, templates or delivery events.
5. Trigger and verify the kill switch in the protected environment. Confirm reads survive while dispatch/retries stop.
6. Prepare the stable API/read-model handoff for #158. The Inbox implementation must consume public contracts only and must not import Core repositories or create a second webhook/provider path.

### Exit criteria

- Pilot evidence covers security, inbound, outbound, templates, delivery, rollback and multi-brand context.
- The active track names residual risks, rollout status and one next action.
- #158 receives a documented contract/read-model handoff.

### Rollback

Disable the account/organization kill switch and pause retries. Keep the Inbox read-only if it exists. Revoke or reconnect credentials only through the audited administrator flow; retain delivery and audit evidence for investigation.

## Evidence record template

Add one row to the active track after each command or drill:

| Date | Phase | Validation or drill | Result | Environment | Evidence or follow-up |
| --- | --- | --- | --- | --- |
| YYYY-MM-DD | N | Command or scenario | passed, failed, or blocked | local, Dev, or protected pilot | link, commit, issue, or blocker |