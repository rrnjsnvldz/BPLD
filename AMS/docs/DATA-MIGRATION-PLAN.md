# Data Migration Plan v1.0

**Project:** Autoshop Management System (AMS) — JRS Bongabon  
**Document Owner:** Accountant + Data Migration Lead  
**Status:** Draft for Gate 0 Approval  
**Last Updated:** 2026-11-10

---

## Document Control

This Data Migration Plan defines the process, sources, templates, procedures, and reconciliation steps for migrating JRS Bongabon's existing records into AMS before go-live.

**Execution Phase:** Phase 7 (parallel run period), 2–4 weeks before go-live  
**Sign-Off Required:** Accountant, Owner, Parts Clerk, HR, Advisor  
**Reference:** Master Plan §12, Build Order / Phase 7

---

## 1. Purpose and Scope

### 1.1 Purpose

Migrate JRS Bongabon autoshop's historical business data from paper records and spreadsheet-based systems into the new AMS platform to ensure:

- Operational continuity from day one of go-live
- Accurate opening financial balances for accounting and reporting
- Complete customer and vehicle history for service recommendations and reminders
- Reliable inventory records for parts availability and costing
- Valid employee and supplier data for payroll and purchasing

### 1.2 In Scope

The following data will be migrated into AMS:

- **Customers**: Names, contact details, classification (regular/VIP/fleet/blacklisted), consent preferences
- **Vehicles**: Plate numbers, make/model/year, vehicle details, customer links, last service summary
- **Service History**: Summary records (last service date, odometer, service type) to seed maintenance reminders — not full historical job card details unless data quality is high
- **Inventory Opening Stock**: Current stock on hand (confirmed by physical count), item master, categories, suppliers, pricing, reorder levels
- **Supplier Records**: Supplier names, contacts, payment terms, links to inventory items
- **Employee Records**: Personal details, employment status, pay rates, government ID numbers, bank accounts
- **Fixed Assets**: Shop equipment (lifts, compressors, tools, vehicles) with agreed book values
- **Accounts Receivable Opening Balances**: Outstanding customer credit balances with aging
- **Accounts Payable Opening Balances**: Outstanding supplier invoices with due dates
- **Opening Bank and Cash Balances**: Confirmed by bank statements and physical cash count as of cut-off date

### 1.3 Out of Scope

The following will **not** be migrated:

- Full historical transaction-level financial data (use opening balance approach instead)
- Detailed historical payroll records (import opening carry-forwards only: YTD earnings, deductions, leave balances)
- Voided or cancelled transactions from old systems
- Duplicate or low-quality data rejected during cleaning phase

### 1.4 Execution Timeline

- **Target Execution Window**: Phase 7, during parallel run period (2–4 weeks before go-live)
- **Physical Stock Count**: Within 2 weeks of go-live, on a shop-closed day (Sunday or holiday)
- **Cut-Off Date for Opening Balances**: Last day of the month immediately preceding go-live (agreed with accountant)
- **Final Data Sync**: All new transactions from parallel run entered into AMS before cutover

---

## 2. Data Sources

The following table documents all source data for the migration.

| Source ID | Source Type | Description | Format | Estimated Volume | Responsible Person |
|-----------|-------------|-------------|--------|------------------|--------------------|
| **SRC-01** | Paper Job Cards / Notebooks | Historical service records (job cards, service logs) | Handwritten paper | PENDING(Q-19) estimate | Workshop staff |
| **SRC-02** | Customer Contact List | Customer names, phone numbers, vehicles owned | Spreadsheet (Excel/Google Sheets) or paper notebook | PENDING(Q-19) estimate | Service Advisor |
| **SRC-03** | Parts Inventory Notebook / Spreadsheet | Current stock on hand, suppliers, cost/selling prices | Spreadsheet or paper ledger | PENDING(Q-19) estimate | Parts Clerk |
| **SRC-04** | Accounts Receivable Ledger | Credit customer balances outstanding | Spreadsheet or paper ledger | PENDING(Q-19) estimate | Cashier / Accountant |
| **SRC-05** | Accounts Payable / Supplier Ledger | Amounts owed to suppliers, unpaid invoices | Paper or spreadsheet | PENDING(Q-19) estimate | Parts Clerk / Accountant |
| **SRC-06** | Employee Records | Personal details, pay rates, government ID numbers (SSS, PhilHealth, Pag-IBIG, TIN), bank accounts | Paper HR file / spreadsheet | PENDING(Q-19) estimate | HR / Owner |
| **SRC-07** | Fixed Asset List | Shop equipment: lifts, compressors, tools, vehicles; book values | Paper list or spreadsheet | PENDING(Q-19) estimate | Owner / Accountant |
| **SRC-08** | Supplier Directory | Supplier names, contacts, payment terms | Paper / phone contacts | PENDING(Q-19) estimate | Parts Clerk |
| **SRC-09** | Service Price List | Standard labor rates and service prices | Paper menu / spreadsheet | PENDING(Q-19) estimate | Service Advisor |
| **SRC-10** | Opening Bank Balances | Current bank and cash balances as of cut-off date | Bank statements + cash count | Confirmed by bank statement | Accountant |

**Note:** `PENDING(Q-19)` — Estimated record volumes to be confirmed during Phase 0. Volume estimates inform resource allocation and import time planning.

---

## 3. Data Cleaning Rules

All source data must be cleaned and validated before import. The following rules apply to each data type.

### 3.1 Customer Records

**Normalization:**
- Phone numbers: Convert to Philippine standard format `+63XXXXXXXXXX` (with +63 prefix, 10 digits) or `09XXXXXXXXXX` (with 09 prefix, 10 digits after 0)
- Names: Title Case (e.g., "Juan Dela Cruz", not "JUAN DELA CRUZ" or "juan dela cruz")
- Email addresses: Lowercase, trim whitespace
- Strip leading and trailing whitespace from all text fields

**Deduplication:**
- Same phone number = same customer (merge records, keep most complete data)
- Same vehicle plate on multiple customer records = investigate and resolve manually; link vehicle to correct customer

**Classification:**
- **Fleet**: Customer has company name present or owns 3+ vehicles
- **VIP**: Flagged explicitly in source data, or historical spend exceeds threshold (define threshold with owner)
- **Regular**: Default classification
- **Blacklisted**: Flagged for non-payment or other issues (confirm with owner before importing)

**Required Fields:**
- `full_name` is **required**
- At least one of `phone_primary` or `email` must be present
- Missing required fields: flag record as REJECTED with reason

**Missing Optional Fields:**
- Use placeholder `[UNKNOWN]` for address or secondary contact if missing
- Flag record for follow-up data entry after go-live

**Consent:**
- If consent data is unavailable, default to `consent_sms = no`, `consent_email = no` (opt-in required by customer after go-live)

### 3.2 Vehicle Records

