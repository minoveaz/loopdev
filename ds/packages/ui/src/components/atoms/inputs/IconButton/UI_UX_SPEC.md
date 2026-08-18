# IconButton UI/UX Specification

- Component: `IconButton`
- Route: `ds/packages/ui/src/components/atoms/inputs/IconButton`
- Owner: shared atom / `frontend-platform`
- Runtime: `client`
- Directive: `'use client'`
- Status: `certified`
- Spec version: `1.0`
- Consumer baseline: CRM row actions, compact menus and toolbar actions

## User outcome

The user can identify and trigger a discrete action represented by an icon, with
an accessible name, predictable focus treatment, stable geometry and clear
loading or disabled feedback.

## Public contract

`IconButton` renders a native `<button type="button">` and supports:

- `icon`: Material Symbols name rendered by the shared `Icon` primitive;
- `children`: consumer-owned custom icon/content override;
- `variant`: `neutral`, `primary`, `danger`, `success`, `ghost` or `energy`;
- `size`: `sm`, `md` or `lg`;
- `tooltip`: native title and fallback accessible name;
- `ariaLabel`: explicit accessible name;
- `isLoading` and `disabled` for interaction state;
- native button attributes and handlers.

The consumer owns action meaning, copy, confirmation, permission policy, data,
mutation lifecycle and recovery behavior. `IconButton` owns icon geometry,
native button semantics, tokenized visual states and disabled/loading feedback.

## Quick reference

| Need | Component | Notes |
| --- | --- | --- |
| Visible text action | `Button` | Prefer when the action label is important to task comprehension |
| Discrete icon action | `IconButton` | Requires an accessible name from `ariaLabel`, `tooltip` or icon fallback |
| Icon-only menu or row action group | `IconButton` | Consumer owns grouping, ordering and menu behavior |
| Icon with no action semantics | `Icon` | Do not wrap decorative icons in a button |

## Anatomy and ownership

```text
SuiteCanvas / consumer composition
└── IconButton atom
    ├── native button semantics and focus ring
    ├── icon or consumer custom content
    └── loading or disabled state
```

The atom is an inline-flex control with fixed `sm` (28px), `md` (32px) or `lg`
(36px) geometry. Consumers own placement, grouping, tooltip language,
confirmation and action state. The atom must not fetch, mutate data, resolve
business permissions or implement menus.

## UX and visual contract

| Variant | Intent | Approved use |
| --- | --- | --- |
| `neutral` | Default discrete action | Row actions and low-emphasis controls |
| `primary` | Important discrete action | A single prominent toolbar action |
| `danger` | Destructive action | Delete/revoke, with consumer confirmation |
| `success` | Positive workflow action | Confirm/approve when the icon is unambiguous |
| `ghost` | Minimal local action | Dense toolbars and inline controls |
| `energy` | Highlighted system/assistant action | Explicitly documented assistant or system action |

Color never communicates the business result by itself. `danger` does not
implement confirmation and `success` does not imply that a mutation succeeded.

## Interaction matrix

| Capability | User intent | Pointer/touch | Keyboard/focus | States | Accessibility |
| --- | --- | --- | --- | --- | --- |
| Activate action | Execute the named action | Click/tap | Enter or Space; visible focus | ready, hover, active, focus | Native button and accessible name |
| Pending action | Avoid duplicate activation | Inert while loading | Remains in tab order only if consumer policy requires it; native disabled is current contract | loading | Native disabled, busy announcement required |
| Disabled action | Understand unavailable control | No activation | Skipped by native keyboard navigation | disabled | Native `disabled`; do not rely on color alone |
| Destructive action | Recognize risk | Click/tap after consumer confirmation | Enter or Space | danger, confirmation, loading | Confirmation and recovery belong to consumer |
| Custom content | Preserve consumer icon | Click/tap | Same native semantics | ready/loading/disabled | Consumer must provide an accessible name |

Loading replaces the icon with the shared progress glyph and disables the
button. The consumer label is the accessible name and must remain stable. The
implementation must expose `aria-busy="true"` while loading before promotion.

## Responsive contract

The control keeps its fixed square geometry at desktop, tablet and mobile
widths. Groups wrap or stack in the consumer composition; the atom must not
create page-level horizontal overflow. Touch targets should use at least `md`
when the surrounding workflow permits it. `sm` is reserved for dense tables and
compact toolbars where the consumer has reviewed target size.

## Accessibility contract

