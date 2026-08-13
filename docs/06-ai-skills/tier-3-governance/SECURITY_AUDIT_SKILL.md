# Security Audit Skill

> The repository-operational security procedure is
> [`.github/skills/security-review/SKILL.md`](../../../.github/skills/security-review/SKILL.md).
> This document remains the detailed reference and examples; the repository
> Skill is the executable authority for current reviews.

**Tier**: 3 (Governance)  
**Role**: Security Champion, Backend Engineer  
**When to Use**: After code is complete, before QA sign-off  
**Time**: ~2 hours  
**Output**: Security validation report + patches if needed  
**Authority**: OWASP Top 10, CWE (Common Weakness Enumeration)

---

## When to Use This Skill

### ✅ Use this when:
- Feature code is complete (Tier 2 done)
- After Architecture Review passes
- Sensitive data is handled (API keys, passwords, trade data)
- Database queries are finalized
- External APIs are integrated
- Before QA testing

### ❌ Don't use this when:
- Just checking for bugs (use QA Testing skill)
- Checking code style (use linting)
- Checking performance (use Performance Optimization skill)

---

## Input

### What You Need to Provide

```yaml
Feature Description:
  Name: Bitcoin RSI Mean Reversion Strategy
  Module: mod-quant-core
  Handles Sensitive Data: Yes (API keys, trade history)
  External APIs: Binance, Kraken
  Authentication: JWT tokens

Code Location:
  Repo: /Users/minoveaz/Documents/Proyectos/loopdev
  Branch: feature/bitcoin-rsi
  Files: /modules/mod-quant-core/**/*.ts

Security Context:
  Multi-tenant: Yes
  Financial Data: Yes
  User Authentication: Yes
  Admin-only Features: Yes
```

---

## The Security Audit Checklist

### 1. OWASP Top 10 Validation

#### A01: Broken Access Control

**What to check**: Users can only access their own data

```typescript
// ✅ CORRECT: Check user can access
export const getStrategy = async (req: Request, { params }: { params: { id: string } }) => {
  const { userId, organizationId } = await getCurrentUser(req);
  
  const strategy = await db.strategy.findUnique({
    where: { id: params.id }
  });
  
  // Verify ownership
  if (strategy.organization_id !== organizationId) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }
  
  return Response.json(strategy);
};

// ❌ WRONG: No ownership check
export const getStrategy = async (req: Request, { params }: { params: { id: string } }) => {
  const strategy = await db.strategy.findUnique({
    where: { id: params.id }
  });
  return Response.json(strategy);  // Anyone can read ANY strategy!
};

// ❌ WRONG: Only checking user_id, not organization_id
if (strategy.user_id !== userId) {
  return Response.json({ error: 'Unauthorized' }, { status: 403 });
}
// User from different tenant could bypass if they know the ID!
```

**Checklist**:
- [ ] All endpoints verify user owns the resource
- [ ] Verification includes organization_id (multi-tenant safety)
- [ ] Return 403 Forbidden for unauthorized access
- [ ] No object references in URLs that bypass checks (e.g., `/strategy/1` vs `/user/123/strategy/456`)
- [ ] Admin actions require explicit admin role

**Tools**:
```bash
# Check for missing auth checks
grep -r "findUnique\|findMany" src/ | grep -v organization_id
```

---

#### A02: Cryptographic Failures

**What to check**: Sensitive data is encrypted

```typescript
// ✅ CORRECT: Secrets are hashed, not stored plaintext
import bcrypt from 'bcrypt';

export const createAPIKey = async (userId: string) => {
  const key = generateRandomToken();  // 32-byte random
  const hashedKey = await bcrypt.hash(key, 12);  // Cost factor: 12+
  
  await db.apiKey.create({
    data: {
      user_id: userId,
      key_hash: hashedKey,  // Store hash, not plaintext
      created_at: new Date(),
    }
  });
  
  return key;  // Return plaintext once to user, never store it
};

// ✅ CORRECT: Sensitive data in transit (HTTPS enforced)
// In vercel.json or next.config.js
{
  headers: [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains; preload'
        }
      ]
    }
  ]
}

// ❌ WRONG: Storing plaintext secrets
const apiKey = generateRandomToken();
await db.apiKey.create({
  data: {
    user_id: userId,
    key: apiKey  // ❌ STORING PLAINTEXT!
  }
});

// ❌ WRONG: Using weak hashing
const hash = MD5(apiKey);  // ❌ MD5 is broken!
await db.apiKey.create({
  data: {
    user_id: userId,
    key_hash: hash
  }
});

// ❌ WRONG: Not enforcing HTTPS
// No HSTS header, allowing HTTP connections
```

