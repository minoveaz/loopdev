---
title: Content Engine UX Specification
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/147
---

# Content Engine UX Specification

## Purpose

Content Engine lets authorized teams draft, version, review and approve editorial content that uses
published Brand Hub context and authorized Asset Library references. It owns neither asset binaries,
campaign planning, communication transport nor channel publication.

This is a proposed definition and does not authorize product routes, persistence, AI execution or
external publishing.

## Navigation and Canvas

| Surface | Proposed route | Canvas recipe | Purpose |
| --- | --- | --- | --- |
| Content overview | `/marketing-studio/content` | `overview` | Show authorized drafts, review work and approved content. |
| Content list | `/marketing-studio/content/items` | `data` | Find, filter, sort and open content items. |
| List and preview | From content list | `split` | Review a version while retaining the collection context. |
| Content record | `/marketing-studio/content/items/:contentId` | `record` | Inspect version history, approvals, asset references and campaign links. |
| Editorial editor | `/marketing-studio/content/items/:contentId/versions/:versionId` | `focus` | Edit a draft version and submit it for review. |

The implementation uses `AppShell`, `SuiteShell`, `SuiteRuntime` and `SuiteCanvas`; organization and
workspace context come from Platform Core and brand context is published-only. Content Engine may not
introduce a parallel shell or persistent module navigation.

## Roles and actions

| Role | Actions |
| --- | --- |
| Admin | Read/manage authorized content policy and access through Platform Core. |
| Marketer or Content manager | Create/edit drafts, select approved assets, request review and manage authorized campaign links. |
| Creative | Contribute drafts and approved creative references when granted edit permission. |
| Reviewer | Read versions, approve, reject or request changes with a recorded reason. |
| Viewer | Read authorized approved content. |

## Workflow, states and journeys

The editorial lifecycle is `draft -> in_review -> changes_requested -> approved -> archived`.
Editing after approval creates a new draft and never silently changes the approved version. `scheduled`
and `published` are not Content Engine mutations; a future Publishing & Integrations contract may
report them as external delivery state.

All views include `loading`, `empty`, `error`, `forbidden`, `saving` and `success`. Desktop may use
`split` for list and review. Tablet collapses the preview/inspector. Mobile presents a single region
and requires confirmation for review decisions or archive.

1. A Content manager creates a draft under an authorized published brand context and attaches approved assets.
2. The editor saves an append-only content version and sends it to a Reviewer.
3. A Reviewer requests changes or approves the version with an audit reason.
4. A Campaign Orchestrator later links approved content by reference; it cannot alter content version text.

## Exclusions and approval criteria

- Content Engine does not publish, schedule, deliver email, manage social accounts or hold provider secrets.
- It does not own Creative Studio projects or Asset Library metadata/binaries.
- AI-assisted generation remains a proposed vertical capability and cannot bypass author, review,
  approval or audit controls.
- The UX is ready only when its lifecycle, contract, cross-module references and states are approved.
