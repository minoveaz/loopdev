---
name: component-development
description: 'Use when creating, changing, standardizing, registering, or promoting LoopDev UI components across the design system, shell, workspace, or product suites. Always coordinate with ui-ux-component-certification before promotion.'
---

# Component Development

Use this skill for every new or substantially changed LoopDev component. The
developer retains implementation freedom, but may not create a component
before proving that an existing component cannot be reused, extended, or
composed. Run `ui-ux-component-certification` alongside this workflow for the
UI/UX contract and do not promote until both certification gates pass.

## Mandatory pipeline

```text
Component Inventory
  -> Reference Component Discovery
  -> Duplicate Detection
  -> Component Design Audit
  -> Reuse / Compose Decision
  -> Route Classification
  -> Scaffold
  -> Implement
  -> Register
  -> Validate
  -> Re-audit implementation
  -> UI/UX certification gate
  -> Technical certification dimensions
  -> Promote only with evidence
```

Do not skip or silently combine stages. A failed reference discovery or
duplicate review blocks scaffolding.

The `Component Design Audit` stage is mandatory before implementation or
substantial visual restyling unless current certification evidence explicitly
covers the requested change. Use [component-design-audit.md](./component-design-audit.md)
to record current behavior, cross-platform and suite-specific contracts,
composition standards, UX behavior, decisions and showcase approval criteria.
The audit is a design gate: a failed visual review returns the work to the
decision record instead of authorizing ad hoc styling patches.

## Required workflow

### 1. Component Inventory

Before editing, collect:

- requested names and synonyms;
- user-facing purpose and states;
- existing registry entries;
- matching exports and implementations;
- similar components in every suite and in `@loopdev/ui`;
- likely consumers and the owning layer.

Read the relevant frontend authority before implementation:

- `docs/01-foundations/VISUAL_COMPOSITION_SYSTEM.md`;
- `docs/02-frontend/LOOPDEV_FRONTEND_CONSTITUTION.md`;
- `docs/02-frontend/COMPONENT_COMPOSITION_PROTOCOL.md`;
- `docs/04-governance/COMPONENT_LIFECYCLE.md`;
- `docs/registries/REGISTRY_SCHEMA.md`.
- [component-templates.md](./component-templates.md) for the minimum structure
  of each ownership layer.

For shell or workspace components, also use the `platform-shell` skill.
For validation selection, use the `validation-framework` skill.

### 2. Reference Component Discovery

Before scaffolding, inspect at least two relevant existing components whenever
the repository contains suitable references:

- one component from the same ownership layer or route;
- one component with the closest responsibility, interaction, or state model.

Read their implementation, `types.ts`, hooks when present, exports, tests, and
registry entries. Record the references in the active track and extract:

- folder and file structure;
- naming and public export conventions;
- composition and token usage;
- state and accessibility coverage;
- test and registry expectations.

Do not copy a reference blindly. Preserve its conventions unless the new
contract requires a documented divergence. If no suitable reference exists,
record that evidence gap and inspect the nearest lower-level primitives before
creating a new pattern.

### 3. Duplicate Detection

Search by exact name, normalized name, semantic purpose, visual role, and
interaction pattern. Check:

- `ds/packages/ui/src/components/**`;
- suite `components`, `shared`, `entities`, `features`, and `widgets`;
- package exports and barrel files;
- `docs/registries/frontend-components.json`;
- active tracks and component documentation.

Flag likely duplicates such as entity previews, quick-action groups,
assignment controls, state components, tables, timelines, and detail panels.
Do not treat a different domain noun as sufficient justification for a new
visual component.

### 4. Reuse / Compose Decision

Choose one outcome and record the reason:

1. reuse an existing component;
2. add a backwards-compatible variant;
3. compose existing primitives into a suite widget or feature;
4. create a new component only when the contract and responsibility are
   materially different.

Stop and request review when multiple candidates are equivalent or when the
requested component only changes labels, icons, colors, spacing, or domain
copy.

### 4.5 Component Design Audit

Complete the [component design audit](./component-design-audit.md) before
scaffolding or editing implementation. The audit must define the component's
cross-platform contract, suite boundaries, LoopDev composition pattern, token
roles, functional UX model, current/required/removed behavior and ordered
handoff. Include likely future consumers such as CRM, Marketing Studio and
Operations when they affect the public contract.

