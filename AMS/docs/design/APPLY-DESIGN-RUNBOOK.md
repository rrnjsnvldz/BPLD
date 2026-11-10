# Apply Design Runbook

**Purpose:** Step-by-step procedure for applying final visual design to the functional draft UI (Part 4 of Master Prompt)

**When to use:** After all modules are functionally complete and design assets collected per `DESIGN-INTAKE-CHECKLIST.md`

---

## Prerequisites

- [ ] All modules passed Gate M2 (functionally complete)
- [ ] Design assets collected (see `DESIGN-INTAKE-CHECKLIST.md`)
- [ ] Design-swap test passing on current draft (tokens work, no raw values)
- [ ] `DESIGN-DEBT.md` is empty (all raw values removed or justified)
- [ ] Designer available for questions

---

## Phase 1: Token Import

### 1.1 Backup Current Tokens
```bash
cp -r design/tokens design/tokens.backup-$(date +%Y%m%d)
```

### 1.2 Import Brand Tokens

Create or update `design/tokens/primitive.json`:
- Colors (from designer's palette)
- Typography (font families, sizes, weights, line heights)
- Spacing scale
- Border radius values
- Shadow definitions
- Z-index scale
- Motion (durations, easing)

### 1.3 Map to Semantic Tokens

Update `design/tokens/semantic.json`:
- Map primitive colors to semantic meaning (primary, success, warning, error, neutral)
- Define light and dark theme variants
- Text colors (on-background, on-surface, on-primary)
- Border and surface colors per theme

### 1.4 Define Component Tokens

Update `design/tokens/component.json`:
- Button styles (padding, radius, shadow per variant)
- Form field styles
- Card styles
- Navigation styles
- Data table styles

### 1.5 Generate CSS Variables

Run token build process:
```bash
npm run build:tokens
# or: node scripts/build-tokens.js
```

Verify output in `src/ui/tokens/generated/`:
- `tokens.css` (CSS variables)
- `tokens.js` (JS constants if needed)

### 1.6 Update Theme Toggle

Ensure theme switcher applies correct CSS class:
- `data-theme="light"` on `<html>` or `<body>`
- `data-theme="dark"` for dark mode

---

## Phase 2: UI Kit Restyling

Work through each component in `src/ui/components/`:

### 2.1 Component Gallery Verification

Start component gallery:
```bash
npm run dev:ui-kit
# or: npm run storybook
```

Open at `http://localhost:6006` or `/dev/ui-kit`

### 2.2 Restyle Components One by One

For each component:
1. Open component file (e.g., `src/ui/components/Button.tsx`)
2. Replace any remaining raw values with token references
3. Apply designer's specifications (padding, radius, shadow, etc.)
4. Update all variants (primary, secondary, sizes, states)
5. Check dark theme rendering
6. Verify accessibility (contrast, focus states)
7. Update component gallery story if needed
8. Take before-and-after screenshot

**Component checklist:**
- [ ] Buttons
- [ ] Form fields (text input, textarea, select, checkbox, radio, toggle)
- [ ] Date picker
- [ ] Data table
- [ ] Modal
- [ ] Drawer
- [ ] Confirm dialog
- [ ] Toast
- [ ] Status pill
- [ ] Card
- [ ] Tabs
- [ ] Stepper
- [ ] Timeline
- [ ] Kanban board
- [ ] Calendar grid
- [ ] Chart wrapper
- [ ] Empty state
- [ ] Skeleton loader
- [ ] App shell (header, sidebar, nav)
- [ ] Page header
- [ ] Money formatter (if styled)
- [ ] Date formatter (if styled)
- [ ] Permission gate (if visual feedback)

### 2.3 Visual Regression Test

Run visual regression tests:
```bash
npm run test:visual
```

Review and approve changes:
```bash
npm run test:visual:approve
```

---

## Phase 3: Module-by-Module Application

Apply design to feature screens in build order:

### 3.1 Module K (Administration)

1. **Screens:** User list, user detail, role editor, audit log, settings pages
2. **Update:** Logo in header, shop name from settings, branded colors
3. **Test:** Log in, navigate all K screens, verify design applied
4. **Contrast check:** Use browser DevTools or contrast analyzer
5. **Keyboard test:** Tab through all forms, verify focus visible
6. **Dark mode:** Toggle theme, verify all K screens readable
7. **Screenshot:** Before-and-after for documentation
8. **Update:** `docs/design/SCREEN-INVENTORY.md` — K screens marked "Design Applied"

Repeat for each module: A → B → C → D → E → F → G → H → I → J

### 3.2 Per-Module Checklist

- [ ] All screens render without errors
- [ ] All interactive elements styled per design
- [ ] No raw visual values (lint passes)
- [ ] Loading, empty, error states styled
- [ ] Dark theme readable
- [ ] Keyboard navigation works
- [ ] Contrast meets WCAG AA
- [ ] Screenshots taken
- [ ] Screen inventory updated

---

## Phase 4: Print Template Restyling

Update printable document templates in `src/platform/templates/`:

### 4.1 Templates to Update
- [ ] Estimate / Quotation
- [ ] Job card / Service order
- [ ] Invoice
- [ ] Receipt
- [ ] Payslip
- [ ] Customer statement
- [ ] End-of-day (Z) report
- [ ] Expense report

### 4.2 Per Template

1. Open template file (e.g., `invoice.html` or `.hbs`, `.ejs`, per stack)
2. Apply designer's print layout
3. Update header with logo from settings
4. Apply typography (print fonts may differ from screen)
5. Style line items table
6. Style totals section
7. Add legal text per designer's placement
8. Test print preview in browser
9. Generate PDF, verify rendering
10. Print on actual printer, verify margins and legibility

### 4.3 Dynamic Data

Ensure templates pull:
- Shop name, address, phone from settings (Module K)
- Logo URL from settings
- Brand colors from settings or tokens
- All business data from respective modules

No hardcoded shop name or branding!

---

## Phase 5: Design-Swap Test

Run the full design-swap test (per Master Plan §F12):

### 5.1 Primary Color Change

1. Change `--color-primary` in `design/tokens/primitive.json` to a contrasting color (e.g., from blue to orange)
2. Rebuild tokens: `npm run build:tokens`
3. Restart dev server
4. Navigate through all modules
5. **Expected:** Primary buttons, links, active states all use new color
6. **Verify:** No raw blue values remain (everything updates)
7. Revert change

### 5.2 Font Family Change

1. Change `--font-family-base` to a different web-safe font (e.g., from Inter to Georgia)
2. Rebuild tokens
3. Restart dev server
4. Navigate through all modules
5. **Expected:** All text uses new font
6. **Verify:** No hardcoded fonts remain
7. Revert change

### 5.3 Logo and Name Change

1. In Module K settings, upload different logo
2. Change shop name to "Test Auto Shop"
3. Navigate to multiple screens
4. **Expected:** New logo appears in header, new name appears in app shell
5. Open invoice template, generate invoice
6. **Expected:** New logo and name appear in printed document
7. Revert changes

### 5.4 Dark Theme Check

1. Toggle to dark mode
2. Navigate all modules
3. **Expected:** No unreadable screens (white text on white, black on black)
4. **Verify:** All text has sufficient contrast
5. Generate printed invoice
6. **Expected:** Print uses light theme regardless of screen theme

### 5.5 Raw Value Lint

Run lint check for raw visual values:
```bash
npm run lint:design
```

**Expected:** Zero violations

If violations found:
- Fix or justify in `DESIGN-DEBT.md`
- Must be empty before Design Pass sign-off

---

## Phase 6: Verification and Sign-Off

### 6.1 Full Regression Test

Run complete test suite:
```bash
npm run test:all
```

**All tests must pass.** Design changes should not break business logic.

### 6.2 Cross-Browser Check

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, if available)
- [ ] Edge (latest)

