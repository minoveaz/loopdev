---
name: module-definition
description: "Use when defining a new product module or suite block before implementation, including CRM Contacts, Leads, Pipeline, Tasks, Customer 360, Marketing Studio, or future domains. Creates and reviews the standardized UX specification, component audit, domain contract, impact assessment, and implementation handoff."
user-invocable: true
---

# Module Definition

Use this workflow before implementing any new product module or suite block. The goal is to produce
one repeatable definition package, not to start product code.

## Mandatory branch guard

This skill may be used to create or modify module-definition documentation only
on a dedicated documentation branch based on the current `develop`, normally:

```text
docs/<area>-<topic>
```

Before reading for implementation or creating any file, run:

```bash
git branch --show-current
```

If the result is not a `docs/*` branch, stop immediately and warn:

> Module Definition solo puede ejecutarse en una rama documental `docs/*`. No se creara ni modificara documentacion en la rama actual.

Do not create, edit, move, delete, stage or commit module-definition documentation when this guard
fails. Do not switch branches automatically; ask the user to switch to a dedicated documentation
branch and then rerun the workflow. This guard applies to all five module documents, related
README/index updates, track references and module-definition evidence created by this skill.

The branch check must be repeated before the first edit if the workflow has involved any branch or
Git operation, and a failed check always takes precedence over the rest of this skill.

## When to use

Use for phrases such as:

- define a CRM module;
- prepare Contacts, Leads, Pipeline, Tasks, or Customer 360;
- define a Marketing Studio block;
- prepare a module for another implementation team;
- create UX, component, contract, impact, or handoff documentation.

Do not use for a bug fix, a small UI adjustment, or implementation after the handoff is already
approved.

## Required inputs

Before creating the package, identify:

- Product suite and module name.
- Parent program track and delivery Issue.
- Product outcome and in/out scope.
- User roles and permissions.
- Routes, views, Canvas modes, journeys and platforms.
- Domain entities, commands, queries and errors.
- Tenant, workspace, brand and ownership scope.
- Provider, AI, billing, storage and data sensitivity impact.
- Dependencies, risks, evidence and rollback expectations.

If a required decision is unknown, record it as pending; do not silently invent it.

## Standard package

Every module definition creates the same five documents under:

```text
docs/06-product/<suite>/<module>/
```

Required files:

```text
<module>_UX_SPEC.md
<module>_COMPONENT_AUDIT.md
<module>_CONTRACT.md
<module>_IMPACT_ASSESSMENT.md
<module>_IMPLEMENTATION_HANDOFF.md
```

Use lowercase kebab-case for the directory and stable uppercase filenames matching the module.
Small modules may share one UX or component audit only when the track explicitly records why; the
contract, impact assessment and handoff remain unambiguous.

## Document requirements

### 1. UX specification

Must define:

- Navigation and routes.
- SuiteRuntime/SuiteCanvas mode per view.
- Roles and visible actions.
- Required, optional, hidden and configurable fields.
- Loading, empty, error, forbidden and success states.
- Desktop, tablet and mobile behavior.
- Primary and negative user journeys.
- Explicit exclusions.
- Approval criteria and approver.

### 2. Component audit

Must classify each surface as:

- Reuse from `@loopdev/ui`.
- Compose inside the suite widget.
- Implement as a module feature.
- Implement as a domain entity.
- Promote to shared only with a second real consumer.

It must preserve this boundary:

```text
App Router -> SuiteRuntime/SuiteCanvas -> widgets -> features -> entities -> shared
```

Canvas and shell never contain business rules, repositories or domain mutations.

### 3. Domain contract

Must define:

- Read models and input models.
- Commands and queries.
- Pagination, filtering and ordering.
- Stable error codes and response envelopes.
- Permissions and tenant scope.
- Idempotency and concurrency where applicable.
- Deduplication, merge or lifecycle rules where applicable.
- Public API and compatibility expectations.

### 4. Impact assessment

Must explicitly classify:

```text
Contracts: none | planned | required
Schema: none | planned | required
RLS: none | planned | required
Storage: none | planned | required
Secrets/providers: none | planned | required
AI: none | planned | required
Billing/entitlements: none | planned | required
Observability: none | planned | required
Rollout/rollback: none | planned | required
```

It must list dependencies, migrations, data sensitivity, tests, environments, rollback and no-go
conditions.

### 5. Implementation handoff

Must tell the implementation team:

- Which documents to read first.
- Which branch to create from updated `develop`.
- Which GitHub repository and delivery Issue represent the module.
- Which GitHub Project contains the task and how to set its `Gate`, `Prioridad`, `Carril`, `Estado`,
    `Track`, `Bloqueado por` and `Evidencia` fields.
- The branch is linked through commits and the Pull Request, not through a manually maintained
    branch field: commits include `(#<issue>)` and the PR uses `Closes #<issue>`.
- What outcome to implement.
- What is explicitly out of scope.
- Which shell and FSD composition is mandatory.
- Definition of Ready before the first code commit.
- Required evidence, validation and PR links.

The handoff must state that the implementation team confirms readiness in the delivery Issue before
creating its branch.

## Lifecycle

1. Create the parent module Issue and program/delivery track reference.
2. Write the five documents as `proposed`.
3. Review UX and component composition.
4. Review contract and impact assessment.
5. Obtain explicit Product Owner/Tech Lead approval.
6. Update documents to `approved` with approver and date.
7. Create or update the GitHub Project item with the task title, Issue URL, implementation branch,
   gate, priority, lane, dependencies and evidence link.
8. Create the handoff and implementation branch instruction.
9. Move the Issue/Project item to `Ready`; do not set `In progress` until implementation starts.
10. After implementation, use the readiness review before tests/UAT.

## Issue, branch, commit and PR convention

For implementation Issue `<issue-number>`:

```text
branch: feature/<suite>-<module>-implementation
commit: feat(<module>): implement <slice> (#<issue-number>)
pull request body: Closes #<issue-number>
```

The Issue is created before the branch. The first implementation commit changes the Project item
from `Ready` to `En curso`. The PR is the durable evidence connecting Issue, branch, commits, review,
checks and changed files. After merge, GitHub closes the Issue when `Closes #<issue-number>` is
recognized and the Project item moves to `Hecho` after evidence is confirmed.

## Validation checklist

- [ ] All five documents exist under the module directory.
- [ ] References use the module directory, not a root-level legacy path.
- [ ] UX, components, contract and impact assessment agree.
- [ ] Scope does not silently include another module or deferred capability.
- [ ] Shell/FSD boundaries are explicit.
- [ ] Risks, dependencies, observability and rollback are declared.
- [ ] Approval metadata is present before implementation handoff.
- [ ] The delivery Issue links the full package.
- [ ] The handoff names the implementation branch.
- [ ] The GitHub Project item links the Issue, track, gate, priority, lane and evidence; branch
    identity is supplied by the linked PR and commits.
- [ ] Commits include `(#<issue-number>)` and the PR includes `Closes #<issue-number>`.
- [ ] The Project state is `Ready` before implementation and `En curso` only after the first code commit.
- [ ] No unrelated files are staged.

## Output

Report:

- Package directory and five files.
- Pending decisions.
- Approved decisions and approver.
- Delivery Issue and branch instruction.
- Dependencies and no-go conditions.
- Validation performed.
