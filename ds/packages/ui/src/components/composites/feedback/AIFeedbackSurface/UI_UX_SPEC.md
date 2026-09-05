# UI/UX Specification: AIFeedbackSurface

- Implementation: `ds/packages/ui/src/components/composites/feedback/AIFeedbackSurface`
- Public export: `@loopdev/ui`
- Owner: `frontend-platform`
- Runtime: `client`
- Directive: `use client`
- Status: `in-progress`
- Spec version: `1.0`
- Contract version: `ai-feedback-surface-v1`
- Consumers: Document Intelligence (first consumer); CRM, Marketing Studio and Operations planned

## Purpose and ownership

`AIFeedbackSurface` communicates an AI-backed process in a full canvas region
without owning provider calls, domain data, permissions, retry policy or
navigation. Consumers provide all visible copy, stages, progress and actions.
The composite owns the shared neural/purple visual language, semantic status
mapping, stable layout and accessible progress semantics.

## Anatomy

```text
transparent canvas context
└── technical surface
    ├── status header
    └── process plane
        ├── active terminal feedback
        ├── global progress
        └── integrated stage timeline
```

The surface is intentionally larger than `EmptyState`: it represents an active
process, not the absence of results. Stages are part of the process plane, not
detached cards below it. `EmptyState` remains the atom for empty and terminal
result boundaries.

## Public API

`title`, `description`, `status`, `statusLabel`, `activeMessage`, `steps`,
`progress`, `autoAdvance`, `stepDurationMs`, `tickMs`, `onProgressChange`,
`onStepChange`, `onComplete`, `completionHoldMs`, `icon`, `action`, `className`
and `aria-label`. Step ids,
labels, typing messages and durations are consumer-owned. `progress` is
optional and clamped to 0..100; when `autoAdvance` is enabled, the composite
derives progress and stage status from the declared durations. Actions remain
consumer-owned and are rendered without mutation logic. Once the temporal
progress reaches 100%, all stages remain visibly complete for
`completionHoldMs` (600 ms by default) before `onComplete` notifies the
consumer. The composite does not decide when result data is rendered.

## State and interaction contract

| State | Status | UI | Recovery |
| --- | --- | --- | --- |
| Processing | required | Purple neural surface, active message, optional progress and stages | Consumer action only |
| Success | applicable | Semantic success badge and completed stages | Consumer action only |
| Error | applicable | Semantic danger badge and error stage | Consumer retry/action |
| Paused | applicable | Semantic warning badge and stable content | Consumer resume/cancel |

The component has no popup, focus trap or dismiss behavior. Actions follow
normal document order and are activated by their native controls.

## Responsive and accessibility contract

All viewports use one process plane: terminal feedback, progress and stages
remain in the same reading flow, with the stages directly below the progress
bar. Stages become a responsive grid and collapse to one column on narrow
screens without page-level horizontal overflow. The
root is a labelled live region; progress uses `role="progressbar"` and numeric
ARIA values. Reduced motion disables width transitions. Status meaning is
communicated by labels and text, not color alone.

## Theme and portability

Only semantic LoopDev tokens are used. Tenant variation is `token-only`;
dark mode and high contrast inherit semantic status and surface tokens.
Native equivalents may preserve the status/stage contract with platform-native
surfaces; this web implementation is not a React Native implementation.

## Approved usage and anti-patterns

Use it for a long-running AI process occupying a workspace canvas. Do not use
it for a generic spinner, a no-results state, a provider call, a suite
navigation surface, or a domain-specific validation panel. CRM, Marketing
Studio and Operations must provide their own copy and action policy.

## Evidence and certification

- Contract: `verified` by typed API and this specification.
- Accessibility: `verified` by focused Vitest/Axe coverage.
- Interaction: `in-progress`; browser keyboard and responsive evidence pending.
- Responsive: `in-progress`; visual review pending.
- States: `in-progress`; success/error/paused consumer evidence pending.
- Registry: `experimental`.
- Visual review: `deferred` until user approval.

## Reopen triggers

New state, action ownership, overlay behavior, consumer outside the planned
suite set, theme responsibility, or native implementation.
