# Release Readiness Skill

**Tier**: 3 (Governance)  
**Role**: Release Manager, DevOps Engineer  
**When to Use**: Final gate, 24 hours before production deployment  
**Time**: ~2 hours  
**Output**: Release checklist + deployment plan + rollback procedure  
**Authority**: Deployment SOP, Incident Response, Production Runbooks

---

## When to Use This Skill

### ✅ Use this when:
- All Tier 3 checks complete (Architecture, Security, Performance)
- Ready to deploy to production
- 24 hours before intended release
- After staging tests pass
- Before announcing new feature to users

### ❌ Don't use this when:
- Still fixing bugs (use earlier skills)
- Code not yet tested (go back to QA)
- Security issues found (use Security skill)

---

## Input

### What You Need to Provide

```yaml
Feature Description:
  Name: Bitcoin RSI Mean Reversion Strategy
  Module: mod-quant-core
  Tier 3 Status: ✅ All checks passed
  Risk Level: Medium (affects trading)

Release Plan:
  Deployment Window: Saturday 2026-03-22, 02:00 UTC
  Duration: 30 minutes expected
  Rollback Complexity: Medium
  Customer Impact: 500+ active traders

Code Status:
  Architecture Review: ✅ Passed
  Security Audit: ✅ Passed
  Performance Optimization: ✅ Passed
  Staging Tests: ✅ All green

Team Readiness:
  Release Manager: Available
  Backend Engineer: On-call
  Frontend Engineer: On-call
  DevOps: On-call
```

---

## The Release Readiness Checklist

### 1. Pre-Deployment Validation

#### 1.1 Code Status

**What to check**: Code is ready for production

```yaml
# ✅ CORRECT: Code status
Branch Status: feature/bitcoin-rsi
  ├─ All tests: ✅ PASSING (847/847 tests)
  ├─ Linting: ✅ PASSING (0 errors, 0 warnings)
  ├─ Type checking: ✅ PASSING (0 errors)
  ├─ Code review: ✅ APPROVED (2 reviewers)
  ├─ Architecture Review: ✅ PASSED
  ├─ Security Audit: ✅ PASSED
  ├─ Performance Check: ✅ PASSED
  └─ Staging Deploy: ✅ SUCCESS

# ❌ WRONG: Not ready
  ├─ Tests: ⚠️ 12 FAILING
  ├─ Linting: ⚠️ 5 ERRORS
  ├─ Security Audit: ❌ CRITICAL ISSUES UNFIXED
```

**Checklist**:
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All E2E tests passing (on staging)
- [ ] Linting passing (0 errors)
- [ ] Type checking passing (0 errors)
- [ ] Code review approved (2+ reviewers)
- [ ] All Tier 3 checks passed
- [ ] Staging deployment successful
- [ ] Staging tests run 100% successfully

#### 1.2 Database Migration Status

**What to check**: Database schema changes are ready

```typescript
// ✅ CORRECT: Backward-compatible migration
// Migrations are additive, never breaking

// migration_2026_03_21_add_strategy_type.sql
ALTER TABLE strategy
ADD COLUMN type VARCHAR(50) DEFAULT 'unknown';

// ✅ CORRECT: Rollback plan documented
-- Rollback
ALTER TABLE strategy
DROP COLUMN type;

// Migration applied in staging: ✅
// Rollback tested in staging: ✅

// ❌ WRONG: Breaking migration
ALTER TABLE strategy
DROP COLUMN old_column;  // ❌ Data loss if rollback needed!

// ❌ WRONG: No rollback plan
-- Migration: Add new table
-- Rollback: ??? (not documented)
```

**Checklist**:
- [ ] All migrations backward-compatible
- [ ] Migrations applied and tested in staging
- [ ] Rollback scripts written and tested
- [ ] Data validation passed (no corrupt data)
- [ ] Backup taken before migration
- [ ] No schema changes to multi-tenant tables that could leak data

---

### 2. Deployment Preparation

#### 2.1 Deployment Plan

**What to check**: Deployment procedure is documented and rehearsed

