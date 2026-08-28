---
title: CRM shared foundation readiness
status: phase-0-ready
owner: crm
reviewed_at: 2026-08-14
---

# CRM shared foundation readiness

## Reconciliation

Existing `packages/contracts/src/crm/crm.ts` already defines partial
`CrmActivity`, `CrmNote`, `CrmAuditEvent` and entity schemas. It is not yet the
approved shared foundation contract:

- Activity has entity-specific foreign keys and lacks the canonical
  `sourceType:sourceId` dedupe key and cursor read model.
- Notes have organization scope and visibility, but no workspace/capability
  read projection or redacted unauthorized shape.
- Audit events exist separately and must not be rendered as activity without an
  explicit event projection.
- No bounded authorized contact/entity lookup contract exists in the package.
- Existing CRM migration evidence is a baseline only; new migrations must
  preserve organization and workspace isolation and must not silently widen
  grants.

## Capability and redaction matrix

| Surface | Read | Mutate | Redaction |
| --- | --- | --- | --- |
| Activity | `crm.activity.read` on authorized relation | append through owning command only | omit private note body and sensitive metadata |
| Notes | `crm.notes.read` plus note visibility | `crm.notes.create` | return metadata without body when unauthorized |
| Lookup | `crm.entity.lookup` on target scope | none | no existence, count or labels outside scope |
| Audit | server/internal only | append by command boundary | never expose raw audit metadata as activity |

Every capability is evaluated with organization, workspace, membership status
and record relation on the server.

## Read and mutation gates

- Lists are cursor-backed and bounded by a server maximum.
- Mutations require idempotency keys and expected version where the source
  entity is mutable.
- Append-only activity rejects update/delete.
- Errors expose a request id, not SQL details or cross-tenant existence.
- RLS tests must cover organization mismatch, workspace mismatch, inactive
  membership, forbidden relation and authorized access.

## Implementation order

1. Add shared contract schemas and fixture types.
2. Reconcile migration/read models without changing route UI.
3. Add RLS and contract tests for the matrix above.
4. Add authorized lookup, activity and notes repositories/API boundaries.
5. Add state and accessibility test fixtures for later module consumers.

## Rollback boundary

Contract additions are additive. Any migration must be independently
reversible, preserve existing CRM data, and ship with a rollback note. No
legacy endpoint is removed in this foundation track.
