# AMS Glossary

**Last Updated:** 2026-11-10

---

## Purpose

This glossary defines the canonical term for every business concept in AMS. Use these terms consistently in code (variables, functions, tables, APIs) and documentation. Synonyms are listed but should not be used in new code.

---

## Terms

### Service Order
**Canonical Term:** Service Order  
**Synonyms:** Job Card, Job Order, Work Order  
**Definition:** The record tracking a vehicle from check-in through diagnosis, repair, quality check, and release.  
**Used in:** Module C

### Estimate
**Canonical Term:** Estimate  
**Synonyms:** Quotation, Quote  
**Definition:** Proposed pricing for labor and parts presented to customer for approval before work begins.  
**Used in:** Module C

### Customer
**Canonical Term:** Customer  
**Synonyms:** Client  
**Definition:** Individual or company that owns vehicles serviced by the shop.  
**Used in:** Module A

### Vehicle
**Canonical Term:** Vehicle  
**Synonyms:** Unit, Car  
**Definition:** Car, truck, motorcycle, or other motorized asset serviced by the shop.  
**Used in:** Module A

### Technician
**Canonical Term:** Technician  
**Synonyms:** Mechanic  
**Definition:** Shop employee who performs repair and maintenance work.  
**Used in:** Modules C, F, J

### Advisor
**Canonical Term:** Advisor  
**Synonyms:** Service Advisor, Front Desk, Reception, Service Writer  
**Definition:** Shop employee who interfaces with customers, creates estimates, and coordinates service.  
**Used in:** Modules B, C, I, J

### Parts
**Canonical Term:** Parts (plural for inventory items); Part (singular)  
**Synonyms:** Spare Parts, Components, Items (when referring to inventory system)  
**Definition:** Replacement components, fluids, consumables, tires, and accessories sold or used in service.  
**Used in:** Modules C, D, E  
**Note:** "Item" is the database entity name; "Parts" is the business term.

### Invoice
**Canonical Term:** Invoice  
**Synonyms:** Bill, Sales Invoice  
**Definition:** Document detailing charges for service and parts, requesting payment.  
**Used in:** Module E

### Receipt
**Canonical Term:** Receipt  
**Synonyms:** OR (Official Receipt)  
**Definition:** Document acknowledging payment received from customer.  
**Used in:** Module E

### Bay
**Canonical Term:** Bay  
**Synonyms:** Lift, Service Bay, Work Bay, Stall  
**Definition:** Physical work location in the shop where vehicles are serviced.  
**Used in:** Modules B, C, J

### Stock
**Canonical Term:** Stock  
**Context:** Use for quantity on hand ("stock level," "out of stock")  
**Related:** Inventory (the system/module name)  
**Used in:** Module D

### Inventory
**Canonical Term:** Inventory  
**Context:** Use for the management system ("inventory module," "inventory valuation")  
**Related:** Stock (for quantity)  
**Used in:** Module D

### Job
**Canonical Term:** Job  
**Context:** Informal short form of Service Order, acceptable in UI labels and conversations  
**Canonical in code:** ServiceOrder  
**Used in:** Modules C, J

### POS
**Canonical Term:** POS (Point of Sale)  
**Definition:** The cashier's interface for billing and payment collection.  
**Used in:** Module E

### Over-the-Counter (OTC) Sale
**Canonical Term:** OTC Sale  
**Definition:** Sale of parts or accessories without an associated service order.  
**Used in:** Module E

### Chart of Accounts
**Canonical Term:** Chart of Accounts  
**Synonyms:** COA  
**Definition:** Structured list of all financial accounts (revenue, expenses, assets, liabilities, equity).  
**Used in:** Module G

### Gross Margin
**Canonical Term:** Gross Margin  
**Formula:** (Revenue - Cost of Goods Sold) / Revenue  
**Used in:** Modules E, G, J

### Comeback
**Canonical Term:** Comeback  
**Synonyms:** Repeat Repair, Rework  
**Definition:** Vehicle returning with the same issue shortly after service, indicating quality problem.  
**Used in:** Modules C, I, J

### No-Show
**Canonical Term:** No-Show  
**Definition:** Customer with appointment who does not arrive within grace period.  
**Used in:** Modules B, J

### CSAT
**Canonical Term:** CSAT (Customer Satisfaction Score)  
**Definition:** Numeric rating (typically 1-5) customer gives after service.  
**Used in:** Modules I, J

### NPS
**Canonical Term:** NPS (Net Promoter Score)  
**Definition:** Customer likelihood to recommend shop (0-10 scale), calculated as % promoters minus % detractors.  
**Used in:** Modules I, J

### Reminder
**Canonical Term:** Reminder  
**Context:** Automated notification sent to customer about upcoming service due.  
**Used in:** Module H

### Follow-Up
**Canonical Term:** Follow-Up  
**Context:** Post-service outreach to verify satisfaction or resolve issues.  
**Used in:** Module I

### Audit Log
**Canonical Term:** Audit Log  
**Synonyms:** Audit Trail, Activity Log  
**Definition:** Immutable record of who did what, when, and from where.  
**Used in:** Module K

### RBAC
**Canonical Term:** RBAC (Role-Based Access Control)  
**Definition:** Permission system where users are assigned roles, and roles grant permissions.  
**Used in:** Module K

### Gate
**Canonical Term:** Gate  
**Context:** Project milestone requiring approval before proceeding (Gate 0, Gate M1, Gate M2, Gate P, Gate L).  
**Used in:** Project management, Master Plan

### Slice
**Canonical Term:** Slice  
**Context:** Vertical implementation increment covering migration, domain, service, API, UI, tests, and docs.  
**Used in:** Project management, module checklists

### Module
**Canonical Term:** Module  
**Definition:** One of the 11 major business capability areas (K, A-J).  
**Used in:** System architecture, project management

---

## Abbreviations

| Abbreviation | Full Term | Context |
|--------------|-----------|---------|
| AMS | Autoshop Management System | System name |
| POS | Point of Sale | Module E |
| OTC | Over-the-Counter | Sales without service order |
| RBAC | Role-Based Access Control | Module K |
| CSAT | Customer Satisfaction Score | Module I |
| NPS | Net Promoter Score | Module I |
| COA | Chart of Accounts | Module G |
| AR | Accounts Receivable | Module E, G |
| AP | Accounts Payable | Module D, G |
| COGS | Cost of Goods Sold | Module D, G |
| P&L | Profit and Loss | Module G |
| KPI | Key Performance Indicator | Goals, Module J |
| VIN | Vehicle Identification Number | Module A |
| OR/CR | Official Receipt / Certificate of Registration | Module A (documents) |
| QC | Quality Control | Module C |
| SMS | Short Message Service | Module H, I |
| API | Application Programming Interface | Architecture |
| UI | User Interface | Design |
| UAT | User Acceptance Testing | Phase 7 |
| DoD | Definition of Done | Project management |
| ERD | Entity Relationship Diagram | Data modeling |
| ADR | Architecture Decision Record | `docs/adr/` |

---

## Avoid in Code

These terms should NOT be used as identifiers in code:

- **Client** → use Customer
- **Car** → use Vehicle
- **Mechanic** → use Technician
- **Quote** → use Estimate
- **Bill** → use Invoice
- **Lift** (when meaning service location) → use Bay
- **Item** (in business conversation) → use Part/Parts (but Item is correct for database entity)

---

## Adding Terms

When introducing a new concept:
1. Choose one canonical English term
2. Add it to this glossary with definition and usage
3. List known synonyms
4. Use it consistently in all new code and docs

---

**Maintained by:** Tech Lead  
**Review:** Update when new modules or concepts are added
