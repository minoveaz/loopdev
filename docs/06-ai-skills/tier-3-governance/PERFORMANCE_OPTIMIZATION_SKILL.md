# Performance Optimization Skill

**Tier**: 3 (Governance)  
**Role**: Performance Engineer, Frontend/Backend Lead  
**When to Use**: After feature code is complete, before release  
**Time**: ~2 hours  
**Output**: Performance optimization report + improvements  
**Authority**: Web Vitals, Lighthouse, Query optimization, Bundle analysis

---

## When to Use This Skill

### ✅ Use this when:
- Feature code is complete and tested
- After Security Audit passes
- Before release to production
- Adding new features that might impact performance
- When performance metrics degrade
- Before deploying to new regions

### ❌ Don't use this when:
- Still writing code (optimize after done)
- Just looking for bugs (use QA skill)
- Checking security (use Security skill)

---

## Input

### What You Need to Provide

```yaml
Feature Description:
  Name: Bitcoin RSI Mean Reversion Strategy
  Module: mod-quant-core
  Components Changed: strategy, backtest, dashboard
  External APIs: Binance, Kraken
  Database Queries: ~10 new queries

Code Location:
  Repo: /Users/minoveaz/Documents/Proyectos/loopdev
  Branch: feature/bitcoin-rsi
  Frontend: /apps/loopdev-os/src/app/quant-ops/
  Backend: /modules/mod-quant-core/src/

Performance Context:
  Expected Users: 500-1000
  Data Volume: ~10k strategies per tenant
  Update Frequency: Real-time (every 5 minutes)
  SLA: <3s page load, <100ms API response
```

---

## The Performance Optimization Checklist

### 1. Frontend Performance

#### 1.1 Bundle Size Analysis

**What to check**: JavaScript bundle is not too large

```bash
# ✅ CORRECT: Bundle <2MB total
npm run build
# Output:
# Route (compress) Size
# /_app                20 kB
# /quant-ops          45 kB
# /strategy/[id]      32 kB
# Total: ~200 kB (acceptable)

# ❌ WRONG: Bundle too large
# Total: 5.2 MB  (too heavy!)

# ✅ CORRECT: Check bundle with analysis
npx bundle-analyzer
# Shows what's in the bundle
```

**Checklist**:
- [ ] Total JS <2MB (gzipped)
- [ ] Page bundles <100KB each
- [ ] No duplicate dependencies
- [ ] No dev dependencies in production
- [ ] Tree-shaking enabled (in build config)
- [ ] Dynamic imports for large features

**Tools**:
```bash
npm run analyze  # Analyze bundle
npm run lighthouse  # Performance audit
```

**Typical Size Budget**:
```
Total JS: 200-300 KB (target)
App shell: 50 KB
Feature bundles: 30-50 KB each
Vendor: 100 KB (React, UI libs, etc)
```

#### 1.2 Lighthouse Score

**What to check**: Lighthouse score >90

```bash
# ✅ CORRECT: Run Lighthouse
npm run lighthouse

# Output:
# Performance:   92 ✅
# Accessibility: 95 ✅
# Best Practices: 90 ✅
# SEO:           88 ⚠️
# PWA:           85 ⚠️

# ❌ WRONG: Performance <90
# Performance: 65 ❌
```

**Lighthouse Audit Areas**:
- **Performance**: Largest Contentful Paint (LCP), First Input Delay (FID), Cumulative Layout Shift (CLS)
- **Accessibility**: ARIA, semantic HTML, color contrast
- **Best Practices**: HTTPS, console errors, outdated libraries
- **SEO**: Meta tags, mobile-friendly
- **PWA**: Service worker, installable

**Checklist**:
- [ ] Performance >90
- [ ] Accessibility >90
- [ ] Best Practices >90
- [ ] LCP <2.5 seconds
- [ ] FID <100 milliseconds
- [ ] CLS <0.1

**Common Issues & Fixes**:
```typescript
// ❌ Problem: Large image without optimization
<img src="/large-image.jpg" />  // 2MB unoptimized

// ✅ Solution: Use Next.js Image with optimization
import Image from 'next/image';
<Image
  src="/large-image.jpg"
  width={800}
  height={600}
  priority  // or lazy for below-fold
/>

// ❌ Problem: Render-blocking JavaScript
<script src="/huge-library.js"></script>

// ✅ Solution: Load asynchronously
<script async src="/huge-library.js"></script>
// Or dynamic import
const Component = dynamic(() => import('../components/Heavy'), {
  loading: () => <Skeleton />,
  ssr: false
});

// ❌ Problem: Unoptimized bundle
import { Chart } from 'chart-library';  // 500KB library

// ✅ Solution: Lazy load
const Chart = dynamic(() => import('chart-library'), { ssr: false });
```

