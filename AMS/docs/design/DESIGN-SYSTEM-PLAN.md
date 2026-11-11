# AMS Design System Plan

**Project:** Autoshop Management System (AMS)  
**Version:** 1.0  
**Status:** Phase 0 Deliverable  
**Last Updated:** 2025-01-XX

---

## Document Control

This Design System Plan defines the complete visual architecture, component inventory, and design-swap implementation strategy for AMS. It is built in Phase 1 before any module UI and enforced at every Gate through the design-swap test.

**Reference:** Master Plan §8 (Design Readiness Plan), §F  
**Cross-References:** `docs/01-MASTER-PLAN.md`, module specifications in `docs/modules/`

---

## 1. Purpose and Scope

### 1.1 Why a Design System Exists for AMS

The AMS Design System provides a **unified visual and interaction language** across all 11 business modules (A–K), ensuring consistency, maintainability, and scalability. It serves three strategic purposes:

1. **Speed**: Pre-built, tested components accelerate module development (Phases 2–6)
2. **Consistency**: Customers, advisors, technicians, and management see a coherent interface regardless of module
3. **Design Independence**: Business logic remains decoupled from visual design, enabling redesign without rewriting features

### 1.2 Design-Swap Principle

AMS follows a **two-phase visual development strategy**:

**Phase 1–6 (Draft UI):**  
Build functional screens using neutral, accessible design tokens and UI Kit components. Focus: information architecture, workflows, validation, business rules.

**Phase 0 Part 4 (Design Pass):**  
Apply final brand identity, colors, typography, spacing by **changing only token values and component variant styles**—zero changes to module business logic or screen templates.

**Gate Requirement:**  
At every Gate (0, 1, 2, 3, 4, 5, 6, 7), the **design-swap test** (§5) must pass, proving that visual changes require only CSS token updates, not code changes.

### 1.3 Enforcement at Gates

Each Gate checklist includes:
- **Design-swap test passed** (see §5 procedure)
- **No raw design values in code** (enforced by `no-raw-design-values` lint rule)
- **All UI uses tokens and UI Kit components** (manual audit)
- **Accessibility baseline verified** (§6)

Failure blocks Gate approval until corrected.

---

## 2. Token System

The AMS token system uses a **three-tier architecture** to separate abstract design primitives from semantic application meaning from specific component styling.

**Implementation:** CSS custom properties in `:root` scope  
**Source File:** `src/ui-kit/tokens/tokens.css` (or `.ts` for CSS-in-JS frameworks)  
**Principle:** All visual values flow from tokens; no raw hex, px, rem, or font names in component files

### 2.1 Primitive Tokens

Primitive tokens are **abstract, context-free values**—the raw palette from which semantic tokens are composed.

#### 2.1.1 Color Palette

```css
:root {
  /* Grays (neutral scale) */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  --color-gray-950: #030712;

  /* Brand Primary (placeholder - replaced in Design Pass) */
  --color-brand-primary-50: #eff6ff;
  --color-brand-primary-100: #dbeafe;
  --color-brand-primary-200: #bfdbfe;
  --color-brand-primary-300: #93c5fd;
  --color-brand-primary-400: #60a5fa;
  --color-brand-primary-500: #3b82f6;
  --color-brand-primary-600: #2563eb;
  --color-brand-primary-700: #1d4ed8;
  --color-brand-primary-800: #1e40af;
  --color-brand-primary-900: #1e3a8a;

  /* Brand Secondary (placeholder) */
  --color-brand-secondary-50: #faf5ff;
  --color-brand-secondary-100: #f3e8ff;
  --color-brand-secondary-200: #e9d5ff;
  --color-brand-secondary-300: #d8b4fe;
  --color-brand-secondary-400: #c084fc;
  --color-brand-secondary-500: #a855f7;
  --color-brand-secondary-600: #9333ea;
  --color-brand-secondary-700: #7e22ce;
  --color-brand-secondary-800: #6b21a8;
  --color-brand-secondary-900: #581c87;

  /* Status Colors */
  --color-success-50: #f0fdf4;
  --color-success-100: #dcfce7;
  --color-success-200: #bbf7d0;
  --color-success-300: #86efac;
  --color-success-400: #4ade80;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  --color-success-700: #15803d;
  --color-success-800: #166534;
  --color-success-900: #14532d;

  --color-warning-50: #fefce8;
  --color-warning-100: #fef9c3;
  --color-warning-200: #fef08a;
  --color-warning-300: #fde047;
  --color-warning-400: #facc15;
  --color-warning-500: #eab308;
  --color-warning-600: #ca8a04;
  --color-warning-700: #a16207;
  --color-warning-800: #854d0e;
  --color-warning-900: #713f12;

  --color-danger-50: #fef2f2;
  --color-danger-100: #fee2e2;
  --color-danger-200: #fecaca;
  --color-danger-300: #fca5a5;
  --color-danger-400: #f87171;
  --color-danger-500: #ef4444;
  --color-danger-600: #dc2626;
  --color-danger-700: #b91c1c;
  --color-danger-800: #991b1b;
  --color-danger-900: #7f1d1d;

  --color-info-50: #eff6ff;
  --color-info-100: #dbeafe;
  --color-info-200: #bfdbfe;
  --color-info-300: #93c5fd;
  --color-info-400: #60a5fa;
  --color-info-500: #3b82f6;
  --color-info-600: #2563eb;
  --color-info-700: #1d4ed8;
  --color-info-800: #1e40af;
  --color-info-900: #1e3a8a;
}
```

#### 2.1.2 Typography Scale

```css
:root {
  /* Font Families */
  --font-family-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-family-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace;

  /* Font Sizes */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */

  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

#### 2.1.3 Spacing Scale

```css
:root {
  --spacing-0: 0;
  --spacing-0-5: 0.125rem;  /* 2px */
  --spacing-1: 0.25rem;     /* 4px */
  --spacing-1-5: 0.375rem;  /* 6px */
  --spacing-2: 0.5rem;      /* 8px */
  --spacing-3: 0.75rem;     /* 12px */
  --spacing-4: 1rem;        /* 16px */
  --spacing-5: 1.25rem;     /* 20px */
  --spacing-6: 1.5rem;      /* 24px */
  --spacing-8: 2rem;        /* 32px */
  --spacing-10: 2.5rem;     /* 40px */
  --spacing-12: 3rem;       /* 48px */
  --spacing-16: 4rem;       /* 64px */
  --spacing-20: 5rem;       /* 80px */
  --spacing-24: 6rem;       /* 96px */
}
```

#### 2.1.4 Border Radii

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;   /* 2px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-full: 9999px;
}
```

