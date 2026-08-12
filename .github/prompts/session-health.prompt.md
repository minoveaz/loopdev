---
name: "LoopDev: Sessions: Health"
description: "Assess whether a LoopDev Copilot conversation should move to a new chat window using observable complexity signals, not token estimates."
argument-hint: "Optional track name, id, or path"
agent: agent
---

Use the `track-governance` skill's `Session health` procedure. Assess completed work slices,
edit/validation cycles, unresolved decisions, and pending broad exploration. State the observed
signals, classify the conversation as low, medium, or high complexity, and recommend either to
continue, run `/handoff-session`, or finish with `/end-session`. Do not claim token visibility and
do not modify files, Git state, staging, or the dashboard.