# Architecture Review Skill

**Tier**: 3 (Governance)  
**Role**: Tech Lead, Senior Engineer  
**When to Use**: After code is written, before integration testing  
**Time**: ~2 hours  
**Output**: Architecture validation report + fixes if needed  
**Authority**: ADR-001 through ADR-004 (LoopDev architectural decisions)

---

## When to Use This Skill

### ✅ Use this when:
- Feature code is complete (Tier 2 is done)
- Before code review (want early feedback)
- Before integration testing
- When adding new dependencies
- When creating new modules/components
- When refactoring existing architecture

### ❌ Don't use this when:
- Code is still being written (use during Tier 2 instead)
- Just reviewing for bugs (use QA Testing skill)
- Checking security (use Security Audit skill)
- Checking performance (use Performance Optimization skill)

---

## Input

### What You Need to Provide

```yaml
Feature Description:
  Name: Bitcoin RSI Mean Reversion Strategy
  Module: mod-quant-core
  Files Changed: strategy.ts, indicators.ts, backtest.ts
  New Dependencies: None
  ADRs Affected: ADR-001 (3-layer), ADR-003 (no circular deps)

Code Location:
  Repo: /Users/minoveaz/Documents/Proyectos/loopdev
  Branch: feature/bitcoin-rsi
  Files to Review: /modules/mod-quant-core/**/*.ts

Architecture Context:
  Layer: Module (Business Logic)
  Component Type: Strategy (Quant)
  Lifecycle Phase: Phase 4 (Infra Cert)
  Multi-tenant: Yes (must have organization_id)
```

---

## The Architecture Review Checklist

### 1. ADR Compliance (Architectural Decision Records)

**What to check**: All architecture decisions are documented in ADRs

#### ADR-001: 3-Layer Architecture
```typescript
// ✅ CORRECT: Each layer has clear responsibility
UI Layer:        /ds/packages/ui/src/components/
Module Layer:    /modules/mod-quant-core/src/
App Layer:       /apps/loopdev-os/src/app/

// ❌ WRONG: Module calling App layer directly
strategy.ts:
  import { deploymentConfig } from '../../../apps/loopdev-os/config'
  // Should import from /config/index.ts (module layer)
```

**Checklist**:
- [ ] Code respects 3-layer architecture
- [ ] No UI layer code in modules
- [ ] No App layer code in modules
- [ ] Each layer imports only lower layers
- [ ] ADR-001 is referenced in code comments

#### ADR-002: Admin Hierarchy
```typescript
// ✅ CORRECT: Clear access control
if (user.role === 'admin' || user.role === 'strategy_owner') {
  allowEdit = true;
}

// ❌ WRONG: No role checking
if (user.id === strategy.creator_id) {
  allowEdit = true;  // What about admins? What about org admins?
}
```

**Checklist**:
- [ ] Admin hierarchy is enforced (super_admin > org_admin > admin > user)
- [ ] Access control uses role-based checks
- [ ] No hardcoded IDs in authorization
- [ ] ADR-002 is referenced if changing admin flow

#### ADR-003: No Circular Dependencies (DAG)
```typescript
// ✅ CORRECT: One-way dependency
indicators/atr.ts → calculations/sma.ts
strategy.ts → indicators/atr.ts
// Flow: strategy → indicators → calculations (one way)

// ❌ WRONG: Circular dependency
atr.ts → sma.ts → atr.ts  // CYCLE!
moduleA.ts → moduleB.ts → moduleA.ts
```

**Checklist**:
- [ ] No circular dependencies exist
- [ ] Dependency graph is acyclic (DAG)
- [ ] Can draw dependency tree without loops
- [ ] ADR-003 is referenced
- [ ] Run: `npm run validate:dag` (if available)

#### ADR-004: Contract-First Design
```typescript
// ✅ CORRECT: Zod schema defined first
const StrategySchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),  // Multi-tenant!
  name: z.string(),
  type: z.enum(['rsi', 'macd', 'bollinger']),
  entry_signal: z.number().min(-100).max(100),
  exit_signal: z.number().min(-100).max(100),
  created_at: z.date(),
});

type Strategy = z.infer<typeof StrategySchema>;

// ❌ WRONG: No schema, TypeScript only
type Strategy = {
  id: string;
  name: string;
  type: string;  // What values allowed?
  entry_signal: number;  // What's the valid range?
  // No organization_id!
};
```

