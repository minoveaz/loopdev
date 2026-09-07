# UI/UX Specification: PlatformEnvironmentSelector

- Implementation: `apps/loopdev-os/src/components/layout/PlatformEnvironmentSelector.tsx`
- Public export: `@/components/layout/PlatformEnvironmentSelector`
- Owner: `shell`
- Runtime: `client`
- Directive: `use client`
- Status: `in-progress`
- Last reviewed: `2026-09-07`
- Consumers: PlatformHeader in LoopDev OS suites
- Related track: `tracks/planned/platform/2026-09-07-platform-sandbox-runtime.md`
- Spec version: `1.0`
- Contract version: `platform-environment-selector-v1`
- Compatible since: `2026-09-07`
- Platform target: `mobile-adapted`

## Purpose and responsibility

Let an authorized user choose the platform data environment without leaving the
global header. The selector owns presentation and selection feedback; the
Platform Runtime owns mode, persistence and policies.

It must not own suite data, CRM fixtures, queries, mutations or navigation.

## Composition

```text
PlatformHeader controls
└── PlatformEnvironmentSelector
    ├── compact trigger with current mode
    └── TechnicalDropdown with three environment actions
```

The parent owns header spacing. The selector uses semantic tokens and keeps the
trigger within the existing header control height.

## Interaction contract

| Capability | Pointer/touch | Keyboard/focus | Close behavior | Feedback |
| --- | --- | --- | --- | --- |
| Open environments | Activate trigger | Enter, Space or ArrowDown | Escape/outside closes | Menu opens beside trigger |
| Select mode | Activate one item | Arrow navigation and Enter | Closes after selection | Trigger label and indicator update |
| Current mode | Inspect indicator and checked item | `aria-checked` on active item | No separate action | Active item uses semantic accent |

The menu is single-select. Selecting an item closes it. There is no clear
action because one environment must always be active.

## States

| State | Applicability | Required behavior |
| --- | --- | --- |
| `ready` | required | Shows current environment and opens menu |
| `loading` | not-applicable | Runtime mode resolves synchronously |
| `empty` | not-applicable | Three modes are fixed |
| `error` | applicable | Runtime surfaces the error; selector does not invent a fallback |
| `read-only` | applicable | Selector is hidden or disabled by the permission owner |
| `disabled` | applicable | Trigger cannot open and communicates disabled state |
| `forbidden` | applicable | Selector is not rendered for unauthorized users |

## Responsive and accessibility contract

On desktop the selector is a compact header control. On mobile it may be
composed into the platform header's existing mobile actions rather than adding
width to the persistent control row. It must not create page overflow.

The trigger has the accessible name `Environment: <mode>` and
`aria-haspopup="menu"`. The active menu item exposes its selected state.
Focus and Escape behavior are provided by `TechnicalDropdown`/Radix.

## Approved pattern

Use `TechnicalDropdown` from `@loopdev/ui` with a compact trigger and
consumer-owned labels. Do not introduce another dropdown, popover or navigation
primitive.

## Evidence and certification

This slice is implementation-in-progress. Technical tests and visual review are
not certification evidence yet.
