# Design Debt Log

**Purpose:** Track raw visual values that exist in feature code as temporary exceptions to the "tokens only" rule.

**Target:** This file must be **empty** before the Design Pass (Part 4) begins.

---

## Current Debt Items

*None yet (project in Phase 0, no code written)*

---

## How to Use This Log

When you must use a raw visual value (hex color, px size, inline style) in feature code:

1. **Exhaust alternatives first:**
   - Can you use an existing token?
   - Can you add a new token instead?
   - Can you modify the UI-kit component instead of styling in feature code?

2. **If genuinely unavoidable** (rare edge case, third-party library limitation):
   - Add an entry below
   - Include file path, line number, what/why
   - Assign to someone to resolve
   - Set target date

3. **Before Design Pass:**
   - Resolve every item (add token, refactor component, find workaround)
   - Or get explicit approval from designer and tech lead
   - Remove resolved items from this log

---

## Debt Item Template

```
### DD-001: [Brief Description]
**File:** `src/modules/<X>/<file>.tsx` line 42  
**What:** `style={{ color: '#FF0000' }}`  
**Why:** Third-party chart library requires inline style for red data points  
**Impact:** One hardcoded red color  
**Resolution Plan:** Investigate chart library theming, or contribute color via JS variable from token  
**Assigned To:** `___________`  
**Target Date:** `___________`  
**Status:** Open / In Progress / Resolved  
```

---

## Example (for illustration only, delete when adding real items)

### DD-000: Example Red Button
**File:** `src/modules/C/components/UrgentAlert.tsx` line 15  
**What:** `backgroundColor: '#DC2626'`  
**Why:** Prototype urgency indicator before semantic danger token existed  
**Impact:** One red color  
**Resolution Plan:** Use `var(--color-danger)` token  
**Assigned To:** Jane Doe  
**Target Date:** 2026-11-15  
**Status:** Resolved 2026-11-12 (token now used)  

---

## Summary

**Total Open Items:** 0  
**Oldest Item:** N/A  
**Blocking Design Pass:** No

---

**Last Reviewed:** 2026-11-10  
**Next Review:** Before Phase 1 starts (no code yet)

---

## Notes

- This log is reviewed at every module Gate M2
- Any new debt item requires justification comment in code: `// DD-NNN: [reason]`
- Lint rule will fail CI if raw values found without DD-NNN comment
- Design Pass cannot start until this log is empty or all items are approved exceptions
