# 📋 CONTRACT DEFINITION SKILL v1.0

> **Authority:** Platform Engineering
> **Status:** ✅ Published
> **Last Updated:** 2026-03-21
> **Applicable to:** API design, data validation, type safety

---

## 🎯 Rol de la IA

Eres un **Senior Contract Engineer** especializado en definir contratos de datos estables usando Zod y TypeScript. Tu responsabilidad es:

1. **Traducir discovery** en shapes estables de datos
2. **Crear Zod schemas** que validen TODAS las entradas
3. **Definir TypeScript types** para máxima seguridad
4. **Aplicar patrones** de response envelope, paginación, errores
5. **Garantizar multi-tenancy** enforcement en el tipo

Tu output: **Contratos que frontend y backend usan sin cambios**.

---

## ⏱️ CUÁNDO USAR ESTA SKILL

✅ **USA esta skill cuando:**
- Has completado skill-discovery
- Necesitas definir shape de API requests/responses
- Necesitas definir shape de datos en BD
- Necesitas máxima type safety antes de implementar
- Múltiples equipo necesitan coordinar en tipos

❌ **NO uses esta skill cuando:**
- Aún estás explorando opciones (usa discovery primero)
- La feature es trivial (no necesita contrato)
- Ya existe un contrato (usa el existente)

---

## 📥 INPUT (What the Human Provides)

Proporciona SIEMPRE:

```markdown
## Feature Name
[Nombre de la feature]

## Requirements (from Discovery)
[Listado de qué se necesita según discovery]

## Data That Flows
[Qué data entra, qué data sale, qué se guarda]

## Multi-Tenancy Context
[Cómo se relaciona con organization_id]
```

### Ejemplo Input:

```markdown
## Feature: Backtest Results Storage

## Requirements
- Store backtest results with trades, metrics, equity curve
- Result must be queryable after completion
- Users can compare multiple backtests
- Only owner can see their backtests

## Data That Flows
Input (API request): strategy_id, start_date, end_date, organization_id
Processing: Execute strategy, generate trades list, calculate metrics
Output (API response): BacktestResult with all data
Storage: Save to backtests table

## Multi-Tenancy
Belongs to tenant. Each user only sees own backtests. RLS enforced.
```

---

## 📤 OUTPUT (What This Skill Produces)

Entregar SIEMPRE un archivo TypeScript con:

### 1. 📝 REQUEST SCHEMAS

```typescript
// In @loopdev/contracts/src/quant/backtest.ts

// Input validation
export const BacktestRequestSchema = z.object({
  strategy_id: z.string().uuid("Invalid strategy ID"),
  start_date: z.string().datetime("Invalid date format"),
  end_date: z.string().datetime("Invalid date format"),
  organization_id: z.string().uuid("organization_id required for multi-tenancy"),
  
  // Optional filters
  max_trades: z.number().int().positive().optional(),
  include_equity_curve: z.boolean().default(true),
}).strict(); // No unknown fields

export type BacktestRequest = z.infer<typeof BacktestRequestSchema>;
```

### 2. 📊 DATA SCHEMAS

```typescript
// Domain objects in @loopdev/contracts/src/quant/

export const TradeSchema = z.object({
  id: z.string().uuid(),
  entry_time: z.date(),
  entry_price: z.number().positive(),
  exit_time: z.date().nullable(),
  exit_price: z.number().positive().nullable(),
  pnl: z.number(), // in cents: 1000 = $10
  pnl_percent: z.number(),
  duration_hours: z.number(),
  status: z.enum(['OPEN', 'CLOSED']),
});

export type Trade = z.infer<typeof TradeSchema>;

export const MetricsSchema = z.object({
  total_trades: z.number().int().nonnegative(),
  winning_trades: z.number().int().nonnegative(),
  losing_trades: z.number().int().nonnegative(),
  win_rate: z.number().min(0).max(100), // 0-100%
  profit_factor: z.number().positive(),
  sharpe_ratio: z.number(),
  max_drawdown: z.number(),
  total_return: z.number(), // in percent
  avg_win: z.number(),
  avg_loss: z.number(),
});

export type Metrics = z.infer<typeof MetricsSchema>;

export const BacktestResultSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  strategy_id: z.string().uuid(),
  
  // Dates
  start_date: z.date(),
  end_date: z.date(),
  created_at: z.date(),
  
  // Data
  trades: z.array(TradeSchema),
  metrics: MetricsSchema,
  equity_curve: z.array(z.number()).optional(),
  
  // Metadata
  status: z.enum(['COMPLETED', 'FAILED', 'RUNNING']),
  error_message: z.string().nullable(),
});

export type BacktestResult = z.infer<typeof BacktestResultSchema>;
```

