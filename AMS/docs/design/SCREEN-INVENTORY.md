# Screen Inventory v1.0

**Project:** Autoshop Management System (AMS)  
**Document:** Master Screen Inventory  
**Status:** Draft  
**Last Updated:** 2026-11-10

---

## 1. Purpose

This inventory is the master list of every screen the system must render. It is used to track wireframe and design progress, assign design work, and ensure nothing is missed during development. Every screen listed here represents a distinct user interface that must be designed, built, tested, and delivered.

This document serves as:
- The single source of truth for what screens exist in the system
- A tracking tool for wireframe and design completion status
- A reference for developers implementing the UI
- A checklist for QA to ensure complete coverage

---

## 2. ID Convention

Each screen is assigned a unique identifier using the format: `<Module Letter>-S<nn>`

- **Module Letter**: A single letter from A to K corresponding to the 11 business modules
- **S**: Denotes "Screen"
- **nn**: Zero-padded two-digit sequence number within the module (01, 02, 03, etc.)

**Examples:**
- `A-S01` = First screen in Module A (Customer and Vehicle Management)
- `B-S03` = Third screen in Module B (Appointment and Service Scheduling)
- `C-S12` = Twelfth screen in Module C (Service Order and Job Management)

This convention provides a stable reference across documents, conversations, and code.

---

## 3. Column Definitions

Each screen entry includes the following attributes:

| Column | Description |
|--------|-------------|
| **ID** | Unique screen identifier (e.g., A-S01) |
| **Module** | Module letter and full module name |
| **Screen Name** | Short, descriptive name for the screen |
| **Primary Roles** | Which user roles primarily use this screen. Abbreviations: Owner, Advisor, Cashier, Tech, Parts, HR, Acct, Admin, Supervisor, Customer |
| **Device Profile** | Which device profile(s) this screen is designed for: Desktop / Tablet / Mobile / All |
| **Required States** | Comma-separated list of UI states the screen must handle (Empty, Loading, Populated, Error, Read-Only, Editing, Submitting, Success, Confirmation) |
| **Route** | Suggested URL route path (e.g., `/customers`, `/jobs/:id/estimate`) |
| **Wireframe Status** | Current wireframe progress: Not Started / In Progress / Done |
| **Design Status** | Current visual design progress: Not Started / In Progress / Done |

---

## 4. Screen Table — Module A: Customer and Vehicle Management

| ID | Module | Screen Name | Primary Roles | Device Profile | Required States | Route | Wireframe Status | Design Status |
|----|--------|-------------|---------------|----------------|-----------------|-------|------------------|---------------|
| A-S01 | A: Customer and Vehicle Management | Customer List | All roles with access | Desktop | Empty, Loading, Populated | `/customers` | Not Started | Not Started |
| A-S02 | A: Customer and Vehicle Management | Customer Profile | Advisor, Owner, Admin, Cashier | Desktop | Populated, Editing, Read-Only | `/customers/:id` | Not Started | Not Started |
| A-S03 | A: Customer and Vehicle Management | New/Edit Customer Form | Advisor, Admin | Desktop | Editing, Submitting, Error | `/customers/new`, `/customers/:id/edit` | Not Started | Not Started |
| A-S04 | A: Customer and Vehicle Management | Vehicle Profile | Advisor, Owner, Tech, Admin | Desktop | Populated, Editing | `/vehicles/:id` | Not Started | Not Started |
| A-S05 | A: Customer and Vehicle Management | New/Edit Vehicle Form | Advisor, Admin | Desktop | Editing, Submitting | `/vehicles/new`, `/vehicles/:id/edit` | Not Started | Not Started |
| A-S06 | A: Customer and Vehicle Management | Vehicle Service Timeline | Advisor, Owner, Tech | Desktop | Empty, Populated | `/vehicles/:id/history` | Not Started | Not Started |
| A-S07 | A: Customer and Vehicle Management | Fleet Account View | Owner, Advisor, Acct | Desktop | Empty, Populated | `/fleet/:id` | Not Started | Not Started |
| A-S08 | A: Customer and Vehicle Management | Customer Merge Tool | Admin | Desktop | Populated, Confirmation | `/customers/merge` | Not Started | Not Started |