The reusable UI/UX contract must also live next to the actual component in
`UI_UX_SPEC.md` under the `ui-ux-component-certification` workflow. The active
track records initiative history and evidence; the registry remains an index.
Do not certify or promote a component when its adjacent UI/UX specification is
missing or stale.

Do not add the component to `composition-showcase` as a substitute for the
audit. Showcase rendering is a later approval gate and must review the shared
implementation through a declarative fixture.

Creation requires a duplicate-review record in the active track containing:
the candidates searched, reuse decision, rejected alternatives, intended
consumers, and owner.

### 5. Route Classification

Use the narrowest valid ownership layer:

| Layer            | Canonical route                                               | Rule                                     |
| ---------------- | ------------------------------------------------------------- | ---------------------------------------- |
| Shared atom      | `ds/packages/ui/src/components/atoms/<category>/<Name>/`      | Stateless, broadly reusable primitive    |
| Shared composite | `ds/packages/ui/src/components/composites/<category>/<Name>/` | Reusable composition without suite rules |
| Shell            | `ds/packages/ui/src/components/composites/shell/<Name>/`      | Global shell contract only               |
| Workspace        | `ds/packages/ui/src/components/composites/workspace/<Name>/`  | Generic canvas/workspace behavior        |
| Suite shared     | `<suite>/shared/<Name>/`                                      | Shared inside one application or suite   |
| Entity           | `<suite>/entities/<Entity>/`                                  | Entity representation and local state    |
| Feature          | `<suite>/features/<Feature>/`                                 | User action or business flow             |
| Widget           | `<suite>/widgets/<Widget>/`                                   | Page or section composition              |

Do not put suite business rules in `@loopdev/ui`. Do not put shell or
workspace primitives inside a suite. Do not create a parallel shell or
sidebar.

### 6. Scaffold

Only after the previous stages pass, create the smallest structure required by
the classified layer. Preserve repository conventions for `index.tsx`,
`types.ts`, hooks, fixtures, tests, and exports. Do not add speculative files
or a second abstraction layer.

If a component generator or template exists, use it. If it does not exist,
record the missing automation as an evidence gap instead of inventing a new
scaffolding convention.

The repository generator is intentionally safe by default:

```bash
pnpm component:new --name ExampleWidget --type widget --category crm --suite apps/loopdev-os/src/suites/crm
```

This performs inventory and route checks without writing files. Re-run with
`--write` only after reference discovery, duplicate review, and approval. An
existing target or registry candidate blocks generation.

Run `pnpm test:component-generator` when changing the generator. It must remain
safe against existing targets, accidental writes in dry-run mode, and paths
outside the repository.

### 7. Implement

Implement the approved contract using semantic tokens and existing primitives.
Cover applicable `loading`, `empty`, `error`, `forbidden`, `success`, disabled,
keyboard, responsive, and theme states. Keep business logic in the owning
feature/entity layer and preserve public contracts.

### 8. Register

Add or update the entry in
`docs/registries/frontend-components.json`. Include stable ID, owner, type,
category, dependencies, implementation, contracts, tests, documentation,
certification, and explicit evidence gaps.

Never register two IDs for the same responsibility. Keep a stable ID after
publication.

Registration is also the consumption gate. Before importing a shared
component into a new suite, CRM composition or new responsibility, verify its
entry in `docs/registries/frontend-components.json`, lifecycle status,
contextual certification and evidence gaps. A physical implementation that is
not registered is not an approved shared precedent. A registered but
uncertified, deprecated or evidence-blocked component may only be used by an
explicitly documented legacy exception with an owner and migration destination.

### 9. Validate

Run the narrowest checks that protect the changed risk:

- `pnpm validate:plan`;
- `pnpm validate:changed` or the applicable domain/experience validation;
- focused unit and accessibility tests;
- Playwright interaction and responsive checks;
- visual review as the final certification step, after every other validation;
- `pnpm contracts:ownership:check` for shared contracts;
- `pnpm registries:check`.
- `pnpm certification:source-contracts` for the global zero-hardcode contract.

The certification order is mandatory: contract and static checks, focused unit
and accessibility tests, ownership and registry checks, Playwright interaction
and responsive checks, then visual review last. A visual review must not be
reported as complete before the preceding checks pass.

Use `pnpm test:shell:changed` for shell changes and follow the
`platform-shell` skill's required checks.

### 9.5 UI/UX certification gate

