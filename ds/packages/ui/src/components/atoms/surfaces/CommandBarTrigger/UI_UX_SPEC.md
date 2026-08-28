# UI/UX Specification: CommandBarTrigger

- Implementation: `ds/packages/ui/src/components/atoms/surfaces/CommandBarTrigger`
- Public export: `@loopdev/ui`
- Owner: `atom`
- Runtime: `client`
- Directive: `use client`
- Status: `certified`
- Last reviewed: `2026-08-16`
- Consumers: SuiteHeader, CRM shell and workspace command surfaces
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`
- Spec version: `1.0`
- Contract version: `command-bar-trigger-v1`
- Platform target: `mobile-adapted`

## Purpose

Expose a compact, accessible button that opens the consumer-owned command
palette while preserving a visible search cue and optional keyboard shortcut.

## Responsibility

### Owns

- Native button semantics, full/icon presentation, placeholder and shortcut
  presentation, focus treatment and disabled behavior.

### Does not own

- Command palette state, command definitions, navigation, permissions,
  persistence or keyboard shortcut registration.

## Public UI contract

| Prop/state | Meaning | Interaction | Accessibility |
| --- | --- | --- | --- |
| `onOpen` | Consumer callback to open the palette | Click or keyboard activation | Native button activation |
| `mode` | `full` or compact `icon` presentation | Same action contract | Accessible name remains present |
| `placeholder` | Consumer-owned prompt | Informational only | Visible text in full mode |
| `shortcut` | Consumer-owned shortcut hint | Informational only | Not the only action meaning |
| `disabled` | Palette unavailable | No activation | Native disabled semantics |

## Responsive and theme contract

Full mode remains usable in shell and CRM content planes; icon mode provides a
compact mobile/tablet alternative. The trigger must not create page-level
horizontal overflow. Light and dark themes use semantic surface, border, text
and accent tokens. Focus and disabled states remain distinguishable without
relying on color alone.

## Accessibility contract

- Uses a native `button` with `type="button"`.
- Has a stable accessible name for full and icon modes.
- Preserves Enter and Space activation through native button semantics.
- Disabled state prevents activation and remains semantically disabled.
- The displayed shortcut is supplementary; actual global shortcut handling is
  consumer-owned.

## Certification evidence

- Contract: `verified` - typed props and focused component tests
- Accessibility: `verified` - native button name, disabled and Axe coverage
- Interaction: `verified` - click and keyboard-compatible native activation
- Responsive: `verified` - CRM Playwright desktop, mobile and mobile-compact review
- States: `verified` - full, icon, disabled and custom shortcut fixtures
- Consumer ownership: `verified` - palette behavior and commands remain external
- Visual review: `verified` - light/dark desktop and mobile CRM showcase review
- Registry: `verified` - frontend registry entry promoted with CRM evidence

## Reopen triggers

- Palette ownership, global shortcut registration, new mode, menu behavior or
  command data responsibility.