- Use the native `<button>` element with `type="button"`.
- Provide an accessible name through explicit `ariaLabel`, `tooltip`, or a
  documented fallback; technical icon IDs are not suitable localized copy.
- Preserve Enter and Space activation for enabled controls.
- Provide a visible `:focus-visible` ring distinct from hover and disabled.
- Native `disabled` must prevent activation; `aria-disabled` alone is
  insufficient for critical actions.
- Loading must prevent duplicate activation and expose busy state.
- Tooltip/title is supplemental and must not be the only name when the
  consumer can provide localized `ariaLabel`.
- Custom content requires an accessible name from the consumer.
- Reduced motion must remove non-essential spinner/transition motion.
- Axe evidence is required for the default, loading and disabled compositions.

## State model

| State | Applicability | Owner | Contract |
| --- | --- | --- | --- |
| Ready | required | atom/consumer | Enabled native button and visible icon |
| Hover/active/focus | required | atom | Tokenized interaction and focus ring |
| Loading | required | atom + consumer | Disabled, busy, stable square geometry |
| Disabled | required | atom + consumer | Native disabled behavior |
| Permission denied | deferred | consumer | Consumer disables/hides; atom does not resolve permissions |
| Error/success | consumer-owned | consumer | Feedback belongs beside or around the action |
| Offline/conflict | not-applicable | feature | Atom owns no I/O or persistence |

## Theme and tenant contract

Theme support is `token-only`. Variants use semantic tokens and the primary
variant supports consumer-provided `--comp-primary`, `--comp-primary-dark` and
`--comp-primary-soft` variables. Light and dark themes must preserve contrast,
focus visibility and icon legibility. Tenant branding may change token values,
not semantics, geometry or accessible naming.

## Suite portability

- **CRM:** row actions, compact table controls and clear/open actions; the CRM
  owns record IDs, confirmation and permissions.
- **Marketing Studio:** asset or campaign toolbar actions; the suite owns
  localized labels, undo behavior and mutation feedback.
- **Operations:** dense operational tables and status actions; the suite owns
  escalation, audit and recovery policy.

The extension boundary is icon name, accessible copy, variant, size and consumer
handlers. A new state, role, overlay/menu responsibility or domain permission
requires reopening the relevant contract, accessibility, ownership and visual
gates.

## Approved usage

```tsx
<IconButton
  icon="more_vert"
  ariaLabel="Open contact actions"
  onClick={onOpenActions}
/>

<IconButton
  icon="delete"
  variant="danger"
  ariaLabel="Delete contact"
  onClick={onRequestDelete}
/>
```

## Anti-patterns

- Do not expose a technical icon name as the only user-facing accessible copy
  when localized `ariaLabel` is available.
- Do not use `IconButton` for an action whose meaning needs visible text; use
  `Button`.
- Do not implement menus, confirmations, permissions or API mutations inside
  the atom.
- Do not use `danger` without consumer-owned confirmation.
- Do not repair geometry or focus defects with showcase-only CSS.
- Do not use custom children without an accessible name.

## Performance, data and runtime boundaries

The atom performs no I/O, persistence, logging or telemetry and receives only
serializable props at composition boundaries. Rendering one icon and one native
button is the expected scale; consumers own virtualization for large action
lists. `IconButton` is client-only because the current implementation uses a
client component boundary; it must not access browser globals during render.

## Evidence and change impact

- Unit/contract: `IconButton.test.tsx`
- Registry: `docs/registries/frontend-components.json` (`icon-button-v1`)
- Documentation: this specification and `README.md`
- Responsive/visual: `e2e/icon-button.certification.spec.mjs` (`21/21` across desktop,
  mobile and mobile-compact, light/dark themes)
- Security/data: native attributes are explicitly forwarded; accessible names
  are consumer-controlled through `ariaLabel` or `tooltip`; the atom owns no
  permission or telemetry data
- Runtime/resilience: loading disables the native button and exposes
  `aria-busy`; the atom owns no I/O, persistence or mutation lifecycle

| Change | Gates to reopen |
| --- | --- |
| New variant or size | Contract, responsive, visual, theme |
| New loading or naming behavior | Contract, accessibility, interaction, security |
| New custom content path | Accessibility, ownership, interaction |
| New consumer or menu responsibility | Portability, ownership, responsive, resilience |

## Certification history

| Date | Version | Change | Status |
| --- | --- | --- |
| 2026-08-16 | 1.0 | Initial UI/UX contract and certification evidence | certified |
