# Contributing to AMS

Thank you for contributing to the Autoshop Management System!

---

## Code of Conduct

- Be respectful and professional
- Focus on the work, not the person
- Ask questions when unclear
- Share knowledge generously
- Follow the non-negotiable rules in `docs/01-MASTER-PLAN.md` § Rules

---

## Getting Started

1. Read `README.md` — get the app running locally
2. Read `docs/01-MASTER-PLAN.md` — understand vision and architecture
3. Check `docs/STATUS.md` — see current work and blockers
4. Review `docs/GLOSSARY.md` — learn canonical terms
5. Pick a task from `docs/02-MASTER-CHECKLIST.md` or ask module owner

---

## Git Workflow

### Branch Naming

```
<module>-<id>-brief-description
```

**Examples:**
- `K-F01-user-crud`
- `C-SL03-estimate-workflow`
- `E-bugfix-invoice-rounding`

**Main branch:** `main` (protected, requires PR)  
**No direct commits to main!**

### Commit Messages

**Format:**
```
<ChecklistID> · <Brief description>

Optional detailed explanation if needed.
References checklist item docs/modules/<X>/CHECKLIST.md
```

**Examples:**
```
K-F01 · Implement user CRUD with RBAC

Added User model, repository, service layer, API routes.
All permission tests green per RBAC matrix.
```

```
C-S02 · Service order detail screen

Complete view with inspection photos, estimate lines, status timeline.
Uses only UI-kit components and design tokens.
```

**Rules:**
- Start with checklist ID
- Use present tense ("Add feature" not "Added feature")
- Keep subject line under 70 characters
- Include ticket/issue number if applicable

### Pull Request Process

1. **Create PR** from your branch to `main`
2. **Use PR template** (auto-fills, complete all sections)
3. **Title:** Same as commit message subject (`<ID> · Description`)
4. **Description must include:**
   - Checklist ID and plan section reference
   - What changed (bullet list)
   - Tests run and results
   - Screenshots if UI changes
   - Security notes if touching auth, money, inventory, files
   - Documents updated (user guide, API docs, etc.)
   - Evidence for checklist tick (test name, command output, screenshot)

5. **Reviewers:**
   - At least 1 reviewer required
   - **Second reviewer required** for: auth, permissions, money (POS, payroll, commissions, tax), inventory adjustments/costing, file uploads, integrations, CI/secrets, any diff > 400 lines
   
6. **Review Checklist:**
   - [ ] Code follows project conventions
   - [ ] Tests exist and pass
   - [ ] No hardcoded values (use settings/config)
   - [ ] Uses canonical terms from glossary
   - [ ] No raw visual values in UI code (uses tokens)
   - [ ] Error handling present
   - [ ] Logging appropriate (no secrets logged)
   - [ ] Documentation updated
   - [ ] Security implications considered
   - [ ] Performance acceptable

7. **Approval:** PR must be approved before merge
8. **Merge:** Squash and merge (clean history)
9. **Cleanup:** Delete branch after merge
10. **Update docs:** Tick checklist item, update `docs/STATUS.md`

---

## Coding Standards

### General

- **No guessing:** If unclear, ask (open question in `docs/OPEN-QUESTIONS.md`)
- **DRY:** Don't Repeat Yourself (extract shared logic)
- **YAGNI:** You Aren't Gonna Need It (build what's in the plan, no extra features)
- **KISS:** Keep It Simple (simplest solution that works)

### Module Boundaries