**Normalization:**
- Plate numbers: UPPERCASE, remove spaces and hyphens where format is clear (e.g., `ABC1234` or `ABC 123` → `ABC123`)
- Standardize make/model names using a reference list (e.g., "TOYOTA VIOS" not "Toy Vios" or "toyota vios")
- Year: 4-digit integer

**Validation:**
- **Required fields**: `plate_number`, `make`, `model`, `year`
- Missing required fields: flag record as REJECTED with reason
- Year range: Must be between 1950 and current year (inclusive)
- VIN (Vehicle Identification Number): Optional; include if available from OR/CR copies

**Customer Linkage:**
- Link vehicle to customer using phone number or customer name as matching key
- Unlinked vehicles: flag for manual review and assignment

### 3.3 Service History

**Import Strategy:**
- **If data quality is high** (clear plate, date, service type, costs): Import summary records for each vehicle's last 1–3 services
- **If data quality is poor** (missing plates, unclear dates, incomplete data): Import only the most recent service summary (last service date, last odometer reading) to seed maintenance reminders

**Extraction from Paper Job Cards:**
- Extract: service date, vehicle plate, service type, odometer reading, parts used, labor hours/cost, technician name, total cost
- Do NOT attempt to import full job card line-item details if handwriting is unclear or data is incomplete

**Validation:**
- **Required fields**: `vehicle_external_id` (must match a vehicle record), `service_date` (valid date), `service_type`
- **Costs**: Must be non-negative numbers (or zero if unknown)
- Missing plate or missing date: flag job card as REJECTED with reason

**Deduplication:**
- Duplicate job cards (same plate, same date, same service type): keep one, discard others with note in migration log

### 3.4 Inventory / Parts

**Required Fields:**
- `name`: Item name (required)
- `unit_of_measure`: pcs, L (liters), set, kg, box, etc. (required)
- `quantity_on_hand`: Non-negative number (integer for countable items, decimal for fluids/bulk) (required)

**Optional Fields (nice to have):**
- SKU / barcode
- Supplier link (`supplier_external_id`)
- Cost price and selling price (non-negative)
- Reorder level (non-negative)
- Storage location

**Category Assignment:**
- Assign category based on item name pattern:
  - Oil, engine oil, transmission fluid → **Lubricants**
  - Filter (oil filter, air filter, fuel filter, cabin filter) → **Filters**
  - Brake pad, brake shoe, rotor, drum → **Brake Parts**
  - Battery → **Electrical**
  - Tire, wheel → **Tires & Wheels**
  - Coolant, antifreeze, washer fluid → **Fluids**
  - Spark plug, ignition coil → **Ignition**
  - Belt, hose, gasket → **Engine Parts**
  - Other → **General / Miscellaneous**

**Zero-Quantity Items:**
- Items with `quantity_on_hand = 0`: Confirm with Parts Clerk whether to import as catalog-only items (available for ordering but not in stock) or exclude from migration

**Supplier Cross-Reference:**
- Link each item to its primary supplier (`supplier_external_id`) if supplier information is available

### 3.5 Employee Records

**Required Fields:**
- `full_name` (required)
- `position` (e.g., Technician, Service Advisor, Cashier, Parts Clerk) (required)
- `employment_type`: regular, probationary, contractual, part-time (required)
- `hire_date` (valid date) (required)
- `rate_type`: monthly, daily, hourly (required)
- `pay_rate`: Positive number (required)

**Government IDs (required for payroll compliance):**
- SSS number (Social Security System)
- PhilHealth number
- Pag-IBIG number
- TIN (Tax Identification Number)
- **Missing government IDs**: Flag record for follow-up; import employee but mark payroll as incomplete

**Bank Account (required for payroll bank transfer):**
- `bank_name`, `bank_account_number`
- **Missing bank account**: Flag for follow-up

**Contact Information:**
- Personal mobile number (recommended)
- Emergency contact name and phone (recommended)

**Active vs. Inactive Employees:**
- Import all employees (active and separated)
- Mark separated employees with `status = archived` and note separation date in `notes` field

### 3.6 Supplier Records

**Required Fields:**
- `name`: Supplier name (required)
- At least one of: `phone`, `email`, or `contact_person` (required)

**Optional Fields (nice to have):**
- Address
- Payment terms (e.g., "Net 30 days", "COD")
- Credit limit
- Lead time (days)

**Linkage:**
- Cross-reference supplier records with inventory items (§3.4)

### 3.7 Financial Opening Balances

**Cut-Off Date:**
- All opening balances must be as of a single, agreed-upon cut-off date (last day of the month before go-live)
- Accountant confirms and signs off on the cut-off date

**Accounts Receivable (AR):**
- List of customers with outstanding balances
- For each: `customer_external_id`, invoice reference, invoice date, original amount, amount paid to date, balance due
- **Aging buckets**: Classify each AR balance by age (current, 1–30 days, 31–60 days, 61–90 days, 90+ days overdue)
- AR total must agree with accountant-signed aging schedule

**Accounts Payable (AP):**
- List of suppliers with amounts owed
- For each: `supplier_external_id`, invoice reference, invoice date, original amount, amount paid to date, balance due, due date
- AP total must agree with unpaid supplier invoice total (confirmed by accountant)

**Bank Account Balances:**
- Confirmed by bank statement as of cut-off date
- Reconcile bank statement balance with internal cash book
- List outstanding checks and deposits in transit (if any)

**Cash on Hand:**
- Confirmed by physical count on cut-off date
- Count witnessed and signed by Cashier and Owner/Supervisor

**Inventory Value:**
- Confirmed by opening stock count (see §5)
- Total inventory value = sum of (quantity on hand × cost price) for all items

**Fixed Assets:**
- Agreed book values from asset register (provided by accountant)
- Net book value = cost − accumulated depreciation

**Trial Balance Validation:**
- Sum of all debit balances = sum of all credit balances
- Net assets (Bank + Cash + AR + Inventory + Fixed Assets − AP − Other Liabilities) must agree with owner's equity expectation

---

## 4. Import Templates

The following CSV templates are used for data import. All templates use **UTF-8 encoding** and **comma (`,`) as delimiter**. Text fields containing commas must be quoted.

### 4.1 Customer Import Template

**Filename:** `migration/customers.csv`

**Columns:**

| Column Name | Data Type | Required | Validation Rules | Example |
|-------------|-----------|----------|------------------|---------|
| `external_id` | Text | Yes | Unique identifier from source system | `CUST-001` |
| `full_name` | Text | Yes | Customer full name | `Juan Dela Cruz` |
| `phone_primary` | Text | Conditional* | Philippine phone format: +63XXXXXXXXXX or 09XXXXXXXXXX | `+639171234567` |
| `phone_secondary` | Text | No | Philippine phone format | `+639281234567` |
| `email` | Text | Conditional* | Valid email format | `juan.delacruz@example.com` |
| `address_street` | Text | No | Street address | `123 Main St, Brgy Centro` |
| `address_city` | Text | No | City/municipality | `Bongabon, Nueva Ecija` |
| `classification` | Text | Yes | Must be one of: `regular`, `vip`, `fleet`, `blacklisted` | `regular` |
| `credit_limit` | Decimal | No | Non-negative, in pesos | `5000.00` |
| `notes` | Text | No | Free text notes | `Referred by Maria Santos` |
| `consent_sms` | Text | Yes | `yes` or `no` | `no` |
| `consent_email` | Text | Yes | `yes` or `no` | `no` |

