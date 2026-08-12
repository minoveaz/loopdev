---
name: track-governance
description: "Use when creating, updating, reviewing, closing, migrating, or organizing LoopDev engineering tracks. Enforces the single-file template, phase governance, approved decision log, evidence, status transitions, generated dashboard, and explicit user approval before closure."
argument-hint: "Create, update, review, close, or migrate a track"
user-invocable: true
disable-model-invocation: false
---

# Track Governance

Use this skill for every LoopDev track operation. Tracks are the versioned system of record for
specification-driven development; they replace an external work-management dependency without
replacing engineering evidence, review, or Git discipline.

## Locations and lifecycle

- `tracks/planned/<domain>/`: approved specifications not yet being executed.
- `tracks/active/<domain>/`: tracks with an approved current phase and active execution.
- `tracks/closed/<year>/`: tracks explicitly approved for closure by the user.
- `tracks/README.md`: generated dashboard; never edit it manually.
- `tracks/domains.md`: canonical domain catalog and ownership vocabulary.
- [track template](./assets/track-template.md): required shape for every new track.

A track file uses `YYYY-MM-DD-slug.md`. `owner` is a required canonical domain, not a person;
`lead` is optional for individual accountability. The status and owner must match the directory.
The only valid statuses are `planned`, `active`, and `closed`.

## Procedures

### Create

1. Read the relevant product, architecture, and existing-track context.
2. Ask only for choices that change scope, ownership, dependencies, risks, or closure criteria.
3. Select a canonical owner from `tracks/domains.md`. If a new domain is needed, ask for approval,
   add it to the catalog, and create `tracks/planned/<domain>/`.
4. Create the track from [the template](./assets/track-template.md) in `tracks/planned/<domain>/`.
5. Record outcome, included/excluded scope, dependencies, initial phase, risks, validation, and
   decisions approved by the user.
6. Run `node scripts/tracks/validate-tracks.mjs` and `node scripts/tracks/generate-tracks-index.mjs`.

### Update

1. Read the full active track and inspect the implementation evidence relevant to its current phase.
2. Reconcile completed work, validation evidence, blockers, risks, and dependencies.
3. When an implementation change alters scope, architecture, contracts, sequencing, risk, or
   closure criteria, summarize the proposed decision and ask the user for approval before writing
   it to `Decisiones aprobadas` and `Registro de cambios de enfoque`.
4. Do not silently mark a phase complete. Add evidence and update its phase status.
5. When changing `status`, move the single file to its new lifecycle directory; never copy it.
   Confirm the previous path no longer exists and that its `id` occurs exactly once under `tracks/`.
6. Run `node scripts/tracks/validate-tracks.mjs`, then regenerate the dashboard and run the
   validator again.

### Review

1. Check metadata, directory/status agreement, mandatory sections, phase readiness, evidence,
   unapproved scope changes, unresolved blockers, dependencies, and closure criteria.
2. Report findings ordered by severity. A closed track with incomplete mandatory evidence is a
   finding, not a status to auto-correct.
3. Update the track only for factual corrections approved by the user.

### Close

1. Verify every closure criterion against evidence in the repository or CI.
2. Prepare a concise closure report listing validation, residual risks, deferred work, and any
   criteria that are not met.
3. Ask for explicit user approval. Never close based only on age, checkboxes, or an agent opinion.
4. After approval, set `status: closed`, add the closure approval/date, move the file to
   `tracks/closed/<year>/`, confirm the source path no longer exists and that the `id` is unique,
   then regenerate the dashboard and validate all tracks.

### End session

Use this procedure when the user asks to end a session. Do not require the track `id` when it can
be resolved from repository evidence.

1. Resolve exactly one active track, in this order: a declared `branch` or `branches` matching the
   current branch; changed files matching its `areas`; then an unambiguous active track named by the
   user's current work. If the evidence identifies zero or multiple tracks, report the candidates
   and ask the user to choose. Do not guess.
2. Read the full resolved track, inspect `git status --short --branch`, the diff summary, current
   `HEAD`, upstream, and relevant validation evidence.
3. Replace the track's `## Handoff de sesión` with the date, continuation branch, starting commit,
   state reached, decisions/blockers/risks, validation, and one next concrete action. Keep it short;
   it must not become a chat transcript.
4. Run the narrowest relevant validation and the track validator/dashboard generation.
5. If the current branch is `develop` or `main`, if unrelated changes or untracked files exist, or
   if validation fails, do not commit or push. Preserve the work, report the precise blocker, and
   never stage unrelated files.
6. Otherwise stage only the resolved track's implementation files, its handoff, and generated
   dashboard changes. Follow the `git-workflow` skill: review the staged diff, use a Conventional
   Commit message, run `git diff --cached --check`, commit, and push to the expected upstream.
   Create no PR, do not force-push, and do not rebase automatically.

### Resume track

Use this procedure when the user asks to resume or continue a track. Resolve the track using the
same evidence order as `End session`, with its handoff's `Rama de continuación` taking precedence
when present.

