---
name: "LoopDev: Sessions: End"
description: "Record a recoverable LoopDev track handoff, validate its scope, commit pending related work, and push the current branch without opening a PR."
argument-hint: "Optional track name, id, or path"
agent: agent
---

Use the `track-governance` skill's `End session` procedure and the `git-workflow` skill. Resolve the
active track automatically from the current branch and changed files when no argument is supplied.
Update its `Handoff de sesión`, validate the relevant work, and commit and push only changes that
belong to the resolved track. Never include unrelated changes, commit directly to `develop` or
`main`, force-push, rebase automatically, or create a Pull Request. If the scope or Git state is
ambiguous, preserve all local work and report the exact blocker.