**\* Conditional:** At least one of `phone_primary` or `email` must be present.

---

### 4.2 Vehicle Import Template

**Filename:** `migration/vehicles.csv`

**Columns:**

| Column Name | Data Type | Required | Validation Rules | Example |
|-------------|-----------|----------|------------------|---------|
| `external_id` | Text | Yes | Unique identifier | `VEH-001` |
| `customer_external_id` | Text | Yes | Must match `customers.external_id` | `CUST-001` |
| `plate_number` | Text | Yes | Uppercase, unique | `ABC1234` |
| `make` | Text | Yes | Vehicle make | `TOYOTA` |
| `model` | Text | Yes | Vehicle model | `VIOS` |
| `year` | Integer | Yes | 1950 to current year | `2018` |
| `color` | Text | No | Vehicle color | `White` |
| `transmission` | Text | No | `manual` or `automatic` | `automatic` |
| `fuel_type` | Text | No | `gasoline`, `diesel`, `electric`, `hybrid` | `gasoline` |
| `engine_displacement` | Text | No | Engine size (e.g., 1.5L, 2.0L) | `1.5L` |
| `vin` | Text | No | Vehicle Identification Number (17 characters) | `JT2BF18K4X0123456` |
| `engine_number` | Text | No | Engine number | `2NR1234567` |
| `chassis_number` | Text | No | Chassis/frame number | `MHK4X123456` |
| `current_odometer` | Integer | No | Current odometer reading (km) | `45000` |
| `last_service_date` | Date | No | ISO 8601 format: YYYY-MM-DD | `2025-10-15` |
| `last_service_type` | Text | No | Type of last service | `PMS 40K` |
| `notes` | Text | No | Free text notes | `Customer reports A/C issue` |

---

### 4.3 Service History Summary Import Template

**Filename:** `migration/service_history.csv`

**Columns:**

| Column Name | Data Type | Required | Validation Rules | Example |
|-------------|-----------|----------|------------------|---------|
| `vehicle_external_id` | Text | Yes | Must match `vehicles.external_id` | `VEH-001` |
| `service_date` | Date | Yes | ISO 8601 format: YYYY-MM-DD | `2025-09-10` |
| `service_type` | Text | Yes | Service description | `PMS 40K` |
| `odometer_at_service` | Integer | No | Odometer reading at service (km) | `40000` |
| `technician_name` | Text | No | Technician who performed service | `Mario Reyes` |
| `description` | Text | No | Brief service description | `Oil change, filter replacement, brake inspection` |
| `labor_cost` | Decimal | No | Labor cost in pesos (non-negative) | `800.00` |
| `parts_cost` | Decimal | No | Parts cost in pesos (non-negative) | `1200.00` |
| `total_cost` | Decimal | No | Total cost in pesos (non-negative) | `2000.00` |
| `notes` | Text | No | Free text notes | `Customer satisfied, no complaints` |

---

### 4.4 Inventory Import Template

**Filename:** `migration/inventory.csv`

**Columns:**

| Column Name | Data Type | Required | Validation Rules | Example |
|-------------|-----------|----------|------------------|---------|
| `external_id` | Text | Yes | Unique identifier | `ITEM-001` |
| `sku` | Text | No | Stock Keeping Unit / barcode | `TOY-OIL-5W30-4L` |
| `name` | Text | Yes | Item name | `Toyota Genuine Motor Oil 5W-30 (4L)` |
| `category` | Text | No | Item category | `Lubricants` |
| `brand` | Text | No | Brand name | `Toyota Genuine Parts` |
| `unit_of_measure` | Text | Yes | `pcs`, `L`, `set`, `kg`, `box`, etc. | `pcs` |
| `quantity_on_hand` | Decimal | Yes | Non-negative; confirmed by stock count | `12` |
| `reorder_level` | Decimal | No | Non-negative | `5` |
| `cost_price` | Decimal | No | Cost per unit in pesos (non-negative) | `850.00` |
| `selling_price` | Decimal | No | Selling price per unit in pesos (non-negative) | `1100.00` |
| `supplier_external_id` | Text | No | Must match `suppliers.external_id` | `SUP-001` |
| `location` | Text | No | Storage location | `Shelf A3` |
| `barcode` | Text | No | Barcode number | `1234567890123` |
| `notes` | Text | No | Free text notes | `Fast-moving item, restock weekly` |

---

### 4.5 Employee Import Template

**Filename:** `migration/employees.csv`

**Columns:**

| Column Name | Data Type | Required | Validation Rules | Example |
|-------------|-----------|----------|------------------|---------|
| `external_id` | Text | Yes | Unique identifier | `EMP-001` |
| `full_name` | Text | Yes | Employee full name | `Mario Santos Reyes` |
| `position` | Text | Yes | Job title | `Technician` |
| `department` | Text | No | Department name | `Workshop` |
| `employment_type` | Text | Yes | `regular`, `probationary`, `contractual`, `part-time` | `regular` |
| `hire_date` | Date | Yes | ISO 8601 format: YYYY-MM-DD | `2020-03-15` |
| `rate_type` | Text | Yes | `monthly`, `daily`, `hourly` | `monthly` |
| `pay_rate` | Decimal | Yes | Positive number (salary or rate in pesos) | `18000.00` |
| `sss_number` | Text | No | SSS number (10 digits, format: XX-XXXXXXX-X) | `34-1234567-8` |
| `philhealth_number` | Text | No | PhilHealth number (12 digits, format: XX-XXXXXXXXX-X) | `12-345678901-2` |
| `pagibig_number` | Text | No | Pag-IBIG number (12 digits, format: XXXX-XXXX-XXXX) | `1234-5678-9012` |
| `tin` | Text | No | Tax Identification Number (9 or 12 digits, format: XXX-XXX-XXX or XXX-XXX-XXX-XXX) | `123-456-789` |
| `bank_name` | Text | No | Bank name for payroll | `BDO` |
| `bank_account_number` | Text | No | Bank account number | `001234567890` |
| `emergency_contact_name` | Text | No | Emergency contact full name | `Maria Reyes` |
| `emergency_contact_phone` | Text | No | Philippine phone format | `+639171234567` |
| `status` | Text | Yes | `active` or `archived` | `active` |

**Note:** Missing government IDs (`sss_number`, `philhealth_number`, `pagibig_number`, `tin`) or bank account should be flagged for follow-up but do not block import.

---

### 4.6 Supplier Import Template

**Filename:** `migration/suppliers.csv`

**Columns:**

