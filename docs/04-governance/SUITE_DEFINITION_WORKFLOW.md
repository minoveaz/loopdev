# Suite Definition Workflow

## Purpose

Use this workflow before implementing a new LoopDev suite. It defines the
product and platform boundary of a suite, composes the existing module
definition process, and creates an auditable implementation handoff.

A suite is a coherent product capability containing one or more modules. The
suite workflow decides the system-level boundary; the module-definition skill
then defines each module in detail.

## Required sequence

1. **Intent and users**
   - State the problem, target users, business value, and success signal.
2. **Domain boundary**
   - Define included responsibilities, exclusions, adjacent suites, and ownership.
3. **Module map**
   - List foundation, first vertical, future, and shared modules.
   - Record dependencies and recommended sequencing.
4. **Suite experience**
   - Define suite entry, navigation, global context, primary workspace, empty states,
     permission failures, and cross-module transitions.
5. **Contracts and security**
   - Define entities, tenancy boundary, permissions, integrations, events, ownership,
     audit needs, and data retention concerns.
6. **Component reuse**
   - Audit existing components, identify design-system gaps, and flag duplication risks.
7. **Module definition**
   - Run `.github/skills/module-definition/SKILL.md` for every committed module.
8. **Impact and readiness**
   - Record package, registry, migration, validation, operational, and security impact.
9. **Implementation handoff**
   - Define phases, acceptance criteria, evidence, risks, dependencies, and next action.
10. **Approval gate**
    - Complete the suite checklist before creating implementation tracks or code.

## Required artifacts

A suite definition package contains:

- Suite definition using `SUITE_DEFINITION_TEMPLATE.md`.
- One module-definition package for each initial module.
- Component audit for suite and modules.
- Contract and tenancy review.
- Impact assessment.
- Security and isolation review.
- Implementation handoff.
- Completed `SUITE_DEFINITION_APPROVAL_CHECKLIST.md`.

## CRM dry-run

CRM is the reference case for validating this workflow. The review must trace
existing CRM artifacts to the gates without rewriting CRM-specific decisions:

- CRM Contacts, Leads, Pipeline, Tasks, and Customer 360 provide module examples.
- CRM Pilot Readiness and Security and Isolation Matrix provide cross-suite gates.
- The CRM execution track provides sequencing, risks, dependencies, and handoff evidence.

The dry-run is successful when every required suite gate can point to existing
CRM evidence or is explicitly recorded as a gap. A gap is not silently accepted;
it becomes a decision, risk, dependency, or deferred scope item.

## Definition of Ready

A suite may move to implementation planning only when:

- Its scope and exclusions are approved.
- Initial modules and dependencies are identified.
- Navigation and global context are defined.
- Tenancy, permissions, contracts, and integration ownership are explicit.
- Reuse and design-system impact are assessed.
- Each initial module has a module-definition package.
- Security, validation, operational, and release impacts are recorded.
- The checklist is complete and the handoff names one next action.

## Change control

Changes to suite scope, ownership, contracts, sequencing, or readiness gates are
material decisions. Record them in the owning track and require explicit
approval before updating the implementation handoff.
