---
name: validation-framework
description: 'Use when choosing, explaining, reviewing, or running LoopDev validation checks for code, components, registries, and user experiences.'
---

# Validation Framework

Use the smallest validation scope that protects the risk changed. The plan is report-only: it explains what is selected and skipped, but never runs a test suite.

## Commands

| Command                                    | Use it when                                                                      | What it means to the business                                                                              |
| ------------------------------------------ | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `pnpm validate:plan`                       | Before deciding what to run, or in CI as the routing report                      | Shows which protections are selected, skipped, or escalated, with reasons                                  |
| `pnpm validate:worktree`                   | During implementation, before a local feedback loop                              | Uses only staged, unstaged, and untracked files; it does not inherit the branch diff or verify branch base |
| `pnpm validate:commit -- [revision]`       | A coherent commit is ready for review                                            | Uses only `HEAD` by default, or the specified revision; it does not verify branch base                     |
| `pnpm validate:branch`                     | Before committing to a PR or pushing an updated branch                           | Uses `origin/develop...HEAD` and confirms the branch contains current `origin/develop`                     |
| `pnpm validate:changed`                    | Existing automation or operator habits still use the legacy name                 | Stable compatibility alias for `pnpm validate:branch`                                                      |
| `pnpm validate:branch-base`                | Before committing to a PR or pushing an updated branch                           | Confirms the branch contains the current `origin/develop`                                                  |
| `pnpm validate:domain -- <domain>`         | A known domain changed and its local contract needs review                       | Verifies one area such as web, mobile, data, shell, or packages                                            |
| `pnpm validate:experience -- <experience>` | A user-facing flow, responsive layout, accessibility, or visual contract changed | Verifies the experience a user will actually encounter                                                     |
| `pnpm validate:full`                       | Merging to `develop` or `main`, releasing, or changing shared infrastructure     | Certifies the repository broadly; this is intentionally the slowest scope                                  |
| `pnpm validation:observations`             | Reviewing representative CI evidence during calibration                          | Summarizes duration, false skips, false runs, and duplicate risks without changing routing                 |

`validate:worktree`, `validate:commit`, `validate:branch`, `validate:domain`, and
`validate:experience` execute registered controls. Use `--dry-run` on the
underlying Node runner when reviewing scope without starting a suite.

## Component validation

Use this routing for changes governed by `component-development`:

| Changed surface                                       | Minimum validation                                                                 |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Shared atom or composite                              | `pnpm validate:changed`, focused unit/accessibility tests, `pnpm registries:check` |
| Suite entity, feature, or widget                      | `pnpm validate:changed`, focused tests, applicable `validate:domain`               |
| Responsive, visual, keyboard, or interaction contract | Add `pnpm validate:experience -- <experience>` and Playwright evidence             |
| Shell or workspace component                          | `pnpm test:shell:changed`, focused tests, and the `platform-shell` workflow        |
| Shared public contract or export                      | Add consumer validation and `pnpm contracts:ownership:check`                       |
| Component scaffolding generator                       | `pnpm test:component-generator` and `pnpm validate:changed`                        |

Component certification requires evidence for the applicable states,
accessibility, responsive behavior, registry entry, and track decision. Do not
claim promotion to `@loopdev/ui` from a passing unit test alone.

## Registry validation

Use this routing for changes governed by `registry-governance`:

| Registry change                       | Minimum validation                                                                      |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| Entry metadata or evidence            | `pnpm registries:check`, `pnpm docs:links:check`, `git diff --check`                    |
| New or changed implementation mapping | Add `pnpm validate:changed` and the affected domain validation                          |
| Schema or common-field change         | `pnpm registries:generate`, `pnpm registries:check`, `pnpm validate:full`               |
| Legacy registry migration             | Unique-ID and required-field checks, link validation, catalog check, and track evidence |
| Generated catalog change              | Regenerate with the repository command; never hand-edit; run the check afterward        |

Registry validation confirms structural integrity, not implementation
correctness. Pair it with component, domain, security, or experience validation
when the registered resource changes behavior.

## Reading A Plan

- **Selected protections** are the primary risks touched by the change.
- **Skipped protections** are visible decisions, not missing work. `not affected` is expected for a narrow change.
- **Full fallback** means shared configuration, workflows, dependencies, or an ambiguous path could affect any consumer.
- Every check must have one primary risk owner. Add a new check only when an existing check cannot protect that risk clearly.

## Scope Rules

1. Start with `validate:worktree` during implementation, `validate:commit` for a completed commit, or `validate:branch` before PR review.
2. Before a PR, fetch `origin/develop` and require it to be an ancestor of the branch. Branch, domain, experience, and full validation perform this preflight automatically; worktree and commit validation intentionally do not.
3. Run the narrowest applicable command from the registry.
4. Add consumer validation when a shared package contract changes.
5. Use experience validation for geometry, accessibility, and visual behavior; do not turn snapshots into a substitute for functional tests.
6. Use full certification for protected branches, releases, shared contracts, dependency changes, root configuration, workflows, or ambiguous changes.
7. For component and registry work, apply the smallest table entry above and
   escalate when ownership, consumers, schema, or scope is ambiguous.

When a check is skipped, the report must say which domain and layer were skipped and why. Do not hide skips by silently running an unrelated broad suite.
