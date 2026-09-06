---
title: Document Intelligence Core Impact Assessment
status: proposed
version: 0.1
created: 2026-09-06
updated: 2026-09-06
owner: ai-platform
program_track: ../../../../tracks/planned/ai-platform/2026-09-06-document-intelligence-core-definition.md
issue: https://github.com/minoveaz/loopdev/issues/198
related_issues: [199, 200, 204, 202, 205, 201, 203, 176]
---

# Document Intelligence Core Impact Assessment

## Classification

```text
Contracts: required
Schema: required
RLS: required
Storage: required
Secrets/providers: required
AI: required
Billing/entitlements: planned
Observability: required
Rollout/rollback: required
```

Esta clasificación describe el trabajo futuro; este track documental no ejecuta ninguno de esos
cambios. Product Owner y Tech Lead deben aprobar la clasificación, el orden y los no-go.

## Dependencies and data sensitivity

Dependencies: POC cerrado #176 y sus contratos existentes; Platform Core tenancy/permissions;
Supabase/Postgres/RLS/Storage; `SuiteRuntime`/`SuiteCanvas`; provider capability and secret
management; audit/jobs/observability; issues #199, #200, #204, #202, #205, #201 and #203.

Los documentos pueden contener PII, identidad, imágenes/PDF, metadatos de workspace y evidencia
operativa. Source objects, extraction fields, prompts, responses and logs require least privilege,
organization scope, encryption/private Storage, redaction and retention metadata. No provider key,
raw document, full prompt or PII result may reach the browser telemetry or application logs.

## Required migrations and evidence

- Additive schema for document, version, extraction, validation, audit and cleanup state with
  organization/workspace ownership and composite integrity where needed.
- RLS policies for user JWT paths and narrow service-worker paths, plus positive/negative tests with
  two organizations.
- Private Storage references, quarantine/scanning decision, checksum/dedupe decision, cleanup
  idempotency and partial-failure recovery.
- Contract tests for lifecycle transitions, errors, idempotency, concurrency, provider replacement
  and compatibility with the POC.
- UI/accessibility tests for history, reopen, review, forbidden, conflict, retention and recovery.
- Observability for invocation count, latency, provider errors, token/cost aggregates, retries,
  cleanup failures and audit correlation without sensitive payloads.

## No-go conditions

No implementation or rollout is allowed until:

1. Product Owner and Tech Lead approve all five documents and the dependency order.
2. `organization_id` scope, RLS, service role boundaries and negative isolation tests pass.
3. Retention classes, legal/operational exceptions and secure deletion are approved.
4. Provider adapter, secret ownership, limits, redaction and cost controls are approved.
5. Compatibility with the POC contracts and the existing `RecordWorkspace` is tested.
6. Required audit events and rollback/kill-switch behavior are observable.

Fraud, authenticity, liveness, legal verification and unbounded autonomous decisions remain no-go
even after this package is approved.

## Environments, rollout and rollback

Rollout is additive by environment: local contract/schema tests, development with fixture/provider
mock, staging with tenant-gated capability, then a limited production pilot. Feature/capability
flags are organization-scoped and default off. Fixture mode remains a safe fallback while adapter,
Storage, cleanup and history gates are validated.

Rollback disables creation/extraction/retries and hides new entry points while preserving authorized
read-only history, audit evidence and cleanup jobs. If a migration is already applied, rollback is
forward-compatible and non-destructive; never drop retained evidence to undo a release. Provider
failure uses a kill switch and retry/recovery state, not silent success.

## Approval metadata

| Gate | Approver | Date | State |
| --- | --- | --- | --- |
| Product scope, roles, UX and retention | Product Owner | Pending | pending |
| Contracts, schema, RLS, provider and rollback | Tech Lead | Pending | pending |
| Security/data sensitivity review | Security reviewer | Pending | pending |
