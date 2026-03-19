# PayrollSmith - DynamoDB Unified Server

A comprehensive payroll management system built with React, TypeScript, and DynamoDB, specifically designed for Ghanaian businesses with integrated Ghana tax calculations.

## 🚀 Features

### Core Functionality
- **Employee Management**: Complete CRUD operations for employee records
- **Payroll Processing**: Automated payroll calculation with Ghana tax compliance
- **Allowance Management**: Flexible allowance types and employee assignments
- **Payslip Generation**: Automated payslip creation and management
- **Comprehensive Reporting**: Multiple report types for business insights
- **User Management**: Role-based access control (Admin, HR, Manager)

### Ghana-Specific Features
- **Ghana Tax Calculations**: 2024 progressive tax brackets
- **SSNIT Contributions**: 5.5% automatic calculation
- **NHIL Contributions**: 2.5% automatic calculation
- **Ghana Cedis (₵)**: Primary currency support
- **Local Compliance**: Built for Ghanaian business requirements

### Technical Features
- **Unified Server**: Single deployment with frontend and backend
- **DynamoDB Integration**: NoSQL database for scalability
- **JWT Authentication**: Secure token-based authentication
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Built with shadcn/ui and Tailwind CSS
- **Real-time Data**: React Query for efficient data management

## 🏗️ Architecture

### Unified Server Approach
- **Single Codebase**: Frontend and backend in one project
- **Express + Vite**: Development server serves both API and frontend
- **DynamoDB**: NoSQL database for flexible data storage
- **TypeScript**: Shared types between frontend and backend

### Database Schema (DynamoDB Tables)
- `payroll-users`: System users and authentication
- `payroll-employees`: Employee records and information
- `payroll-periods`: Payroll processing periods
- `payroll-records`: Individual payroll calculations
- `payroll-allowance-types`: Allowance type definitions
- `payroll-employee-allowances`: Employee allowance assignments
- `payroll-payslips`: Generated payslip records

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components
- **React Router DOM**: Client-side routing
- **React Query**: Server state management
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation
- **Recharts**: Data visualization
- **Lucide React**: Icon library

### Backend (Unified Server)
- **Express.js**: Web framework
- **TypeScript**: Type-safe server development
- **DynamoDB**: NoSQL database
- **AWS SDK**: DynamoDB integration
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logging

### Development Tools
- **Vite**: Fast build tool and dev server
- **tsx**: TypeScript execution
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

## 📋 Prerequisites

Before running this application, ensure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **AWS Account** with DynamoDB access
4. **AWS CLI** (optional, for local development)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd payroll-smith
npm install
```

### 2. AWS Configuration

Create an AWS DynamoDB table or use the auto-creation feature:

```bash
# Option 1: Use AWS CLI to create tables
aws dynamodb create-table \
  --table-name payroll-users \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Option 2: Tables will be auto-created on first run
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5173
NODE_ENV=development

# Ghana Tax Rates (2024)
SSNIT_RATE=0.055
NHIL_RATE=0.025
```

### 4. Start Development Server

```bash
# Start unified server (frontend + backend)
npm run dev

# Or start frontend only (for development)
npm run dev:frontend
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:5173/api
- **Health Check**: http://localhost:5173/api/health

### 5. Initial Setup

1. **Register Admin User**: Navigate to the application and register an admin user
2. **Create Allowance Types**: Set up common allowance types (Housing, Transport, etc.)
3. **Add Employees**: Start adding employee records
4. **Create Payroll Period**: Set up your first payroll period
5. **Process Payroll**: Run payroll calculations for employees

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Employees
- `GET /api/employees` - List employees with filtering
- `POST /api/employees` - Create new employee
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/stats/summary` - Employee statistics

### Payroll
- `GET /api/payroll/periods` - List payroll periods
- `POST /api/payroll/periods` - Create payroll period
- `POST /api/payroll/process` - Process payroll for employees
- `GET /api/payroll/periods/:id/records` - Get payroll records
- `GET /api/payroll/summary` - Payroll summary
- `POST /api/payroll/preview` - Preview payroll calculation

### Allowances
- `GET /api/allowances/types` - List allowance types
- `POST /api/allowances/types` - Create allowance type
- `GET /api/allowances/employee/:id` - Get employee allowances
- `POST /api/allowances/employee/:id` - Assign allowance to employee
- `GET /api/allowances/summary` - Allowance summary

### Payslips
- `GET /api/payslips` - List payslips
- `POST /api/payslips/generate/:recordId` - Generate payslip
- `POST /api/payslips/generate-period/:periodId` - Generate all payslips for period
- `GET /api/payslips/summary` - Payslip summary

### Reports
- `GET /api/reports/payroll-summary` - Payroll summary report
- `GET /api/reports/department-summary` - Department summary
- `GET /api/reports/salary-distribution` - Salary distribution
- `GET /api/reports/tax-summary` - Tax summary report
- `GET /api/reports/allowance-summary` - Allowance summary
- `GET /api/reports/employee-turnover` - Employee turnover report

### Users (Admin Only)
- `GET /api/users` - List users
- `PUT /api/users/:id/status` - Update user status
- `PUT /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Delete user

