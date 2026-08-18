# UI/UX Specification: EmptyState

- Implementation: `ds/packages/ui/src/components/atoms/feedback/EmptyState`
- Public export: `@loopdev/ui`
- Owner: `atom`
- Runtime: `server`
- Directive: `none`
- Status: `certified`
- Last reviewed: `2026-08-16`
- Consumers: CRM and shared workspace compositions
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`
- Spec version: `1.1`
- Contract version: `empty-state-v1`
- Compatible since: `2026-08-16`
- Platform target: `mobile-adapted`

## Quick reference

- Use when: a result surface needs to explain why there is no usable content.
- Do not use when: content is still loading or the consumer needs a full page error boundary.
- Main composition: result surface with an optional consumer-owned recovery action.
- Compatible with: `FiltersActions`, `ResponsiveTable`, `TechnicalSurface`.
- Certification: `certified`; focused unit/Axe, source-contract, responsive and CRM showcase evidence complete.

## Purpose

Explain why a content area has no usable result and provide the appropriate
consumer-owned recovery action.

## Responsibility

### Owns

- Empty/error/forbidden/read-only status meaning, title, description, icon and action slot composition.

### Does not own

- Querying, permission decisions, retry implementation or domain copy ownership.

## State contract

| State | Applicability | Required UI | Allowed action | Accessibility |
| --- | --- | --- | --- | --- |
| Empty | required | Explain absence of content | Consumer may provide create/add action | Title and description |
| Filtered-empty | applicable | Explain criteria produced no matches | Consumer-owned clear filters | Named recovery action |
| Error | applicable | Danger semantic and recovery explanation | Consumer-owned retry | Meaning is not color-only |
| Forbidden | applicable | Access explanation without implying failure | Consumer-defined request/access action | Explicit access message |
| Read-only | applicable | Explain viewing without mutation | No mutation unless explicitly allowed | Action availability is clear |

Status meaning must not rely on color alone; title and description carry the
message and actions have accessible names.

## Interaction model

| Capability | User intent | Pointer/touch | Keyboard/focus | Escape/close | Feedback |
| --- | --- | --- | --- | --- | --- |
| Read result state | Understand why content is unavailable | Read content | Tab follows document order | Not applicable | Title and description |
| Recovery action | Restore or change the result | Activate consumer action | Enter/Space on action | Consumer-owned | Consumer updates result |
| Filtered-empty recovery | Remove active criteria | Activate clear action | Keyboard activation | Not applicable | Results return through consumer |

The atom owns presentation and action-slot placement. The consumer owns query,
permissions, recovery behavior and the resulting state; no popup or clear-all
state is owned here.

- Theme token mapping: semantic feedback/status tokens; no raw colors.
- Tenant/brand variation: `token-only`.
- Dark mode/high contrast: supported through semantic status tokens.

## Usage recipes and compatibility

### Recommended usage

```tsx
<EmptyState
  status="filtered-empty"
  title="No accounts match these filters"
  action={<Button onClick={clearFilters}>Clear filters</Button>}
/>
```

The consumer chooses the status, copy and recovery handler. The atom explains
the result without owning queries, permissions or mutation policy.

### Avoid

```tsx
<EmptyState status="forbidden" action={<CreateAccountButton />} />
```

Do not invent permission decisions or show mutation actions that contradict the
status. Do not use `EmptyState` while content is still loading.

### Works with / does not work with

| Component/view                                           | Relationship          | Boundary                                                    |
| -------------------------------------------------------- | --------------------- | ----------------------------------------------------------- |
| `FiltersActions`, `ResponsiveTable`, `TechnicalSurface`  | Explicit result state | Consumer owns query and recovery                            |
| `LoadingState` as simultaneous state, repository/service | Not compatible        | State is selected by the consumer; services stay outside UI |

### Designed capabilities and future suites

- Designed for: empty, filtered-empty, error, forbidden and read-only results.
- Not designed for: fetching, authorization, retry implementation or navigation.
- Future suites: provide domain copy and permitted recovery action per state.
- Extension boundary: new status or announcement requires updated state and Axe
  evidence across affected suites.

## Platform portability

| Platform        | Implementation                       | Shared contract                | Allowed divergence       | Evidence       |
| --------------- | ------------------------------------ | ------------------------------ | ------------------------ | -------------- |
| Web/RSC         | `@loopdev/ui`                        | status/content/action contract | none                     | focused tests  |
| Web/client      | not required                         | not-applicable                 | not-applicable           | not-applicable |
| Expo/NativeWind | native equivalent required per suite | status/content intent          | action/layout primitives | not-applicable |

- Native equivalent: suite-owned empty-state implementation.
- NativeWind compatibility: `partial`.
- RSC constraints: action slots with handlers require a client boundary.

## Certification checklist and reproducibility

- [x] Showcase consumes the public component without corrective logic.
- [x] Forbidden and read-only semantics do not rely on color alone.
- [x] State transitions preserve caller-owned content geometry.
- [x] Recovery actions remain consumer-owned.
- [x] Automated A11y: `verified` - semantic/status Axe coverage.
- Reproducibility: `verified` - focused state tests and foundation review.
- A11y automation: `verified` - Axe coverage.

## Certification evidence

- Contract: `verified` - status API and focused tests
- Accessibility: `verified` - semantic/Axe coverage
- Interaction: `verified` - action slot remains consumer-owned
- Responsive: `verified` - shared foundation review
- States: `verified` - empty/error/forbidden/read-only fixtures
- Consumer ownership: `verified` - no authorization or retry logic inside
- Visual review: `verified` - shared foundation evidence
- Registry: `verified` - frontend registry

## Reopen triggers

- New status, action ownership, announcement or recovery behavior.
