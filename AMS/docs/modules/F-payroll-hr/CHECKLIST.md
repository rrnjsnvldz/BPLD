# Module F: Employee and Payroll Management — Checklist

**Module Owner:** `PENDING(Q-21)` | **Phase:** 4 | **Status:** Not Started

## Core Functions (§5.F)
- [ ] F-F01: Employee master (personal details, position, hire date, pay rate, gov IDs) · **Must**
- [ ] F-F02: Skills, certifications, training records with expiry alerts · **Should**
- [ ] F-F03: Attendance (time in/out) · **Should** · `PENDING(Q-11)`
- [ ] F-F04: Shifts, lateness, overtime tracking · **Should** · `PENDING(Q-11)`
- [ ] F-F05: Leave management (balances, requests, approvals) · **Must**
- [ ] F-F06: Technician job-time tracking from C (billed vs actual, efficiency) · **Must**
- [ ] F-F07: Compensation (salary, commission per job, incentives, bonuses, allowances) · **Must**
- [ ] F-F08: Deductions (statutory SSS/PhilHealth/PagIBIG/tax, loans, advances, penalties) · **Must** · `PENDING(A-09)`
- [ ] F-F09: Payroll run (compute, review, approve, lock) · **Must**
- [ ] F-F10: Payslip generation and distribution · **Must**
- [ ] F-F11: Final pay, 13th month, separation computations · **Should**
- [ ] F-F12: Cash advance and loan ledger with amortization · **Should**
- [ ] F-F13: Disciplinary and performance notes · **Could**

## Screens: Employee directory, attendance board, timesheet approval, payroll period screen, payslip viewer, commission computation, technician efficiency dashboard, expiring certifications list

## Key Records: Employee, Attendance Log, Shift, Leave Request, Payroll Period, Payslip, Deduction/Loan, Commission Rule, Training/Certification

## Outputs: Payroll register, payslips, statutory reports (SSS, PhilHealth, Pag-IBIG, BIR), attendance summary, overtime, leave balances, commission report, labor cost vs revenue

## Business Rules
- [ ] F-N01: Payroll period locked after approval, no edits · **Must**
- [ ] F-N02: Statutory rates effective-dated, marked UNVERIFIED until accountant confirms · **Must** · `PENDING(A-09)`
- [ ] F-N03: Negative net pay flagged and blocked · **Must**
- [ ] F-N04: Technician commission tied to completed jobs only · **Must**
- [ ] F-N05: Loan amortization auto-deducted per pay period · **Should**
- [ ] F-N06: Leave balance accrues per pay period, caps at max · **Must**

## Integration
**Provides:** Payroll expense to G (accounting), commission data to J (reporting)  
**Consumes:** C (technician job time), K (settings: statutory rates, pay periods, commission rules)

## Security
- [ ] F-SEC01: Salary and bank details visible to HR and Admin only, employee sees own · **Must**
- [ ] F-SEC02: Payroll approval requires second person (HR prepares, Admin approves) · **Must**
- [ ] F-SEC03: Statutory rates changes logged in audit trail · **Must**
- [ ] F-SEC04: Permission tests per RBAC · **Must**

## Acceptance Criteria
**F-AC01:** Add employee, configure salary + commission rule, run payroll, verify payslip correct  
**F-AC02:** Technician completes 3 jobs, commission calculated, appears in payroll  
**F-AC03:** Apply loan, amortize over 6 pay periods, verify auto-deduction  
**F-AC04:** Lock payroll period, attempt to edit, rejected  
**F-AC05:** Compare payroll computation to accountant's manual sample, match  

## DoD: All Must, payroll validated against accountant samples, security.md, second reviewer on payroll logic, user guide for HR officer, demo

## Gate: **M1:** — | **M2:** — | **Tag:** `module-F-v1.0`