## 🏦 Ghana Tax Calculation

The system implements the 2024 Ghana tax structure:

### Tax Brackets
- **₵0 - ₵365**: 0%
- **₵366 - ₵1,464**: 5%
- **₵1,465 - ₵2,196**: 10%
- **₵2,197 - ₵2,928**: 17.5%
- **₵2,929 - ₵3,650**: 25%
- **₵3,651 - ₵4,380**: 30%
- **₵4,381+**: 35%

### Contributions
- **SSNIT**: 5.5% of basic salary
- **NHIL**: 2.5% of basic salary

### Calculation Process
1. **Basic Salary** + **Allowances** = **Gross Salary**
2. **Gross Salary** - **SSNIT** - **NHIL** = **Taxable Income**
3. **Taxable Income** × **12** = **Annual Taxable Income**
4. **Annual Tax** calculated using progressive brackets
5. **Monthly Tax** = **Annual Tax** ÷ **12**
6. **Net Salary** = **Gross Salary** - **SSNIT** - **NHIL** - **Monthly Tax** - **Deductions**

## 🔧 Development

### Project Structure
```
payroll-smith/
├── src/
│   ├── api/                    # Backend API
│   │   ├── config/            # Configuration files
│   │   ├── middleware/        # Express middleware
│   │   └── routes/            # API route handlers
│   ├── components/            # React components
│   ├── pages/                 # Page components
│   └── App.tsx               # Main app component
├── server.ts                 # Unified server entry point
├── package.json              # Dependencies and scripts
└── README-DYNAMODB.md        # This file
```

### Available Scripts
- `npm run dev` - Start unified development server
- `npm run dev:frontend` - Start frontend-only development
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features
1. **API Routes**: Add new routes in `src/api/routes/`
2. **Database Operations**: Use `dbUtils` from `src/api/config/dynamodb.ts`
3. **Frontend Components**: Add components in `src/components/`
4. **Pages**: Add new pages in `src/pages/`
5. **Types**: Update interfaces in `src/api/apiService.ts`

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables (Production)
Ensure all environment variables are properly set in production:
- AWS credentials with appropriate permissions
- Strong JWT secret
- Correct region and configuration

### AWS Permissions
Your AWS user/role needs the following DynamoDB permissions:
- `dynamodb:CreateTable`
- `dynamodb:DeleteTable`
- `dynamodb:DescribeTable`
- `dynamodb:GetItem`
- `dynamodb:PutItem`
- `dynamodb:UpdateItem`
- `dynamodb:DeleteItem`
- `dynamodb:Query`
- `dynamodb:Scan`

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: express-validator for API input validation
- **CORS Protection**: Configured for security
- **Rate Limiting**: API rate limiting to prevent abuse
- **Helmet**: Security headers middleware
- **Role-based Access**: Admin, HR, and Manager roles

## 📈 Performance

- **DynamoDB**: High-performance NoSQL database
- **React Query**: Efficient data caching and synchronization
- **Vite**: Fast development and build times
- **TypeScript**: Compile-time error checking
- **Optimized Queries**: Efficient DynamoDB query patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔄 Migration from PostgreSQL

If migrating from the previous PostgreSQL version:

1. **Data Export**: Export existing data from PostgreSQL
2. **Data Transformation**: Transform data to DynamoDB format
3. **Data Import**: Import data into DynamoDB tables
4. **Update Configuration**: Switch to DynamoDB configuration
5. **Test**: Verify all functionality works correctly

The unified server approach eliminates the need for separate frontend and backend deployments, making the application easier to manage and deploy.
