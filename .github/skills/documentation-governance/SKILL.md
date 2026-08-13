---
name: documentation-governance
description: "Use when reviewing, classifying, consolidating, archiving, or validating LoopDev documentation and its active references."
---

# Documentation Governance

Use this skill for repository-wide documentation changes. It governs the
documentation corpus; `track-governance` governs the execution track that
records scope, decisions, phases, and evidence.

## Mandatory pipeline

```text
Inventory
  -> Classify
  -> Identify authority
  -> Detect duplication and conflicts
  -> Decide keep, update, consolidate, archive, or remove
  -> Migrate references
  -> Validate
  -> Record evidence
```

Do not archive or remove a document before its active references and historical
provenance have been reviewed.

## 1. Inventory

List all relevant files under `docs/`, including Markdown, JSON registries,
templates, generated catalogs, and archive provenance. Also inspect active
references in:

- `tracks/`;
- `.github/skills/`;
- `scripts/`;
- workflows and package commands.

Exclude archived content from current-authority decisions, but retain it when
checking provenance or broken references.

## 2. Classify lifecycle and ownership

Assign exactly one lifecycle state from
`docs/04-governance/DOCUMENTATION_GOVERNANCE.md`:

- `FROZEN`;
- `CANONICAL`;
- `ACTIVE`;
- `NAVIGATION`;
- `HISTORICAL`;
- `DEPRECATED`;
- `DUPLICATE`.

For every reviewed document, identify authority, owner, review cadence,
canonical destination, and action. Do not leave an unclassified document in a
current documentation area.

## 3. Identify authority

Resolve conflicts in this order:

1. frozen strategic documents;
2. approved architectural and platform authorities;
3. active repository Skills for operational behavior;
4. tracks for execution scope and evidence;
5. navigation, prompts, checklists, and historical snapshots.

A summary may link to an authority, but must not silently redefine it.

## 4. Detect duplication and conflicts

Search for:

- repeated rules, workflows, or checklists;
- contradictory terminology or route names;
- references to archived Skills or paths;
- legacy `tenant` terminology outside explicit compatibility notes;
- obsolete Storybook, branding, or shell guidance;
- multiple registries describing the same resource;
- prompts that claim authority already held by a Skill or track.

Distinguish intentional complementary documents from substantive duplicates.
Record concrete file pairs and the conflicting rule before taking action.

## 5. Decide the document action

Use one explicit action:

- **KEEP_AS_CANONICAL** — authoritative and current;
- **UPDATE_AND_ALIGN** — current purpose, stale references or rules;
- **CONSOLIDATE** — merge substantive content into one authority;
- **ARCHIVE** — historical, obsolete, or superseded with provenance preserved;
- **REMOVE** — duplicate or deprecated after all references migrate;
- **RETAIN** — historical evidence that must remain read-only;
- **NAVIGATE** — index only, with no copied rules.

Archive candidates require a replacement authority or an explicit statement
that the material is historical only.

## 6. Migrate references

Before moving or removing a file:

1. search `docs/`, `tracks/`, `.github/skills/`, `scripts/`, and workflows;
2. update active references to the replacement authority;
3. preserve historical references only where provenance requires them;
4. add an archive README or migration pointer when the archive is not
   self-explanatory;
5. confirm the old active path has no remaining consumers.

Never update generated inventories or catalogs manually; regenerate them with
their repository commands.

## 7. Validate

Run the narrowest applicable checks, normally:

```bash
pnpm docs:links:check
pnpm docs:inventory:generate
pnpm docs:inventory:check
pnpm registries:check
node scripts/tracks/validate-tracks.mjs
git diff --check
```

Run broader validation when documentation changes alter scripts, workflows,
registries, or operational contracts.

## 8. Record evidence

Record the review in the active track. Include:

- scope and date;
- files reviewed;
- authority and lifecycle decisions;
- duplicate/conflict findings;
- archived or consolidated paths;
- validation commands and results;
- residual risks and deferred work.

Documentation review does not close a track automatically. Track closure
requires the `track-governance` procedure and explicit user approval.

## Non-negotiable rules

- One current authority per rule.
- Do not copy substantive rules into navigation indexes.
- Do not modify frozen documents during cleanup.
- Do not archive without reference migration and provenance.
- Do not treat generated inventories as hand-authored authority.
- Do not turn historical evidence into current guidance.
- Do not create a Skill merely to duplicate a canonical document; Skills contain
  executable operational procedures and link to detailed documentation.