---

## 5. Screen Table — Module B: Appointment and Service Scheduling

| ID | Module | Screen Name | Primary Roles | Device Profile | Required States | Route | Wireframe Status | Design Status |
|----|--------|-------------|---------------|----------------|-----------------|-------|------------------|---------------|
| B-S01 | B: Appointment and Service Scheduling | Calendar View | Advisor, Supervisor, Owner | Desktop | Loading, Populated, Empty | `/schedule` | Not Started | Not Started |
| B-S02 | B: Appointment and Service Scheduling | Bay Board | Advisor, Supervisor, Tech | Desktop, Tablet | Populated | `/schedule/bays` | Not Started | Not Started |
| B-S03 | B: Appointment and Service Scheduling | Appointment Form | Advisor | Desktop | Editing, Submitting, Error | `/appointments/new`, `/appointments/:id/edit` | Not Started | Not Started |
| B-S04 | B: Appointment and Service Scheduling | Appointment Detail View | Advisor, Owner | Desktop | Populated, Read-Only | `/appointments/:id` | Not Started | Not Started |
| B-S05 | B: Appointment and Service Scheduling | Today's Arrivals List and Walk-In Queue | Advisor, Supervisor | Desktop | Loading, Populated, Empty | `/schedule/today` | Not Started | Not Started |
| B-S06 | B: Appointment and Service Scheduling | Available Slot Finder | Advisor | Desktop | Loading, Populated | `/schedule/slots` | Not Started | Not Started |
| B-S07 | B: Appointment and Service Scheduling | No-Show and Cancellation Log | Advisor, Owner | Desktop | Empty, Populated | `/appointments/no-shows` | Not Started | Not Started |

---

## 6. Screen Table — Module C: Service Order and Job Management

| ID | Module | Screen Name | Primary Roles | Device Profile | Required States | Route | Wireframe Status | Design Status |
|----|--------|-------------|---------------|----------------|-----------------|-------|------------------|---------------|
| C-S01 | C: Service Order and Job Management | Job Board / Kanban | Advisor, Supervisor, Owner | Desktop, Tablet | Loading, Populated, Empty | `/jobs` | Not Started | Not Started |
| C-S02 | C: Service Order and Job Management | Service Order Detail | Advisor, Supervisor, Owner, Cashier | Desktop | Populated, Editing, Read-Only | `/jobs/:id` | Not Started | Not Started |
| C-S03 | C: Service Order and Job Management | New Service Order Form | Advisor | Desktop | Editing, Submitting | `/jobs/new` | Not Started | Not Started |
| C-S04 | C: Service Order and Job Management | Vehicle Check-In Inspection | Advisor, Tech | Desktop, Tablet | Editing, Submitting | `/jobs/:id/inspection` | Not Started | Not Started |
| C-S05 | C: Service Order and Job Management | Diagnosis and Findings Screen | Tech, Advisor | Tablet, Desktop | Editing, Submitting | `/jobs/:id/diagnosis` | Not Started | Not Started |
| C-S06 | C: Service Order and Job Management | Estimate Builder | Advisor | Desktop | Editing, Submitting, Read-Only | `/jobs/:id/estimate` | Not Started | Not Started |
| C-S07 | C: Service Order and Job Management | Customer Estimate Approval Screen | Customer, Advisor | Mobile, Desktop | Populated, Submitting | `/estimates/:token/approve` | Not Started | Not Started |
| C-S08 | C: Service Order and Job Management | Parts Requisition Screen | Tech, Advisor | Tablet, Desktop | Editing, Submitting | `/jobs/:id/parts` | Not Started | Not Started |
| C-S09 | C: Service Order and Job Management | Technician Job View | Tech | Tablet | Populated, Editing | `/technician/jobs` | Not Started | Not Started |
| C-S10 | C: Service Order and Job Management | Technician Job Detail | Tech | Tablet | Populated, Editing | `/technician/jobs/:id` | Not Started | Not Started |
| C-S11 | C: Service Order and Job Management | Additional Work Approval Screen | Advisor, Customer | Desktop, Mobile | Populated, Submitting | `/jobs/:id/additional-work` | Not Started | Not Started |
| C-S12 | C: Service Order and Job Management | QC Checklist Screen | Supervisor | Desktop, Tablet | Editing, Submitting | `/jobs/:id/qc` | Not Started | Not Started |
| C-S13 | C: Service Order and Job Management | Release Screen | Advisor, Supervisor | Desktop | Populated, Submitting | `/jobs/:id/release` | Not Started | Not Started |
| C-S14 | C: Service Order and Job Management | Promised-Time Tracker and Delay Log | Advisor, Supervisor | Desktop | Populated | `/jobs/:id/timeline` | Not Started | Not Started |
| C-S15 | C: Service Order and Job Management | Comeback / Warranty Claim Screen | Advisor, Supervisor | Desktop | Editing, Submitting | `/jobs/:id/warranty` | Not Started | Not Started |

