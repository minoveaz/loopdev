# LoopDev Track Domains

Los dominios son el catálogo canónico para el campo `owner` y las carpetas de tracks activos y
planificados. Un track pertenece a un único dominio propietario; `areas` puede registrar dominios
adicionales afectados por su trabajo.

| Domain | Purpose |
| --- | --- |
| ai-platform | AI gateway, providers, model governance, document intelligence, and AI workers |
| crm | Sales CRM, communications, insurance pack, customer workflows, and commercial operations |
| marketing-studio | Brand Hub, assets, campaigns, content, publishing, and marketing integrations |
| mobile | Mobile applications, foundations, and mobile platform integration |
| platform | Tenancy, shared contracts, infrastructure, runtime, shared platform capabilities, and OS architecture |
| governance | Quality systems, engineering standards, workflow, certification, and repository governance |
| health | Health OS and regulated health workflows |
| quant | Quant Ops, trading infrastructure, market data, and execution |

## Adding a Domain

`/create-track` must first offer this catalog. When the user approves a new domain, the skill adds
one row to this file, validates its lowercase kebab-case slug, creates `tracks/planned/<domain>/`,
and uses the slug as the new track's `owner`. Domains are never created implicitly from free text.
