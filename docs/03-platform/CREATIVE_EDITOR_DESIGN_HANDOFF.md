---
title: Creative Editor design handoff
status: active-handoff
owner: platform
reviewed_at: 2026-08-14
---

# Creative Editor design handoff

This document is the starting point for the design team implementing a
Canva-like social video editor inside LoopDev. It describes the platform
composition contract, not the editor's domain feature set.

## 1. Start here

Read these authorities in order:

1. [Platform Shell mode inventory](./PLATFORM_SHELL_MODE_INVENTORY.md)
2. [SaaS visual recipes](./SAAS_VISUAL_RECIPES.md)
3. [SaaS configurable composition contract](./SAAS_COMPOSITION_CONTRACT.md)
4. [SaaS reference compositions](./SAAS_REFERENCE_COMPOSITIONS.md)
5. [ModuleHeader implementation](../../ds/packages/ui/src/components/composites/workspace/ModuleHeader/index.tsx)
6. [ModuleContextSidebar implementation](../../ds/packages/ui/src/components/composites/shell/ModuleContextSidebar/index.tsx)
7. [CreativeEditor fixture](../../ds/packages/ui/src/components/composites/workspace/CompositionGrid/fixtures.ts)

Do not create a second platform header, suite sidebar or custom shell.

## 2. Required shell hierarchy

The editor is rendered inside the existing shared shell:

```text
PlatformHeader
└── SuiteShell
    ├── SuiteSidebar
    └── SuiteCanvas(mode="full-bleed")
        ├── ModuleHeader
        └── CreativeEditor workspace
            ├── ModuleContextSidebar (asset browser)
            ├── VideoStage
            ├── TransportControls
            ├── Timeline
            └── InspectorPanel (optional)
```

### Ownership

- `PlatformHeader`: LoopDev identity, tenant, global search, help,
  notifications and account.
- `SuiteSidebar`: suite navigation and module access.
- `ModuleHeader`: project breadcrumbs, save/status state and editor-local
  actions such as preview, share and export.
- `ModuleContextSidebar`: asset categories and asset browser; it is contextual
  to the editor and must not replace `SuiteSidebar`.
- `VideoStage`: preview/editing canvas.
- `TransportControls`: play, pause, current time and duration.
- `Timeline`: tracks, clips, audio, markers and selection.
- `InspectorPanel`: selected-element properties; optional and collapsible.

## 3. Composition contract

Use:

```text
Recipe: CreativeEditor
Canvas mode: full-bleed
Grid: 12 columns
Gap: md
```

The current neutral fixture declares:

| Region | Component | Desktop span | Purpose |
| --- | --- | ---: | --- |
| `header` | `ModuleHeader` | 12 | Project context and local actions |
| `asset-sidebar` | `ModuleContextSidebar` | 2 | Templates, elements, text, uploads, audio |
| `stage` | `VideoStage` | 10 | Main video preview/editing surface |
| `transport` | `TransportControls` | 10 | Playback and time controls |
| `timeline` | `Timeline` | 10 | Tracks, clips, audio and markers |
| `inspector` | `InspectorPanel` | 2 | Selected element properties |

The fixture is a structural reference. Replace placeholder domain components
with the editor team's real components only after their contracts are defined.

## 4. Recommended desktop layout

```text
┌─────────────────────────────────────────────────────────┐
│ ModuleHeader                                            │
├───────────┬─────────────────────────────────────────────┤
│ Assets    │ VideoStage                                  │
│           │                                             │
│           │                                             │
├───────────┴─────────────────────────────────────────────┤
│ TransportControls                                       │
├─────────────────────────────────────────────────────────┤
│ Timeline                                                │
└─────────────────────────────────────────────────────────┘
```

When an inspector is open, it may occupy a bounded context region. It must not
change the global sidebar width or move the Platform Shell.

## 5. Asset sidebar behavior

- Opens from the editor's module context, not from `SuiteSidebar`.
- Categories may include templates, elements, text, brand, uploads, audio,
  video, photos, shapes, graphics and subtitles.
- Category selection replaces the panel content without changing the shell.
- Desktop: bounded sidebar inside the editor workspace.
- Tablet: collapsible drawer or overlay with explicit close/focus behavior.
- Mobile: full-screen drawer; never rely on hover.
- Dragging an asset into the stage/timeline must have a keyboard alternative.

## 6. ModuleHeader usage

Use the existing `ModuleHeader` API:

- `segments`: project and editor breadcrumbs;
- `statusLabel`: saved, saving, unsaved or export status;
- `statusSeverity`: semantic status treatment;
- `sidebarToggle`: asset sidebar open/close;
- `rightSlot`: preview, undo/redo, share, export and project actions.

Do not place tenant/global actions in `rightSlot`. Do not duplicate
`PlatformHeader` actions.

## 7. Visual language

- Use the shared `canvas`, `surface`, `elevated` and `overlay` taxonomy.
- Keep the stage visually dominant and the timeline clearly bounded.
- Use `plain` or `immersive` background according to editor density.
- Technical grids are optional orientation aids, never content.
- Use tokenized spacing and borders; do not use arbitrary pixel coordinates.
- Preserve LoopDev identity; editor or tenant accents are bounded to approved
  accent tokens.
- Selection, playback, unsaved state and errors must not rely on color alone.

## 8. Required states

Design and implement explicit states for:

- loading project;
- empty project/new project;
- unsaved changes;
- autosaving/saved/save error;
- media upload progress and failure;
- unsupported media;
- missing asset;
- offline/stale project;
- read-only project;
- forbidden project;
- export queued, processing, complete and failed;
- no selection in inspector;
- timeline with no clips.

## 9. Interaction and accessibility

- `Escape` closes the inspector, asset drawer or active overlay in priority
  order.
- Focus returns to the triggering control after closing contextual panels.
- Keyboard users can reach stage, transport, timeline and all actions.
- Every drag interaction has a button/menu/keyboard equivalent.
- Playhead, selected clip and current time have accessible names.
- Use visible focus, correct menu/dialog semantics and `aria-disabled`.
- Respect `prefers-reduced-motion`; do not animate the timeline or grids by
  default.

## 10. Responsive contract

- Desktop: persistent shell, bounded asset sidebar, stage and timeline.
- Tablet: asset sidebar collapses; stage remains primary; timeline may reduce
  controls but remains accessible.
- Mobile: shell navigation becomes its mobile mode; asset panel becomes a
  drawer; stage, transport and timeline stack; inspector becomes a sheet.
- No desktop hover behavior may be required for mobile operation.

## 11. Design deliverables

Provide:

1. Desktop composition with asset sidebar closed and open.
2. Desktop composition with inspector open.
3. Tablet drawer composition.
4. Mobile stacked composition.
5. Empty, saving, error, read-only and forbidden states.
6. Focus/keyboard annotations.
7. Component-to-slot mapping.
8. Token and surface usage.
9. Interaction notes for drag/drop, playback and timeline selection.
10. Known deviations with an exception ID and approval request.

## 12. Acceptance checklist

- [ ] Shared `PlatformHeader` and `SuiteSidebar` are preserved.
- [ ] `ModuleHeader` is used for editor-local context/actions.
- [ ] Asset navigation uses `ModuleContextSidebar`.
- [ ] Stage, transport and timeline remain the primary workspace.
- [ ] Layout uses `CreativeEditor` slots and bounded spans.
- [ ] No pixel-positioned product layout is introduced.
- [ ] Responsive and keyboard alternatives are documented.
- [ ] Required states are designed.
- [ ] Surfaces and backgrounds use shared tokens/recipes.
- [ ] Any exception is documented and approved.
