# PAYE Tax Calculation Guide

## 📊 Overview

This guide explains how PAYE (Pay As You Earn) tax is calculated in Ghana, including all the complex rules for different employment types, residency statuses, and income components.

---

## 🏗️ Implementation

I've added all necessary fields to the employee table and created a comprehensive PAYE calculation utility.

### Employee Table Fields Added

```sql
-- Employment & Residency
employment_type TEXT DEFAULT 'Full-Time'  -- Full-Time, Part-Time, Casual
residency_status TEXT DEFAULT 'Resident-Full-Time'

-- Secondary Employment
secondary_employment INTEGER DEFAULT 0  -- 0 = No, 1 = Yes
secondary_employment_rate REAL DEFAULT 0  -- 5, 10, 17.5, 25, 30

-- SSNIT
paid_ssnit INTEGER DEFAULT 1  -- 0 = No, 1 = Yes

-- Allowances & Benefits
cash_allowances REAL DEFAULT 0
bonus_income REAL DEFAULT 0
accommodation_element REAL DEFAULT 0
vehicle_element REAL DEFAULT 0
non_cash_benefit REAL DEFAULT 0

-- Overtime & Reliefs
overtime_income REAL DEFAULT 0
deductible_reliefs REAL DEFAULT 0
```

---

## 📐 PAYE Calculation Formula

### Step 1: Calculate Bonus Tax

**Bonus Limit:** Up to 15% of Annual Basic Salary
```
Bonus Limit = Annual Basic Salary × 15%
Taxable Bonus = MIN(Bonus Income, Bonus Limit)
Final Tax on Bonus = Taxable Bonus × 5%
Excess Bonus = MAX(0, Bonus Income - Bonus Limit)
```

### Step 2: Calculate Total Cash Emolument
```
Total Cash Emolument = Basic Salary + Cash Allowances + Excess Bonus
```

### Step 3: Calculate Total Assessable Income
```
Total Assessable Income = Total Cash Emolument 
                        + Accommodation Element
                        + Vehicle Element
                        + Non-Cash Benefits
```

### Step 4: Calculate Total Reliefs
```
Total Reliefs = SSNIT Employee Contribution (5.5%)
              + Tier 3 Contribution
              + Deductible Reliefs
```

### Step 5: Calculate Chargeable Income
```
Chargeable Income = Total Assessable Income - Total Reliefs
```

### Step 6: Calculate Tax Based on Residency/Employment Type

---

## 🎯 Tax Rates by Status

### 1. Resident - Full-Time (Progressive Rates)

**Monthly Tax Brackets (2024):**

| Monthly Income Range | Tax Rate |
|---------------------|----------|
| 0 - GH₵ 490 | 0% |
| GH₵ 490 - GH₵ 600 (next GH₵ 110) | 5% |
| GH₵ 600 - GH₵ 730 (next GH₵ 130) | 10% |
| GH₵ 730 - GH₵ 3,896.67 (next GH₵ 3,166.67) | 17.5% |
| GH₵ 3,896.67 - GH₵ 19,896.67 (next GH₵ 16,000) | 25% |
| GH₵ 19,896.67 - GH₵ 50,416.67 (next GH₵ 30,520) | 30% |
| Above GH₵ 50,416.67 | 35% |

**Example:**
```
Monthly Income: GH₵ 5,000
Tax Calculation:
- First GH₵ 490: GH₵ 0 (0%)
- Next GH₵ 110: GH₵ 5.50 (5%)
- Next GH₵ 130: GH₵ 13.00 (10%)
- Next GH₵ 3,166.67: GH₵ 554.17 (17.5%)
- Next GH₵ 1,103.33: GH₵ 275.83 (25%)
Total Tax: GH₵ 848.50
```

### 2. Resident - Part-Time
**Flat Rate:** 10% of Chargeable Income

### 3. Resident - Casual
**Flat Rate:** 5% of Chargeable Income

### 4. Non-Resident
**Flat Rate:** 25% of Chargeable Income

