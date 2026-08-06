# Spec: ClaimList (v1.0)

## 1. Purpose
Management of regulated language. Ensures compliance by listing forbidden terms and approved/restricted claims.

## 2. Visual Rules
- **Forbidden Mode:** Renders as a wrapping list of compact tags with `red-500` accent.
- **Regulated Mode:** Renders as a vertical list of detailed chips with jurisdiction metadata.
- **Spacing:** standard `gap-2`.

## 3. Interaction
- Clicking an item opens the **Inspector** on the **Governance** (for regulated) or **Validation** (for forbidden) tab.
