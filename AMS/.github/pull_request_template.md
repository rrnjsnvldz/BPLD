# Pull Request

## Checklist Item

**ID:** `<Module>-<Type><NN>` (e.g., `K-F01`, `C-SL03`)  
**Plan Section:** §5.[Module] or Master Checklist reference  
**Priority:** Must / Should / Could

---

## Summary

<!-- Brief description of what this PR does (2-3 sentences) -->

---

## Changes Made

<!-- Bullet list of key changes -->

- 
- 
- 

---

## Tests Run

<!-- List tests executed and their results -->

**Unit tests:**
```bash
# Command used
# Result: ✅ All passing / ❌ X failing
```

**Integration tests:**
```bash
# Command used
# Result: ✅ All passing / ❌ X failing
```

**Other tests:**
- [ ] Permission tests (RBAC matrix)
- [ ] Negative tests (invalid input, unauthorized, wrong state)
- [ ] Migration tests (up and down)
- [ ] Linter: ✅ Clean / ❌ X errors
- [ ] Type checker: ✅ Clean / ❌ X errors

---

## Security Notes

<!-- Complete if this PR touches: auth, permissions, money, inventory, file uploads, integrations, CI, secrets -->

**Security-sensitive areas touched:**
- [ ] Authentication or authorization
- [ ] Money (POS, payroll, commissions, tax)
- [ ] Inventory adjustments or costing
- [ ] File uploads
- [ ] Integrations or webhooks
- [ ] Secrets, environment, or CI config
- [ ] None of the above

**If yes, second reviewer required:** @[username]

**Threat analysis:**
<!-- What could go wrong if this is exploited? -->

**Controls added/verified:**
<!-- Input validation, output encoding, authorization checks, etc. -->

---

## UI Changes

<!-- Complete if this PR changes user interface -->

**Screenshots:**

**Before:**
<!-- Screenshot or N/A -->

**After:**
<!-- Screenshot or N/A -->

**Device profiles tested:**
- [ ] Desktop
- [ ] Tablet
- [ ] Mobile

**Design checks:**
- [ ] Uses only UI-kit components (no direct third-party imports)
- [ ] Uses only design tokens (no raw colors, px sizes, inline styles)
- [ ] Handles all states (loading, empty, error, no-permission)
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Contrast checked (WCAG AA)
- [ ] Dark theme tested

**Lint check for raw values:**
```bash
npm run lint:design
# Result: ✅ Clean / ❌ X violations (logged in DESIGN-DEBT.md)
```

---

## Documentation Updated

- [ ] User guide (`docs/modules/<X>/USER-GUIDE.md`)
- [ ] API documentation (auto-generated or manual)
- [ ] Code comments for complex logic
- [ ] Checklist item ticked with evidence
- [ ] `docs/STATUS.md` updated (current state, next step)
- [ ] Changelog entry added
- [ ] N/A (no doc changes needed)

---

## Evidence for Checklist

<!-- How to verify this item is complete -->

**Test name(s):**
<!-- e.g., test_K_F01_user_creation_requires_role -->

**Command output:**
```
<!-- Paste relevant output showing feature works -->
```

**File path(s) created/modified:**
<!-- List key files for review -->

---

## Integration Notes

<!-- If this module integrates with others -->

**Integrations:**
- [ ] Live integration with module(s): ___________
- [ ] Stub integration (deferred): ___________ `DEFERRED-INTEGRATION(with <module>)`
- [ ] Events published: ___________
- [ ] Events consumed: ___________

---

## Blocked By / Blocks

**Blocked by:**
<!-- List any blockers: Q-nn (open question), another PR, external dependency -->

**Blocks:**
<!-- List items that were waiting on this PR -->

---

## Definition of Done Checklist

- [ ] Code complete (implements acceptance criteria)
- [ ] Tests written and passing (unit, integration, negative, permission)
- [ ] Code reviewed and approved
- [ ] No new lint or type errors
- [ ] Documentation updated
- [ ] Security reviewed (if applicable)
- [ ] Design-swap test passes (if UI changes)
- [ ] Accessibility checked (if UI changes)
- [ ] Performance acceptable
- [ ] Ready to merge

---

## Reviewer Notes

<!-- Any context or specific areas to focus review -->

---

## Pre-Merge Checklist (for Reviewer)

- [ ] Code follows project conventions
- [ ] Tests are meaningful and adequate
- [ ] No hardcoded values (uses settings/config/tokens)
- [ ] Uses canonical terms from glossary
- [ ] Error handling present
- [ ] No secrets logged
- [ ] Security implications considered
- [ ] Performance acceptable
- [ ] Documentation sufficient

---

**Related Issues:** #___  
**Related PRs:** #___  
**Gate:** M1 / M2 / P / L  
**Module Owner:** @___
