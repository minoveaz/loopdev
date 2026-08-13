---
name: suite-definition
description: 'Use when defining, reviewing, or preparing a new LoopDev product suite before implementation. Establishes suite boundaries, module map, UX, contracts, security, component reuse, impact, readiness, and implementation handoff.'
argument-hint: 'Define or review a LoopDev suite'
user-invocable: true
disable-model-invocation: false
---

# Suite Definition

Use this skill to define a product suite before implementation. A suite is a
coherent product capability containing one or more modules. This skill governs
the suite boundary and composes the module-level process in
`.github/skills/module-definition/SKILL.md`.

## Source documents

Read these documents before creating or reviewing a suite package:

- `docs/04-governance/SUITE_DEFINITION_WORKFLOW.md`
- `docs/04-governance/SUITE_DEFINITION_APPROVAL_CHECKLIST.md`
- `docs/04-governance/SUITE_DEFINITION_TEMPLATE.md`
- `.github/skills/module-definition/SKILL.md`
- The relevant track, architecture, security, and registry documents.

Use the CRM planning package as a precedent and evidence source, not as a
copyable template. Preserve CRM-specific decisions in CRM documentation.

## Before writing

1. Inspect `git status --short --branch` and preserve unrelated changes.
2. Resolve the owning domain, expected suite name, and current product context.
3. Identify adjacent suites, shared capabilities, existing modules, and open decisions.
4. Ask only questions that change scope, ownership, dependencies, contracts, risks,
   or approval criteria.
5. Confirm that the work is documentation-only until the approval gate passes.

## Required definition sequence

1. Define intent, target users, value, and success signal.
2. Define included and excluded domain responsibilities.
3. Identify adjacent suites and ownership boundaries.
4. Map initial, future, shared, and deferred modules.
5. Record module dependencies and recommended sequencing.
6. Define suite entry, navigation, global context, workspaces, and state transitions.
7. Define canonical entities, tenancy, permissions, events, integrations, ownership,
   audit, and retention concerns.
8. Audit component reuse, design-system gaps, and duplicate risks.
9. Invoke `module-definition` for every initial module.
10. Record package, registry, migration, validation, operational, and security impact.
11. Create the implementation handoff with phases, evidence, risks, and one next action.
12. Complete the suite approval checklist.

## Approval gate

Do not create implementation code or mark the suite ready until the checklist
is complete. Every unresolved item must be explicitly deferred with an approved
decision and a documented risk, dependency, or scope boundary.

The suite is ready only when:

- Scope and exclusions are approved.
- Initial modules and dependencies are named.
- Experience and navigation are defined.
- Contracts, tenancy, permissions, and integration ownership are explicit.
- Component reuse and implementation impact are assessed.
- Initial modules have complete module-definition packages.
- Security, validation, operations, and release impacts are recorded.
- The handoff names a concrete next action.
- User approval is recorded in the owning track.

## Validation

Run the narrowest applicable checks after editing:

```bash
node scripts/tracks/validate-tracks.mjs
node scripts/tracks/generate-tracks-index.mjs
node scripts/docs/check-markdown-links.mjs
```

Run the track validator again after regenerating the index. Review
`git diff --cached --check` before committing and keep generated dashboard
changes in the same documentation change.

## Change control

Treat changes to suite scope, ownership, contracts, sequencing, or readiness
gates as material decisions. Record them in the owning track and require
explicit user approval before changing the handoff or beginning implementation.

Never modify `docs/2026-execution-roadmap` as part of this workflow. It is a
protected durable roadmap branch and receives changes through its own governed
process.

## Output

When defining a suite, produce or update:

- The suite definition from `SUITE_DEFINITION_TEMPLATE.md`.
- The initial module-definition packages.
- Component, contract, impact, security, and readiness evidence.
- The owning track and generated track index.
- A concise handoff with the next action and unresolved risks.

When reviewing a suite, report missing gates, contradictory ownership, unapproved
scope changes, unresolved security or tenancy questions, missing evidence, and
implementation risks before suggesting corrections.
