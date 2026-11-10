# Design Intake Checklist

**Purpose:** What to collect from the designer when visual design is ready (before Design Pass, Part 4)

---

## Brand Assets

- [ ] **Logo files**
  - [ ] SVG (vector, preferred)
  - [ ] PNG (high-res, transparent background)
  - [ ] Favicon (ICO or PNG, 16x16, 32x32, 64x64)
  - [ ] Usage guidelines (minimum size, clear space, background restrictions)

- [ ] **Brand colors**
  - [ ] Primary color (hex codes for light and dark variants)
  - [ ] Secondary/accent colors
  - [ ] Neutral/gray ramp (at least 10 shades from white to black)
  - [ ] Semantic colors: success (green), warning (amber), error (red), info (blue)
  - [ ] Background, surface, border colors
  - [ ] Text colors (on light and dark backgrounds)

- [ ] **Typography**
  - [ ] Font families (heading, body, mono for code)
  - [ ] Font files (WOFF, WOFF2) or web font links (Google Fonts, etc.)
  - [ ] Font licenses (confirm web usage rights)
  - [ ] Type scale (font sizes: xs, sm, base, lg, xl, 2xl, 3xl, 4xl)
  - [ ] Line heights per size
  - [ ] Font weights used (regular, medium, semibold, bold)

---

## Design Tokens

- [ ] **Spacing scale** (margin, padding values: xs, sm, md, lg, xl, 2xl, etc.)
- [ ] **Border radius** (none, sm, md, lg, full)
- [ ] **Shadows** (sm, md, lg, xl for elevation)
- [ ] **Border widths** (1px, 2px, 4px)
- [ ] **Z-index scale** (dropdown, modal, tooltip, toast layers)
- [ ] **Motion/animation** (duration, easing curves)
- [ ] **Breakpoints** (mobile, tablet, desktop px widths)
- [ ] **Density options** (compact, comfortable, spacious) if applicable

Preferred format: JSON or CSV that can be imported into token files

---

## Component Specifications

For each UI-kit component, provide:

- [ ] **Visual states:** Default, hover, focus, active, disabled, loading, error
- [ ] **Variants:** Size (sm, md, lg), style (primary, secondary, ghost, link), shape
- [ ] **Spacing:** Internal padding, gaps between elements
- [ ] **Typography:** Which type scale and weight to use
- [ ] **Colors:** Which token for background, border, text in each state
- [ ] **Icons:** Which icon set, size, color
- [ ] **Animations:** Transitions, hover effects, loading spinners

**Can provide as:**
- Figma file with component library (preferred)
- Storybook or similar component gallery
- Design system documentation site
- Annotated screenshots

**Priority components (must have):**
- Buttons (primary, secondary, ghost, link, icon-only)
- Form fields (text input, text area, select, checkbox, radio, toggle, date picker)
- Data table (sortable headers, row hover, pagination)
- Modal and drawer
- Toast notifications
- Status pills
- Cards
- Navigation (app shell, sidebar, tabs)

---

## Icon Set

- [ ] **Icon library** (name and version: Heroicons, Feather, Material Icons, custom, etc.)
- [ ] **Icon files** (SVG sprite or individual SVGs)
- [ ] **Sizes:** 16px, 20px, 24px (or scale factors)
- [ ] **Stroke width** if outline style
- [ ] **Usage guide:** Which icons for common actions (edit, delete, save, cancel, search, filter, etc.)

---

## Print Layouts

For printable documents (estimate, invoice, receipt, job card, payslip, statements, reports):

- [ ] **Template designs** (PDF or high-fidelity mockups)
- [ ] **Header/footer** (logo placement, shop name, contact info, page numbers)
- [ ] **Typography:** Font for print (may differ from web)
- [ ] **Line items table** styling
- [ ] **Totals section** styling
- [ ] **Legal text** placement (terms, warranty, disclaimers)
- [ ] **Paper size:** A4 or letter
- [ ] **Margins:** Top, bottom, left, right (for safe print area)

---

## Responsive Behavior

- [ ] **Mobile breakpoint** (320px–767px): Layout changes, hidden elements, simplified nav
- [ ] **Tablet breakpoint** (768px–1023px): Touch targets, simplified tables
- [ ] **Desktop breakpoint** (1024px+): Full layout, multi-column

Provide guidance or examples for:
- Navigation collapse (hamburger menu)
- Table responsiveness (horizontal scroll, stacked cards, or hidden columns)
- Form layouts (single vs. multi-column)

---

## Accessibility

- [ ] **Contrast ratios verified** (WCAG AA minimum 4.5:1 for normal text, 3:1 for large)
- [ ] **Color-blind safe palette** (tested with simulation tools)
- [ ] **Focus indicators** designed (visible outline or highlight)
- [ ] **Touch targets:** Minimum 44x44px for mobile
- [ ] **Text sizes:** Minimum 16px for body text (no smaller than 14px)

---

## States and Scenarios

Provide designs for:
- [ ] **Empty states:** No data, no search results, no items in list
- [ ] **Loading states:** Skeleton loaders, spinners
- [ ] **Error states:** Form validation errors, API errors, 404, 500
- [ ] **Success states:** Confirmation messages, success modals
- [ ] **No permission:** "Access denied" screen

---

## Dark Mode

- [ ] Is dark mode required? (Yes / No / Later)
- [ ] If yes, provide dark theme token values
- [ ] Surface colors (dark backgrounds)
- [ ] Text colors (light on dark)
- [ ] Ensure readability in both themes

---

## Handoff Format

Preferred formats (check all that apply):
- [ ] **Figma:** Shared link with developer access, organized by module/screen
- [ ] **Sketch:** Files with all artboards and symbols
- [ ] **Adobe XD:** Shared link or files
- [ ] **Zeplin / Avocode:** Specs and assets exported
- [ ] **Code-ready:** HTML/CSS prototypes
- [ ] **Documentation:** Written design system guide (Google Doc, Notion, Confluence)

**Assets export:**
- [ ] All images exported at 1x, 2x, 3x for retina
- [ ] SVG icons exported individually or as sprite
- [ ] Fonts packaged with licenses

---

## Review and Approval

- [ ] Design reviewed by key stakeholders (owner, manager, advisors)
- [ ] Design approved for implementation
- [ ] Designer available for questions during Design Pass
- [ ] Design Pass scheduled (see `docs/design/APPLY-DESIGN-RUNBOOK.md`)

---

## Notes

Add any additional design decisions, constraints, or context:

---

**Completed by:** `_______________`  
**Date:** `_______________`  
**Design Pass Start:** `_______________`
