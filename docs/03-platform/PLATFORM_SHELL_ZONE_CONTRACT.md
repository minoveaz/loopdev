---
title: Platform shell zone contract
status: active-standard
owner: platform
reviewed_at: 2026-08-14
---

# Platform shell zone contract

This contract defines which zones belong to the LoopDev platform shell, which
zones are optional module capabilities, and how a mode or recipe consumes them.
It is the source of truth for shell showcases, suite composition and future
module implementation.

## Mandatory shell zones

Every suite experience must preserve these platform-owned zones:

```text
PlatformHeader
SuiteSidebar
PlatformContextPanel
SuiteCanvas
```

### PlatformHeader

Owns global platform context: organization or tenant, suite switcher, command
bar, notifications, help, assistant and user profile.

### SuiteSidebar

Owns suite navigation, active module state and shell navigation modes such as
expanded, rail and hover. A suite must configure this shared sidebar instead of
creating a parallel navigation primitive.

### PlatformContextPanel

Owns global contextual surfaces such as profile, notifications, help, assistant
and platform-level organization context. It is rendered through
`AppShell.contextSlot`; pages provide no fixed positioning, backdrop, z-index or
competing overlay manager.

### SuiteCanvas

Owns the primary module work area. It provides the structural canvas mode and
hosts the module composition or recipe.

## Optional module zones

A module or recipe may opt into these zones when its interaction model needs them:

```text
SuiteHeader
SuiteToolbar
ModuleContextSidebar
ModuleContextPanel
```

The presence of a zone is not implied by the mode name. The module declares its
usage and supplies the appropriate content.

### SuiteHeader

Use for module identity, breadcrumbs, status, primary action and contextual
module metadata.

### SuiteToolbar

Use for module-level search, filters, view controls, sorting and primary
workflow actions.

## SuiteRuntime composition contract

`SuiteRuntime` is the composition boundary for the complete suite page. It
resolves the active module, selects the declared shell zones and forwards the
effective props and React content slots to the shared shell components. Module
screens must not mount a second header, toolbar or context-zone manager beside
the runtime.

The declarative flow is:

```text
ModuleConfig.shell
  -> SuiteRuntime
  -> PlatformHeader / SuiteSidebar / SuiteCanvas
  -> ModuleHeader / ModuleToolbar / context zones
  -> module-owned renderers
```

`ModuleConfig` contains serializable structure such as `visible`, `rows`,
`showFooter`, `contentScrollable`, `width` and `presentation`. React nodes,
event callbacks and domain content remain runtime renderers or callbacks; they
must not be stored in the configuration contract.

`SuiteRuntime` supports module renderers for `ModuleHeader` and
`ModuleToolbar`. A renderer supplies the zone content for the active module,
while `ModuleConfig.shell.suiteHeader` and `suiteToolbar` control whether the
zone is enabled. Runtime visibility overrides take precedence over module
configuration, and module configuration takes precedence over component
defaults:

```text
explicit SuiteRuntime override
  -> active ModuleConfig.shell value
  -> component default
```

The same composition contract applies on desktop and mobile. Responsive CSS
may change visibility, stacking and available controls, but it must not change
the semantic owner of a zone or introduce a second source of state. `AppShell`
owns mobile navigation overlays, backdrop dismissal, Escape handling and route
cleanup. `ModuleHeader`, `ModuleToolbar`, `ModuleContextSidebar` and
`ModuleContextPanel` provide their content and affordances through the runtime
composition boundary.

Global profile, notifications, help and assistant panels follow the same rule:
their content is supplied through `AppShell.contextSlot`, while `AppShell`
owns the panel geometry, overlay priority, backdrop, Escape handling,
pointer-event isolation and responsive behavior. A page or showcase must not
mount a fixed `PlatformContextPanel` beside `SuiteRuntime`.

The runtime controls page composition, not domain implementation. Tables,
forms, filters and record workflows remain inside module renderers and their
own components.

## Visual governance and mode presets