| Column Name | Data Type | Required | Validation Rules | Example |
|-------------|-----------|----------|------------------|---------|
| `external_id` | Text | Yes | Unique identifier | `SUP-001` |
| `name` | Text | Yes | Supplier name | `Manila Auto Parts Supply` |
| `contact_person` | Text | No | Contact person name | `Pedro Gonzales` |
| `phone` | Text | No | Philippine phone format | `+639171234567` |
| `email` | Text | No | Valid email format | `sales@manilaparts.com` |
| `address` | Text | No | Supplier address | `456 Market St, Manila` |
| `payment_terms_days` | Integer | No | Payment terms in days (e.g., 30 for Net 30) | `30` |
| `credit_limit` | Decimal | No | Credit limit in pesos (non-negative) | `50000.00` |
| `notes` | Text | No | Free text notes | `Preferred supplier for Toyota parts` |

---

### 4.7 Opening Balance Import Template

**Filename:** `migration/opening_balances.csv`

**Purpose:** Import general ledger opening balances (for accounts not covered by AR, AP, inventory, or bank templates).

**Columns:**

| Column Name | Data Type | Required | Validation Rules | Example |
|-------------|-----------|----------|------------------|---------|
| `account_code` | Text | Yes | Chart of accounts code | `1600` |
| `account_name` | Text | Yes | Account name | `Fixed Assets - Equipment` |
| `debit_amount` | Decimal | No | Debit balance in pesos (non-negative or zero) | `150000.00` |
| `credit_amount` | Decimal | No | Credit balance in pesos (non-negative or zero) | `0.00` |
| `as_of_date` | Date | Yes | Cut-off date (ISO 8601: YYYY-MM-DD); must be consistent for all rows | `2026-11-30` |
| `notes` | Text | No | Free text notes | `Workshop lift and compressor` |

**Validation:** Total `debit_amount` must equal total `credit_amount` across all rows (trial balance must balance).

---

### 4.8 AR Opening Balance Template

**Filename:** `migration/ar_opening.csv`

**Columns:**

| Column Name | Data Type | Required | Validation Rules | Example |
|-------------|-----------|----------|------------------|---------|
| `customer_external_id` | Text | Yes | Must match `customers.external_id` | `CUST-005` |
| `invoice_reference` | Text | No | Original invoice number or reference | `INV-2025-123` |
| `invoice_date` | Date | No | ISO 8601 format: YYYY-MM-DD | `2025-10-15` |
| `original_amount` | Decimal | Yes | Original invoice amount in pesos | `8000.00` |
| `amount_paid` | Decimal | No | Amount paid to date in pesos | `3000.00` |
| `balance_due` | Decimal | Yes | Outstanding balance in pesos (non-negative) | `5000.00` |
| `aging_days` | Integer | No | Number of days overdue (current = 0, 1–30, 31–60, 61–90, 90+) | `45` |
| `notes` | Text | No | Free text notes | `Customer committed to pay end of month` |

**Validation:** `balance_due` should equal `original_amount - amount_paid`. Total `balance_due` must match accountant-signed AR aging total.

---

### 4.9 AP Opening Balance Template

**Filename:** `migration/ap_opening.csv`

**Columns:**

| Column Name | Data Type | Required | Validation Rules | Example |
|-------------|-----------|----------|------------------|---------|
| `supplier_external_id` | Text | Yes | Must match `suppliers.external_id` | `SUP-003` |
| `invoice_reference` | Text | No | Supplier invoice number or reference | `SI-2025-456` |
| `invoice_date` | Date | No | ISO 8601 format: YYYY-MM-DD | `2025-11-01` |
| `original_amount` | Decimal | Yes | Original invoice amount in pesos | `25000.00` |
| `amount_paid` | Decimal | No | Amount paid to date in pesos | `10000.00` |
| `balance_due` | Decimal | Yes | Outstanding balance in pesos (non-negative) | `15000.00` |
| `due_date` | Date | No | ISO 8601 format: YYYY-MM-DD | `2026-12-01` |
| `notes` | Text | No | Free text notes | `Payment scheduled for Dec 1` |

**Validation:** `balance_due` should equal `original_amount - amount_paid`. Total `balance_due` must match accountant-signed AP total.

---

## 5. Opening Stock Count Procedure

A physical inventory count is required to establish accurate opening stock quantities before go-live. This procedure ensures inventory accuracy and accountability.

### 5.1 Schedule

- **Timing**: Conduct the count on a shop-closed day (Sunday or holiday) within **2 weeks of go-live**
- **Duration**: Allow 4–8 hours depending on inventory size
- **Coordination**: Notify all staff in advance; ensure Parts Clerk, Supervisor, and at least 2 count team members are available

### 5.2 Preparation

1. **Print Blank Count Sheets**:
   - Generate count sheets listing all item names from the inventory import template (§4.4)
   - Include columns: Item Name, Location, Unit of Measure, Quantity Counted, Condition (Good / Damaged / Expired), Counter Initials, Checker Initials

2. **Assign Count Teams**:
   - Minimum **2 people per counting area**: one person counts, one person records
   - Assign areas: main parts shelf, warehouse, technician toolboxes, service vehicles, office storage

3. **Freeze Stock Movements**:
   - **No parts issuances or receipts during the count**
   - Lock storage areas if possible
   - Post signs: "Stock Count in Progress — Do Not Remove Items"

4. **Prepare Count Tools**:
   - Clipboards, pens, flashlights
   - Tape or labels to mark counted areas
   - Calculator for on-site spot checks

### 5.3 Count Execution

1. **Count Every Item**:
   - Count every item in every location (shelves, bins, warehouse, vehicles)
   - Record: item name, storage location, unit of measure, quantity counted, condition (good / damaged / expired / obsolete)

2. **Count Twice for High-Value Items**:
   - Items with value > ₱5,000 (or threshold set by owner) must be counted **at least twice** by independent counters
   - If counts differ, perform a **third count** to resolve the discrepancy

3. **Identify Unrecorded Items**:
   - Any item found in storage but not on the count sheet: record separately as "found item" with description, quantity, and location
   - Owner/Parts Clerk will decide whether to add to item master

4. **Damaged / Expired Items**:
   - Mark damaged or expired items separately
   - These items will be recorded with `quantity_on_hand = 0` in the import template, with a note in the `notes` column
   - Create an inventory adjustment record post-import to write off damaged stock

### 5.4 Data Entry

1. **Enter Counted Quantities**:
   - Transcribe counts from count sheets into the `migration/inventory.csv` template
   - Populate the `quantity_on_hand` column with counted quantities
   - For damaged items: set `quantity_on_hand = 0`, add note: `"Damaged, write-off required"`

2. **Double-Entry Verification**:
   - One person enters data, another person verifies entry against count sheets
   - Flag any discrepancies for re-check

### 5.5 Variance Review

1. **Compare Count to Existing Records**:
   - If a prior inventory spreadsheet exists, compare counted quantities to recorded quantities
   - Calculate variance: `Variance = Counted Quantity - Recorded Quantity`
   - Calculate variance value: `Variance Value = Variance × Cost Price`

