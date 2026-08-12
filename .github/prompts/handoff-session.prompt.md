---
name: "LoopDev: Sessions: Handoff"
description: "Prepare a compact recoverable handoff before moving LoopDev work to a new chat window without changing Git state."
argument-hint: "Optional track name, id, or path"
agent: agent
---

Use the `track-governance` skill's `Handoff session` procedure. Resolve the active track
automatically when possible, update only its `Handoff de sesión`, and return a concise continuation
message for a new chat window. Do not stage, commit, push, pull, switch branches, regenerate the
dashboard, or change implementation files.