1. Read the full track and its latest `## Handoff de sesión` before changing files.
2. Run `git fetch --prune origin`. Inspect `git status --short --branch` and preserve any local
   work. Never discard, stash, reset, or overwrite it automatically.
3. If the continuation branch is absent locally and the worktree is clean, create it tracking its
   expected `origin/<branch>`. If it exists and the worktree is clean, switch to it as needed and
   synchronize with `git pull --ff-only`.
4. If the branch has no remote, has diverged, cannot fast-forward, or the worktree is not clean,
   stop before modifying Git state and report the exact condition and safe next choices.
5. Compare the remote `HEAD` with the handoff's starting commit, inspect new commits and relevant
   changed files, then summarize: restored branch, changes since handoff, current phase, blockers,
   and next action. Search indexed Copilot history by track id, branch, and commit only as optional
   supplemental context; Git and the track remain the durable source of truth.

### Handoff session

Use this procedure when the user needs to open a new chat window because the current conversation
is too large. Resolve the active track using the same evidence order as `End session`.

1. Read the track, inspect the current branch, `HEAD`, `git status --short --branch`, diff summary,
   relevant changed files, decisions, blockers, and validation run in the current work.
2. Replace `## Handoff de sesión` with the latest recoverable state: date, continuation branch,
   starting commit, state reached, decisions/blockers/risks, validation, and one next concrete
   action. Include the minimum set of relevant file paths when they materially help the next chat.
3. Do not stage, commit, push, pull, switch branches, generate the dashboard, or run broad
   validation solely for a handoff. Report a concise continuation message the user can paste into a
   new chat window.

### Resume session

Use this procedure when the user opens a new chat after `Handoff session`. Resolve the track using
the same evidence order, then reconstruct the richest useful context without replaying a full chat.

1. Read the full track and its latest `## Handoff de sesión`, then inspect the declared continuation
   branch, `HEAD`, `git status --short --branch`, and commits since the handoff's starting commit.
   Preserve all local changes.
2. Search indexed Copilot history for the track id, continuation branch, starting commit, and the
   handoff date. Use matching turns only to recover decisions, rejected alternatives, unresolved
   questions, and references not already represented in the track or Git.
3. Produce a compact session brief with: objective, confirmed state, changed files, decisions,
   blockers, validation, and the next action. Keep the brief actionable rather than reproducing a
   transcript. If no indexed history is available, state that clearly and continue from the durable
   handoff and Git evidence.
4. Do not fetch, pull, switch branches, stage, commit, push, or modify files unless the user asks
   for a separate Git or implementation action. Use `Resume track` for cross-device synchronization.

### Session health

Use this procedure when the user asks whether a conversation should move to a new chat window.
This is a complexity heuristic, not a token or context-window measurement.

1. Inspect the current conversation for observable signals: completed edit/validation cycles,
   distinct work slices, active tracks or domains, unresolved decisions, broad repository
   exploration, and whether a recent `Handoff de sesión` exists.
2. Classify the session as `low`, `medium`, or `high` complexity. Recommend `Handoff session`
   before the next broad exploration or unrelated implementation slice when complexity is high;
   recommend it as an option when complexity is medium; do not recommend it solely from elapsed
   time or message count.
3. Explain the signals behind the assessment and give one next action: continue, run
   `/handoff-session`, or finish with `/end-session`. Do not claim to know token consumption,
   context-window percentage, or Copilot UI state.
4. Do not modify tracks, Git state, files, staging, or the dashboard.

### Migrate legacy tracks

1. Inventory every legacy source and map it to one normalized single-file track.
2. Preserve historical `spec`, `plan`, `user stories`, and `index` content in the destination
   file under `Historial migrado`; do not discard source information.
3. Assign status only from an approved migration policy. Record migration provenance in metadata.
4. Delete legacy sources only after the normalized output and generated dashboard validate.

## Guardrails

- One track is one Markdown file; do not create `spec.md`, `plan.md`, or `userHistories.md` folders.
- A track `id` must occur in exactly one lifecycle path. A status transition is a move, never a copy.
- `## Handoff de sesión` is the durable bridge between working sessions. It records only the latest
   recoverable state and must not be used as a transcript or substitute for Git evidence.
- `Resume session` may enrich a handoff from indexed Copilot history, but it must summarize the
   relevant reasoning rather than replaying or depending on a complete conversation transcript.
- Before starting a broad repository exploration, an unrelated implementation slice, or another
   debugging loop, consider the observable session-complexity signals. When several completed
   edit/validation cycles, multiple work slices, or unresolved decisions have accumulated, suggest
   `/handoff-session` before proceeding. This is a recommendation, never an interruption or a
   claim about token usage.
- A phase has a goal, readiness, deliverables, validation, evidence, and status.
- Decision records require date, rationale, impact, and explicit user approval.
- `closed` requires explicit user confirmation regardless of checklist state.
- Use a canonical domain from `tracks/domains.md` as the required owner; use optional `lead` for
   an individual responsible for the current execution.
- Active tracks require `branch`. A program spanning multiple branches may instead use `branch:
   null`, declare `branches`, and contain a `## Branch strategy` justification.
- Keep generated dashboard changes in the same change as track metadata changes.