**Checklist**:
- [ ] All domain objects have Zod schemas
- [ ] Schemas are in /src/schemas/ or co-located
- [ ] TypeScript types are inferred from Zod (not separate)
- [ ] All user inputs validated against schema
- [ ] ADR-004 is referenced
- [ ] Schema documentation includes examples

---

### 2. Dependency Graph Validation

**What to check**: No circular dependencies, proper layer separation

```typescript
// VALIDATE with this logic:
const deps = {
  'strategy.ts': ['indicators/atr.ts', 'indicators/rsi.ts'],
  'indicators/atr.ts': ['calculations/sma.ts'],
  'indicators/rsi.ts': ['calculations/sma.ts'],
  'calculations/sma.ts': [],  // Leaf node
};

// Build graph and check:
// 1. No cycles: DFS from each node, should never return to itself
// 2. Layer separation: No module imports app, no app imports ui patterns
// 3. Clean contracts: All cross-module communication through schemas
```

**Tools to use**:
```bash
# Check for circular dependencies
npm run validate:circular-deps

# Or manually with depcheck
npx depcheck

# Or visualize with madge
npx madge --image graph.png --format amd src/
```

**Checklist**:
- [ ] Run circular dependency check (0 violations)
- [ ] Visualize dependency graph (if tool available)
- [ ] Verify layer separation (UI → Module → App)
- [ ] Check for test file circular deps (tests can be exempt)
- [ ] Document any "necessary evil" dependencies

---

### 3. Type Safety (Zod Schemas)

**What to check**: Every domain object has a Zod schema

```typescript
// ✅ CORRECT: Complete schema validation
const SignalSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),  // REQUIRED for multi-tenant
  strategy_id: z.string().uuid(),
  timestamp: z.date(),
  value: z.number().min(-100).max(100).describe('RSI value 0-100'),
  action: z.enum(['buy', 'sell', 'hold']),
  confidence: z.number().min(0).max(1),
  metadata: z.record(z.unknown()).optional(),
  created_at: z.date(),
});

type Signal = z.infer<typeof SignalSchema>;

// API validation
export const POST = async (req: Request) => {
  const body = await req.json();
  const signal = SignalSchema.parse(body);  // ← Throws if invalid
  // Now safe to use signal
};

// ❌ WRONG: No schema
type Signal = {
  id: string;
  value: number;  // Could be -500, "abc", null
  action: string;  // Could be anything
};

const signal = JSON.parse(body) as Signal;  // ← Unsafe!
```

**Checklist**:
- [ ] All database entities have Zod schemas
- [ ] All API requests validated with schemas
- [ ] All API responses match schema
- [ ] Schemas include descriptions (.describe())
- [ ] Schemas are tested (unit tests for edge cases)
- [ ] organization_id is required in all multi-tenant schemas
- [ ] Find schemas with: `grep -r "z.object" src/schemas/`

---

### 4. Design Patterns (LoopDev Standards)

**What to check**: Code follows LoopDev patterns from documentation

#### Pattern: Brain/Body Component (Frontend)
```typescript
// ✅ CORRECT: Separated concerns
// BotCard.tsx (Brain - data, logic)
export const BotCard = ({ botId }: { botId: string }) => {
  const [bot, setBot] = useState<Bot | null>(null);
  useEffect(() => {
    fetchBot(botId).then(setBot);
  }, [botId]);
  return <BotCardUI bot={bot} onPause={...} />;
};

// BotCardUI.tsx (Body - presentation only)
export const BotCardUI = ({ bot, onPause }: BotCardUIProps) => {
  return (
    <div className="bot-card">
      <h2>{bot.name}</h2>
      <button onClick={onPause}>Pause</button>
    </div>
  );
};

// ❌ WRONG: Mixed concerns (all in one component)
export const BotCard = ({ botId }: { botId: string }) => {
  const [bot, setBot] = useState<Bot | null>(null);
  useEffect(() => {
    fetchBot(botId).then(setBot);
  }, [botId]);
  return (
    <div className="bot-card">
      <h2>{bot.name}</h2>
      <button onClick={() => pauseBot(botId)}>Pause</button>
    </div>
  );  // Data fetching + rendering in same component
};
```

**Checklist**:
- [ ] Components split into Brain (logic) + Body (UI)
- [ ] Brain fetches data, manages state
- [ ] Body receives props, renders only
- [ ] No API calls in Body components
- [ ] Naming: `ComponentName` (Brain) + `ComponentNameUI` (Body)

