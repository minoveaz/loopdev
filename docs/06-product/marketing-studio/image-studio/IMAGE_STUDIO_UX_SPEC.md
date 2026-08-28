---
title: Image Studio UX Specification
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/145
---

# Image Studio UX Specification

## Purpose and evidence

Image Studio is the autonomous Creative Studio vertical for creating static visual assets quickly
and efficiently. VitaBlue demonstrates useful editor capabilities: canvas/Konva, layers, selection,
inspector, inline text editing, templates, blocks, brand kit, history, validation and export.
Its exploratory development is already in progress in VitaBlue and may continue there to validate
new tools and workflows. LoopDev already has a technical foundation for tenant-scoped creative
projects, autosave, versions, private asset references, dedupe, quotas and RLS in
`creative-studio-persistence`.

Neither source is a final Image Studio implementation or contract. This package is `proposed` and
does not authorize LoopDev routes, editor code, migration, provider integration or production rollout.

## Navigation and Canvas

| Surface | Proposed route | Canvas recipe | Purpose |
| --- | --- | --- |
| Image project list | `/marketing-studio/creative/projects?vertical=image` | `data` | Find and create authorized image projects through Creative Studio. |
| Image project record | `/marketing-studio/creative/projects/:projectId` | `record` | Inspect project versions, variants, approved assets and export history. |
| Image editor | `/marketing-studio/creative/projects/:projectId/image` | `focus` | Create and refine a project document inside the Creative Studio vertical host. |
| Asset/template selection | Declared contextual panel or dialog | `focus` | Select authorized assets, templates and published brand context without a second persistent sidebar. |
| Export result | From image editor | `focus` | Validate export intent, show progress/result and create an Asset Library artifact reference. |

`AppShell`, `SuiteShell`, `SuiteRuntime`, `SuiteCanvas`, `PlatformHeader`, `SuiteSidebar`,
`PlatformContextPanel` and `SuiteCanvas` remain mandatory. Image Studio may declare a contextual
action and optional panel through the Suite Sidebar contract; it cannot create a second navigation
rail or directly mutate shell layout.

## Roles, states and journeys

| Role | Actions |
| --- | --- |
| Creative | Create/edit drafts, choose templates and authorized assets, save versions and request exports. |
| Brand manager | Read published brand context and review authorized output. |
| Reviewer | Inspect output and record permitted review decisions without editing the canvas. |
| Viewer | Read authorized approved outputs. |

Every surface covers `loading`, `empty`, `error`, `forbidden`, `saving`, `processing` and `success`.
Desktop uses a stable editor canvas with controlled inspector/tool panels. Tablet prioritizes canvas
and moves secondary panels to overlays. Mobile supports project selection, review and simple actions;
advanced canvas editing may be explicitly unavailable until its interaction model is certified.

1. A Creative opens an authorized image project with published brand context and available assets.
2. The editor iterates on a draft document, using templates or tools chosen by the vertical team.
3. Autosave preserves the draft without producing a version per interaction; an explicit save creates
   an append-only Creative Studio version.
4. An export produces an Asset Library artifact reference with visible processing, failure and retry
   state. A render/export failure never replaces the editable project document.

## Autonomy and exclusions

Image Studio may evolve its canvas, layers, tools, templates, presets, AI-assisted workflows,
validation, formats and export mechanisms without reopening the suite definition. A proposed change
requires cross-module review only when it changes shared contracts, tenant/security boundaries,
Asset Library lifecycle, provider ownership or Platform Shell composition.

It does not own brand identity, binary asset lifecycle, shared provider secrets, channel publishing,
content approval or Video Studio timelines. It cannot use browser `localStorage`, `data:` URLs or
base64 as the authoritative project or asset source.