2. **Approval Thresholds**:
   - Variances **greater than 10% quantity OR greater than ₱500 value** require **Supervisor and Owner approval** before proceeding with import
   - Document all variances and approvals in a "Stock Count Variance Report"

3. **Variance Investigation**:
   - For significant variances, Parts Clerk investigates possible causes: unrecorded issuances, theft, data entry errors, unit of measure mismatch

### 5.6 Sign-Off

Before importing inventory data, obtain the following sign-offs:

1. **Parts Clerk**: Signs count sheets, confirms all items counted and data entered accurately
2. **Owner / Supervisor**: Reviews variance report, approves variances, signs count summary
3. **Accountant**: Reviews total inventory value (sum of quantity × cost price), confirms amount is reasonable and matches expectations, signs off on opening inventory value before import

**Sign-Off Checklist:**

| Check Item | Responsible | Signature | Date |
|------------|-------------|-----------|------|
| Physical count completed for all items | Parts Clerk | | |
| Count sheets signed by counters | Count Team | | |
| Data entered and verified in CSV template | Parts Clerk | | |
| Variance report prepared and reviewed | Supervisor | | |
| Variances approved (if > threshold) | Owner | | |
| Total inventory value confirmed | Accountant | | |
| Opening stock count approved for import | Owner + Accountant | | |

---

## 6. Opening AR/AP Balance Procedure

Accurate opening accounts receivable (AR) and accounts payable (AP) balances are critical for financial integrity. This procedure ensures balances are confirmed, reconciled, and signed off before import.

### 6.1 Cut-Off Date

- Agree on a specific **cut-off date** with the accountant (e.g., **last day of the month immediately before go-live**: November 30, 2026 if go-live is December 2026)
- All opening balances will be stated **as of the cut-off date**
- All transactions after the cut-off date will be entered directly into AMS during the parallel run

### 6.2 Accounts Receivable (AR) Collection

1. **List All Outstanding Customer Balances**:
   - Review credit sales records, unpaid invoices, and customer ledger cards
   - For each customer with an outstanding balance, record:
     - Customer name (`customer_external_id`)
     - Invoice reference(s)
     - Invoice date(s)
     - Original invoice amount(s)
     - Amount(s) paid to date
     - **Balance due** as of cut-off date
     - **Aging**: Classify as current (0–30 days), 31–60 days, 61–90 days, or 90+ days overdue

2. **Prepare AR Aging Schedule**:
   - Summarize total AR by aging bucket
   - Format:

     | Customer Name | Current | 1–30 Days | 31–60 Days | 61–90 Days | 90+ Days | Total Balance |
     |---------------|---------|-----------|------------|------------|----------|---------------|
     | Customer A | ₱2,000 | ₱0 | ₱0 | ₱0 | ₱0 | ₱2,000 |
     | Customer B | ₱0 | ₱3,500 | ₱1,000 | ₱0 | ₱0 | ₱4,500 |
     | Customer C | ₱0 | ₱0 | ₱0 | ₱5,000 | ₱2,000 | ₱7,000 |
     | **TOTAL** | **₱2,000** | **₱3,500** | **₱1,000** | **₱5,000** | **₱2,000** | **₱13,500** |

3. **Confirm with Cashier / Service Advisor**:
   - Cross-check AR list against cashier records and service advisor notes
   - Resolve discrepancies before proceeding

### 6.3 Accounts Payable (AP) Collection

1. **List All Unpaid Supplier Invoices**:
   - Review supplier invoices, purchase orders, and payment records
   - For each unpaid invoice, record:
     - Supplier name (`supplier_external_id`)
     - Invoice reference
     - Invoice date
     - Original invoice amount
     - Amount paid to date
     - **Balance due** as of cut-off date
     - **Due date** (if stated on invoice)

2. **Prepare AP Summary**:
   - Summarize total AP by supplier
   - Format:

     | Supplier Name | Invoice Ref | Invoice Date | Original Amount | Amount Paid | Balance Due | Due Date |
     |---------------|-------------|--------------|-----------------|-------------|-------------|----------|
     | Supplier X | SI-123 | 2026-10-15 | ₱10,000 | ₱5,000 | ₱5,000 | 2026-12-15 |
     | Supplier Y | SI-456 | 2026-11-01 | ₱25,000 | ₱10,000 | ₱15,000 | 2026-12-01 |
     | **TOTAL** | | | **₱35,000** | **₱15,000** | **₱20,000** | |

3. **Confirm with Parts Clerk / Accountant**:
   - Cross-check AP list against supplier statements and payment vouchers
   - Resolve discrepancies before proceeding

### 6.4 Bank Reconciliation

1. **Obtain Bank Statements**:
   - Request bank statements for all shop bank accounts **as of the cut-off date**
   - Record bank statement balance for each account

2. **Reconcile Bank Statement to Cash Book**:
   - Compare bank statement balance to internal cash book balance
   - Identify and list:
     - **Outstanding checks**: Checks issued but not yet cleared by the bank
     - **Deposits in transit**: Deposits made but not yet reflected in the bank statement
     - **Bank fees or interest** not yet recorded in the cash book

3. **Calculate Reconciled Balance**:
   - Reconciled balance = Bank statement balance + Deposits in transit − Outstanding checks
   - Reconciled balance should match the cash book balance (adjusted for any unrecorded bank fees/interest)

4. **Cash on Hand Count**:
   - Conduct a **physical cash count** on the cut-off date (or as close as possible)
   - Count witnessed by Cashier and Owner/Supervisor
   - Record total cash on hand (bills and coins)

### 6.5 Validation

Before importing opening balances, validate the following:

1. **AR Total Matches Aging Schedule**:
   - Sum of all `balance_due` in `migration/ar_opening.csv` must equal the total on the AR aging schedule signed by the accountant

2. **AP Total Matches Supplier Invoice Total**:
   - Sum of all `balance_due` in `migration/ap_opening.csv` must equal the total on the AP summary signed by the accountant

3. **Net Assets Reconciliation**:
   - Calculate: **Net Assets = (Bank + Cash + AR + Inventory Value + Fixed Assets) − (AP + Other Liabilities)**
   - Compare net assets to owner's equity expectation (prior period balance sheet, if available)
   - Large discrepancies require investigation and resolution before import

4. **Trial Balance**:
   - Sum of all debit balances = sum of all credit balances in `migration/opening_balances.csv`
   - If debits ≠ credits, identify and correct the error before proceeding

### 6.6 Sign-Off

Obtain the following sign-offs before importing opening balances:

| Check Item | Responsible | Signature | Date |
|------------|-------------|-----------|------|
| AR aging schedule prepared and confirmed | Cashier / Advisor | | |
| AR total agrees with accountant records | Accountant | | |
| AP summary prepared and confirmed | Parts Clerk | | |
| AP total agrees with accountant records | Accountant | | |
| Bank statements obtained and reconciled | Accountant | | |
| Outstanding checks and deposits in transit listed | Accountant | | |
| Cash on hand counted and confirmed | Cashier + Owner | | |
| Net assets reconciliation reviewed | Accountant + Owner | | |
| Trial balance validated (debits = credits) | Accountant | | |
| Opening balances approved for import | Owner + Accountant | | |