#### 2.1.5 Shadow Scale

```css
:root {
  --shadow-none: none;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
```

#### 2.1.6 Z-Index Scale

```css
:root {
  --z-base: 0;
  --z-dropdown: 1000;
  --z-sticky: 1100;
  --z-fixed: 1200;
  --z-modal-backdrop: 1300;
  --z-modal: 1400;
  --z-popover: 1500;
  --z-tooltip: 1600;
  --z-toast: 1700;
}
```

#### 2.1.7 Transition Durations

```css
:root {
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 2.2 Semantic Tokens

Semantic tokens assign **application meaning** to primitive tokens. They answer: "What does this color/size represent in our system?"

#### 2.2.1 Surface Colors

```css
:root {
  --surface-page-bg: var(--color-gray-50);
  --surface-card: var(--color-white, #ffffff);
  --surface-sidebar: var(--color-gray-900);
  --surface-modal-overlay: rgba(0, 0, 0, 0.5);
  --surface-input: var(--color-white, #ffffff);
  --surface-disabled: var(--color-gray-100);
}
```

#### 2.2.2 Text Colors

```css
:root {
  --text-primary: var(--color-gray-900);
  --text-secondary: var(--color-gray-600);
  --text-muted: var(--color-gray-500);
  --text-inverse: var(--color-white, #ffffff);
  --text-disabled: var(--color-gray-400);
  --text-link: var(--color-brand-primary-600);
  --text-link-hover: var(--color-brand-primary-700);
}
```

#### 2.2.3 Border Colors

```css
:root {
  --border-default: var(--color-gray-300);
  --border-strong: var(--color-gray-400);
  --border-focus: var(--color-brand-primary-500);
  --border-error: var(--color-danger-500);
}
```

#### 2.2.4 Interactive States

```css
:root {
  /* Hover overlays (applied on top of base color) */
  --state-hover-overlay: rgba(0, 0, 0, 0.05);
  --state-active-overlay: rgba(0, 0, 0, 0.1);
  
  /* Focus ring */
  --state-focus-ring: 0 0 0 3px var(--color-brand-primary-200);
  --state-focus-ring-error: 0 0 0 3px var(--color-danger-200);
}
```

#### 2.2.5 Status Semantic Colors

```css
:root {
  /* Success */
  --status-success-bg: var(--color-success-50);
  --status-success-text: var(--color-success-700);
  --status-success-border: var(--color-success-300);

  /* Warning / Attention */
  --status-warning-bg: var(--color-warning-50);
  --status-warning-text: var(--color-warning-800);
  --status-warning-border: var(--color-warning-300);

  /* Danger / Error */
  --status-danger-bg: var(--color-danger-50);
  --status-danger-text: var(--color-danger-700);
  --status-danger-border: var(--color-danger-300);

  /* Info / Neutral */
  --status-info-bg: var(--color-info-50);
  --status-info-text: var(--color-info-700);
  --status-info-border: var(--color-info-300);

  /* Pending / In Progress */
  --status-pending-bg: var(--color-gray-100);
  --status-pending-text: var(--color-gray-700);
  --status-pending-border: var(--color-gray-300);
}
```

#### 2.2.6 Status Map Table

Every AMS business status maps to a semantic color token for consistent visual communication across modules:

| Status | Semantic Token | Visual Intent |
|--------|---------------|---------------|
| **Service Order Statuses** | | |
| Checked-In | `pending` | Neutral - newly arrived |
| Awaiting Estimate | `pending` | Neutral - diagnostic in progress |
| Awaiting Approval | `warning` | Attention - customer decision required |
| Awaiting Parts | `warning` | Attention - blocked waiting |
| In Progress | `info` | Active work |
| Quality Check | `info` | Active inspection |
| Ready for Release | `success` | Positive - complete, ready |
| Released | `success` | Positive - vehicle returned |
| Closed | `success` | Positive - fully complete |
| On Hold | `warning` | Attention - paused |
| Cancelled | `danger` | Negative - abandoned |
| **Appointment Statuses** | | |
| Scheduled | `pending` | Neutral - booked |
| Confirmed | `info` | Active - customer confirmed |
| Arrived | `success` | Positive - on-site |
| No-Show | `danger` | Negative - missed |
| Cancelled | `danger` | Negative - abandoned |
| **Invoice Statuses** | | |
| Draft | `pending` | Neutral - not finalized |
| Issued | `info` | Active - awaiting payment |
| Partially Paid | `warning` | Attention - balance due |
| Paid | `success` | Positive - complete |
| Overdue | `danger` | Negative - late |
| Voided | `danger` | Negative - cancelled |
| **Payment Statuses** | | |
| Pending | `warning` | Attention - clearing |
| Cleared | `success` | Positive - funds received |
| Refunded | `info` | Neutral - returned |
| **Purchase Order Statuses** | | |
| Draft | `pending` | Neutral - not sent |
| Sent | `info` | Active - with supplier |
| Partially Received | `warning` | Attention - incomplete |
| Received | `success` | Positive - delivered |
| Closed | `success` | Positive - complete |
| Cancelled | `danger` | Negative - abandoned |
| **Inventory Statuses** | | |
| In Stock | `success` | Positive - available |
| Low Stock | `warning` | Attention - reorder soon |
| Out of Stock | `danger` | Negative - unavailable |
| On Order | `info` | Active - incoming |
| **Complaint Statuses** | | |
| Open | `warning` | Attention - new issue |
| Investigating | `info` | Active - in progress |
| Resolved | `success` | Positive - fixed |
| Closed | `success` | Positive - complete |
| Escalated | `danger` | Negative - requires management |
| **Reminder Statuses** | | |
| Scheduled | `pending` | Neutral - queued |
| Sent | `info` | Active - delivered |
| Booked | `success` | Positive - converted |
| Declined | `danger` | Negative - rejected |
| No Response | `warning` | Attention - no action |

**Implementation Note:** StatusBadge component (§3.4) receives a status code string and automatically maps it to the correct semantic token using a lookup table. No hardcoded colors in templates.

### 2.3 Component Tokens

Component tokens define **specific UI element styles** by composing semantic and primitive tokens.

#### 2.3.1 Button Variants

```css
:root {
  /* Primary Button */
  --button-primary-bg: var(--color-brand-primary-600);
  --button-primary-text: var(--color-white);
  --button-primary-border: var(--color-brand-primary-600);
  --button-primary-hover-bg: var(--color-brand-primary-700);
  --button-primary-active-bg: var(--color-brand-primary-800);
  --button-primary-disabled-bg: var(--color-gray-300);
  --button-primary-disabled-text: var(--color-gray-500);

  /* Secondary Button */
  --button-secondary-bg: var(--color-white);
  --button-secondary-text: var(--color-brand-primary-600);
  --button-secondary-border: var(--color-brand-primary-600);
  --button-secondary-hover-bg: var(--color-brand-primary-50);
  --button-secondary-active-bg: var(--color-brand-primary-100);
  --button-secondary-disabled-bg: var(--color-gray-100);
  --button-secondary-disabled-text: var(--color-gray-400);

  /* Ghost Button */
  --button-ghost-bg: transparent;
  --button-ghost-text: var(--color-gray-700);
  --button-ghost-border: transparent;
  --button-ghost-hover-bg: var(--color-gray-100);
  --button-ghost-active-bg: var(--color-gray-200);

  /* Danger Button */
  --button-danger-bg: var(--color-danger-600);
  --button-danger-text: var(--color-white);
  --button-danger-border: var(--color-danger-600);
  --button-danger-hover-bg: var(--color-danger-700);
  --button-danger-active-bg: var(--color-danger-800);
}
```

#### 2.3.2 Input Variants

```css
:root {
  /* Default Input */
  --input-bg: var(--surface-input);
  --input-text: var(--text-primary);
  --input-border: var(--border-default);
  --input-placeholder: var(--text-muted);
  --input-focus-border: var(--border-focus);
  --input-focus-ring: var(--state-focus-ring);

  /* Error Input */
  --input-error-border: var(--border-error);
  --input-error-ring: var(--state-focus-ring-error);
  --input-error-text: var(--color-danger-600);

  /* Disabled Input */
  --input-disabled-bg: var(--surface-disabled);
  --input-disabled-text: var(--text-disabled);
  --input-disabled-border: var(--border-default);
}
```

#### 2.3.3 Badge / Pill Variants

```css
:root {
  /* Badge uses status semantic tokens directly */
  /* Example mapping in component logic:
     status="success" → --status-success-bg, --status-success-text, --status-success-border
     status="warning" → --status-warning-bg, etc.
  */
}
```

#### 2.3.4 Table Row Variants

```css
:root {
  --table-header-bg: var(--color-gray-100);
  --table-header-text: var(--text-primary);
  --table-row-bg: var(--color-white);
  --table-row-hover-bg: var(--color-gray-50);
  --table-row-selected-bg: var(--color-brand-primary-50);
  --table-row-highlighted-bg: var(--color-warning-50);
  --table-border: var(--border-default);
}
```

#### 2.3.5 Card Variants

```css
:root {
  /* Default Card */
  --card-bg: var(--surface-card);
  --card-border: var(--border-default);
  --card-shadow: var(--shadow-sm);

  /* Elevated Card */
  --card-elevated-shadow: var(--shadow-md);

  /* Bordered Card */
  --card-bordered-border: var(--border-strong);
}
```

#### 2.3.6 Sidebar and Navigation

```css
:root {
  --sidebar-bg: var(--surface-sidebar);
  --sidebar-text: var(--color-gray-300);
  --sidebar-text-hover: var(--color-white);
  --sidebar-icon: var(--color-gray-400);
  --sidebar-icon-active: var(--color-brand-primary-400);
  --sidebar-item-active-bg: var(--color-gray-800);
  --sidebar-border: var(--color-gray-800);
}
```

---

## 3. UI Kit Component List

All shared components are built in **Phase 1** before module UI work begins. Each component is catalogued with a `DSN-nn` ID and documented in Storybook or equivalent component gallery.

Components are grouped into six functional categories.

### 3.1 Layout Components

| ID | Component | Description | Props |
|----|-----------|-------------|-------|
| DSN-01 | **AppShell** | Top-level layout wrapper: sidebar, topbar, main content area, footer | `sidebarCollapsed`, `children` |
| DSN-02 | **Sidebar** | Collapsible navigation sidebar with module icons, active state, collapse toggle | `collapsed`, `onToggle`, `activeModule`, `items[]` |
| DSN-03 | **TopBar** | Horizontal bar: logo, global search, notifications bell, user menu | `userName`, `notificationCount`, `onSearch` |
| DSN-04 | **PageHeader** | Page title, breadcrumbs, action buttons (right-aligned) | `title`, `breadcrumbs[]`, `actions[]` |
| DSN-05 | **Section** | Card wrapper for page sections with optional title | `title`, `children`, `variant` (default, elevated, bordered) |
| DSN-06 | **SplitPane** | Resizable two-panel layout (e.g., job list + detail) | `leftPanel`, `rightPanel`, `defaultWidth` |
| DSN-07 | **Drawer** | Slide-in panel from left/right/bottom | `open`, `side`, `onClose`, `children` |
| DSN-08 | **ModalDialog** | Centered modal with backdrop, focus trap, close on Esc | `open`, `onClose`, `title`, `size` (sm, md, lg, xl, full), `children` |
| DSN-09 | **Popover** | Floating panel anchored to trigger element | `trigger`, `content`, `placement` |
| DSN-10 | **Tooltip** | Hover/focus hint text | `content`, `children`, `placement` |

### 3.2 Navigation Components

| ID | Component | Description | Props |
|----|-----------|-------------|-------|
| DSN-11 | **Breadcrumb** | Hierarchy trail (Home > Customers > Jane Doe) | `items[]` with `label`, `href` |
| DSN-12 | **Tabs** | Switchable views: line, pill, or vertical style | `tabs[]`, `activeTab`, `onChange`, `variant` |
| DSN-13 | **Pagination** | Page controls: prev/next, jump to page, items per page | `total`, `page`, `pageSize`, `onPageChange` |
| DSN-14 | **StepWizard** | Multi-step process indicator (e.g., booking flow) | `steps[]`, `currentStep`, `onStepClick` |

### 3.3 Data Input Components

| ID | Component | Description | Props |
|----|-----------|-------------|-------|
| DSN-15 | **TextInput** | Text, number, email, phone, password input with label, hint, error | `type`, `label`, `hint`, `error`, `value`, `onChange`, `required`, `disabled` |
| DSN-16 | **Textarea** | Multi-line text input | `label`, `hint`, `error`, `rows`, `value`, `onChange` |
| DSN-17 | **Select** | Dropdown selector (single select) | `label`, `options[]`, `value`, `onChange`, `searchable`, `placeholder` |
| DSN-18 | **MultiSelect** | Multi-option selector with tags | `label`, `options[]`, `value[]`, `onChange`, `searchable` |
| DSN-19 | **DatePicker** | Calendar-based date selector | `label`, `value`, `onChange`, `minDate`, `maxDate`, `locale` |
| DSN-20 | **DateRangePicker** | Start and end date selector | `label`, `startDate`, `endDate`, `onChange` |
| DSN-21 | **TimePicker** | Hour:minute selector (12h or 24h) | `label`, `value`, `onChange`, `format` |
| DSN-22 | **Checkbox** | Single checkbox with label | `label`, `checked`, `onChange`, `disabled` |
| DSN-23 | **CheckboxGroup** | Multiple checkboxes (vertical or horizontal) | `label`, `options[]`, `value[]`, `onChange` |
| DSN-24 | **RadioGroup** | Single-selection radio buttons | `label`, `options[]`, `value`, `onChange` |
| DSN-25 | **Toggle / Switch** | On/off binary control | `label`, `checked`, `onChange`, `disabled` |
| DSN-26 | **FileUpload** | Drag-drop or click to upload, file type and size validation | `label`, `accept`, `maxSize`, `multiple`, `onUpload` |
| DSN-27 | **SignaturePad** | Canvas-based signature capture | `onSave`, `onClear` |
| DSN-28 | **PinInput** | Segmented numeric code input (e.g., 4-digit PIN) | `length`, `value`, `onChange`, `mask` |
| DSN-29 | **RichTextEditor** | WYSIWYG editor for templates and long-form content | `value`, `onChange`, `toolbar[]` |
| DSN-30 | **ColorPicker** | Hex/RGB color selector (for settings, report customization) | `value`, `onChange` |
| DSN-31 | **CurrencyInput** | Philippine peso input with ₱ symbol, centavo-based, no float | `label`, `value`, `onChange`, `min`, `max` |
| DSN-32 | **QuantityInput** | Integer input with increment/decrement buttons | `label`, `value`, `onChange`, `min`, `max`, `step` |

### 3.4 Data Display Components

| ID | Component | Description | Props |
|----|-----------|-------------|-------|
| DSN-33 | **DataTable** | Sortable, filterable, paginated table with selectable rows, row actions, sticky header, responsive | `columns[]`, `data[]`, `sortable`, `filterable`, `paginated`, `onRowClick`, `onRowSelect`, `rowActions[]` |
| DSN-34 | **KanbanBoard** | Drag-drop columns with card summaries (for job status pipeline) | `columns[]`, `cards[]`, `onCardMove`, `onCardClick` |
| DSN-35 | **Timeline** | Vertical event list with timestamps (for service history, audit log) | `events[]` with `timestamp`, `title`, `description`, `icon` |
| DSN-36 | **Badge / StatusBadge** | Colored pill label; StatusBadge auto-maps status codes to semantic colors | `label`, `status`, `size` |
| DSN-37 | **Avatar** | User/customer avatar: initials or photo, multiple sizes | `name`, `src`, `size` |
| DSN-38 | **StatCard** | KPI tile: label, large value, optional trend and icon | `label`, `value`, `trend`, `icon`, `color` |
| DSN-39 | **ProgressBar** | Horizontal percentage bar | `value`, `max`, `label`, `color` |
| DSN-40 | **ProgressRing** | Circular percentage indicator | `value`, `max`, `size`, `color` |
| DSN-41 | **LineChart** | Time-series line graph (for dashboards) | `data[]`, `xAxis`, `yAxis`, `colors[]` |
| DSN-42 | **BarChart** | Vertical or horizontal bar chart | `data[]`, `orientation`, `colors[]` |
| DSN-43 | **PieChart** | Circular segment chart | `data[]`, `colors[]` |
| DSN-44 | **AreaChart** | Filled line chart | `data[]`, `colors[]` |
| DSN-45 | **CalendarView** | Monthly/weekly calendar grid with event blocks, drag-drop (for appointments) | `events[]`, `view` (month, week, day), `onEventClick`, `onEventDrop` |
| DSN-46 | **BayBoard** | Grid of bay status tiles (occupied, available, maintenance) | `bays[]`, `onBayClick` |

### 3.5 Feedback Components

| ID | Component | Description | Props |
|----|-----------|-------------|-------|
| DSN-47 | **Toast / Snackbar** | Temporary notification (success, warning, error, info), auto-dismiss | `message`, `type`, `duration`, `onClose` |
| DSN-48 | **AlertBanner** | Persistent page-level alert, dismissible | `message`, `type`, `onDismiss` |
| DSN-49 | **EmptyState** | Placeholder for empty lists/screens (icon, message, action button) | `icon`, `message`, `actionLabel`, `onAction` |
| DSN-50 | **LoadingSpinner** | Circular animated spinner | `size`, `color` |
| DSN-51 | **SkeletonLoader** | Content placeholder animation (table, card, list variants) | `variant`, `rows` |
| DSN-52 | **ConfirmDialog** | Confirmation modal for destructive actions | `open`, `title`, `message`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel` |
| DSN-53 | **ErrorBoundary** | React error boundary fallback UI | `children`, `fallback` |

### 3.6 Specialized AMS Components

| ID | Component | Description | Props |
|----|-----------|-------------|-------|
| DSN-54 | **VehiclePlateInput** | Philippine plate number format input with validation | `value`, `onChange`, `error` |
| DSN-55 | **OdometerInput** | Odometer reading input (integer, km) | `value`, `onChange`, `unit` |
| DSN-56 | **InspectionChecklist** | Itemized checklist with pass/attention/fail radio per item | `items[]`, `values{}`, `onChange` |
| DSN-57 | **DamageDiagram** | Interactive vehicle diagram with clickable regions to mark damage | `imageUrl`, `damages[]`, `onDamageAdd`, `onDamageRemove` |
| DSN-58 | **JobTimeClock** | Start/pause/stop timer with elapsed display | `jobId`, `status`, `elapsedSeconds`, `onStart`, `onPause`, `onStop` |
| DSN-59 | **EstimateLineEditor** | Editable rows for labor/parts/sublet with qty, unit price, discount, tax, running total | `lines[]`, `onLineChange`, `onLineAdd`, `onLineDelete`, `totals{}` |
| DSN-60 | **PaymentPanel** | Split payment form (cash, card, e-wallet, bank transfer), running total vs. invoice | `invoiceTotal`, `payments[]`, `onPaymentAdd`, `onPaymentRemove` |
| DSN-61 | **ReceiptTemplate** | Printable receipt layout (configurable header/footer from settings) | `data{}`, `companyInfo{}`, `template` |
| DSN-62 | **SignatureCapture** | Signature pad with save and clear | `onSave`, `onClear` |
| DSN-63 | **QRBarcodeScanner** | Camera-based QR/barcode scanner (for parts lookup, attendance) | `onScan`, `onError` |
| DSN-64 | **NotificationTemplateEditor** | Rich text editor with token placeholders (e.g., `{{customerName}}`, `{{appointmentDate}}`) | `value`, `onChange`, `tokens[]` |
| DSN-65 | **PermissionMatrix** | Role × module permission checkboxes (for admin settings) | `roles[]`, `modules[]`, `permissions{}`, `onChange` |
| DSN-66 | **AuditLogViewer** | Filterable, read-only table of audit trail entries | `entries[]`, `filters{}`, `onFilter` |
| DSN-67 | **CashierShiftSummary** | End-of-day cash reconciliation table (expected vs. actual) | `shiftData{}`, `onSubmit` |

**Total UI Kit Components:** 67

---

## 4. Device Profiles

AMS supports three device profiles with tailored layouts, touch targets, and navigation patterns. Every screen must be tested on its target profile(s) at Gate review.

### 4.1 Desktop (Primary Profile)

**Viewport:** 1280px+ width  
**Input:** Mouse + keyboard  
**Primary Users:** Front Desk/Advisor, Cashier, Accountant, Admin, Owner

**Layout Characteristics:**
- Full sidebar (240px wide, always visible)
- Multi-column forms (2-3 columns where logical)
- Dense data tables (more rows visible, compact spacing)
- Hover states and tooltips
- Keyboard shortcuts supported (e.g., Ctrl+K for search, Esc to close modals)

**Typography:**
- Base font size: `14px` (`--font-size-sm`)
- Comfortable reading distance (arm's length)

**Touch Targets:**
- Minimum: `32px × 32px` (WCAG 2.5.5 Level AA)
- Recommended: `36px × 36px` for primary actions

**Navigation:**
- Top bar with global search and notifications
- Persistent left sidebar with module icons and labels
- Breadcrumbs at page top

**Performance:**
- Page load: < 2 seconds on 10 Mbps connection
- Table render: 100 rows in < 500ms

### 4.2 Tablet (Technician Profile)

**Viewport:** 768px–1279px width  
**Input:** Touch-first (fingers), optional stylus  
**Primary Users:** Technician / Mechanic, Shop Supervisor

**Layout Characteristics:**
- Collapsible sidebar or bottom navigation bar
- Single-column job view (full-width cards)
- Simplified navigation: **only Modules C (job view) and D (parts request)** accessible to Technicians
- Large, thumb-friendly action buttons (full-width primary CTAs)
- Reduced UI chrome (more screen real estate for content)

**Typography:**
- Base font size: `16px` (`--font-size-base`)
- Slightly larger for readability on handheld device

**Touch Targets:**
- Minimum: `48px × 48px` (WCAG 2.5.5 Level AAA enhanced)
- Recommended: `56px × 56px` for primary actions
- Adequate spacing between tappable elements (8px minimum)

**Navigation:**
- Bottom tab bar: Jobs | Parts Request
- Minimal top bar: shop name, notifications, user menu
- Swipe gestures for common actions (swipe job card to mark complete)

**Offline Tolerance:**
- Job status updates **queue locally when offline**, sync when connection restored
- Local cache of assigned jobs and frequently used parts
- Visual indicator when offline

**Performance:**
- Initial load: < 3 seconds on 3G
- Job status update: < 1 second (optimistic UI)

**Rugged Use Cases:**
- Components tolerate grease-stained screens (larger targets, no fine gestures)
- High-contrast mode for outdoor/bright shop lighting
- Audio feedback for successful actions (optional, configurable)

### 4.3 Mobile (Customer Portal Profile)

**Viewport:** 320px–767px width  
**Input:** Touch-first (thumbs), portrait orientation default  
**Primary Users:** Customers (optional portal, scope `PENDING(Q-04)`)

**Layout Characteristics:**
- Single-column layout throughout
- Bottom navigation for primary tabs
- Card-based lists (appointments, service history)
- Full-screen modals and forms

**Typography:**
- Base font size: `16px` (`--font-size-base`)
- Prevents iOS zoom on focus

**Touch Targets:**
- Minimum: `48px × 48px` (WCAG 2.5.5 Level AAA)
- Thumb zone optimization (bottom third of screen for primary actions)

**Navigation:**
- Bottom tab bar: Book | History | Profile
- Hamburger menu for secondary options (settings, help, logout)
- Back button in header for drill-down screens

**Scope (Pending Confirmation):**
- Book appointments
- View service history and job status
- Approve estimates (digital signature)
- View and pay invoices
- Opt-in/out of reminders
- Provide feedback/ratings

**Performance:**
- First Contentful Paint: < 2 seconds on 3G
- Interactive: < 3 seconds

**Accessibility:**
- Safe area insets for notched devices
- Dark mode support (respects system preference)
- No horizontal scrolling

---

## 5. Design-Swap Test Procedure

The **design-swap test** is the core enforcement mechanism that proves AMS UI is decoupled from design tokens. It is executed at every Gate (0, 1, 2, 3, 4, 5, 6, 7).

### 5.1 Test Steps

1. **Open the application** in a Chromium-based browser (Chrome, Edge, Brave)
2. **Navigate** to a representative screen from the module under test (e.g., Module C service order detail)
3. **Open DevTools:** Press `F12` → select **Elements** tab → select the `:root` or `<html>` element
4. **Locate CSS custom properties** in the Styles pane (or Computed pane)
5. **Modify `--color-brand-primary-500`** by clicking the color swatch and changing to `#FF0000` (red)
   - **Expected:** All brand-colored elements (primary buttons, links, active nav items, focus rings) instantly turn red
   - **Fail if:** Any element does NOT change (indicates hardcoded color in component)
6. **Modify `--font-size-base`** from `1rem` to `1.125rem` (18px)
   - **Expected:** All body text scales proportionally; layout remains intact
   - **Fail if:** Text size doesn't change, or layout breaks
7. **Modify `--spacing-4`** from `1rem` to `1.5rem` (24px)
   - **Expected:** All padding/margin using `--spacing-4` increases; layout reflows smoothly
   - **Fail if:** Spacing doesn't change, or elements overlap
8. **Reset DevTools changes** (refresh page)
   - **Expected:** UI returns to original design
9. **Record result** in Gate checklist:
   - **Pass:** All token changes propagated instantly with zero component code changes
   - **Fail:** Identify components with hardcoded values, log as Gate blocker

### 5.2 Automated Enforcement

In addition to manual testing:

**ESLint / Stylelint Rule: `no-raw-design-values`**

Prohibits raw hex colors, pixel values, or font names in component files:

```javascript
// ❌ FAIL - hardcoded values
const Button = styled.button`
  background: #3b82f6;
  font-size: 14px;
  padding: 8px 16px;
`;

// ✅ PASS - token-based
const Button = styled.button`
  background: var(--button-primary-bg);
  font-size: var(--font-size-sm);
  padding: var(--spacing-2) var(--spacing-4);
`;
```

**Allowed Exceptions (must be documented in component README):**
- `0` for no spacing/border
- `transparent` for transparent backgrounds
- Structural values: `display`, `position`, `flex`, `grid` properties

### 5.3 Tester Responsibilities

At each Gate, the **Design QA tester** (role assigned per module):
1. Runs the design-swap test on all new screens introduced in the phase
2. Documents pass/fail per screen in `docs/modules/<X>/TESTS.md`
3. Signs off in the Gate checklist (`Design-swap test: PASS — [Tester Name], [Date]`)
4. Blocks Gate approval if any failures detected until fixed

---

## 6. Accessibility Baseline

AMS targets **WCAG 2.1 Level AA compliance** as the minimum accessibility standard. Every module must meet this baseline at Gate review.

### 6.1 Color Contrast

**Requirement:** 4.5:1 for normal text, 3:1 for large text (18pt+) and UI components

**Enforcement:**
- All semantic token color pairs are pre-validated for contrast (e.g., `--text-primary` on `--surface-card`)
- Automated check: Run `axe-core` or Lighthouse accessibility audit in CI on every PR
- Manual spot-check: Use browser DevTools color picker contrast indicator

**Exception:** Disabled states and purely decorative elements (no information loss)

### 6.2 Keyboard Navigation

**Requirements:**
- All interactive elements reachable by `Tab` key (no keyboard traps)
- Logical focus order (top-to-bottom, left-to-right, or semantic order)
- Visible focus ring (`:focus-visible` using `--state-focus-ring`)
- `Enter` or `Space` activates buttons, checkboxes, toggles
- `Esc` closes modals, dropdowns, drawers
- Arrow keys navigate within components (tabs, menus, date pickers)

**Testing:**
- Keyboard-only walkthrough per module at **Gate M2** (manual test)
- Automated check: `axe-core` tests for focusability and tab order

### 6.3 Screen Reader Support

**Requirements:**
- Semantic HTML elements (`<button>`, `<nav>`, `<main>`, `<form>`, `<label>`, `<table>`, etc.)
- ARIA labels where native semantics insufficient (icon-only buttons, complex widgets)
- ARIA live regions for dynamic updates (toasts, real-time status changes)
- No empty links or buttons
- Alt text required for all images; decorative images use empty `alt=""`

**Testing:**
- Automated: `axe-core` scans for missing labels, empty buttons, improper ARIA
- Manual: Test critical flows with NVDA (Windows) or VoiceOver (macOS) at Gate M2

### 6.4 Form Accessibility

**Requirements:**
- Every input has an associated `<label>` (explicit `for` or implicit wrapping)
- Error messages linked via `aria-describedby`
- Required fields marked with `required` attribute and `aria-required="true"`
- Fieldsets and legends for grouped inputs (radio, checkbox groups)
- Clear, actionable error messages (not just "Invalid input")

**Testing:**
- Automated: `axe-core` form audit
- Manual: Submit forms with errors, verify screen reader announces error

### 6.5 Images and Media

**Requirements:**
- All images have `alt` text describing content (or empty `alt=""` if decorative)
- Icons paired with text labels or `aria-label`
- Video/audio: captions or transcripts (if AMS adds media in future)

### 6.6 Motion and Animation

**Requirement:** Respect `prefers-reduced-motion` media query

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Users who set reduced motion preference see instant state changes instead of animated transitions.

### 6.7 Touch Targets

**Requirement:** 44×44px minimum (WCAG 2.5.5 Level AA), 48×48px for tablet/mobile

**Enforcement:**
- Defined in device profiles (§4)
- Design review checks button/link sizes per profile

### 6.8 Language Attribute

**Requirement:** `<html lang="en">` (or user's selected language if i18n implemented)

### 6.9 Focus Trap in Modals

**Requirement:** When a modal is open, `Tab` cycles only through modal content; `Esc` closes modal

**Implementation:** Use `focus-trap` library or equivalent in ModalDialog component (DSN-08)

### 6.10 Automated Accessibility Testing

**CI Pipeline Integration:**
- Run `axe-core` via Playwright or Cypress on every screen in every PR
- Report violations as test failures
- Baseline exceptions (if any) documented in `docs/design/ACCESSIBILITY-EXCEPTIONS.md`

**Manual Testing Checkpoints:**
- **Gate M2:** Keyboard-only walkthrough per module (documented in `TESTS.md`)
- **Phase 7:** Full manual audit with screen reader and assistive technologies

### 6.11 Known Limitations

**Acknowledged Constraints:**
- Full WCAG validation requires manual testing with assistive technologies (screen readers, magnifiers, voice input) and expert review
- Automated tools detect ~30-50% of accessibility issues; manual testing is essential
- Third-party components (charts, calendars) may introduce accessibility gaps; vetted during selection

**Remediation Plan:**
- Phase 7 includes professional accessibility audit
- Findings tracked in `docs/SECURITY-FINDINGS.md` (accessibility section)
- High-severity issues fixed before production deployment

---

## 7. Internationalization (i18n) and Text

### 7.1 Text Keys

**Requirement:** All visible text uses i18n keys—never hardcoded strings in components

**Example:**
```javascript
// ❌ FAIL
<button>Save</button>

// ✅ PASS
<button>{t('common.save')}</button>
```

**Key Structure:**
- `common.*` — Shared across modules (save, cancel, delete, loading, error, etc.)
- `module.<X>.*` — Module-specific (e.g., `module.C.serviceOrder.title`)
- `status.*` — All business status labels
- `errors.*` — Validation and error messages
- `notifications.*` — Toast and alert messages

**Implementation:**
- i18n library: `react-i18next`, `vue-i18n`, or framework equivalent
- Translation files: `src/locales/en/common.json`, `src/locales/en/module-C.json`, etc.
- Default language: **English** (`en`)
- Future languages: Filipino (Tagalog) `PENDING(Q-02)`

### 7.2 Currency Formatting

**Philippine Peso (₱):**
- Symbol: `₱` (Unicode U+20B1)
- Storage: **Integer centavos** (100 centavos = 1 peso) or `DECIMAL(19,2)`
- Formatting: `₱1,234.56` (comma thousands separator, period decimal)
- No floating-point arithmetic—use platform money utility

**Example:**
```javascript
// Storage (in centavos)
const amountCentavos = 123456; // ₱1,234.56

// Display
formatCurrency(amountCentavos); // "₱1,234.56"
```

### 7.3 Date and Time Formatting

**Storage:** UTC timestamps in database  
**Display:** Asia/Manila timezone (UTC+8, no DST)

**Format Examples:**
- Short date: `2026-01-15` (ISO 8601)
- Long date: `January 15, 2026`
- Time: `2:30 PM` (12-hour) or `14:30` (24-hour, configurable in settings)
- DateTime: `Jan 15, 2026 2:30 PM`

**Implementation:** Use platform date utility (e.g., `date-fns`, `dayjs` with timezone plugin)

### 7.4 Number Formatting

**Philippine Locale:**
- Thousands separator: `,` (comma)
- Decimal separator: `.` (period)
- Example: `1,234,567.89`

### 7.5 RTL Readiness

**Current Requirement:** Not required (English and Filipino are LTR)

**Design Consideration:** Token structure should not assume left-to-right (use logical properties like `margin-inline-start` instead of `margin-left` if framework supports)

---

## 8. Printable Document Templates

AMS generates multiple printable documents using **token-driven CSS** for consistent styling. Each template is configurable via Module K settings.

### 8.1 Document List

| Document | Module | Purpose | Key Fields |
|----------|--------|---------|-----------|
| **Job Card / Service Order** | C | Technician worksheet | Vehicle, services, parts, labor, time tracking |
| **Estimate / Quotation** | C | Customer approval | Line items, subtotal, tax, total, validity period |
| **Invoice / Official Receipt** | E | Payment record | Invoice number, items, payments, balance, tax breakdown |
| **Delivery Receipt** | D | Parts handover | Items delivered, quantities, receiver signature |
| **Payslip** | F | Employee pay record | Gross, deductions, net, YTD totals |
| **Purchase Order** | D | Supplier order | PO number, items, quantities, prices, delivery terms |

### 8.2 Template Structure

All templates share a common structure:

**Header:**
- Company logo (uploaded in Module K settings)
- Company name, address, contact (from settings)
- Document type and number
- Date and time

**Body:**
- Document-specific content (line items, details, signatures)

**Footer:**
- Terms and conditions (configurable in settings)
- Authorized signatory (name, title)
- Page numbers (if multi-page)

### 8.3 Token-Driven Styling

Templates use the same design tokens as the web UI:

```css
@media print {
  body {
    font-family: var(--font-family-sans);
    font-size: var(--font-size-sm);
    color: var(--text-primary);
  }

  .document-header {
    border-bottom: 2px solid var(--border-strong);
    padding-bottom: var(--spacing-4);
    margin-bottom: var(--spacing-6);
  }

  .line-item-table {
    border: 1px solid var(--border-default);
  }
}
```

**Benefit:** Changing tokens updates both screen and print styles consistently.

### 8.4 Configurability

**Module K Settings (per document type):**
- Header logo (upload)
- Company info (name, address, TIN, phone, email)
- Footer text (terms, disclaimers)
- Signature fields (names, titles)
- Paper size (A4, Letter, Thermal 80mm for receipts)
- Number format (with/without decimals for quantities)

### 8.5 Print Workflow

1. User clicks "Print" button on screen (e.g., Invoice detail page)
2. System generates HTML using template + data
3. Browser print dialog opens (`window.print()` or PDF generation)
4. User prints to printer or saves as PDF

**Technical Notes:**
- CSS `@media print` rules hide UI chrome (sidebar, buttons)
- Page breaks controlled via `page-break-before`, `page-break-after`
- Thermal receipt printer uses 80mm width, plain text fallback if no HTML support

---

## 9. Implementation Notes

### 9.1 Token Implementation

**CSS Custom Properties (Recommended):**

```css
/* src/ui-kit/tokens/tokens.css */
:root {
  --color-brand-primary-500: #3b82f6;
  --font-size-base: 1rem;
  --spacing-4: 1rem;
  /* ... all tokens ... */
}
```

Import in root stylesheet:
```css
/* src/index.css */
@import './ui-kit/tokens/tokens.css';
```

**JavaScript Token Access (if needed):**
```javascript
// Read token value from DOM
const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-brand-primary-500');

// Update token dynamically (e.g., theme switcher)
document.documentElement.style.setProperty('--color-brand-primary-500', '#FF0000');
```

### 9.2 Component Library Structure

**Directory Layout:**
```
src/ui-kit/
├── tokens/
│   ├── tokens.css               # All design tokens
│   └── README.md                # Token documentation
├── components/
│   ├── Button/
│   │   ├── Button.tsx           # Component implementation
│   │   ├── Button.module.css    # Token-based styles
│   │   ├── Button.stories.tsx   # Storybook stories
│   │   ├── Button.test.tsx      # Unit tests
│   │   └── README.md            # Component docs
│   ├── TextInput/
│   │   └── ...
│   └── ...
├── index.ts                     # Export all components
└── README.md                    # UI Kit overview
```

### 9.3 Component Gallery

**Tool:** Storybook (or Ladle, Histoire, or framework-specific equivalent)

**Purpose:**
- Visual catalog of all 67 components
- Interactive prop controls for designers and developers
- Living documentation
- Visual regression testing baseline

**Deployment:** Hosted internally (e.g., `http://ams-storybook.local`) for team review

### 9.4 Lint Rule Configuration

**ESLint Rule: `no-raw-design-values`**

Custom rule or plugin to detect hardcoded colors, sizes, fonts:

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/#[0-9a-fA-F]{3,6}/]',
        message: 'Use design tokens instead of hardcoded hex colors (var(--token-name))',
      },
      {
        selector: 'Literal[value=/\\d+px/]',
        message: 'Use design tokens instead of hardcoded pixel values (var(--spacing-*))',
      },
    ],
  },
};
```

**Stylelint Rule (for CSS/SCSS):**
```javascript
// .stylelintrc.js
module.exports = {
  rules: {
    'color-no-hex': true,  // Disallow hex colors
    'declaration-property-value-disallowed-list': {
      '/^(padding|margin|gap|font-size)/': ['/px$/'],  // Disallow px for spacing/font
    },
  },
};
```

### 9.5 Token Change Process

**Design Pass (Phase 0 Part 4):**
1. Designer provides final brand colors, typography, spacing in design tool (Figma, etc.)
2. Developer updates `tokens.css` with new values (one-line changes per token)
3. Run design-swap test to verify propagation
4. Commit: `design: apply final brand tokens`
5. Deploy and review

**Single-Token Update:**
- Change: 1 line in `tokens.css`
- Impact: All components using that token update instantly
- No component code changes required (the design-swap guarantee)

---

## 10. Phase Deliverables

Design System deliverables per phase:

| Phase | Design Deliverable | Gate Requirement | Status |
|-------|-------------------|------------------|--------|
| **Phase 0 — Discovery** | This Design System Plan | Gate 0: Plan approved | Draft |
| | Screen Inventory (list of all screens per module) | Gate 0: Inventory complete | Pending |
| | Wireframes for top 4 screens (Home, Service Order Detail, Customer Profile, Invoice) | Gate 0: Wireframes approved | Pending |
| **Phase 1 — Foundation** | Token files (`tokens.css`) with all primitive, semantic, component tokens | Gate 1: Tokens implemented | Pending |
| | Full UI Kit (67 components) implemented and tested | Gate 1: All DSN-nn items complete | Pending |
| | Component gallery (Storybook) live and accessible | Gate 1: Gallery deployed | Pending |
| | Design-swap test passes on sample screens | Gate 1: Test passed, documented | Pending |
| | Lint rule `no-raw-design-values` active in CI | Gate 1: No violations in codebase | Pending |
| **Phase 2–6 — Module Development** | Module screens built using **only UI Kit components and tokens** | Each Gate: No raw values in module code | Ongoing |
| | Design-swap test passed at each Gate | Gates 2-6: Test passed, tester signed off | Ongoing |
| | Device profile testing (desktop, tablet, mobile per module users) | Each Gate: Tested on target profile | Ongoing |
| | Accessibility baseline verified (keyboard, contrast, ARIA) | Each Gate: axe-core clean, manual checks passed | Ongoing |
| **Phase 0 Part 4 — Design Pass** (after Phase 6) | Final visual design applied by updating tokens only | Design Pass Gate: Zero logic changes | Future |
| | Component variant styles refined (shadows, borders, hover states) | Design Pass Gate: Variants updated | Future |
| | Design-swap test passes across all modules | Design Pass Gate: Full regression test passed | Future |
| **Phase 7 — Finalization** | Design-swap test final pass (entire app) | Gate 7: All modules pass | Future |
| | Accessibility audit with assistive technologies | Gate 7: WCAG AA verified, issues tracked | Future |
| | Print templates tested on actual printers | Gate 7: All documents print correctly | Future |

---

## Appendix A: Token Naming Conventions

**Primitive Tokens:**
- `--color-{family}-{shade}` (e.g., `--color-gray-500`, `--color-brand-primary-600`)
- `--font-size-{scale}` (xs, sm, base, lg, xl, 2xl, 3xl, 4xl)
- `--spacing-{scale}` (0, 0-5, 1, 1-5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24)
- `--radius-{scale}` (none, sm, md, lg, xl, full)
- `--shadow-{scale}` (none, sm, md, lg, xl)
- `--z-{layer}` (base, dropdown, sticky, fixed, modal, popover, tooltip, toast)
- `--duration-{speed}` (fast, base, slow)

**Semantic Tokens:**
- `--surface-{context}` (page-bg, card, sidebar, modal-overlay, input, disabled)
- `--text-{role}` (primary, secondary, muted, inverse, disabled, link, link-hover)
- `--border-{role}` (default, strong, focus, error)
- `--status-{type}-{property}` (success-bg, warning-text, danger-border, info-bg, pending-text)

**Component Tokens:**
- `--{component}-{variant}-{property}-{state}` (e.g., `--button-primary-bg-hover`, `--input-error-border`)

---

## Appendix B: Design-Swap Test Checklist Template

**Module:** ___________  
**Phase:** ___________  
**Tester:** ___________  
**Date:** ___________

| Test | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| Brand color | Change `--color-brand-primary-500` to red | All brand elements turn red instantly | ☐ Pass ☐ Fail | |
| Font size | Change `--font-size-base` to 18px | All body text scales proportionally | ☐ Pass ☐ Fail | |
| Spacing | Change `--spacing-4` to 24px | All padding/margin using token increases | ☐ Pass ☐ Fail | |
| Reset | Refresh page | UI returns to original design | ☐ Pass ☐ Fail | |

**Overall Result:** ☐ PASS (all tests passed) ☐ FAIL (at least one test failed)

**Blocker Issues (if failed):**
- Component: ___________  
  Issue: ___________  
  Action: ___________

**Sign-Off:**  
Tester Signature: ___________  
Date: ___________

---

## Appendix C: Component Checklist Template

For each UI Kit component (DSN-nn):

- ☐ **Implemented** with all required props
- ☐ **Token-based styling** (no raw values)
- ☐ **Storybook story** created with all variants and states
- ☐ **Unit tests** written (props, events, edge cases)
- ☐ **Accessibility checks** passed (axe-core, keyboard nav, ARIA)
- ☐ **Device profiles tested** (desktop, tablet, mobile as applicable)
- ☐ **Documentation** in README (props, usage examples)
- ☐ **Design-swap test** passed (token changes propagate)
- ☐ **Code reviewed** and approved
- ☐ **Merged** to main branch

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-XX | [Author Name] | Initial draft for Gate 0 |

---

**End of Design System Plan**
