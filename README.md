# PayrollSmith - Modern Payroll Management System

A comprehensive, modern payroll management system built with React, TypeScript, and Tailwind CSS.

## Features

### 🏢 Employee Management
- Add, edit, and manage employee information
- Comprehensive employee profiles with personal and employment details
- Search and filter employees by various criteria
- Employee status tracking (Active/Inactive)

### 💰 Payroll Processing
- Monthly payroll processing with employee selection
- Automatic salary calculations including allowances and deductions
- Multiple payroll frequencies (Monthly, Bi-weekly, Weekly)
- Payroll period management and scheduling

### 💸 Allowances Management
- Configure various allowance types (Housing, Transport, Meal, Medical, etc.)
- Set allowance amounts and frequencies
- Track allowance history and changes
- Employee-specific allowance assignments

### 📄 Payslips
- Generate and view employee payslips
- Download payslips in various formats
- Email payslips to employees
- Payslip status tracking (Paid/Pending)

### 📊 Reports & Analytics
- Comprehensive payroll reports
- Employee distribution analysis
- Salary trend analysis
- Department-wise analytics
- Interactive charts and visualizations

### ⚙️ System Settings
- Company information management
- Regional settings (Currency, Timezone)
- Payroll configuration
- Tax settings and policies
- Notification preferences
- Security settings

### 👥 User Management
- Role-based access control
- User permissions management
- System user administration
- Activity tracking

## Tech Stack

- **Frontend**: React 18, TypeScript
- **UI Framework**: Tailwind CSS, shadcn/ui
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd payroll-smith
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── dashboard/          # Dashboard components
│   ├── employees/          # Employee management components
│   ├── layout/             # Layout components (Header, Sidebar, etc.)
│   └── ui/                 # Reusable UI components (shadcn/ui)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── pages/                  # Page components
└── main.tsx               # Application entry point
```

## Key Components

### Pages
- **Dashboard** (`/`) - Overview with key metrics and quick actions
- **Employees** (`/employees`) - Employee management and profiles
- **Payroll** (`/payroll`) - Payroll processing and calculations
- **Allowances** (`/allowances`) - Allowance management
- **Payslips** (`/payslips`) - Payslip generation and management
- **Reports** (`/reports`) - Analytics and reporting
- **Settings** (`/settings`) - System configuration
- **Users** (`/users`) - User management and permissions

### Features Implemented

✅ **Complete Employee Management System**
- Add/Edit employee forms with validation
- Employee search and filtering
- Employee table with actions

✅ **Payroll Processing**
- Employee selection for payroll
- Payroll calculations
- Processing status tracking

✅ **Allowances System**
- Multiple allowance types
- Allowance assignment to employees
- Allowance tracking and management

✅ **Payslip Management**
- Payslip generation
- Status tracking
- Export and email functionality

✅ **Reporting System**
- Multiple report types
- Interactive charts
- Data visualization

✅ **Settings Management**
- Company information
- Regional settings
- Payroll configuration
- Security settings

✅ **User Management**
- Role-based access
- User administration
- Permission management

## Future Enhancements

- [ ] Database integration (Supabase/PostgreSQL)
- [ ] Authentication system
- [ ] Real-time notifications
- [ ] Mobile responsive design
- [ ] API integration
- [ ] Data import/export
- [ ] Advanced reporting
- [ ] Multi-tenant support
- [ ] Audit logging
- [ ] Backup and restore

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
