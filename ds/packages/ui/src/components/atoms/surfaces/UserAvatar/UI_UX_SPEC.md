# UI/UX Specification: UserAvatar

- Implementation: `ds/packages/ui/src/components/atoms/surfaces/UserAvatar`
- Public export: `@loopdev/ui`
- Owner: `atom`
- Runtime: `server`
- Directive: `none`
- Status: `certified`
- Last reviewed: `2026-08-16`
- Consumers: CRM owner and assignee compositions
- Related track: `tracks/active/crm/2026-08-15-crm-ui-foundation.md`
- Spec version: `1.0`
- Contract version: `user-avatar-v1`
- Compatible since: `2026-08-16`
- Platform target: `mobile-adapted`

## Quick reference

- Use when: representing a person in a compact identity surface.
- Do not use when: the user needs profile navigation, editing or directory lookup.
- Main composition: owner/assignee metadata in CRM rows and cards.
- Certification: `certified`; technical, visual and responsive evidence complete.

## Purpose

Represent a person consistently in compact workspace surfaces, with an optional status signal.

## Responsibility

### Owns

- Avatar image or fallback, size, accessible name and optional online status indicator.

### Does not own

- User directory lookup, permissions, navigation, profile actions or identity persistence.

## UI contract

| Prop/state | Visual behavior | Interaction | Accessibility |
| --- | --- | --- | --- |
| `name` | Fallback initials or identity label | Non-interactive by default | Name is available as accessible text |
| `size` | Stable small, medium or large geometry | No action | Geometry remains predictable |
| `status` | Optional semantic status marker | No action | Status is not communicated by color alone |
| `withStatus` | Status marker is shown | No action | Decorative visuals do not duplicate the name |

## Interaction model

| Capability | User intent | Pointer/touch | Keyboard/focus | Escape/close | Feedback |
| --- | --- | --- | --- | --- | --- |
| Identify person | Read identity | Read content | Not focusable by default | Not applicable | Name, initials or fallback icon |
| Read status | Understand availability | Read marker and label | Not applicable | Not applicable | Status is supplementary |

UserAvatar owns no popup, selection, clear, upload, navigation or profile action.

## State model

| State | Applicability | Required UI | Allowed action | Accessibility |
| --- | --- | --- | --- | --- |
| Ready with image | applicable | Image with accessible name | None | Name exposed |
| Ready with initials | required | Initial fallback and name | None | Name exposed |
| Fallback icon | applicable | Neutral fallback | None | Consumer supplies context |
| Loading | not-applicable | Use consumer loading primitive | None | Do not imply identity |
| Disabled/forbidden | not-applicable | Consumer owns access treatment | None | Do not fake an action state |

## Content and responsive contract

- `name` is consumer-provided and localized; initials are derived only as a visual fallback.
- Image failure must preserve the accessible name and fallback identity.
- Size is stable across desktop, tablet and mobile; dense rows must not overflow.
- Status meaning must not rely on color or pulse alone.

## Responsive and theme contract

Avatar geometry is fixed per size, remains usable in dense mobile rows, and uses semantic tokens for fallback and status tones across supported themes.

## Evidence

- Contract: `verified` - public props and focused tests
- Accessibility: `verified` - accessible name and fallback semantics
- Interaction: `not-applicable` - non-interactive by default
- Responsive: `verified` - Playwright desktop, mobile and mobile-compact review
- Visual review: `verified` - user-approved light/dark desktop and mobile review
- Registry: `verified` - frontend registry entry promoted with CRM evidence

## Reopen triggers

- Adding click behavior, menus, upload, profile navigation, remote loading or new status semantics.