#### 1.3 Core Web Vitals

**What to check**: User experience metrics are good

```
LCP (Largest Contentful Paint)
  ✅ Good: <2.5 seconds
  ⚠️ Needs Improvement: 2.5-4 seconds
  ❌ Poor: >4 seconds

FID (First Input Delay)
  ✅ Good: <100 milliseconds
  ⚠️ Needs Improvement: 100-300 milliseconds
  ❌ Poor: >300 milliseconds

CLS (Cumulative Layout Shift)
  ✅ Good: <0.1
  ⚠️ Needs Improvement: 0.1-0.25
  ❌ Poor: >0.25
```

**Checklist**:
- [ ] LCP <2.5s (images optimized, not above-fold)
- [ ] FID <100ms (no blocking JavaScript)
- [ ] CLS <0.1 (no layout shifts, size images)
- [ ] Measure in Chrome DevTools (Lighthouse tab)
- [ ] Test on slow 3G (Chrome DevTools)
- [ ] Test on mobile device (not just desktop)

---

### 2. Backend Performance

#### 2.1 Query Optimization

**What to check**: Database queries are efficient (no N+1)

```typescript
// ❌ WRONG: N+1 query problem
const strategies = await db.strategy.findMany();  // Query 1
for (const strategy of strategies) {
  const signals = await db.signal.findMany({      // Query 2, 3, 4, ...
    where: { strategy_id: strategy.id }
  });
  strategy.signals = signals;
}
// If 100 strategies: 101 queries! 💥

// ✅ CORRECT: JOIN or batch load
const strategies = await db.strategy.findMany({
  include: {
    signals: {
      where: { /* filter if needed */ }
    }
  }
});
// Only 1 query! ✅

// ✅ CORRECT: Using Prisma batch load if needed
const strategiesWithSignals = await Promise.all(
  strategies.map(s => 
    db.signal.findMany({ where: { strategy_id: s.id } })
  )
);
// 1 query + parallel batch queries (still better than N+1)
```

**Tools**:
```bash
# Analyze query performance
# In PostgreSQL:
EXPLAIN ANALYZE SELECT ...;  # Shows query plan

# Check for N+1:
# Enable query logging, count queries during request
// In .env
DATABASE_LOG_QUERIES=true

# Then check request logs:
npm run dev  # Run locally
# Look for repeated similar queries
```

**Checklist**:
- [ ] No N+1 queries (use JOIN/include)
- [ ] Queries use appropriate indexes
- [ ] Large result sets paginated (limit 100 default)
- [ ] EXPLAIN ANALYZE reviewed for slow queries
- [ ] Database connection pooled (not creating new connections per request)
- [ ] Query response time <100ms (per query)

**Common Patterns**:
```typescript
// Pattern 1: Using include (Prisma)
const strategies = await db.strategy.findMany({
  include: {
    user: true,           // Related data
    signals: { take: 10 } // Paginate related
  }
});

// Pattern 2: Using select (for specific fields)
const strategies = await db.strategy.findMany({
  select: {
    id: true,
    name: true,
    user: { select: { id: true, email: true } }
  }
});

// Pattern 3: Pagination
const strategies = await db.strategy.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { created_at: 'desc' }
});
```

#### 2.2 API Response Time

**What to check**: API endpoints respond quickly

```bash
# ✅ Target response times
GET  /api/strategy/:id     → <50ms
GET  /api/strategy          → <100ms
POST /api/strategy          → <500ms
GET  /api/signals/:id       → <100ms
POST /api/backtest          → <2000ms (heavy computation)

# ❌ Problem response times
GET  /api/strategy/123      → 2000ms (too slow!)
POST /api/backtest          → 5000ms (timeout!)

# ✅ CORRECT: Profile with curl
curl -w "@curl-format.txt" https://api.example.com/api/strategy

# ✅ CORRECT: Use monitoring
// In Next.js API route
export const runtime = 'nodejs';

export const GET = async (req: Request) => {
  const start = Date.now();
  const result = await expensiveQuery();
  const duration = Date.now() - start;
  
  logger.info('API_RESPONSE', {
    endpoint: '/api/strategy',
    duration,  // Log it
    status: 200
  });
  
  if (duration > 1000) {
    logger.warn('SLOW_API', { endpoint, duration });
  }
  
  return Response.json(result);
};
```