**Checklist**:
- [ ] API keys hashed with bcrypt (cost ≥ 12)
- [ ] No plaintext secrets in database
- [ ] Passwords hashed with bcrypt (cost ≥ 12)
- [ ] HTTPS enforced (HSTS header present)
- [ ] No MD5, SHA1 for passwords (use bcrypt)
- [ ] Sensitive data marked with comments `// SECRET`
- [ ] Database connections use encrypted TLS
- [ ] Environment variables don't leak to frontend

**Tools**:
```bash
# Check for hardcoded secrets
npm run validate:secrets
# or
npx git-secrets --scan

# Check for weak crypto
grep -r "MD5\|SHA1\|crypto.createHash" src/
```

---

#### A03: Injection

**What to check**: Queries use parameterized statements, no SQL injection

```typescript
// ✅ CORRECT: Parameterized query
const strategy = await db.strategy.findMany({
  where: {
    name: strategyName,  // Parameter, not string concat
    organization_id: organizationId
  }
});

// ✅ CORRECT: Input validation before query
const SearchSchema = z.object({
  query: z.string().min(1).max(100),
});

const { query } = SearchSchema.parse(req.body);

const results = await db.strategy.findMany({
  where: {
    name: { contains: query },
    organization_id: organizationId
  }
});

// ❌ WRONG: String concatenation (SQL injection!)
const query = req.body.search;
const results = await db.$queryRaw`
  SELECT * FROM strategy WHERE name LIKE '%${query}%'
  -- If query = "%'; DROP TABLE strategy; --%", database is deleted!
`;

// ❌ WRONG: No input validation
const results = await db.strategy.findMany({
  where: {
    name: { contains: userInput }  // What if userInput is 1000 chars?
  }
});
```

**Checklist**:
- [ ] All database queries use parameterized statements (Prisma, not raw SQL)
- [ ] All user inputs validated with Zod before use
- [ ] No string concatenation in queries
- [ ] Query limits enforced (pagination, max results)
- [ ] Command injection checks (if running external commands)
- [ ] XSS prevention (sanitize output)

**Tools**:
```bash
# Check for dangerous patterns
grep -r "\$queryRaw\|queryRawUnsafe" src/
grep -r "template.*\${" src/ | grep -v zod

# Check for missing validation
grep -r "req.body\|req.query\|req.params" src/ | grep -v "Schema.parse\|validate"
```

---

#### A04: Insecure Design

**What to check**: Security is built-in, not added after

```typescript
// ✅ CORRECT: Security by design
// Every module has organization_id from the start
const StrategySchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),  // ← In schema from day 1
  user_id: z.string().uuid(),
  name: z.string(),
});

// RLS enforced at DB level
// (PostgreSQL ROW LEVEL SECURITY policy)

// ✅ CORRECT: Audit logging built-in
export const updateStrategy = async (
  strategyId: string,
  organizationId: string,
  updates: Partial<Strategy>
) => {
  // Verify ownership
  if (!(await ownsStrategy(strategyId, organizationId))) {
    throw new Error('Unauthorized');
  }
  
  // Perform update
  const updated = await db.strategy.update({
    where: { id: strategyId },
    data: updates
  });
  
  // Log the change
  await auditLog.create({
    organization_id: organizationId,
    action: 'STRATEGY_UPDATE',
    resource_id: strategyId,
    changes: updates,
    timestamp: new Date(),
  });
  
  return updated;
};

// ❌ WRONG: Security added as afterthought
// No organization_id in schema originally
type Strategy = {
  id: string;
  user_id: string;
  name: string;
};

// Later, someone adds organization_id check:
if (req.user.organizationId !== strategy.organizationId) { ... }
// But maybe they forgot one endpoint!

// ❌ WRONG: No audit logging
export const updateStrategy = async (updates) => {
  await db.strategy.update({ data: updates });
  // No log of who changed what!
};
```

