## Views and journeys

Proposed routes are `/marketing-studio/governance/policies` (`data`),
`/marketing-studio/governance/policies/:policyId` (`record`) and an authorized evaluation in `split`.
Admins propose/review marketing policy; Reviewers inspect evidence; Viewers see authorized outcomes.
Required policy inputs are scope, rule, enforcement intent and effective date; exceptions, expiry and
reason are optional until legal policy requires them. Negative journeys cover conflicting policy,
expired restriction, unauthorized evidence, enforcement failure and revoked access. Product, Security,
Platform and any required legal owner approve before activation.
---
title: Compliance and Governance UX Specification
status: proposed
version: 0.1
created: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/152
---

# Compliance and Governance UX Specification

This deferred module exposes marketing-specific policies, restrictions, approvals and audit evidence
inside `overview`, `data`, `record` and `split` Canvas recipes. Platform Core remains owner of base
authorization and audit infrastructure. The module cannot become a parallel permission system.
States cover `loading`, `empty`, `error`, `forbidden`, policy conflict and success.

Activation gate: approved ownership matrix, retention/rights policy, regulatory requirements,
Platform audit boundary, enforcement points and incident/rollback process.