**Checklist**:
- [ ] All endpoints <500ms (except heavy computation)
- [ ] Database queries <100ms
- [ ] External API calls don't block response (queue if needed)
- [ ] Monitoring in place to detect slow endpoints
- [ ] Caching used for frequently accessed data

---

### 3. Caching Strategy

**What to check**: Caching is properly implemented

```typescript
// ✅ CORRECT: Cache expensive calculations
const STRATEGY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getStrategy = async (strategyId: string) => {
  // Check cache first
  const cached = await cache.get(`strategy:${strategyId}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch from DB
  const strategy = await db.strategy.findUnique({
    where: { id: strategyId }
  });
  
  // Cache for 5 minutes
  await cache.set(
    `strategy:${strategyId}`,
    JSON.stringify(strategy),
    STRATEGY_CACHE_TTL
  );
  
  return strategy;
};

// ✅ CORRECT: Invalidate cache on update
export const updateStrategy = async (strategyId: string, updates: any) => {
  const updated = await db.strategy.update({
    where: { id: strategyId },
    data: updates
  });
  
  // Invalidate cache
  await cache.delete(`strategy:${strategyId}`);
  
  return updated;
};

// ❌ WRONG: No caching for expensive queries
export const getMetrics = async (strategyId: string) => {
  // This query joins 5 tables and takes 500ms
  const metrics = await db.metric.findMany({
    where: { strategy_id: strategyId },
    include: {
      trades: true,
      signals: true,
      calculations: true,
      // ... more joins
    }
  });
  return metrics;  // Called every 5 seconds!
};

// ❌ WRONG: Cache not invalidated
export const updateStrategy = async (strategyId: string, updates: any) => {
  await db.strategy.update({
    where: { id: strategyId },
    data: updates
  });
  // Forgot to invalidate cache!
  // Old data still returned
};
```

**Cache Layers**:
```
1. HTTP Cache (Browser)
   - Static assets: 1 year
   - API responses: 5 minutes or less
   
2. CDN Cache (Edge)
   - Images: 1 month
   - CSS/JS: 1 year
   - Dynamic: 1 minute
   
3. Application Cache (Redis)
   - Expensive queries: 5 minutes
   - Computed metrics: 1 minute
   
4. Database Cache (Query results)
   - Indexes
   - Query plans
```

**Checklist**:
- [ ] HTTP cache headers set (Cache-Control, ETag)
- [ ] Redis or similar for hot data
- [ ] Cache invalidation on updates
- [ ] Cache hit rate >80% (measure it)
- [ ] Cache expiration time reasonable
- [ ] No stale data returned

---

### 4. Database Optimization

**What to check**: Database is performing well

```sql
-- ✅ CORRECT: Indexes on frequently queried columns
CREATE INDEX idx_strategy_tenant_id ON strategy(tenant_id);
CREATE INDEX idx_signal_strategy_id ON signal(strategy_id);
CREATE INDEX idx_signal_timestamp ON signal(timestamp DESC);

-- ❌ WRONG: Too many indexes (slows writes)
-- ❌ WRONG: Missing indexes (slows reads)

-- ✅ CORRECT: Check query plan
EXPLAIN ANALYZE
SELECT * FROM strategy
WHERE tenant_id = '...' AND created_at > NOW() - INTERVAL '30 days';

-- Output should show index being used:
-- Index Scan using idx_strategy_tenant_id

-- ❌ WRONG: Full table scan (slow)
-- Seq Scan on strategy (cost 0 .. 1000)
```

**Checklist**:
- [ ] Indexes on foreign keys (tenant_id, user_id, strategy_id)
- [ ] Indexes on sort columns (created_at, updated_at)
- [ ] EXPLAIN ANALYZE reviewed for slow queries
- [ ] Connection pooling configured
- [ ] Database statistics up to date (ANALYZE)
- [ ] Regular VACUUM to prevent bloat

---

### 5. Real-Time Data Optimization

**What to check**: Real-time updates don't overwhelm the system

```typescript
// ✅ CORRECT: Batch updates instead of per-signal
export const updateMetrics = async (signals: Signal[]) => {
  // Every 5 seconds, batch all signal updates
  const batched = signals.reduce((acc, signal) => {
    const key = signal.strategy_id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(signal);
    return acc;
  }, {});
  
  for (const [strategyId, items] of Object.entries(batched)) {
    await updateStrategyMetrics(strategyId, items);
  }
};

// ❌ WRONG: Update immediately on each signal (too many writes)
websocket.on('signal', async (signal: Signal) => {
  await db.metric.update({  // ❌ Every signal triggers DB write!
    where: { strategy_id: signal.strategy_id },
    data: { last_signal: signal.value }
  });
});

