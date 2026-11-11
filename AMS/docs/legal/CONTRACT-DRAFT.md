# SOFTWARE DEVELOPMENT AND SERVICE AGREEMENT

**TEMPLATE NOTICE**: This is a draft software development and service agreement template. It has NOT been reviewed by a licensed attorney. It MUST be reviewed by a Philippine lawyer before signing. All bracketed items [LIKE THIS] must be filled in or removed. This template is provided for planning purposes only and does not constitute legal advice.

---

## PARTIES TO THIS AGREEMENT

This Software Development and Service Agreement ("Agreement") is entered into on `[DATE]` ("Effective Date") by and between:

**DEVELOPER:**  
`[DEVELOPER/COMPANY NAME]`  
Business Address: `[DEVELOPER ADDRESS]`  
(hereinafter referred to as "Developer")

**CLIENT:**  
`[CLIENT FULL NAME]`  
Trading as: JRS Bongabon Auto Shop  
Business Address: `[CLIENT ADDRESS]`  
(hereinafter referred to as "Client")

Developer and Client are collectively referred to as "the Parties" and individually as a "Party."

---

## 1. DEFINITIONS

For purposes of this Agreement, the following terms shall have the meanings set forth below:

1.1 **"AMS"** or **"System"** means the Autoshop Management System software described in this Agreement and its schedules, including all modules, features, and functionality specified herein.

1.2 **"Deliverables"** means all source code, object code, documentation, design assets, configuration files, database schemas, test scripts, deployment instructions, and other work products created by Developer under this Agreement.

1.3 **"Modules"** means the eleven (11) functional modules designated A through K as described in Schedule A:
- Module A: Customer and Vehicle Management
- Module B: Appointment and Service Scheduling
- Module C: Service Order and Job Management
- Module D: Inventory and Stock Management
- Module E: POS and Billing Management
- Module F: Employee and Payroll Management
- Module G: Financial and Expense Management
- Module H: Preventive Maintenance and Reminders
- Module I: Customer Follow-Up and After-Service
- Module J: Dashboard, Analytics, and Reporting
- Module K: User Management and System Administration

1.4 **"Phase"** means a development phase numbered 0 through 7 as described in Schedule B, each culminating in a Gate approval milestone.

1.5 **"Gate"** means a formal approval checkpoint at the end of each Phase, with defined exit criteria that must be met before proceeding to the next Phase.

1.6 **"Hosting Environment"** means the servers, cloud infrastructure, database services, storage, and related services on which the System will be deployed and operated.

1.7 **"Maintenance Services"** means post-launch support and maintenance services as described in Schedule D.

1.8 **"Change Request"** means a formal written request to modify the scope, specifications, timeline, or cost of the project, processed according to Section 6 of this Agreement.

1.9 **"Intellectual Property Rights"** means all copyright, patent, trade secret, trademark, moral rights, and other intellectual property rights of any kind, whether registered or unregistered, including all applications and registrations thereof.

1.10 **"Philippine Data Privacy Act"** or **"DPA"** means Republic Act No. 10173, the Data Privacy Act of 2012, and its implementing rules and regulations.

1.11 **"Business Day"** means any day other than Saturday, Sunday, or a public holiday in the Philippines.

1.12 **"Master Plan"** means the project master plan document incorporated as part of Schedule A.

---

## 2. PROJECT SCOPE

2.1 **General Scope.** Developer agrees to develop and deliver the AMS in accordance with the specifications set forth in the Master Plan (incorporated by reference as Schedule A) and this Agreement.

2.2 **Modules Included.** The System shall include all eleven (11) modules specified in Section 1.3 above, with functionality as detailed in Schedule A.

2.3 **Development Phases.** Development shall proceed through eight (8) phases as described in Schedule B:
- Phase 0: Discovery and Design
- Phase 1: Foundation (Platform Kernel, UI Kit, Module K, Module A)
- Phase 2: Core Operations (Module B, Module C)
- Phase 3: Parts and Billing (Module D, Module E, basic Module J)
- Phase 4: Back Office (Module F, Module G)
- Phase 5: Retention (Module H, Module I)
- Phase 6: Insight (full Module J)
- Phase 7: Hardening and Launch

2.4 **Technology Stack.** The technology stack shall be determined and agreed upon at Gate 0 approval in accordance with Architecture Decision Record 001 (ADR-001), which shall be incorporated as an addendum to this Agreement.

2.5 **Architecture.** The System architecture shall follow the Modular Monolith pattern as recommended in Architecture Decision Record 002 (ADR-002), unless otherwise agreed in writing by both Parties at Gate 0.

2.6 **Philippine Business Context.** The System shall be designed and configured for Philippine business operations, including:
- Currency in Philippine Pesos (PHP)
- Timezone: Asia/Manila
- Statutory payroll rules and tax regulations applicable in the Philippines
- Single-branch operation with data structure ready for future multi-branch expansion

2.7 **User Interface Language.** The user interface shall be in English. Additional languages may be added via Change Request.

2.8 **Included Features.** The following features are included in the scope:
- Web-based application accessible via desktop, tablet, and mobile browsers
- Role-based access control for all user types specified in Schedule A
- Security baseline controls per Schedule E (Security Plan)
- Automated daily backups
- SMS and email notification capabilities
- Receipt printer, barcode scanner, and cash drawer integration
- Data export capabilities for accounting
- Training materials and user documentation
- Data migration from Client's existing records
- User acceptance testing support
- Vulnerability assessment in Phase 7

2.9 **Excluded Features.** Unless added by approved Change Request, the following are explicitly excluded from scope:
- Custom native mobile applications (Android or iOS)
- Online parts e-commerce with supplier API integrations
- Vehicle telematics or OBD-II predictive maintenance integration
- Multi-branch consolidated operations user interface (data structure will be ready, but multi-branch UI is excluded)
- Integration with external accounting software beyond data export
- Languages other than English
- Custom hardware beyond standard receipt printers, scanners, cash drawers, and attendance terminals

---

## 3. DELIVERABLES

3.1 **Phase 0 Deliverables:**
- Master Plan document
- Master Checklist and Module Checklists
- Design System Plan
- Security Plan
- Data Migration Plan
- Architecture Decision Records (ADR-001, ADR-002)
- Contract (this document)
- Project README and CONTRIBUTING documents
- Glossary

3.2 **Phase 1 Deliverables:**
- Platform kernel (authentication, RBAC, audit logging, settings, notifications, file storage, scheduler, event system)
- Design-ready UI component library (UI Kit)
- Module K: Administration (user management, roles, permissions, system settings)
- Module A: Customer and Vehicle Management
- Source code repository with version control
- Database schema and migrations
- API documentation
- Unit and integration tests
- Module specifications and security documentation
- Deployment instructions

3.3 **Phase 2 Deliverables:**
- Module B: Appointment and Service Scheduling
- Module C: Service Order and Job Management
- Enhanced source code, database schema updates, and migrations
- Updated API documentation
- Comprehensive test suite
- Module specifications and security documentation
- Integration documentation