Check for:
- Layout consistency
- Font rendering
- Color accuracy
- Responsive breakpoints

### 6.3 Device Profile Check

- [ ] **Desktop** (1920x1080, 1366x768): Full layout, all features accessible
- [ ] **Tablet** (768x1024, landscape and portrait): Touch targets 44x44px minimum, simplified tables
- [ ] **Mobile** (375x667, 360x640): Single column, hamburger nav, readable text

### 6.4 Accessibility Audit

Run automated accessibility scan:
```bash
npm run test:a11y
# or: Lighthouse audit, axe DevTools
```

Verify:
- [ ] No critical or serious issues
- [ ] All contrast ratios pass WCAG AA
- [ ] All forms have labels
- [ ] All images have alt text
- [ ] Keyboard navigation complete

### 6.5 Performance Check

Run Lighthouse performance audit on key screens:
- Dashboard
- Job board
- Customer list
- Invoice screen

**Target:** Performance score > 80, no layout shifts

### 6.6 Designer Review

- [ ] Designer reviews restyled app
- [ ] Designer reviews print templates
- [ ] Designer approves design implementation
- [ ] Any adjustments documented and applied

### 6.7 Stakeholder Demo

- [ ] Owner/GM walkthrough
- [ ] Key users (advisor, cashier, technician) review
- [ ] Feedback collected and triaged (must-fix vs. nice-to-have)

