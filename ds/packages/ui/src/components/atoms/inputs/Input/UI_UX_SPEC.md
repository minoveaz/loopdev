# Input UI/UX Specification

- Component: `Input`
- Route: `ds/packages/ui/src/components/atoms/inputs/Input`
- Owner: shared atom / frontend-platform
- Runtime: `client`
- Directive: `'use client'`
- Status: `certified`
- Spec version: `1.0`
- Consumer baseline: CRM P0, Marketing Studio forms/search, Operations forms/search

## User outcome

The user can enter or inspect a value, understand its label and supporting
feedback, recover from validation errors, and use password visibility controls
without losing keyboard access.

## Public contract

`Input` extends native `InputHTMLAttributes<HTMLInputElement>` and adds
`label`, `helperText`, `error`, `startIcon`, `endIcon`, `isLoading`, `variant`,
`size` and `fullWidth`. Domain data, submit behavior, permissions and mutation
logic remain with the consumer.

## Anatomy and ownership

```text
Shell/SuiteCanvas context
└── transparent consumer composition
    └── Input atom
        ├── optional associated label
        ├── input wrapper with variant/focus/error treatment
        ├── native input semantics
        └── optional helper/error or loading/password affordance
```

The atom owns label association, input semantics, visual state and password
visibility interaction. Consumers own field grouping, copy, validation policy,
submission, permissions and recovery actions.

## Supported states

| State | Applicability | Current behavior |
| --- | --- | --- |
| Ready | required | Native editable input with focus treatment |
| Focused | required | Tokenized primary ring and border |
| Disabled | required | Native disabled semantics and reduced visual emphasis |
| Read-only | required | Native `readOnly` semantics from inherited props |
| Loading | applicable | Loading status replaces trailing affordances |
| Error | applicable | Error message, invalid state and error description |
| Helper | applicable | Helper description associated with the input |
| Password | applicable | Keyboard-reachable show/hide button |
| Empty | applicable | Consumer-controlled empty value |
| Forbidden/offline/conflict | not-applicable | Owned by the consumer state composition |

## Accessibility and interaction contract

- Use native `<input>` semantics and an associated `<label>` when `label` is provided.
- Consumers must provide an accessible name when no visible `label` exists.
- `aria-invalid` is true only when `error` is present.
- `aria-describedby` is emitted only when helper or error content exists.
- Helper and error copy are consumer-provided; technical error codes are not rendered.
- The password toggle is a native button, keyboard reachable, and has a stateful accessible name.
- Focus-visible treatment belongs to the shared atom; focus order follows consumer reading order.
- Loading exposes a status affordance and suppresses password/end-icon conflicts.
- No Escape or outside-click behavior is owned by this atom.

## Responsive and density contract

The atom is width-fluid by default (`fullWidth`) and supports compact `sm`,
standard `md` and larger `lg` sizing. It must not create page-level horizontal
overflow. Long labels and helper/error messages wrap inside the consumer width.
The consumer chooses field layout and mobile stacking; the atom does not invent
responsive form grids.

## Theme and tokens

The implementation uses semantic surface, border, text, primary and danger
tokens and supports light/dark themes. Tenant variation is `token-only`:
branding may change semantic token values, not the component API or state
meaning. High-contrast review remains an evidence item for certification.

## Approved usage

```tsx
<Input
  label="Search contacts"
  placeholder="Search contacts"
  aria-describedby="contacts-search-help"
  helperText="Search by company or owner"
/>
```

The CRM consumer owns the query state, debounce policy, clear action and result
announcement. `FiltersActions` composes `Input`; it does not fork its markup.

## Anti-patterns and non-goals

- Do not render technical IDs, domain records or mutation behavior inside `Input`.
- Do not add corrective CSS in showcase consumers to repair dimensions or focus.
- Do not use `Input` as a select, filter menu or table selection primitive.
- Do not hide password controls from keyboard navigation.
- Do not use raw tenant colors or suite-specific validation policy in the atom.

