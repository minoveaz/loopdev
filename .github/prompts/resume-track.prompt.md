---
name: "LoopDev: Tracks: Resume"
description: "Restore a LoopDev track from its handoff and remote branch without overwriting local work."
argument-hint: "Optional track name, id, or path"
agent: agent
---

Use the `track-governance` skill's `Resume track` procedure and the `git-workflow` skill. Resolve the
track automatically when possible, read its latest `Handoff de sesión`, fetch `origin`, and restore
the declared continuation branch using only a fast-forward synchronization. Preserve local work and
stop with a concise diagnosis when the worktree is dirty, the branch diverges, or the track cannot
be identified unambiguously. Do not create a Pull Request.