### 3. ✅ RESPONSE SCHEMAS (Always use Response Envelope)

```typescript
// Standard LoopDev response pattern

// Success response
export const BacktestSuccessResponseSchema = z.object({
  data: BacktestResultSchema,
  meta: z.object({
    traceId: z.string(),
    timestamp: z.date(),
  }),
});

export type BacktestSuccessResponse = z.infer<typeof BacktestSuccessResponseSchema>;

// Error response (standard LoopDev pattern)
export const BacktestErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(), // e.g., "INVALID_STRATEGY"
    message: z.string(), // Human-readable
    details: z.array(z.object({
      field: z.string(),
      issue: z.string(),
    })).optional(),
    traceId: z.string(),
  }),
});

export type BacktestErrorResponse = z.infer<typeof BacktestErrorResponseSchema>;
```

### 4. 🔐 MULTI-TENANCY ENFORCEMENT

Siempre incluir organization_id en TODOS los objetos:

```typescript
// ✅ CORRECT: organization_id in every domain object
export const ResourceSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(), // ← REQUIRED
  // ... other fields
});

// ❌ WRONG: Missing organization_id
export const BadResourceSchema = z.object({
  id: z.string().uuid(),
  // ... other fields (no organization_id = data leak risk!)
});
```

### 5. 📋 ERROR CODES (Standard LoopDev)

```typescript
// Define all possible errors for this feature
export const BacktestErrorCodesSchema = z.enum([
  'INVALID_REQUEST',        // 400 - Bad input
  'UNAUTHORIZED',           // 401 - Not authenticated
  'FORBIDDEN',              // 403 - No permission to see this
  'STRATEGY_NOT_FOUND',     // 404 - Strategy doesn't exist
  'BACKTEST_FAILED',        // 500 - Execution error
  'RATE_LIMIT_EXCEEDED',    // 429 - Too many requests
]);
```

### 6. 📊 PAGINATION SCHEMA (if applicable)

```typescript
// For list endpoints
export const PaginationMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive().max(100),
  total: z.number().int().nonnegative(),
  traceId: z.string(),
});

export const BacktestListResponseSchema = z.object({
  data: z.array(BacktestResultSchema),
  meta: PaginationMetaSchema,
});
```

### 7. 🔄 FULL CONTRACT FILE STRUCTURE

```typescript
// @loopdev/contracts/src/quant/index.ts

import { z } from 'zod';

// ============= REQUESTS =============
export const BacktestRequestSchema = z.object({
  // ... request fields
});
export type BacktestRequest = z.infer<typeof BacktestRequestSchema>;

// ============= RESPONSES =============
export const BacktestResultSchema = z.object({
  // ... result fields
});
export type BacktestResult = z.infer<typeof BacktestResultSchema>;

export const BacktestSuccessResponseSchema = z.object({
  data: BacktestResultSchema,
  meta: z.object({ traceId: z.string() }),
});
export type BacktestSuccessResponse = z.infer<typeof BacktestSuccessResponseSchema>;

export const BacktestErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    traceId: z.string(),
  }),
});
export type BacktestErrorResponse = z.infer<typeof BacktestErrorResponseSchema>;

// ============= EXPORTS =============
export const BacktestContractSchema = z.object({
  request: BacktestRequestSchema,
  response: z.union([BacktestSuccessResponseSchema, BacktestErrorResponseSchema]),
});
export type BacktestContract = z.infer<typeof BacktestContractSchema>;
```

---

## 🛠️ EXECUTION CHECKLIST

### Before Creating Contract
- [ ] Discovery document is complete
- [ ] All data flows understood
- [ ] Multi-tenancy implications clear
- [ ] Error scenarios identified
- [ ] Pagination needs determined

### While Creating Contract
- [ ] Request schema validates ALL inputs
- [ ] Data schema matches domain requirements
- [ ] Response follows envelope pattern
- [ ] organization_id in every domain object
- [ ] Error codes comprehensive
- [ ] All fields have JSDoc comments

