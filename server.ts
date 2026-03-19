import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Debug environment variables
console.log('🔍 Environment Check:');
console.log('DATABASE_TYPE:', process.env.DATABASE_TYPE || 'sqlite');
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Not set');
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Not set');
console.log('AWS_REGION:', process.env.AWS_REGION || 'us-east-1');

// Import API routes with error handling
let authRoutes, employeeRoutes, payrollRoutes, allowanceRoutes, payslipRoutes, reportRoutes, userRoutes, deductionRoutes, taxBracketRoutes, payslipSettingsRoutes, payrollHistoryRoutes;
let sqlEmployeeRoutes, sqlAllowanceRoutes, sqlDeductionRoutes, sqlTaxBracketRoutes, sqlPayslipSettingsRoutes, sqlPayrollHistoryRoutes, sqlPayrollRecordsRoutes, sqlUsersRoutes, sqlContributionReportsRoutes, sqlReimbursementRoutes, sqlCompanySettingsRoutes, sqlDepartmentsRoutes, sqlDesignationsRoutes, sqlResetRoutes, sqlPayslipsRoutes, sqlStaffAuthRoutes, sqlPayrollRunsRoutes, sqlPayslipEmailRoutes, sqlTestEmailRoutes, sqlAuditLogsRoutes, sqlSystemMaintenanceRoutes, sqlPasswordResetRoutes, tenantManagementRoutes;

const loadApiRoutes = async () => {
  console.log('📍 Entering loadApiRoutes()...');
  try {
    console.log('📍 Importing authModule...');
    const authModule = await import('./src/api/routes/auth.ts');
    console.log('📍 Importing employeeModule...');
    const employeeModule = await import('./src/api/routes/employees.ts');
    const payrollModule = await import('./src/api/routes/payroll.ts');
    const allowanceModule = await import('./src/api/routes/allowances.ts');
    const payslipModule = await import('./src/api/routes/payslips.ts');
    const reportModule = await import('./src/api/routes/reports.ts');
    const userModule = await import('./src/api/routes/users.ts');
    const deductionModule = await import('./src/api/routes/deductions.ts');
    const taxBracketModule = await import('./src/api/routes/tax-brackets.ts');
    const payslipSettingsModule = await import('./src/api/routes/payslip-settings.ts');
    const payrollHistoryModule = await import('./src/api/routes/payroll-history.ts');
    
    // SQL-based routes (no authentication required)
    const sqlEmployeeModule = await import('./src/api/routes/sql-employees.ts');
    const sqlAllowanceModule = await import('./src/api/routes/sql-allowances.ts');
    const sqlDeductionModule = await import('./src/api/routes/sql-deductions.ts');
    const sqlTaxBracketModule = await import('./src/api/routes/sql-tax-brackets.ts');
    const sqlPayslipSettingsModule = await import('./src/api/routes/sql-payslip-settings.ts');
    const sqlPayrollHistoryModule = await import('./src/api/routes/sql-payroll-history.ts');
    const sqlUsersModule = await import('./src/api/routes/sql-users.ts');
    const sqlContributionReportsModule = await import('./src/api/routes/sql-contribution-reports.ts');
    const sqlReimbursementModule = await import('./src/api/routes/sql-reimbursements.ts');
    const sqlCompanySettingsModule = await import('./src/api/routes/sql-company-settings.ts');
    const sqlDepartmentsModule = await import('./src/api/routes/sql-departments.ts');
    const sqlDesignationsModule = await import('./src/api/routes/sql-designations.ts');
    const sqlResetModule = await import('./src/api/routes/sql-reset.ts');
    const sqlPayslipsModule = await import('./src/api/routes/sql-payslips.ts');
    const sqlStaffAuthModule = await import('./src/api/routes/sql-staff-auth.ts');
    const sqlPayrollRunsModule = await import('./src/api/routes/sql-payroll-runs.ts');
    const sqlPayrollRecordsModule = await import('./src/api/routes/sql-payroll-records.ts');
    const sqlPayslipEmailModule = await import('./src/api/routes/sql-payslip-emails.ts');
    const sqlTestEmailModule = await import('./src/api/routes/sql-test-email.ts');
    const sqlAuditLogsModule = await import('./src/api/routes/sql-audit-logs.ts');
    const sqlSystemMaintenanceModule = await import('./src/api/routes/sql-system-maintenance.ts');
    const sqlPasswordResetModule = await import('./src/api/routes/sql-password-reset.ts');
    const tenantManagementModule = await import('./src/api/routes/tenant-management.ts');
    
    authRoutes = authModule.default;
    employeeRoutes = employeeModule.default;
    payrollRoutes = payrollModule.default;
    allowanceRoutes = allowanceModule.default;
    payslipRoutes = payslipModule.default;
    reportRoutes = reportModule.default;
    userRoutes = userModule.default;
    deductionRoutes = deductionModule.default;
    taxBracketRoutes = taxBracketModule.default;
    payslipSettingsRoutes = payslipSettingsModule.default;
    payrollHistoryRoutes = payrollHistoryModule.default;
    
    // SQL routes
    sqlEmployeeRoutes = sqlEmployeeModule.default;
    sqlAllowanceRoutes = sqlAllowanceModule.default;
    sqlDeductionRoutes = sqlDeductionModule.default;
    sqlTaxBracketRoutes = sqlTaxBracketModule.default;
    sqlPayslipSettingsRoutes = sqlPayslipSettingsModule.default;
    sqlPayrollHistoryRoutes = sqlPayrollHistoryModule.default;
    sqlUsersRoutes = sqlUsersModule.default;
    sqlContributionReportsRoutes = sqlContributionReportsModule.default;
    sqlReimbursementRoutes = sqlReimbursementModule.default;
    sqlCompanySettingsRoutes = sqlCompanySettingsModule.default;
    sqlDepartmentsRoutes = sqlDepartmentsModule.default;
    sqlDesignationsRoutes = sqlDesignationsModule.default;
    sqlResetRoutes = sqlResetModule.default;
    sqlPayslipsRoutes = sqlPayslipsModule.default;
    sqlStaffAuthRoutes = sqlStaffAuthModule.default;
    sqlPayrollRunsRoutes = sqlPayrollRunsModule.default;
    sqlPayrollRecordsRoutes = sqlPayrollRecordsModule.default;
    sqlPayslipEmailRoutes = sqlPayslipEmailModule.default;
    sqlTestEmailRoutes = sqlTestEmailModule.default;
    sqlAuditLogsRoutes = sqlAuditLogsModule.default;
    sqlSystemMaintenanceRoutes = sqlSystemMaintenanceModule.default;
    sqlPasswordResetRoutes = sqlPasswordResetModule.default;
    tenantManagementRoutes = tenantManagementModule.default;
    
    console.log('✅ API modules imported successfully');
    console.log('✅ authRoutes is', authRoutes ? 'DEFINED' : 'NULL');
    console.log('✅ tenantManagementRoutes is', tenantManagementRoutes ? 'DEFINED' : 'NULL');
    
    console.log('✅ API routes loaded successfully');
    return true;
  } catch (error: any) {
    console.warn('⚠️  API routes not loaded due to configuration issues. Running in frontend-only mode.');
    console.warn('   To enable full functionality, configure AWS credentials.');
    console.error('Error details:', error.message);
    console.error('Full error:', error);
    return false;
  }
};

