# Contribution Reports System - Implementation Guide

## Overview

This document describes the implementation of the Company-Wide and Single Employee Contribution Reports system as specified in the requirements. The system provides comprehensive contribution tracking across all three tiers (SSNIT, Tier 2, and Tier 3) with dynamic filtering and export capabilities.

## 🏗️ Database Schema

### ContributionHistory Table

The system creates a dedicated `ContributionHistory` table with the exact schema specified in the requirements:

```sql
CREATE TABLE ContributionHistory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    period DATE NOT NULL,
    ssnit_employee_5_5 DECIMAL(12,2) DEFAULT 0,
    tier2_employee_5 DECIMAL(12,2) DEFAULT 0,
    tier3_employee DECIMAL(12,2) DEFAULT 0,
    ssnit_employer_13 DECIMAL(12,2) DEFAULT 0,
    tier2_employer_5 DECIMAL(12,2) DEFAULT 0,
    tier3_employer_2_5 DECIMAL(12,2) DEFAULT 0,
    total_employer_contrib DECIMAL(12,2) DEFAULT 0,
    total_ssnit_contrib DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);
```

### Field Descriptions

- **ssnit_employee_5_5**: SSNIT Employee contribution (5.5%)
- **ssnit_employer_13**: SSNIT Employer contribution (13%)
- **tier2_employee_5**: Tier 2 Employee contribution (5%)
- **tier2_employer_5**: Tier 2 Employer contribution (5%)
- **tier3_employee**: Tier 3 Employee contribution
- **tier3_employer_2_5**: Tier 3 Employer contribution (2.5%)
- **total_employer_contrib**: Total employer contributions
- **total_ssnit_contrib**: Total SSNIT contributions (employee + employer)

## 📊 Report Types

### 1. Company-Wide Contribution Report

**Location**: `/company-contribution-report`

**Features**:
- Shows contributions for all employees across periods
- Dynamic column filtering based on Tier selection
- Employee and period filtering
- Totals calculation for all contribution types
- Export to CSV, Excel, and PDF

**Column Structure by Tier**:

#### Tier 1 (SSNIT)
- Employee ID, Name, Department
- Period
- SSNIT Employee (5.5%)
- SSNIT Employer (13%)
- Total SSNIT Contribution (13.5%)

#### Tier 2
- Employee ID, Name, Department
- Period
- Tier 2 Employee Contribution (5%)
- Employer Tier 2 Contribution (5%)

#### Tier 3
- Employee ID, Name, Department
- Period
- Tier 3 Employee Contribution
- Employer Tier 3 Contribution (2.5%)

#### All Tiers
- All columns from Tier 1, 2, and 3

### 2. Single Employee Contribution Report

**Location**: `/single-employee-contribution-report`

**Features**:
- Shows contribution history for a specific employee
- Breakdown per tier with employee and employer shares
- Date range filtering
- Tier-based filtering
- Export capabilities

## 🔧 API Endpoints

### Enhanced Company-Wide Report
```
GET /api/sql/contribution-reports/enhanced/company-wide
```

**Query Parameters**:
- `tier`: Filter by tier (tier1, tier2, tier3, all)
- `employeeId`: Filter by specific employee
- `month`: Filter by month
- `year`: Filter by year
- `startDate`: Start date for range filtering
- `endDate`: End date for range filtering

### Enhanced Single Employee Report
```
GET /api/sql/contribution-reports/enhanced/employee-history/:employeeId
```

**Query Parameters**:
- `tier`: Filter by tier (tier1, tier2, tier3, all)
- `startDate`: Start date for range filtering
- `endDate`: End date for range filtering

### Export Endpoints

#### CSV Export
```
GET /api/sql/contribution-reports/export/csv
```

#### Excel Export
```
GET /api/sql/contribution-reports/enhanced/export/excel
```

#### PDF Export
```
GET /api/sql/contribution-reports/enhanced/export/pdf
```

### Sample Data Population
```
POST /api/sql/contribution-reports/populate-sample-data
```

## 🎨 UI Components

