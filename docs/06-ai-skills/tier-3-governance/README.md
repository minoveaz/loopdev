# Tier 3: Governance Skills

> **Authority**: Tech Lead, Release Manager  
> **When to Use**: Final validation gates before production release  
> **Time Investment**: ~8 hours (2 hours per skill)  
> **Output**: Certified production-ready code + monitoring plan

## Overview

Tier 3 skills ensure code meets enterprise-grade standards before release. Unlike Tier 1 (foundation) and Tier 2 (domain-specific) which focus on building, Tier 3 focuses on **hardening, validating, and safeguarding**.

These 4 skills run **in parallel** after Tier 2 is complete, each validating a critical dimension:

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

## The 4 Skills

### 1️⃣ Architecture Review Skill
**When**: After all code is written, before integration testing  
**What**: Validates design patterns, dependency graph, type safety  
**Who**: Tech Lead + Senior Engineer  
**Time**: ~2 hours  
**Gates**: ADRs valid, DAG clean, no circular deps, type-safe  

**Read**: `ARCHITECTURE_REVIEW_SKILL.md`

---

### 2️⃣ Security Audit Skill
**When**: After feature is code-complete, before QA sign-off  
**What**: OWASP compliance, RLS enforcement, secrets scanning  
**Who**: Security Champion + Backend Engineer  
**Time**: ~2 hours  
**Gates**: 0 OWASP violations, RLS enforced at DB, no hardcoded secrets  

**Read**: `SECURITY_AUDIT_SKILL.md`

---

### 3️⃣ Performance Optimization Skill
**When**: After testing is complete, before release prep  
**What**: Bundle size, query optimization, caching, Lighthouse score  
**Who**: Performance Engineer + Frontend Lead  
**Time**: ~2 hours  
**Gates**: Bundle <2MB, Lighthouse >90, no N+1 queries, cache hit >80%  

**Read**: `PERFORMANCE_OPTIMIZATION_SKILL.md`

---

### 4️⃣ Release Readiness Skill
**When**: Final gate, 24 hours before production deployment  
**What**: Monitoring setup, rollback plan, runbook, team notification  
**Who**: Release Manager + DevOps  
**Time**: ~2 hours  
**Gates**: Monitoring live, runbooks written, rollback tested, team briefed  

**Read**: `RELEASE_READINESS_SKILL.md`

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

## Usage Pattern for AI Agents

### For Copilot/Gemini

```
Use skill-architecture-review to:
1. Analyze the code for ADR compliance
2. Validate the dependency graph
3. Check type safety with Zod
4. Verify design patterns match LoopDev standards

Input: Code path + feature description
Output: Checklist + issues found + fixes suggested
```

Each skill is designed for AI agents to:
- ✅ Read the skill (5-10 min)
- ✅ Follow the checklist (30 min - 1 hour)
- ✅ Validate code automatically (30 min)
- ✅ Generate fixes if needed (1-2 hours)
- ✅ Verify with re-check (30 min)

## Anti-Patterns to Avoid

### ❌ Running skills sequentially instead of parallel
**Why it fails**: Takes 8 hours instead of 2 hours  
**Fix**: Run all 4 after Tier 2 completes, in parallel

### ❌ Skipping skills for "urgent" releases
**Why it fails**: Bugs in production, security gaps, performance issues  
**Fix**: Always run Tier 3. Use "Scenario 3" (small fix) if truly urgent

### ❌ Having same person do all 4 skills
**Why it fails**: Bias, fatigue, misses issues  
**Fix**: Different specialists: Tech Lead (arch), Security Lead (sec), Perf Engineer (perf), Release Manager (release)

### ❌ Not documenting issues found
**Why it fails**: Same issues recur in next sprint  
**Fix**: Log all issues + fixes in Engineering Log (see GIT_WORKFLOW.md)

### ❌ Updating code during Release Readiness
**Why it fails**: New bugs, monitoring not validated for new code  
**Fix**: Code freeze 24 hours before release. After release readiness, only monitoring changes allowed

## Success Criteria

### For Architecture Review
- ✅ All ADRs written and linked
- ✅ Dependency graph validated (no circles)
- ✅ All types have Zod schemas
- ✅ Design patterns match LoopDev standards

### For Security Audit
- ✅ 0 OWASP violations
- ✅ RLS enforced at DB level
- ✅ No hardcoded secrets
- ✅ Dependencies have 0 critical vulns (Snyk)

### For Performance Optimization
- ✅ Bundle size <2MB
- ✅ Lighthouse score >90
- ✅ No N+1 queries (EXPLAIN validated)
- ✅ Cache hit rate >80%

### For Release Readiness
- ✅ All metrics dashboards live
- ✅ Runbooks written (deployment, incident response, rollback)
- ✅ Rollback tested successfully
- ✅ Team briefed on new feature

## Next Steps After Tier 3

Once all 4 Tier 3 skills are complete:

1. **Code Freeze**: No more changes to production code
2. **Staging Test**: Deploy to staging, run E2E tests again
3. **Release**: Deploy to production with runbook ready
4. **Monitor**: Live monitoring for 24h, on-call ready
5. **Post-Release**: Debrief, update runbooks, log learnings

## Skills Ownership

| Skill | Primary | Secondary | Escalation |
|-------|---------|-----------|------------|
| Architecture | Tech Lead | Senior Eng | CTO |
| Security | Security Lead | Backend Lead | VP Eng |
| Performance | Perf Engineer | Frontend Lead | VP Eng |
| Release | Release Manager | DevOps | VP Eng |

## Further Reading

- **ARCHITECTURE_REVIEW_SKILL.md** - Detailed architecture validation guide
- **SECURITY_AUDIT_SKILL.md** - Detailed security checklist
- **PERFORMANCE_OPTIMIZATION_SKILL.md** - Detailed performance tuning guide
- **RELEASE_READINESS_SKILL.md** - Detailed go-to-prod checklist
- **/docs/GIT_WORKFLOW.md** - How to integrate Tier 3 into PR process
- **/docs/ADR/** - All architecture decisions
- **/docs/COMPONENT_LIFECYCLE.md** - 5-phase component lifecycle (Tier 3 is part of Phase 5)

---

**Remember**: Tier 3 exists to protect production. 8 hours before release is a small price for 100% confidence.