#### Pattern: Response Envelope (API)
```typescript
// ✅ CORRECT: Consistent envelope
export const GET = async (req: Request) => {
  const items = await db.strategy.findMany({
    where: { organization_id }
  });
  return Response.json({
    data: items,
    meta: {
      page: 1,
      limit: 50,
      total: items.length,
      traceId: generateTraceId(),
    }
  });
};

// ❌ WRONG: Inconsistent response
export const GET = async (req: Request) => {
  const items = await db.strategy.findMany(...);
  return Response.json(items);  // No envelope!
};

export const POST = async (req: Request) => {
  const result = await db.strategy.create(...);
  return Response.json({ success: true, item: result });  // Different envelope!
};
```

**Checklist**:
- [ ] All API responses use response envelope
- [ ] Envelope format: `{ data: T, meta: { page, limit, total, traceId } }`
- [ ] Consistent across all endpoints
- [ ] traceId logged for debugging
- [ ] Matches response.ts utility (check /utils/response.ts)

#### Pattern: RLS (Row-Level Security)
```typescript
// ✅ CORRECT: Every query filters by organization_id
const getUserStrategies = async (userId: string, organizationId: string) => {
  return db.strategy.findMany({
    where: {
      organization_id: organizationId,  // ← REQUIRED
      user_id: userId,
    }
  });
};

const updateStrategy = async (strategyId: string, organizationId: string) => {
  return db.strategy.update({
    where: { id: strategyId },
    data: { updated_at: new Date() }
  });
  // ❌ ERROR: No organization_id check! Could leak data from other tenants
};

// ❌ WRONG: No organization_id filter
const getAllStrategies = async () => {
  return db.strategy.findMany();  // Returns ALL strategies!
};

// ✅ CORRECT: With RLS
const getAllStrategies = async (organizationId: string) => {
  return db.strategy.findMany({
    where: { organization_id: organizationId }
  });
};
```

**Checklist**:
- [ ] Every DB query includes organization_id filter
- [ ] Every API endpoint accepts organization_id (from auth)
- [ ] DB schema has `organization_id` NOT NULL on all tables
- [ ] RLS policy enforced at DB level (PostgreSQL policy if available)
- [ ] Find violations: `grep -r "findMany()" src/ | grep -v organization_id`

---

### 5. Module Structure

**What to check**: Module follows LoopDev module standard

```
✅ CORRECT Module Structure
modules/mod-quant-core/
├── src/
│   ├── schemas/           ← All Zod schemas
│   │   ├── strategy.ts
│   │   ├── signal.ts
│   │   └── backtest.ts
│   ├── services/          ← Business logic
│   │   ├── strategyService.ts
│   │   ├── backtestService.ts
│   │   └── __tests__/
│   ├── indicators/        ← Domain-specific algorithms
│   │   ├── rsi.ts
│   │   ├── atr.ts
│   │   └── __tests__/
│   ├── utils/             ← Helper functions
│   │   ├── calculations.ts
│   │   └── __tests__/
│   ├── types.ts           ← Re-exports from Zod (DO NOT ADD TYPES HERE)
│   └── index.ts           ← Public API
├── tests/
│   ├── integration/       ← Integration tests
│   └── e2e/               ← E2E tests
├── package.json
├── tsconfig.json
├── README.md
└── CHANGELOG.md

❌ WRONG Module Structure
modules/mod-quant-core/
├── strategy.ts            ← No folder organization
├── signal.ts
├── rsi.ts
├── atr.ts
├── types.ts               ← Custom TypeScript types (not Zod!)
├── types2.ts              ← Multiple type files
└── everything-else.ts
```

**Checklist**:
- [ ] Schemas in `src/schemas/` folder
- [ ] Services in `src/services/` folder
- [ ] Domain logic separated by concern
- [ ] Types only in `src/types.ts` (re-exports from Zod)
- [ ] No custom TypeScript types (use Zod)
- [ ] Tests co-located with code or in `tests/` folder
- [ ] Public API exported from `src/index.ts`
- [ ] README documents the module
- [ ] CHANGELOG tracks changes

---

### 6. Code Quality Standards

**What to check**: Code meets LoopDev quality standards