3.4 **Phase 3 Deliverables:**
- Module D: Inventory and Stock Management
- Module E: POS and Billing Management
- Basic Module J: Reporting (daily sales view and jobs-in-shop dashboard)
- Complete end-to-end workflow capability
- Updated source code, database schema, and migrations
- Updated API documentation
- Test suite including end-to-end transaction tests
- Module specifications and security documentation

3.5 **Phase 4 Deliverables:**
- Module F: Employee and Payroll Management
- Module G: Financial and Expense Management
- Accounting integration and financial reports
- Updated source code, database schema, and migrations
- Updated API documentation
- Payroll validation test results
- Module specifications and security documentation

3.6 **Phase 5 Deliverables:**
- Module H: Preventive Maintenance and Reminders
- Module I: Customer Follow-Up and After-Service
- Automated reminder and follow-up workflows
- Updated source code, database schema, and migrations
- Updated API documentation
- Test suite including notification delivery tests
- Module specifications and security documentation

3.7 **Phase 6 Deliverables:**
- Complete Module J: Dashboard, Analytics, and Reporting
- All executive and operational dashboards
- Complete report library
- Scheduled report functionality
- Updated source code and migrations
- Updated API documentation
- Module specifications and security documentation

3.8 **Phase 7 Deliverables:**
- User acceptance testing (UAT) execution and sign-off
- Data migration scripts and execution
- Migrated and reconciled production data
- Security vulnerability assessment report
- Security findings remediation
- Staff training sessions and materials
- User documentation and quick reference guides
- Operations runbook (backup, restore, incident procedures)
- Go-live support and hypercare
- Final source code and documentation package
- System credentials and access transfer

3.9 **General Requirements for All Phases:**
- All source code shall be delivered in the agreed repository format
- All code shall include appropriate comments and documentation
- All deliverables shall pass agreed quality gates before phase completion
- Test results and coverage reports shall be provided
- Deployment and configuration instructions shall be provided
- Changelog and release notes shall be maintained

---

## 4. MILESTONES AND PAYMENT SCHEDULE

4.1 **Milestone Payment Structure.** Client shall pay Developer according to the following milestone schedule:

| Milestone | Deliverable / Gate | Payment Amount | Target Due Date |
|-----------|-------------------|----------------|-----------------|
| M0 | Gate 0 Approval: Planning documents complete, technology stack approved, Client accepts Master Plan | `[AMOUNT]` | `[DATE]` |
| M1 | Gate 1: Foundation complete (K + A live), security baseline implemented, design-swap test passes | `[AMOUNT]` | `[DATE]` |
| M2 | Gate 2: Core operations live (B + C operational), job board and service order workflow functional | `[AMOUNT]` | `[DATE]` |
| M3 | Gate 3: Parts and billing live (D + E operational), full end-to-end transaction flow working | `[AMOUNT]` | `[DATE]` |
| M4 | Gate 4: Back office live (F + G operational), payroll validated, accounting integrated | `[AMOUNT]` | `[DATE]` |
| M5 | Gate 5: Retention features live (H + I operational), automated reminders sending | `[AMOUNT]` | `[DATE]` |
| M6 | Gate 6: Full reporting live (complete J operational), all dashboards functional | `[AMOUNT]` | `[DATE]` |
| M7 | Gate L (Launch): UAT passed, security cleared, data migrated, staff trained, system live | `[AMOUNT]` | `[DATE]` |
| Retention | Final payment retained until 30 days post-launch hypercare period complete | `[AMOUNT]` | `[DATE + 30 days from M7]` |

4.2 **Payment Terms Addendum.** The specific payment amounts and due dates for each milestone shall be agreed upon at Gate 0 approval and recorded in a Payment Schedule Addendum signed by both Parties, which shall become an integral part of this Agreement.

4.3 **Invoicing and Payment.** Upon completion of each milestone and Client's written acceptance per Section 5, Developer shall issue an invoice to Client. Client shall pay each invoice within `[N]` Business Days of receipt.

4.4 **Late Payment.** If Client fails to pay any invoice when due, Developer may charge interest on the overdue amount at the rate of `[RATE]` percent per month (or the maximum rate permitted by Philippine law, whichever is less) from the due date until payment is received in full.

4.5 **Suspension for Non-Payment.** If any invoice remains unpaid for more than `[N]` Business Days after the due date, Developer may, upon `[N]` Business Days written notice to Client, suspend work under this Agreement until payment is received, without liability for delay.

---

## 5. ACCEPTANCE CRITERIA

5.1 **Milestone Acceptance Process.** Each Phase shall be deemed complete when Client confirms in writing that all Gate exit criteria specified in Schedule C have been met.

5.2 **Acceptance Testing Period.** Client shall have `[N]` Business Days from Developer's delivery notification to test the deliverables and either (a) provide written acceptance, or (b) provide written rejection with a detailed list of defects or non-conformities.

5.3 **Defect Remediation.** If Client rejects deliverables with valid defects during the acceptance testing period, Developer shall have `[N]` Business Days to remediate the defects and resubmit for acceptance. The acceptance testing period shall restart upon resubmission.

5.4 **Deemed Acceptance.** If Client does not provide written acceptance or rejection within the acceptance testing period, the deliverables shall be deemed accepted as of the last day of that period.

5.5 **Definition of Defect.** A "defect" means a failure of the deliverable to conform to the specifications in Schedule A or to perform as explicitly documented in the relevant module specifications. Defects do not include:
- Feature requests or enhancements not in the agreed scope
- Issues caused by Client's infrastructure, hardware, or network
- Issues caused by unauthorized modifications to the System
- Changes in Client's requirements after specification approval

5.6 **Module-Specific Acceptance Criteria.** The specific acceptance criteria for each module are set forth in Schedule A (Master Plan, Module Specifications) and Schedule C (Gate Exit Criteria).

---

## 6. CHANGE CONTROL

6.1 **Change Request Requirement.** Any change to the scope, specifications, timeline, budget, or other material terms of this Agreement requires a written Change Request signed by authorized representatives of both Parties.

6.2 **Change Request Submission.** Either Party may submit a Change Request in writing, describing:
- The proposed change
- The reason for the change
- The impact on scope, timeline, and cost
- Any risks or dependencies

6.3 **Impact Assessment.** Developer shall provide a written impact assessment within `[N]` Business Days of receiving a Change Request, including:
- Technical feasibility analysis
- Estimated cost impact
- Estimated timeline impact
- Impact on other modules or features
- Recommended approach

6.4 **Change Request Approval.** Both Parties must sign the Change Request and impact assessment for the change to be approved. Approved Change Requests may adjust milestone dates and payment amounts by written addendum.

6.5 **No Effect Without Approval.** Verbal change requests or informal email discussions shall have no effect. Changes must be documented, assessed, and formally approved before implementation.