**Checklist**:
- [ ] Security requirements documented in ADRs
- [ ] Tenant isolation in data model (not added later)
- [ ] Audit logging implemented
- [ ] Rate limiting configured
- [ ] Input validation in Zod from start
- [ ] Admin/user roles separated from design
- [ ] Error messages don't leak info

---

#### A05: Broken Authentication

**What to check**: Authentication is robust and properly validated

```typescript
// ✅ CORRECT: Strong JWT validation
import jwt from 'jsonwebtoken';

export const getCurrentUser = async (req: Request) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing authentication');
  }
  
  const token = authHeader.slice(7);
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      audience: 'loopdev-app',
      issuer: 'loopdev-auth'
    });
    
    // Verify token structure
    if (!payload.userId || !payload.organizationId) {
      throw new Error('Invalid token');
    }
    
    return {
      userId: payload.userId as string,
      organizationId: payload.organizationId as string
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// ✅ CORRECT: Password requirements
const PasswordSchema = z.string()
  .min(12, 'Must be 12+ characters')
  .regex(/[A-Z]/, 'Must contain uppercase')
  .regex(/[a-z]/, 'Must contain lowercase')
  .regex(/[0-9]/, 'Must contain digit')
  .regex(/[!@#$%^&*]/, 'Must contain special char');

// ❌ WRONG: Weak JWT validation
const payload = jwt.decode(token);  // ❌ NO VERIFICATION!
// Anyone can forge a token

// ❌ WRONG: No expiration
const token = jwt.sign({ userId }, secret);
// Token valid forever!

// ❌ WRONG: Weak passwords
const PasswordSchema = z.string().min(4);  // Too weak
```

**Checklist**:
- [ ] JWT tokens validated with `jwt.verify()` (not decode)
- [ ] Token has expiration (typically 1 hour)
- [ ] Refresh tokens used for long sessions
- [ ] Passwords minimum 12 characters
- [ ] Passwords require mixed case + numbers + symbols
- [ ] MFA supported for admin accounts
- [ ] Login attempts rate-limited (e.g., 5 fails = 15 min lockout)
- [ ] Session timeout enforced
- [ ] CORS configured (not `*`)

**Tools**:
```bash
# Check JWT validation
grep -r "jwt.decode" src/  # ❌ DANGEROUS
grep -r "jwt.verify" src/  # ✅ CORRECT

# Check password validation
grep -r "PasswordSchema\|password" src/schemas/
```

---

#### A06: Sensitive Data Exposure

**What to check**: Sensitive data is not logged or returned

```typescript
// ✅ CORRECT: Sensitive data removed from responses
export const getUserProfile = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      // ❌ DON'T include: password_hash, api_keys, refresh_token
    }
  });
  
  return user;
};

// ✅ CORRECT: API key not logged
try {
  const response = await fetch('https://api.binance.com/...', {
    headers: {
      'X-API-Key': apiKey
    }
  });
} catch (error) {
  logger.error('API call failed', {
    status: error.status,
    // ❌ DON'T log: apiKey, error with full message containing key
  });
}

// ❌ WRONG: Sensitive data in response
export const getUserProfile = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId }
  });
  return user;  // Includes password_hash, tokens, everything!
};

// ❌ WRONG: Sensitive data in logs
logger.info('API call', {
  url: 'https://api.binance.com/...',
  headers: { 'X-API-Key': apiKey },  // ❌ KEY IN LOGS!
  response: response
});
```

**Checklist**:
- [ ] Passwords never returned in API responses
- [ ] API keys not logged
- [ ] Database select() excludes sensitive columns
- [ ] Error messages don't leak system info
- [ ] Logs masked for sensitive data (API keys, tokens, emails)
- [ ] Sensitive data in environment variables (not code)
- [ ] GDPR compliant (can delete user data)
- [ ] No PII in error messages sent to client

**Tools**:
```bash
# Find SELECT * (which might leak sensitive data)
grep -r "SELECT \*\|findUnique()" src/ | grep -v select:

# Find potential logging of secrets
grep -r "logger\.\|console\." src/ | grep -i "key\|token\|secret\|password"
```