```typescript
// ✅ CORRECT: Well-documented, clear intent
/**
 * Calculate RSI (Relative Strength Index)
 * @param prices Array of closing prices (oldest first)
 * @param period Number of periods (default: 14)
 * @returns RSI value (0-100)
 * @throws Error if prices.length < period + 1
 */
export const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length < period + 1) {
    throw new Error(`Need at least ${period + 1} prices, got ${prices.length}`);
  }
  // Implementation...
};

// ✅ CORRECT: Error handling
try {
  const rsi = calculateRSI(prices, 14);
  signal.value = rsi;
} catch (error) {
  logger.error('RSI calculation failed', { error, prices: prices.length });
  // Don't silently fail!
  throw new Error('Unable to calculate signal');
}

// ❌ WRONG: No documentation
const calcRSI = (p, n) => {
  // Complex algorithm with no explanation
  return rsi;
};

// ❌ WRONG: Silent failures
const rsi = calculateRSI(prices, 14);  // What if it fails?
signal.value = rsi ?? 50;  // Using fallback without logging
```

**Checklist**:
- [ ] Functions have JSDoc comments
- [ ] Complex logic is documented
- [ ] Error messages are descriptive
- [ ] No silent failures (catch and log)
- [ ] No console.log in production code
- [ ] Use logger.info/warn/error instead
- [ ] Constants extracted (no magic numbers)
- [ ] Naming is clear (not `x`, `y`, `temp`)

---

## Output

### What You Generate

```markdown
# Architecture Review Report

## Feature: Bitcoin RSI Mean Reversion Strategy
**Date**: 2026-03-21  
**Reviewer**: Tech Lead  
**Status**: ✅ APPROVED | ⚠️ APPROVED WITH ISSUES | ❌ REJECTED

---

## ADR Compliance

### ADR-001: 3-Layer Architecture
✅ PASS - Code respects layer separation

Details:
- Module layer doesn't import app layer
- UI components only in design system
- Clear separation of concerns

### ADR-002: Admin Hierarchy
✅ PASS - Access control enforced

Details:
- Role-based checks present
- Admin hierarchy respected
- No hardcoded IDs in auth

### ADR-003: No Circular Dependencies
⚠️ ISSUE FOUND - Circular dependency detected

Issues:
- indicators/rsi.ts imports calculations/sma.ts
- calculations/sma.ts imports indicators/rsi.ts (indirectly via utils)

Severity: HIGH - Must fix before merge

Fix:
- Move shared logic to separate utility file
- Have both modules import from utility

### ADR-004: Contract-First Design
✅ PASS - All schemas defined

Details:
- 5 Zod schemas created
- All include organization_id
- API validation in place

---

## Dependency Graph

### Graph Visualization
```
strategy.ts
  ├→ indicators/rsi.ts
  │   ├→ calculations/sma.ts ✅
  │   └→ utils/math.ts ✅
  ├→ indicators/atr.ts
  │   ├→ calculations/sma.ts ✅
  │   └→ utils/math.ts ✅
  └→ services/backtestService.ts ✅

No cycles detected ✅
```

---

## Type Safety

Total Zod schemas: 5
- strategySchema ✅
- signalSchema ✅
- backtestSchema ✅
- positionSchema ✅
- metricsSchema ✅

Validation coverage: 100%
All API inputs validated ✅
All API outputs match schema ✅

---

## Design Patterns

### Brain/Body Components
✅ PASS - Properly separated for frontend changes

### Response Envelope
✅ PASS - All endpoints use correct envelope

### RLS (Row-Level Security)
⚠️ ISSUE FOUND - organization_id missing in one query

Issue Location: backtestService.ts, line 45
```typescript
const results = await db.backtest.findMany({
  where: { strategy_id: strategyId }
  // Missing organization_id filter!
});
```

Severity: CRITICAL - Security exposure

Fix:
```typescript
const results = await db.backtest.findMany({
  where: { 
    strategy_id: strategyId,
    organization_id: organizationId  // ← Add this
  }
});
```

---

## Module Structure
✅ PASS - Follows LoopDev standards
- Schemas organized in src/schemas/
- Services in src/services/
- Indicators in src/indicators/
- Public API exposed via src/index.ts

---

## Code Quality
✅ PASS - High standard
- All functions documented
- Error handling present
- No silent failures
- Constants extracted
- Clear naming

---

## Summary

### Issues Found: 2
1. **ADR-003 violation** (Circular dep in calculations)
   - Severity: HIGH
   - Resolution: 1 hour
   
2. **RLS exposure** (Missing organization_id in query)
   - Severity: CRITICAL
   - Resolution: 15 min

### Approval Status
⚠️ **APPROVED WITH FIXES** - Must resolve both issues before merge

### Timeline
- Fix issues: 1.5 hours
- Re-validate: 30 min
- Expected completion: 2 hours

### Sign-off
Reviewer: Tech Lead  
Date: 2026-03-21  
Status: Ready for fixes

---

## Next Steps

1. Fix the 2 issues (see above)
2. Re-run circular dependency check
3. Re-run RLS validation
4. Reply to this review with: "Issues fixed, ready for security audit"
5. Move to Security Audit Skill (tier-3-governance/SECURITY_AUDIT_SKILL.md)
```