```markdown
# Deployment Plan: Bitcoin RSI Mean Reversion Strategy

## Timeline
- **Deployment Window**: Saturday 2026-03-22, 02:00 UTC (low traffic window)
- **Expected Duration**: 30 minutes
- **Rollback Threshold**: 5 minutes if critical issues

## Steps

### 1. Pre-Deployment (23:30 UTC)
- [ ] Notify team (Slack message with runbook)
- [ ] Health check production systems
  - [ ] API responding
  - [ ] Database responsive
  - [ ] Cache healthy
  - [ ] WebSocket connections stable
- [ ] Take final backup
  - [ ] Database backup started
  - [ ] Backup verified
- [ ] Scale up infrastructure if needed
  - [ ] Run load test on staging
  - [ ] Increase server capacity
  - [ ] Monitor resource usage

### 2. Deploy to Canary (02:00 UTC)
- [ ] Deploy to canary instance (5% traffic)
  - [ ] Frontend bundle deployed
  - [ ] Backend API deployed
  - [ ] Database migrations run
- [ ] Monitor canary for 5 minutes
  - [ ] Error rate normal? <0.1%
  - [ ] Response times normal? <200ms
  - [ ] CPU usage normal? <60%

### 3. Deploy to Production (02:05 UTC)
- [ ] If canary healthy, deploy to full production
  - [ ] Blue-green deployment (0 downtime)
  - [ ] Old version (blue) still running
  - [ ] New version (green) in parallel
- [ ] Route 100% traffic to new version (green)

### 4. Verify Deployment (02:15 UTC)
- [ ] Health checks pass
  - [ ] All API endpoints responding
  - [ ] Database queries working
  - [ ] Real-time updates flowing
  - [ ] Metrics dashboard updating
- [ ] Smoke tests pass
  - [ ] Can create strategy? ✅
  - [ ] Can run backtest? ✅
  - [ ] Can receive signals? ✅
  - [ ] Can place trade? ✅

### 5. Post-Deployment (02:30 UTC)
- [ ] Monitor for 1 hour
  - [ ] Watch error rates
  - [ ] Watch response times
  - [ ] Watch resource usage
- [ ] Announce to users
  - [ ] In-app notification
  - [ ] Slack channel announcement
  - [ ] Email to beta users
- [ ] Keep rollback ready for 24 hours

## Monitoring During Deployment

Watch these metrics in real-time:
```
API Error Rate: <0.5% (target <0.1%)
API P99 Response Time: <500ms
Database Connections: <70% of pool
Memory Usage: <75%
CPU Usage: <70%
Queue Depth (if async): <10k
WebSocket Connections: Stable
```

## Rollback Condition

Trigger rollback immediately if:
- [ ] Error rate >1% for >1 minute
- [ ] P99 response time >1 second
- [ ] Any 5xx error spike
- [ ] Database connection pool exhausted
- [ ] Out of memory
- [ ] WebSocket disconnections >5%
- [ ] Any security alert

### How to Rollback

```bash
# 1. Stop routing to new version (green)
kubectl patch service api -p '{"spec":{"selector":{"version":"blue"}}}'

# 2. Wait for connections to drain (max 30 seconds)
sleep 30

# 3. Verify old version is healthy
curl https://api.loopdev.com/health

# 4. Kill new version
kubectl delete deployment api-green

# 5. Alert team
# "Rolled back to previous version due to [reason]"
```

Rollback Time: <5 minutes
Data Loss: None (DB is still on new schema)

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Database migration fails | CRITICAL | Tested in staging, rollback script ready |
| API suddenly slow | HIGH | Canary deployment monitors first, scale ready |
| Data leak in feature | CRITICAL | Security audit passed, RLS verified |
| Trading algo fails | HIGH | Backtests passed, signals validated in staging |

---

✅ **Plan reviewed and approved by**: Tech Lead, Release Manager, DevOps
```

**Checklist**:
- [ ] Deployment plan documented (see above)
- [ ] Rollback procedure documented
- [ ] Team aware of deployment window
- [ ] Deployment procedure rehearsed (at least reviewed)
- [ ] Canary deployment configured
- [ ] Blue-green deployment ready (if applicable)
- [ ] Healthcheck scripts ready
- [ ] Rollback scripts tested
- [ ] Communication plan: How to notify users, how to announce

