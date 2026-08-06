# 🔧 INFRA IMPLEMENTATION SKILL v1.0

> **Authority:** Platform Engineering
> **Status:** ✅ Published (Existing in INFRA_ENGINEERING_PROMPT.md)
> **Last Updated:** 2026-03-21
> **Link to Full Authority:** `/docs/05-operations/INFRA_ENGINEERING_PROMPT.md`

---

## 🎯 Quick Summary

This skill tells you how to build **production-grade backend APIs, services, and databases** following LoopDev standards:

✅ **Contract-First:** Request/response shapes from contracts
✅ **API Standards:** Response envelope pattern, error handling
✅ **Multi-Tenancy:** RLS enforcement, tenant_id validation
✅ **Type Safety:** Zod validation on all inputs
✅ **Security:** No direct DB access from handlers
✅ **Testing:** E2E tests (Playwright), security scan (Snyk)

---

## ⏱️ WHEN TO USE

Use this skill after:
1. ✅ Discovery is complete
2. ✅ Contract is defined
3. ✅ Frontend is ready (or will be concurrent)

Result:
- API endpoint handles all request shapes
- RLS enforced on all queries
- Input validated with Zod
- Errors follow standard envelope
- Ready for infra audit
- E2E tests passing

---

## 📥 INPUT

```markdown
## Endpoint Name
[What API are we building - POST /api/quant/backtest]

## Contract/Types
[Link to Zod schema or TypeScript interface]

## Database
[Existing tables to use, new tables needed]

## Security
[RLS requirements, permission model]
```

---

## 📤 OUTPUT

Complete API implementation with:

```
api/quant/
├── route.ts                   (API handler - POST, GET, etc)
├── service.ts                 (Business logic)
├── db.ts                      (Database queries)
├── route.test.ts              (E2E tests - Playwright)
└── types.ts                   (Internal types if needed)
```

### Handler (route.ts) - Contains:
- Request validation with Zod
- Error handling
- Response envelope creation
- Calls to service layer

### Service (service.ts) - Contains:
- Business logic
- Data transformations
- No database access (calls db layer)
- No HTTP concerns

### Database (db.ts) - Contains:
- Prisma queries or raw SQL
- RLS enforcement (WHERE tenant_id = X)
- No business logic

---

## 🛡️ SECURITY REQUIREMENTS

Every endpoint MUST have:

- [x] Input validation (Zod schema)
- [x] tenant_id extraction from JWT
- [x] RLS on all DB queries (WHERE tenant_id = X)
- [x] Permission check (user owns resource)
- [x] Error handling (no data leaks in messages)
- [x] Rate limiting (if needed)
- [x] Audit logging (who did what when)

---

## 🧪 QUALITY GATES

Before marking ready:

- [x] Input validation comprehensive (Zod)
- [x] RLS on every DB query
- [x] No direct tenant access possible
- [x] Error handling standard (envelope)
- [x] E2E tests passing (Playwright)
- [x] Security scan 0 critical (Snyk)
- [x] Response envelope correct
- [x] README with API spec

---

## 🔗 FULL AUTHORITY DOCUMENT

For complete details, patterns, and examples:
**→ Read `/docs/05-operations/INFRA_ENGINEERING_PROMPT.md`**

That document covers:
- API design patterns
- Contract-first approach
- Multi-tenancy enforcement
- Error handling standard
- Security best practices
- Testing strategy (Playwright)
- Certification gates

---

## 🎓 NEXT SKILL

After infra implementation is complete:
→ **skill-qa-testing** for comprehensive E2E test suite

---

**Note:** This is a wrapper skill. The full authority is in INFRA_ENGINEERING_PROMPT.md
**Status:** ✅ Ready to Use
**Authority:** Platform Engineering
