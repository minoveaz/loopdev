# UI/UX Specification: LoadingState

- Implementation: `ds/packages/ui/src/components/atoms/feedback/LoadingState`
- Public export: `@loopdev/ui`
- Owner: `atom`
- Runtime: `server`
- Directive: `none`
- Status: `certified`
- Last reviewed: `2026-08-16`
- Consumers: CRM, workspace and shared foundation compositions
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`
- Spec version: `1.1`
- Contract version: `loading-state-v1`
- Compatible since: `2026-08-16`
- Platform target: `mobile-adapted`

## Quick reference

- Use when: content is pending and its geometry should remain stable.
- Do not use when: the request completed empty, failed or is forbidden.
- Main composition: consumer-owned surface or content region.
- Compatible with: `TechnicalSurface`, `ResponsiveTable`, `FiltersActions`.
- Certification: `certified`; visual and registry evidence complete.

## Purpose

Communicate that content is being loaded while preserving the caller-owned
geometry and preventing an abrupt empty or error interpretation.

## Responsibility

### Owns

- Loading indicator semantics, label and skeleton line presentation.

### Does not own

- Fetching, retry, surface geometry, data state or authorization.

## UI contract

| Prop/state       | Behavior                           | Accessibility                                    |
| ---------------- | ---------------------------------- | ------------------------------------------------ |
| `label`          | Announces the current loading task | Status text is available to assistive technology |
| `lines`          | Controls placeholder density       | Geometry remains stable                          |
| Caller container | Owns width/height and surface      | Loading never invents a card                     |

## Interaction model

| Capability | User intent | Pointer/touch | Keyboard/focus | Escape/close | Feedback |
| --- | --- | --- | --- | --- | --- |
| Read progress | Understand that content is pending | Read indicator | Focus order is unchanged | Not applicable | Label/status announcement |
| Navigate away | Continue another task | Consumer-owned | Consumer-owned | Consumer-owned | Loading does not trap focus |

The primitive owns loading presentation only. It has no popup, selection,
clear, retry or cancellation action.

## State model

| State | Applicability | Required UI | Allowed action | Accessibility |
| --- | --- | --- | --- | --- |
| Loading | required | Label and configured lines | None | Status is available to assistive technology |
| Skeleton | applicable | Stable placeholder geometry | None | Not the sole source of state meaning |
| Empty | not-applicable | Use `EmptyState` after completion | Consumer-owned | Explicit completed state |
| Error | not-applicable | Use consumer error/empty state | Consumer-owned retry | Explicit error message |
| Forbidden | not-applicable | Use consumer access state | Consumer-owned | Explicit access message |
| Disabled | not-applicable | Do not represent disabled as loading | None | Avoid misleading state |

## Responsive and motion contract

Loading content follows the caller width and wraps safely. Animation is subtle,
respects reduced motion and never blocks focus or page navigation.

## Usage recipes and compatibility

### Recommended usage

```tsx
<TechnicalSurface>
  <LoadingState label="Loading accounts" lines={3} />
</TechnicalSurface>
```

The caller keeps the real content geometry and swaps the state while data is
pending. `LoadingState` does not fetch or decide when loading ends.

### Avoid

```tsx
<LoadingState onRetry={loadAccounts} />
```

Do not put fetching, retry handlers, authorization or a new card surface inside
this atom. Use `EmptyState` for a completed empty/error result.

### Works with / does not work with

| Component/view                                            | Relationship          | Boundary                                                         |
| --------------------------------------------------------- | --------------------- | ---------------------------------------------------------------- |
| `TechnicalSurface`, `ResponsiveTable`, `FiltersActions`   | Pending content state | Consumer owns request and geometry                               |
| `EmptyState` as simultaneous sibling state, `SuiteHeader` | Not compatible        | Use one explicit content state; headers are not loading surfaces |

### Designed capabilities and future suites

- Designed for: async content in CRM, Marketing Studio and Operations.
- Not designed for: retries, errors, persistence, authorization or navigation.
- Future suites: provide suite-specific labels and preserve caller geometry.
- Extension boundary: new announcements or animation require accessibility and
  reduced-motion evidence.

## Platform portability

| Platform        | Implementation            | Shared contract         | Allowed divergence          | Evidence       |
| --------------- | ------------------------- | ----------------------- | --------------------------- | -------------- |
| Web/RSC         | `@loopdev/ui`             | status/content contract | none                        | focused tests  |
| Web/client      | not required              | not-applicable          | not-applicable              | not-applicable |
| Expo/NativeWind | native loading equivalent | status/content intent   | animation/layout primitives | not-applicable |

- Native equivalent: suite-owned loading primitive.
- NativeWind compatibility: `partial`.
- RSC constraints: no hooks or browser APIs required.

## Certification checklist and reproducibility

- [x] Showcase consumes the public component without corrective logic.
- [x] Skeleton dimensions preserve caller geometry and prevent CLS.
- [x] Error and forbidden states remain consumer-owned.
- [x] Reduced motion is respected.
- [x] Automated A11y: `verified` - status/label Axe coverage.
- Reproducibility: `verified` - focused tests and foundation review.
- A11y automation: `verified` - Axe coverage.

## Certification evidence

- Contract: `verified` - types and focused tests
- Accessibility: `verified` - status/label tests and Axe
- Interaction: `verified` - non-interactive loading contract
- Responsive: `verified` - Playwright desktop, mobile and mobile-compact review
- States: `verified` - loading and skeleton applicability documented
- Consumer ownership: `verified` - caller owns geometry
- Visual review: `verified` - user-approved light/dark desktop and mobile review
- Registry: `verified` - frontend registry entry promoted with CRM evidence

## Reopen triggers

- New async state semantics, focus behavior, animation or geometry ownership.
