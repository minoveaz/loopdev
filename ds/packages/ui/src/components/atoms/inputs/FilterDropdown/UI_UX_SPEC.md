# UI/UX Specification: FilterDropdown

- Implementation: `ds/packages/ui/src/components/atoms/inputs/FilterDropdown`
- Public export: `@loopdev/ui`
- Owner: `atom`
- Status: `certified`
- Last reviewed: `2026-08-16`
- Consumers: `FiltersActions`, workspace filter compositions
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`

## Purpose

Provide an accessible multi-select filter trigger and option list without
owning queries, persistence or domain filter state.

## Responsibility

### Owns

- Trigger semantics, selected count, popup option presentation, Escape/focus
  return and disabled/read-only interaction behavior.

### Does not own

- Query execution, filter business rules, active-chip layout, responsive page
  composition or authorization.

## UI contract

| Prop/state | Visual behavior                     | Interaction              | Accessibility                      |
| ---------- | ----------------------------------- | ------------------------ | ---------------------------------- |
| `options`  | Multi-select option list            | Toggle one option without closing the popup | Each option exposes pressed state  |
| `selected` | Count reflects selected values only | Controlled by consumer   | Trigger communicates current state |
| `onClear` | Clear action appears when selected values exist | Clears all values and keeps the multi-select popup open | Action exposes a menu-item role |
| `multiple=false` | Single-select option list | Selecting an option closes the popup | Only one value can be selected |
| `disabled` | Trigger unavailable                 | Cannot open or mutate    | Native disabled semantics          |
| `readOnly` | Options may be inspected            | Cannot mutate selection  | `aria-disabled` and no mutation    |
| `Escape`   | Popup closes                        | Focus returns to trigger | `aria-expanded` updates            |

## Composition and responsive contract

The trigger belongs in a consumer-owned filter/action plane. The popup stays
anchored to the trigger on desktop and remains reachable without clipping on
narrow layouts. The consumer owns the popup boundary and must use a visible
overflow context when the surrounding surface clips positioned content. The
popup matches the trigger width by default so option labels align with the
control; a wider popup requires an explicit consumer-owned variant. The
primitive must not create a page toolbar or active-filter chip row. In
multi-select mode, the optional `onClear` action appears at the bottom of the
popup when values are selected. The consumer owns the cleared state; the
action is unavailable in read-only mode and is not rendered for single-select.
All mutating actions in multi-select mode keep the popup open; Escape and an
outside interaction close it. Single-select closes after its choice is made.

## Certification evidence

- Contract: `verified` - public types and focused tests
- Accessibility: `verified` - focused Axe coverage covers closed and open states
- Interaction: `verified` - selected toggle, Escape and focus tests
- Responsive: `ready-for-visual-review` - consumer fixture is prepared for
  desktop, mobile and mobile-compact review
- States: `verified` - disabled/read-only focused tests
- Consumer ownership: `verified` - filter state remains consumer-owned
- Visual review: `verified` - user-approved visual review of popup geometry, themes and responsive states
- Registry: `verified` - registry entry promoted after E2E evidence

## Reopen triggers

- Popup model, option semantics, keyboard navigation, selected count or
  disabled/read-only contract changes.