### After Creating Contract
- [ ] No `any` types (100% type safe)
- [ ] All arrays have min/max bounds
- [ ] All numbers have positive/negative constraints
- [ ] All strings have format validation
- [ ] Can be parsed without errors
- [ ] Ready for both frontend and backend

---

## 📐 COMMON PATTERNS

### Pattern 1: SIMPLE API (Request → Response)

```typescript
// Simple backtest request
export const SimpleBacktestSchema = z.object({
  strategy_id: z.string().uuid(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  organization_id: z.string().uuid(),
});

// Simple response
export const SimpleBacktestResponseSchema = z.object({
  data: z.object({
    total_trades: z.number(),
    win_rate: z.number(),
    profit_factor: z.number(),
  }),
  meta: z.object({ traceId: z.string() }),
});
```

### Pattern 2: PAGINATED LIST (Request → Array Response)

```typescript
export const ListBacktestsRequestSchema = z.object({
  organization_id: z.string().uuid(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export const ListBacktestsResponseSchema = z.object({
  data: z.array(BacktestResultSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    traceId: z.string(),
  }),
});
```

### Pattern 3: ASYNC JOB (Request → Status Response)

```typescript
export const AsyncBacktestRequestSchema = z.object({
  strategy_id: z.string().uuid(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  organization_id: z.string().uuid(),
});

export const AsyncBacktestResponseSchema = z.object({
  data: z.object({
    job_id: z.string().uuid(),
    status: z.enum(['QUEUED', 'RUNNING', 'COMPLETED', 'FAILED']),
    progress_percent: z.number().min(0).max(100),
    result: BacktestResultSchema.nullable(),
  }),
  meta: z.object({ traceId: z.string() }),
});
```

---

## 🚨 COMMON MISTAKES (What NOT to do)

❌ **DON'T:** Use `z.any()` or loose types
```typescript
WRONG:
export const RequestSchema = z.object({
  data: z.any(), // ❌ No validation!
});

RIGHT:
export const RequestSchema = z.object({
  data: z.object({
    value: z.number(),
    label: z.string(),
  }),
});
```

❌ **DON'T:** Forget organization_id for multi-tenancy
```typescript
WRONG:
export const ResultSchema = z.object({
  id: z.string().uuid(),
  trades: z.array(TradeSchema),
  // ❌ Missing organization_id = data leak!
});

RIGHT:
export const ResultSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(), // ✅ Required
  trades: z.array(TradeSchema),
});
```

❌ **DON'T:** Use loosey constraints on numbers/strings
```typescript
WRONG:
export const MetricsSchema = z.object({
  win_rate: z.number(), // Could be -999 or 99999!
  profit_factor: z.number(), // Could be negative!
});

RIGHT:
export const MetricsSchema = z.object({
  win_rate: z.number().min(0).max(100), // 0-100%
  profit_factor: z.number().positive(), // > 0
});
```

---

## ✅ SUCCESS CRITERIA

Contract is complete when:

1. ✅ Request schema validates all inputs
2. ✅ Response follows envelope pattern
3. ✅ All domain types defined with Zod
4. ✅ organization_id in every domain object
5. ✅ 0 `any` types
6. ✅ All fields have constraints (min/max, positive, format)
7. ✅ Error codes comprehensive
8. ✅ Ready for implementation (frontend + backend can use)

---

## 📍 WHERE TO PUT CONTRACTS

**Location:** `/packages/contracts/src/`

**Structure:**
```
contracts/
├── src/
│   ├── index.ts              (exports all)
│   ├── foundations/
│   │   ├── api.ts           (Response envelope)
│   │   ├── common.ts        (UUID, date, money formats)
│   │   └── error.ts         (Error shapes)
│   └── quant/
│       ├── index.ts
│       ├── backtest.ts      ← Your contract here
│       ├── signal.ts
│       └── strategy.ts
```

---

## 🎓 NEXT SKILL

After contract is defined and approved:
→ **Move to skill-frontend-impl** (for UI) or **skill-infra-impl** (for API)

Both can work in parallel once contract is locked.

---

**Skill Version:** 1.0
**Created:** 2026-03-21
**Authority:** Platform Engineering
**Status:** ✅ Ready to Use
