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

### Total certification extension

New or migrated frontend entries may represent certification as a structured
technical profile while preserving the existing certification fields during
migration:

```json
{
	"certification": {
		"ui_ux": { "status": "certified", "evidence": [] },
		"technical": { "status": "certified", "evidence": [] },
		"security": { "applicability": "required", "status": "passed", "evidence": [] },
		"data_state": { "applicability": "required", "status": "passed", "evidence": [] },
		"performance": { "applicability": "required", "status": "passed", "evidence": [] },
		"resilience": { "applicability": "not-applicable", "status": "not-applicable", "evidence": [] },
		"maintainability_testing": { "applicability": "required", "status": "passed", "evidence": [] },
		"overall": "certified"
	}
}
```

The five technical dimensions are `security`, `data_state`, `performance`,
`resilience` and `maintainability_testing`. A required dimension must be
`passed` for `overall: certified`; `not-applicable` must include a reason in
the active track or component specification. This extension is additive: old
entries are not silently upgraded or marked certified without migration
evidence.

### Source-contract certification

Frontend components being newly certified or promoted must have an entry in
`scripts/certification/source-contract-manifest.json` and pass
`pnpm certification:source-contracts`. The gate inspects the actual
implementation and public types for domain data, default visible copy,
fixture arrays, raw palette values, literal z-indexes and inline visual styles.
Fixtures remain external and consumer-owned. Existing certified entries are
migrated through the same gate before their next certification or promotion.

## Frontend consumption policy

The canonical frontend registry is the source of truth for component
consumption approval. Registration alone means that an implementation is
known; it does not mean that the component is certified or approved for every
consumer.

For a new shared, suite or CRM consumer, the component must:

1. have a unique entry in `frontend-components.json`;
2. have `status: stable` or an explicitly approved `experimental` status;
3. have `certification` for the applicable surface and consumer context;
4. have no unresolved evidence gap that covers the requested behavior;
5. have an implementation, contract, documentation and validation evidence
	matching the entry.

An entry with `status: deprecated`, missing certification or relevant
`evidence_gaps` may remain in the registry for migration and provenance, but
must not be selected as a new shared precedent. Existing consumers may be
grandfathered only when the active track records the exception, owner and
migration destination.

Certification is contextual. A component certified for one consumer or
contract is not automatically certified for a new suite, state, interaction or
responsibility. A new consumer reopens the applicable audit and
post-implementation re-audit gates.

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