#### 2.2 Monitoring Setup

**What to check**: Monitoring is live and dashboards working

```typescript
// ✅ CORRECT: Monitoring infrastructure ready
export const monitoringChecklist = {
  metrics: [
    'api_requests_total',
    'api_latency_ms',
    'api_errors_total',
    'database_queries_total',
    'database_duration_ms',
    'cache_hit_rate',
    'websocket_connections_active',
    'strategy_signals_received',
    'trade_executions_total',
    'backtest_duration_ms',
  ],
  dashboards: [
    'System Health',
    'API Performance',
    'Database Performance',
    'Trading Module',
    'Error Rate by Endpoint',
  ],
  alerts: [
    'API error rate >1%',
    'P99 latency >1 second',
    'Database queries >5 seconds',
    'WebSocket connections drop >10%',
    'Trade execution failure',
    'Backtest timeout',
  ]
};

// ✅ CORRECT: Tests are monitoring-aware
export const POST = async (req: Request) => {
  const start = Date.now();
  
  try {
    const strategy = StrategySchema.parse(req.body);
    const created = await createStrategy(strategy);
    
    metrics.recordCreateStrategyLatency(Date.now() - start);
    metrics.incrementCreateStrategySuccess();
    
    return Response.json(created);
  } catch (error) {
    metrics.incrementCreateStrategyError();
    throw error;
  }
};

// ✅ CORRECT: Dashboard refreshes frequently
// In monitoring system (Datadog, New Relic, etc)
Dashboard updated: Every 10 seconds
Historical data: Last 24 hours
Alert notification: Immediate (Slack, PagerDuty)

// ❌ WRONG: No monitoring setup
// Deploy and hope nothing breaks!

// ❌ WRONG: Monitoring but not visible
// Metrics collected but no dashboard
// Team can't see problems
```

**Checklist**:
- [ ] All critical metrics being collected
- [ ] Dashboards created and tested
- [ ] Alerts configured for critical thresholds
- [ ] Alert routing configured (Slack, PagerDuty, etc)
- [ ] Dashboard accessible to team
- [ ] Historical data retention adequate (min 30 days)
- [ ] Monitoring test: Can manually trigger an alert?

**Key Metrics to Monitor**:
```
System Health
- API response time (P50, P95, P99)
- Error rate (per endpoint)
- Database connection pool usage
- Memory usage
- CPU usage

Application Metrics
- Strategies created/updated
- Backtests run
- Signals received
- Trades executed
- Cache hit rate

Business Metrics
- Active users
- Revenue impact
- Feature usage
```

---

### 3. Runbooks & Documentation

#### 3.1 Runbooks

**What to check**: Procedures for common scenarios are documented

```markdown
# Runbook: Bitcoin RSI Strategy Deployment

## Normal Startup Checklist
- [ ] All services started
- [ ] Database migrations completed
- [ ] Cache warmed
- [ ] Health checks passing
- [ ] Team notified in Slack

## During Deployment

### If API gets slow
1. Check dashboard for bottleneck
2. Check slow query log
3. If database: Run ANALYZE
4. If API: Check CPU/memory
5. If not resolved in 2 min: ROLLBACK

### If trades start failing
1. Check backtest service health
2. Check exchange API connectivity
3. Verify RLS enforcement (multi-tenant issue?)
4. If not resolved in 2 min: ROLLBACK

### If signals not flowing
1. Check WebSocket connections
2. Check signal service logs
3. Check cache for stale data
4. If not resolved in 2 min: ROLLBACK

## After Deployment

### Success Criteria
- [ ] Zero errors for 30 minutes
- [ ] Response times stable
- [ ] No rollback needed
- [ ] Users reporting feature works

### Post-Mortem (if issues found)
- [ ] What went wrong?
- [ ] What could have caught this before?
- [ ] How to prevent next time?
- [ ] Update runbook with findings

## Escalation
- Tier 1: Team lead (first 5 minutes)
- Tier 2: VP Engineering (if not resolved in 10 min)
- Tier 3: CEO (if customer-facing issue)
```

