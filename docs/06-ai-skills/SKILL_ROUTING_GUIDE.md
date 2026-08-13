# Skill Routing Guide for AI Agents

> This guide helps AI agents (Copilot, Gemini, Claude) determine which skill to recommend at each moment in the conversation.

---

## Quick Decision Tree

```
USER SAYS...                      → YOU RECOMMEND...

"Build a trading strategy"        → skill-discovery → contract → quant-strategy → qa → backtest → tier3
"Build a UI component"            → skill-discovery → contract → frontend → qa → tier3
"Build an API"                    → skill-discovery → contract → infra → qa → tier3
"Review my code"                  → validation-framework → security-review
"I'm ready to deploy"             → track-governance → git-workflow
"My strategy is too slow"         → validation-framework
"Is my code secure?"              → skill-security-audit
"How do I test this?"             → skill-qa-testing
```

---

## Detailed Routing by Scenario

### Scenario 1: New Feature (Design Phase)

**User**: "I want to build something new. Where do I start?"

**You should**:
1. Ask clarifying questions:
   - "What type of feature? (trading strategy, UI, API, module?)"
   - "What's the business goal?"
   - "Who are the users?"

2. Recommend Phase 1:
   ```
   Skill: Discovery Analysis Skill
   Path: tier-1-foundation/DISCOVERY_ANALYSIS_SKILL.md
   Time: 2 hours
   Goal: Understand requirements and impact
   Output: Requirements breakdown, scope, impact analysis
   
   Ready? [yes/no]
   ```

3. After Phase 1 completes:
   ```
   Phase 1 ✅ Complete
   
   Next: Phase 2 - Contract Definition
   Skill: Contract Definition Skill
   Path: tier-1-foundation/CONTRACT_DEFINITION_SKILL.md
   Time: 1 hour
   Goal: Define data shapes
   Output: Zod schemas, TypeScript types
   
   Ready? [yes/no]
   ```

---

### Scenario 2: Implementing a Strategy

**User**: "I have the design. Now I need to build the trading strategy."

**You should**:
1. Recommend Phase 2 (if not done):
   ```
   Skill: Contract Definition Skill
   (Define the data shapes first)
   ```

2. Then recommend Phase 3:
   ```
   Skill: Quant Strategy Skill
   Path: tier-2-domain/QUANT_STRATEGY_SKILL.md
   Time: 6 hours
   Goal: Implement entry/exit logic
   Output: Strategy class, signal generator, backtestable code
   
   This skill covers:
   ✅ Base signal calculation
   ✅ Entry conditions
   ✅ Exit conditions
   ✅ Risk management
   ✅ Backtesting compatibility
   
   Ready? [yes/no]
   ```

---

### Scenario 3: Testing Phase

**User**: "My code is written. How do I test it?"

**You should**:
1. Recommend testing skills:
   ```
   Skill: QA Testing Skill
   Path: tier-2-domain/QA_TESTING_SKILL.md
   Time: 2 hours
   Goal: Create comprehensive test suite
   Output: Unit tests, integration tests, E2E tests
   
   For trading strategy:
   - Unit tests for indicators (RSI, ATR, etc)
   - Integration tests for strategy logic
   - E2E tests for signal generation
   
   Ready? [yes/no]
   ```

2. If trading strategy, also recommend:
   ```
   Skill: Backtest Module Skill
   Path: tier-2-domain/BACKTEST_MODULE_SKILL.md
   Time: 1 hour
   Goal: Certify module through phases
   Output: Module certification, phase gates
   
   This is a lightweight checklist to verify
   your module meets production standards.
   
   Ready? [yes/no]
   ```

---

### Scenario 4: Governance Phase (Pre-Release)

**User**: "My code is tested. Is it ready for production?"

**You should**:
```
Not yet! We need to select the applicable governance checks.
Use the operational repository Skills and the validation framework.

After these, your code is production-ready.

Would you like to proceed? [yes/no]
```

#### Architecture and release routing

```
Skill: track-governance + validation-framework
Path: .github/skills/track-governance/SKILL.md
Goal: Validate scope, decisions, evidence, and required repository gates
Output: Track evidence and selected validation commands

Checks:
✅ Applicable architecture authority identified
✅ Contracts and dependencies reviewed
✅ Narrowest validation selected

Ready? [yes/no]
```