---

## 7. Screen Table — Module D: Inventory and Stock Management

| ID | Module | Screen Name | Primary Roles | Device Profile | Required States | Route | Wireframe Status | Design Status |
|----|--------|-------------|---------------|----------------|-----------------|-------|------------------|---------------|
| D-S01 | D: Inventory and Stock Management | Item List | Parts, Owner, Advisor | Desktop | Loading, Populated, Empty | `/inventory` | Not Started | Not Started |
| D-S02 | D: Inventory and Stock Management | Item Detail | Parts, Owner | Desktop | Populated, Editing | `/inventory/:id` | Not Started | Not Started |
| D-S03 | D: Inventory and Stock Management | New/Edit Item Form | Parts, Admin | Desktop | Editing, Submitting | `/inventory/new`, `/inventory/:id/edit` | Not Started | Not Started |
| D-S04 | D: Inventory and Stock Management | Low-Stock / Out-of-Stock Dashboard | Parts, Owner | Desktop | Loading, Populated, Empty | `/inventory/alerts` | Not Started | Not Started |
| D-S05 | D: Inventory and Stock Management | Purchase Order Screen | Parts, Owner | Desktop | Editing, Populated, Read-Only | `/purchasing/:id` | Not Started | Not Started |
| D-S06 | D: Inventory and Stock Management | Goods Receiving Screen | Parts | Desktop | Editing, Submitting | `/purchasing/:id/receive` | Not Started | Not Started |
| D-S07 | D: Inventory and Stock Management | Issue-to-Job Screen | Parts, Tech | Desktop, Tablet | Editing, Submitting | `/inventory/issue` | Not Started | Not Started |
| D-S08 | D: Inventory and Stock Management | Stock Count Worksheet | Parts | Desktop | Editing, Submitting | `/inventory/stock-count` | Not Started | Not Started |
| D-S09 | D: Inventory and Stock Management | Parts-Pending-Arrival List | Parts, Advisor, Supervisor | Desktop | Loading, Populated | `/inventory/pending` | Not Started | Not Started |
| D-S10 | D: Inventory and Stock Management | Supplier Directory and Performance View | Parts, Owner | Desktop | Populated, Editing | `/suppliers` | Not Started | Not Started |
| D-S11 | D: Inventory and Stock Management | Stock Adjustment Screen | Parts, Admin | Desktop | Editing, Submitting | `/inventory/adjust` | Not Started | Not Started |

---

## 8. Screen Table — Module E: POS and Billing Management

| ID | Module | Screen Name | Primary Roles | Device Profile | Required States | Route | Wireframe Status | Design Status |
|----|--------|-------------|---------------|----------------|-----------------|-------|------------------|---------------|
| E-S01 | E: POS and Billing Management | POS Screen | Cashier | Desktop | Editing, Submitting | `/pos` | Not Started | Not Started |
| E-S02 | E: POS and Billing Management | Invoice Preview / Print | Cashier, Advisor, Owner | Desktop | Populated, Read-Only | `/invoices/:id` | Not Started | Not Started |
| E-S03 | E: POS and Billing Management | Open Invoices and Unpaid Balances List | Cashier, Owner, Acct | Desktop | Loading, Populated, Empty | `/invoices` | Not Started | Not Started |
| E-S04 | E: POS and Billing Management | Cashier Shift Screen | Cashier | Desktop | Editing, Populated | `/pos/shift` | Not Started | Not Started |
| E-S05 | E: POS and Billing Management | Void / Refund Approval Queue | Cashier, Owner, Admin | Desktop | Populated, Submitting, Confirmation | `/pos/voids` | Not Started | Not Started |
| E-S06 | E: POS and Billing Management | Customer Statement and Aging View | Cashier, Acct, Owner | Desktop | Populated, Read-Only | `/customers/:id/statement` | Not Started | Not Started |
| E-S07 | E: POS and Billing Management | Daily Sales Dashboard | Cashier, Owner, Acct | Desktop | Loading, Populated | `/reports/daily-sales` | Not Started | Not Started |
| E-S08 | E: POS and Billing Management | OTC Sale Screen | Cashier | Desktop | Editing, Submitting | `/pos/otc` | Not Started | Not Started |
| E-S09 | E: POS and Billing Management | Insurance Billing Screen | Cashier, Advisor | Desktop | Editing, Submitting | `/invoices/:id/insurance` | Not Started | Not Started |

