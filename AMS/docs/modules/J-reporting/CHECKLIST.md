# Module J: Dashboard, Analytics, and Reporting — Checklist

**Module Owner:** `PENDING(Q-21)` | **Phase:** 3 (basic), 6 (full) | **Status:** Not Started

## Core Functions (§5.J)
- [ ] J-F01: Role-based dashboards with drill-down · **Must**
- [ ] J-F02: Standard report library with filters (date, branch, advisor, tech, service) · **Must**
- [ ] J-F03: Scheduled reports delivered by email · **Should**
- [ ] J-F04: Export to PDF, Excel, CSV, print-ready · **Must**
- [ ] J-F05: Saved views and custom report builder · **Should**
- [ ] J-F06: Trend comparison (month-over-month, year-over-year) · **Must**
- [ ] J-F07: Alerts and thresholds (low cash, high stock-outs, overdue jobs, low CSAT) · **Should**
- [ ] J-F08: Data export API for external BI tools · **Could**

## Dashboards (§5.J)
- [ ] J-S01: Executive dashboard (revenue, profit, cash, AR/AP, jobs, avg ticket, trends) · **Must**
- [ ] J-S02: Operations dashboard (vehicles in shop, bay occupancy, overdue jobs, turnaround, tech utilization, parts-blocked) · **Must** (basic in Phase 3)
- [ ] J-S03: Sales/customer dashboard (new vs returning, revenue by service, top customers, lost opportunities, CSAT) · **Must**
- [ ] J-S04: Inventory dashboard (stock value, low stock, fast/slow movers, pending deliveries, variances) · **Must**
- [ ] J-S05: Finance dashboard (P&L snapshot, budget variance, AR/AP aging, expense breakdown) · **Must**
- [ ] J-S06: HR dashboard (attendance, overtime, payroll cost vs revenue, tech efficiency) · **Must**

## Standard Reports (§5.J - Catalog)
- [ ] J-O01: Daily sales and cash report · **Must** (basic in Phase 3)
- [ ] J-O02: Job profitability report · **Must**
- [ ] J-O03: Service mix analysis · **Must**
- [ ] J-O04: Technician productivity and efficiency · **Must**
- [ ] J-O05: Advisor sales performance · **Must**
- [ ] J-O06: Inventory valuation and movement · **Must**
- [ ] J-O07: Purchase and supplier analysis · **Should**
- [ ] J-O08: AR/AP aging reports · **Must**
- [ ] J-O09: Expense and budget variance · **Must**
- [ ] J-O10: Payroll register · **Must**
- [ ] J-O11: Customer retention and lapsed customers · **Should**
- [ ] J-O12: Reminder and campaign performance · **Should**
- [ ] J-O13: Warranty and comeback analysis · **Should**
- [ ] J-O14: Audit and user activity logs · **Must**

## Business Rules
- [ ] J-N01: Reports filtered by user's permission level (technician sees own, advisor sees team) · **Must**
- [ ] J-N02: Sensitive financial data hidden from non-privileged roles · **Must**
- [ ] J-N03: Report generation does not block operational queries (read replicas or async) · **Should**
- [ ] J-N04: Scheduled reports run at configured time, retry on failure · **Should**

## Integration
**Consumes:** All modules (A-I, K) for data aggregation  
**Provides:** None (J is read-only)

## Security
- [ ] J-SEC01: Row-level security per role (technician sees own jobs) · **Must**
- [ ] J-SEC02: Cost/margin hidden in reports for non-privileged users · **Must**
- [ ] J-SEC03: Export audit logged · **Must**
- [ ] J-SEC04: Permission tests per RBAC · **Must**

## Acceptance Criteria
**J-AC01 (Phase 3 Basic):** Daily sales dashboard shows today's revenue, jobs in shop by status, no errors  
**J-AC02 (Phase 6 Full):** Executive dashboard loads < 2s, drills into revenue by service, filters by date range  
**J-AC03:** Technician views own productivity report, cannot see other technicians' details  
**J-AC04:** Export AR aging to Excel, verify data matches on-screen  
**J-AC05:** Schedule weekly sales report, verify emailed Monday 8am  

## DoD
- Phase 3: Basic dashboards (J-S02, J-O01) complete, tested, fast
- Phase 6: All Must dashboards and reports complete, performance < 2s on realistic data, row-level security verified, user guide, demo

## Gate
**Phase 3 M1:** — | **Phase 3 M2:** — | **Tag:** `module-J-basic-v1.0`  
**Phase 6 M1:** — | **Phase 6 M2:** — | **Tag:** `module-J-full-v1.0`