---

## 7. Import and Reconciliation Procedure

This section defines the step-by-step process for importing cleaned data into AMS and reconciling imported data to source records.

### 7.1 Preparation

1. **Spin Up Migration Staging Environment**:
   - Create a **staging environment** (copy of production database schema)
   - This environment is dedicated to migration testing; it will NOT be used for live operations
   - Purpose: Test import scripts, validate data, and identify errors without affecting production

2. **Populate All CSV Import Templates**:
   - Use cleaned and validated data from source systems (§3)
   - Follow import template specifications (§4)
   - Save all CSV files in a `migration/` directory

3. **Run Validation Scripts**:
   - Before importing, run validation scripts against each CSV file to check:
     - **Required fields**: All required columns are present and not empty
     - **Data types**: Dates are valid dates, numbers are valid numbers, etc.
     - **Formats**: Phone numbers, emails, government IDs follow expected formats
     - **Referential integrity**: Foreign keys (e.g., `customer_external_id` in vehicles) match existing records
     - **Business rules**: No negative quantities, no invalid status codes, no duplicate primary keys
   - **Fix all validation errors** before proceeding to import

4. **Dry Run**:
   - Perform a **dry-run import** in the staging environment
   - Review imported data for accuracy and completeness
   - If errors are found, correct source CSVs and repeat dry run

### 7.2 Import Sequence

**IMPORTANT:** Import data in the following order due to **foreign key dependencies**. Do NOT skip or reorder steps.

| Step | Data Type | Source Template | Dependency | Notes |
|------|-----------|-----------------|------------|-------|
| **1** | Suppliers | `migration/suppliers.csv` | None | Import first; items and AP link to suppliers |
| **2** | Employees | `migration/employees.csv` | None | Import early; service history may reference technicians |
| **3** | Service Catalog / Price List | `migration/service_catalog.csv` (if exists) | None | Import standard service types and labor rates |
| **4** | Customers | `migration/customers.csv` | None | Import before vehicles; vehicles link to customers |
| **5** | Vehicles | `migration/vehicles.csv` | Customers (step 4) | Each vehicle links to a customer |
| **6** | Service History Summaries | `migration/service_history.csv` | Vehicles (step 5) | Optional; seed maintenance reminders |
| **7** | Inventory Items and Opening Stock | `migration/inventory.csv` | Suppliers (step 1) | Confirmed by opening stock count (§5) |
| **8** | Fixed Assets | `migration/opening_balances.csv` or separate template | None | Import asset book values |
| **9** | Opening Financial Balances | `migration/opening_balances.csv`, `migration/ar_opening.csv`, `migration/ap_opening.csv` | Customers, Suppliers, Accountant sign-off | Import AFTER all master data (customers, suppliers, inventory) are imported |

### 7.3 Reconciliation Checks

**After each import step**, run the following reconciliation queries to verify data integrity:

#### Step 1–3: Suppliers, Employees, Service Catalog
- **Supplier count**: `SELECT COUNT(*) FROM suppliers;` → Compare to CSV row count
- **Employee count**: `SELECT COUNT(*) FROM employees;` → Compare to CSV row count
- **Service catalog count**: `SELECT COUNT(*) FROM service_catalog_items;` → Compare to CSV row count

#### Step 4: Customers
- **Customer count**: `SELECT COUNT(*) FROM customers;` → Compare to CSV row count
- **Phone number uniqueness**: `SELECT phone_primary, COUNT(*) FROM customers GROUP BY phone_primary HAVING COUNT(*) > 1;` → Should return zero rows (no duplicate phones)

#### Step 5: Vehicles
- **Vehicle count**: `SELECT COUNT(*) FROM vehicles;` → Compare to CSV row count
- **Plate number uniqueness**: `SELECT plate_number, COUNT(*) FROM vehicles GROUP BY plate_number HAVING COUNT(*) > 1;` → Should return zero rows (no duplicate plates)
- **Orphaned vehicles** (no customer link): `SELECT COUNT(*) FROM vehicles WHERE customer_id IS NULL;` → Should return zero (all vehicles linked to customers)

#### Step 6: Service History
- **Service history count**: `SELECT COUNT(*) FROM service_history;` → Compare to CSV row count
- **Orphaned service records**: `SELECT COUNT(*) FROM service_history WHERE vehicle_id IS NULL;` → Should return zero (all service records linked to vehicles)

#### Step 7: Inventory
- **Item count**: `SELECT COUNT(*) FROM inventory_items;` → Compare to CSV row count
- **Inventory value**: `SELECT SUM(quantity_on_hand * cost_price) AS total_inventory_value FROM inventory_items;` → Compare to **accountant-signed opening inventory value** from §5.6
  - **Tolerance**: ± ₱100 for rounding differences
  - If variance > ₱100, investigate and resolve before proceeding
- **Negative quantities**: `SELECT COUNT(*) FROM inventory_items WHERE quantity_on_hand < 0;` → Should return zero (no negative stock)

#### Step 8: Fixed Assets
- **Fixed asset count**: `SELECT COUNT(*) FROM fixed_assets;` → Compare to asset list
- **Total fixed asset value**: `SELECT SUM(book_value) FROM fixed_assets;` → Compare to accountant-provided total

#### Step 9: Opening Financial Balances

**Accounts Receivable:**
- **AR total**: `SELECT SUM(balance_due) AS total_ar FROM ar_opening_balances;` → Compare to **accountant-signed AR aging total** from §6.6
  - Variance must be **zero** (or explained and approved by accountant)

**Accounts Payable:**
- **AP total**: `SELECT SUM(balance_due) AS total_ap FROM ap_opening_balances;` → Compare to **accountant-signed AP total** from §6.6
  - Variance must be **zero** (or explained and approved by accountant)

**Bank Balances:**
- **Bank balance per account**: `SELECT account_name, balance FROM bank_accounts;` → Compare to **bank statement balances** from §6.4
  - Variance must be **zero** (or reconciled and approved by accountant)

**Trial Balance:**
- **Debits = Credits**: `SELECT SUM(debit_amount) AS total_debits, SUM(credit_amount) AS total_credits FROM opening_balances;`
  - `total_debits` must equal `total_credits`
  - If not balanced, identify and correct the error

**Reconciliation Sign-Off:**

| Reconciliation Check | Expected Result | Actual Result | Variance | Approved By | Date |
|----------------------|-----------------|---------------|----------|-------------|------|
| Customer count matches CSV | | | | | |
| Vehicle count matches CSV | | | | | |
| All vehicles linked to customers | Zero orphaned vehicles | | | | |
| Inventory count matches CSV | | | | | |
| Inventory value matches signed count | ± ₱100 | | | Accountant | |
| AR total matches aging schedule | Zero variance | | | Accountant | |
| AP total matches supplier invoice total | Zero variance | | | Accountant | |
| Bank balances match statements | Zero variance | | | Accountant | |
| Trial balance: debits = credits | Balanced | | | Accountant | |

