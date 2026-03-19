# 🚀 PayrollSmith Ghana - Complete Setup Guide

## 📋 Overview

This guide will help you set up the complete PayrollSmith Ghana payroll management system with both frontend and backend components, specifically designed for Ghanaian businesses.

## 🎯 Features

### 🇬🇭 Ghana-Specific Features
- **Ghana Cedis (GHS) Currency**: Primary currency support
- **Ghana Tax Calculations**: 2024 tax brackets implementation
- **SSNIT Integration**: 5.5% Social Security contributions
- **NHIL Support**: 2.5% National Health Insurance Levy
- **Ghanaian Regions**: Support for all 16 regions
- **Local Banking**: Ghanaian bank integration
- **Timezone**: Africa/Accra timezone support

### 🛠️ System Features
- Employee Management
- Payroll Processing
- Allowance Management
- Payslip Generation
- Reports & Analytics
- User Management
- Audit Logging

## 📋 Prerequisites

### Required Software
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **PostgreSQL 12+** - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

### System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+

## 🚀 Quick Start (5 Minutes)

### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd payroll-smith

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Database Setup
```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE payrollsmith_gh;
\q

# Or use pgAdmin to create database
```

### 3. Environment Configuration
```bash
# Copy environment template
cd backend
cp env.example .env
```

Edit `backend/.env`:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=payrollsmith_gh
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Ghana-specific settings
DEFAULT_CURRENCY=GHS
DEFAULT_TIMEZONE=Africa/Accra
TAX_RATE=0.25
SSNIT_RATE=0.055
NHIL_RATE=0.025
```

### 4. Database Migration & Seeding
```bash
cd backend
npm run db:migrate
npm run db:seed
```

### 5. Start Both Servers
```bash
# Terminal 1: Start Backend (Port 5000)
cd backend
npm run dev

# Terminal 2: Start Frontend (Port 8092)
cd ..
npm run dev
```

### 6. Access the Application
- **Frontend**: http://localhost:8092
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### 7. Login Credentials
- **Email**: admin@payrollsmith.gh
- **Password**: admin123

## 📊 Sample Data Included

### 👥 Sample Employees
- **Kwame Mensah** - Senior Software Engineer (₵8,000)
- **Ama Osei** - Marketing Manager (₵12,000)
- **Kofi Addo** - Sales Representative (₵6,000)
- **Efua Sarpong** - HR Specialist (₵9,000)
- **Yaw Darko** - Accountant (₵10,000)

### 🏢 Departments
- Engineering
- Marketing
- Sales
- Human Resources
- Finance
- Operations

### 💰 Allowance Types
- Housing Allowance
- Transport Allowance
- Meal Allowance
- Medical Allowance
- Education Allowance
- Entertainment Allowance
- Responsibility Allowance

## 🔧 Detailed Setup Instructions

### Frontend Setup
```bash
# Navigate to project root
cd payroll-smith

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run db:migrate

# Seed with sample data
npm run db:seed

# Start development server
npm run dev
```

### Database Setup (PostgreSQL)

#### Option 1: Command Line
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE payrollsmith_gh;

# Verify creation
\l

# Exit
\q
```

#### Option 2: pgAdmin
1. Open pgAdmin
2. Right-click on "Databases"
3. Select "Create" > "Database"
4. Name: `payrollsmith_gh`
5. Click "Save"

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Payroll
- `GET /api/payroll/periods` - Get payroll periods
- `POST /api/payroll/process` - Process payroll
- `GET /api/payroll/records/:periodId` - Get payroll records

### Reports
- `GET /api/reports/payroll-summary` - Payroll summary
- `GET /api/reports/department-summary` - Department summary
- `GET /api/reports/salary-range` - Salary distribution

## 💰 Ghana Tax Calculation

The system implements Ghana's 2024 tax brackets:

| Annual Income (GHS) | Tax Rate |
|---------------------|----------|
| 0 - 4,824           | 0%       |
| 4,824 - 1,320       | 5%       |
| 1,320 - 1,560       | 10%      |
| 1,560 - 36,000      | 17.5%    |
| 36,000 - 195,840    | 25%      |
| Above 195,840       | 30%      |

### Deductions
- **SSNIT**: 5.5% of gross salary
- **NHIL**: 2.5% of gross salary
- **Income Tax**: Based on Ghana tax brackets

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt
- **Input Validation**: Comprehensive validation
- **Rate Limiting**: API request throttling
- **CORS Protection**: Cross-origin security
- **Audit Logging**: Complete action tracking

## 🛠️ Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend
```bash
npm run dev          # Start development server
npm start           # Start production server
npm run db:migrate  # Run database migrations
npm run db:seed     # Seed with sample data
```

## 📱 Testing the Application

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Login Test
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@payrollsmith.gh","password":"admin123"}'
```

### 3. Get Employees (with auth token)
```bash
curl http://localhost:5000/api/employees \
  -H "x-auth-token: YOUR_JWT_TOKEN"
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running and credentials are correct in `.env`

#### 2. Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Change port in `.env` or kill existing process

#### 3. JWT Token Error
```
Error: Token is not valid
```
**Solution**: Clear localStorage and login again

#### 4. CORS Error
```
Error: CORS policy blocked
```
**Solution**: Check CORS configuration in `server.js`

### Database Issues
```bash
# Reset database
psql -U postgres -d payrollsmith_gh -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npm run db:migrate
npm run db:seed
```

### Reset Everything
```bash
# Stop all servers
# Delete node_modules
rm -rf node_modules backend/node_modules

# Reinstall dependencies
npm install
cd backend && npm install && cd ..

# Reset database and restart
npm run db:migrate
npm run db:seed
npm run dev  # Frontend
cd backend && npm run dev  # Backend
```

## 📞 Support

### Getting Help
- **Documentation**: Check this guide and README files
- **API Docs**: http://localhost:5000/docs (when implemented)
- **Issues**: Create GitHub issue with detailed description

### Contact Information
- **Email**: support@payrollsmith.gh
- **GitHub**: [Repository Issues](https://github.com/your-repo/issues)

## 🎉 Success!

Once you've completed the setup:

1. ✅ Frontend running on http://localhost:8092
2. ✅ Backend running on http://localhost:5000
3. ✅ Database connected and seeded
4. ✅ Admin user created
5. ✅ Sample data loaded

You can now:
- 👥 Manage employees
- 💰 Process payroll with Ghana tax calculations
- 📊 Generate reports
- 📄 Create payslips
- 🔐 Manage user access

## 🔄 Next Steps

1. **Customize Company Settings**: Update company information
2. **Add Real Employees**: Replace sample data with actual employees
3. **Configure Allowances**: Set up company-specific allowances
4. **Set Up Payroll Periods**: Create monthly payroll cycles
5. **Test Payroll Processing**: Run a test payroll cycle
6. **Generate Reports**: Explore the reporting features

---

**🇬🇭 Built with ❤️ for Ghanaian businesses**

*For technical support or questions, please refer to the documentation or create an issue in the repository.*