#### Security Audit

```
Skill: Security Audit Skill
Path: .github/skills/security-review/SKILL.md
Goal: Validate security
Output: Security report + fixes

Checks:
✅ Organization isolation and RLS enforcement
✅ Secrets not hardcoded
✅ Required repository security gates

This is critical. Even if boring, must pass.

Ready? [yes/no]
```

#### Performance and experience validation

```
Skill: validation-framework
Path: .github/skills/validation-framework/SKILL.md
Goal: Select targeted performance and experience validation
Output: Validation report and residual risks

Checks:
✅ Relevant domain or experience checks selected
✅ Measurements are evidence-based

Ready? [yes/no]
```

#### Release Readiness

```
Skill: git-workflow + track-governance + validation-framework
Path: .github/skills/git-workflow/SKILL.md
Goal: Prepare and validate the release change
Output: Reviewed diff, track evidence, and required checks

Checks:
✅ Branch and PR conventions pass
✅ Required validation scope passes
✅ Rollback and residual risks are documented when applicable

This is the final gate. After this, ready to ship!

Ready? [yes/no]
```

---

### Scenario 5: Code Review Request

**User**: "Can you review my code?"

**You should ask**:
1. "What type of code? (strategy, UI, API, etc)"
2. "Have you tested it?" (if no: recommend skill-qa-testing)
3. "Is it almost ready for production?" (if yes: recommend tier 3)

**If they want a quick review**:
```
I'll do a quick review using 3 governance skills:

1. Architecture Review (2h)
2. Security Audit (2h)
3. Performance Optimization (2h)

This won't be as thorough as full process,
but will catch major issues.

Ready? [yes/no]
```

---

### Scenario 6: Performance Problem

**User**: "My app is slow. How do I fix it?"

**You should**:
```
Skill: validation-framework
Path: .github/skills/validation-framework/SKILL.md
Goal: Identify and fix bottlenecks
Output: Optimizations + recommendations

This will check:
✅ Frontend bundle size
✅ API response times
✅ Database query performance
✅ Caching strategy
✅ Real-time updates efficiency

Ready to debug? [yes/no]
```

---

### Scenario 7: Security Concern

**User**: "I'm worried about security. What should I check?"

**You should**:
```
Skill: Security Audit Skill
Path: tier-3-governance/SECURITY_AUDIT_SKILL.md
Time: 2 hours
Goal: Validate security
Output: Vulnerabilities + fixes

This will check all OWASP vulnerabilities:
✅ Access control
✅ Cryptographic failures
✅ Injection attacks
✅ Insecure design
✅ Broken authentication
✅ Sensitive data exposure
✅ Input validation
✅ Software integrity
✅ Logging & monitoring
✅ SSRF attacks

Plus:
✅ RLS enforcement
✅ Secrets management
✅ Dependency vulnerabilities

Ready? [yes/no]
```

---

### Scenario 8: Questions About a Skill

**User**: "What's in the Contract Definition skill?"

**You should**:
```
The Contract Definition Skill teaches you how to:

1. Create Zod schemas
   - Define all domain objects
   - Include validation rules
   - Document with examples

2. Infer TypeScript types
   - Types come from Zod (single source of truth)
   - Never write manual TypeScript types
   - Automatic runtime validation

3. Enforce multi-tenancy
   - Every object has organization_id
   - Prevents data leaks
   - RLS ready

4. Create API contracts
   - Request/response schemas
   - Error schemas
   - Examples for each

Time: 1 hour
Output: Zod files that you can use immediately
Checklist: 20 items

Read it: tier-1-foundation/CONTRACT_DEFINITION_SKILL.md

Want to use this skill? [yes/no]
```

---

## Workflow Paths by Feature Type

### Path 1: Trading Strategy

```
discovery (2h)
    ↓
contract (1h)
    ↓
quant-strategy (6h)
    ↓
qa-testing (2h)
    ↓
backtest-module (1h)
    ↓
architecture-review (2h)
    ↓
security-audit (2h)
    ↓
performance-optimization (2h)
    ↓
release-readiness (2h)
    ↓
PRODUCTION READY ✅

Total: 20 hours
```