### 6.8 Design Pass Sign-Off

Record in `docs/DECISIONS.md`:
- Date: `___________`
- Design Pass complete
- Approver: `___________` (Designer)
- Approver: `___________` (Product Owner)
- Notes: Any deferred items or known issues

---

## Phase 7: Cleanup and Documentation

### 7.1 Remove Backup Tokens

```bash
rm -rf design/tokens.backup-*
```

### 7.2 Update Documentation

- [ ] `docs/design/SCREEN-INVENTORY.md` — All screens marked "Design Applied"
- [ ] `docs/design/DESIGN-DEBT.md` — Verify empty or justified items remain
- [ ] `README.md` — Update screenshots if present
- [ ] User guides — Update screenshots in `docs/modules/<X>/USER-GUIDE.md`

### 7.3 Create Release Tag

```bash
git tag -a design-pass-complete -m "Design Pass complete, all modules restyled"
git push --tags
```

### 7.4 Update Runbook

Add lessons learned to this runbook:
- What went smoothly
- What was challenging
- Tool or process improvements for next time

---

## Rollback Procedure

If design application causes critical issues:

1. **Revert tokens:**
   ```bash
   cp -r design/tokens.backup-<date>/* design/tokens/
   npm run build:tokens
   ```

2. **Revert component changes:**
   ```bash
   git checkout <commit-before-design-pass> src/ui/components/
   ```

3. **Restart dev server, verify app functional**

4. **Triage issue:**
   - Was it a token mapping error?
   - Was it a component implementation bug?
   - Was it a browser compatibility issue?

5. **Fix root cause, re-apply design incrementally (one component or module at a time)**

---

## Success Criteria

Design Pass is complete when:
- [ ] All tokens imported and CSS variables generated
- [ ] UI kit components restyled per design specs
- [ ] All module screens restyled (K through J)
- [ ] All print templates restyled
- [ ] Design-swap test passes (color, font, logo changes work)
- [ ] Lint clean (no raw visual values)
- [ ] Dark theme readable
- [ ] All tests green (no broken business logic)
- [ ] Accessibility audit clean
- [ ] Cross-browser tested
- [ ] Designer approved
- [ ] Stakeholder demo completed
- [ ] Sign-off recorded

---

**Last Updated:** 2026-11-10  
**Owner:** `PENDING(Q-21)`