**Checklist**:
- [ ] Runbook for normal startup
- [ ] Runbook for common issues
- [ ] Rollback procedure documented
- [ ] Incident response procedure documented
- [ ] Who to escalate to and when
- [ ] Runbooks tested and reviewed
- [ ] Team trained on runbooks

#### 3.2 Feature Announcement

**What to check**: Users are informed about new feature

```markdown
# Feature Announcement: Bitcoin RSI Mean Reversion Strategy

## In-App Message
---
🎉 **New Feature Available**

Bitcoin RSI Mean Reversion Strategy is now live!

This strategy automatically trades Bitcoin based on RSI divergence. Start with $100 paper trading to test.

[Try it now] [Learn more]
---

## Email to Beta Users
Subject: Bitcoin RSI Strategy - Now Available for All Users

Dear {{name}},

The Bitcoin RSI Mean Reversion Strategy is now available!

Based on feedback from beta testing:
- 87% of testers found signals useful
- Average ROI in backtests: +12% (30 days)
- Tested across 5+ market conditions

[Get Started] [View Backtests] [Read Documentation]

## Slack Announcement
```
@here 📢 Bitcoin RSI Mean Reversion Strategy is LIVE

New trading strategy just deployed to production:
• Entry: RSI < 30 (oversold)
• Exit: RSI > 70 (overbought)
• ~15% historical win rate

Start paper trading or run a backtest:
/strategy bitcoin-rsi

Questions? #trading-strategies
```

## Documentation Link
Updated: /docs/strategies/bitcoin-rsi.md
- How it works (simple explanation)
- Backtest results (5-year history)
- Risk factors (drawdown, max loss)
- FAQ

## Support Plan
- FAQ channel: #bitcoin-rsi-faq
- Support team trained: ✅
- Escalation process: Defined
```

**Checklist**:
- [ ] In-app message written and tested
- [ ] Email announcement drafted
- [ ] Slack announcement written
- [ ] Documentation link working
- [ ] Support team trained
- [ ] FAQ created with common questions
- [ ] FAQ link easy to find

---

### 4. Incident Response Preparation

#### 4.1 Incident Response Plan

**What to check**: Team knows what to do if something goes wrong

```markdown
# Incident Response Plan

## If Feature Causes Outage

### Immediately (0-5 min)
1. [ ] Declare incident in #incidents Slack channel
2. [ ] Start war room (Zoom: [link])
3. [ ] Assign roles:
   - Incident Commander: [Name]
   - Responder 1 (Backend): [Name]
   - Responder 2 (DevOps): [Name]
   - Communicator: [Name]

### Decision Point (5 min)
- Can we fix in <5 minutes?
  - YES: Fix it, test it, deploy it
  - NO: ROLLBACK (proceed to step below)

### If Rollback Needed
1. [ ] Incident Commander approves rollback
2. [ ] Execute rollback procedure (see above)
3. [ ] Verify old version healthy
4. [ ] Send status update to #incidents
5. [ ] Notify customers via in-app banner

### Post-Incident (24 hours later)
1. [ ] Write incident report: What happened? Why?
2. [ ] Identify root cause
3. [ ] Create action items to prevent recurrence
4. [ ] Update runbooks with learnings
5. [ ] Share learning with team
```

**Checklist**:
- [ ] Incident response plan documented
- [ ] Escalation paths clear
- [ ] War room link ready
- [ ] Incident template prepared
- [ ] Team trained on response procedure
- [ ] Communication template written

#### 4.2 Health Checks

**What to check**: Automated health checks run before deployment

```bash
# ✅ CORRECT: Health check script
#!/bin/bash

echo "🏥 Running pre-deployment health checks..."

# 1. API Health
if ! curl -f https://api.loopdev.com/health; then
  echo "❌ API health check failed"
  exit 1
fi
echo "✅ API healthy"

# 2. Database
if ! psql -d $DATABASE_URL -c "SELECT 1"; then
  echo "❌ Database connection failed"
  exit 1
fi
echo "✅ Database healthy"

# 3. Cache
if ! redis-cli ping | grep -q "PONG"; then
  echo "❌ Cache unhealthy"
  exit 1
fi
echo "✅ Cache healthy"

# 4. Staging Tests
if ! pnpm e2e:desktop -- --url=https://staging.loopdev.com; then
  echo "❌ E2E tests failed"
  exit 1
fi
echo "✅ E2E tests passed"

echo ""
echo "✅ All health checks passed! Safe to deploy."

# ❌ WRONG: No health checks
# Deploy directly without verification
```

