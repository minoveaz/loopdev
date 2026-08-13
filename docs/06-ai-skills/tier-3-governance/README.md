# Tier 3: Governance Skills

> **Authority**: Tech Lead, Release Manager  
> **When to Use**: Final validation gates before production release  
> **Time Investment**: Reference material for the operational governance Skills
> **Output**: Certified production-ready code + monitoring plan

## Overview

Tier 3 skills ensure code meets enterprise-grade standards before release. Unlike Tier 1 (foundation) and Tier 2 (domain-specific) which focus on building, Tier 3 focuses on **hardening, validating, and safeguarding**.

The detailed security reference complements the operational Skills in
`.github/skills/`. Architecture, performance, and release checks are selected
through `validation-framework`, `git-workflow`, and `track-governance` rather
than separate document Skills.

```
Tier 2 Complete (quant-strategy + qa-testing + backtest-module)
        ↓
    ┌───┴────┬─────────────────┬──────────────────┐
    ↓        ↓                 ↓                  ↓
  Architecture  Security    Performance       Release
   Review       Audit      Optimization      Readiness
    ↓        ↓                 ↓                  ↓
    └───┬────┴─────────────────┴──────────────────┘
        ↓
   PRODUCTION RELEASE ✅
```

## Security Audit Reference
**When**: After feature is code-complete, before QA sign-off  
**What**: OWASP compliance, RLS enforcement, secrets scanning  
**Who**: Security Champion + Backend Engineer  
**Time**: ~2 hours  
**Gates**: 0 OWASP violations, RLS enforced at DB, no hardcoded secrets  

**Read**: `SECURITY_AUDIT_SKILL.md`

---

## Typical Workflow

### Timeline
```
Sprint Day 1-4:  Tier 1 + Tier 2 work (discovery → testing)
Sprint Day 5:    Tier 3 checks run in parallel
                 ├─ Architecture Review (2h)
                 ├─ Security Audit (2h)
                 ├─ Performance Optimization (2h)
                 └─ Release Readiness prep (1h)
Sprint Day 6:    Fix issues found, re-validate
Sprint Day 7:    Release ✅
```

### Dependency Chain
```
Feature Defined (Tier 1)
    ↓
Code Implemented (Tier 2)
    ↓
Architecture Review ──→ Issues? ──→ Fix ──→ Re-validate
    ↓                                          ↓
Security Audit ────→ Issues? ──→ Fix ──────→ Re-validate
    ↓                                          ↓
Performance Optimization → Issues? ──→ Fix → Re-validate
    ↓                                          ↓
Release Readiness ─────────────────────────→ GO ✅
```

### Common Scenarios

#### Scenario 1: Strategic feature (high business value)
```
Architecture Review (strict)
  + Security Audit (strict)
  + Performance Optimization (optimize, don't just check)
  + Release Readiness (extensive monitoring)
  
  Timeline: 8 hours
  Risk: Low
  Quality: Enterprise-grade
```

#### Scenario 2: Infrastructure change (high risk)
```
Architecture Review (very strict - must validate DAG)
  + Security Audit (very strict - must validate RLS)
  + Performance Optimization (critical - infrastructure impacts everything)
  + Release Readiness (extensive - needs rollback validation)
  
  Timeline: 10 hours
  Risk: Very Low
  Quality: Maximum rigor
```

#### Scenario 3: Small bug fix (low risk)
```
Architecture Review (quick - just validate no patterns broken)
  + Security Audit (quick - just validate no new exposure)
  + Performance Optimization (skip if tiny change)
  + Release Readiness (quick - minimal monitoring needed)
  
  Timeline: 4 hours
  Risk: Low-Medium
  Quality: Adequate
```

## Quality Gates Summary

| Gate | Architecture | Security | Performance | Release |
|------|--------------|----------|-------------|---------|
| Type Safety | ✅ Check all Zod | - | - | - |
| ADRs Valid | ✅ All decisions documented | - | - | - |
| DAG Clean | ✅ No circular deps | - | - | - |
| OWASP | - | ✅ Top 10 covered | - | - |
| RLS Enforced | - | ✅ Multi-tenant safe | - | - |
| Secrets | - | ✅ No hardcoded | - | - |
| Bundle Size | - | - | ✅ <2MB | - |
| Lighthouse | - | - | ✅ >90 | - |
| Query Perf | - | - | ✅ No N+1 | - |
| Monitoring | - | - | - | ✅ Live |
| Runbook | - | - | - | ✅ Written |
| Rollback | - | - | - | ✅ Tested |

## Operational routing

- Security and organization isolation: `.github/skills/security-review/SKILL.md`
- Validation selection and evidence: `.github/skills/validation-framework/SKILL.md`
- Track scope, decisions, and release evidence: `.github/skills/track-governance/SKILL.md`
- Branch, commit, and pull request gates: `.github/skills/git-workflow/SKILL.md`

## Further Reading

- **SECURITY_AUDIT_SKILL.md** - Detailed security checklist
- `.github/skills/validation-framework/SKILL.md` - Current validation routing
- `.github/skills/track-governance/SKILL.md` - Current track lifecycle

---

**Remember**: Tier 3 exists to protect production. 8 hours before release is a small price for 100% confidence.
