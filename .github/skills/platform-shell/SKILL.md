---
name: platform-shell
description: 'Use when designing, composing, testing, or modifying the LoopDev platform shell, SuiteSidebar, SuiteShell, AppShell, PlatformHeader, GlobalContextPanel, shell navigation modes, tenant theming, or shell interaction tests.'
---

# Platform Shell

Use this skill when a task touches the global LoopDev OS shell or when composing a new product suite inside it.

## Start Here

Read the relevant reference before editing:

- [Shell architecture](./shell-architecture.md) for ownership and component boundaries.
- [Suite composition](./suite-composition.md) when adding or changing a suite navigation schema.
- [Interaction contracts](./interaction-contracts.md) when changing hover, rail, expanded, dropdown, tooltip, or overlay behavior.
- [Testing](./testing.md) before validating or changing shell behavior.

Keep the platform shell and module-specific suite content separate. A suite should configure the shared shell through contracts and schemas instead of replacing shell primitives.

## Required Workflow

1. Identify the owning layer: AppShell, SuiteShell, SuiteSidebar, PlatformHeader, GlobalContextPanel, or a shared atom.
2. Read the local implementation and its neighboring tests before editing.
3. Preserve the public contracts in `@loopdev/contracts` unless the task explicitly changes them.
4. Make the smallest composition or behavior change that satisfies the request.
5. Run `pnpm test:shell:changed` during development.
6. Run `pnpm test:shell` before an important commit.
7. Run `pnpm validate:ci` before opening or updating a pull request.

## Non-negotiable Rules

- Do not create a parallel sidebar inside a suite.
- Do not use CSS `:has` or a layout-width mutation to implement expand-on-hover.
- Expand-on-hover must overlay the center content and must not move it.
- Treat Radix Portal content as outside the sidebar DOM when reasoning about hover state.
- Keep LoopDev corporate identity separate from organization or tenant colors.
- Do not change responsive shell behavior in the desktop shell task; small-screen navigation has its own mode.
- Add or update focused tests when changing a shell contract.