**Checklist**:
- [ ] Health check script exists
- [ ] Health checks run before deployment
- [ ] All checks must pass before proceeding
- [ ] Health check output logs for debugging
- [ ] Health checks cover: API, DB, Cache, Tests

---

### 5. Data Backup & Recovery

#### 5.1 Backup Verification

**What to check**: Backups are recent and restorable

```bash
# ✅ CORRECT: Backup verification
echo "🔄 Verifying backups..."

# 1. Check backup exists and is recent
BACKUP_TIME=$(stat -f%m /backups/db_latest.sql)
NOW=$(date +%s)
BACKUP_AGE=$((NOW - BACKUP_TIME))

if [ $BACKUP_AGE -gt 3600 ]; then
  echo "❌ Backup is too old (${BACKUP_AGE}s)"
  exit 1
fi
echo "✅ Backup is fresh (${BACKUP_AGE}s old)"

# 2. Test restore
echo "Testing restore..."
psql -d test_db -f /backups/db_latest.sql > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "❌ Backup restore test failed"
  exit 1
fi
echo "✅ Backup is restorable"

# 3. Verify data integrity
SELECT COUNT(*) FROM strategy > 100  # Should have data
if [ $? -ne 0 ]; then
  echo "❌ Backup data integrity check failed"
  exit 1
fi
echo "✅ Backup data is valid"

echo "✅ Backup verification passed!"

# ❌ WRONG: No backup verification
# Hope that backup works when needed!
```

**Checklist**:
- [ ] Backup taken within last 1 hour
- [ ] Backup tested (restore test successful)
- [ ] Backup verified (integrity check passed)
- [ ] Backup location documented
- [ ] Recovery time tested (<10 minutes)
- [ ] Team knows how to restore from backup

---

### 6. Team Communication & Readiness

#### 6.1 Team Notification

**What to check**: Team is aware and ready

```markdown
# Team Notification Checklist

## 72 Hours Before Release
- [ ] Schedule deployment window
- [ ] Email team: "Deployment scheduled for Saturday 02:00 UTC"
- [ ] Share release notes
- [ ] Share deployment plan
- [ ] Answer team questions

## 24 Hours Before Release
- [ ] Slack reminder: "Deployment tomorrow, be prepared"
- [ ] Confirm all team members available
- [ ] Test communication channels (Slack, Zoom, PagerDuty)
- [ ] Run final health check
- [ ] Review rollback procedure

## 1 Hour Before Release
- [ ] Final pre-deployment meeting (5 min)
  - Confirm: Deployment window
  - Confirm: Team availability
  - Confirm: Monitoring is live
  - Confirm: Rollback ready
- [ ] Deployment checklist reviewed
- [ ] Team in Slack #incidents channel

## During Release
- [ ] Incident Commander leading
- [ ] Real-time updates in Slack
- [ ] Monitor dashboard visible to all
- [ ] Everyone on Zoom (if needed)

## After Release
- [ ] Celebration message (if successful)
- [ ] Thank you message to team
- [ ] Post-mortem scheduled (if issues)
- [ ] Update runbooks if needed
```

**Checklist**:
- [ ] Team notified 72 hours before
- [ ] Team notified 24 hours before
- [ ] Team notified 1 hour before
- [ ] All team members confirmed available
- [ ] All team members understand roles
- [ ] Communication channels tested

---

## Output

### What You Generate