### 7.4 Parallel Run

After successful import and reconciliation in the staging environment, proceed to the **parallel run** phase:

1. **Duration**: 2–4 weeks (agreed with owner and accountant)

2. **Dual System Operation**:
   - Continue using **existing paper/spreadsheet system** alongside **AMS**
   - All new transactions (service orders, sales, payments, purchases, stock movements) are entered in **both systems**

3. **Weekly Reconciliation**:
   - At the end of each week, compare totals between the two systems:
     - **Sales revenue**: AMS vs. manual records
     - **Accounts receivable balance**: AMS vs. manual records
     - **Inventory movements**: AMS vs. manual records (receipts and issuances)
     - **Cash and bank balances**: AMS vs. manual records

4. **Discrepancy Resolution**:
   - Investigate and resolve any discrepancies within 48 hours
   - Document root cause (e.g., data entry error, missing transaction, system bug)
   - Correct data in AMS and/or manual system as appropriate
   - If system bugs are found, log as defects and prioritize fixes

5. **Parallel Run Success Criteria**:
   - **Zero unresolved discrepancies** for at least 1 week before cutover
   - **Staff confidence**: All users comfortable with AMS workflows
   - **Accountant sign-off**: Accountant confirms AMS financial data is accurate and reliable

### 7.5 Cutover

When parallel run success criteria are met, proceed to **final cutover**:

1. **Final Data Sync**:
   - Enter any new transactions from the manual system (created during the final parallel run period) into AMS
   - Verify all transactions are accounted for

2. **Freeze Manual System**:
   - Stop entering new transactions into the paper/spreadsheet system
   - Archive paper records and spreadsheets for reference

3. **Final Reconciliation Sign-Off**:
   - Perform one final reconciliation of AMS totals vs. manual system totals
   - Accountant and Owner review and sign off

4. **Go-Live Authorization**:
   - Owner authorizes go-live per **Gate L checklist** (Master Plan §14)
   - Announce go-live date to all staff

5. **Post-Cutover Monitoring**:
   - Monitor AMS closely for the first week post-go-live
   - Provide **hypercare support**: respond to user questions and issues within 2 hours
   - Log and track any post-go-live issues; prioritize and resolve

---

## 8. Sign-Off Checklist

The following checklist must be completed and signed before go-live. All sign-offs are **mandatory**.

| Check Item | Responsible | Sign-Off | Date |
|------------|-------------|----------|---------|
| **1. Customer and Vehicle Data** | | | |
| All customer records imported and validated | Service Advisor / Admin | | |
| All vehicle records linked to customers (no orphaned vehicles) | Service Advisor / Admin | | |
| Customer count reconciled to source data | Admin | | |
| **2. Inventory Data** | | | |
| Opening stock count completed and signed (§5.6) | Parts Clerk + Owner | | |
| Inventory import reconciled to signed count (value ± ₱100) | Accountant | | |
| All inventory items linked to suppliers (where applicable) | Parts Clerk | | |
| No negative stock quantities | Parts Clerk | | |
| **3. Employee Data** | | | |
| All employee records imported | HR / Owner | | |
| Payroll details verified (pay rates, government IDs, bank accounts) | HR | | |
| Missing government IDs or bank accounts flagged for follow-up | HR | | |
| **4. Financial Opening Balances** | | | |
| Opening AR balances match accountant-signed aging schedule | Accountant + Owner | | |
| Opening AP balances match accountant-signed supplier invoice total | Accountant + Owner | | |
| Opening bank balances match bank statements | Accountant | | |
| Cash on hand balance confirmed by physical count | Cashier + Owner | | |
| Opening balance trial balance: debits = credits | Accountant | | |
| Net assets reconciliation reviewed and approved | Accountant + Owner | | |
| **5. Supplier and Service Catalog** | | | |
| Supplier records imported and linked to inventory | Parts Clerk | | |
| Service catalog / price list imported and verified | Service Advisor | | |
| **6. Service History** | | | |
| Service history summaries imported for key customers (if applicable) | Service Advisor | | |
| Service history count reconciled to source data | Service Advisor | | |
| **7. Parallel Run** | | | |
| Parallel run completed (2–4 weeks minimum) | Owner | | |
| Weekly reconciliations completed with zero unresolved discrepancies | Accountant + Owner | | |
| Staff trained and comfortable with AMS workflows | HR / Admin | | |
| **8. Final Reconciliation** | | | |
| Final data sync: all parallel run transactions entered into AMS | Admin | | |
| Final reconciliation: AMS totals = manual totals | Accountant + Owner | | |
| Manual system frozen and archived | Admin | | |
| **9. Go-Live Approval** | | | |
| Data migration sign-off: proceed to go-live | Owner | | |

---

## 9. Risks and Mitigations

The following table identifies data migration risks, their likelihood and impact, and proposed mitigation strategies.

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Poor data quality in paper records** (missing plates, illegible handwriting, incomplete service details) | High | High | Apply strict data cleaning rules (§3); owner confirms key records manually; reject records that fail validation; prioritize recent and high-value data |
| **Missing customer-vehicle links** (vehicle plate found but no customer name, or mismatched records) | High | Medium | Match by phone number or plate; use advisor knowledge to link manually; flag unlinked vehicles for manual review and follow-up; accept that some historical data may be incomplete |
| **Inaccurate opening stock count** (miscounts, unrecorded items, theft during count) | Medium | High | Use two-person count teams; count high-value items twice; supervisor spot-checks; freeze stock movements during count; accountant reviews total value before import |
| **AR/AP discrepancies** (customer disputes balance, missing supplier invoice, unrecorded payment) | Medium | High | Accountant reconciles AR/AP before import; confirm balances with key customers and suppliers; parallel run catches discrepancies early; allow 2–4 weeks to resolve |
| **Import script errors** (data type mismatches, foreign key violations, duplicate key errors) | Low | High | Test on staging environment first; dry-run with validation scripts; fix errors before live import; have rollback plan (restore from backup) |
| **Staff unavailable for counting / data entry** (illness, scheduling conflict, lack of commitment) | Medium | Medium | Schedule well in advance; confirm staff availability 1 week before count; owner assigns backups; consider hiring temporary help if needed |
| **Cut-off date misalignment** (transactions recorded in wrong period, bank statement date mismatch) | Medium | Medium | Agree cut-off date early with accountant; communicate clearly to all staff; freeze transactions after cut-off; accountant reviews all opening balance dates before import |
| **Inventory shrinkage or theft revealed by stock count** (large variances raise suspicion) | Low | High | Treat as separate issue from migration; investigate variances per §5.5; owner decides disciplinary action separately; proceed with import using counted quantities (actual) |
| **Data loss during migration** (file corruption, accidental deletion, system crash) | Low | Critical | Backup all source CSV files before import; backup staging database before each import step; version control for import scripts; test restore procedure |
| **Parallel run reveals systemic data entry errors** (e.g., wrong tax calculation, wrong costing method) | Medium | High | Weekly reconciliations during parallel run catch errors early; fix root cause (system bug or user training); extend parallel run if needed to rebuild confidence |

