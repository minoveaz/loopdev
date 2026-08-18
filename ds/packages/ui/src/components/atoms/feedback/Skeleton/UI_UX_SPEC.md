# UI/UX Specification: Skeleton

- Implementation: `ds/packages/ui/src/components/atoms/feedback/Skeleton`
- Public export: `@loopdev/ui`
- Owner: `atom`
- Runtime: `server`
- Directive: `none`
- Status: `certified`
- Last reviewed: `2026-08-16`
- Consumers: CRM, workspace and shared foundation compositions
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`
- Spec version: `1.0`
- Contract version: `skeleton-v1`
- Compatible since: `2026-08-16`
- Platform target: `mobile-adapted`

## Quick reference

- Use when: content is pending and stable geometry is required.
- Do not use when: content is empty, failed, forbidden or ready.
- Main composition: caller-owned content region or loading state.
- Compatible with: `LoadingState`, `TechnicalSurface` and `ResponsiveTable`.
- Certification: `certified`; focused tests, source-contract and CRM matrix evidence complete.

## Purpose and ownership

`Skeleton` communicates pending content without owning data fetching, surface
geometry, retry behavior, authorization or domain copy. The consumer provides
its dimensions and replaces it with the completed content state.

## Interaction and accessibility

The primitive is non-interactive and does not receive focus. It must remain
supplemental to a status announcement owned by `LoadingState` or the consumer;
shape and motion are never the only progress signal. Pointer and keyboard input
pass through to the surrounding content boundary.

## State model

| State | Applicability | Required behavior | Accessibility |
| --- | --- | --- | --- |
| Loading | required | Stable placeholder geometry | Consumer announces progress |
| Ready | applicable | Replace with real content without layout shift | Content owns semantics |
| Empty | not-applicable | Use `EmptyState` | Explicit completed state |
| Error | not-applicable | Use consumer error state | Explicit recovery message |
| Forbidden | not-applicable | Use consumer access state | Explicit access message |
| Disabled | not-applicable | Do not represent disabled as loading | Preserve control semantics |

## Responsive, theme and motion contract

Skeleton dimensions follow the caller's responsive geometry and must not create
page-level overflow. Shared semantic tokens provide theme and tenant variation.
Non-essential animation respects reduced-motion preferences.

## Usage and compatibility

```tsx
<TechnicalSurface>
  <LoadingState label="Loading accounts" lines={3} />
</TechnicalSurface>
```

The consumer owns the loading lifecycle and geometry. Do not add fetching,
retry handlers, domain records or a second surface inside this atom.

Designed for CRM, Marketing Studio and Operations. Future suites may configure
size and placement through the public API; new states, focus behavior or
geometry ownership reopen certification.

## Certification evidence

- Contract: `verified` - public implementation, types and focused tests.
- Accessibility: `verified` - non-interactive semantics and loading composition tests.
- Interaction: `verified` - no focus or action ownership.
- Responsive: `verified` - CRM Playwright desktop, mobile and mobile-compact matrix.
- States: `verified` - loading applicability and consumer-owned completion states.
- Consumer ownership: `verified` - caller owns lifecycle and geometry.
- Source contract: `verified` - `pnpm certification:source-contracts`.
- Visual review: `verified` - CRM CertificationLab review.
- Registry: `verified` - `skeleton-v1` entry updated with this specification.

## Reopen triggers

New animation, state semantics, focus behavior, responsive transformation,
theme responsibility or layout ownership requires a new audit.
