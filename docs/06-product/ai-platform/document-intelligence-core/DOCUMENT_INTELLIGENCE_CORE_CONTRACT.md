---
title: Document Intelligence Core Contract
status: proposed
version: 0.1
created: 2026-09-06
updated: 2026-09-06
owner: ai-platform
program_track: ../../../../tracks/planned/ai-platform/2026-09-06-document-intelligence-core-definition.md
issue: https://github.com/minoveaz/loopdev/issues/198
related_issues: [199, 200, 204, 202, 205, 201, 203, 176]
---

# Document Intelligence Core Contract

## Scope and compatibility

Este contrato `proposed` amplía de forma aditiva los tipos existentes en
`packages/contracts/src/documents`. El POC sigue siendo consumidor válido; ningún campo existente
se renombra o cambia silenciosamente. La decisión final de versionado y compatibilidad pertenece al
Tech Lead y está pendiente.

## Read and input models

```ts
type DocumentStatus =
  | 'temporary' | 'uploaded' | 'processing' | 'review'
  | 'approved' | 'rejected' | 'failed' | 'expired' | 'deleted';
type ExtractionStatus = 'queued' | 'processing' | 'review' | 'approved' | 'rejected' | 'failed';
type ValidationSeverity = 'info' | 'warning' | 'error';

type DocumentRecord = {
  id: string;
  organizationId: string;
  workspaceId: string | null;
  status: DocumentStatus;
  currentVersionId: string | null;
  retentionClass: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
};

type DocumentVersion = {
  id: string;
  documentId: string;
  organizationId: string;
  versionNumber: number;
  sourceReference: string | null; // opaque, authorized server reference
  checksum: string | null;
  extractionId: string | null;
  createdAt: string;
  createdBy: string | null;
  version: number;
};

type ExtractionRecord = {
  id: string;
  documentVersionId: string;
  organizationId: string;
  status: ExtractionStatus;
  provider: string;
  providerVersion: string;
  schemaVersion: string;
  fields: Record<string, unknown>;
  validationSummary: ValidationSummary;
  usage: UsageSummary | null;
  createdAt: string;
  completedAt: string | null;
  version: number;
};

type ValidationResult = {
  ruleId: string;
  category: string;
  severity: ValidationSeverity;
  code: string;
  passed: boolean;
  message: string;
  fieldPaths: string[];
};

type ValidationSummary = {
  results: ValidationResult[];
  evaluatedAt: string;
  ruleSetVersion: string;
};

type UsageSummary = {
  model: string;
  promptTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
  estimatedCostUsd: number | null;
  latencyMs: number | null;
};
```

`sourceReference` is opaque and never a public URL, base64 payload or authorization bypass.
`fields` remains redacted/authorized by query; logs never serialize it.

## Commands and queries

| Operation | Input | Result |
| --- | --- | --- |
| `listDocumentHistory` | organization/workspace scope, allowlisted filters, cursor, limit, order | Authorized page and next cursor |
| `getDocument` | document/version ID, expected scope | Document, version, extraction and safe audit summary |
| `createDocument` | metadata intent, idempotency key | Draft document/version |
| `startExtraction` | version ID, provider capability, idempotency key | Queued extraction |
| `retryExtraction` | extraction ID, expected version, idempotency key | New attempt linked to same version |
| `updateExtractionReview` | extraction ID, field patch, expected version | Updated review or `CONFLICT` |
| `approveExtraction` / `rejectExtraction` | extraction ID, reason, expected version | Decision and audit event |
| `reopenExtraction` | extraction/version ID, reason, idempotency key | Authorized review state |
| `evaluateValidations` | extraction/version ID, rule-set version | Versioned `ValidationSummary` |
| `requestCleanup` | document/version ID, reason, idempotency key | Cleanup job state; no synchronous destructive guarantee |

All mutations resolve actor, `organization_id`, workspace and permission server-side. Client-supplied
tenant IDs are constraints to verify, not authority.

## Pagination, errors and lifecycle

History uses cursor pagination with allowlisted filters and stable ordering. Responses use:

```ts
type CoreResponse<T> = {
  data: T | null;
  error: { code: DocumentIntelligenceErrorCode; message: string; correlationId: string } | null;
};
```

Stable codes include `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`,
`CONFLICT`, `IDEMPOTENCY_CONFLICT`, `INVALID_TRANSITION`, `PROVIDER_UNAVAILABLE`,
`PROVIDER_TIMEOUT`, `RATE_LIMITED`, `RETENTION_EXPIRED`, `CLEANUP_PENDING` and
`INTERNAL_ERROR`. Error messages are actionable but do not disclose cross-tenant existence,
secrets, prompts, raw provider responses or PII.

Transitions are allowlisted; retries create an auditable attempt and cannot mutate an approved
version in place. Commands carry an idempotency key scoped to organization and operation. Expected
version protects concurrent review; dedupe uses an organization-scoped checksum/reference policy
that is pending approval.

## Permissions and public compatibility

Proposed capabilities are `documents.read`, `documents.create`, `documents.extract`,
`documents.review`, `documents.approve`, `documents.configure-validation`,
`documents.audit.read` and `documents.cleanup.manage`. Final mapping is pending Platform Core and
Product approval. Public consumers must use versioned contracts and opaque references; no suite may
import provider-specific types. Audit, retention and provider schemas are internal behind the Core
adapter.
