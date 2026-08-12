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

- `tracks/planned/`: approved specifications not yet being executed.
- `tracks/active/`: tracks with an approved current phase and active execution.
- `tracks/closed/`: tracks explicitly approved for closure by the user.
- `tracks/README.md`: generated dashboard; never edit it manually.
- [track template](./assets/track-template.md): required shape for every new track.

A track file uses `YYYY-MM-DD-slug.md` and has a `status` matching its directory. The only valid
statuses are `planned`, `active`, and `closed`.

## Procedures

### Create

1. Read the relevant product, architecture, and existing-track context.
2. Ask only for choices that change scope, ownership, dependencies, risks, or closure criteria.
3. Create the track from [the template](./assets/track-template.md) in `tracks/planned/`.
4. Record outcome, included/excluded scope, dependencies, initial phase, risks, validation, and
   decisions approved by the user.
5. Run `node scripts/tracks/validate-tracks.mjs` and `node scripts/tracks/generate-tracks-index.mjs`.

### Update

1. Read the full active track and inspect the implementation evidence relevant to its current phase.
2. Reconcile completed work, validation evidence, blockers, risks, and dependencies.
3. When an implementation change alters scope, architecture, contracts, sequencing, risk, or
   closure criteria, summarize the proposed decision and ask the user for approval before writing
   it to `Decisiones aprobadas` and `Registro de cambios de enfoque`.
4. Do not silently mark a phase complete. Add evidence and update its phase status.
5. Regenerate and validate the dashboard.

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
   `tracks/closed/`, regenerate the dashboard, and validate all tracks.

### Migrate legacy tracks

1. Inventory every legacy source and map it to one normalized single-file track.
2. Preserve historical `spec`, `plan`, `user stories`, and `index` content in the destination
   file under `Historial migrado`; do not discard source information.
3. Assign status only from an approved migration policy. Record migration provenance in metadata.
4. Delete legacy sources only after the normalized output and generated dashboard validate.

## Guardrails

- One track is one Markdown file; do not create `spec.md`, `plan.md`, or `userHistories.md` folders.
- A phase has a goal, readiness, deliverables, validation, evidence, and status.
- Decision records require date, rationale, impact, and explicit user approval.
- `closed` requires explicit user confirmation regardless of checklist state.
- Use area ownership (`platform`, `sales-crm`, `marketing`, `health`, `quant`, `mobile`, or
  `governance`) rather than an individual as the required owner.
- Keep generated dashboard changes in the same change as track metadata changes.