## Compatibility and composition

| Need | Component |
| --- | --- |
| Free text/search/form value | `Input` |
| Native enumerated value | `Select` |
| Single/multi filter menu | `FilterDropdown` |
| Table selection | `ResponsiveTable` selection control |
| Search plus clear/filter actions | `FiltersActions` |

CRM, Marketing Studio and Operations may compose `Input` with their own labels,
validation copy, permissions and recovery actions. A new role, composite state,
masking behavior or suite-specific data contract reopens this specification.

## Evidence and change impact

- Unit/Axe: `Input.test.tsx` (`8/8` passing after keyboard and ARIA corrections)
- Consumer: `CRMPrimitivesCatalog.tsx` and `FiltersActions`
- Registry: `docs/registries/frontend-components.json` (`input-v1`)
- Responsive: Playwright evidence passed at 390px, 320px, 1024px and 1440px; no horizontal overflow
- Visual: Playwright evidence passed in light and dark CRM shell themes
- Performance/CLS: passed for the current atom contract; stable geometry and no heavy component-local dependency; loading state remains consumer composition evidence

## Technical certification pilot

This component is the first pilot for the total certification model. UI/UX
certification remains independent; the following dimensions are technical
evidence and do not replace the UI/UX review.

| Dimension | Applicability | Status | Evidence / owner |
| --- | --- | --- | --- |
| Security and data integrity | required | passed | Static review found no HTML sinks, logging, telemetry or storage APIs; password masking and technical error-code redaction covered by `Input.test.tsx` / frontend-platform |
| Data flow and state ownership | required | passed | `InputProps` extends native input props; value, validation, permissions and mutation behavior remain consumer-owned / frontend-platform |
| Performance and runtime cost | required | passed | Client boundary and local state identified; Playwright geometry is stable without horizontal overflow; component-local dependencies are `clsx` and `tailwind-merge`; loading layout remains consumer-owned / frontend-platform |
| Resilience and failure boundaries | not-applicable | not-applicable | The atom does not fetch, mutate, retry or own network failure state; consumer compositions own those states / CRM and suite consumers |
| Maintainability and testing contract | required | passed | Typed public API, `Input.test.tsx` 9/9, focused Axe coverage, Playwright UX suite and adjacent spec / frontend-platform |

### Pilot findings and next evidence

- `Input` does not render HTML or Markdown and exposes no telemetry API; the
  security review is limited to sensitive values, masking and accidental
  logging at the consumer boundary.
- `error` accepts a message and optional technical code, but only the message
  is rendered. The consumer remains responsible for not passing PII or raw API
  payloads as visible copy.
- `value`, `defaultValue`, `onChange`, disabled/read-only behavior and submit
  ownership remain native/consumer-controlled; the atom owns only focus and
  password visibility state.
- Loading-to-ready layout is a consumer composition responsibility because
  `Input` exposes a stable wrapper and replaces trailing affordances without
  owning a page layout boundary.

### Responsive evidence

Playwright measurement in the CRM primitive catalog:

| Viewport | Input geometry | Document overflow |
| --- | --- | --- |
| 390 x 844 | 322 x 40 px, right edge 356 px | none (`scrollWidth: 390`) |
| 1440 x 900 | 528 x 40 px, right edge 822 px | none (`scrollWidth: 1440`) |

| Change | Gates to reopen |
| --- | --- |
| New state or ARIA role | Contract, accessibility, interaction, visual |
| Layout or size change | Responsive, interaction, visual |
| New suite consumer | Ownership, portability, responsive |
| New action or masking behavior | Contract, accessibility, ownership |

## History

| Date | Version | Change | Status |
| --- | --- | --- |
| 2026-08-16 | 1.0 | Initial CRM primitive audit; fixed ARIA description references and keyboard password toggle | certified |
