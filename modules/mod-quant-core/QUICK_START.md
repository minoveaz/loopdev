# 🚀 Quick Start - Change Management System

## The 4-Tier System in 60 Seconds

```
Your Code Change
        ↓
Git Commit (Tier 1)        ← Detailed technical explanation
        ↓
FIXES_LOG.md (Tier 3)      ← Problem + Solution + Code examples
        ↓
CHANGELOG.md (Tier 2)      ← One-line summary
        ↓
IMPLEMENTATION_SUMMARY.md  ← Session context
```

---

## Step-by-Step Workflow

### Step 1: Identify Issue
```
Found bug? Create issue ID: [MODULE]-[NUMBER]
Example: ATR-001, BACKTEST-042, SECURITY-005
```

### Step 2: Fix Code
```python
# Make your fix
# Test it
```

### Step 3: Update FIXES_LOG.md
```markdown
## [ATR-001] - CRITICAL - 2026-03-18 - FIXED

**Title**: ATR True Range Calculation Incorrect

**Problem**:
The previous calculation only computed High-Low,
missing gaps from previous close...

**Fix Implemented**:
Changed to Wilder's standard which includes:
- TR = MAX(H-L, ABS(H-PC), ABS(L-PC))

**Files Modified**:
- src/strategies/intraday_atr.py (lines 21-30)
```

### Step 4: Git Commit
```bash
git commit -m "fix(atr): implement Wilder's True Range

- TR now includes close-to-close gaps
- Uses EMA instead of SMA
- Fixes 40% volatility underestimation

Fixes:
- ATR-001: Incomplete True Range
- ATR-002: SMA vs EMA
"
```

### Step 5: Update CHANGELOG.md
```markdown
## [Unreleased]

### Fixed
- **[CRITICAL]** ATR True Range calculation now includes close-to-close gaps
- **[CRITICAL]** ATR now uses EMA instead of SMA
```

---

## Formats

### Issue ID Format
```
[MODULE]-[NUMBER]

MODULES:
- ATR, BACKTEST, STRATEGY, VALIDATION, SUPABASE, SECURITY, MEMORY
```

### Severity Levels
```
CRITICAL:  Breaks functionality, crashes
HIGH:      Wrong results, poor performance
MEDIUM:    Edge cases, minor issues
LOW:       Nice-to-have, cosmetic
```

### Commit Format
```
type(scope): short description

Detailed explanation of what and why.

Fixes:
- ISSUE-001: Description
- ISSUE-002: Description

Impact:
- Positive effect 1
- Positive effect 2
```

**Types**: `fix`, `feat`, `refactor`, `perf`, `docs`, `test`, `chore`

---

## Files Location

```
modules/mod-quant-core/
├─ CHANGELOG.md                    (Release notes)
├─ FIXES_LOG.md                    (Technical details)
├─ IMPLEMENTATION_SUMMARY.md       (Session tracking)
├─ CHANGE_MANAGEMENT_SYSTEM.md     (Full procedures)
└─ QUICK_START.md                  (This file)
```

---

## Common Tasks

### Add a Bug Fix
1. Create issue ID: `ATR-001`
2. Fix code
3. Add entry to FIXES_LOG.md
4. Git commit with "Fixes: ATR-001"
5. Update CHANGELOG.md
6. Done!

### Add a New Feature
1. Create issue ID: `STRATEGY-001`
2. Implement feature
3. Add entry to FIXES_LOG.md (changed to IMPLEMENTATION_LOG for features)
4. Git commit: `feat(strategy): description`
5. Update CHANGELOG.md
6. Done!

### Review Changes
```bash
# See recent commits
git log --oneline -10

# See what changed in a file
git diff HEAD~1 src/strategies/intraday_atr.py

# Find all mentions of an issue
grep -r "ATR-001" modules/mod-quant-core/
```

---

## Key Files to Know

- **CHANGE_MANAGEMENT_SYSTEM.md** - Full procedures (read first)
- **FIXES_LOG.md** - All issues with detailed explanations
- **CHANGELOG.md** - What's been done (user-facing)
- **IMPLEMENTATION_SUMMARY.md** - This session's work
- **git log** - Source of truth (all commits)

---

## Best Practices

✅ **DO**
- Commit frequently with clear messages
- Reference issues in commits
- Include before/after code in FIXES_LOG
- Update docs when changing code
- Keep git history complete

❌ **DON'T**
- Mix multiple unrelated changes in one commit
- Skip documentation
- Use vague commit messages
- Rewrite git history
- Hardcode file paths in docs

---

## Questions?

1. **How do I format a commit?**
   → See git log examples (fe9e0c0, 3185f05)

2. **Why do I need 4 tiers?**
   → Each tier serves different audiences
   → Tier 1: Source control, Tier 2: Users, Tier 3: Developers, Tier 4: Project managers

3. **What if I forgot to document something?**
   → Update FIXES_LOG.md and commit again
   → Git history will show all changes

4. **Can I skip the documentation?**
   → No! It's part of the system
   → It takes 2 minutes and saves hours later

---

**Remember**: 
- Code + Commit + Documentation = Complete Change
- Without documentation, nobody knows what you did or why
- Your team depends on clear commits

**Start using this system today!** 🚀