Run `ui-ux-component-certification` alongside this workflow for every new or
substantially changed component. The technical workflow owns implementation
and evidence collection; the UI/UX workflow owns the experience contract and
design verdict.

Before a component can be marked certified, promoted or used as a new shared
precedent, the active track must contain both statuses:

```text
component-development: certified
ui-ux-component-certification: certified
```

The UI/UX status is `changes-requested` when hierarchy, interaction,
accessibility, responsive transformation, state behavior, theme portability or
visual composition fails. Technical tests cannot override that verdict. A
showcase screenshot or fixture cannot provide the UI/UX certification by
itself; evidence must reference the actual component implementation and its
consumer.

If either gate is `not-started`, `in-progress`, `ready-for-review`,
`changes-requested` or `expired`, promotion is blocked and the active track
must name the owning layer, concrete finding and unblock evidence.

### 9.6 Total technical certification

### 9.6.1 Source-contract certification

The source-contract gate is global and reusable; individual component tests
must not replace it with ad hoc regex guards. Before a component is promoted,
its implementation, public types and external fixture paths must be declared
in `scripts/certification/source-contract-manifest.json` and pass
`pnpm certification:source-contracts`. The implementation must not contain
domain data, default visible copy, fixture arrays, raw palette values, literal
z-indexes or inline visual styles. Existing certified components are migrated
through the same manifest and remain pending until audited.

UI/UX certification remains an independent gate. In addition, every component
being newly certified or promoted must declare the applicability and evidence
status of these five technical dimensions:

1. **Security and data integrity:** safe content rendering, sensitive-data and
  telemetry boundaries, permission presentation and backend authorization
  limits.
2. **Data flow and state ownership:** controlled/uncontrolled API, source of
  truth, normalization, mutation ownership, pending/rollback and concurrency
  behavior.
3. **Performance and runtime cost:** server/client boundary, dependency and
  bundle cost, rendering scale, virtualization/lazy loading and layout
  stability.
4. **Resilience and failure boundaries:** error, offline, retry, cancellation,
  stale-data and graceful-degradation behavior, with local isolation when
  the component risk requires it.
5. **Maintainability and testing contract:** typed API, focused tests,
  accessibility, responsive/visual evidence and explicit change-impact
  ownership.

Each dimension must be `passed`, `in-progress`, `changes-requested`,
`not-applicable` or `expired`; `not-applicable` requires a recorded reason.
The overall technical gate is `certified` only when the technical contract is
certified and every applicable dimension is `passed`. Existing registry
entries may retain their legacy certification shape until they are migrated,
but new promotion work must use this model.

### 10. Promote only with evidence

### 10. Re-audit implementation

After implementation and validation, rerun the component design audit against
the committed or reviewable diff. Compare every item in the concrete action
inventory with the resulting behavior:

- `keep`: confirm it was preserved and the stated evidence still applies;
- `correct` / `adapt`: confirm the requested contract change exists at the
  owning layer and did not create a parallel implementation;
- `remove`: confirm the old behavior is absent from code, exports, fixtures
  and registry metadata;
- `compose`: confirm responsibility moved to the declared primitive or
  consumer without duplicated styling or business logic;
- `defer`: confirm it remains bounded, documented and does not get presented
  as complete.

The re-audit must record unexpected changes, newly introduced debt, failed
acceptance criteria and any action that must return to implementation. A
component cannot be marked certified, promoted or used as a new shared
precedent until the re-audit passes. Passing tests alone does not pass this
gate.

### 11. Promote only with evidence

A suite component remains suite-owned by default. Promotion to
`@loopdev/ui` requires:

- a second real consumer outside the original suite;
- an agnostic public contract;
- no suite-specific business rules or naming;
- registry evidence for both consumers;
- tests covering the shared contract;
- track approval and validation evidence.

Never promote based on anticipated reuse alone.

## Non-negotiable rules

- Reuse before creation.
- One responsibility and one canonical route per component.
- Variants are preferred over near-duplicate components.
- Domain nouns do not justify duplicated UI.
- Shared components must remain organization-agnostic and suite-agnostic.
- Every new component needs a registry entry and evidence gaps.
- Do not claim certification or promotion without repository evidence.
- New shared or CRM consumption requires a registered component with applicable
  certification and no unresolved evidence gap for the requested behavior.
- Registration, certification and promotion are separate states; do not infer
  one from another.