- **Never import another module's internals** (domain, application, infrastructure)
- **Use public contracts only** (API endpoints or published events)
- **Each module owns its tables** (read/write through owner's API only)
- **Enforce with linting** (architectural tests or ESLint/PHPStan rules)

### Naming

- **Use glossary terms** (`docs/GLOSSARY.md`)
- **Be explicit:** `calculateGrossMargin()` not `calc()`
- **Boolean variables:** prefix with `is`, `has`, `should` (`isApproved`, `hasPermission`)
- **Functions:** verb-noun (`getUserById`, `sendReminder`)
- **Constants:** UPPER_SNAKE_CASE
- **Variables/functions:** camelCase (JS/TypeScript) or snake_case (PHP/Python, per language convention)

### Data and Money

- **Money:** Always use platform money utility (stores as integer centavos)
- **Dates:** Always UTC in database, display in shop timezone
- **Enums/Status:** Configuration in settings (K), not hard-coded strings
- **IDs:** Use UUIDs for public-facing IDs, integers for internal foreign keys (or per ADR-001 decision)

### Security

- **Input validation:** Every API endpoint
- **Output encoding:** All user-supplied data in responses
- **Parameterized queries:** Never string concatenation in SQL
- **Secrets:** Environment variables only, never in code
- **Permissions:** Check server-side, every endpoint, every object
- **Audit logging:** Every state-changing action

### Testing

- **Test-first for business logic**
- **Test names include checklist ID:** `test_K_F01_user_creation_requires_role()`
- **Arrange-Act-Assert pattern**
- **One assertion focus per test** (multiple assertions OK if testing same concept)
- **Mock external services** (SMS, email, payment APIs)
- **No sleep() in tests** (use proper async waits or mocks)

---

## Design and UI

### Tokens Only

- **No raw values:** No hex colors, px sizes, inline styles in feature code
- **Use design tokens:** `var(--color-primary)`, `var(--spacing-md)`
- **Lint enforcement:** CI fails on raw values
- **Exceptions:** Log in `docs/design/DESIGN-DEBT.md` (must be empty before Design Pass)

### UI Kit Only

- **Feature screens compose UI-kit components only**
- **Never import third-party UI library directly** (wrap in UI kit first)
- **If component missing:** Add to UI kit, then use in feature

### Accessibility

- **Semantic HTML:** `<button>`, `<nav>`, `<main>`, etc.
- **Keyboard navigation:** All interactive elements tabbable
- **Visible focus states:** Never `outline: none` without custom focus style
- **Form labels:** Every input has associated `<label>` or `aria-label`
- **Alt text:** Every `<img>` has meaningful alt
- **Color not sole indicator:** Status uses color + icon + text

### States

Every screen must handle:
- **Loading:** Skeleton or spinner
- **Empty:** Helpful message + action button
- **Error:** Clear error message + retry option
- **No permission:** "You don't have access" message

---

## Testing

### Running Tests

```bash
# Unit tests
npm test                    # or php artisan test, pytest, etc.

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Specific module
npm test -- modules/C

# Specific test file
npm test -- src/modules/C/tests/estimate.test.ts

# Watch mode (local dev only)
npm test -- --watch
```

### Writing Tests

**Location:** `src/modules/<X>/tests/`

**File naming:** `<feature>.test.ts` (or `.spec.ts`, per stack convention)

**Example:**
```typescript
describe('K-F01 User CRUD', () => {
  test('creates user with valid role', async () => {
    // Arrange
    const userData = { name: 'John Doe', email: 'john@example.com', role: 'advisor' };
    
    // Act
    const user = await userService.create(userData);
    
    // Assert
    expect(user.id).toBeDefined();
    expect(user.role).toBe('advisor');
  });

  test('rejects user creation without role', async () => {
    // Arrange
    const userData = { name: 'John Doe', email: 'john@example.com' };
    
    // Act & Assert
    await expect(userService.create(userData)).rejects.toThrow('Role required');
  });
});
```

**Coverage:** Aim for 80% overall, 100% for money/stock/payroll logic

---

## Documentation

### When to Update Docs

- **Always:** User guide if UI or workflow changes
- **Always:** API docs if endpoints change (usually auto-generated)
- **Always:** Checklist (tick item with evidence)
- **Always:** `docs/STATUS.md` (current state, next step)
- **If new concept:** Add to `docs/GLOSSARY.md`
- **If architecture change:** New ADR in `docs/adr/`
- **If deviation from plan:** Change Request in `docs/DECISIONS.md`

### Doc Style

- **Short sentences**
- **Active voice** ("System sends email" not "Email is sent")
- **Present tense** ("System validates input" not "System will validate")
- **Bullet lists** for sequences or options
- **Tables** for comparisons or structured data
- **Code blocks** with syntax highlighting
- **Screenshots** for UI (keep updated)

---

## Definition of Done

A task is done when:

- [ ] Code complete (implements acceptance criteria)
- [ ] Tests written and green (unit, integration, negative, permission)
- [ ] Code reviewed and approved
- [ ] Documentation updated (user guide, API docs, comments)
- [ ] No new lint or type errors
- [ ] Design-swap test passes (if UI changes)
- [ ] Accessibility checked (keyboard, contrast)
- [ ] Merged to main
- [ ] Checklist item ticked with evidence
- [ ] `docs/STATUS.md` updated

---

## Getting Help

- **Technical questions:** Ask module owner or tech lead
- **Requirements unclear:** Add to `docs/OPEN-QUESTIONS.md`
- **Blocked:** Mark item `BLOCKED(Q-nn)` in checklist, continue other work
- **Bug found:** Create issue with steps to reproduce
- **Process question:** This guide or `docs/01-MASTER-PLAN.md`

---

## Tips for Success

1. **Read before coding:** Understand the plan, don't guess
2. **Start small:** Pick one acceptance criterion, implement, test, done
3. **Ask early:** 5 minutes of clarification saves hours of rework
4. **Test as you go:** Don't wait until the end
5. **Commit often:** Small commits are easier to review
6. **Update docs:** Future you (and teammates) will thank you
7. **Run the full suite:** Before pushing, ensure nothing broke
8. **Review others' code:** You'll learn and help the team

---

## Anti-Patterns (Don't Do These)

- ❌ Committing directly to `main`
- ❌ PR without tests
- ❌ Ignoring lint errors ("I'll fix it later")
- ❌ Hardcoding configuration ("It's just for dev")
- ❌ Skipping code review ("It's a small change")
- ❌ Using raw values in UI ("I'll tokenize it later")
- ❌ Importing another module's internals
- ❌ Editing already-applied migrations
- ❌ Adding features not in the plan (scope creep)
- ❌ Using synonyms instead of glossary terms

---

**Questions about this guide?** Ask tech lead or open a discussion.

**Last Updated:** 2026-11-10