---

#### A07: Broken Access Control (by Parameter)

**What to check**: Users can't access others' resources via URL manipulation

```typescript
// ✅ CORRECT: Check ownership before returning
export const getStrategyById = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { userId, organizationId } = await getCurrentUser(req);
  
  const strategy = await db.strategy.findUnique({
    where: { id: params.id }
  });
  
  if (!strategy || strategy.organization_id !== organizationId) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
  
  return Response.json(strategy);
};

// ❌ WRONG: Returning any strategy by ID
export const getStrategyById = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const strategy = await db.strategy.findUnique({
    where: { id: params.id }
  });
  return Response.json(strategy);  // User can access ANY strategy!
};
```

**Checklist**:
- [ ] All `/api/:id` endpoints verify ownership
- [ ] 404 returned instead of 403 (don't leak existence)
- [ ] Can't increment/decrement IDs to access others' resources
- [ ] Can't use admin account ID in URL to access admin features

---

#### A08: Software and Data Integrity Failures

**What to check**: Code comes from trusted sources, dependencies are vetted

```typescript
// ✅ CORRECT: Verify package integrity
// package.json with lockfile (npm-shrinkwrap.json or package-lock.json)
// Commit lockfile to git
npm ci --frozen-lockfile  // Doesn't update, only install locked versions

// ✅ CORRECT: Check dependencies for vulnerabilities
npm audit  // Check for known vulns
npm audit fix  // Auto-fix if safe

// ✅ CORRECT: Review dependency updates
// Don't auto-update, manually review major versions
// Publish process: only from CI/CD, not from laptop

// ❌ WRONG: Random npm packages without review
npm install some-random-package  // What does it do?
npm install  // No lockfile, different version installed on CI!

// ❌ WRONG: Manual deployments
# Run locally, commit build artifacts, deploy from git
# Someone could insert malicious code before push
```

**Checklist**:
- [ ] Lockfile present and committed
- [ ] `npm ci` used in CI/CD (not `npm install`)
- [ ] `npm audit` passes (0 high/critical vulns)
- [ ] Dependencies reviewed for security
- [ ] Build artifact not committed (build in CI/CD)
- [ ] Deployment from CI/CD only (not local machine)
- [ ] Code signing enabled (if possible)

---

#### A09: Logging and Monitoring Failures

**What to check**: Security events are logged and monitored

```typescript
// ✅ CORRECT: Log important security events
export const login = async (email: string, password: string) => {
  const user = await db.user.findUnique({ where: { email } });
  
  if (!user) {
    auditLog.create({
      action: 'LOGIN_FAILED_USER_NOT_FOUND',
      email,  // Can log email, but not password!
      timestamp: new Date(),
      ip_address: getClientIP(),
    });
    return { error: 'Invalid credentials' };
  }
  
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    auditLog.create({
      action: 'LOGIN_FAILED_WRONG_PASSWORD',
      user_id: user.id,
      timestamp: new Date(),
      ip_address: getClientIP(),
    });
    return { error: 'Invalid credentials' };
  }
  
  auditLog.create({
    action: 'LOGIN_SUCCESS',
    user_id: user.id,
    timestamp: new Date(),
    ip_address: getClientIP(),
  });
};

// ❌ WRONG: No logging of security events
export const login = async (email: string, password: string) => {
  const user = await db.user.findUnique({ where: { email } });
  // No log! Can't detect brute force attacks
  // Can't detect compromised accounts
};

// ❌ WRONG: Logging sensitive data
auditLog.create({
  action: 'LOGIN',
  password,  // ❌ NEVER LOG PASSWORD!
  timestamp: new Date(),
});
```

**Checklist**:
- [ ] All login attempts logged
- [ ] All permission failures logged
- [ ] All data access logged (especially admin)
- [ ] Logs not accessible to regular users
- [ ] Logs retained for audit (minimum 90 days)
- [ ] Monitoring alerts for suspicious activity
- [ ] Alerts for repeated failed logins (brute force)
- [ ] Alerts for unusual data access (e.g., exporting 10k rows)

---

#### A10: Server-Side Request Forgery (SSRF)

**What to check**: Backend doesn't make requests based on user input without validation

```typescript
// ✅ CORRECT: Whitelist allowed URLs
const ALLOWED_EXCHANGES = ['binance.com', 'kraken.com', 'coinbase.com'];

export const fetchExchangeData = async (exchange: string) => {
  if (!ALLOWED_EXCHANGES.includes(exchange)) {
    throw new Error('Exchange not allowed');
  }
  
  const url = `https://${exchange}/api/public/data`;
  const response = await fetch(url);
  return response.json();
};