### Path 2: UI Component

```
discovery (2h)
    ↓
contract (1h)
    ↓
frontend (4h)
    ↓
qa-testing (2h)
    ↓
architecture-review (2h)
    ↓
security-audit (2h)
    ↓
performance-optimization (2h)
    ↓
release-readiness (2h)
    ↓
PRODUCTION READY ✅

Total: 17 hours
```

### Path 3: API Endpoint

```
discovery (2h)
    ↓
contract (1h)
    ↓
infra (6h)
    ↓
qa-testing (2h)
    ↓
architecture-review (2h)
    ↓
security-audit (2h)
    ↓
performance-optimization (2h)
    ↓
release-readiness (2h)
    ↓
PRODUCTION READY ✅

Total: 19 hours
```

### Path 4: Quick Review (No Implementation)

```
architecture-review (2h)
    ↓
security-audit (2h)
    ↓
performance-optimization (2h)
    ↓
REVIEW COMPLETE ✅

Total: 6 hours
```

---

## When to Skip a Skill

### You CAN skip if:
- ❌ User explicitly says "Skip this"
- ✅ Instead: Warn them of the risk

### You CAN'T skip if:
- ✅ It's a Tier 1 skill (foundation for all)
- ✅ It's a Tier 3 skill before production
- ✅ It's a dependency for another skill

---

## Key Routing Principles

### Always Explain Why
```
Don't say: "Next skill is security audit"

Do say: "Next, we need to check security because:
- Prevents OWASP vulnerabilities
- Ensures RLS enforcement
- Validates no secrets are exposed
- Required for production
Takes 2 hours. Ready? [yes/no]"
```

### Always Show the Path
```
Don't say: "Let's do security audit"

Do say: "Skill: Security Audit Skill
Path: tier-3-governance/SECURITY_AUDIT_SKILL.md
Time: 2 hours
Read: [user can click to read]"
```

### Always Ask Before Proceeding
```
Don't: Just start the skill

Do: "Ready to start? [yes/no]"
or "Want to take a break? [continue/pause]"
```

### Always Show Checklist Items
```
As you go through a skill:
"Checklist Item 1: Do you have Zod schemas?
  [yes/no/help]"
```

### Always Celebrate Completion
```
After skill completes:
"✅ [Skill Name] complete!

Summary:
- Checklist: 20/20 items ✅
- Output: [what was created]
- Time: 1 hour 45 minutes

Next: [Next Skill Name]
Ready? [yes/no]"
```

---

## Common Routing Questions

**Q: What if user refuses a Tier 1 skill?**
A: Explain why it's important, but let them skip. Warn: "Without this, might have issues later"

**Q: What if user wants to skip Tier 3?**
A: Block them. "Tier 3 is required before production. Can't deploy without it."

**Q: What if user says 'just do all the skills for me'?**
A: You can't. Skills require human input (checklist answers). But offer: "I'll guide you through each skill step by step. Should take 16-20 hours total."

**Q: What if user has a different skill they want to use?**
A: Load SKILLS_REGISTRY.json and check if it exists. If yes: integrate it. If no: suggest adding it first.

**Q: What if user is at phase 3 but hasn't done phase 2?**
A: Go back. "You need to do contract-definition first. It only takes 1 hour and unblocks everything else."

---

## How to Know Which Skill to Recommend

Use this decision matrix:

| User Goal | Phase | Recommend | Time |
|-----------|-------|-----------|------|
| Plan feature | Design | discovery | 2h |
| Define shapes | Contract | contract | 1h |
| Build UI | Impl | frontend | 4h |
| Build API | Impl | infra | 6h |
| Build strategy | Impl | quant-strategy | 6h |
| Test code | Testing | qa-testing | 2h |
| Certify strategy | Testing | backtest-module | 1h |
| Validate design | Governance | architecture-review | 2h |
| Check security | Governance | security-audit | 2h |
| Optimize perf | Governance | performance-optimization | 2h |
| Deploy | Governance | release-readiness | 2h |
| Review code | Governance | arch+sec+perf | 6h |

---

**Use this guide to always recommend the right skill at the right time.**