---

## 9. Screen Table — Module F: Employee and Payroll Management

| ID | Module | Screen Name | Primary Roles | Device Profile | Required States | Route | Wireframe Status | Design Status |
|----|--------|-------------|---------------|----------------|-----------------|-------|------------------|---------------|
| F-S01 | F: Employee and Payroll Management | Employee Directory | HR, Owner, Admin | Desktop | Loading, Populated, Empty | `/employees` | Not Started | Not Started |
| F-S02 | F: Employee and Payroll Management | Employee Profile | HR, Owner, Admin, Employee | Desktop | Populated, Editing, Read-Only | `/employees/:id` | Not Started | Not Started |
| F-S03 | F: Employee and Payroll Management | New/Edit Employee Form | HR, Admin | Desktop | Editing, Submitting | `/employees/new`, `/employees/:id/edit` | Not Started | Not Started |
| F-S04 | F: Employee and Payroll Management | Daily Attendance Board | HR, Supervisor, Owner | Desktop | Loading, Populated | `/attendance` | Not Started | Not Started |
| F-S05 | F: Employee and Payroll Management | Timesheet and Overtime Approval Screen | HR, Supervisor | Desktop | Populated, Editing | `/attendance/timesheets` | Not Started | Not Started |
| F-S06 | F: Employee and Payroll Management | Payroll Period Screen | HR, Owner, Acct | Desktop | Loading, Populated, Editing | `/payroll/:periodId` | Not Started | Not Started |
| F-S07 | F: Employee and Payroll Management | Payslip Viewer | HR, Owner, Employee | Desktop | Populated, Read-Only | `/payroll/:periodId/payslips/:id` | Not Started | Not Started |
| F-S08 | F: Employee and Payroll Management | Commission and Incentive Computation View | HR, Owner | Desktop | Loading, Populated | `/payroll/commissions` | Not Started | Not Started |
| F-S09 | F: Employee and Payroll Management | Technician Efficiency Dashboard | Supervisor, Owner | Desktop | Loading, Populated | `/reports/technician-efficiency` | Not Started | Not Started |
| F-S10 | F: Employee and Payroll Management | Cash Advance and Loan Ledger | HR | Desktop | Populated, Editing | `/employees/:id/loans` | Not Started | Not Started |
| F-S11 | F: Employee and Payroll Management | Expiring Certifications and Contracts Alert List | HR, Owner | Desktop | Loading, Populated | `/employees/expiring` | Not Started | Not Started |

---

## 10. Screen Table — Module G: Financial and Expense Management

