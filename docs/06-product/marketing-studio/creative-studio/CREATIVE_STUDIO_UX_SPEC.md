---
title: Creative Studio UX Specification
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/144
---

# Creative Studio UX Specification

## Purpose

Creative Studio coordinates creative projects, their append-only versions and format/channel variants.
It is the shared entry and context for specialized verticals, initially Image Studio and Video Studio.
It does not own brand identity, asset lifecycle, binary storage, content approval or publication.

This is a proposed definition. It does not authorize product routes, code or persistence.

## Navigation and Canvas

| Surface | Proposed route | Canvas recipe | Purpose |
| --- | --- | --- | --- |
| Studio overview | `/marketing-studio/creative` | `overview` | Resume accessible projects, active brand context and creation entry points. |
| Project list | `/marketing-studio/creative/projects` | `data` | Find, filter, sort and open authorized projects. |
| Project inspection | From project list | `split` | Inspect project/version/variant metadata without losing list context. |
| Project record | `/marketing-studio/creative/projects/:projectId` | `record` | View project history, variants, asset references and handoff to a vertical. |
| Studio workspace | `/marketing-studio/creative/projects/:projectId/:vertical` | `focus` | Mount the authorized Image Studio or Video Studio workspace. |

`AppShell`, `SuiteShell`, `SuiteRuntime` and `SuiteCanvas` are mandatory. Creative Studio declares
module context only; it cannot add a parallel header, sidebar or rail. Organization/workspace are
Platform context, active brand is optional module context, and vertical selection is a project
capability rather than a second persistent navigation system.

## Roles and journeys

| Role | Actions |
| --- | --- |
| Admin | Read and manage authorized projects, access and archive policy through Platform Core. |
| Brand manager | Create projects with published brand context and inspect progress. |
| Creative | Create/edit authorized project drafts, variants and vertical workspaces. |
| Reviewer | Inspect shared project state and approved outputs, without editor mutation rights. |
| Viewer | Read authorized project summaries and approved exports. |

1. A Creative chooses a published brand context and creates an Image or Video project draft.
2. The project opens a vertical workspace in `focus`; the vertical iterates freely inside its own
   documented boundary.
3. The vertical saves an append-only project version and associates authorized Asset Library
   references; it does not turn assets or renders into project-owned binaries.
4. A Reviewer inspects a project version and follows approved handoffs to Asset Library or Content
   Engine when those contracts are available.

## States, responsive behavior and exclusions

Every view has `loading`, `empty`, `error`, `forbidden` and `success`. No project opens an
unauthorized vertical or unpublished Brand Hub context. Desktop may retain list/inspector in `split`;
tablet collapses its inspector; mobile exposes one controlled region at a time.

Creative Studio does not prescribe Image Studio or Video Studio tools, timelines, canvases,
templates, AI assistance or rendering features. Those teams retain internal experimentation freedom,
subject to authorized project contracts, Platform Shell, tenancy, audit and Asset Library references.

## Approval criteria

- Project/version/variant language agrees with the Creative Studio contract.
- Image and Video workspaces use declared Canvas recipes, not custom shell structures.
- Brand context is published-only and assets remain external authorized references.
- Product Owner and Tech Lead approve the package before implementation.
