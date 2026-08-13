---
name: component-development
description: "Use when creating, changing, standardizing, registering, or promoting LoopDev UI components across the design system, shell, workspace, or product suites."
---

# Component Development

Use this skill for every new or substantially changed LoopDev component. The
developer retains implementation freedom, but may not create a component
before proving that an existing component cannot be reused, extended, or
composed.

## Mandatory pipeline

```text
Component Inventory
  -> Reference Component Discovery
  -> Duplicate Detection
  -> Reuse / Compose Decision
  -> Route Classification
  -> Scaffold
  -> Implement
  -> Register
  -> Validate
  -> Promote only with evidence
```

Do not skip or silently combine stages. A failed reference discovery or
duplicate review blocks scaffolding.

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

Creation requires a duplicate-review record in the active track containing:
the candidates searched, reuse decision, rejected alternatives, intended
consumers, and owner.

### 5. Route Classification

Use the narrowest valid ownership layer:

| Layer | Canonical route | Rule |
| --- | --- | --- |
| Shared atom | `ds/packages/ui/src/components/atoms/<category>/<Name>/` | Stateless, broadly reusable primitive |
| Shared composite | `ds/packages/ui/src/components/composites/<category>/<Name>/` | Reusable composition without suite rules |
| Shell | `ds/packages/ui/src/components/composites/shell/<Name>/` | Global shell contract only |
| Workspace | `ds/packages/ui/src/components/composites/workspace/<Name>/` | Generic canvas/workspace behavior |
| Suite shared | `<suite>/shared/<Name>/` | Shared inside one application or suite |
| Entity | `<suite>/entities/<Entity>/` | Entity representation and local state |
| Feature | `<suite>/features/<Feature>/` | User action or business flow |
| Widget | `<suite>/widgets/<Widget>/` | Page or section composition |

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

### 9. Validate

Run the narrowest checks that protect the changed risk:

- `pnpm validate:plan`;
- `pnpm validate:changed` or the applicable domain/experience validation;
- focused unit and accessibility tests;
- Playwright for visual, responsive, or interaction behavior;
- `pnpm contracts:ownership:check` for shared contracts;
- `pnpm registries:check`.

Use `pnpm test:shell:changed` for shell changes and follow the
`platform-shell` skill's required checks.

### 10. Promote only with evidence

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
