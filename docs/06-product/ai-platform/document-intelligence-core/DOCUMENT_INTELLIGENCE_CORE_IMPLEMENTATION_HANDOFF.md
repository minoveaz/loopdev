---
title: Document Intelligence Core Implementation Handoff
status: approved
version: 0.1
created: 2026-09-06
updated: 2026-09-06
owner: ai-platform
program_track: ../../../../tracks/active/ai-platform/2026-09-06-document-intelligence-core-definition.md
issue: https://github.com/minoveaz/loopdev/issues/198
related_issues: [199, 200, 204, 202, 205, 201, 203, 176]
---

# Document Intelligence Core Implementation Handoff

## Formal approval

This document is formally approved as part of the Document Intelligence Core package for the
authorized #199 implementation slice. No individual approver attribution is recorded.

## Read first

1. [UX specification](DOCUMENT_INTELLIGENCE_CORE_UX_SPEC.md)
2. [Component audit](DOCUMENT_INTELLIGENCE_CORE_COMPONENT_AUDIT.md)
3. [Domain contract](DOCUMENT_INTELLIGENCE_CORE_CONTRACT.md)
4. [Impact assessment](DOCUMENT_INTELLIGENCE_CORE_IMPACT_ASSESSMENT.md)
5. [Active track](../../../../tracks/active/ai-platform/2026-09-06-document-intelligence-core-definition.md)
6. [Closed POC track](../../../../tracks/closed/2026/2026-09-05-document-intelligence-poc-migration.md)
7. [Existing RecordWorkspace composition](../../document-intelligence/workbench-composition.md)

## Delivery and GitHub Project instruction

Repository: `minoveaz/loopdev`. Parent delivery Issue:
[#198](https://github.com/minoveaz/loopdev/issues/198). Derived slices are #199 (contracts/lifecycle),
#200 (persistencia/RLS), #204 (historial), #202 (auditoría), #205 (retención/cleanup), #201 (provider
adapter/observabilidad) and #203 (validaciones configurables). Historical reference: #176.

The implementation team confirms readiness in the relevant Issue before creating a branch from
updated `develop`. Use `feature/ai-platform-document-intelligence-core-<slice>`. The branch is
linked through commits and Pull Request, not through a manually maintained Project branch field.
Commits include `(#<issue>)`; the PR body uses `Closes #<issue>`.

In the GitHub Project, link the Issue, track and evidence, then set `Gate`, `Prioridad`, `Carril`,
`Estado`, `Track`, `Bloqueado por` and `Evidencia`. Keep the item `Ready` until the first code
commit; only then move it to `En curso`. Final state is `Hecho` after merged evidence.

## Required outcome and non-goals

Implement a tenant-safe, versioned Document Intelligence Core with lifecycle, persistence/RLS,
history, audit, retention/cleanup, provider adapter/observability and configurable explainable
validation. Preserve the existing POC contract compatibility and use `organization_id` as canonical
scope.

Do not reopen or modify the closed POC track, copy VitaBlue's shell, create a parallel navigation,
implement fraud/authenticity/liveness/legal verification, expose provider secrets, log PII, or
implement consumer-specific CRM/Marketing behavior.

## Mandatory shell and FSD composition

Use `AppShell -> SuiteRuntime/SuiteCanvas -> widgets -> features -> entities -> shared`. Keep
`PlatformHeader`, `SuiteSidebar`, `PlatformContextPanel` and `SuiteCanvas` as platform-owned zones.
History uses `DataWorkspace`; the current document review remains the existing `RecordWorkspace`
evolution, not a new route family or shell. Providers, repositories, RLS and domain mutations stay
server-side.

## Definition of Ready

- The five documents carry formal package approval for the authorized #199 slice; no individual
  approver attribution is recorded.
- #198 and the selected delivery Issue include scope, dependencies, Project fields and evidence.
- #199 lifecycle contract is approved; later slices may have implementation evidence but remain
  subject to their own validation and are not closed by this handoff.
- Schema/RLS, Storage ownership, retention classes, audit redaction and provider secret boundaries
  are reviewed; negative isolation tests are planned.
- Rollout, capability flag, kill switch, fixture fallback and forward-only rollback are accepted.
- Implementation team confirms readiness in the Issue before its first branch or code commit.

## Delivery sequence and evidence

1. #199: contract tests, lifecycle matrix, idempotency/concurrency evidence.
2. #200: migrations/schema, RLS and two-organization negative tests.
3. #204: history query, pagination/filter tests, responsive/accessibility evidence and reopen flow.
4. #202: append-only audit event tests, actor/scope/redaction evidence.
5. #205: retention/cleanup dry-run, retry/recovery and Storage evidence.
6. #201: adapter contract, timeout/retry, cost/latency telemetry and secret/redaction evidence.
7. #203: versioned rules, explainable results, permissions and regression fixtures.

Run the narrowest relevant checks per slice, then `node scripts/tracks/validate-tracks.mjs`,
`node scripts/tracks/generate-tracks-index.mjs`, `pnpm docs:links:check`, shell checks for any
composition change, and `git diff --check`. Record commands, CI, review, rollout and rollback evidence in the Issue, Project and track. The
current handoff is formally approved and authorizes the scoped #199 contract implementation.
Phase 0 approval is complete. The current branch also contains initial implementation evidence for
#200, #204, #202, #205, #201 and #203, but those phases remain in validation and are not complete.
Final track closure awaits a consolidated PR and complete evidence; it is not blocked by missing
Phase 0 approval.
