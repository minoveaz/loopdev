## Models, scope and compatibility

```ts
type PolicyStatus = 'draft' | 'active' | 'superseded' | 'archived';
type MarketingPolicy = { id: string; organizationId: string; scope: 'brand' | 'asset' | 'content' | 'campaign' | 'automation'; status: PolicyStatus; rule: string; effectiveAt: string; expiresAt: string | null; createdAt: string };
type UsageRestriction = { id: string; organizationId: string; policyId: string; subjectReference: string; status: 'active' | 'expired' | 'waived'; reason: string; expiresAt: string | null };
type MarketingAuditEvidence = { id: string; organizationId: string; action: string; subjectReference: string; occurredAt: string; actorReference: string };
type PolicyQuery = { scope?: MarketingPolicy['scope']; status?: PolicyStatus; cursor?: string; limit?: number; order?: 'asc' | 'desc' };
type Page<T> = { items: T[]; nextCursor: string | null };
type Result<T> = { ok: true; data: T } | { ok: false; error: { code: ComplianceErrorCode; message: string } };
type ComplianceErrorCode = 'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'POLICY_CONFLICT' | 'RESTRICTION_VIOLATION' | 'AUDIT_EVIDENCE_UNAVAILABLE';
```

Queries are cursor-paginated with allowlisted filters/order and organization scope. Proposed
permissions are `marketing.governance.read`, `marketing.governance.manage` and
`marketing.governance.review`; Platform Core resolves the final policy and writes immutable audit.
---
title: Compliance and Governance Contract
status: proposed
version: 0.1
created: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/152
---

# Compliance and Governance Contract

Marketing-specific read models are `MarketingPolicy`, `UsageRestriction` and `MarketingAuditEvidence`.
Operations: `listPolicies`, `getPolicy`, `evaluateMarketingUse`, `recordPolicyDecision` and
`getMarketingAuditEvidence`. Platform Core authorizes and writes the underlying audit infrastructure;
evaluations are server-side, tenant-scoped and explain only authorized decisions.

Errors: `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `POLICY_CONFLICT`, `RESTRICTION_VIOLATION` and
`AUDIT_EVIDENCE_UNAVAILABLE`. No contract duplicates membership, base permissions or audit storage.