### CompanyContributionReport.tsx
Enhanced version of the existing component with:
- Dynamic column filtering based on tier selection
- Export buttons for CSV, Excel, and PDF
- Improved filtering interface
- Totals calculation

### SingleEmployeeContributionReport.tsx
New component for individual employee reports with:
- Employee selection dropdown
- Date range picker
- Tier-based filtering
- Employee information display
- Contribution history table

### ContributionReportTest.tsx
Test page for verifying functionality and populating sample data.

## 🔄 Dynamic Filtering

The system implements dynamic filtering that updates the report instantly:

### Tier Filtering
- **Tier 1**: Shows only SSNIT-related columns
- **Tier 2**: Shows only Tier 2 columns
- **Tier 3**: Shows only Tier 3 columns
- **All**: Shows all contribution-related columns

### Employee Filtering
- **All Employees**: Shows company-wide data
- **Specific Employee**: Shows only that employee's data

### Period Filtering
- **Month/Year**: Filter by specific month and year
- **Date Range**: Filter by custom date range

## 📈 Totals Calculation

The system calculates totals for all visible columns:

### Company-Wide Totals
- Total employees
- Total basic salary
- Total contributions by tier
- Grand totals

### Single Employee Totals
- Total periods
- Total contributions by tier
- Employee and employer breakdowns

## 🚀 Getting Started

### 1. Database Setup
The ContributionHistory table is automatically created when the application starts.

### 2. Sample Data
Use the test page to populate sample data:
1. Navigate to `/contribution-report-test`
2. Click "Populate Sample Data"
3. Verify the data was created

### 3. Testing Reports
1. Navigate to `/company-contribution-report` for company-wide view
2. Navigate to `/single-employee-contribution-report` for individual employee view
3. Test filtering and export functionality

## 📋 User Scenarios

### HR Scenario
**As HR, I want to see all Tier 1 contributions for June 2025**
1. Go to Company-Wide Contribution Report
2. Select "Tier 1 (SSNIT)" from tier filter
3. Select "June" from month filter
4. Select "2025" from year filter
5. View results and export if needed

### Employee Scenario
**As an employee, I want to view my Tier 2 contributions history**
1. Go to Single Employee Contribution Report
2. Select your employee ID
3. Select "Tier 2" from tier filter
4. Set date range if needed
5. View your contribution history

### Auditor Scenario
**As an auditor, I want to filter Tier 3 contributions for 2024 and export to Excel**
1. Go to Company-Wide Contribution Report
2. Select "Tier 3" from tier filter
3. Set date range for 2024
4. Click "Export Excel"
5. Download the file

## 🔐 Role-Based Access

The system supports role-based access:
- **HR/Admin**: Can see all employees and all data
- **Employees**: Can only see their own contribution data
- **Auditors**: Can access all data with export capabilities

## 🛠️ Technical Implementation

### Backend
- **Database**: SQLite with ContributionHistory table
- **API**: Express.js with enhanced endpoints
- **Export**: PDF (jsPDF), Excel (xlsx), CSV (built-in)

### Frontend
- **Framework**: React with TypeScript
- **UI**: shadcn/ui components
- **State Management**: React hooks
- **Date Handling**: date-fns

### Key Features
- ✅ Dynamic column filtering
- ✅ Real-time totals calculation
- ✅ Multiple export formats
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Toast notifications

## 📝 Notes

1. The system falls back to the existing `contribution_reports` table if no data exists in `ContributionHistory`
2. All monetary values are formatted in Ghana Cedis (GHS)
3. Export files include appropriate headers and totals
4. The system handles both ContributionHistory and legacy data formats
5. Sample data generation creates realistic contribution amounts based on salary ranges

## 🐛 Troubleshooting

### Common Issues

1. **No data showing**: Populate sample data using the test page
2. **Export not working**: Check browser console for errors
3. **Filtering not working**: Verify API endpoints are accessible
4. **Database errors**: Check SQLite database file permissions

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify API endpoints return expected data
3. Test database connectivity
4. Check file permissions for exports

## 📞 Support

For issues or questions about the contribution reports system:
1. Check the test page for functionality verification
2. Review API responses in browser developer tools
3. Check server logs for backend errors
4. Verify database schema and data integrity
