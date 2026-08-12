---
name: "LoopDev: Git: Workflow"
description: "Prepare or validate a LoopDev branch, commit, push, or Pull Request using the repository Git workflow."
argument-hint: "Git operation to prepare or validate"
agent: agent
---

Use the `git-workflow` skill for this task. Inspect the current Git state and preserve unrelated
work. Follow the skill's branch, commit, push, or Pull Request rules that apply to the requested
operation. Do not create a commit, push, change branches, or open a Pull Request unless explicitly
requested.