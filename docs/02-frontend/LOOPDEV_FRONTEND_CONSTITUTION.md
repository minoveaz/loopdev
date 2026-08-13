# LoopDev Frontend Constitution

Short operational rules for daily frontend work. The design system and shell architecture documents remain the detailed sources of truth.

## Public visual API

- Use `Heading` for semantic page and section titles.
- Use `LpdText` for editorial content and `TechnicalText` for IDs, timestamps, statuses, and operational labels.
- Use `PageHeader`, `SectionHeader`, and `ContextBar` for shared orientation patterns.
- Use `Button` and `IconButton` for actions; every icon-only action needs an accessible name.
- Use `EmptyState` for completed requests with no content and `LoadingState` for in-flight requests.
- Use `ResponsiveTable` when tabular content needs a deliberate narrow-viewport scroll boundary.

## Tokens and themes

- Product code uses semantic tokens from `@loopdev/tokens` or the approved theme provider.
- Do not add HEX colors, arbitrary palette utilities, or inline typography in product code.
- Suite layouts must not force `dark` or `light`; theme ownership stays with the official provider.
- Every shared primitive must remain usable in light and dark themes.

## Composition

- Suite layouts compose the shared `SuiteShell` contract; until the migration lands,
  the implementation entry point is `AppShell`.
- Operational module layouts compose the shared `SuiteCanvas` contract directly; until
  the migration lands, the implementation entry point is `ModuleWorkspace`.
- `SuiteContentFrame` and other unregistered shell wrappers are not allowed.
- Business actions belong in the active module toolbar, not the global shell header.
- Providers may supply state but must not replace the canonical shell geometry.

## Quality gate

Run `pnpm front:check` before opening a pull request. It checks formatting, duplicate classes, contract ownership, frontend audit regressions, duplication, and unused exports. The audit baseline in `config/frontend-audit-baseline.json` may contain only reviewed exceptions; new findings block the gate.

The static gate does not certify browser behavior, accessibility with Axe, responsive viewports, themes, or visual snapshots. Those require the later certification phases.