| ID | Module | Screen Name | Primary Roles | Device Profile | Required States | Route | Wireframe Status | Design Status |
|----|--------|-------------|---------------|----------------|-----------------|-------|------------------|---------------|
| G-S01 | G: Financial and Expense Management | Expense Entry Form | Acct, Owner | Desktop | Editing, Submitting | `/expenses/new` | Not Started | Not Started |
| G-S02 | G: Financial and Expense Management | Expense List and Approval Queue | Acct, Owner | Desktop | Loading, Populated | `/expenses` | Not Started | Not Started |
| G-S03 | G: Financial and Expense Management | Accounts Payable List | Acct, Owner | Desktop | Loading, Populated | `/payables` | Not Started | Not Started |
| G-S04 | G: Financial and Expense Management | Cash and Bank Position Summary | Acct, Owner, Cashier | Desktop | Loading, Populated | `/finance/cash` | Not Started | Not Started |
| G-S05 | G: Financial and Expense Management | Budget vs Actual View | Acct, Owner | Desktop | Loading, Populated | `/finance/budget` | Not Started | Not Started |
| G-S06 | G: Financial and Expense Management | Financial Statements | Acct, Owner | Desktop | Loading, Populated | `/finance/statements` | Not Started | Not Started |
| G-S07 | G: Financial and Expense Management | Bank Reconciliation Screen | Acct | Desktop | Editing, Populated | `/finance/reconciliation` | Not Started | Not Started |
| G-S08 | G: Financial and Expense Management | Fixed Asset List | Acct, Owner | Desktop | Populated, Editing | `/finance/assets` | Not Started | Not Started |
| G-S09 | G: Financial and Expense Management | Petty Cash Voucher and Replenishment Screen | Cashier, Acct | Desktop | Editing, Submitting | `/finance/petty-cash` | Not Started | Not Started |
| G-S10 | G: Financial and Expense Management | Journal Entry Viewer | Acct, Owner | Desktop | Loading, Populated, Read-Only | `/finance/journal` | Not Started | Not Started |

---

## 11. Screen Table — Module H: Preventive Maintenance and Reminders

| ID | Module | Screen Name | Primary Roles | Device Profile | Required States | Route | Wireframe Status | Design Status |
|----|--------|-------------|---------------|----------------|-----------------|-------|------------------|---------------|
| H-S01 | H: Preventive Maintenance and Reminders | Due-for-Service List | Advisor, Owner | Desktop | Loading, Populated, Empty | `/reminders/due` | Not Started | Not Started |
| H-S02 | H: Preventive Maintenance and Reminders | Overdue and Upcoming Reminder Calendar | Advisor, Owner | Desktop | Loading, Populated | `/reminders/calendar` | Not Started | Not Started |
| H-S03 | H: Preventive Maintenance and Reminders | Message Template Editor | Admin, Owner | Desktop | Editing, Populated | `/reminders/templates` | Not Started | Not Started |
| H-S04 | H: Preventive Maintenance and Reminders | Campaign Builder | Advisor, Owner | Desktop | Editing, Submitting | `/reminders/campaigns/new` | Not Started | Not Started |
| H-S05 | H: Preventive Maintenance and Reminders | Reminder Performance Dashboard | Advisor, Owner | Desktop | Loading, Populated | `/reminders/performance` | Not Started | Not Started |
| H-S06 | H: Preventive Maintenance and Reminders | Per-Vehicle Maintenance Plan View | Advisor, Tech | Desktop, Tablet | Populated | `/vehicles/:id/maintenance` | Not Started | Not Started |
| H-S07 | H: Preventive Maintenance and Reminders | Opt-Out and Bounce List | Admin | Desktop | Loading, Populated | `/reminders/opt-outs` | Not Started | Not Started |

---

## 12. Screen Table — Module I: Customer Follow-Up and After-Service

| ID | Module | Screen Name | Primary Roles | Device Profile | Required States | Route | Wireframe Status | Design Status |
|----|--------|-------------|---------------|----------------|-----------------|-------|------------------|---------------|
| I-S01 | I: Customer Follow-Up and After-Service | Follow-Up Task Queue | Advisor, Owner | Desktop | Loading, Populated, Empty | `/follow-up` | Not Started | Not Started |
| I-S02 | I: Customer Follow-Up and After-Service | Survey Results Dashboard | Advisor, Owner | Desktop | Loading, Populated | `/follow-up/surveys` | Not Started | Not Started |
| I-S03 | I: Customer Follow-Up and After-Service | Complaint Board | Advisor, Supervisor, Owner | Desktop | Loading, Populated | `/follow-up/complaints` | Not Started | Not Started |
| I-S04 | I: Customer Follow-Up and After-Service | Complaint Detail and Resolution Screen | Advisor, Supervisor | Desktop | Populated, Editing | `/follow-up/complaints/:id` | Not Started | Not Started |
| I-S05 | I: Customer Follow-Up and After-Service | Warranty Register | Advisor, Supervisor | Desktop | Loading, Populated | `/follow-up/warranty` | Not Started | Not Started |
| I-S06 | I: Customer Follow-Up and After-Service | Customer Communication Timeline | Advisor | Desktop | Loading, Populated | `/customers/:id/communications` | Not Started | Not Started |
| I-S07 | I: Customer Follow-Up and After-Service | Loyalty Balance and Reward Redemption Screen | Cashier, Advisor | Desktop | Populated, Editing | `/customers/:id/loyalty` | Not Started | Not Started |
| I-S08 | I: Customer Follow-Up and After-Service | Post-Service Survey | Customer | Mobile | Populated, Submitting | `/survey/:token` | Not Started | Not Started |

