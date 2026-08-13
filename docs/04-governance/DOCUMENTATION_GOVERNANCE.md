# Documentation Governance

This document defines the lifecycle and authority rules for LoopDev
documentation. It is the policy referenced by [docs/README.md](../README.md).

## Document states

| State | Meaning | Update policy |
| --- | --- | --- |
| **FROZEN** | Immutable strategic reference approved by the user. | Do not edit, move, or rename. Changes require an explicit unfreeze decision. |
| **CANONICAL** | Authoritative source for a technical, product, or governance topic. | Changes require review and updates to dependent references when contracts change. |
| **ACTIVE** | Current working guidance that evolves with implementation. | Update through the normal pull request process. |
| **NAVIGATION** | Index or hub that points to authoritative child documents. | Update when child paths, ownership, or status changes. |
| **HISTORICAL** | Point-in-time evidence or snapshot retained for traceability. | Read-only. Create a new dated snapshot instead of editing it. |
| **DEPRECATED** | Superseded document retained temporarily to support migration or historical lookup. | No new references or content. Remove after references are migrated. |
| **DUPLICATE** | Document whose authority or content overlaps another document. | Do not extend it. Resolve ownership before merging or removing it. |

Every document migration must assign exactly one state and one canonical
destination. A file can be both a navigation document and a link to canonical
documents, but it must not duplicate their substantive rules.

## Frozen strategic references

These files are frozen by explicit project direction:

- [LOOPDEV_PRODUCT_ARCHITECTURE_AND_ROADMAP.md](../architecture/LOOPDEV_PRODUCT_ARCHITECTURE_AND_ROADMAP.md)
- [LOOPDEV_PILOT.md](../architecture/LOOPDEV_PILOT.md)

They are the strategic reference for product direction and the pilot. Detailed
execution plans belong in the relevant files under `tracks/`.

## Authority by area

| Topic | Current authority |
| --- | --- |
| Product direction and pilot | Frozen documents under `docs/architecture/` |
| Architectural decisions | `docs/01-foundations/ARCHITECTURAL_DECISIONS.md` |
| Visual composition and tokens | `docs/01-foundations/VISUAL_COMPOSITION_SYSTEM.md` and the active token guidance in `docs/02-frontend/` |
| Frontend and design system | `docs/02-frontend/` |
| Platform, APIs, security, and tenancy | `docs/03-platform/` |
| Governance and certification | `docs/04-governance/` |
| Operations and engineering history | `docs/05-operations/` |
| Suite product documentation | `docs/06-product/` |
| AI skills and agent behavior | `docs/06-ai-skills/` |
| Delivery execution and phase status | `tracks/` |

Point-in-time quality and inventory evidence is archived under
[`docs/04-governance/audits/`](./audits/).

## Registry decision

Registries use a hybrid model: one canonical registry per domain, connected by
the [registry index](../registries/index.json). The canonical frontend registry
is [frontend-components.json](../registries/frontend-components.json).

It contains the 62 entries from the former operations catalog and the 9 entries
from the former frontend certification registry. Each migrated entry retains a
`source_registry` field and preserves domain-specific certification data.

The former files are preserved as historical migration sources:

- [frontend legacy registry](../archive/registries/2026-08-13/COMPONENT_REGISTRY.frontend.legacy.json)
- [operations legacy registry](../archive/registries/2026-08-13/COMPONENT_REGISTRY.operations.legacy.json)

New frontend entries must be added only to
[registries/frontend-components.json](../registries/frontend-components.json).
The backend, infrastructure, and product registries are initialized and ready
for future domains. Archived source registries are read-only and must not
receive new entries.

## Migration procedure

1. Inventory references before changing a path.
2. Assign the source state and the destination authority.
3. Preserve historical evidence when content is superseded.
4. Update links in `docs/`, `tracks/`, scripts, workflows, and archived
   provenance when a path changes.
5. Validate the changed references and review the diff.
6. Remove a deprecated source only after no active reference remains.

Historical `conductor/` references in tracks and frozen documents are retained
as provenance. No current guidance is published from `conductor/`.

## Ownership and review cadence

| Documentation area | Owner | Review cadence |
| --- | --- | --- |
| Frozen architecture and pilot | Governance with user approval | Only when explicitly unfrozen |
| Foundations and platform | Platform | Each architecture or contract change |
| Frontend and registries | Platform | Each component or design-system change |
| Product modules | Domain owner | Each roadmap or module-scope change |
| Governance and audits | Governance | Each policy change and quarterly audit |
| AI skills and agent guidance | AI Platform | Each skill or routing change |
| Navigation indexes and generated catalogs | Repository automation | Regenerated and checked in the same change |

## Required validation

Before merging documentation changes, run:

```bash
pnpm docs:links:check
pnpm registries:check
```

The CI validation flow runs both checks automatically.
