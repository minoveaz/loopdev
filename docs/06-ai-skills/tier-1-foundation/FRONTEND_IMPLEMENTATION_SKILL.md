# 🎨 FRONTEND IMPLEMENTATION SKILL v1.0

> **Authority:** Design System + Frontend Engineering
> **Status:** ✅ Published (Existing in FRONT_ENGINEERING_PROMPT.md)
> **Last Updated:** 2026-03-21
> **Link to Full Authority:** `/docs/05-operations/FRONT_ENGINEERING_PROMPT.md`

---

## 🎯 Quick Summary

This skill tells you how to build **production-grade UI components** following LoopDev standards:

✅ **Brain/Body Pattern:** Separate logic (hooks) from presentation (components)
✅ **Type Safety:** 100% TypeScript, no `any` types
✅ **Testing:** Unit tests (Vitest), accessibility (Axe), visual (Chromatic)
✅ **Theming:** Dynamic theme support (light/dark)
✅ **Accessibility:** WCAG AA compliant, keyboard navigable
✅ **Documentation:** Storybook stories for all variants

---

## ⏱️ WHEN TO USE

Use this skill after:
1. ✅ Discovery is complete
2. ✅ Contract is defined
3. ✅ Backend/API is ready (or will be concurrent)

Result:
- Component follows all LoopDev patterns
- Ready for design system audit
- Test coverage ≥80%
- Zero accessibility violations

---

## 📥 INPUT

```markdown
## Component Name
[Name of UI component]

## Contract/Types
[Link to Zod schema or TypeScript interface]

## Wireframe/Design
[Link to Figma or description]

## Phase
[Phase 2 (prototype) or Phase 3+ (certification)]
```

---

## 📤 OUTPUT

Complete component folder with:

```
components/X/
├── useX.ts                    (Brain - all logic)
├── index.tsx                  (Body - pure presentation)
├── types.ts                   (Local types if needed)
├── X.test.tsx                 (Unit tests - Vitest)
├── X.stories.tsx              (Storybook)
├── X.a11y.test.tsx           (Accessibility - Axe)
└── README.md                  (API documentation)
```

### Brain (useX.ts) - Contains:
- State management with `useState`
- Side effects with `useEffect`
- API calls with fetch/axios
- Data transformations
- Event handlers
- 100% business logic, 0% JSX

### Body (index.tsx) - Contains:
- Pure presentation
- Props destructuring
- JSX only
- No logic (calls from brain via props)
- All styling/theming

---

## 🧪 QUALITY GATES

Before marking ready:

- [x] Unit tests ≥80% coverage (Vitest)
- [x] Accessibility 0 violations (Axe)
- [x] Visual regression baseline (Chromatic)
- [x] Props typed (no `any`)
- [x] Storybook stories complete
- [x] Theme-aware (dark/light)
- [x] Keyboard navigable
- [x] README with API

---

## 🔗 FULL AUTHORITY DOCUMENT

For complete details, patterns, and examples:
**→ Read `/docs/05-operations/FRONT_ENGINEERING_PROMPT.md`**

That document covers:
- 5 Required reference documents
- Trinity Pattern (Architecture + Quality + Data)
- Detailed implementation checklist
- Testing strategy
- Component composition protocol
- Storybook requirements
- Certification gates

---

## 🎓 NEXT SKILL

After frontend implementation is complete:
→ **skill-qa-testing** for comprehensive test suite

---

**Note:** This is a wrapper skill. The full authority is in FRONT_ENGINEERING_PROMPT.md
**Status:** ✅ Ready to Use
**Authority:** Design System Engineering
