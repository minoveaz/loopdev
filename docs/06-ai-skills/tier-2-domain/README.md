# 🚀 TIER 2: DOMAIN-SPECIFIC SKILLS

> **Maturity:** ✅ Published
> **Updated:** 2026-03-21
> **Status:** Ready for use (after Tier 1)

These are **specialized skills** for specific domains and phases.

---

## 📚 SKILLS IN THIS TIER

### 1️⃣ 📈 QUANT_STRATEGY_SKILL.md
**When:** You need to build a trading strategy
**Depends on:** skill-discovery + skill-contract
**Output:** Strategy.py file with entry/exit logic
**Duration:** 2-4 hours per strategy
**Next:** skill-qa-testing

[→ Read QUANT_STRATEGY_SKILL.md](./QUANT_STRATEGY_SKILL.md)

---

### 2️⃣ ✅ QA_TESTING_SKILL.md
**When:** Code is written, ready to test
**Depends on:** skill-frontend-impl OR skill-infra-impl OR skill-quant-strategy
**Output:** Complete test suite (Vitest, Axe, Playwright, repository security gates)
**Duration:** 3-6 hours per component
**Next:** skill-backtest-module (for certification)

[→ Read QA_TESTING_SKILL.md](./QA_TESTING_SKILL.md)

---

### 3️⃣ 📊 BACKTEST_MODULE_SKILL.md
**When:** Phase transitions (2→3, 3→4, 4→5)
**Depends on:** skill-qa-testing (already passing tests)
**Output:** Verification that gates are met
**Duration:** 1-2 hours per phase gate
**Next:** Select the applicable governance checks through the repository Skills
before release.

[→ Read BACKTEST_MODULE_SKILL.md](./BACKTEST_MODULE_SKILL.md)

---

## 🔄 WHEN TO USE TIER 2

**Use Tier 2 skills ONLY AFTER Tier 1:**

```
Tier 1: Discovery → Contract → Frontend/Infra
           ↓
Tier 2: QA Testing → Backtest Module (certification)
           ↓
Tier 3: Architecture Review (final check)
           ↓
Release ✅
```

---

## 💡 TYPICAL WORKFLOWS

### Workflow 1: Single Strategy
```
skill-discovery (strategy constraints)
  ↓
skill-contract (signal/trade schemas)
  ↓
skill-quant-strategy (implement strategy.py)
  ↓
skill-qa-testing (backtest + unit tests)
  ↓
Ready to deploy ✅
```

### Workflow 2: Full Module (Backtester)
```
skill-discovery (module scope/constraints)
  ↓
skill-contract (API/response schemas)
  ↓
skill-frontend-impl (UI components)
skill-infra-impl (API endpoints)
  ↓
skill-qa-testing (complete test suites)
  ↓
skill-backtest-module (Phase 3 gate check)
  ↓
AUDIT_UI_PROMPT (auditor review)
  ↓
🔵 Front_Certified
  ↓
skill-backtest-module (Phase 4 gate check)
  ↓
skill-qa-testing (infrastructure auditor review)
  ↓
🔵 Infra_Certified
  ↓
track-governance + validation-framework (final evidence)
  ↓
Release ✅
```

---

## 📊 SKILL STATS

| Skill | Lines | Complexity | Time to Read |
|-------|-------|-----------|--------------|
| Quant Strategy | 400 | High | 20 min |
| QA Testing | 150 | Medium | 10 min |
| Backtest Module | 200 | Medium | 10 min |
| **TOTAL** | **750** | **Medium** | **40 min** |

---

## 🎓 WHEN EACH SKILL APPLIES

### skill-quant-strategy
- [ ] You're building a new trading strategy
- [ ] You want consistent structure across strategies
- [ ] You want it to be backtestable
- [ ] You want parameters tunable

### skill-qa-testing
- [ ] Code is written and you need to test it
- [ ] You want ≥80% coverage
- [ ] You want 0 accessibility violations
- [ ] You want to pass Phase 3/4 gates

### skill-backtest-module
- [ ] You're transitioning between phases
- [ ] You need to verify gates are met
- [ ] You want to know if code is certification-ready
- [ ] You want structured phase progression

---

## ⚡ QUICK REFERENCE

| Skill | Use When | Depends On | Outputs | Duration |
|-------|----------|-----------|---------|----------|
| Quant | New strategy | Discovery + Contract | strategy.py | 2-4h |
| QA | Code ready | Frontend/Infra/Quant | Tests (Vitest, Axe, Playwright) | 3-6h |
| Backtest | Phase gate | Tests passing | Gate verification | 1-2h |

---

## 🚀 NEXT: TIER 3 SKILLS

Once you've used Tier 1 + Tier 2, move to:
→ **Tier 3 Governance Skills**

These ensure architecture compliance:
- track-governance + validation-framework (scope and validation evidence)

See `/tier-3-governance/` folder.

---

**Tier 2 Status:** ✅ All 3 skills available
**Next Step:** Use skill-quant-strategy for trading strategies, or skill-qa-testing for testing