// ❌ WRONG: User controls URL directly
export const fetchData = async (req: Request) => {
  const url = req.body.url;  // ❌ User can pass any URL!
  const response = await fetch(url);  // Could access internal APIs!
  return response.json();
};

// ❌ WRONG: No validation of redirects
export const proxyRequest = async (path: string) => {
  const response = await fetch(`https://api.example.com${path}`);
  // If API redirects to internal URL, user can reach it
};
```

**Checklist**:
- [ ] No user-controlled URLs in `fetch()` calls
- [ ] Whitelist allowed external APIs
- [ ] No internal URLs exposed to internet (localhost, 127.0.0.1)
- [ ] Redirects validated (don't follow to arbitrary URLs)
- [ ] DNS rebinding protection if possible
- [ ] No access to cloud metadata APIs (AWS, GCP, etc)

---

### 2. RLS (Row-Level Security) Enforcement

**What to check**: Every multi-tenant query includes organization_id

```typescript
// ✅ CORRECT: All queries filter by organization_id
// Database schema
CREATE TABLE strategy (
  id UUID PRIMARY KEY,
  organization_id UUID NOT NULL,
  user_id UUID NOT NULL,
  name VARCHAR(100),
  CONSTRAINT fk_tenant FOREIGN KEY (organization_id) REFERENCES organizations(id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "user"(id)
);

// API query
export const getUserStrategies = async (userId: string, organizationId: string) => {
  return await db.strategy.findMany({
    where: {
      user_id: userId,
      organization_id: organizationId  // ← ALWAYS include
    }
  });
};

// PostgreSQL RLS Policy (additional layer)
ALTER TABLE strategy ENABLE ROW LEVEL SECURITY;

CREATE POLICY strategy_isolation ON strategy
  USING (organization_id = current_setting('app.current_organization_id')::uuid);

// ❌ WRONG: No organization_id filter
export const getAllStrategies = async () => {
  return await db.strategy.findMany();  // LEAKS ALL TENANTS!
};

// ❌ WRONG: organization_id only checked in code, not DB
// What if someone updates DB directly?
// What if there's a SQL injection?
// Must also have DB-level RLS!
```

**Checklist**:
- [ ] Every table has organization_id column
- [ ] organization_id is NOT NULL
- [ ] Every query includes WHERE organization_id = X
- [ ] Database has RLS policy (if PostgreSQL)
- [ ] Test: Can one tenant see another's data? (Must be NO)
- [ ] Find violations: `grep -r "findMany\|findOne" src/ | grep -v organization_id`

**Test RLS**:
```bash
# Create 2 tenants with strategies
# Login as user in tenant A
# Try to access strategy from tenant B via ID
# Must return 403 Forbidden or 404 Not Found
```

---

### 3. Secrets Management

**What to check**: No hardcoded secrets in code

```typescript
// ✅ CORRECT: Secrets from environment
const apiKey = process.env.BINANCE_API_KEY;
if (!apiKey) {
  throw new Error('BINANCE_API_KEY not configured');
}

// ✅ CORRECT: Secrets not exposed to frontend
// API route only
export const POST = async (req: Request) => {
  const apiKey = process.env.BINANCE_API_KEY;  // ← Backend only
  const response = await fetch('https://api.binance.com/...', {
    headers: { 'X-API-Key': apiKey }
  });
  return Response.json({ /* ...data, no apiKey... */ });
};

// ✅ CORRECT: Environment variables in .env.local (not committed)
// .env.local (in .gitignore)
BINANCE_API_KEY=sk_test_abc123...
DATABASE_URL=postgresql://user:pass@...

// ❌ WRONG: Hardcoded secrets
const apiKey = 'sk_test_abc123...';  // ❌ IN CODE!
const dbUrl = 'postgresql://user:pass@...';  // ❌ IN CODE!

// ❌ WRONG: Secrets exposed to frontend
export const config = {
  apiKey: process.env.API_KEY  // Client can read!
};

// ❌ WRONG: Environment variable name in code
const url = 'https://api.example.com?key=BINANCE_API_KEY';  // Oops, sent literal string!
```

**Checklist**:
- [ ] No hardcoded API keys, passwords, or tokens
- [ ] All secrets in environment variables or .env.local
- [ ] .env.local in .gitignore
- [ ] .env.example has placeholder values
- [ ] Secrets not logged
- [ ] Secrets not sent to frontend
- [ ] Rotating secrets documented

**Tools**:
```bash
# Scan for secrets
npm run validate:secrets
# or
npx git-secrets --scan

# Check what's being exported
grep -r "export.*process.env" src/

# Check git history for accidentally committed secrets
git log --all --full-history -p -- src/ | grep -i "sk_\|password\|secret"
```

---

### 4. Dependency Vulnerabilities

**What to check**: All npm packages are secure

```bash
# ✅ CORRECT: Audit passing
npm audit
# Output: 0 vulnerabilities

# ✅ CORRECT: Lockfile committed
# package-lock.json or npm-shrinkwrap.json in git
# Ensures same versions across machines

# ❌ WRONG: Known vulnerabilities
npm audit
# Output: 5 vulnerabilities (2 high, 3 moderate)

# ❌ WRONG: No lockfile
# Different versions installed on CI vs local
```

**Checklist**:
- [ ] `npm audit` passes with 0 high/critical vulns
- [ ] Lockfile present and committed
- [ ] Dependencies reviewed before updating
- [ ] Deprecated packages removed
- [ ] Unused dependencies removed (npm prune)
- [ ] Dependency sources verified (official npm registry)

**Tools**:
```bash
npm audit
npm outdated  # See what's old but not flagged
pnpm audit --audit-level high
```

---

## Output

### What You Generate

```markdown
# Security Audit Report

## Feature: Bitcoin RSI Mean Reversion Strategy
**Date**: 2026-03-21  
**Auditor**: Security Lead  
**Status**: ✅ APPROVED | ⚠️ APPROVED WITH ISSUES | ❌ BLOCKED

---

## OWASP Top 10 Validation

### A01: Broken Access Control
✅ PASS - Access control enforced

Details:
- All endpoints verify user owns resource
- organization_id check present
- 403 returned for unauthorized access
- No object reference issues found

### A02: Cryptographic Failures
✅ PASS - Secrets properly protected

Details:
- API keys hashed with bcrypt (cost: 13)
- HTTPS enforced (HSTS header present)
- No plaintext secrets in code
- Database connections use TLS

### A03: Injection
⚠️ ISSUE FOUND - Input validation missing

Issues:
- strategyService.ts, line 42: User input not validated before query

Code:
```typescript
const strategies = await db.strategy.findMany({
  where: {
    name: { contains: req.query.search }  // ❌ Not validated
  }
});
```

Severity: MEDIUM

Fix:
```typescript
const SearchSchema = z.object({
  search: z.string().max(100)
});

const { search } = SearchSchema.parse(req.query);

const strategies = await db.strategy.findMany({
  where: {
    name: { contains: search }
  }
});
```

### A04: Insecure Design
✅ PASS - Security built-in from design

Details:
- Multi-tenant model includes organization_id
- Audit logging implemented
- Rate limiting configured
- Error messages don't leak info

### A05: Broken Authentication
✅ PASS - Authentication robust

Details:
- JWT validated with jwt.verify()
- Token expiration: 1 hour
- Refresh tokens: 7 days
- Password requirements: 12+ chars, mixed case, numbers, symbols

### A06: Sensitive Data Exposure
❌ BLOCKED - API responses leak sensitive data

Issues:
- GET /api/strategy/:id returns password_hash
- GET /api/user returns refresh_token
- Admin endpoints log API keys

Code:
```typescript
// Line 156 in strategy.ts
const strategy = await db.strategy.findUnique({
  where: { id: strategyId }
});
return Response.json(strategy);  // ❌ Includes password_hash!
```

Severity: CRITICAL - BLOCKS RELEASE

Fix:
```typescript
const strategy = await db.strategy.findUnique({
  where: { id: strategyId },
  select: {
    id: true,
    name: true,
    type: true,
    entry_signal: true,
    exit_signal: true,
    // DO NOT include: password_hash, tokens
  }
});
return Response.json(strategy);
```

### A07: Broken Access Control (Parameters)
⚠️ ISSUE FOUND - Missing ownership verification

Issues:
- DELETE /api/strategy/:id doesn't check ownership

Code:
```typescript
export const DELETE = async (req: Request, { params }) => {
  await db.strategy.delete({
    where: { id: params.id }
  });
  // ❌ No check that user owns this strategy!
  return Response.json({ success: true });
};
```

Severity: CRITICAL - User can delete others' strategies

Fix:
```typescript
export const DELETE = async (req: Request, { params }) => {
  const { userId, organizationId } = await getCurrentUser(req);
  
  const strategy = await db.strategy.findUnique({
    where: { id: params.id }
  });
  
  if (!strategy || strategy.organization_id !== organizationId) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
  
  await db.strategy.delete({
    where: { id: params.id }
  });
  
  return Response.json({ success: true });
};
```

### A08: Software Integrity
✅ PASS - Dependencies verified

Details:
- npm audit: 0 vulnerabilities
- Lockfile present and committed
- Dependencies reviewed before update

### A09: Logging & Monitoring
⚠️ PARTIAL - Audit logging incomplete

Details:
- Login attempts logged ✅
- Data changes logged ✅
- Admin actions NOT logged ❌

Severity: MEDIUM

### A10: SSRF
✅ PASS - External API calls whitelisted

Details:
- Allowed exchanges: ['binance', 'kraken', 'coinbase']
- No user-controlled URLs

---

## RLS (Row-Level Security) Validation

### Tenant Isolation
⚠️ ISSUE FOUND - Missing organization_id in one query

Location: backtestService.ts, line 78

```typescript
const results = await db.backtest.findMany({
  where: {
    strategy_id: strategyId
  }
  // ❌ Missing organization_id filter!
});
```

Severity: CRITICAL - Data leak

Fix:
```typescript
const results = await db.backtest.findMany({
  where: {
    strategy_id: strategyId,
    organization_id: organizationId
  }
});
```

### Multi-Tenant Test
✅ PASS - Cannot see other tenants' data (tested)

---

## Secrets Management

### Hardcoded Secrets
✅ PASS - No hardcoded secrets found

Tools:
```bash
npm run validate:secrets
# Output: No secrets detected
```

### Environment Variables
✅ PASS - Properly configured

Details:
- .env.local in .gitignore
- .env.example has placeholders
- Secrets not logged
- Secrets not sent to frontend

---

## Dependency Vulnerabilities

### npm audit
✅ PASS - 0 vulnerabilities

```
found 0 vulnerabilities
```

### Dependency Security Scan
✅ PASS - 0 high/critical

```
1 medium vulnerability (outdated dependency, not exploitable)
```

---

## Summary

### Issues Found: 3
1. **A03: Input validation missing** (MEDIUM)
   - Resolution: 30 min
   
2. **A06: Sensitive data exposed** (CRITICAL)
   - Resolution: 1 hour
   
3. **A07: Missing ownership verification** (CRITICAL)
   - Resolution: 1 hour

4. **RLS: Missing organization_id** (CRITICAL)
   - Resolution: 30 min

5. **A09: Admin logging missing** (MEDIUM)
   - Resolution: 1 hour

### Approval Status
❌ **BLOCKED** - 3 critical issues must be fixed before merge

### Timeline
- Fix all issues: 4 hours
- Re-audit: 1 hour
- Expected: 5 hours total

### Sign-off
Auditor: Security Lead  
Date: 2026-03-21  
Status: Return for fixes

---

## Next Steps

1. Fix all 5 issues (see above)
2. Re-run security checks:
   - [ ] npm audit
   - [ ] secrets scan
   - [ ] organization_id in all queries
   - [ ] input validation present
   - [ ] sensitive data removed
3. Reply with: "All security fixes applied, ready for re-audit"
4. Move to Performance Optimization Skill
```

---

## Validation Checklist

Use this when auditing:

```
OWASP A01: Broken Access Control
- [ ] All endpoints verify ownership
- [ ] organization_id checked in code
- [ ] 403/404 returned for unauthorized
- [ ] No parameter tampering vulnerability

OWASP A02: Cryptographic Failures
- [ ] Secrets hashed with bcrypt (cost ≥ 12)
- [ ] No plaintext secrets
- [ ] HTTPS enforced (HSTS header)
- [ ] Database connections encrypted

OWASP A03: Injection
- [ ] All inputs validated with Zod
- [ ] Parameterized queries only
- [ ] No string concatenation in SQL
- [ ] Query limits enforced

OWASP A04: Insecure Design
- [ ] Tenant isolation in schema
- [ ] Audit logging present
- [ ] Rate limiting configured
- [ ] Error messages safe

OWASP A05: Broken Authentication
- [ ] JWT verified (not just decoded)
- [ ] Token expiration present
- [ ] Strong password requirements
- [ ] MFA for admin accounts

OWASP A06: Sensitive Data Exposure
- [ ] No passwords in responses
- [ ] No tokens in responses
- [ ] No API keys in logs
- [ ] GDPR compliant

OWASP A07: Broken Access Control (Params)
- [ ] URL parameter tampering checks
- [ ] Can't enumerate IDs
- [ ] Can't access others' resources

OWASP A08: Software Integrity
- [ ] npm audit passing (0 high/critical)
- [ ] Lockfile present
- [ ] Dependencies reviewed
- [ ] Build from CI/CD only

OWASP A09: Logging & Monitoring
- [ ] Login attempts logged
- [ ] Data changes logged
- [ ] Admin actions logged
- [ ] Suspicious activity alerts

OWASP A10: SSRF
- [ ] No user-controlled URLs
- [ ] External APIs whitelisted
- [ ] No internal endpoints exposed

RLS Validation
- [ ] Every table has organization_id
- [ ] organization_id in every query
- [ ] Database RLS policy (if PostgreSQL)
- [ ] Test: Can't see other tenants

Secrets Management
- [ ] No hardcoded secrets
- [ ] Environment variables used
- [ ] .env.local in .gitignore
- [ ] Secrets rotation documented

OVERALL
- [ ] Ready to merge: YES / NO
- [ ] Critical issues: 0 / ___
- [ ] Medium issues: 0 / ___
- [ ] Re-audit needed: YES / NO
```

---

## Common Issues & Fixes

### Issue: Missing organization_id in Query

**Symptom**: Users can see other tenants' data

**Root Cause**: WHERE clause missing organization_id filter

**Fix**:
```typescript
// Before
const data = await db.strategy.findMany({
  where: { user_id: userId }
});

// After
const data = await db.strategy.findMany({
  where: { user_id: userId, organization_id: organizationId }
});
```

---

### Issue: Sensitive Data in Response

**Symptom**: Password hash or tokens returned in API

**Root Cause**: Returning full database object

**Fix**:
```typescript
// Before
const user = await db.user.findUnique({ where: { id } });
return Response.json(user);

// After
const user = await db.user.findUnique({
  where: { id },
  select: {
    id: true,
    email: true,
    name: true
    // password_hash, tokens excluded
  }
});
return Response.json(user);
```

---

### Issue: Input Not Validated

**Symptom**: Injection attack possible via query parameters

**Root Cause**: No Zod validation before query

**Fix**:
```typescript
// Before
const results = await db.strategy.findMany({
  where: { name: { contains: req.query.search } }
});

// After
const SearchSchema = z.object({
  search: z.string().max(100)
});

const { search } = SearchSchema.parse(req.query);

const results = await db.strategy.findMany({
  where: { name: { contains: search } }
});
```

---

## Authority & Escalation

**Primary**: Security Lead  
**Secondary**: Backend Lead  
**Escalation**: VP Engineering (for critical vulnerabilities)

Questions? Contact your Security Lead or review OWASP Top 10 guide.

---

**Next Skill**: Performance Optimization Skill  
**When**: After security fixes are done  
Use the operational validation and release Skills in `.github/skills/` for
performance, release, and evidence routing.
