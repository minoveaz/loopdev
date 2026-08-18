# UI/UX Specification: Checkbox

- Implementation: `ds/packages/ui/src/components/atoms/inputs/Checkbox`
- Public export: `@loopdev/ui`
- Owner: `atom`
- Runtime: `client`
- Directive: `use client`
- Status: `certified`
- Last reviewed: `2026-08-16`
- Consumers: CRM table selection and form compositions
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`
- Spec version: `1.0`
- Contract version: `checkbox-v1`
- Platform target: `mobile-adapted`

## Purpose

Provide a shared, accessible binary selection control while the consumer owns
selection state, labels, validation and domain meaning.

## Responsibility

### Owns

- Native checkbox semantics, checked/unchecked/indeterminate presentation,
  label association, disabled treatment and tokenized focus/checked styling.

### Does not own

- Table selection policy, bulk actions, persistence, permissions or domain state.

## Public UI contract

| Prop/state | Meaning | Accessibility |
| --- | --- | --- |
| `checked/defaultChecked` | Controlled or seeded selection | Native checked state |
| `label` | Optional visible field label | Explicit label association |
| `disabled` | Control unavailable | Native disabled semantics |
| `aria-label` | Name when no visible label is supplied | Accessible name |
| `onChange` | Consumer-owned state transition | Native change event |

The control preserves a native checkbox input for semantics and keyboard
interaction while using shared visual tokens for the control surface.

## Responsive and theme contract

The hit area remains reachable on desktop, tablet and mobile without page-level
overflow. Light and dark themes use semantic tokens; checked state and focus are
not communicated by color alone because the native check and accessible name
remain present.

## Certification evidence

- Contract: `verified` - typed props and native input contract
- Accessibility: `verified` - focused Checkbox test and native semantics
- Interaction: `verified` - pointer and keyboard selection behavior
- Responsive: `verified` - CRM Playwright desktop, mobile and mobile-compact review
- Visual review: `verified` - user-approved light/dark desktop and mobile review
- Consumer ownership: `verified` - selection state and bulk policy remain consumer-owned
- Registry: `verified` - frontend registry entry promoted with CRM evidence

## Reopen triggers

- New selection mode, custom role, table policy, async behavior or state ownership.