`SuiteRuntime` is the only public composition boundary for a module page. A
page may select a `SuiteCanvas` mode and provide content renderers, but it may
not create a visual variant of a platform zone.

The platform owns the following invariants:

- semantic colors, surfaces, borders, typography, spacing and density;
- the anatomy and presence of zone headers;
- the required collapse/menu affordance of `ModuleContextSidebar`;
- the standard width token for each zone and canvas mode;
- desktop and mobile geometry, including full-canvas drawers;
- scroll ownership, overlay ownership, route cleanup and focus restoration.

Mode presets resolve these values centrally. For example, `split` enables the
certified sidebar and panel geometry when those zones are declared. The page
supplies the sidebar and panel contents, labels and functional visibility; it
does not supply arbitrary dimensions, colors or shell classes.

Existing structural props such as `width`, `headerRows`, `footerRows`,
`presentation` and `className` are compatibility inputs while consumers are
migrated. They are not a license for new pages: new compositions must use the
mode preset and semantic slots. These inputs are legacy exceptions and must be
removed from consumer code before a module is promoted beyond showcase status.

The following are platform violations:

```text
page -> arbitrary shell class, pixel width, background, border or header removal
page -> second overlay manager or second context trigger
page -> direct rendering of ModuleContextSidebar/ModuleContextPanel outside SuiteRuntime
```

The following are valid composition decisions:

```text
page -> mode = split
page -> context sidebar present/absent
page -> context panel present/absent
page -> domain content, labels, selection and actions
```

Any new visual variant requires a change in `@loopdev/ui`, a shared semantic
token or recipe, focused tests, and review as a platform change. It must not
be introduced through a page-local `className` or one-off structural prop.

### ModuleContextSidebar

Use for contextual navigation or selection context belonging to the active
module. It is not a second suite navigation system.

### ModuleContextPanel

Use for module-owned detail, inspector, record context or secondary actions.
It is distinct from the global `PlatformContextPanel`.

## Module context zones: normative contract

`ModuleContextSidebar` and `ModuleContextPanel` are independent module-owned
zones. They may be rendered together in a split workspace, but they must never
be treated as interchangeable:

```text
ModuleContextSidebar = navigate or select context
ModuleContextPanel   = inspect or act on the selected context
```

Both zones have the same physical anatomy:

```text
header   -> identity, local controls and optional navigation
content  -> module-owned content with independent vertical scrolling
footer   -> persistent contextual actions, when explicitly enabled
```

### Shared contract

Both components support the following structural props:

| Prop | Type | Default | Contract |
| --- | --- | --- | --- |
| `visible` | `boolean` | `true` | Removes the zone from visual layout when `false`; the parent owns whether the zone exists in the composition. |
| `label` | `string` | required | Accessible name and visible zone identity. It must describe the module context, not the platform or suite. |
| `headerRows` | `1 \| 2 \| 3` | `1` | Maximum number of header rows. The header must grow to fit its content and must not clip controls. |
| `showFooter` | `boolean` | `true` when footer content exists | Explicitly enables or disables the footer region. `false` must remove the footer from layout. |
| `footerRows` | `1 \| 2 \| 3` | `1` | Maximum number of footer rows. The footer must grow within the declared limit. |
| `contentScrollable` | `boolean` | `true` | Controls vertical scrolling of `content`. Horizontal overflow is not allowed by default. |
| `headerSlot` | `ReactNode` | none | Additional header content such as tabs or compact controls. |
| `footer` / `footerSlot` | `ReactNode` | none | Contextual actions or persistent status. It must not become a second global toolbar. |
| `width` | `narrow \| standard \| wide \| extra-wide` | component default | Stable responsive width token. Consumers do not use arbitrary widths. |
| `className` | `string` | `''` | Escape hatch for layout integration only; it must not replace semantic token styling. |

`children` is always the content region. A zone with `visible={false}` must not
leave an empty border, reserved width or invisible overlay behind.

### ModuleContextSidebar contract