6.6 **Minor Clarifications.** Minor clarifications that do not affect scope, cost, or timeline may be handled informally via email and documented in the project log, without requiring a formal Change Request.

---

## 7. CLIENT RESPONSIBILITIES

7.1 **Timely Decisions and Approvals.** Client shall provide timely decisions, information, approvals, and feedback as reasonably required for Developer to perform the work. Target response time for approval requests is `[N]` Business Days.

7.2 **Project Contact.** Client shall designate a project contact person with authority to make decisions, approve deliverables, and act on behalf of Client for purposes of this Agreement.

7.3 **Access to Information.** Client shall provide Developer with reasonable access to:
- Existing business records, paper files, job cards, and spreadsheets needed for requirements analysis and data migration
- Business process documentation and sample forms
- Staff for interviews, requirements gathering, and UAT participation

7.4 **Hardware Procurement.** Client shall procure or provide the following hardware required for System operation:
- Receipt printers (ESC/POS compatible thermal printers)
- Barcode scanners (USB or Bluetooth)
- Cash drawer (compatible with receipt printer)
- Tablets for technician use
- Biometric attendance terminal or equivalent (if required)
- Uninterruptible Power Supply (UPS) units for critical workstations
- Desktop computers, workstations, or terminals as needed

7.5 **Internet Connectivity.** Client shall provide and maintain adequate internet connectivity at the shop location for System access and operation.

7.6 **Hosting Subscription.** Client shall subscribe to and pay for hosting services as specified in Section 12, or authorize Developer to procure on Client's behalf with reimbursement.

7.7 **Staff Availability.** Client shall ensure that shop staff are available for:
- User acceptance testing activities
- Training sessions
- Data migration validation activities
- Parallel run participation (Phase 7)

7.8 **Data Migration Preparation.** Client shall:
- Conduct final stock count and reconciliation before data migration
- Reconcile accounts receivable and accounts payable
- Clean and validate existing customer and vehicle data
- Sign off on migrated data accuracy per the Data Migration Plan

7.9 **No Unauthorized Modifications.** Client shall not modify, reverse engineer, or attempt to modify the System source code without prior written consent from Developer.

7.10 **Credential Security.** Client shall maintain the confidentiality and security of all system usernames, passwords, and access credentials.

---

## 8. INTELLECTUAL PROPERTY AND LICENSING

8.1 **Work Made for Hire.** To the extent permitted by Philippine law, all Deliverables created by Developer under this Agreement shall be considered "work made for hire" with Client as the author and owner.

8.2 **Assignment of Rights.** To the extent any Deliverables do not qualify as work made for hire, Developer hereby assigns to Client, effective upon receipt of full payment for each Phase, all rights, title, and interest in and to the Deliverables for that Phase, including all Intellectual Property Rights therein.

8.3 **Phase-by-Phase Vesting.** The assignment in Section 8.2 shall vest phase by phase as each milestone payment is received. Until a milestone is paid, Developer retains ownership of the corresponding Deliverables.

