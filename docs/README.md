# LoopDev Documentation

This directory is the project documentation source of truth. Every document must
have one clear authority, an explicit lifecycle state, and links to related
documents instead of copied content.

## Frozen strategic documents

The following documents are immutable reference documents. They must not be
moved, renamed, or edited as part of documentation cleanup:

- [LOOPDEV_PRODUCT_ARCHITECTURE_AND_ROADMAP.md](./architecture/LOOPDEV_PRODUCT_ARCHITECTURE_AND_ROADMAP.md)
- [LOOPDEV_PILOT.md](./architecture/LOOPDEV_PILOT.md)

Their status and change policy are defined in
[DOCUMENTATION_GOVERNANCE.md](./04-governance/DOCUMENTATION_GOVERNANCE.md).

## Documentation areas

| Area | Responsibility |
| --- | --- |
| [architecture/](./architecture/) | Frozen strategic references and architecture blueprints |
| [01-foundations/](./01-foundations/) | Architectural decisions, models, and foundational principles |
| [02-frontend/](./02-frontend/) | Frontend architecture, design system, SuiteShell/SuiteCanvas direction, and UI validation |
| [03-platform/](./03-platform/) | APIs, infrastructure, security, organization isolation, storage, and Git workflow |
| [04-governance/](./04-governance/) | Governance, certification, audits, and validation policies |
| [05-operations/](./05-operations/) | Operational runbooks, engineering logs, and execution commands |
| [06-product/](./06-product/) | Product and domain documentation organized by suite |
| [06-ai-skills/](./06-ai-skills/) | AI skills, agent instructions, routing, and skill contracts |
| [registries/](./registries/) | Domain registries and the global registry index |

Quant vault environment guidance is archived with the experimental Quant
documentation and is not an active operational runbook.

## Canonical documentation rules

1. Strategic direction comes from the frozen architecture documents.
2. Engineering plans and execution state belong in `tracks/`, not in a second
   roadmap under `docs/`.
3. A document may summarize another authority, but must link to it and must not
   silently fork its rules.
4. Dated audits and inventories are snapshots. They are not current-state
   authorities.
5. Before removing or merging a document, update all references and validate
   that no active track or automation depends on its path.

The canonical frontend component registry is
[registries/frontend-components.json](./registries/frontend-components.json).
The domain registry index is [registries/index.json](./registries/index.json).

The current shell composition is documented in
[02-frontend/SHELL_ARCHITECTURE.md](./02-frontend/SHELL_ARCHITECTURE.md).
`SuiteShell` and `SuiteCanvas` are the target public direction; `AppShell` and
`ModuleWorkspace` remain the implemented compatibility primitives until their
API migration is completed.

## Lifecycle states

The lifecycle states, ownership rules, and migration procedure are defined in
[DOCUMENTATION_GOVERNANCE.md](./04-governance/DOCUMENTATION_GOVERNANCE.md).

Documentation links and generated registries are validated with
`pnpm docs:links:check`, `pnpm docs:inventory:check`, and
`pnpm registries:check`.