const app = express();
const PORT = process.env.PORT || 5173;

app.use(helmet({ contentSecurityPolicy: false })); // Disable CSP for development
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
// Disable rate limiting for development
// app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));
app.use(morgan('combined'));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'src/public/uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mode: authRoutes ? 'full' : 'frontend-only',
    database: {
      type: process.env.DATABASE_TYPE || 'sqlite',
      migrated: process.env.MIGRATE_FROM_DYNAMODB === 'true'
    }
  });
});

if (process.env.NODE_ENV !== 'production') {
  const startServer = async () => {
    try {
      // Load API routes
      const routesLoaded = await loadApiRoutes();
      
      // Set up API routes if loaded successfully
      if (routesLoaded) {
        // DynamoDB-based routes (require authentication)
        if (authRoutes) {
          app.use('/api/auth', authRoutes);
          app.use('/api/employees', employeeRoutes);
          app.use('/api/payroll', payrollRoutes);
          app.use('/api/allowances', allowanceRoutes);
          app.use('/api/payslips', payslipRoutes);
          app.use('/api/reports', reportRoutes);
          app.use('/api/users', userRoutes);
          app.use('/api/deductions', deductionRoutes);
          app.use('/api/tax-brackets', taxBracketRoutes);
          app.use('/api/payslip-settings', payslipSettingsRoutes);
          app.use('/api/payroll-history', payrollHistoryRoutes);
        }
        
        // SQL-based routes (isolated by tenant)
        if (sqlEmployeeRoutes) {
          console.log('✅ SQL routes loaded successfully');
          
          // Tenant-aware router for domain logic
          const sqlRouter = express.Router();
          
          // Import middleware
          const { auth } = await import('./src/api/middleware/auth.ts');
          const { default: tenantMiddleware } = await import('./src/api/middleware/tenantMiddleware.ts');
          
          // Apply middleware to all domain routes
          sqlRouter.use(auth);
          sqlRouter.use(tenantMiddleware);
          
          sqlRouter.use('/employees', sqlEmployeeRoutes);
          sqlRouter.use('/allowances', sqlAllowanceRoutes);
          sqlRouter.use('/deductions', sqlDeductionRoutes);
          sqlRouter.use('/tax-brackets', sqlTaxBracketRoutes);
          sqlRouter.use('/payslip-settings', sqlPayslipSettingsRoutes);
          sqlRouter.use('/payroll-history', sqlPayrollHistoryRoutes);
          sqlRouter.use('/payroll-records', sqlPayrollRecordsRoutes);
          sqlRouter.use('/users', sqlUsersRoutes);
          sqlRouter.use('/contribution-reports', sqlContributionReportsRoutes);
          sqlRouter.use('/reimbursements', sqlReimbursementRoutes);
          sqlRouter.use('/company-settings', sqlCompanySettingsRoutes);
          sqlRouter.use('/departments', sqlDepartmentsRoutes);
          sqlRouter.use('/designations', sqlDesignationsRoutes);
          sqlRouter.use('/reset', sqlResetRoutes);
          sqlRouter.use('/payslips', sqlPayslipsRoutes);
          sqlRouter.use('/payroll-runs', sqlPayrollRunsRoutes);
          sqlRouter.use('/payslip-emails', sqlPayslipEmailRoutes);
          sqlRouter.use('/test-email', sqlTestEmailRoutes);
          sqlRouter.use('/audit-logs', sqlAuditLogsRoutes);
          sqlRouter.use('/maintenance', sqlSystemMaintenanceRoutes);
          sqlRouter.use('/password-reset', sqlPasswordResetRoutes);
          
          app.use('/api/sql', sqlRouter);
          app.use('/api/staff-auth', sqlStaffAuthRoutes);
          app.use('/api/tenants', tenantManagementRoutes);
          console.log('✅ Mounted /api/tenants and /api/sql routes');
        } else {
          console.log('❌ SQL routes not loaded (sqlEmployeeRoutes was null)');
        }
        
        // Initialize database based on DATABASE_TYPE
        setTimeout(async () => {
          try {
            const { testConnection, initializeTables } = await import('./src/api/config/database-adapter');
            const dbConnected = await testConnection();
            if (dbConnected) {
              console.log('🔄 Initializing database tables...');
              await initializeTables();
              console.log('✅ Database initialization complete');
            } else {
              console.log('⚠️  Database connection failed, but server is running');
            }
          } catch (error) {
            console.log('⚠️  Database initialization failed, but server is running:', error);
          }
        }, 500);
      }
      
      // Set up Vite middleware AFTER all API routes are configured
      console.log('✅ About to start Vite middleware');
      const vite = await createViteServer({
        server: { 
          middlewareMode: true,
          hmr: {
            overlay: false, // Disable error overlay for faster reloads
          },
        },
        appType: 'spa',
        optimizeDeps: {
          include: ['react', 'react-dom', 'react-router-dom'],
        },
      });
      console.log('✅ Vite middleware started successfully');
      
      // Use Vite middleware ONLY for non-API routes
      app.use((req, res, next) => {
        if (req.path.startsWith('/api/')) {
          // Skip Vite for API routes
          return next();
        }
        // Use Vite for everything else
        return vite.middlewares(req, res, next);
      });
      
      const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📊 API available at http://localhost:${PORT}/api`);
        console.log(`🌐 Frontend available at http://localhost:${PORT}`);
        if (!routesLoaded) {
          console.log(`⚠️  Running in frontend-only mode. Configure AWS credentials for full functionality.`);
        } else {
          console.log(`✅ Full API mode enabled - tables will be created automatically`);
        }
      });

      server.on('error', (e: any) => {
        if (e.code === 'EADDRINUSE') {
          console.error(`❌ Port ${PORT} is already in use. Please close any other instances of the server.`);
          process.exit(1);
        } else {
          console.error('❌ Server error:', e);
        }
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  };
  startServer();
} else {
  // Production mode logic (static files)
  app.use(express.static(path.join(process.cwd(), 'dist')));
app.use('/uploads', express.static(path.join(process.cwd(), 'src/public/uploads')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
  });
  app.listen(PORT, () => {
    console.log(`🚀 Production server running on http://localhost:${PORT}`);
  });
}
