Autoshop Management System (JRS Bongabon): Master Plan
Version 1.0 · System blueprint covering scope, modules, screens, data, workflows, roles, and rollout
1. Purpose and Vision
The Autoshop Management System (AMS) is a single platform that runs the entire shop: from the moment a customer books, through diagnosis, repair, parts usage, billing, and payment, to follow-up and repeat business. It also covers the back office: payroll, expenses, inventory, and management reporting.
Goals
•	Remove paper job cards, notebooks, and spreadsheets; one source of truth for every vehicle, job, part, and peso.
•	Shorten vehicle turnaround time and reduce idle bay time.
•	Eliminate stock-outs and unrecorded part usage (shrinkage).
•	Increase repeat business through automated maintenance reminders and follow-ups.
•	Give the owner real-time visibility into revenue, profit, technician productivity, and cash position.
•	Create a full, auditable service history for every vehicle.
Success measures (KPIs)
•	Average job turnaround time (check-in to release)
•	Bay and technician utilization rate
•	Percentage of appointments that show up (no-show rate)
•	Inventory accuracy and stock-out incidents per month
•	Gross margin per job, per service type, and per technician
•	Repeat-customer rate and reminder-to-booking conversion
•	Customer satisfaction score (CSAT) after service
•	Days to collect on credit accounts
2. Users and Roles
Role	Main responsibilities	Primary modules
Owner / General Manager	Oversight, approvals, finance, strategy	J, G, F, K, all (view)
Service Advisor / Front Desk	Customer intake, appointments, estimates, communication	A, B, C, I
Cashier	Billing, payments, receipts, end-of-day cash	E
Technician / Mechanic	Execute jobs, log work, request parts	C (job view), D (request)
Shop Supervisor / Foreman	Assign jobs, quality check, approve releases	C, B, J
Parts / Inventory Clerk	Receiving, stock counts, issuance, purchasing	D
HR / Payroll Officer	Attendance, payroll, deductions	F
Accountant / Bookkeeper	Expenses, reconciliation, financial reports	G, E, J
System Administrator	Users, permissions, settings, backups	K
Customer (optional portal)	Book, view history, approve estimates, pay	A, B, H, I
3. End-to-End Business Flow
1.	Customer books or walks in → record/lookup customer and vehicle (A, B).
2.	Vehicle check-in → inspection, photos, odometer, customer complaints (C).
3.	Estimate / quotation → labor + parts, sent for customer approval (C, D).
4.	Approval → job order opened, work assigned to technician and bay (C).
5.	Parts issued from stock or ordered from supplier (D).
6.	Work performed → time logged, additional findings noted, extra approvals (C).
7.	Quality check and release → final inspection, road test sign-off (C).
8.	Billing and payment → invoice generated from the job order, payment posted (E).
9.	Accounting → sales, cost of parts, commissions, expenses recorded (G, F).
10.	After-service → warranty tracking, follow-up call/SMS, feedback (I).
11.	Retention → next-service reminders based on date and mileage (H).
12.	Management view → dashboards and reports across all of the above (J).
4. System Architecture (High Level)
•	Presentation layer: web application (desktop for front desk, cashier, admin) with a tablet-friendly view for technicians and a mobile-friendly customer portal.
•	Application layer: modular services (one per module) sharing common services: authentication, notifications, document generation, audit logging, file storage.
•	Data layer: relational database (single shared customer, vehicle, item, and employee master data), file storage for photos and documents, scheduled backups.
•	Integrations: SMS / email / messaging gateways, payment channels (cash, card, e-wallet, bank transfer), barcode/QR scanners, receipt printers, biometric or QR attendance devices, accounting export, optional vehicle-data lookup (plate / VIN decode).
•	Cross-cutting: role-based access control, audit trail, notification engine, configurable settings (tax, currency, templates), backup and recovery.
5. Module Specifications
Each module lists its purpose, core functions, what must be visible on screen, key records, and reports/outputs.
A. Customer and Vehicle Management
Purpose: The master directory of who the customers are and what vehicles they own; the foundation every other module reads from.
Core functions
•	Add, edit, merge, archive customers (individual or fleet/company accounts).
•	Register multiple vehicles per customer; transfer vehicle ownership.
•	Store full service history per vehicle.
•	Customer classification: regular, VIP, fleet, credit-account, blacklisted.
•	Duplicate detection (same phone, plate, or VIN).
•	Document attachments (OR/CR copy, insurance, photos).
•	Consent and communication preferences (SMS, email, call).
Screens and views to be seen
•	Customer list with search (name, phone, plate, VIN) and filters (type, status, last visit).
•	Customer profile: contact details, address, classification, balance/credit status, preferred contact method, notes, linked vehicles, visit history, total spend, open jobs, upcoming appointments, reminders sent.
•	Vehicle profile: plate number, make, model, year, trim, engine, transmission, fuel type, color, VIN, engine/chassis number, current odometer, registration expiry, insurance details, tire sizes, known issues, warranty items, photos.
•	Vehicle service timeline: chronological list of every job, part replaced, mileage at service, technician, cost, and recommended-but-declined work.
•	Fleet account view: all vehicles under one company, consolidated billing and spend.
Key records: Customer, Vehicle, Fleet Account, Contact Preference, Attachment.
Outputs: customer list, vehicle history report, fleet summary, inactive-customer list, birthday/anniversary list.
B. Appointment and Service Scheduling
Purpose: Plan shop capacity: who comes when, which bay, which technician, which service.
Core functions
•	Book appointments (front desk, phone, walk-in, online portal).
•	Service catalog with standard durations to auto-compute time slots.
•	Bay, lift, and technician calendar with drag-and-drop rescheduling.
•	Conflict detection (double-booked bay or technician; shop closing time).
•	Capacity rules (max jobs per day, specialty bays such as alignment or paint).
•	Confirmation, reminder, and reschedule notifications (SMS/email).
•	Walk-in queue and waitlist.
•	No-show and cancellation tracking.
•	Convert appointment to service order with one click.
Screens and views to be seen
•	Calendar views: day, week, month; filter by bay, technician, service type, status.
•	Bay board: live status of each bay (free, occupied, reserved, out of service).
•	Appointment form: customer, vehicle, requested services, complaint description, preferred date/time, estimated duration, assigned bay/technician, source (phone, walk-in, online).
•	Status color codes: scheduled, confirmed, arrived, in progress, completed, cancelled, no-show.
•	Today's arrivals list and waiting-room queue.
•	Available-slot finder.
Key records: Appointment, Bay/Lift, Service Catalog Item, Shop Hours and Holidays, Waitlist Entry.
Outputs: daily schedule printout, no-show report, utilization by bay, booking source analysis.
C. Service Order and Job Management
Purpose: The operational heart of the system; tracks every vehicle from check-in to release.
Core functions
•	Create service order (job card) from appointment or walk-in.
•	Digital vehicle check-in inspection with checklist, damage diagram, photos, fuel level, odometer, personal belongings.
•	Capture customer complaints and requested services.
•	Diagnosis notes and findings; recommended work with priority (urgent, soon, advisory).
•	Estimate / quotation builder (labor rates, flat-rate or hourly, parts, sublet work, discounts, taxes); versioning.
•	Customer approval capture (digital signature, SMS link, or recorded verbal approval with timestamp).
•	Additional-work approval workflow when new findings appear mid-job.
•	Assign technician(s) and bay; time clock per job (start, pause, stop).
•	Parts requisition linked to inventory (D).
•	Job status pipeline with notifications to customer at key stages.
•	Sublet / outsourced work tracking (machine shop, painting, towing).
•	Quality control checklist and supervisor sign-off before release.
•	Warranty and comeback (repeat repair) flagging.
•	Convert completed job to invoice (E).
Job status pipeline: Checked-in → Awaiting estimate → Awaiting approval → Awaiting parts → In progress → Quality check → Ready for release → Released → Closed (plus On hold / Cancelled).
Screens and views to be seen
•	Job board (kanban/list): every active job by status, vehicle, plate, advisor, technician, promised time, and elapsed time; overdue jobs highlighted.
•	Service order detail: customer and vehicle header, complaint, inspection results, photos, estimate lines, approved vs. declined items, parts issued, labor logged, notes timeline, attachments, status history, total cost and margin (for authorized roles).
•	Technician view (tablet): my assigned jobs, job instructions, start/stop timer, request part, add finding or photo, mark task complete.
•	Estimate screen with live totals, tax, and discounts; customer-facing printable/shareable version.
•	Inspection form with pass/attention/fail indicators per component.
•	Promised-time tracker and delay reasons.
•	Release screen: final checklist, summary of work, warranty terms, next service recommendation.
Key records: Service Order, Inspection, Estimate, Estimate Line, Labor Entry, Parts Requisition, Sublet Job, QC Checklist, Approval Log, Warranty Record.
Outputs: job card, estimate/quotation, work completion summary, technician productivity report, comeback report, average turnaround report, declined-work (lost opportunity) report.
D. Inventory and Stock Management
Purpose: Ensure the right parts, lubricants, and consumables are available, tracked, costed, and accounted for.
Core functions
•	Item master: parts, fluids, consumables, tires, accessories, tools; categories, brands, OEM/aftermarket cross-reference, vehicle fitment compatibility.
•	Unit of measure conversions (liters, pieces, sets).
•	Multiple locations (shelf, warehouse, bin).
•	Supplier directory with price lists and lead times.
•	Purchase requisition → purchase order → goods receipt → supplier invoice matching.
•	Stock issuance to job orders (with technician and job reference); returns to stock.
•	Barcode / QR labels and scanning.
•	Reorder points, minimum/maximum levels, low-stock alerts, suggested purchase list.
•	Costing method (weighted average or FIFO) and selling price rules (markup, tiered by customer type).
•	Cycle counts and full stock takes with variance approval.
•	Stock adjustments (damage, loss, expiry) with reason codes and approval.
•	Batch/expiry tracking for oils, coolants, and similar items.
•	Core charges and warranty returns to supplier (RMA).
•	Special-order and back-order tracking linked to customer jobs.
Screens and views to be seen
•	Item list: SKU, name, category, brand, stock on hand, reserved, available, reorder level, cost, price, location, supplier.
•	Item detail: fitment list, price history, movement ledger (in/out with reference), supplier options, photos, alternates.
•	Low-stock and out-of-stock dashboard.
•	Purchase order screen with status (draft, sent, partial, received, closed).
•	Goods receiving screen with quantity check against PO and costing update.
•	Issue-to-job screen with scan support.
•	Stock count worksheet with variance display.
•	Parts-pending-arrival list showing which jobs are blocked.
•	Supplier performance view (on-time delivery, price changes, defect rate).
Key records: Item, Category, Supplier, Purchase Order, Goods Receipt, Stock Movement, Stock Adjustment, Stock Count, Location, Return/RMA.
Outputs: stock valuation, stock movement report, fast/slow-moving analysis, dead-stock list, reorder report, purchase history, variance report, parts usage per job/technician, supplier price comparison.
E. Point-of-Sale (POS) and Billing Management
Purpose: Convert completed work and over-the-counter sales into accurate invoices and recorded payments.
Core functions
•	Invoice generation directly from a service order (labor, parts, sublet, fees).
•	Over-the-counter sales of parts, accessories, and fluids without a job order.
•	Discounts, promos, coupons, loyalty points, package/bundle pricing, and statutory discounts as configured.
•	Taxes (inclusive/exclusive), tax-exempt handling.
•	Multiple payment methods and split payments: cash, debit/credit card, e-wallet, bank transfer, check, store credit.
•	Down payments, deposits, and partial payments; balance tracking.
•	Credit / charge accounts for fleet and trusted customers with credit limits and terms.
•	Official receipts, invoices, and delivery receipts using configurable templates and numbering sequences.
•	Void, refund, and return processing with manager approval and audit trail.
•	End-of-day (Z) report and sales summary.
•	Accounts receivable: statements of account, aging, payment follow-up.
•	Insurance billing (claim reference, adjuster approval, customer share vs. insurer share).
•	Warranty and goodwill jobs billed at zero or to internal accounts.
Screens and views to be seen
•	POS screen: customer lookup, job order pull-in or item scan, line items with quantity, price, discount, running subtotal, tax, total; payment panel with split payment support.
•	Invoice preview and print/send options (print, PDF, SMS, email).
•	Open invoices and unpaid balances list.
•	Cashier shift screen: opening cash, transactions, expected vs. counted cash.
•	Refund/void approval queue.
•	Customer statement and aging view.
•	Daily sales dashboard by payment method.
Key records: Invoice, Invoice Line, Payment, Receipt, Shift/Cash Session, Credit Memo, Refund, Customer Account Ledger, Insurance Claim.
Outputs: daily sales report, collections report, AR aging, sales by item/service/advisor, discount and void report, tax summary, cash-over/short report.
F. Employee and Payroll Management
Purpose: Manage the workforce, time, pay, and productivity-based compensation.
Core functions
•	Employee master: personal details, position, department, hire date, employment type, pay rate, government and bank details, emergency contact, documents.
•	Skills, certifications, and training records (with expiry alerts).
•	Attendance: time in/out (biometric, QR, or PIN), shifts, lateness, overtime, leaves, holidays and rest days. (optional)
•	Leave management: balances, requests, approvals.
•	Technician job-time tracking linked to service orders (billed vs. actual hours; efficiency).
•	Compensation: monthly, daily, hourly, flat-rate, commission, incentive per job, bonuses, allowances.
•	Deductions: statutory contributions and taxes (configurable rules), loans, cash advances, uniform/tool charges, penalties.
•	Payroll run: compute, review, approve, lock; payslip generation and distribution.
•	Final pay, year-end bonus, and separation computations as configured.
•	Cash advance and loan ledger with automatic amortization.
•	Disciplinary and performance notes.
Screens and views to be seen
•	Employee directory and profile (with documents and compensation tabs visible only to authorized roles).
•	Daily attendance board: present, late, absent, on leave.
•	Timesheet and overtime approval screen.
•	Payroll period screen: gross, deductions, net per employee with drill-down; exceptions flagged (missing time, negative net).
•	Payslip viewer and printable payslip.
•	Commission/incentive computation view tied to completed jobs.
•	Technician efficiency dashboard (flagged vs. clocked hours).
•	Expiring certifications and contracts list.
Key records: Employee, Attendance Log, Shift, Leave Request, Payroll Period, Payslip, Deduction/Loan, Commission Rule, Training/Certification.
Outputs: payroll register, payslips, statutory remittance reports, attendance summary, overtime report, leave balances, commission report, bonus schedule, labor cost vs. revenue.
G. Financial and Expense Management
Purpose: Track money going out, reconcile it with money coming in, and produce the shop's financial picture.
Core functions
•	Chart of accounts with categories (revenue, cost of goods sold, operating expenses, assets, liabilities, equity).
•	Expense recording: rent, utilities, supplies, tools, marketing, repairs, insurance, licenses, taxes; recurring expenses.
•	Petty cash fund with replenishment and liquidation.
•	Accounts payable: supplier bills, due dates, partial payments, payment approvals.
•	Bank accounts and cash accounts; deposits and transfers; bank reconciliation.
•	Budgeting per category and per month with variance tracking.
•	Fixed asset register (lifts, scanners, compressors) with depreciation and maintenance schedule.
•	Automatic journal postings from sales, purchases, payroll, and inventory adjustments.
•	Profitability analysis per job, service type, advisor, and customer.
•	Tax computation support and period-closing controls.
•	Export to external accounting software.
•	Attachment of receipts/invoices to each expense.
Screens and views to be seen
•	Expense entry form (date, payee, category, amount, payment method, attachment, approval status).
•	Accounts payable list with due and overdue highlighting.
•	Cash and bank position summary.
•	Budget vs. actual chart by category.
•	Profit and loss, balance sheet, and cash flow statements with period selector.
•	Reconciliation screen (matching bank lines to system entries).
•	Fixed asset list with book value and maintenance due.
Key records: Account, Journal Entry, Expense, Vendor Bill, Bank Account, Reconciliation, Budget, Fixed Asset, Petty Cash Voucher.
Outputs: income statement, balance sheet, cash flow, trial balance, expense summary by category/vendor, AP aging, budget variance, gross margin analysis, tax summary.
H. Preventive Maintenance and Automated Reminders
Purpose: Bring customers back at the right time using the vehicle's actual service history.
Core functions
•	Maintenance schedule templates by service type and vehicle (e.g., oil change every X km or Y months; brake inspection; coolant; timing belt; tire rotation; battery check).
•	Next-due computation from last service date and odometer, adjusted by estimated daily mileage.
•	Registration, insurance, and emission-test expiry reminders.
•	Multi-channel automated notifications (SMS, email, messaging apps) with editable templates and personalization tokens.
•	Reminder sequences (e.g., 14 days before, 3 days before, day of, overdue follow-up).
•	Smart suppression (do not remind if already booked or serviced; respect opt-out).
•	One-tap booking link inside reminders.
•	Declined-work follow-up ("you postponed brake pad replacement at last visit").
•	Seasonal and promotional campaigns (rainy-season checks, aircon service) by segment.
•	Delivery tracking (sent, delivered, failed, replied) and conversion tracking (reminder → booking → completed job).
Screens and views to be seen
•	Due-for-service list: customer, vehicle, service due, due date/mileage, status (not contacted, contacted, booked, completed, declined), last contact.
•	Overdue and upcoming reminder calendar.
•	Template editor with preview and token picker.
•	Campaign builder: audience filters, message, schedule, estimated reach.
•	Reminder performance dashboard (sent, delivered, booked, revenue generated).
•	Per-vehicle maintenance plan view showing completed and upcoming items.
•	Opt-out and bounce list.
Key records: Maintenance Schedule Template, Vehicle Maintenance Plan, Reminder Rule, Message Template, Notification Log, Campaign.
Outputs: reminders due/overdue, campaign results, reminder conversion rate, lapsed-customer list.
I. Customer Follow-Up and After-Service Monitoring
Purpose: Verify quality, resolve problems quickly, and build loyalty after the vehicle leaves.
Core functions
•	Automatic follow-up tasks after job release (e.g., day 1, day 7, day 30 depending on service type).
•	Satisfaction survey (rating scale, short questions, free text) via SMS/email/QR.
•	Complaint and comeback logging with severity, root cause, assigned owner, resolution, and closure.
•	Warranty tracking: coverage terms per job/part, expiry, claim handling, supplier warranty recovery.
•	Callback task list for service advisors, with outcome notes.
•	Review and referral requests for satisfied customers.
•	Loyalty program: points, tiers, rewards, expiring points.
•	Customer communication history (calls, messages, emails) in one timeline.
•	Escalation rules for low scores or unresolved complaints.
Screens and views to be seen
•	Follow-up task queue (due today, overdue, completed) with outcome capture.
•	Survey results dashboard: average score, trend, by technician/advisor/service.
•	Complaint board with status (open, investigating, resolved, closed) and aging.
•	Warranty register with active coverage per vehicle.
•	Customer communication timeline on profile.
•	Loyalty balance and reward redemption screen.
Key records: Follow-Up Task, Survey, Survey Response, Complaint/Comeback, Warranty Claim, Loyalty Account, Communication Log.
Outputs: CSAT/NPS report, complaint analysis, comeback rate by technician/service, warranty cost report, follow-up completion rate, loyalty summary.
J. Dashboard, Analytics, and Reporting
Purpose: Turn operational data into decisions for owners, managers, and department heads.
Core functions
•	Role-based dashboards with drill-down.
•	Standard report library with filters (date range, branch, advisor, technician, service type).
•	Scheduled reports delivered by email.
•	Export to PDF, Excel, CSV; print-ready formats.
•	Saved views and custom report builder.
•	Trend comparison (this month vs. last, year over year).
•	Alerts and thresholds (low cash, high stock-outs, overdue jobs, low CSAT).
•	Data export API for external BI tools.
Dashboards to be seen
•	Executive dashboard: revenue today/week/month, gross profit, expenses, net income, cash position, AR and AP totals, jobs completed, average ticket, top services, trend charts.
•	Operations dashboard: vehicles in shop by status, bay occupancy, overdue jobs, average turnaround, technician utilization, parts-blocked jobs, today's appointments and no-shows.
•	Sales and customer dashboard: new vs. returning customers, revenue by service category, top customers, lost opportunities (declined estimates), reminder conversions, CSAT trend.
•	Inventory dashboard: stock value, low-stock items, fast/slow movers, pending deliveries, variances.
•	Finance dashboard: P&L snapshot, budget variance, AR aging, AP due, expense breakdown.
•	HR dashboard: attendance rate, overtime hours, payroll cost vs. revenue, technician efficiency.
Standard report catalog: daily sales and cash report; job profitability; service mix; technician productivity and efficiency; advisor sales; inventory valuation and movement; purchase and supplier analysis; AR/AP aging; expense and budget variance; payroll register; customer retention and lapsed customers; reminder and campaign performance; warranty and comeback analysis; audit and user-activity logs.
K. User Management and System Administration
Purpose: Secure the system, control who can do what, and keep it configured and recoverable.
Core functions
•	User accounts, role templates, and fine-grained permissions (view / create / edit / delete / approve / export per module and per sensitive field such as cost, margin, salary).
•	Strong authentication: password policy, optional two-factor authentication, session timeout, lockout after failed attempts.
•	Approval workflows (discount limits, voids, adjustments, large expenses, price overrides).
•	Audit trail: who changed what, when, from where; tamper-resistant logs.
•	Company and branch settings: shop profile, logo, hours, holidays, tax rates, numbering sequences, currency, document templates.
•	Master-data configuration: service catalog, labor rates, payment methods, reason codes, status lists, notification templates.
•	Backup, restore, and data retention; data export.
•	Integration settings (SMS gateway, email, payment, printers, attendance devices).
•	Data privacy controls: consent records, data access and deletion requests, masking of sensitive fields.
•	System health monitor and error log.
•	Multi-branch readiness (branch-level data and permissions).
Screens and views to be seen
•	User list and role/permission matrix editor.
•	Audit log viewer with filters.
•	Settings pages grouped by area (company, tax, numbering, templates, integrations, notifications).
•	Approval rules configuration.
•	Backup status and restore points.
•	Login history and active sessions.
Key records: User, Role, Permission, Audit Log, Setting, Template, Integration Credential, Backup Record.
6. Cross-Module Integration Map
From	To	What flows
A Customers/Vehicles	B, C, E, H, I	Customer and vehicle identity, history, preferences
B Scheduling	C	Appointment converts to service order; bay and technician assignment
C Service Orders	D	Parts requisition and issuance; reserved stock; blocked-by-parts status
C Service Orders	E	Approved lines become invoice lines; release triggers billing
C Service Orders	F	Technician time and job completion drive efficiency and commissions
D Inventory	G	Purchases, cost of goods sold, adjustments post to accounting
E Billing	G	Sales, receivables, payments, and taxes post to accounting
F Payroll	G	Payroll expense and liabilities post to accounting
C / E	H	Completed service updates the maintenance plan and next-due dates
E / C	I	Release/payment triggers follow-up tasks and surveys
All	J	Data feeds dashboards and reports
K	All	Authentication, permissions, audit, settings
7. Core Data Model (Main Entities)
•	People: Customer, Fleet Account, Employee, User, Supplier
•	Assets: Vehicle, Fixed Asset, Bay/Lift
•	Operations: Appointment, Service Order, Inspection, Estimate, Labor Entry, Sublet Job, QC Checklist, Warranty Record
•	Inventory: Item, Category, Location, Purchase Order, Goods Receipt, Stock Movement, Stock Count, Return
•	Sales: Invoice, Payment, Receipt, Cash Session, Credit Memo, Insurance Claim
•	HR/Payroll: Attendance Log, Leave, Payroll Period, Payslip, Deduction/Loan, Commission Rule
•	Finance: Account, Journal Entry, Expense, Vendor Bill, Bank Account, Budget
•	Engagement: Maintenance Template, Reminder Rule, Notification Log, Campaign, Survey, Complaint, Loyalty Account
•	System: Role, Permission, Audit Log, Setting, Template
Principles: one customer record and one vehicle record shared by all modules; every transaction references the job order, customer, and user who created it; no hard deletes of financial or inventory records (void/reverse instead).
8. Role-Based Access Overview
Module	Owner/GM	Advisor	Cashier	Technician	Parts Clerk	HR/Payroll	Accountant	Admin
A Customers/Vehicles	Full	Full	View	View (assigned)	View	None	View	Full
B Scheduling	Full	Full	View	View (own)	None	None	None	Full
C Service Orders	Full	Full	View	Edit (assigned)	View	None	View	Full
D Inventory	Full	View	View	Request	Full	None	View	Full
E POS/Billing	Full	View	Full	None	None	None	Full	Full
F Payroll	Full	None	None	Own record	None	Full	View	Full
G Finance	Full	None	Limited	None	None	None	Full	Full
H Reminders	Full	Full	None	None	None	None	None	Full
I Follow-Up	Full	Full	None	None	None	None	None	Full
J Reports	Full	Limited	Limited	Own	Limited	Limited	Full	Full
K Administration	View	None	None	None	None	None	None	Full
Sensitive fields (cost price, margin, salaries, bank details) are hidden by default and shown only to explicitly permitted roles.
9. Non-Functional Requirements
•	Security: encrypted data in transit and at rest, hashed passwords, role-based access, audit logging, protection against common web attacks.
•	Reliability: daily automated backups, tested restore procedure, target uptime during shop hours, offline-tolerant POS or quick recovery plan for power/internet loss.
•	Performance: common screens load in under 2 seconds; search results in under 1 second for typical data volumes.
•	Usability: minimal clicks for front-desk and cashier tasks; large-touch tablet view for technicians; bilingual labels if needed.
•	Scalability: supports growth in vehicles, transactions, and additional branches without redesign.
•	Compliance and privacy: configurable tax and receipt formats; statutory payroll rules as settings; consent for marketing messages; retention and deletion policy for personal data.
•	Maintainability: modular design, documented APIs, configuration over code for rates, templates, and rules.
10. Recommended Technology Direction
•	Frontend: responsive web app (e.g., React or Vue) with PWA support for tablets and mobile.
•	Backend: API-based service (e.g., Node.js, Laravel, Django, or .NET) with a modular structure per business module.
•	Database: PostgreSQL or MySQL; object storage for photos and documents.
•	Messaging: SMS gateway and email service provider; optional messaging-app integration.
•	Hosting: managed cloud hosting with automated backups, or on-premise server with off-site backup.
•	Hardware: receipt/thermal printers, barcode scanners, cash drawer, tablets for technicians, attendance terminal.
Final choices should follow the team's skills, budget, and hosting preference.
11. Implementation Roadmap
Phase	Focus	Modules	Outcome
0	Discovery and design	All	Confirmed requirements, workflows, data migration plan, UI prototypes
1	Foundation	K, A	Secure login, roles, settings, customer and vehicle records live
2	Core operations	B, C	Appointments, job orders, inspections, estimates, job board
3	Parts and money in	D, E	Inventory, purchasing, issuance, invoicing, POS, receipts
4	Back office	F, G	Payroll, attendance, expenses, accounting postings
5	Retention	H, I	Maintenance reminders, follow-ups, surveys, warranty, loyalty
6	Insight	J	Dashboards, report library, scheduled reports
7	Hardening and launch	All	UAT, training, data migration, parallel run, go-live, support
Note: a basic version of J (daily sales and jobs-in-shop view) should ship with Phase 3 so management benefits early.
12. Testing, Training, and Go-Live
•	Testing: unit and integration tests per module; end-to-end scenario tests (booking → job → parts → invoice → payment → reminder); permission tests; payroll computation validation against manual samples; load test for peak days.
•	Data migration: clean and import existing customers, vehicles, items, suppliers, and open balances; reconcile counts and totals after import.
•	Training: role-specific sessions with quick-reference guides and short videos; sandbox practice environment.
•	Go-live: parallel run of old and new process for 2–4 weeks, daily reconciliation, hypercare support, then formal sign-off.
13. Risks and Mitigations
Risk	Mitigation
Staff resistance or low adoption	Involve users in design, role-based training, simple technician UI, owner sponsorship
Inaccurate opening inventory or customer data	Full stock count before migration, data-cleaning step, reconciliation sign-off
Internet or power interruptions	Offline-capable POS or fast recovery mode, UPS, local backup
Scope creep	Phased roadmap, change-control process, backlog prioritization
Payroll or tax rule errors	Configurable rules, parallel payroll runs, accountant validation
Data loss or security breach	Backups, encryption, access controls, audit logs, regular restore tests
Poor reminder quality (spam, wrong timing)	Opt-in/out controls, suppression rules, message throttling, performance review
14. Future Enhancements
•	Customer mobile app with live job tracking and in-app payment (can be executed now but for android only)
•	Multi-branch consolidation and inter-branch stock transfers
•	Online parts catalog/e-commerce ordering with supplier APIs
•	Telematics or OBD-II data for predictive maintenance (needed api or something?)
15. Immediate Next Steps
1.	Validate this plan with the owner.
2.	Prioritize must-have vs. nice-to-have features per module.
3.	Document current workflows and collect sample forms (job card, invoice, payroll sheet).
4.	Produce wireframes for the highest-impact screens: job board, service order, POS, and dashboard.
5.	Finalize the technology stack, hosting, and budget; confirm Phase 1 timeline.
Module K outputs: audit reports, user access review, backup log, and settings change history.


Note: 
this is not finalized, subject for changes.
Documents must be made during the development of this system.
Create also a contract.
Secure the system by deep diving into system vulnerabilities.

