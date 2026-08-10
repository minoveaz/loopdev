---
name: git-workflow
description: 'Use when creating, renaming, switching, committing, pushing branches, or opening and updating Pull Requests in the LoopDev repository. Validate branch names, Conventional Commits, PR titles, protected branches, scope, status, unrelated files, and required checks.'
argument-hint: 'Describe the Git operation to prepare or validate'
user-invocable: true
disable-model-invocation: false
---

# LoopDev Git Workflow

Use this workflow for every branch, commit, push, or Pull Request operation.

## Before creating or switching a branch

1. Run `git status --short --branch`.
2. Identify and preserve unrelated modified or untracked files.
3. Update `develop` from `origin/develop` when starting new work.
4. Create one branch per intention using one of:
   - `feature/<area>-<topic>` for product or architecture work with functional impact.
   - `fix/<area>-<topic>` for behavior or bug corrections.
   - `chore/<area>-<topic>` for tooling, governance, maintenance, or non-functional refactors.
   - `docs/<area>-<topic>` for documentation-only work.
   - `test/<area>-<topic>` for tests and validation infrastructure.
5. Use lowercase words separated by hyphens. Protected branches are `develop` and `main`.

## Before creating a commit

1. Check `git status`, `git diff --stat`, and the staged diff.
2. Keep unrelated files, generated artifacts, secrets, and other tracks out of the commit.
3. Run the narrowest relevant validation.
4. Use `type(scope): imperative description` with a lowercase scope.
5. Run `git diff --cached --check`.
6. Use `pnpm exec node scripts/validate-git-conventions.mjs` when validating locally.
7. Do not commit directly on `develop` or `main`.

## Before pushing

1. Confirm the branch is not `develop` or `main`.
2. Confirm the remote and upstream are expected.
3. Review `git log --oneline -5` and `git status --short --branch`.
4. Install hooks once per clone with `pnpm hooks:install`.
5. Let `pre-push` run its fast validation; do not bypass it without an explicit reason.

## Before opening or updating a Pull Request

1. Use `develop` as the base for normal work.
2. Use a title matching `type(scope): imperative description`.
3. Complete `.github/pull_request_template.md`.
4. Link the Issue with `Closes #<id>` or `Refs #<id>` when applicable.
5. Describe scope, validation, risks, contracts, migrations, RLS, secrets, and external integrations.
6. Run the required local checks for the affected surface.
7. Confirm CI is green and required review is present before merge.
8. Use squash merge for normal work.

## Shared validation

The canonical rules live in `docs/03-platform/GIT_WORKFLOW.md` and are implemented by `scripts/validate-git-conventions.mjs`. CI validates the source branch, PR title, and commits in every Pull Request. Local hooks provide earlier feedback but do not replace CI.
