# DEPRECATED: INFRA IMPLEMENTATION SKILL v1.0

> Superseded by security-review and active validation workflows.

> **Authority:** Platform Engineering
> **Status:** ✅ Published authority
> **Last Updated:** 2026-08-13
> **Authority:** This skill is self-contained; the former infrastructure
> prompts are deprecated historical references.

---

## 🎯 Quick Summary

This skill tells you how to build **production-grade backend APIs, services, and databases** following LoopDev standards:

✅ **Contract-First:** Request/response shapes from contracts
✅ **API Standards:** Response envelope pattern, error handling
✅ **Organizations:** RLS enforcement, organization_id validation
✅ **Type Safety:** Zod validation on all inputs
✅ **Security:** No direct DB access from handlers
✅ **Testing:** E2E and visual tests (Playwright)

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
[What API are we building - e.g. POST /api/example]

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
api/example/
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
- RLS enforcement through organization membership and organization_id
- No business logic

---

## 🛡️ SECURITY REQUIREMENTS

Every endpoint MUST have:

- [x] Input validation (Zod schema)
- [x] organization_id resolved from the authenticated organization context
- [x] RLS on all organization-owned queries
- [x] Permission check (user owns resource)
- [x] Error handling (no data leaks in messages)
- [x] Rate limiting (if needed)
- [x] Audit logging (who did what when)

---

## 🧪 QUALITY GATES

Before marking ready:

- [x] Input validation comprehensive (Zod)
- [x] RLS on every DB query
- [x] No cross-organization access possible
- [x] Error handling standard (envelope)
- [x] E2E tests passing (Playwright)
- [x] Repository security and type validation gates pass
- [x] Response envelope correct
- [x] README with API spec

---

## 🔗 AUTHORITATIVE REFERENCES

- API patterns: `docs/03-platform/API_STANDARDS.md`
- Organization and RLS rules: `docs/03-platform/MULTI_TENANCY_STRATEGY.md`
  and `docs/03-platform/DATABASE_SECURITY_RLS.md`
- Readiness and completion: `docs/03-platform/INFRA_DEFINITION_OF_READY.md`
  and `docs/03-platform/INFRA_DEFINITION_OF_DONE.md`
- Execution scope and evidence: the applicable track under `tracks/`

---

## 🎓 NEXT SKILL

After infra implementation is complete:
→ **skill-qa-testing** for comprehensive E2E test suite

---

**Status:** ✅ Ready to Use
**Authority:** Platform Engineering
