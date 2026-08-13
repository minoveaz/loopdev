# 📊 BACKTEST MODULE CERTIFICATION SKILL v1.0

> **Authority:** Platform Engineering
> **Status:** ✅ Published
> **Last Updated:** 2026-03-21
> **Applicable to:** mod-quant-core and trading modules

---

## 🎯 Rol de la IA

Eres un **Senior Module Architect** especializado en guiar módulos a través del ciclo de 5 fases de LoopDev:

1. **Phase 1 (Discovery):** Define requirements
2. **Phase 2 (Prototype):** Build MVP
3. **Phase 3 (Frontend Cert):** UI certification
4. **Phase 4 (Infra Cert):** API certification
5. **Phase 5 (Release):** Production deployment

Tu responsabilidad: Verificar que CADA fase cumple sus gates antes de pasar a la siguiente.

---

## ⏱️ CUÁNDO USAR

✅ **USA esta skill en:**
- Phase 2→3 transition (ready for frontend audit?)
- Phase 3→4 transition (ready for infra audit?)
- Phase 4→5 transition (ready for release?)

**Result:** Module passes certification, unlocks next phase

---

## 📋 PHASE GATES

### Phase 1: Discovery ✅ COMPLETE
```
[x] Requirements documented
[x] User stories written
[x] Props/State contract defined
[x] Visual reference available
[x] Root Admin approved
```

### Phase 2: Prototype ✅ COMPLETE
```
[x] Raw implementation done
[x] Story sandbox (Example.tsx) working
[x] Visual refinement done
[x] No tests required yet
```

### Phase 3: Frontend Certification 🔵 TARGET

**Checklist before audit:**
```
[ ] Components follow Brain/Body pattern
[ ] All props typed (no `any`)
[ ] Unit tests ≥80% coverage (Vitest)
[ ] Accessibility 0 violations (Axe)
[ ] Visual regression baseline (Playwright)
[ ] Storybook stories complete (all variants)
[ ] README with component API
[ ] No hardcoding, all props/state clean
```

**Gate:** Auditor review via AUDIT_UI_PROMPT
**Result:** 🔵 Front_Certified marker
**Duration:** 1-2 hours for audit

### Phase 4: Infrastructure Certification 🔵 TARGET

**Checklist before audit:**
```
[ ] Schema in @loopdev/contracts
[ ] API endpoint fully implemented
[ ] Repository dependency and security validation passes
[ ] E2E tests passing (Playwright)
[ ] Multi-tenant verified (RLS working)
[ ] Rate limiting / error handling complete
[ ] README with API spec
[ ] Performance baseline established
```

**Gate:** QA skill review against the infrastructure gates and the applicable
track evidence.
**Result:** 🔵 Infra_Certified marker
**Duration:** 1-2 hours for audit

### Phase 5: Release 📜 FINAL

**Checklist before release:**
```
[ ] Both 🔵 markers present
[ ] CHANGELOG.md updated
[ ] Component registry updated
[ ] Versioning (semver) assigned
[ ] Engineering log entry created
[ ] No breaking changes (or documented)
```

**Gate:** Release manager approval
**Result:** Ready for production
**Duration:** 30 minutes

---

## 🔄 TYPICAL MODULE JOURNEY

```
You build: mod-quant-backtest

Week 1 (Phase 1-2):
  discovery-analysis → contract-definition
  → prototype (labdev/)
  
Week 2 (Phase 3):
  frontend-impl → qa-testing → AUDIT_UI ✅
  Result: 🔵 Front_Certified
  
Week 3 (Phase 4):
  infra-impl → qa-testing → AUDIT_INFRA ✅
  Result: 🔵 Infra_Certified
  
Week 4 (Phase 5):
  Versioning → Registry → Changelog → Release ✅
  Result: 📦 Production module
```

---

## 🔍 WHEN TO USE EACH SKILL

**Phase 1:** skill-discovery
**Phase 2:** skill-frontend-impl + skill-infra-impl  
**Phase 3:** skill-qa-testing → AUDIT_UI_PROMPT → skill-backtest-module (this skill) for verification
**Phase 4:** skill-qa-testing → applicable infrastructure gates →
skill-backtest-module (this skill) for verification
**Phase 5:** Apply the relevant architecture and validation checks through the
repository Skills and active track evidence.

---

## ✅ RESPONSIBILITY

This skill does NOT:
- ❌ Build the component
- ❌ Write the tests
- ❌ Audit (that's auditor's job)
- ❌ Fix issues

This skill DOES:
- ✅ Verify gates before transition
- ✅ Identify blocking issues
- ✅ Guide to next phase
- ✅ Document progress

---

**For full certification gates, see:**
- `/docs/04-governance/COMPONENT_LIFECYCLE.md`
- `/docs/04-governance/AUDIT_UI_PROMPT.md`
- `docs/06-ai-skills/tier-2-domain/QA_TESTING_SKILL.md`
