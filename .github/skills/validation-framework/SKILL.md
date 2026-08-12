---
name: validation-framework
description: "Use when choosing, explaining, reviewing, or running LoopDev validation checks; covers validate:plan, changed, domain, experience, and full certification."
---

# Validation Framework

Use the smallest validation scope that protects the risk changed. The plan is report-only: it explains what is selected and skipped, but never runs a test suite.

## Commands

| Command | Use it when | What it means to the business |
| --- | --- | --- |
| `pnpm validate:plan` | Before deciding what to run, or in CI as the routing report | Shows which protections are selected, skipped, or escalated, with reasons |
| `pnpm validate:branch-base` | Before committing to a PR or pushing an updated branch | Confirms the branch contains the current `origin/develop` |
| `pnpm validate:changed` | A local change is ready for a fast feedback loop | Checks the directly affected surfaces and declared consumers |
| `pnpm validate:domain -- <domain>` | A known domain changed and its local contract needs review | Verifies one area such as web, mobile, data, shell, or packages |
| `pnpm validate:experience -- <experience>` | A user-facing flow, responsive layout, accessibility, or visual contract changed | Verifies the experience a user will actually encounter |
| `pnpm validate:full` | Merging to `develop` or `main`, releasing, or changing shared infrastructure | Certifies the repository broadly; this is intentionally the slowest scope |
| `pnpm validation:observations` | Reviewing representative CI evidence during calibration | Summarizes duration, false skips, false runs, and duplicate risks without changing routing |

`validate:changed`, `validate:domain`, and `validate:experience` execute registered controls. Use `--dry-run` on the underlying Node runner when reviewing scope without starting a suite.

## Reading A Plan

- **Selected protections** are the primary risks touched by the change.
- **Skipped protections** are visible decisions, not missing work. `not affected` is expected for a narrow change.
- **Full fallback** means shared configuration, workflows, dependencies, or an ambiguous path could affect any consumer.
- Every check must have one primary risk owner. Add a new check only when an existing check cannot protect that risk clearly.

## Scope Rules

1. Start with `validate:plan`.
2. Before a PR, fetch `origin/develop` and require it to be an ancestor of the branch. All local validation runners perform this preflight automatically.
3. Run the narrowest applicable command from the registry.
4. Add consumer validation when a shared package contract changes.
5. Use experience validation for geometry, accessibility, and visual behavior; do not turn snapshots into a substitute for functional tests.
6. Use full certification for protected branches, releases, shared contracts, dependency changes, root configuration, workflows, or ambiguous changes.

When a check is skipped, the report must say which domain and layer were skipped and why. Do not hide skips by silently running an unrelated broad suite.