// ✅ CORRECT: Throttle WebSocket updates
export const streamMetrics = async (strategyId: string, sendUpdate: Function) => {
  let lastUpdate = 0;
  const THROTTLE_MS = 1000;  // Max once per second
  
  const listener = (metric: Metric) => {
    const now = Date.now();
    if (now - lastUpdate > THROTTLE_MS) {
      sendUpdate(metric);
      lastUpdate = now;
    }
  };
  
  subscribeToMetrics(strategyId, listener);
};
```

**Checklist**:
- [ ] WebSocket messages throttled (not every event)
- [ ] Updates batched (not individual inserts)
- [ ] Real-time data cached in memory
- [ ] Message queue if processing slow (SQS, Bull, etc)
- [ ] Monitoring for queue depth

---

## Output

### What You Generate

```markdown
# Performance Optimization Report

## Feature: Bitcoin RSI Mean Reversion Strategy
**Date**: 2026-03-21  
**Optimizer**: Performance Engineer  
**Status**: ✅ APPROVED | ⚠️ APPROVED WITH OPTIMIZATIONS | ❌ NEEDS WORK

---

## Frontend Performance

### Bundle Size Analysis
✅ PASS - Within budget

Total JavaScript: 285 KB (target: <300 KB)
- App shell: 45 KB
- Quant module: 85 KB
- Strategy component: 62 KB
- Vendor (React, etc): 93 KB

Detailed:
- No duplicate dependencies found
- Tree-shaking enabled
- Dev dependencies not included

### Lighthouse Score
⚠️ PASS WITH OPTIMIZATION SUGGESTED

Performance: 88 (target: >90)
- LCP (Largest Contentful Paint): 2.8s (target: <2.5s)
  Issue: Strategy list image optimization needed
  Fix: Use Next.js Image component with width/height
  
- FID (First Input Delay): 65ms ✅
- CLS (Cumulative Layout Shift): 0.08 ✅

Accessibility: 95 ✅
Best Practices: 92 ✅
SEO: 89 ⚠️

### Recommended Optimizations (non-blocking)
1. Strategy list images: Add width/height attributes (30 min)
2. Remove unused Chart.js library (15 min)
3. Implement lazy loading for signal graphs (1 hour)

Time to implement: ~2 hours
Impact: +2 points on Lighthouse, ~100ms faster LCP

---

## Backend Performance

### API Response Times
✅ PASS - All endpoints fast

GET  /api/strategy/:id           → 45ms ✅
GET  /api/strategy               → 82ms ✅
GET  /api/signals/:id            → 120ms ✅
POST /api/strategy               → 280ms ✅
POST /api/backtest               → 1800ms ✅ (acceptable for heavy computation)

### Query Optimization
✅ PASS - No N+1 queries

Total queries per request:
- GET /strategy/:id  → 2 queries (strategy + user)
- GET /signals/:id   → 1 query (with JOIN)

Sample query analyzed:
```sql
EXPLAIN ANALYZE
SELECT * FROM signal
WHERE strategy_id = '...'
ORDER BY timestamp DESC
LIMIT 100;

Result: Index Scan using idx_signal_strategy_id (good!)
Time: 15ms
```

Database connection pooling: Configured ✅
Pool size: 20 connections ✅

### Database Indexes
✅ PASS - Properly indexed

Indexes present:
- idx_strategy_tenant_id ✅
- idx_signal_strategy_id ✅
- idx_signal_timestamp ✅
- idx_backtest_created_at ✅

All foreign key columns indexed ✅

---

## Caching Strategy

⚠️ PARTIAL - Cache hit rate could be better

### Cache Configuration
- Redis: Configured ✅
- TTL: 5 minutes ✅
- Cache invalidation: On update ✅

