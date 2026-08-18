# Button UI/UX Specification

- Component: `Button`
- Route: `ds/packages/ui/src/components/atoms/inputs/Button`
- Owner: shared atom / `frontend-platform`
- Runtime: `client`
- Directive: `'use client'`
- Status: `certified`
- Spec version: `1.0`
- Consumer baseline: CRM actions, forms, filters and mutation triggers

## User outcome

The user can recognize an available action, understand its importance, activate
it with pointer, touch or keyboard, and receive stable feedback while the
action is pending or unavailable.

## Public contract

`Button` extends native `ButtonHTMLAttributes<HTMLButtonElement>` and adds:

- `variant`: `primary`, `secondary`, `outline`, `ghost`, `energy` or `danger`;
- `size`: `sm`, `md` or `lg`;
- `fullWidth` for consumer-owned layout;
- `isLoading` for pending action feedback;
- `startIcon` and `endIcon` for Material Symbols names;
- `permission` for consumer-provided permission context.

Consumers own visible copy, action handlers, mutation state, confirmation policy,
permission meaning and recovery behavior. The atom must not perform domain
mutations or infer business authorization.

## Anatomy and ownership

```text
SuiteCanvas / consumer composition
└── Button atom
    ├── native button semantics
    ├── optional start icon
    ├── action label
    ├── optional end icon
    └── loading or permission feedback
```

The atom owns semantic button geometry, variant tokens, focus treatment, native
disabled behavior and loading affordance. Consumers own placement, grouping,
copy, destructive confirmation and mutation lifecycle.

## UX and visual contract

| Variant | Intent | Visual meaning | Approved use |
| --- | --- | --- | --- |
| `primary` | Main action | Strong filled action surface | One dominant action per region |
| `secondary` | Supporting action | Neutral bordered surface | Secondary workflow actions |
| `outline` | Alternative action | Tokenized primary border | Low-emphasis alternative |
| `ghost` | Tertiary/local action | Minimal surface | Inline or toolbar action |
| `energy` | Highlighted assistant/system action | Accent emphasis | Explicitly documented AI or system action |
| `danger` | Destructive or irreversible action | Danger semantic color | Delete, revoke or destructive confirmation |

Variants communicate hierarchy, not permissions or success state. Do not use a
color variant as the only indication of a business status.

Sizes are `sm`, `md` and `lg`; the button must preserve stable geometry and keep
visible copy within its bounds. `fullWidth` is a consumer layout choice and
must not create page-level overflow.

## Interaction model

| Capability | User intent | Pointer/touch | Keyboard/focus | States | Accessibility |
| --- | --- | --- | --- | --- | --- |
| Activate action | Execute the declared action | Click/tap | Enter or Space; visible focus | ready, hover, active, focus | Native button name from visible children or accessible label |
| Pending action | Understand action is processing | Activation unavailable | Focus remains predictable; no repeat activation | loading | `disabled`, `aria-disabled` and `aria-busy`; label must remain understandable |
| Permission restricted | Understand action is unavailable | No activation | Remains in logical order unless consumer hides it | forbidden/disabled | Native disabled semantics plus explanatory text/tooltip owned by consumer |
| Destructive action | Recognize risk before mutation | Click/tap | Enter or Space | danger, confirmation, pending | Copy and confirmation belong to consumer; color is not sufficient |

Loading disables the button and displays the loading affordance without changing
the consumer's action label into technical copy. Icon-only actions are outside
this atom's preferred contract unless the consumer supplies an accessible name;
use `IconButton` when the action has no visible text label.

## State model

| State | Applicability | Owner | Contract |
| --- | --- | --- | --- |
| Ready | required | atom/consumer | Enabled native button |
| Hover/active/focus | required | atom | Tokenized interaction and visible focus |
| Loading | required | consumer + atom | Disabled, busy and stable geometry |
| Disabled | required | consumer + atom | Native disabled behavior; no activation |
| Permission denied | applicable | consumer/auth + atom | Explicit policy: hide, disable or read-only composition |
| Error/success | consumer-owned | consumer | Feedback belongs beside or around the button |
| Offline/conflict | consumer-owned | consumer | Action recovery and retry belong to the feature |

## Responsive contract

The button remains an inline-flex action at desktop, tablet and mobile widths.
Text may wrap only when the consumer explicitly permits it; otherwise the
consumer must provide a layout that keeps the label readable. `fullWidth` is the
approved mobile transformation for primary form actions. Button groups must
wrap or stack in the consumer composition and must not cause horizontal page
overflow.

## Accessibility contract

- Use the native `<button>` element and preserve its implicit role.
- The accessible name comes from visible children, `aria-label` or
  `aria-labelledby`.
- `Enter` and `Space` must activate enabled buttons.
- Focus-visible treatment must be distinct from hover and disabled styling.
- `disabled` must prevent activation; `aria-disabled` must not be the sole
  protection for a critical action.
- Loading must expose busy state and prevent duplicate activation.
- Permission explanations must not rely on color alone; tooltip or adjacent
  copy is consumer-owned.
- Icon-only use requires an accessible name and should normally use `IconButton`.
- Reduced motion must remove non-essential loading/transition motion.

## Security, data and runtime boundary

- `permission` is a presentation and interaction hint only; backend/API
  authorization remains mandatory for critical actions.
- Permission identifiers and technical auth data must not be emitted as
  telemetry or visible user copy. The current `data-permission` DOM attribute is
  an implementation finding to review before certification.
- The atom must not log children, permission values, tokens or mutation payloads.
- `Button` owns no fetch, persistence, retry or optimistic rollback behavior.
- The component is client-only because permission resolution and loading
  interaction currently use client hooks; the public props must remain
  serializable at composition boundaries.

## Approved usage

```tsx
<Button variant="primary" onClick={onCreateContact}>
  Create contact
</Button>

<Button variant="danger" isLoading={isDeleting} onClick={onDeleteContact}>
  Delete contact
</Button>
```

## Anti-patterns

- Do not encode CRM permissions or mutation logic inside the shared atom.
- Do not use `danger` without consumer-owned confirmation for destructive work.
- Do not use `aria-disabled` without preventing activation.
- Do not use long technical IDs as visible labels.
- Do not place corrective CSS in the showcase to repair button geometry.
- Do not use `Button` as an icon-only control when `IconButton` is the correct
  semantic component.

## Evidence and change impact

- Unit/contract: `Button.test.tsx` and `ButtonRBAC.test.tsx`
- Registry: `docs/registries/frontend-components.json` (`button-v2`)
- Documentation: this specification and `README.md`
- Responsive/visual: `e2e/button.certification.spec.mjs` (`21/21` across desktop,
  mobile and mobile-compact, light/dark themes)
- Security/data: permission identifiers are not emitted to the DOM; backend/API
  authorization remains consumer-owned and mandatory
- Runtime/resilience: loading disables the native button and preserves the
  consumer label; network recovery is not applicable because the atom owns no
  I/O or mutation lifecycle

| Change | Gates to reopen |
| --- | --- |
| New variant or size | Contract, responsive, visual, theme |
| New loading or permission behavior | Contract, accessibility, security, data |
| New icon-only usage | Accessibility, interaction, responsive |
| New consumer or mutation responsibility | Ownership, data, resilience, portability |

## Certification history

| Date | Version | Change | Status |
| --- | --- | --- |
| 2026-08-16 | 1.0 | Initial UI/UX contract and certification evidence | certified |