---

## 13. Screen Table — Module J: Dashboard, Analytics, and Reporting

| ID | Module | Screen Name | Primary Roles | Device Profile | Required States | Route | Wireframe Status | Design Status |
|----|--------|-------------|---------------|----------------|-----------------|-------|------------------|---------------|
| J-S01 | J: Dashboard, Analytics, and Reporting | Executive Dashboard | Owner | Desktop | Loading, Populated | `/dashboard/executive` | Not Started | Not Started |
| J-S02 | J: Dashboard, Analytics, and Reporting | Operations Dashboard | Owner, Supervisor, Advisor | Desktop | Loading, Populated | `/dashboard/operations` | Not Started | Not Started |
| J-S03 | J: Dashboard, Analytics, and Reporting | Sales and Customer Dashboard | Owner, Advisor | Desktop | Loading, Populated | `/dashboard/sales` | Not Started | Not Started |
| J-S04 | J: Dashboard, Analytics, and Reporting | Inventory Dashboard | Owner, Parts | Desktop | Loading, Populated | `/dashboard/inventory` | Not Started | Not Started |
| J-S05 | J: Dashboard, Analytics, and Reporting | Finance Dashboard | Owner, Acct | Desktop | Loading, Populated | `/dashboard/finance` | Not Started | Not Started |
| J-S06 | J: Dashboard, Analytics, and Reporting | HR Dashboard | Owner, HR | Desktop | Loading, Populated | `/dashboard/hr` | Not Started | Not Started |
| J-S07 | J: Dashboard, Analytics, and Reporting | Standard Report List | All (role-based) | Desktop | Loading, Populated | `/reports` | Not Started | Not Started |
| J-S08 | J: Dashboard, Analytics, and Reporting | Report Viewer | All (role-based) | Desktop | Populated, Loading | `/reports/:id` | Not Started | Not Started |
| J-S09 | J: Dashboard, Analytics, and Reporting | Scheduled Report Configuration | Owner, Admin | Desktop | Editing, Populated | `/reports/scheduled` | Not Started | Not Started |
| J-S10 | J: Dashboard, Analytics, and Reporting | Custom Report Builder | Owner, Acct | Desktop | Editing, Loading, Populated | `/reports/builder` | Not Started | Not Started |

---

## 14. Screen Table — Module K: User Management and System Administration

| ID | Module | Screen Name | Primary Roles | Device Profile | Required States | Route | Wireframe Status | Design Status |
|----|--------|-------------|---------------|----------------|-----------------|-------|------------------|---------------|
| K-S01 | K: User Management and System Administration | User List and Management | Admin | Desktop | Loading, Populated | `/admin/users` | Not Started | Not Started |
| K-S02 | K: User Management and System Administration | User Profile / Edit Form | Admin | Desktop | Populated, Editing | `/admin/users/:id` | Not Started | Not Started |
| K-S03 | K: User Management and System Administration | Role and Permission Matrix Editor | Admin | Desktop | Editing, Populated | `/admin/roles` | Not Started | Not Started |
| K-S04 | K: User Management and System Administration | Audit Log Viewer | Admin, Owner | Desktop | Loading, Populated | `/admin/audit` | Not Started | Not Started |
| K-S05 | K: User Management and System Administration | Company and Branch Settings | Admin | Desktop | Editing, Populated | `/admin/settings` | Not Started | Not Started |
| K-S06 | K: User Management and System Administration | Integration Settings | Admin | Desktop | Editing, Populated | `/admin/integrations` | Not Started | Not Started |
| K-S07 | K: User Management and System Administration | Approval Rules Configuration | Admin, Owner | Desktop | Editing, Populated | `/admin/approvals` | Not Started | Not Started |
| K-S08 | K: User Management and System Administration | Backup Status and Restore Points | Admin | Desktop | Loading, Populated | `/admin/backups` | Not Started | Not Started |
| K-S09 | K: User Management and System Administration | Login History and Active Sessions | Admin, Owner | Desktop | Loading, Populated | `/admin/sessions` | Not Started | Not Started |
| K-S10 | K: User Management and System Administration | System Health Monitor and Error Log | Admin | Desktop | Loading, Populated | `/admin/health` | Not Started | Not Started |
| K-S11 | K: User Management and System Administration | Master Data Configuration | Admin | Desktop | Editing, Populated | `/admin/master-data` | Not Started | Not Started |
| K-S12 | K: User Management and System Administration | Notification Template Manager | Admin | Desktop | Editing, Populated | `/admin/notification-templates` | Not Started | Not Started |

