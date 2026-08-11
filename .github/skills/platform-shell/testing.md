# Shell Testing

## Local Commands

Use the filtered command during development:

```powershell
pnpm test:shell:changed
```

It detects staged, unstaged, and untracked changes against the Shell Interaction Surface. It skips the suite when no shell path changed.

Force the full shell validation before an important commit:

```powershell
pnpm test:shell
```

Before a pull request or update:

```powershell
pnpm validate:ci
```

## Shell Test Files

The focused surface currently includes:

- `SuiteSidebar/SuiteSidebar.test.tsx`
- `PlatformHeader/PlatformHeader.test.tsx`
- `GlobalContextPanel/GlobalContextPanel.test.tsx`
- `SidebarFooter/SidebarFooter.test.tsx`
- `TechnicalTooltip/TechnicalTooltip.test.tsx`

`NavSidebarItem` tests cover the lower-level navigation atom and should be updated when its rail, active, disabled, or tooltip contract changes.

## Required Assertions

When changing the shell, cover the relevant cases:

- expanded shows labels and groups;
- rail hides labels but preserves accessible names;
- hover starts as rail and expands on entry;
- hover does not move center content;
- leaving the sidebar collapses after the intended tolerance;
- the footer dropdown opens and remains stable across the Portal boundary;
- selecting a mode calls `onNavModeChange` with the expected value;
- hidden modules are not rendered;
- active navigation exposes `aria-current="page"`;
- controls expose accessible names and menu semantics;
- axe reports no accessibility violations.

## Browser-Level Coverage

Unit tests validate state and DOM contracts. Use Playwright for geometry and real pointer behavior:

- compare the center content bounding box before and during hover;
- verify the sidebar overlays instead of pushing content;
- move from the footer trigger into the Portal menu;
- verify the rail tooltip does not resize the host;
- test the desktop shell showcase at the supported desktop viewport.

Do not treat a screenshot update as proof of correct geometry. Assert dimensions and positions where the behavior matters.