### Cache Hit Rates
- Strategy cache: 45% ⚠️ (target: >80%)
  Reason: Strategies updated frequently
  Fix: Selective updates (don't invalidate entire cache)
  
- Signal cache: 85% ✅
- Metrics cache: 92% ✅

### Recommended Fix
```typescript
// Before: Invalidate entire cache
await cache.delete(`strategy:${strategyId}`);

// After: Selective invalidation
await cache.update(`strategy:${strategyId}`, (existing) => ({
  ...existing,
  ...updates  // Only update changed fields
}));
```

Time to implement: 1 hour
Impact: Improve strategy cache hit to 80%+

---

## Real-Time Performance

### WebSocket Traffic
✅ PASS - Well-throttled

Update frequency: 1 update per second (configurable)
Batch size: 1-5 signals per message
Average message size: 150 bytes

Load test (100 concurrent clients):
- Server CPU: 22% ✅
- Memory: 450MB ✅
- Message latency: <200ms ✅

### Monitoring
⚠️ Missing - Add monitoring

Recommended:
```typescript
export const metrics = {
  websocket_connections: gauge,
  message_latency_ms: histogram,
  batch_size: histogram,
  queue_depth: gauge,
};
```

Time to implement: 2 hours
Impact: Production visibility for real-time performance

---

## Summary

### Performance Score: 8.5/10

### Strengths
✅ Bundle size well-managed
✅ API responses fast (<100ms)
✅ No N+1 queries
✅ Caching strategy sound
✅ Real-time updates throttled

### Areas for Improvement
⚠️ Lighthouse score 88 → 90+ (2 point gap)
⚠️ Cache hit rate 45% → 80% (optimization)
⚠️ Real-time monitoring gaps

### Priority Optimizations
1. **HIGH PRIORITY** (blocks release?: NO)
   - LCP optimization (image lazy loading)
   - Time: 30 minutes
   - Impact: +2 Lighthouse points

2. **MEDIUM PRIORITY** (recommended)
   - Cache hit rate optimization
   - Time: 1 hour
   - Impact: Faster repeat visits

3. **LOW PRIORITY** (nice to have)
   - Add monitoring dashboard
   - Time: 2 hours
   - Impact: Production visibility

### Approval Status
✅ **APPROVED** - All performance targets met

Code is ready for production from performance perspective.

### Sign-off
Optimizer: Performance Engineer  
Date: 2026-03-21  
Status: Ready for release readiness check

---

## Next Steps

1. ✅ All optimizations approved
2. Implement optional improvements if time allows
3. Move to Release Readiness Skill (tier-3-governance/RELEASE_READINESS_SKILL.md)
4. Final gate before production deployment
```

---

## Validation Checklist

```
Frontend Performance
- [ ] Bundle size <300 KB (gzipped)
- [ ] Lighthouse score >90
- [ ] LCP <2.5 seconds
- [ ] FID <100 milliseconds
- [ ] CLS <0.1

Backend Performance
- [ ] All APIs <500ms (except heavy computation)
- [ ] Database queries <100ms
- [ ] No N+1 queries
- [ ] Query response time monitored

Database Optimization
- [ ] Indexes on foreign keys
- [ ] Indexes on sort columns
- [ ] EXPLAIN ANALYZE reviewed
- [ ] Connection pooling configured

Caching
- [ ] Cache hit rate >80%
- [ ] TTL reasonable
- [ ] Invalidation on update
- [ ] Redis/cache configured

Real-Time
- [ ] WebSocket updates throttled
- [ ] Batch updates implemented
- [ ] Message latency <200ms
- [ ] Queue depth monitored

Monitoring
- [ ] Performance metrics collected
- [ ] Alerts for slow endpoints
- [ ] Dashboard for visualization

OVERALL
- [ ] Ready for release: YES / NO
- [ ] Optimization issues: 0 / ___
- [ ] Recommended improvements: ___ (nice to have)
```

---

## Common Issues & Fixes

### Issue: N+1 Queries

**Symptom**: 1001 queries for 1000 items

**Root Cause**: Loop fetching related data

**Fix**:
```typescript
// Before
const strategies = await db.strategy.findMany();
for (const s of strategies) {
  s.signals = await db.signal.findMany({ where: { strategy_id: s.id } });
}

// After
const strategies = await db.strategy.findMany({
  include: { signals: true }
});
```

---

### Issue: Large Bundle Size

**Symptom**: JavaScript 5MB (users slow)

**Root Cause**: Bundling all libraries

**Fix**:
```typescript
// Before
import * as ChartLibrary from 'chart-library';  // 500KB

// After
const ChartLibrary = dynamic(
  () => import('chart-library'),
  { ssr: false, loading: () => <Skeleton /> }
);
```

---

### Issue: Slow LCP (Largest Contentful Paint)

**Symptom**: Page takes 4 seconds to render

**Root Cause**: Large unoptimized image above fold

**Fix**:
```typescript
// Before
<img src="/dashboard.png" />  // 2MB, unoptimized

// After
<Image
  src="/dashboard.png"
  width={1200}
  height={600}
  priority  // Load early
/>
```

---

## Authority & Escalation

**Primary**: Performance Engineer  
**Secondary**: Frontend/Backend Leads  
**Escalation**: VP Engineering (if SLA violated)

Questions? Contact your Performance Engineer or review Web Vitals guide.

---

**Next Skill**: Release Readiness Skill  
**When**: After performance check complete  
**Read**: `RELEASE_READINESS_SKILL.md`
