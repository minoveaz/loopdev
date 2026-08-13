# LoopDev Registries

Registries are structured inventories of reusable LoopDev resources. They are
organized by domain, but share a common identity and lifecycle model.

## Registry layout

| Registry | Scope | Status |
| --- | --- | --- |
| [index.json](./index.json) | Registry catalog and entry point | Canonical |
| [frontend-components.json](./frontend-components.json) | Reusable frontend components and certification | Canonical |
| [backend-capabilities.json](./backend-capabilities.json) | Backend services, APIs, and contracts | Ready for future entries |
| [infrastructure-capabilities.json](./infrastructure-capabilities.json) | Infrastructure, security, and operational capabilities | Ready for future entries |
| [product-modules.json](./product-modules.json) | Product suites and functional modules | Ready for future entries |

The common entry contract is documented in
[REGISTRY_SCHEMA.md](./REGISTRY_SCHEMA.md).

The generated cross-domain view is
[REGISTRY_CATALOG.md](./REGISTRY_CATALOG.md). Run `pnpm registries:generate`
after changing a registry, or `pnpm registries:check` to verify that the
generated view is synchronized.

## Common model

Each domain registry uses:

- a stable `id`;
- a human-readable `name`;
- a `domain`;
- a lifecycle `status`;
- ownership and dependency metadata where applicable;
- links to contracts, implementation, tests, and documentation;
- certification data separated by responsible discipline.

Domain-specific fields may be added without duplicating an entry in another
registry. Cross-domain relationships belong in `index.json` or in explicit
dependency fields.

## Migration sources

The former registries are archived migration sources:

- `docs/archive/registries/2026-08-13/COMPONENT_REGISTRY.frontend.legacy.json`
- `docs/archive/registries/2026-08-13/COMPONENT_REGISTRY.operations.legacy.json`

They are migration sources only. New component entries must be added to
`frontend-components.json`.