The sidebar is the module's contextual navigation and selection surface. It may
contain entity trees, resource categories, contextual filters, saved views or a
selection list. It must not become suite navigation, a record inspector or a
duplicate of `ModuleToolbar`.

Its collapse control is mandatory. The sidebar always renders an accessible
menu/collapse icon together with its header; consumers may provide the icon
visual through `collapseIcon` and `expandIcon`, but may not disable or remove
the control. When collapsed, the control moves to the owning `SuiteSidebar`
through the shell's contextual action slot and remains available to restore the
sidebar.

Supported behavior:

```tsx
<ModuleContextSidebar
  visible
  label="Contact navigation"
  width="standard"
  headerRows={1}
  showFooter={false}
  contentScrollable
  defaultCollapsed={false}
  collapsedPresentation="rail"
  onCollapsedChange={setCollapsed}
>
  {/* contextual navigation or selection */}
</ModuleContextSidebar>
```

`collapsedPresentation` describes the visual result only:

- `rail`: retain a narrow rail and its restore control;
- `trigger`: render the restore trigger in the owning suite navigation;
- `drawer`: use a mobile drawer presentation coordinated by `AppShell`.

The sidebar does not own a competing overlay manager. Its open/closed state is
controlled by the shell boundary on mobile.

### ModuleContextPanel contract

The panel is the module's detail, inspector and secondary-action surface. It may
contain record details, metadata, validation results, relationships, history or
contextual actions for the current selection. It must not become a navigation
tree or a replacement for the module toolbar.

The header may contain tabs when the selected context has stable subviews. Tabs
must be supplied through `headerSlot`, remain keyboard accessible and preserve
the panel label as the accessible heading. Tabs are not a license to add a
second toolbar or unbounded header content.

```tsx
<ModuleContextPanel
  visible={isPanelOpen}
  label="Selected contact"
  width="wide"
  presentation="inline"
  headerRows={2}
  headerSlot={<ContactDetailTabs />}
  showFooter
  footerRows={1}
  footerSlot={<ContactActions />}
  onClose={closePanel}
>
  {/* detail and inspector content */}
</ModuleContextPanel>
```

`presentation` is explicit:

- `inline`: the panel participates in layout and compresses the canvas;
- `overlay`: the panel floats above the canvas and must have a close action,
  focus treatment and shell-owned dismissal behavior.

### Rows and overflow rules

- `headerRows` and `footerRows` are maximum layout contracts, not fixed heights.
- A row is a responsive layout line; content must wrap before it is clipped.
- `contentScrollable={true}` uses an independent vertical scroll region so the
  header and footer remain visible while content moves.
- Long labels, tabs and actions must use the design-system primitives and wrap,
  truncate or collapse deliberately; they must never create horizontal page
  overflow.
- Mobile may reduce visible controls, but it may not change the semantic owner
  of the content or create a second state manager.

### Primitive and accessibility rules

- Use `Button`, `IconButton`, `Input`, `Select`, `FilterDropdown`, `Icon`,
  `TechnicalStatusBadge` and other certified `@loopdev/ui` primitives.
- Use registered LoopDev icon names; no hand-drawn SVGs or Unicode symbols.
- Every icon-only control needs `aria-label` and a tooltip/title where useful.
- Every panel overlay needs an accessible name, close affordance, Escape and
  backdrop dismissal coordinated by `AppShell`.
- Footer actions must expose real callbacks. Placeholder actions are not
  rendered.
- Colors, borders, surfaces, focus and hover states use semantic tokens only.

### Anti-patterns

- Do not use `ModuleContextSidebar` as a second `SuiteSidebar`.
- Do not use `ModuleContextPanel` for search, filters or collection creation.
- Do not place a full `ModuleToolbar` inside either header or footer.
- Do not render a footer merely to fill space.
- Do not hide the mandatory sidebar collapse control.
- Do not allow tabs, footer actions or content to overflow horizontally.

## Mode consumption

The structural mode provides available layout semantics; it does not force all
optional zones to render. Typical consumption is:

| Mode or recipe | Mandatory shell | Optional zones commonly used |
| --- | --- | --- |
| Overview / `SuiteOverview` | Header, sidebar, platform context, canvas | SuiteHeader, SuiteToolbar |
| Data / `DataWorkspace` | Header, sidebar, platform context, canvas | SuiteHeader, SuiteToolbar |
| Workspace / `RecordWorkspace` | Header, sidebar, platform context, canvas | SuiteHeader, SuiteToolbar, ModuleContextPanel |
| Split / `SplitWorkspace` | Header, sidebar, platform context, canvas | SuiteHeader, SuiteToolbar, ModuleContextSidebar, ModuleContextPanel |
| Board / `BoardWorkspace` | Header, sidebar, platform context, canvas | SuiteHeader, SuiteToolbar |
| Full-bleed / `ImmersiveWorkflow` | Header, sidebar, platform context, canvas | None by default; module controls live in the canvas |
| Full-bleed / `CreativeEditor` | Header, sidebar, platform context, canvas | Editor-specific controls inside the canvas; context zones only when justified |

This table describes defaults, not an automatic rendering rule. A module may
choose fewer optional zones and must document why it needs more.

## Full-bleed rule

Full-bleed is a canvas treatment, not a reason to remove the mandatory shell.
The canvas may be an immersive, borderless surface with no `SuiteHeader`,
`SuiteToolbar`, `ModuleContextSidebar` or `ModuleContextPanel`. Editor controls
should belong to the composition canvas unless a separate context zone is
explicitly required.

## Suite Contextual Action

`Suite Contextual Action` is the standard pattern for opening a module-owned
context zone without leaving a second persistent rail. When a module context
sidebar is collapsed, the shell renders one action beneath `Suite Dashboard`
inside `SuiteSidebar`:

```text
expanded:  Suite Dashboard
           Open Media Library

rail:      dashboard icon
           context action icon
```

The action belongs to the active module, not to the global platform header. Its
declarative definition contains a functional label, a registered icon name and
an optional semantic tone:

```ts
contextualAction: {
  label: 'Open Media Library',
  icon: 'menu',
  tone: 'accent',
}
```

Use semantic token classes for `tone`; never hardcode yellow or another raw
color in the module. `accent` means available but not active; `primary` is the
active or hover treatment; `attention` is reserved for action requiring review.
The action opens the module context sidebar as a drawer or overlay according to
its declared collapsed presentation.

Use this pattern when the contextual zone is important and frequently opened,
but a permanent second rail would reduce canvas space. Do not use it for global
actions, actions already present in a toolbar, or duplicate module navigation.
The expanded label must be functional and semibold; the rail form must retain
an accessible name and tooltip even when only the icon is visible.

## Declarative module usage

A suite or module should declare optional zone usage through its shell composition
contract rather than relying on page-specific assumptions:

```ts
type ModuleShellUsage = {
  suiteHeader?: React.ReactNode;
  suiteToolbar?: React.ReactNode;
  moduleContextSidebar?: React.ReactNode;
  moduleContextPanel?: React.ReactNode;
  canvas: React.ReactNode;
};
```

The shell owns placement and interaction boundaries. The module owns the content
passed into optional zones.

## Showcase requirements

The shell showcase must:

- keep the six structural modes in their canonical order;
- expose mandatory shell zones in every mode;
- label optional zones only where the current mode or fixture actually consumes them;
- use mode-specific fixtures rather than reusing split controls everywhere;
- show full-bleed as an open canvas when no optional zones are selected;
- keep `PlatformContextPanel` distinct from `ModuleContextPanel`;
- preserve the existing shell contracts and navigation behavior.

## Ownership and review

- Platform owns the zone contract and placement boundaries.
- `@loopdev/ui` owns the shell and canvas primitives.
- Suites and modules own optional-zone content and usage declarations.
- Product tracks own evidence, exceptions and approval decisions.

Any new mandatory zone, new mode-level default or parallel shell primitive
requires a platform contract update and focused shell validation.
