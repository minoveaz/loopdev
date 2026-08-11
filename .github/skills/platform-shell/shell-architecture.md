# Shell Architecture

## Composition

```text
AppShell
  +-- SuiteShell
      +-- PlatformHeader
      +-- SuiteSidebar
      |   +-- Suite Dashboard
      |   +-- navigation groups
      |   +-- SidebarFooter
      +-- suite center content
      +-- suite right content
      +-- GlobalContextPanel (when active)
```

## Ownership

### AppShell

Owns the platform-level layout contract, global navigation state, overlays, banners, and shell-wide context. It should not know the details of a suite's module list.

### SuiteShell

Composes the persistent platform header, suite navigation, and suite content slots. It forwards navigation, context, access, telemetry, and mode contracts to the shared shell primitives.

### PlatformHeader

Owns the global identity and header slots: identity, organization context, suite context, search, controls, primary actions, and profile. It is not a replacement for suite navigation.

### SuiteSidebar

Owns suite navigation presentation and behavior modes: `expanded`, `rail`, `hover`, and `hidden` where supported by the parent contract. It consumes `NavigationSchema`, `AccessMap`, `TelemetryMap`, and navigation callbacks.

### SidebarFooter

Owns the sidebar behavior selector. Its Radix dropdown is portalized, so the parent must keep the sidebar stable while the pointer crosses from the trigger to the menu.

### GlobalContextPanel

Owns global notifications, help, and assistant surfaces. It is an overlay/context surface, not suite content and not sidebar navigation.

### Theme providers and identity

`OrganizationThemeProvider` supplies organization-aware dynamic colors. `BrandLogo` represents LoopDev platform identity and must remain independent from tenant theming.

## Contracts

The primary contracts are in `packages/contracts/src/platform/navigation.ts` and the shell prop types beneath `ds/packages/ui/src/components/composites/shell/`.

A suite normally provides:

- `NavigationSchema`
- `navMode`
- `AccessMap`
- optional `TelemetryMap`
- optional `activeModuleId`
- `onNavigate`
- optional `onNavModeChange`

Do not make a suite reach into sidebar internal state. State that affects the global shell belongs at the shell owner; suite-specific content state belongs in the suite.
