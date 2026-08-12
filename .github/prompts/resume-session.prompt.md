---
name: "LoopDev: Sessions: Resume"
description: "Reconstruct the useful LoopDev context after a chat-window handoff from the track, Git, and indexed Copilot history."
argument-hint: "Optional track name, id, or path"
agent: agent
---

Use the `track-governance` skill's `Resume session` procedure. Resolve the active track
automatically when possible. Read its handoff and local Git state, then use indexed Copilot history
as supplemental context to recover decisions and unresolved questions. Return a compact actionable
brief; do not replay a full transcript or alter Git state. Use `/resume-track` instead when remote
synchronization is required.