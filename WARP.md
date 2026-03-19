# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Start development server (full-stack with integrated backend)
npm run dev

# Start frontend only (Vite dev server on port 8080)
npm run dev:frontend

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Database Management
```bash
# Create SQLite tables (used for development)
npm run create-tables

# Create admin user in SQLite
npm run create-admin
```

### Backend Development
```bash
# Start backend only (separate Node.js server on port 5000)
cd backend && npm run dev

# Database operations (PostgreSQL for production)
cd backend && npm run db:migrate
cd backend && npm run db:seed
```

### Testing & Debugging
```bash
# Access test route for quick status check
# Visit: http://localhost:5173/test

# Check API health
curl http://localhost:5173/api/health

# Reset system data
node test-company-settings.cjs
node test-staff-portal.js
```

## Architecture Overview

### Full-Stack TypeScript Application
PayrollSmith is a comprehensive payroll management system built specifically for Ghanaian businesses, featuring both admin and staff portals.

### Key Architectural Patterns

#### 1. **Dual Database Strategy**
- **SQLite**: Primary database for development and faster operations
- **DynamoDB**: Optional cloud database for production scaling
- **PostgreSQL**: Traditional backend option (legacy support)

#### 2. **Context-Driven State Management**
The application uses React Context pattern for domain-specific state management:
- `AuthContext` - Authentication and user sessions
- `EmployeeContext` - Employee data and operations
- `PayrollHistoryContext` - Payroll processing history
- `AllowancesContext`, `DeductionsContext` - Compensation components
- `TaxBracketsContext` - Ghana tax calculation rules

#### 3. **Dual Server Architecture**
- **Integrated Server** (`server.ts`): Full-stack server combining Vite + Express API
- **Separate Backend** (`backend/`): Standalone Node.js API server
- Supports both development modes based on configuration

#### 4. **Ghana-Specific Business Logic**
- **Currency**: Ghana Cedis (GHS) as primary currency
- **Tax System**: 2024 Ghana tax brackets with progressive rates
- **Contributions**: SSNIT (5.5%) and NHIL (2.5%) automatic calculations
- **Regional Support**: All 16 Ghanaian regions

### Frontend Structure

#### Component Organization
```
src/
├── components/
│   ├── auth/             # Authentication components
│   ├── employees/        # Employee management UI
│   ├── layout/           # App layout (Sidebar, Header)
│   └── ui/               # shadcn/ui reusable components
├── contexts/             # React Context providers (10+ contexts)
├── pages/                # Route components (25+ pages)
├── services/             # API communication layers
└── utils/                # Tax calculations & utilities
```

#### Key UI Patterns
- **shadcn/ui**: Component library for consistent UI
- **Protected Routes**: Role-based access control
- **Staff Portal**: Separate authentication system for employees
- **Responsive Design**: Tailwind CSS for mobile-first approach

### Backend API Structure

#### Route Categories
1. **SQL Routes** (`/api/sql/*`) - SQLite database operations, no auth required
2. **DynamoDB Routes** (`/api/*`) - Cloud database operations, auth required
3. **Staff Routes** (`/api/staff/*`) - Employee self-service portal

#### Database Models
- **Employees**: Full employee lifecycle management
- **Payroll Processing**: Period-based payroll calculations
- **Allowances & Deductions**: Flexible compensation components
- **Tax Brackets**: Ghana tax law implementation
- **Users**: System admin and HR user management
- **Contribution Reports**: SSNIT and NHIL reporting

## Project-Specific Development Notes

### Ghana Payroll Calculations
The tax calculation logic in `src/utils/taxCalculations.ts` implements Ghana's progressive tax system:
- Tax-free threshold: GHS 4,824 annually
- Progressive brackets from 5% to 30%
- Automatic SSNIT and NHIL deductions
- Monthly and annual tax computations

### Environment Configuration
Two environment modes supported:
1. **Frontend-only mode**: When AWS credentials not configured
2. **Full API mode**: With DynamoDB backend enabled

Check AWS credentials setup in AWS-SETUP.md for cloud database functionality.

### Performance Optimizations
- **Vite HMR**: Optimized for fast hot reloads
- **Parallel Database Init**: SQLite primary, DynamoDB fallback
- **Chunk Splitting**: Vendor and UI component separation
- **Dependency Pre-bundling**: React ecosystem optimization

### Staff Portal System
Independent authentication system allowing employees to:
- Login with employee ID and phone number
- View personal payslips
- Download payslip PDFs
- Access salary history

### Development Workflow
1. **SQLite First**: Development uses SQLite for speed
2. **Context Testing**: Test individual contexts with Debug page
3. **API Health Checks**: Monitor backend connectivity
4. **Progressive Enhancement**: Features work offline, sync when online

## Common Development Tasks

### Adding New Employee Fields
1. Update interfaces in `src/api/apiService.ts`
2. Modify database schemas in SQL migration files
3. Update forms in employee management components
4. Adjust tax calculations if affecting compensation

### Creating New Reports
1. Add context provider for data management
2. Create page component in `src/pages/`
3. Implement API endpoints for data aggregation
4. Use Recharts for visualization components

### Extending Tax Rules
1. Modify `src/utils/taxCalculations.ts`
2. Update tax bracket management in admin interface
3. Test with sample employee data
4. Verify SSNIT/NHIL calculation accuracy

### Database Switching
The application automatically detects available database backends:
- Prioritizes SQLite for development speed
- Falls back to PostgreSQL for traditional deployments
- Scales to DynamoDB for cloud operations

When adding new data models, implement in all three database adapters for compatibility.

## Important File Locations

- **Main Server**: `server.ts` - Integrated development server
- **Tax Logic**: `src/utils/taxCalculations.ts` - Ghana tax implementation
- **API Service**: `src/api/apiService.ts` - Frontend-backend communication
- **Route Config**: `src/routes/AppRoutes.tsx` - Application routing
- **Database Config**: `src/api/config/database.ts` - SQLite setup