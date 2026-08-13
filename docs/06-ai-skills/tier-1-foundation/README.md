# 🏗️ TIER 1: FOUNDATION SKILLS

> **Maturity:** ✅ Published
> **Updated:** 2026-03-21
> **Status:** Ready for immediate use

These are the **4 core skills** that form the foundation for ALL LoopDev development.

---

## 📚 SKILLS IN THIS TIER

### 1️⃣ 🔍 DISCOVERY_ANALYSIS_SKILL.md
**When:** You have an idea, but unsure of technical impact
**Output:** Analysis of constraints, risks, decisions, effort estimate
**Duration:** 1-2 hours
**Next:** Contract Definition

[→ Read DISCOVERY_ANALYSIS_SKILL.md](./DISCOVERY_ANALYSIS_SKILL.md)

---

### 2️⃣ 📋 CONTRACT_DEFINITION_SKILL.md
**When:** Discovery complete, ready to define data shapes
**Output:** Zod schemas, TypeScript types, API contracts
**Duration:** 1-2 hours
**Next:** Parallel - Frontend OR Infra Implementation

[→ Read CONTRACT_DEFINITION_SKILL.md](./CONTRACT_DEFINITION_SKILL.md)

---

### 3️⃣ 🎨 FRONTEND_IMPLEMENTATION_SKILL.md
**When:** Contract defined, ready to build UI
**Output:** Brain/Body components, tests, stories
**Duration:** 4-8 hours (Phase 2) or 8-16 hours (Phase 3)
**Next:** QA Testing

[→ Read FRONTEND_IMPLEMENTATION_SKILL.md](./FRONTEND_IMPLEMENTATION_SKILL.md)

---

### 4️⃣ 🔧 INFRA_IMPLEMENTATION_SKILL.md
**When:** Contract defined, ready to build API
**Output:** API handlers, services, DB layer
**Duration:** 4-8 hours (Phase 2) or 8-16 hours (Phase 3)
**Next:** QA Testing

[→ Read INFRA_IMPLEMENTATION_SKILL.md](./INFRA_IMPLEMENTATION_SKILL.md)

---

## 🔄 TYPICAL WORKFLOW

### Simple Feature (4-5 hours total)
```
skill-discovery (1h)
    ↓
skill-contract (1h)
    ↓
skill-frontend-impl (2h) OR skill-infra-impl (2h)
    ↓
DONE (simple features may skip testing)
```

### Medium Feature (20-30 hours total)
```
skill-discovery (1h)
    ↓
skill-contract (1.5h)
    ↓
skill-frontend-impl (8h) ──┐
                           ├─→ skill-qa-testing (6h)
skill-infra-impl (8h) ────┘
    ↓
DONE (all tests passing)
```

### Complex Feature (40-60+ hours total)
```
skill-discovery (2h)
    ↓
skill-contract (2h)
    ↓
skill-frontend-impl (12h) ──┐
                            ├─→ skill-qa-testing (10h)
skill-infra-impl (12h) ─────┤
                            ├─→ track-governance + validation-framework
                            ├─→ skill-backtest-module (4h)
                            ↓
                        CERTIFIED 🔵
```

---

## ✅ USAGE CHECKLIST

When starting ANY feature:

- [ ] Read DISCOVERY_ANALYSIS_SKILL
- [ ] Run skill-discovery (analyze, don't implement)
- [ ] Document findings
- [ ] Get sign-off on complexity/effort
- [ ] Read CONTRACT_DEFINITION_SKILL
- [ ] Run skill-contract (define data shapes)
- [ ] Get sign-off on contract
- [ ] Read FRONTEND_IMPLEMENTATION_SKILL or INFRA_IMPLEMENTATION_SKILL
- [ ] Implement (now all decisions are made)

---

## 📊 SKILL STATS

| Skill | Lines | Complexity | Time to Read |
|-------|-------|-----------|--------------|
| Discovery | 400 | Medium | 15 min |
| Contract | 450 | Medium | 15 min |
| Frontend | 100 | Low | 5 min |
| Infra | 100 | Low | 5 min |
| **TOTAL** | **1050** | **Medium** | **40 min** |

---

## 🎓 LEARNING PATH

**Recommended reading order:**

1. **New to LoopDev?**
   - Read all 4 Tier 1 skills (40 minutes)
   - Then try your first feature using skills
   - Skills will guide you

2. **Familiar with LoopDev?**
   - Skim each skill (10 minutes total)
   - Reference as needed during implementation
   - Use checklists to verify compliance

3. **Experienced?**
   - Use skills as quick reference
   - Mainly for discovering hidden requirements (discovery skill)

---

## 🚀 COMMON PATTERNS

### Pattern 1: Simple Form Component
```
Discovery: 30 min (minimal impact)
Contract: 30 min (simple schema)
Frontend: 2 hours (form + validation)
Total: 3 hours
```

### Pattern 2: Data Table Listing
```
Discovery: 45 min (pagination, filtering)
Contract: 45 min (list schema + pagination)
Frontend: 3 hours (table + filters + sorting)
Infra: 2 hours (GET endpoint with pagination)
Total: 6.5 hours
```

### Pattern 3: Full Feature (Strategy Backtester)
```
Discovery: 2 hours (async jobs, real-time updates)
Contract: 2 hours (request/response/error schemas)
Frontend: 8 hours (form + results + charts)
Infra: 8 hours (API + job queue + storage)
QA Testing: 4 hours (E2E + unit tests)
Certification: 2 hours (Phase 3 + Phase 4 audit)
Total: 26 hours
```

---

## 🔗 NEXT: TIER 2 SKILLS

Once you've mastered Tier 1, move to:
→ **Tier 2 Domain-Specific Skills**

These extend Tier 1 for specialized domains:
- skill-quant-strategy (build trading strategies)
- skill-backtest-module (certify modules)
- skill-qa-testing (comprehensive tests)

See `/tier-2-domain/` folder.

---

## ⚠️ IMPORTANT NOTES

**About Tier 1 Skills:**
- These are FOUNDATIONAL and REQUIRED
- Every feature uses at least 3-4 of these
- Skills work TOGETHER (discovery → contract → implementation)
- Don't skip discovery (biggest ROI on preventing rework)

**When you're stuck:**
- Check the relevant skill's "ANTI-PATTERNS" section
- Check the "COMMON MISTAKES" section
- Check the "EXECUTION CHECKLIST"
- Ask: "Did I follow the skill correctly?"

---

**Tier 1 Status:** ✅ All 4 skills available
**Next Step:** Choose a feature and start with skill-discovery
