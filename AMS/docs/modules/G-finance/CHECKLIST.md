# Module G: Financial and Expense Management — Checklist

**Module Owner:** `PENDING(Q-21)` | **Phase:** 4 | **Status:** Not Started

## Core Functions (§5.G)
- [ ] G-F01: Chart of accounts (revenue, COGS, expenses, assets, liabilities, equity) · **Must**
- [ ] G-F02: Expense recording with receipts, recurring expenses · **Must**
- [ ] G-F03: Petty cash fund with replenishment and liquidation · **Must**
- [ ] G-F04: Accounts payable (supplier bills, due dates, partial payments, approval) · **Must**
- [ ] G-F05: Bank accounts and cash accounts, deposits, transfers · **Must**
- [ ] G-F06: Bank reconciliation · **Must**
- [ ] G-F07: Budgeting per category and month with variance tracking · **Should**
- [ ] G-F08: Fixed asset register with depreciation · **Should**
- [ ] G-F09: Automatic journal postings from sales (E), purchases (D), payroll (F), adjustments (D) · **Must**
- [ ] G-F10: Profitability analysis per job, service type, advisor, customer · **Must**
- [ ] G-F11: Tax computation support and period closing · **Must**
- [ ] G-F12: Export to external accounting software · **Should**

## Screens: Expense entry, AP list, cash/bank summary, budget vs actual, P&L/balance sheet/cash flow, reconciliation screen, fixed asset list

## Key Records: Account, Journal Entry, Expense, Vendor Bill, Bank Account, Reconciliation, Budget, Fixed Asset, Petty Cash Voucher

## Outputs: Income statement, balance sheet, cash flow, trial balance, expense summary by category/vendor, AP aging, budget variance, gross margin analysis, tax summary

## Business Rules
- [ ] G-N01: Journal entries must balance (debits = credits) · **Must**
- [ ] G-N02: Period closing prevents backdated entries · **Must**
- [ ] G-N03: Automatic postings from D, E, F events (event-driven) · **Must**
- [ ] G-N04: Bank reconciliation matches every transaction or flags variance · **Must**
- [ ] G-N05: Fixed asset depreciation calculated per method (straight-line, etc.) · **Should**

## Integration
**Provides:** Financial statements to J (reporting)  
**Consumes:** D (purchase, COGS, adjustments events), E (sales, payments events), F (payroll events), K (chart of accounts settings)

## Security
- [ ] G-SEC01: Accountant only can post journal entries, Owner/Admin can view · **Must** · `PENDING(Q-09)`
- [ ] G-SEC02: Expense approval workflow for amounts over threshold · **Must**
- [ ] G-SEC03: Bank account details restricted · **Must**
- [ ] G-SEC04: Permission tests per RBAC · **Must**

## Acceptance Criteria
**G-AC01:** D emits stock received event, G auto-posts AP and inventory increase, verify balanced  
**G-AC02:** E emits sales event, G auto-posts revenue and AR, verify in income statement  
**G-AC03:** F emits payroll event, G posts payroll expense and liabilities, verify  
**G-AC04:** Record expense, reconcile bank, generate P&L for month, verify accurate  
**G-AC05:** Close period, attempt backdate entry, rejected  

## DoD: All Must, event consumption tests green, financial statements accurate, security.md, accountant validates, user guide for accountant, demo

## Gate: **M1:** — | **M2:** — | **Tag:** `module-G-v1.0`