---

## Validation Checklist

Use this when reviewing code:

```
ADR-001 (3-Layer)
- [ ] UI layer separated
- [ ] Module layer isolated
- [ ] App layer on top
- [ ] One-way dependencies

ADR-002 (Admin Hierarchy)
- [ ] Super admin → org admin → admin → user
- [ ] Access control enforced
- [ ] No hardcoded IDs

ADR-003 (No Circular Deps)
- [ ] Run circular dep check
- [ ] Review graph visualization
- [ ] Resolve any cycles

ADR-004 (Contract-First)
- [ ] Zod schemas created
- [ ] Types inferred from Zod
- [ ] Validation in place
- [ ] organization_id in all multi-tenant schemas

Dependency Graph
- [ ] No cycles
- [ ] Layer separation clean
- [ ] Contracts consistent

Type Safety
- [ ] All domain objects have Zod schemas
- [ ] 100% API validation coverage
- [ ] Responses match schemas

Design Patterns
- [ ] Brain/Body components if frontend
- [ ] Response envelope on all APIs
- [ ] RLS enforced at DB level

Module Structure
- [ ] Schemas in src/schemas/
- [ ] Services in src/services/
- [ ] Tests co-located or in tests/
- [ ] Public API via src/index.ts

Code Quality
- [ ] Functions documented (JSDoc)
- [ ] Error handling present
- [ ] No silent failures
- [ ] Constants extracted
- [ ] Clear naming

OVERALL
- [ ] Ready to merge: YES / NO
- [ ] Issues to fix: 0 / ___ (list above)
- [ ] Re-validation needed: YES / NO
```

---

## Common Issues & Fixes

### Issue: Circular Dependency

**Symptom**: `circular-dep-found: A → B → A`

**Root Cause**: Two modules import from each other

**Fix Pattern**:
```typescript
// Before: A.ts imports B.ts, B.ts imports A.ts
// A.ts
import { processB } from './B';
export function processA() { return processB(); }

// B.ts
import { processA } from './A';
export function processB() { return processA(); }

// After: Extract common logic to C.ts
// C.ts (new)
export function commonLogic() { /* ... */ }

// A.ts
import { commonLogic } from './C';
export function processA() { return commonLogic(); }

// B.ts
import { commonLogic } from './C';
export function processB() { return commonLogic(); }
```

---

### Issue: Missing organization_id in Query

**Symptom**: Security audit finds data leak potential

**Root Cause**: Multi-tenant query missing WHERE organization_id filter

**Fix Pattern**:
```typescript
// Before: ❌ UNSAFE
const userStrategies = await db.strategy.findMany({
  where: { user_id: userId }  // ❌ Missing organization_id!
});

// After: ✅ SAFE
const userStrategies = await db.strategy.findMany({
  where: { 
    user_id: userId,
    organization_id: organizationId  // ← Always include
  }
});
```

---

### Issue: Missing Zod Schema

**Symptom**: TypeScript doesn't catch invalid input

**Root Cause**: Manual TypeScript types instead of Zod schemas

**Fix Pattern**:
```typescript
// Before: ❌ NO VALIDATION
type Strategy = {
  id: string;
  name: string;
  type: string;
};

// After: ✅ WITH VALIDATION
const StrategySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  type: z.enum(['rsi', 'macd', 'bollinger']),
});

type Strategy = z.infer<typeof StrategySchema>;
```

---

## Authority & Escalation

**Primary**: Tech Lead  
**Secondary**: Senior Engineers  
**Escalation**: CTO (if major ADR violations)

Questions? Contact your Tech Lead or review `/docs/ADR/` for details.

---

**Next Skill**: Security Audit Skill  
**When**: After architecture fixes are done  
**Read**: `SECURITY_AUDIT_SKILL.md`
