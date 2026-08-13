---
name: registry-governance
description: "Use when creating, updating, reviewing, migrating, or validating LoopDev domain registry entries and generated catalogs."
---

# Registry Governance

Use this skill for changes to `docs/registries/` and any implementation work
that adds, changes, migrates, or deprecates a registered resource.

`component-development` owns the component creation workflow. This Skill owns
the registry record, identity, evidence, ownership, migration, and catalog
integrity after the component or resource decision exists.

## Mandatory pipeline

```text
Identify resource
  -> Select canonical domain registry
  -> Check stable identity and duplicates
  -> Verify ownership and category
  -> Map implementation, contracts, tests, and docs
  -> Record evidence gaps
  -> Update entry
  -> Generate catalog
  -> Validate
```

Do not create or edit a registry entry by guessing paths, status, ownership,
contracts, tests, or documentation.

## 1. Identify the resource

Confirm:

- stable resource name and kebab-case `id`;
- domain: `frontend`, `backend`, `infrastructure`, or `product`;
- resource type and category;
- intended owner;
- lifecycle status: `planned`, `experimental`, `stable`, or `deprecated`;
- whether this is a new resource, a variant, a migration, or a deprecation.

Never reuse an existing ID for a different resource. Never create a second
entry for the same responsibility.

## 2. Select the canonical registry

Use exactly one domain registry:

```text
docs/registries/frontend-components.json
docs/registries/backend-capabilities.json
docs/registries/infrastructure-capabilities.json
docs/registries/product-modules.json
```

Use `docs/registries/index.json` and the generated
`docs/registries/REGISTRY_CATALOG.md` for navigation only. Do not add
substantive resource rules to the index or catalog.

## 3. Check identity and duplicates

Search exact and normalized matches across all domain registries. Compare
responsibility, implementation, contracts, and consumers rather than names
alone. For frontend resources also inspect:

- exports and implementations;
- `component-development` reference and duplicate review;
- suite consumers;
- deprecated and archived source registries.

If two entries represent one responsibility, stop and resolve whether to
consolidate, alias during migration, or retain distinct contracts. Record the
decision in the active track.

## 4. Verify ownership and category

The `owner` must be a canonical LoopDev domain or owning team supported by
repository evidence. The `domain`, `type`, and `category` must describe the
resource itself, not the current developer or temporary branch.

Use the narrowest correct category. Do not classify a suite widget as a shared
frontend primitive merely because it renders UI.

## 5. Map repository evidence

Populate fields only from real evidence:

- `implementation`: existing implementation path or `null`;
- `contracts`: public types, schemas, or contract paths;
- `tests`: existing focused or registered validation paths;
- `documentation`: authoritative documentation paths;
- `dependencies`: stable registry IDs of required resources;
- `source_evidence`: implementation, tests, contracts, or docs supporting the
  entry;
- `source_registry` and `source_registry_original` during migration.

Unknown values are `null` or empty arrays. Do not infer evidence from a
filename, a planned name, or an unimplemented contract.

## 6. Record evidence gaps

Every entry must include `evidence_gaps` with only the applicable categories:

```json
["contracts", "tests", "documentation"]
```

An evidence gap is explicit incomplete work, not a reason to invent a
placeholder path. A resource may be `planned` or `experimental` while gaps
remain; `stable` or certified entries require the applicable gates to pass.

## 7. Update entries safely

Preserve stable IDs and source provenance. Update `last_updated` whenever
entries or schema mappings change. Keep domain-specific extensions without
changing the meaning of common fields defined in
`docs/registries/REGISTRY_SCHEMA.md`.

Review the complete entry and neighboring entries before writing. Avoid
unrelated reformatting or bulk reordering.

## 8. Generate and validate

Run the smallest relevant checks:

```bash
pnpm registries:generate
pnpm registries:check
pnpm docs:links:check
node scripts/tracks/validate-tracks.mjs
git diff --check
```

Use `pnpm docs:inventory:check` when registry documentation or lifecycle
classification changed. Run broader validation when a registry change affects
validation routing, package ownership, or CI.

## 9. Migration and deprecation

When migrating a legacy registry:

1. preserve source provenance;
2. map every source entry to one canonical destination;
3. preserve domain-specific fields;
4. validate unique IDs and required fields;
5. update active references;
6. archive the source only after consumers are migrated;
7. keep archived registries read-only.

When deprecating a resource, retain its entry with `status: "deprecated"` if
historical discoverability or migration requires it. Do not delete the entry
solely to hide an obsolete implementation.

## Non-negotiable rules

- One resource responsibility has one canonical registry entry.
- IDs are stable and never silently reused.
- Registry fields require repository evidence.
- Empty evidence is represented explicitly.
- Generated catalogs are never hand-edited.
- Archived source registries are read-only.
- Registry changes require track evidence when they alter ownership, scope,
  lifecycle, contracts, or migration behavior.
