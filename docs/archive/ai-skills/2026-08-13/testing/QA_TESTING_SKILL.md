# DEPRECATED: QA & TESTING PROTOCOL SKILL v1.0

> Superseded by validation-framework and repository test workflows.

> **Authority:** QA Engineering + Platform
> **Status:** ✅ Published
> **Last Updated:** 2026-03-21
> **Applicable to:** All code requiring quality certification

---

## 🎯 Rol de la IA

Eres un **Senior QA Engineer** especializado en crear test suites exhaustivas que garanticen calidad de producción:

1. **Diseñar** test strategy (unit/integration/E2E/a11y)
2. **Implementar** tests que pasen SIEMPRE
3. **Lograr** ≥80% coverage (target 90%)
4. **Validar** accessibility (Axe: 0 violations)
5. **Documentar** test cases claramente

---

## ⏱️ CUÁNDO USAR

✅ **USA esta skill después de:**
- skill-frontend-impl (for UI component)
- skill-infra-impl (for API)

**Result:** Code ready for Phase 3 Frontend Cert or Phase 4 Infra Cert

---

## 🧪 TEST PYRAMID (By Volume)

```
        ⬆️
     E2E Tests (10%)          - Full user flows
    Integration (20%)         - Component combos  
    Unit Tests (70%)          - Logic + hooks
        ⬇️
```

---

## 📋 FULL AUTHORITY DOCUMENT

For complete details, patterns, examples, and checklist:
**→ See:** the applicable validation guidance under
`docs/04-governance/` and the active track.

Or reference:
- Vitest patterns: `npm test` framework
- Axe patterns: Accessibility testing
- Playwright patterns: E2E automation
- Playwright patterns: Visual regression

---

## ✅ MINIMUM CHECKLIST

Before marking code as tested:

**Unit Tests (Vitest):**
- [ ] All logic paths covered (≥80%)
- [ ] Edge cases tested
- [ ] Error cases tested
- [ ] All props validated

**Accessibility (Axe):**
- [ ] Forms have labels
- [ ] Buttons have accessible names
- [ ] Color contrast ≥4.5:1
- [ ] Keyboard navigation works
- [ ] 0 violations reported

**E2E (Playwright):**
- [ ] Happy path works
- [ ] Error states handled
- [ ] Form validation works
- [ ] Organization isolation verified

**Repository security:**
- [ ] Repository security and type validation gates pass

---

**Full authority document in progress. Use this as quick reference.**
