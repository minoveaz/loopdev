# Active Skill Routing Guide

Use the repository Skills under `.github/skills/` as the operational authority.

## Start with the work type

| Request | Primary Skill |
| --- | --- |
| New feature, scope, risks, or phase decision | `track-governance` |
| Which checks should run | `validation-framework` |
| Shell, suite navigation, or canvas composition | `platform-shell` |
| RLS, organizations, contracts, migrations, or secrets | `security-review` |
| Branch, commit, PR, or release change discipline | `git-workflow` |

## Typical sequence

```text
track-governance
      |
      +--> implementation-specific repository guidance
      |
      +--> security-review when data, auth, tenancy, or migrations are involved
      |
      +--> platform-shell when shared shell composition is involved
      |
      +--> validation-framework
      |
      +--> git-workflow
```

Quant-specific routing is intentionally disabled while Quant remains
experimental and out of product scope.

The former generic routing guide and long-form Skills are archived under
`docs/archive/ai-skills/2026-08-13/`.