---

## 10. Appendices

### Appendix A: Data Source Inventory Checklist

Use this checklist during Phase 0 to locate and assess all data sources.

| Source ID | Source Description | Location | Format | Owner / Contact | Estimated Volume | Quality Assessment | Notes |
|-----------|-------------------|----------|--------|-----------------|------------------|-------------------|-------|
| SRC-01 | Paper job cards | Workshop file cabinet | Handwritten paper | Workshop staff | PENDING | PENDING | Need to review sample |
| SRC-02 | Customer contact list | Front desk notebook / Excel file | Spreadsheet or paper | Service Advisor | PENDING | PENDING | Check for duplicates |
| SRC-03 | Parts inventory notebook | Parts counter | Spreadsheet or paper | Parts Clerk | PENDING | PENDING | Verify currency |
| SRC-04 | AR ledger | Cashier desk / accounting file | Spreadsheet or paper | Cashier / Accountant | PENDING | PENDING | Reconcile with invoices |
| SRC-05 | AP ledger | Parts counter / accounting file | Paper or spreadsheet | Parts Clerk / Accountant | PENDING | PENDING | Cross-check supplier statements |
| SRC-06 | Employee records | Office HR file | Paper HR file / spreadsheet | Owner / HR | PENDING | PENDING | Verify government IDs |
| SRC-07 | Fixed asset list | Accounting records | Paper list or spreadsheet | Owner / Accountant | PENDING | PENDING | Confirm book values |
| SRC-08 | Supplier directory | Parts counter contacts | Paper / phone contacts | Parts Clerk | PENDING | PENDING | Update contact info |
| SRC-09 | Service price list | Front desk reference | Paper menu / spreadsheet | Service Advisor | PENDING | PENDING | Confirm current pricing |
| SRC-10 | Bank statements | Accounting file | Bank statements | Accountant | Current month | Good | Request as of cut-off date |

### Appendix B: Migration Roles and Responsibilities

| Role | Responsibilities |
|------|-----------------|
| **Owner** | Final approval for all migration decisions; resolve escalated issues; sign off on opening balances; authorize go-live |
| **Accountant** | Prepare and sign AR aging schedule, AP summary, bank reconciliation, opening balances; validate trial balance; weekly parallel run reconciliation |
| **Data Migration Lead** | Overall migration coordination; prepare CSV templates; run validation and import scripts; reconciliation checks; issue tracking |
| **Service Advisor** | Provide customer and vehicle source data; clean customer records; assist with service history extraction; verify imported customer/vehicle data |
| **Parts Clerk** | Conduct opening stock count; provide inventory and supplier source data; clean inventory records; verify imported inventory and supplier data |
| **Cashier** | Provide AR opening balances; conduct cash count on cut-off date; assist with AR reconciliation |
| **HR / Payroll Officer** | Provide employee records; verify government IDs and bank accounts; flag missing payroll data |
| **Workshop Staff** | Assist with service history extraction from job cards; participate in opening stock count |
| **Admin / System Administrator** | Set up migration staging environment; manage database backups; support import script execution |

### Appendix C: Import Validation Script Checklist

Before importing each CSV file, run these validation checks (automated script recommended):

**General Checks (all templates):**
- [ ] File is UTF-8 encoded
- [ ] File uses comma (`,`) as delimiter
- [ ] Header row is present and matches template specification
- [ ] No empty rows (except final blank line)
- [ ] All required columns are present
- [ ] No leading or trailing whitespace in column headers

**Data Type Checks:**
- [ ] Date columns: ISO 8601 format `YYYY-MM-DD`, valid dates only
- [ ] Decimal columns: Valid numbers, no text, correct decimal separator
- [ ] Integer columns: Valid integers, no decimals or text
- [ ] Text columns: Within length limits (if defined)

**Business Rule Checks:**
- [ ] Required fields: No empty values
- [ ] Phone numbers: Philippine format (`+63XXXXXXXXXX` or `09XXXXXXXXXX`)
- [ ] Email addresses: Valid email format (`user@domain.com`)
- [ ] Enumerations: Values match allowed list (e.g., `classification` in customers)
- [ ] Foreign keys: Referenced records exist (e.g., `customer_external_id` in vehicles matches a customer)
- [ ] Unique constraints: No duplicate `external_id` values
- [ ] Non-negative constraints: Quantities, prices, balances ≥ 0
- [ ] Trial balance (opening_balances.csv): Sum of debits = sum of credits
- [ ] AR/AP balance calculations: `balance_due = original_amount - amount_paid`

### Appendix D: Migration Log Template

Track all migration activities in a migration log:

| Date | Activity | Performed By | Status | Issues / Notes | Sign-Off |
|------|----------|--------------|--------|----------------|----------|
| 2026-11-15 | Identified data sources | Data Migration Lead | Complete | All sources located except SRC-01 (job cards) | Owner |
| 2026-11-20 | Prepared customer CSV template | Service Advisor | Complete | 150 customer records entered | DML |
| 2026-11-22 | Validated customer CSV | Data Migration Lead | Complete | 3 validation errors fixed | DML |
| 2026-11-25 | Imported customers to staging | Admin | Complete | 150 customers imported, zero errors | Admin |
| ... | ... | ... | ... | ... | ... |

### Appendix E: Glossary of Migration Terms

| Term | Definition |
|------|------------|
| **Cut-Off Date** | The specific date (last day of a month) as of which all opening balances are stated; transactions after this date are entered directly into AMS |
| **Opening Balance** | The starting balance of an account (AR, AP, bank, inventory, fixed assets) imported into AMS at go-live |
| **Parallel Run** | The period (2–4 weeks) during which the shop operates both the old manual system and AMS simultaneously to validate data accuracy |
| **Reconciliation** | The process of comparing AMS data to source data (or AMS totals to manual system totals) to verify accuracy |
| **Staging Environment** | A test copy of the production database used for migration testing; not used for live operations |
| **Dry Run** | A test import performed on the staging environment to identify errors before importing to production |
| **Variance** | The difference between counted quantity (or balance) and recorded quantity (or balance) |
| **External ID** | A unique identifier from the source system (e.g., `CUST-001`) used to track records during migration and link related data |
| **Trial Balance** | A financial report showing that total debits equal total credits; used to validate opening balances |
| **Aging Schedule** | A report classifying AR balances by how many days overdue they are (current, 1–30, 31–60, 61–90, 90+ days) |

---

## Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Owner / General Manager** | | | |
| **Accountant** | | | |
| **Data Migration Lead** | | | |

**Approval Status:** PENDING (Draft for Gate 0)

---

**End of Document**
