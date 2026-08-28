---
title: Brand Hub Impact Assessment
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/142
---

# Brand Hub Impact Assessment

## Classification

```text
Contracts: planned
Schema: planned
RLS: planned
Storage: planned
Secrets/providers: none
AI: none
Billing/entitlements: planned
Observability: planned
Rollout/rollback: planned
```

`Storage` is planned only for validating private Asset Library references; Brand Hub must not own
binary uploads or create a separate bucket. `Billing/entitlements` is planned because final limits
for brands and version history require a platform policy, not because this package creates billing.

## Dependencies and data sensitivity

| Dependency | Required boundary |
| --- | --- |
| Platform Core | Organization, workspace visibility, memberships, server authorization and audit base. |
| Asset Library | Private asset references, lifecycle ownership and authorization checks. |
| Creative Studio and Content Engine | Consume only authorized published context. |
| `@loopdev/contracts` | Future typed, additive public contract surface. |

Brand guidance can contain confidential positioning, claims and campaign context. It is tenant data,
must not be exposed through public asset URLs or client-side authorization decisions, and needs a
retention/archive policy before persistence.

## Required delivery evidence

- Schema and RLS design proving organization isolation and authorized workspace visibility.
- Contract tests for lifecycle transitions, idempotency, optimistic concurrency and error envelopes.
- Repository/API tests proving that asset references remain within the same organization.
- UX tests for loading, empty, error, forbidden, review and publication states.
- Audit evidence for draft edits, review decisions, publication and archival.
- Observability for command outcome, conflicts, authorization failures and publication latency,
  without logging sensitive guidance content.

## Rollout, rollback and no-go conditions

The first rollout must be tenant-gated, additive and reversible. Rollback disables entry points and
new writes while preserving append-only version/audit evidence; it must not delete published brand
history or assets.

No implementation may start when any of the following is unresolved: organization scope, final
permission mapping, RLS policy, Asset Library reference contract, audit retention, or approved
Brand Hub UX/contract/impact package.
