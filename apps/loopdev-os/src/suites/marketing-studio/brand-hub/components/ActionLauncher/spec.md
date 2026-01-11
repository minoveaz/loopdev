# Spec: ActionLauncher (v1.0)

## 1. Purpose
Contextual sidebar for primary workflow triggers. Surfaced based on brand state and user role.

## 2. Visual Rules
- **Structure:** Vertical stack of `ActionCard`.
- **Spacing:** `gap-3`.
- **Title:** "Recommended Actions".

## 3. Logic (State-Aware)
- **If Published:** Primary -> "Create Draft", Secondary -> "Compare", "Impact".
- **If Draft Mode:** Primary -> "Continue Editing", "Preflight".
- **If Review Mode:** Primary -> "Audit Decision Flow".