```markdown
# Release Readiness Report

## Feature: Bitcoin RSI Mean Reversion Strategy
**Date**: 2026-03-21  
**Release Manager**: DevOps Lead  
**Status**: ✅ READY FOR PRODUCTION

---

## Pre-Deployment Validation

### Code Status
✅ ALL CHECKS PASSED

- Tests: 847/847 passing ✅
- Linting: 0 errors ✅
- Type checking: 0 errors ✅
- Code reviews: 2 approved ✅
- Architecture Review: ✅ PASSED
- Security Audit: ✅ PASSED
- Performance Check: ✅ PASSED
- Staging tests: 100% passing ✅

### Database Migrations
✅ READY

- Migration 001: Add strategy_type column
  - ✅ Applied in staging
  - ✅ Rollback tested
  - ✅ Data validated
  
- Migration 002: Create metrics table
  - ✅ Applied in staging
  - ✅ Rollback tested
  - ✅ Data validated

All migrations: Backward compatible ✅

### Staging Verification
✅ COMPLETE

- Staging deployment: ✅ Successful (12 hours ago)
- Staging tests: ✅ All passing
- Smoke tests: ✅ All passing
  - Create strategy? ✅
  - Run backtest? ✅
  - Receive signals? ✅
  - Place trade? ✅
- 1 hour monitoring: ✅ No errors

---

## Deployment Preparation

### Deployment Plan
✅ DOCUMENTED AND REVIEWED

- Plan location: /docs/release-plans/bitcoin-rsi-strategy-v1.md
- Deployment window: Saturday 2026-03-22, 02:00 UTC (30 min expected)
- Deployment strategy: Blue-green (0 downtime)
- Rollback threshold: 5 minutes if critical issues
- Rollback time: <5 minutes
- Approved by: Tech Lead, DevOps

### Monitoring Setup
✅ LIVE AND TESTED

Dashboards:
- System Health: https://dashboard.loopdev.com/system
- API Performance: https://dashboard.loopdev.com/api
- Trading Module: https://dashboard.loopdev.com/trading
- Error Rate: https://dashboard.loopdev.com/errors

Alerts configured:
- API error rate >1% → Slack #incidents
- P99 latency >1 second → Slack #incidents
- Database error → Slack #incidents
- WebSocket drop >10% → Slack #incidents

All monitoring: ✅ Tested with manual triggers

### Runbooks
✅ DOCUMENTED

- Normal startup checklist: ✅
- Common issues: ✅
- Rollback procedure: ✅
- Incident response: ✅
- All runbooks: Reviewed by team ✅

---

## Team Readiness

### Team Notification
✅ COMPLETE

- 72 hours notice: Sent 2026-03-19 ✅
- 24 hours notice: Scheduled for 2026-03-21 ✅
- 1 hour notice: Scheduled for 2026-03-22 01:00 ✅

### Team Availability
✅ CONFIRMED

| Role | Name | Available | Backup |
|------|------|-----------|--------|
| Incident Commander | Alex | ✅ | Jordan |
| Backend Engineer | Sam | ✅ | Taylor |
| DevOps | Morgan | ✅ | Casey |
| Communicator | Riley | ✅ | Alex |

### Communication Channels
✅ TESTED

- Slack #incidents: ✅ All team members
- Zoom war room: https://zoom.us/... ✅
- PagerDuty: ✅ Alerts configured
- SMS alerts: ✅ Configured

---

## Risk Assessment

### Risks & Mitigation

| Risk | Severity | Mitigation | Status |
|------|----------|-----------|--------|
| DB migration fails | CRITICAL | Tested in staging, rollback ready | ✅ Mitigated |
| API gets slow | HIGH | Canary deployment, autoscaling | ✅ Mitigated |
| Signals not flowing | HIGH | WebSocket tests, fallback in place | ✅ Mitigated |
| Data loss | CRITICAL | Backup tested, recovery <10min | ✅ Mitigated |
| Security issue | CRITICAL | Security audit passed, RLS verified | ✅ Mitigated |
| Load spike | MEDIUM | Capacity planned for 2x current load | ✅ Mitigated |

### Overall Risk Level: LOW
- All pre-deployment checks passed ✅
- All mitigations in place ✅
- Team ready and available ✅
- Rollback ready ✅

---

## Backup & Recovery

### Backup Verification
✅ PASSED

- Database backup: 2026-03-21 23:45 UTC (15 min old)
- Backup size: 2.3 GB
- Restore test: ✅ Successful (8 min 30 sec)
- Data integrity check: ✅ Passed
- Recovery point objective (RPO): <15 minutes
- Recovery time objective (RTO): <10 minutes

---

## Final Sign-Off

### Approval Checklist
- [x] All code reviews approved
- [x] All tests passing
- [x] All Tier 3 checks passed
- [x] Monitoring live
- [x] Team notified and ready
- [x] Runbooks documented
- [x] Backup verified
- [x] Rollback ready
- [x] Deployment plan reviewed

### Release Authorization
✅ **APPROVED FOR PRODUCTION DEPLOYMENT**

**Authorized by**: Release Manager  
**Date**: 2026-03-21 23:00 UTC  
**Deployment Time**: 2026-03-22 02:00 UTC  

---

## Next Steps

1. **23:00 UTC** - Final team meeting, confirm all is ready
2. **01:00 UTC** - Team assembles in war room
3. **01:45 UTC** - Final health checks
4. **02:00 UTC** - Begin deployment
5. **02:30 UTC** - Verify production
6. **03:30 UTC** - Team standown (if all good)
7. **Next day** - Post-mortem (if issues found)

---

**Ready to ship! Good luck! 🚀**
```