### 5. Secondary Employment

Secondary employment tax applies when an employee has another primary job:

| Secondary Rate | Tax Rate |
|----------------|----------|
| Secondary @ 5% | 5% |
| Secondary @ 10% | 10% |
| Secondary @ 17.5% | 17.5% |
| Secondary @ 25% | 25% |
| Secondary @ 30% | 30% |

**Condition:** Only applies if `Paid SSNIT = Yes`

---

## 🔢 Overtime Tax

Overtime is typically taxed at:
- **Resident:** 5% flat
- **Non-Resident:** 25% flat
- **Part-Time:** 10% flat
- **Casual:** 5% flat

---

## 💼 Complete Calculation Example

### Scenario: Full-Time Resident Employee

**Input:**
```
Basic Salary: GH₵ 5,000
Residency Status: Resident-Full-Time
Employment Type: Full-Time
Paid SSNIT: Yes
SSNIT Contribution (5.5%): GH₵ 275
Tier 3 Contribution: GH₵ 250
Cash Allowances: GH₵ 1,000
Bonus Income: GH₵ 0
Accommodation Element: GH₵ 0
Vehicle Element: GH₵ 0
Non-Cash Benefit: GH₵ 0
Overtime Income: GH₵ 500
Deductible Reliefs: GH₵ 0
Annual Basic Salary: GH₵ 60,000
```

**Calculation:**

1. **Bonus Tax:**
   - Bonus Limit: GH₵ 60,000 × 15% = GH₵ 9,000
   - Taxable Bonus: GH₵ 0
   - Tax on Bonus: GH₵ 0
   - Excess Bonus: GH₵ 0

2. **Total Cash Emolument:**
   - GH₵ 5,000 + GH₵ 1,000 + GH₵ 0 = GH₵ 6,000

3. **Total Assessable Income:**
   - GH₵ 6,000 + GH₵ 0 + GH₵ 0 + GH₵ 0 = GH₵ 6,000

4. **Total Reliefs:**
   - GH₵ 275 + GH₵ 250 + GH₵ 0 = GH₵ 525

5. **Chargeable Income:**
   - GH₵ 6,000 - GH₵ 525 = GH₵ 5,475

6. **Tax on Chargeable Income** (Progressive):
   - First GH₵ 490: GH₵ 0
   - Next GH₵ 110: GH₵ 5.50
   - Next GH₵ 130: GH₵ 13.00
   - Next GH₵ 3,166.67: GH₵ 554.17
   - Next GH₵ 1,578.33: GH₵ 394.58
   - **Subtotal: GH₵ 967.25**

7. **Overtime Tax:**
   - GH₵ 500 × 5% = GH₵ 25.00

8. **Total PAYE:**
   - GH₵ 967.25 + GH₵ 0 + GH₵ 25.00 = **GH₵ 992.25**

---

## 🛠️ Using the PAYE Calculator

### In Code:

```typescript
import { calculatePAYE } from '@/utils/payeCalculations';

const result = calculatePAYE({
  basicSalary: 5000,
  residencyStatus: 'Resident-Full-Time',
  secondaryEmployment: false,
  paidSsnit: true,
  socialSecurityFund: 275,
  thirdTier: 250,
  cashAllowances: 1000,
  bonusIncome: 0,
  accommodationElement: 0,
  vehicleElement: 0,
  nonCashBenefit: 0,
  overtimeIncome: 500,
  deductibleReliefs: 0,
  annualBasicSalary: 60000
});

console.log('Total PAYE:', result.totalPAYE); // GH₵ 992.25
console.log('Chargeable Income:', result.chargeableIncome);
console.log('Tax Breakdown:', result);
```

---

## 📋 Residency Status Values

Use these exact strings in the database:

- `'Resident-Full-Time'` - Resident full-time employee
- `'Resident-Part-Time'` - Resident part-time employee
- `'Resident-Casual'` - Resident casual employee
- `'Non-Resident'` - Non-resident employee
- `'Secondary@5%'` - Secondary employment at 5%
- `'Secondary@10%'` - Secondary employment at 10%
- `'Secondary@17.5%'` - Secondary employment at 17.5%
- `'Secondary@25%'` - Secondary employment at 25%
- `'Secondary@30%'` - Secondary employment at 30%

---

## 🎨 UI Integration

### Employee Form Fields to Add:

1. **Residency Status** (Dropdown)
   - Resident-Full-Time
   - Resident-Part-Time
   - Resident-Casual
   - Non-Resident

2. **Employment Type** (Dropdown)
   - Full-Time
   - Part-Time
   - Casual

3. **Secondary Employment** (Yes/No Toggle)
   - If Yes, show secondary rate dropdown (5%, 10%, 17.5%, 25%, 30%)

4. **Paid SSNIT** (Yes/No Toggle)

5. **Allowances & Benefits**
   - Cash Allowances (GH₵)
   - Bonus Income (GH₵)
   - Accommodation Element (GH₵)
   - Vehicle Element (GH₵)
   - Non-Cash Benefits (GH₵)

6. **Other Income**
   - Overtime Income (GH₵)
   - Deductible Reliefs (GH₵)

---

## 📊 Payroll Processing Integration

When processing payroll, use the PAYE calculator:

```typescript
import { calculatePAYE } from '@/utils/payeCalculations';

// For each employee
const employee = getEmployee(employeeId);

const payeResult = calculatePAYE({
  basicSalary: employee.basic_salary,
  residencyStatus: employee.residency_status,
  secondaryEmployment: employee.secondary_employment === 1,
  secondaryEmploymentRate: employee.secondary_employment_rate,
  paidSsnit: employee.paid_ssnit === 1,
  socialSecurityFund: employee.basic_salary * 0.055, // 5.5%
  thirdTier: employee.is_tier3_contributor 
    ? employee.basic_salary * (employee.tier3_contribution_percentage / 100)
    : 0,
  cashAllowances: employee.cash_allowances || 0,
  bonusIncome: employee.bonus_income || 0,
  accommodationElement: employee.accommodation_element || 0,
  vehicleElement: employee.vehicle_element || 0,
  nonCashBenefit: employee.non_cash_benefit || 0,
  overtimeIncome: employee.overtime_income || 0,
  deductibleReliefs: employee.deductible_reliefs || 0,
  annualBasicSalary: employee.basic_salary * 12
});

// Use payeResult.totalPAYE as the tax deduction
const netSalary = payeResult.totalAssessableIncome 
                - payeResult.totalReliefs 
                - payeResult.totalPAYE;
```

---

## ✅ Database Migration

The employee table has been updated with all necessary fields. If you have existing employees, they will get default values:

- `employment_type`: 'Full-Time'
- `residency_status`: 'Resident-Full-Time'
- `secondary_employment`: 0 (No)
- `paid_ssnit`: 1 (Yes)
- All financial fields: 0

You can update these for each employee as needed.

---

## 🧪 Testing

### Test Cases:

1. **Full-Time Resident with SSNIT**
   - Should use progressive tax brackets
   - SSNIT and Tier 3 deducted from chargeable income

2. **Part-Time Resident**
   - Should use flat 10% rate
   - No matter the income level

3. **Non-Resident**
   - Should use flat 25% rate
   - No relief deductions

4. **Secondary Employment**
   - Should use specified rate (5%, 10%, etc.)
   - Only if Paid SSNIT = Yes

5. **Bonus Income**
   - First 15% of annual basic taxed at 5%
   - Excess added to regular income

---

## 📞 Support

All PAYE calculation logic is in:
- **File:** `src/utils/payeCalculations.ts`
- **Function:** `calculatePAYE()`

The function returns a detailed breakdown of all tax components for reporting and payslip generation.

---

## 🎉 Ready to Use!

Your employee table now has all fields needed for accurate PAYE tax calculation according to Ghana tax laws. The utility function handles all the complex logic automatically!

