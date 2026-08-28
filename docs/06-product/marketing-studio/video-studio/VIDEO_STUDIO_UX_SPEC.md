---
title: Video Studio UX Specification
status: proposed
version: 0.1
created: 2026-08-28
updated: 2026-08-28
owner: marketing-studio
program_track: tracks/planned/marketing-studio/2026-08-28-marketing-studio-module-definition.md
issue: https://github.com/minoveaz/loopdev/issues/146
---

# Video Studio UX Specification

## Purpose and evidence

Video Studio is the autonomous Creative Studio vertical for producing audiovisual assets quickly and
efficiently. VitaBlue provides functional evidence for stage/timeline editing, scenes, layers,
subtitles, audio, frame timing, transitions, safe zones, motion kit, Remotion compositions and
render jobs. Its exploratory development is already in progress in VitaBlue and may continue there
to validate new editing, motion and rendering workflows. LoopDev already provides tenant-aware
creative persistence and a declarative workspace composition that permits `VideoStage`, `Timeline`
and `TransportControls`.

This evidence is not a final implementation, provider choice or authorization to create routes,
render workers, migrations, external integrations or production rollout in LoopDev.

## Navigation and Canvas

| Surface | Proposed route | Canvas recipe | Purpose |
| --- | --- | --- | --- |
| Video project list | `/marketing-studio/creative/projects?vertical=video` | `data` | Find and create authorized video projects through Creative Studio. |
| Video project record | `/marketing-studio/creative/projects/:projectId` | `record` | Inspect versions, variants, asset references and render history. |
| Video editor | `/marketing-studio/creative/projects/:projectId/video` | `focus` | Compose scenes, timing and motion inside the Creative Studio vertical host. |
| Scene/timeline inspector | Declared contextual panel or dialog | `focus` | Edit selected scene context without creating a second persistent navigation rail. |
| Render result | From editor or record | `focus` | Request rendering, show queue/progress/failure and link an authorized Asset Library artifact. |

The implementation uses `AppShell`, `SuiteShell`, `SuiteRuntime`, `SuiteCanvas`, `PlatformHeader`,
`SuiteSidebar` and `PlatformContextPanel`. Stage, timeline and transport are declared workspace
components, not a replacement shell. Organization/workspace come from Platform context and brand
context is published-only.

## Roles, states and journeys

| Role | Actions |
| --- | --- |
| Creative | Create/edit drafts, compose scenes, manage authorized media references, save versions and request renders. |
| Brand manager | Read published brand context and review authorized outputs. |
| Reviewer | Inspect versions and renders, comment or decide permitted review states without editor mutation rights. |
| Viewer | Read authorized approved assets and render status. |

All surfaces define `loading`, `empty`, `error`, `forbidden`, `saving`, `queued`, `rendering`,
`failed`, `cancelled` and `success`. Desktop preserves stage and timeline geometry. Tablet uses
controlled overlays for inspectors. Mobile supports project selection, review, status and basic
actions; advanced timeline editing remains unavailable until its accessibility and interaction model
is certified.

1. A Creative opens an authorized video project with published brand and Asset Library context.
2. The vertical team iterates freely on scenes, layers, timing, subtitles, audio, transitions,
   templates and motion inside the project draft.
3. Autosave preserves the draft; explicit save creates an append-only Creative Studio version.
4. A render request is queued as a durable job. It produces a new Asset Library artifact only after
   success; failed/cancelled jobs never replace the editable video document.

## Autonomy and exclusions

Video Studio may evolve its timeline, stage, scene model, motion system, formats, templates,
subtitles, audio, AI-assisted workflows, render engine and optimization mechanisms without reopening
the suite definition. Cross-module review is required only for changes to shared contracts, tenant
or security boundaries, artifact lifecycle, job infrastructure, provider ownership or Shell contract.

It does not own Brand Hub identity, Asset Library binary lifecycle, platform workers, provider
secrets, channel publishing, content approval or Image Studio functionality. Browser state, public
URLs, base64 and `data:` URLs cannot become authoritative editor or media persistence.
