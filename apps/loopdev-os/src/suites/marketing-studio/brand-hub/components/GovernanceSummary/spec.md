# Spec: GovernanceSummary (v1.0)

## 1. Purpose
Displays the active governance profile and permissions per domain. Clarifies "what can I change?".

## 2. Visual Rules
- **Structure:** Compact table or vertical list of domains.
- **Labels:** Semantic badges for access levels:
    - `Allowed`: Success/Ghost.
    - `Approval Required`: Warning/Ghost.
    - `Restricted`: Critical/Ghost.

## 3. Interaction
- Clicking a domain row should open the **Inspector** on the **Governance** tab, focused on that specific domain's policy.
