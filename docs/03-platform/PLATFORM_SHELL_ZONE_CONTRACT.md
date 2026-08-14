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

Owns global contextual surfaces such as notifications, help, assistant and
platform-level organization context. It is outside module content and may render
as an overlay or portal without changing the canvas layout.

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

### ModuleContextSidebar

Use for contextual navigation or selection context belonging to the active
module. It is not a second suite navigation system.

### ModuleContextPanel

Use for module-owned detail, inspector, record context or secondary actions.
It is distinct from the global `PlatformContextPanel`.

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