---

## 15. Summary Statistics

| Module | Screen Count | Desktop | Tablet | Mobile | All |
|--------|-------------|---------|--------|--------|-----|
| A: Customer and Vehicle Management | 8 | 8 | 0 | 0 | 0 |
| B: Appointment and Service Scheduling | 7 | 6 | 1 | 0 | 0 |
| C: Service Order and Job Management | 15 | 10 | 3 | 2 | 0 |
| D: Inventory and Stock Management | 11 | 9 | 2 | 0 | 0 |
| E: POS and Billing Management | 9 | 9 | 0 | 0 | 0 |
| F: Employee and Payroll Management | 11 | 11 | 0 | 0 | 0 |
| G: Financial and Expense Management | 10 | 10 | 0 | 0 | 0 |
| H: Preventive Maintenance and Reminders | 7 | 6 | 1 | 0 | 0 |
| I: Customer Follow-Up and After-Service | 8 | 7 | 0 | 1 | 0 |
| J: Dashboard, Analytics, and Reporting | 10 | 10 | 0 | 0 | 0 |
| K: User Management and System Administration | 12 | 12 | 0 | 0 | 0 |
| **TOTAL** | **108** | **98** | **7** | **3** | **0** |

**Device Profile Summary:**
- **Desktop-only screens:** 98
- **Desktop + Tablet screens:** 7
- **Desktop + Mobile screens:** 2
- **Tablet-only screens:** 0
- **Mobile-only screens:** 1
- **All devices:** 0

**Note:** Many screens designed for Desktop may be made responsive for tablet/mobile viewing, but the Device Profile column indicates the primary intended use case and optimized design target.

---

## 16. Progress Tracking

### Status Definitions

**Wireframe Status:**
- **Not Started**: No wireframe has been created
- **In Progress**: Wireframe work has begun but is incomplete
- **Done**: Wireframe is complete, reviewed, and approved

**Design Status:**
- **Not Started**: No visual design has been created
- **In Progress**: Visual design work has begun but is incomplete
- **Done**: Visual design is complete, reviewed, and approved

### Tracking Notes

- All screens default to **Not Started** for both Wireframe Status and Design Status at document creation.
- This file should be updated in place as wireframe and design work progresses.
- Each screen's status should be updated when its state changes.
- This document is the **single source of truth** for design progress tracking.
- Design cannot begin until wireframes are approved (Wireframe Status = Done).
- Development should not begin on a screen until Design Status = Done.

### Update Procedure

When updating screen status:
1. Locate the screen by its ID in the appropriate module table
2. Update the Wireframe Status and/or Design Status column
3. Update the Last Updated date at the top of this document
4. Commit the change with a descriptive message (e.g., "Screen Inventory: Mark C-S01 wireframe as Done")

### Current Progress Summary

As of 2026-11-10:
- **Wireframes Completed:** 0 / 108 (0%)
- **Designs Completed:** 0 / 108 (0%)

This summary should be updated weekly or when significant milestones are reached.

---

## Document Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-11-10 | 1.0 | Initial screen inventory created with all 108 screens across 11 modules | System |

---

**End of Screen Inventory**