8.4 **Developer Retention Rights.** Developer retains a non-exclusive, perpetual, royalty-free license to:
- General methodologies, processes, techniques, and know-how developed during the project
- Reusable tools, libraries, and frameworks of a general nature (not specific to Client's business)
- Experience and learning gained during the project

8.5 **Third-Party Components.** The System may incorporate third-party open-source software libraries and frameworks. Such components remain subject to their respective open-source licenses. Developer shall provide Client with a bill of materials identifying all third-party components and their license types.

8.6 **Restrictions on Resale.** Client shall not:
- Resell, sublicense, or distribute the AMS as a competing software product without prior written consent from Developer
- Remove or obscure any copyright, trademark, or other proprietary notices in the Deliverables

8.7 **Portfolio and Reference.** Developer may reference the project in its portfolio and marketing materials, provided that Developer does not disclose Client's confidential business data. Client may request in writing that Developer not use Client's name or project details, and Developer shall comply with such request.

---

## 9. CONFIDENTIALITY AND DATA PROTECTION

9.1 **Confidential Information.** "Confidential Information" means all non-public information disclosed by one Party to the other, including:
- Business data, financial records, customer lists, supplier lists
- Trade secrets, processes, and know-how
- Source code (from Developer to Client)
- Pricing, cost structures, and business strategies
- Personal data of employees and customers
- Any information marked or identified as confidential

9.2 **Confidentiality Obligations.** Each Party agrees to:
- Hold all Confidential Information in strict confidence
- Use Confidential Information only for purposes of this Agreement
- Not disclose Confidential Information to third parties without prior written consent, except to employees, contractors, or advisors who need to know and are bound by similar obligations
- Protect Confidential Information with at least the same degree of care used to protect its own confidential information, but no less than reasonable care

9.3 **Exceptions.** Confidentiality obligations do not apply to information that:
- Is or becomes publicly available through no breach of this Agreement
- Was rightfully known prior to disclosure
- Is independently developed without use of Confidential Information
- Is required to be disclosed by law or court order (with prompt notice to the other Party if legally permitted)

9.4 **Survival.** Confidentiality obligations shall survive termination of this Agreement for `[N]` years.

9.5 **Philippine Data Privacy Act Compliance.** The Parties acknowledge that Client is the data controller and Developer is the data processor with respect to personal data processed under this Agreement.

9.6 **Developer Data Processing Obligations.** Developer shall:
- Process personal data only on documented instructions from Client
- Implement technical and organizational security measures per Schedule E (Security Plan)
- Not access, use, or retain Client data beyond what is necessary for providing services under this Agreement
- Ensure that personnel authorized to process personal data are bound by confidentiality obligations
- Assist Client in responding to data subject requests and DPA compliance obligations
- Notify Client of any personal data breach within 24 hours of discovery

9.7 **Client Data Controller Responsibilities.** Client remains responsible for:
- Compliance with the Philippine Data Privacy Act as data controller
- Obtaining necessary consents from customers and employees
- Responding to data subject access requests
- Privacy notices and policies
- Registration with the National Privacy Commission if required

9.8 **Data Retention and Deletion.** Upon termination or expiration of this Agreement, Developer shall, at Client's election, either return or securely destroy all Client data and Confidential Information within `[N]` days, except as required to be retained by law or for Developer's legitimate compliance or archival purposes.

---

## 10. SECURITY AND BACKUP

10.1 **Security Controls.** Developer shall implement security controls in accordance with the Security Plan (Schedule E), including:
- Authentication and session management
- Role-based access control (RBAC)
- Audit logging
- Encryption of data in transit (HTTPS/TLS)
- Encryption of data at rest (database encryption)
- Input validation and protection against common vulnerabilities (SQL injection, XSS, CSRF)
- Secure file upload handling
- Security headers and rate limiting
- Secrets management

10.2 **Vulnerability Assessment.** In Phase 7, Developer shall conduct a vulnerability assessment of the System, including testing against the OWASP Top 10 and application security verification standards. Developer shall remediate all critical and high-severity findings before go-live.

10.3 **Developer Security Responsibilities.** Developer is responsible for:
- Implementing the security controls specified in Schedule E
- Following secure coding practices
- Conducting code reviews for security-critical components
- Providing security documentation for each module
- Remediating vulnerabilities discovered during Phase 7 assessment

10.4 **Client Security Responsibilities.** Client is responsible for:
- Maintaining physical security of hardware and terminals
- Managing and securing user credentials and passwords
- Granting appropriate access permissions to users
- Keeping hosting and third-party service subscriptions active and paid
- Monitoring system access and reviewing audit logs
- Responding to security incidents post-launch

10.5 **Backup Strategy.** Developer shall implement automated daily backup functionality as specified in the Security Plan, including:
- Database backups
- Uploaded file and attachment backups
- Backup retention policy
- Tested restore procedures

10.6 **Backup Responsibility Post-Launch.** After go-live, Client is responsible for ensuring backup services remain active and subscriptions are paid. Developer shall provide Client with backup verification procedures and restore instructions.

10.7 **Data Breach Notification.** In the event of a data breach or security incident discovered during the development period or warranty period:
- Developer shall notify Client within 24 hours of discovery
- Both Parties shall cooperate in containment, investigation, and remediation
- Both Parties shall cooperate in notification to affected individuals and authorities as required by the Philippine Data Privacy Act

---

## 11. WARRANTY AND SUPPORT

11.1 **Warranty Period.** Developer warrants that the System will perform substantially in accordance with the specifications in Schedule A for a period of `[N]` months from the go-live date (Gate L acceptance date) ("Warranty Period").

11.2 **Warranty Coverage.** During the Warranty Period, Developer shall, at no additional charge to Client:
- Fix defects that cause the System to not perform as specified
- Correct errors in the source code, database schema, or configuration
- Provide technical support for issues related to Developer's work

11.3 **Warranty Exclusions.** The warranty does not cover:
- Damage caused by Client-side hardware failure, power outage, or network issues
- Issues caused by unauthorized modifications to the System
- Issues caused by Client's misuse or failure to follow documented procedures
- Force majeure events beyond Developer's reasonable control
- New features, enhancements, or changes to requirements (these require a Change Request)
- Third-party service failures (hosting, SMS gateway, payment processor)

11.4 **Response Time Service Levels.** During the Warranty Period, Developer shall respond to defect reports according to the following service levels:

| Severity | Definition | Response Time | Resolution Target |
|----------|------------|---------------|-------------------|
| Critical | System completely unusable for core business operations; data loss or security breach | `[N]` hours | `[N]` Business Days |
| High | Significant feature broken or unavailable; major business process blocked | `[N]` Business Days | `[N]` Business Days |
| Medium | Feature partially working; workaround available | `[N]` Business Days | `[N]` Business Days |
| Low | Minor issue; cosmetic defect; documentation error | `[N]` Business Days | Best effort |

11.5 **Warranty Process.** To invoke warranty service, Client shall:
- Submit defect reports in writing via agreed communication channel (email or issue tracker)
- Provide sufficient detail to reproduce the issue
- Provide reasonable cooperation in diagnosis and testing

11.6 **Warranty Remedies.** Developer's sole obligation and Client's exclusive remedy under this warranty shall be for Developer to repair or replace the non-conforming deliverable. If Developer cannot repair or replace within a reasonable time, Client may terminate this Agreement and receive a pro-rata refund of fees paid for the non-conforming deliverable.

11.7 **Post-Warranty Maintenance.** After the Warranty Period expires, Client may elect to purchase annual maintenance services as described in Schedule D (Annual Maintenance Agreement).

11.8 **DISCLAIMER.** EXCEPT AS EXPRESSLY PROVIDED IN THIS SECTION 11, DEVELOPER PROVIDES THE SYSTEM "AS IS" WITHOUT ANY OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.

---

## 12. HOSTING COSTS

12.1 **Hosting Not Included.** The fees in Section 4 are for development services only and do not include ongoing hosting infrastructure costs unless explicitly stated otherwise in the Payment Schedule Addendum.

12.2 **Hosting Components.** Hosting infrastructure costs include but are not limited to:
- Cloud servers or virtual private servers (VPS)
- Database services (e.g., managed PostgreSQL or MySQL)
- Object storage for files, photos, and attachments
- SMS gateway service subscription
- Email service provider subscription
- Domain name registration and SSL certificate
- Content delivery network (CDN) if applicable
- Backup storage
- Monitoring and logging services

12.3 **Hosting Recommendation.** Developer shall recommend appropriate hosting configuration based on the technology stack decision (ADR-001) and expected usage volume. Estimated monthly hosting cost: `[AMOUNT]` (subject to confirmation based on final hosting selection).

12.4 **Procurement Options.** Client may:
- Subscribe directly to hosting services and provide Developer with access for deployment, OR
- Authorize Developer to procure hosting services on Client's behalf, with Client reimbursing Developer for actual costs incurred

12.5 **Account Ownership.** Regardless of procurement method, all hosting accounts, subscriptions, and services shall be:
- Registered in Client's name or under Client's control
- Paid by Client (or reimbursed to Developer if procured on Client's behalf)
- Fully transferred to Client upon project completion or termination

12.6 **Credential Transfer.** Upon completion of Phase 7 or termination of this Agreement, Developer shall transfer all hosting account credentials, access keys, and administrative logins to Client.

12.7 **Post-Launch Responsibility.** After go-live, Client is solely responsible for maintaining active hosting subscriptions and paying all hosting-related fees. Developer is not responsible for system downtime or data loss resulting from Client's failure to maintain hosting services.

---

## 13. DATA OWNERSHIP AND PORTABILITY

13.1 **Client Data Ownership.** All business data entered into or generated by the System belongs exclusively to Client, including:
- Customer and vehicle records
- Service orders and job history
- Inventory and stock records
- Financial transactions and accounting data
- Employee and payroll records
- All other business information

13.2 **No Data Usage by Developer.** Developer has no right, license, or permission to use, sell, license, analyze, or process Client's business data for any purpose other than providing services under this Agreement.

13.3 **Data Export.** Upon Client's request at any time, or upon termination, Developer shall provide Client with a complete export of all business data in standard, machine-readable formats (CSV, JSON, or SQL dump) within `[N]` Business Days.

13.4 **Data Portability.** The System shall include data export functionality allowing Client to export data at any time without Developer assistance.

13.5 **No Data Hostage.** Developer shall not condition data export or system access on payment of disputed amounts or any other obligation, except that Developer may withhold delivery of new features or enhancements until payment is current.

---

## 14. LIMITATION OF LIABILITY

14.1 **Liability Cap.** Except as provided in Section 14.4, Developer's total aggregate liability under this Agreement, whether in contract, tort, negligence, or otherwise, shall not exceed the total fees paid by Client to Developer in the twelve (12) months immediately preceding the event giving rise to the claim, or `[AMOUNT]`, whichever is greater.

14.2 **Exclusion of Consequential Damages.** Neither Party shall be liable to the other for any indirect, incidental, consequential, special, exemplary, or punitive damages, including but not limited to:
- Lost profits or revenue
- Loss of business or business opportunity
- Loss of data (except to the extent covered by Section 14.4)
- Business interruption
- Cost of substitute services or products

Even if the Party has been advised of the possibility of such damages.

14.3 **Applicability.** The limitations in this Section 14 apply to the maximum extent permitted by Philippine law.

14.4 **Exceptions.** The limitations in Sections 14.1 and 14.2 do NOT apply to:
- Death or personal injury caused by negligence
- Fraud or willful misconduct
- Breach of confidentiality obligations (Section 9)
- Breach of intellectual property assignment obligations (Section 8)
- Gross negligence
- Violations of the Philippine Data Privacy Act resulting from Developer's failure to implement agreed security controls

14.5 **Client Responsibility for Third-Party Claims.** Developer shall not be liable for claims arising from Client's use of the System in violation of law, third-party rights, or this Agreement.

---

## 15. TERMINATION

15.1 **Termination for Material Breach.** Either Party may terminate this Agreement for material breach by the other Party by providing `[N]` days written notice specifying the breach. If the breaching Party cures the breach within the notice period, the termination shall be void.

15.2 **Examples of Material Breach:**
- Client's failure to pay undisputed invoices within `[N]` days after written demand
- Developer's failure to provide Deliverables for any milestone within `[N]` days of the target due date without valid justification
- Breach of confidentiality obligations
- Breach of intellectual property provisions

15.3 **Termination for Convenience by Client.** Client may terminate this Agreement for convenience at any time by providing `[N]` days written notice. In the event of termination for convenience:
- Client shall pay Developer for all work completed through the date of termination
- Client shall pay Developer for all in-progress work on a pro-rata basis
- Client shall pay an early termination fee of `[AMOUNT or PERCENTAGE]` of the remaining unpaid milestone fees

15.4 **Termination for Non-Payment.** If Client fails to pay any undisputed invoice within `[N]` days after the due date, Developer may, after providing `[N]` days written notice and opportunity to cure, terminate this Agreement for non-payment.

15.5 **Termination for Prolonged Suspension.** If work is suspended due to Client delay or non-performance for more than `[N]` days, Developer may terminate this Agreement upon `[N]` days written notice.

15.6 **Effect of Termination - Deliverables.** Upon termination:
- Developer shall deliver to Client all completed Deliverables and work-in-progress
- Developer shall provide reasonable assistance to Client in transitioning to another developer or in-house team
- Client shall pay Developer for all work completed and accepted up to the termination date

15.7 **Effect of Termination - Data.** Upon termination:
- Developer shall provide Client with a complete export of all business data within `[N]` days
- Developer shall return or securely destroy all Client Confidential Information within `[N]` days, except as required by law or for legitimate archival purposes

15.8 **Effect of Termination - IP Rights.** Upon termination:
- Intellectual Property Rights in Deliverables vest in Client for all milestone payments received prior to termination
- Developer retains ownership of Deliverables for unpaid milestones
- If Client pays the outstanding balance for partially completed work, IP Rights for that work transfer to Client

15.9 **Effect of Termination - Hosting Access.** Upon termination, Developer shall transfer all hosting credentials and system access to Client within `[N]` days, regardless of payment status (though Developer may withhold delivery of unpaid Deliverables).

15.10 **Survival.** The following sections survive termination: Sections 8 (Intellectual Property), 9 (Confidentiality), 13 (Data Ownership), 14 (Limitation of Liability), 16 (Dispute Resolution), 17 (Governing Law), and this Section 15.10.

---

## 16. DISPUTE RESOLUTION

16.1 **Good-Faith Negotiation.** In the event of any dispute, controversy, or claim arising out of or relating to this Agreement, the Parties agree to first attempt to resolve the matter through good-faith negotiation. Either Party may initiate negotiations by providing written notice to the other Party. The Parties shall negotiate for a period of `[N]` days following such notice.

16.2 **Mediation.** If the dispute cannot be resolved through negotiation, the Parties agree to submit the dispute to mediation before `[MEDIATION BODY, e.g., Philippine Dispute Resolution Center, Inc. (PDRCI), Philippine Chamber of Commerce and Industry (PCCI) Mediation Center, or Integrated Bar of the Philippines (IBP) Mediation Service]`. The costs of mediation shall be shared equally by the Parties.

16.3 **Arbitration.** If mediation fails to resolve the dispute within `[N]` days, the Parties agree to submit the dispute to binding arbitration under the rules of `[ARBITRATION BODY AND RULES, e.g., PDRCI Arbitration Rules, or Alternative Dispute Resolution Act of 2004 (RA 9285)]`.

16.4 **Arbitration Procedures:**
- Venue: `[CITY]`, Philippines
- Number of arbitrators: `[One or Three]`
- Language: English
- The arbitrator's decision shall be final and binding
- Judgment on the arbitration award may be entered in any court of competent jurisdiction

16.5 **Exception for Injunctive Relief.** Notwithstanding the above, either Party may seek temporary or preliminary injunctive or other interim relief from any court of competent jurisdiction as necessary to protect its rights pending completion of arbitration.

16.6 **Continued Performance.** Except in the case of termination, the Parties shall continue to perform their respective obligations under this Agreement during the pendency of any dispute resolution proceedings.

---

## 17. GOVERNING LAW

17.1 **Philippine Law.** This Agreement shall be governed by and construed in accordance with the laws of the Republic of the Philippines, without regard to its conflict of law provisions.

17.2 **Jurisdiction.** Subject to the dispute resolution provisions in Section 16, the Parties submit to the exclusive jurisdiction of the courts of `[CITY/PROVINCE]`, Philippines for any legal proceedings.

---

## 18. GENERAL PROVISIONS

18.1 **Entire Agreement.** This Agreement, including all Schedules attached hereto and incorporated by reference, constitutes the entire agreement between the Parties concerning the subject matter hereof and supersedes all prior or contemporaneous agreements, understandings, negotiations, and discussions, whether oral or written.

18.2 **Amendments.** This Agreement may be amended or modified only by a written instrument signed by authorized representatives of both Parties.

18.3 **Waiver.** The failure of either Party to enforce any provision of this Agreement shall not be construed as a waiver of that provision or the right to enforce it at a later time.

18.4 **Severability.** If any provision of this Agreement is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect, and the invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.

18.5 **Force Majeure.** Neither Party shall be liable for failure or delay in performance caused by events beyond its reasonable control, including but not limited to:
- Acts of God (typhoons, earthquakes, floods, fires)
- War, terrorism, civil unrest, strikes, or labor disputes
- Government actions, laws, regulations, or restrictions
- Pandemics or public health emergencies
- Power outages, telecommunications failures, or internet service disruptions

The affected Party shall promptly notify the other Party and use reasonable efforts to resume performance. If the force majeure event continues for more than `[N]` days, either Party may terminate this Agreement without liability.

18.6 **Notices.** All notices, requests, demands, and other communications required or permitted under this Agreement shall be in writing and shall be deemed to have been duly given when:
- Delivered personally
- Sent by registered mail or courier with proof of delivery
- Sent by email to the addresses specified below (with confirmation of receipt)

**Developer Notice Address:**  
`[DEVELOPER EMAIL ADDRESS]`  
`[DEVELOPER PHYSICAL ADDRESS]`

**Client Notice Address:**  
`[CLIENT EMAIL ADDRESS]`  
`[CLIENT PHYSICAL ADDRESS]`

Either Party may change its notice address by providing written notice to the other Party.

18.7 **Independent Contractors.** Developer is an independent contractor and not an employee, partner, agent, or joint venturer of Client. Developer has no authority to bind Client or make commitments on Client's behalf.

18.8 **Assignment.** Neither Party may assign this Agreement or any rights or obligations hereunder without the prior written consent of the other Party, except that:
- Developer may assign to an affiliated entity or in connection with a merger, acquisition, or sale of substantially all assets
- Client may assign to a successor entity in connection with a business sale or transfer

18.9 **No Third-Party Beneficiaries.** This Agreement is for the sole benefit of the Parties and their permitted successors and assigns. Nothing in this Agreement, express or implied, is intended to confer any rights or remedies on any person or entity other than the Parties.

18.10 **Counterparts.** This Agreement may be executed in counterparts, each of which shall be deemed an original and all of which together shall constitute one and the same instrument. Electronic signatures shall have the same force and effect as original signatures.

18.11 **Headings.** The section and subsection headings in this Agreement are for convenience only and shall not affect the interpretation of this Agreement.

18.12 **Language.** This Agreement is executed in English. If translated into another language, the English version shall prevail in the event of any conflict.

---

## SIGNATURES

SIGNED by the Parties on the date first written above.

**DEVELOPER:**

___________________________________________  
Name: `[AUTHORIZED REPRESENTATIVE NAME]`  
Title: `[TITLE]`  
Company: `[DEVELOPER/COMPANY NAME]`  
Date: __________________

**CLIENT:**

___________________________________________  
Name: `[CLIENT FULL NAME]`  
Title: `[TITLE/POSITION]`  
Business: JRS Bongabon Auto Shop  
Date: __________________

---

## SCHEDULE A — MODULE SPECIFICATIONS SUMMARY

### Reference Documents
Complete module specifications are incorporated by reference from:
- **Master Plan:** `docs/01-MASTER-PLAN.md` (Section 5: Module Specifications Summary)
- **Module Checklists:** `docs/modules/<X>-<module-name>/CHECKLIST.md`
- **Module Specifications:** `docs/modules/<X>-<module-name>/SPEC.md`

### Module Summary

**Module A: Customer and Vehicle Management**  
Master directory of customers and vehicles; service history tracking; customer classification and segmentation; document attachments; consent management; duplicate detection and merging.

**Module B: Appointment and Service Scheduling**  
Appointment booking (desk, phone, online portal); service catalog; bay and technician calendar; capacity management; conflict detection; confirmation and reminder workflow; walk-in queue; no-show tracking.

**Module C: Service Order and Job Management**  
Service order creation; digital inspection forms; diagnosis and estimate builder; customer approval workflow; technician assignment and time tracking; parts requisition; job status pipeline (check-in through release); quality control checklist; warranty tracking.

**Module D: Inventory and Stock Management**  
Item master data; supplier directory; purchase requisition and order processing; goods receipt; stock issuance to jobs; barcode scanning; reorder alerts; inventory costing (FIFO/weighted average); stock counts and adjustments; batch and expiry tracking.

**Module E: POS and Billing Management**  
Invoice generation from service orders; over-the-counter sales; discounts and promotions; tax handling; multiple payment methods; split payments; credit account management; official receipt generation; void and refund processing; end-of-day cash reconciliation; accounts receivable aging.

**Module F: Employee and Payroll Management**  
Employee master data; skills and certifications; attendance tracking (optional); leave management; job time tracking; compensation (salary, commission, incentives); statutory deductions; payroll run processing; payslip generation; cash advances and loans.

**Module G: Financial and Expense Management**  
Chart of accounts; expense recording; petty cash management; accounts payable; bank account reconciliation; budget tracking; fixed asset register; automated journal entry posting; income statement, balance sheet, and cash flow reports; profitability analysis; accounting data export.

**Module H: Preventive Maintenance and Reminders**  
Maintenance schedule templates by vehicle make/model; next-service-due computation; expiry reminders (registration, insurance, emission test); multi-channel notifications (SMS, email); reminder sequences; booking link integration; campaign management; conversion tracking.

**Module I: Customer Follow-Up and After-Service**  
Automated follow-up task creation; satisfaction surveys (CSAT, NPS); complaint and comeback logging; warranty claim tracking; callback task queue; review and referral requests; loyalty program support; communication history; escalation rules.

**Module J: Dashboard, Analytics, and Reporting**  
Role-based dashboards with drill-down; executive dashboard (revenue, profit, cash, jobs); operations dashboard (vehicles in shop, bay occupancy, turnaround time); sales and customer analytics; inventory reports; financial reports; HR and payroll reports; standard report library; scheduled reports; data export (PDF, Excel, CSV).

**Module K: User Management and System Administration**  
User account creation and management; role and permission configuration; fine-grained access control; authentication and session management; approval workflow configuration; comprehensive audit trail; company and branch settings; master data configuration (tax rates, service catalog, reason codes); backup and restore management; integration settings; system health monitoring.

---

## SCHEDULE B — PHASE PLAN AND MILESTONE DATES

| Phase | Description | Modules / Deliverables | Target Completion Date | Gate |
|-------|-------------|------------------------|------------------------|------|
| **Phase 0** | Discovery and Design | Master Plan, Checklists, Design Plan, Security Plan, Data Migration Plan, ADRs, Contract Draft | `[DATE]` | **Gate 0** |
| **Phase 1** | Foundation | Platform Kernel, UI Kit, Module K (Administration), Module A (Customers/Vehicles) | `[DATE]` | **Gate 1** |
| **Phase 2** | Core Operations | Module B (Scheduling), Module C (Service Orders) | `[DATE]` | **Gate 2** |
| **Phase 3** | Parts and Billing | Module D (Inventory), Module E (POS/Billing), Basic Module J (Reporting) | `[DATE]` | **Gate 3** |
| **Phase 4** | Back Office | Module F (Payroll), Module G (Finance) | `[DATE]` | **Gate 4** |
| **Phase 5** | Retention | Module H (Reminders), Module I (Follow-Up) | `[DATE]` | **Gate 5** |
| **Phase 6** | Insight | Full Module J (Dashboards and Reports) | `[DATE]` | **Gate 6** |
| **Phase 7** | Hardening and Launch | UAT, Data Migration, Training, Security Assessment, Go-Live, Hypercare | `[DATE]` | **Gate L (Launch)** |

### Phase 0: Discovery and Design
**Duration:** `[N]` weeks  
**Deliverables:** All planning documents (no code)  
**Exit Criteria:** Client approves Master Plan, technology stack, design approach, security plan; all open questions answered; Gate 0 approved

### Phase 1: Foundation (Platform Kernel + Modules K, A)
**Duration:** `[N]` weeks  
**Key Features:**
- Authentication, RBAC, audit logging, settings, notification engine
- Design-ready UI component library
- User and role management
- Customer and vehicle master data
**Exit Criteria:** Foundation complete, security baseline verified, design-swap test passes

### Phase 2: Core Operations (Modules B, C)
**Duration:** `[N]` weeks  
**Key Features:**
- Appointment booking and scheduling
- Service order workflow (check-in, estimate, approval, job tracking, release)
- Bay and technician assignment
**Exit Criteria:** Job board operational, appointment-to-service-order conversion working

### Phase 3: Parts and Billing (Modules D, E, Basic J)
**Duration:** `[N]` weeks  
**Key Features:**
- Inventory management and parts requisition
- POS and billing
- Payment processing
- Basic reporting (daily sales, jobs in shop)
**Exit Criteria:** End-to-end transaction flow complete (appointment → job → parts → invoice → payment)

### Phase 4: Back Office (Modules F, G)
**Duration:** `[N]` weeks  
**Key Features:**
- Employee and payroll management
- Financial and expense management
- Accounting integration
**Exit Criteria:** Payroll validated, accounting postings accurate, P&L report correct

### Phase 5: Retention (Modules H, I)
**Duration:** `[N]` weeks  
**Key Features:**
- Maintenance reminders and campaigns
- Follow-up tasks and surveys
- Complaint tracking
**Exit Criteria:** Automated reminders sending, follow-up workflow operational, CSAT tracking

### Phase 6: Insight (Full Module J)
**Duration:** `[N]` weeks  
**Key Features:**
- Executive dashboard
- Operations dashboard
- Complete report library
- Scheduled reports
**Exit Criteria:** All dashboards live, all reports functional

### Phase 7: Hardening and Launch
**Duration:** `[N]` weeks  
**Activities:**
- User acceptance testing with shop staff
- Training sessions and materials creation
- Data migration execution and validation
- Parallel run (`[N]` weeks)
- Vulnerability assessment and penetration testing
- Security findings remediation
- Backup and restore testing
- Go-live support
- Hypercare period (30 days post-launch)
**Exit Criteria:** UAT passed, security cleared, data migrated and reconciled, staff trained, system live

---

## SCHEDULE C — ACCEPTANCE CRITERIA PER GATE

### Gate 0: Planning Complete
**Entry:** Blueprint received, team assembled  
**Exit Criteria:**
- ✅ Master Plan approved by Client
- ✅ Technology stack decided (ADR-001)
- ✅ Architecture approach decided (ADR-002)
- ✅ All planning documents complete (checklists, design plan, security plan, migration plan)
- ✅ Open questions answered or explicitly deferred with Client approval
- ✅ Assumptions validated with Client
- ✅ Contract signed
- ✅ Payment Schedule Addendum signed
- ✅ Hosting decision made

**Approval:** Client signs Gate 0 approval document

### Gate 1: Foundation Complete
**Entry:** Phase 1 development complete  
**Exit Criteria:**
- ✅ Platform kernel operational (authentication, RBAC, audit, settings, notifications, file storage, scheduler, events)
- ✅ UI Kit complete with design tokens and component gallery
- ✅ Design-swap test passes (can switch design without touching business logic)
- ✅ Module K live (user management, roles, permissions, system settings)
- ✅ Module A live (customer and vehicle management)
- ✅ Security baseline controls implemented and verified
- ✅ All Module K and Module A acceptance tests pass
- ✅ Documentation complete for delivered modules
- ✅ Demo scenario executed successfully

**Approval:** Client signs Gate 1 approval and milestone payment authorization

### Gate 2: Core Operations Complete
**Entry:** Phase 2 development complete  
**Exit Criteria:**
- ✅ Module B live (scheduling, appointments, bay/technician calendar)
- ✅ Module C live (service order workflow, estimate, approval, job tracking)
- ✅ Appointment successfully converts to service order
- ✅ Job board operational with status pipeline
- ✅ Estimate and approval workflow functional
- ✅ All Module B and Module C acceptance tests pass
- ✅ Earlier modules' regression tests pass
- ✅ Documentation complete
- ✅ Demo scenario executed successfully

**Approval:** Client signs Gate 2 approval and milestone payment authorization

### Gate 3: Parts and Billing Complete
**Entry:** Phase 3 development complete  
**Exit Criteria:**
- ✅ Module D live (inventory, purchase orders, stock issuance)
- ✅ Module E live (POS, billing, payments)
- ✅ Basic Module J live (daily sales view, jobs-in-shop dashboard)
- ✅ End-to-end transaction flow works: appointment → job → parts requisition → issuance → work → invoice → payment
- ✅ Cash reconciliation functional
- ✅ Deferred integrations from Phase 2 (C to D, C to E) completed
- ✅ All Module D, E, and basic J acceptance tests pass
- ✅ Earlier modules' regression tests pass
- ✅ Documentation complete
- ✅ Demo scenario executed successfully

**Approval:** Client signs Gate 3 approval and milestone payment authorization

### Gate 4: Back Office Complete
**Entry:** Phase 4 development complete  
**Exit Criteria:**
- ✅ Module F live (payroll, HR, attendance, leave)
- ✅ Module G live (finance, expenses, accounting postings)
- ✅ Payroll calculation validated against accountant's manual samples
- ✅ Accounting integration functional (automatic journal postings)
- ✅ P&L, balance sheet, and cash flow reports accurate
- ✅ All Module F and G acceptance tests pass
- ✅ Earlier modules' regression tests pass
- ✅ Documentation complete
- ✅ Demo scenario executed successfully

**Approval:** Client signs Gate 4 approval and milestone payment authorization

### Gate 5: Retention Complete
**Entry:** Phase 5 development complete  
**Exit Criteria:**
- ✅ Module H live (maintenance reminders, campaigns)
- ✅ Module I live (follow-up tasks, surveys, complaints)
- ✅ Automated reminders sending successfully (SMS and email)
- ✅ Follow-up workflow operational
- ✅ CSAT/NPS survey tracking functional
- ✅ All Module H and I acceptance tests pass
- ✅ Earlier modules' regression tests pass
- ✅ Documentation complete
- ✅ Demo scenario executed successfully

**Approval:** Client signs Gate 5 approval and milestone payment authorization

### Gate 6: Full Reporting Complete
**Entry:** Phase 6 development complete  
**Exit Criteria:**
- ✅ Full Module J live (all dashboards, complete report library)
- ✅ Executive dashboard operational with drill-down
- ✅ Operations dashboard operational
- ✅ All standard reports functional
- ✅ Scheduled reports working
- ✅ Data export (PDF, Excel, CSV) working
- ✅ All Module J acceptance tests pass
- ✅ Earlier modules' regression tests pass
- ✅ Documentation complete
- ✅ Demo scenario executed successfully

**Approval:** Client signs Gate 6 approval and milestone payment authorization

### Gate L: Launch (Go-Live)
**Entry:** Phase 7 activities complete  
**Exit Criteria:**
- ✅ UAT completed with shop staff; all critical and high-priority issues resolved
- ✅ Training sessions delivered; staff trained on all modules
- ✅ User documentation and quick reference guides delivered
- ✅ Data migration executed; data reconciled and signed off by Client
- ✅ Parallel run completed (`[N]` weeks) with acceptable results
- ✅ Vulnerability assessment completed; all critical and high findings remediated
- ✅ Security assessment report delivered
- ✅ Backup and restore test passed
- ✅ Operations runbook delivered
- ✅ All hosting credentials transferred to Client
- ✅ System live in production
- ✅ Go-live support provided
- ✅ Client authorizes production launch

**Approval:** Client signs Gate L (Launch) approval and final milestone payment authorization

**Post-Launch:** 30-day hypercare period; retention payment released after hypercare completion

---

## SCHEDULE D — POST-WARRANTY MAINTENANCE AGREEMENT (OPTIONAL)

This optional Annual Maintenance Agreement may be purchased by Client after the Warranty Period expires.

### Term
Annual subscription, renewable yearly.

### Annual Fee
`[AMOUNT]` per year, payable annually in advance or in monthly installments of `[AMOUNT]` per month.

### Services Included

**1. Bug Fixes and Security Patches**
- Correction of defects in the System
- Security vulnerability patches
- Performance optimization fixes
- Browser and platform compatibility updates

**2. Minor Enhancements**
- Up to `[N]` hours per month of minor enhancements included
- Minor enhancements are changes that do not alter core functionality or data model
- Unused hours do not roll over to the next month

**3. Hosting Support and Monitoring**
- Assistance with hosting provider issues
- System performance monitoring
- Uptime monitoring (target: `[PERCENTAGE]`% uptime)
- Proactive issue identification

**4. Security Services**
- Annual security vulnerability scan
- Dependency updates for security patches
- Review of security logs upon request

**5. Backup and Restore**
- Quarterly backup restore test
- Backup verification and monitoring
- Assistance with restore in case of data loss

**6. Support Services**
- Email and phone support during business hours: `[HOURS, e.g., Monday-Friday 9:00 AM - 5:00 PM Philippine Time]`
- Response time SLA:
  - Critical issues: `[N]` hours
  - High issues: `[N]` Business Days
  - Medium issues: `[N]` Business Days
  - Low issues: Best effort
- Support ticket system access
- Remote assistance via screen sharing

**7. Updates and Improvements**
- Access to non-breaking feature updates
- Minor UI/UX improvements
- Report and dashboard enhancements

### Services Excluded
- Major feature development (requires separate quotation)
- Hardware procurement or replacement
- On-site visits (available for additional fee)
- Third-party service fees (hosting, SMS, email)
- Training for new staff (available for additional fee)
- Data recovery from client-side hardware failure
- Issues caused by unauthorized modifications

### Termination
Either party may terminate the Annual Maintenance Agreement with `[N]` days written notice. No refund of prepaid annual fees. Monthly subscriptions may be cancelled at end of current billing period.

### Renewal
Maintenance fees may be adjusted annually with `[N]` days advance notice.

---

## SCHEDULE E — SECURITY PLAN REFERENCE

The complete Security Plan is incorporated by reference from:  
**Document:** `docs/SECURITY-PLAN.md`

### Security Baseline Summary

The following security controls shall be implemented across all modules:

**1. Authentication and Access Control**
- Strong password requirements (minimum length, complexity)
- Password hashing using industry-standard algorithms (bcrypt, Argon2)
- Account lockout after failed login attempts
- Session timeout after inactivity
- Optional two-factor authentication (2FA)
- Role-based access control (RBAC) enforced at API level
- Field-level access control for sensitive data (cost, margin, salary)

**2. Data Protection**
- Encryption in transit: HTTPS/TLS 1.2 or higher for all connections
- Encryption at rest: Database encryption for sensitive tables
- Encrypted backups
- Secure credential storage (environment variables, vault, never in code)

**3. Input Validation and Output Encoding**
- Server-side validation of all user inputs
- Parameterized queries to prevent SQL injection
- Output encoding to prevent Cross-Site Scripting (XSS)
- CSRF token protection for state-changing operations
- File upload validation (type allowlist, size limits, virus scanning)

**4. Audit Logging**
- Append-only audit log for all security-relevant events
- Log: user ID, action, timestamp, IP address, correlation ID
- Audit logs retained for `[N]` months minimum
- Tamper-evident logging mechanism

**5. Application Security**
- Security headers (CSP, X-Frame-Options, X-Content-Type-Options)
- Rate limiting on authentication and API endpoints
- CORS policy enforcement
- Dependency vulnerability scanning in CI/CD pipeline
- Regular security updates for frameworks and libraries

**6. Payment and Financial Security**
- Idempotency for payment transactions
- Transaction signing and verification
- Replay attack protection
- Secure integration with payment gateways
- PCI DSS considerations for card handling (if applicable)

**7. Backup and Recovery**
- Automated daily backups (database and files)
- Encrypted backup storage
- Tested restore procedures (quarterly)
- Backup retention: `[N]` days rolling, plus monthly archives for `[N]` months

**8. Privacy and Compliance**
- Philippine Data Privacy Act (RA 10173) compliance
- Customer consent management
- Data retention and deletion policies
- Personal data access and rectification support
- Privacy-by-design principles

**9. Vulnerability Assessment (Phase 7)**
- Comprehensive security testing against OWASP Top 10
- Application Security Verification Standard (ASVS) Level 1 or 2
- Penetration testing (manual and automated)
- Findings report with severity ratings
- Remediation of all critical and high-severity findings before go-live

**10. Code Review and Development Practices**
- Second reviewer required for authentication, authorization, payment, inventory, file upload, and integration code
- Secrets scanning in version control
- No hardcoded credentials or API keys
- Security checklist per module before deployment

### Security Testing Requirements
Each module must include:
- Permission-based access tests (verify RBAC enforcement)
- Negative tests (invalid input, unauthorized access, wrong state)
- Money and inventory transaction tests (edge cases, concurrency, rounding)
- File upload security tests
- Integration security tests

### Security Responsibilities
**Developer:** Implement all security controls specified; conduct vulnerability assessment; remediate findings  
**Client:** Manage user credentials; maintain physical security; keep hosting services active; review audit logs post-launch

---

**END OF CONTRACT DRAFT**

This draft contract is ready for legal review and customization. All placeholder values marked with `[BRACKETS]` must be filled in before execution. This template should be reviewed by a Philippine lawyer before use.

