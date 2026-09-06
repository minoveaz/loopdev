# CRM Suite security alignment

**Phase:** F2
**Snapshot:** 2026-09-06
**Base:** `origin/develop@6255ec367c245067ec92f4bf1a7a74f91c0cb53f`

## Existing security implementation

`origin/develop` already contains the security hardening required by the closure plan:

- `20260902000000_crm_security_hardening.sql`
  - organization-scoped composite foreign keys;
  - workspace-aware policy predicates;
  - separate `SELECT`, `INSERT`, `UPDATE` and `DELETE` policies;
  - `crm.read` for reads and `crm.manage` for mutations;
  - `communications.read` and `communications.send` separation;
  - revoked table privileges for append-only activities and audit events;
  - append-only triggers for `crm_activities` and `crm_audit_events`.
- `20260906000000_crm_daily_operation_hardening.sql`
  - authenticated actor assignment;
  - private note redaction through `crm_notes_visible`;
  - audit triggers for Lead and Opportunity mutations;
  - transactional Lead conversion.
- `20260907000000_crm_lead_assignment_scope.sql`
  - tenant-aware Lead assignment constraint.

## Security test evidence

`supabase/tests/database/005_crm_security.sql` declares a 47-assertion pgTAP plan and covers:

- policy presence by operation;
- scoped foreign keys;
- absence of `ALL` policies for CRM;
- append-only audit restrictions;
- organization A/B read isolation;
- unauthorized insert/update behavior;
- audit privilege revocation;
- Lead conversion and stage mutation controls;
- cross-tenant foreign-key rejection.

`supabase/tests/database/006_crm_tasks_contract.sql` covers the Tasks contract and timeline
restrictions.

## Findings

| Finding                                      | Result                                                    | Action                                    |
| -------------------------------------------- | --------------------------------------------------------- | ----------------------------------------- |
| Generic `FOR ALL` CRM policy from foundation | Remediated by `20260902000000_crm_security_hardening.sql` | Verify against a clean database           |
| Cross-tenant CRM relationships               | Composite organization FKs present                        | Execute positive/negative isolation tests |
| Audit and activity mutation                  | Table privileges revoked and append-only triggers present | Execute update/delete denial tests        |
| Private Notes exposure                       | `crm_notes_visible` redacts private bodies                | Verify PostgREST/view access              |
| Authenticated actor attribution              | Trigger-based assignment present                          | Verify insert/update actor tests          |
| Reproducible two-tenant dataset              | Test fixture exists in `005_crm_security.sql`             | Run pgTAP through Supabase                |

## Validation status

- [x] Security migration inventory reviewed.
- [x] RLS policy generation reviewed.
- [x] Composite tenant-FK coverage reviewed.
- [x] Append-only trigger and privilege strategy reviewed.
- [x] pgTAP test plan and assertions reviewed.
- [x] `005_crm_security.sql` executed against a clean Supabase database: 47/47 passed.
- [x] `006_crm_tasks_contract.sql` executed against a clean Supabase database: 30/30 passed.
- [x] Cross-tenant runtime checks executed with Auth/RLS enabled through the security suite.
- [x] Reset and CRM seed applied from `origin/develop@6255ec36`.

## Exit decision

F2 is **ready for explicit closure approval**. The clean `origin/develop` snapshot reset
successfully and all 77 targeted pgTAP assertions passed. No new security migration is warranted;
adding one after this validation would create duplicate policy history and increase migration risk.
