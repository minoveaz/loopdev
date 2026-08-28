---
title: SaaS visual system inventory
status: phase-0-baseline
owner: platform
reviewed_at: 2026-08-14
---

# SaaS visual system inventory

This is the evidence baseline for the `saas-visual-standardization` track.
It records existing primitives and gaps; it does not yet promote new tokens or
remove existing classes.

## Existing sources of truth

| Concern | Current source | Evidence | Standardization decision |
| --- | --- | --- | --- |
| Canvas and surface colors | CSS variables and Tailwind aliases | `globals.css`, `tailwind.config.ts` | Consolidate semantic names before adding variants |
| Technical borders | `--lpd-color-border-technical` and `border-technical` | `globals.css`, Tailwind config | Keep platform-owned |
| Technical grid | `TechnicalCanvas`, `TechnicalSurface withGrid`, utility classes | `TechnicalCanvas`, `TechnicalSurface`, `globals.css` | Choose one shared primitive and deprecate duplicate paths |
| Blueprint/dot grids | `.bg-blueprint-grid`, `.bg-dot-grid` | `globals.css` | Register as named background recipes with contrast constraints |
| Surface depth | `TechnicalSurface` variants/depths | `TechnicalSurface/types.ts` | Promote to a documented surface taxonomy |
| Canvas structure | `SuiteCanvasMode` | `SuiteCanvas/types.ts` | Keep independent from visual recipes |
| Typography | token package and CSS variables | `tokens/src`, `globals.css` | Reference tokens; prohibit local font scales |

## Surface taxonomy baseline

The existing implementation implies these semantic layers:

- `canvas`: page-level working area;
- `surface`: standard panel/card;
- `elevated`: raised panel or inspector;
- `overlay`: portal, dialog or transient surface;
- `glass`: restricted translucent treatment requiring contrast review.

These names need a canonical token contract before wider adoption.

## Background baseline

Existing background treatments:

- plain canvas;
- 20px and 40px line grids;
- blueprint grid;
- dot/neural grid;
- glass panel;
- animated scanline references.

Usage must be governed by information density. Data-heavy tables should default
to plain or very subtle backgrounds; technical grids are reserved for canvas,
headers, empty states or approved immersive workflows.

## Confirmed duplication and risks

1. Grid rendering is implemented in CSS utilities and in two React primitives.
2. Grid color and opacity are partly tokenized and partly hardcoded.
3. `TechnicalCanvas` has `low`, `medium` and `high` intensity, while
   `TechnicalSurface withGrid` has a fixed opacity.
4. Surface names (`surface`, `glass`, `canvas`) and depth names (`flat`,
   `raised`, `overlay`) are not yet expressed as a shared view recipe.
5. Existing components use direct Tailwind colors alongside semantic variables.
6. Animated treatments require reduced-motion and performance evidence.

## Phase 0 decisions to make

- Select the canonical grid primitive and migration path.
- Define semantic surface and background token names.
- Define approved recipe combinations for each `SuiteCanvasMode`.
- Define density and contrast limits for technical treatments.
- Define the view specification format consumed by CRM and other suites.

## Evidence boundaries

This inventory is descriptive. It does not claim that all existing consumers
already comply with the future standard, and it does not authorize new visual
variants without the track's approval gates.