---

## Validation Checklist

```
Pre-Deployment
- [ ] All tests passing (100%)
- [ ] All Tier 3 checks passed
- [ ] Code reviews approved (2+)
- [ ] Staging deployment successful
- [ ] Staging tests 100% passing
- [ ] Database migrations tested and rollback verified
- [ ] Data backup fresh and restorable

Deployment Preparation
- [ ] Deployment plan documented
- [ ] Rollback procedure documented and tested
- [ ] Monitoring dashboards live and tested
- [ ] Alerts configured and tested
- [ ] Health check script ready
- [ ] Canary deployment configured

Runbooks & Documentation
- [ ] Runbooks written and reviewed
- [ ] Incident response plan documented
- [ ] Feature announcement written
- [ ] FAQ prepared
- [ ] Support team trained

Team Readiness
- [ ] Team notified (72h, 24h, 1h notices)
- [ ] Team members confirmed available
- [ ] Roles assigned and understood
- [ ] Communication channels tested
- [ ] War room link ready
- [ ] Incident commander named

Backup & Recovery
- [ ] Database backup recent (<1 hour)
- [ ] Backup restore tested
- [ ] Backup data integrity verified
- [ ] Recovery procedure documented
- [ ] Recovery time <10 minutes

Final Sign-Off
- [ ] All checklist items complete
- [ ] No critical issues blocking release
- [ ] Team confident in deployment
- [ ] Release manager approved

OVERALL
- [ ] Ready to deploy: YES / NO
- [ ] Issues blocking release: 0 / ___
- [ ] Go/No-Go decision: GO
```

---

## Common Issues & Fixes

### Issue: Backup Too Old

**Symptom**: Last backup is 6 hours old

**Why it matters**: If rollback needed, lose 6 hours of data

**Fix**: Take fresh backup before deployment

```bash
pg_dump $DATABASE_URL > backup_latest.sql
# Verify restore works
psql -d test_db -f backup_latest.sql
```

---

### Issue: Team Not Available

**Symptom**: Key team member has another meeting

**Why it matters**: Can't resolve issues during deployment

**Fix**: Reschedule deployment, confirm ALL available

---

### Issue: Monitoring Dashboard Not Live

**Symptom**: Realized during deployment that dashboards don't load

**Why it matters**: Can't see if deployment is working

**Fix**: Test all dashboards 24 hours before

```bash
curl https://dashboard.loopdev.com/health
# Should return 200 OK with current data
```

---

## Authority & Escalation

**Primary**: Release Manager  
**Secondary**: DevOps Engineer  
**Escalation**: VP Engineering (if rollback needed)  
**Executive**: CTO (if customer-facing issue)

Questions? Contact your Release Manager or DevOps team.

---

**End of Tier 3 Skills** ✅

After this skill passes, feature is approved for production deployment.

---

**Summary of Tier 3 Journey**:
1. ✅ Architecture Review → Code is correct
2. ✅ Security Audit → Code is safe
3. ✅ Performance Optimization → Code is fast
4. ✅ Release Readiness → Code is ready to ship

**Now**: Deploy with confidence! 🚀
