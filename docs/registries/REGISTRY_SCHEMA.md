# Registry Schema

All domain registries use the same identity and lifecycle concepts. Domain
registries may add fields, but they must not redefine the meaning of the common
fields.

## Registry document

Every registry document contains:

| Field | Required | Meaning |
| --- | --- | --- |
| `registry_version` | Yes | Version of the registry document schema |
| `domain` | Yes | Owning domain: `frontend`, `backend`, `infrastructure`, or `product` |
| `status` | Yes | Registry lifecycle: `canonical` or `ready` |
| `last_updated` | Yes | ISO date of the latest migration or approved update |
| `entries` | Yes | Array of domain resources |

## Common entry fields

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | Yes | Stable kebab-case identifier |
| `name` | Yes | Human-readable resource name |
| `domain` | Yes | Resource domain |
| `owner` | Yes | Owning team or canonical LoopDev domain |
| `type` | Yes | Resource kind within its domain |
| `category` | Yes | Functional classification |
| `status` | Yes | `planned`, `experimental`, `stable`, or `deprecated` |
| `phase` | No | Roadmap phase where the resource was introduced |
| `dependencies` | Yes | IDs of registry resources required by this resource |
| `contracts` | Yes | Paths or identifiers for public contracts |
| `implementation` | Yes | Implementation path or `null` when not yet mapped |
| `tests` | Yes | Paths or identifiers for validation coverage |
| `documentation` | Yes | Paths to authoritative documentation |
| `certification` | Yes | Domain-specific certification results |
| `evidence_gaps` | Yes | Missing evidence categories: `contracts`, `tests`, or `documentation` |
| `source_registry` | Yes during migration | Original source path used to create the entry |
| `source_registry_original` | No | Pre-archive source path retained for provenance |
| `source_evidence` | Yes for newly catalogued resources | Repository documents or implementation paths supporting the entry |

Unknown historical values must be represented as `null` or an empty array. They
must not be invented from filenames or inferred implementation paths.

An empty evidence array means that no repository evidence was found during the
migration. The `evidence_gaps` field makes that absence explicit; this track
does not create missing implementation documentation, contracts, or tests.

## Frontend entry extensions

Frontend entries may additionally contain:

- `suite`;
- `certified_version`;
- `compliance.blocks_0_compliance`;
- frontend and infrastructure certification fields.

The canonical frontend registry is
[frontend-components.json](./frontend-components.json). Future backend,
infrastructure, and product entries must use the common fields and add only
domain-specific extensions.

## Migration rules

1. Keep `id` stable after publication.
2. Do not reuse an ID for a different resource.
3. Preserve `source_registry` until the migration has been audited.
4. Add a new entry to the canonical domain registry, never to a legacy source.
5. Update `last_updated` whenever entries or schema mappings change.
