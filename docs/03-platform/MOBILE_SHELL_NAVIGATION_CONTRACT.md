# Mobile Shell Navigation Contract

## Purpose

Define the ownership and interaction contract for mobile navigation across the
LoopDev Shell. This contract is a platform boundary consumed by CRM and other
suites; it is not a suite-specific navigation recipe.

## Scope

The contract covers the three mobile navigation layers rendered around a
`SuiteCanvas` composition:

1. Global Launchpad navigation.
2. Suite navigation.
3. Module context navigation.

The contract applies to `AppShell`, `SuiteShell`, `PlatformHeader`,
`SuiteSidebar`, `ModuleContextSidebar`, `ModuleContextPanel` and
`MobileSuiteNav`.

The platform context surface is `PlatformContextPanel`, rendered through the
`AppShell.contextSlot`.

## Ownership

| Concern | Owner | Consumer responsibility |
| --- | --- | --- |
| Global Launchpad action | `PlatformHeader` and platform runtime | Provide an explicit identity/Launchpad action; do not use it as the suite drawer trigger |
| Suite drawer open/close state | `AppShell` | Render the drawer, backdrop, close affordance and focus return |
| Suite navigation content | `SuiteShell` / `SuiteSidebar` | Provide suite routes and active state; do not own drawer state |
| Module context open/close state | `AppShell` coordinated with the module composition | Provide context trigger and content; do not create a second global overlay manager |
| Module context content | `ModuleContextSidebar` / `ModuleContextPanel` | Provide module-owned content, title and close affordance |
| Mobile bottom navigation | `MobileSuiteNav` | Navigate between suite destinations; do not silently open global or module overlays |
| Overlay priority and dismissal | `AppShell` | Close only the active overlay on backdrop, Escape or route change |
| Route transition cleanup | Suite/runtime integration | Request closure of open mobile overlays after navigation |

No suite or CRM composition may reinterpret the LoopDev identity control as a
suite navigation trigger. No child component may maintain a competing global
open/closed state for the suite drawer or module context drawer.

## Composition governance

Pages choose which certified zones are present and provide their domain
content. They do not restyle or resize `ModuleContextSidebar`,
`ModuleContextPanel`, `PlatformHeader` or `SuiteCanvas`. Headers, close/menu
controls, drawer geometry, backdrop behavior, focus return and route cleanup
remain platform-owned invariants.

The `split` mode is a composition preset, not a blank layout. When a page
declares a context sidebar or panel for that mode, the runtime supplies the
standard zone anatomy and responsive behavior. A page may omit a zone when its
workflow does not need it, but it may not remove the required sidebar trigger
or replace a context zone with a local overlay implementation.

## State model

The Shell has one active mobile overlay at a time:

```text
closed
  -> suite-nav-open
  -> module-context-open
```

Allowed transitions:

| Current state | Event | Next state |
| --- | --- | --- |
| `closed` | Suite navigation trigger | `suite-nav-open` |
| `closed` | Module context trigger | `module-context-open` |
| `suite-nav-open` | Same trigger, close, backdrop, Escape or route change | `closed` |
| `suite-nav-open` | Module context trigger | `module-context-open` |
| `module-context-open` | Same trigger, close, backdrop, Escape or route change | `closed` |
| `module-context-open` | Suite navigation trigger | `suite-nav-open` |

Opening one overlay must close the other before the new overlay becomes active.
The active overlay is represented by the existing `activeOverlay` concept and
must have one owner at the Shell boundary.

Global context modes (profile, notifications, help and assistant) are included
in that same exclusivity rule. They use `AppShell.contextSlot`; a suite must
not mount a second fixed panel or maintain a page-local backdrop. Opening suite
navigation closes the active global context mode, and Escape/backdrop closes
only the active topmost surface.

## Layer responsibilities

### Global Launchpad

- The identity or logo action returns to the global Launchpad.
- It may expose a separate suite switcher action when the platform header
  requires it.
- It must not be the fallback control for opening `SuiteSidebar`.
- On mobile, its accessible name must communicate Launchpad behavior.

### Suite navigation

- A dedicated menu control opens and closes `SuiteSidebar` as a mobile drawer.
- The trigger exposes `aria-expanded` and `aria-controls="app-shell-nav"`.
- The drawer exposes an accessible navigation name and a visible close action.
- The drawer closes on backdrop, Escape and route change.
- Focus returns to the trigger that opened it.

### Module context

- A module composition that exposes context provides an explicit mobile trigger.
- The trigger exposes `aria-expanded` and `aria-controls="app-shell-context"`.
- Context content has a meaningful accessible name and a visible close action.
- The context drawer closes on backdrop, Escape and route change.
- Focus returns to its trigger.
- `ModuleContextPanel` presentation (`inline` or `overlay`) must not change the
  ownership rules above.
- When open on mobile, `ModuleContextSidebar` and `ModuleContextPanel` occupy
  the full `SuiteCanvas` body as drawer surfaces instead of stacking below the
  module content. Their desktop width tokens do not constrain the mobile
  drawer width.
- The drawer layer is visual geometry only. `AppShell` still owns which context
  surface is active, backdrop and Escape dismissal, route cleanup and focus
  return. A context component must not create its own overlay manager.

### Mobile bottom navigation

- `MobileSuiteNav` is a navigation control, not an overlay controller.
- Selecting an item invokes the consumer-owned navigation action.
- The active destination uses `aria-current="page"`.
- Labels remain visible and distinct from Launchpad, suite drawer and context
  actions.
- If a product needs a drawer action in the bottom bar, it must be represented
  as an explicit item with an explicit accessible name and action contract.

## Accessibility and dismissal

Every mobile drawer trigger must provide:

- an accessible name;
- `aria-expanded` reflecting the Shell-owned state;
- `aria-controls` pointing at the controlled drawer;
- visible focus treatment;
- focus return after dismissal.

Every open drawer must support:

- Escape dismissal;
- backdrop dismissal;
- an explicit close control;
- route-change dismissal;
- no interaction with the obscured main content while the overlay is active.

The implementation must not rely on a visual backdrop alone to communicate
modal behavior. The chosen dialog/drawer semantics must be tested with keyboard
navigation and Axe.

## Responsive behavior

- At desktop breakpoints, the persistent Shell navigation owns its desktop
  geometry and mobile drawer controls are hidden.
- At mobile breakpoints, suite and context navigation use the Shell overlay
  contract and must not render duplicate desktop controls.
- Supported evidence must cover mobile and compact-mobile widths.
- A responsive representation may change layout, but it must preserve the
  distinction between Launchpad, suite navigation and module context.

## Ambiguous APIs

`onToggleRightSidebar` is not a target contract for mobile navigation. New
consumers must use explicit context open/close ownership and the reasoned close
callbacks (`backdrop`, `escape`, `route-change`). Existing uses are migration
candidates and must be removed or mapped during the implementation slice.

## Certification gates

The contract is ready for implementation when:

- one owner is identified for each open/closed state;
- AppShell tests cover overlay exclusivity, dismissal and focus return;
- accessible names, `aria-expanded` and `aria-controls` are verified;
- desktop, mobile and compact-mobile evidence confirms no duplicate or
  overlapping navigation controls;
- Axe passes for closed, suite-nav-open and module-context-open states;
- the CRM foundation track links the implementation and evidence.

## Non-goals

- Defining suite-specific routes or CRM permissions.
- Replacing `SuiteCanvas` or changing Shell geometry contracts.
- Making the Launchpad, suite drawer and module context visually identical.
- Adding a new overlay manager inside a suite or CRM module.
