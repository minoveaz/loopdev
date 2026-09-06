---
title: Document Intelligence Core Implementation Boundary
status: active
version: 1.0
created: 2026-09-06
updated: 2026-09-06
owner: ai-platform
program_track: ../../../../tracks/active/ai-platform/2026-09-06-document-intelligence-core-definition.md
---

# Document Intelligence Core implementation boundary

This document records the implementation evidence for the authorized Core
slices. It is intentionally contract- and boundary-focused: it does not add a
UI route, a shell owner, a real provider, secrets, or a platform-wide
persistence abstraction.

## Current track state

Phase 1 (#199) is the only completed phase. The remaining slices have initial
implementation evidence in this document and its referenced migrations/tests,
but remain in validation and are not represented as completed phases. Final
track closure awaits a consolidated PR and complete evidence.

## Shared contracts

The public Zod contracts are exported from
[`@loopdev/contracts`](../../../../packages/contracts/src/index.ts):

- [`document-intelligence-core.ts`](../../../../packages/contracts/src/documents/document-intelligence-core.ts):
  lifecycle, commands, queries, errors, idempotency, and concurrency.
- [`document-intelligence-persistence.ts`](../../../../packages/contracts/src/documents/document-intelligence-persistence.ts):
  organization/workspace ownership rows and the repository boundary.
- [`document-intelligence-history.ts`](../../../../packages/contracts/src/documents/document-intelligence-history.ts):
  stable cursor ordering and immutable reopen semantics.
- [`document-intelligence-audit.ts`](../../../../packages/contracts/src/documents/document-intelligence-audit.ts):
  append-only events and metadata redaction.
- [`document-intelligence-retention.ts`](../../../../packages/contracts/src/documents/document-intelligence-retention.ts):
  retention decisions, cleanup state, idempotency, retry, and recovery.
- [`document-intelligence-provider.ts`](../../../../packages/contracts/src/documents/document-intelligence-provider.ts):
  server-side adapter request/response references and sanitized telemetry.
- [`document-intelligence-validation.ts`](../../../../packages/contracts/src/documents/document-intelligence-validation.ts):
  versioned explainable rules for checksum, MRZ, expiry, and field coherence.

All organization-scoped contracts use `organizationId`. `tenantId` is not
accepted by the new Core boundaries. Provider errors and audit metadata do not
carry prompts, responses, secrets, stacks, or document PII.

## Database boundaries

The scoped migrations and isolation tests are:

- [`20260906100000_document_intelligence_core_persistence.sql`](../../../../supabase/migrations/20260906100000_document_intelligence_core_persistence.sql)
  and [`008_document_intelligence_core_rls.sql`](../../../../supabase/tests/database/008_document_intelligence_core_rls.sql)
  for documents, versions, extractions, workspace ownership, and RLS.
- [`20260906110000_document_intelligence_audit.sql`](../../../../supabase/migrations/20260906110000_document_intelligence_audit.sql)
  and [`009_document_intelligence_audit.sql`](../../../../supabase/tests/database/009_document_intelligence_audit.sql)
  for append-only audit evidence.
- [`20260906120000_document_intelligence_cleanup.sql`](../../../../supabase/migrations/20260906120000_document_intelligence_cleanup.sql)
  and [`010_document_intelligence_cleanup.sql`](../../../../supabase/tests/database/010_document_intelligence_cleanup.sql)
  for organization-scoped cleanup state.

The repository uses composite foreign keys containing `organization_id` at
each document boundary. Positive and negative tests exercise two organizations.
Cleanup workers and provider clients remain server-side responsibilities and
are not implemented by these contracts.

## Validation evidence

The focused contract suite is under
[`packages/contracts/src/documents/__tests__`](../../../../packages/contracts/src/documents/__tests__/).
The `ai-platform` data domain includes the storage, persistence, audit, and
cleanup RLS tests in
[`config/validation-data-catalog.json`](../../../../config/validation-data-catalog.json).
