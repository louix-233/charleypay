# Multi-Tenancy Implementation Guide

## 🚀 Quick Start - Implementing Multi-Tenancy

This guide will help you migrate your current single-tenant PayrollSmith application to a fully multi-tenant SaaS platform.

## 📋 What Was Built

I've created a complete multi-tenancy system with the following components:

### 1. **Tenant Database Management** (`src/api/config/tenant-database.ts`)
- Master database for tenant registry
- Dynamic per-tenant database connections
- Tenant CRUD operations
- User authentication per tenant

### 2. **Tenant Middleware** (`src/api/middleware/tenant.ts`)
- Automatic tenant identification from subdomain
- Tenant database injection into requests
- Tenant status validation
- Helper utilities for tenant-scoped queries

### 3. **Tenant Management API** (`src/api/routes/tenant-management.ts`)
- Company signup endpoint
- Tenant login endpoint
- Tenant management (CRUD)
- Status management (active/suspended/cancelled)

---

## 🔧 Step-by-Step Implementation

### Step 1: Register Tenant Routes in Server

Add to `server.ts`:

```typescript
// Import tenant routes
import tenantManagementRoutes from './src/api/routes/tenant-management';
import tenantMiddleware from './src/api/middleware/tenant';

// Initialize master database on startup
import { initMasterDatabase } from './src/api/config/tenant-database';

// In loadApiRoutes function, add:
const tenantManagementModule = await import('./src/api/routes/tenant-management.ts');
let tenantManagementRoutes = tenantManagementModule.default;

// After routes are loaded, add tenant routes:
app.use('/api/tenants', tenantManagementRoutes);

// Apply tenant middleware to all SQL routes (AFTER tenant routes):
app.use('/api/sql', tenantMiddleware);

// Initialize master database:
setTimeout(async () => {
  try {
    await initMasterDatabase();
    console.log('✅ Master database initialized');
  } catch (error) {
    console.error('❌ Master database initialization failed:', error);
  }
}, 500);
```

### Step 2: Update Existing Routes to Use Tenant Database

**Before (single database):**
```typescript
import { dbUtils } from '../config/database';

router.get('/', async (req, res) => {
  const employees = await dbUtils.getRows('SELECT * FROM employees');
  res.json({ success: true, data: employees });
});
```

**After (multi-tenant):**
```typescript
import { getTenantDbUtils } from '../middleware/tenant';

router.get('/', async (req, res) => {
  // req.tenantDb is injected by tenant middleware
  const dbUtils = getTenantDbUtils(req.tenantDb!);
  const employees = await dbUtils.getRows('SELECT * FROM employees');
  res.json({ success: true, data: employees });
});
```

### Step 3: Update Email System for Multi-Tenancy

Update `src/api/services/emailService.ts` to use tenant-specific email settings:

```typescript
// Get email config from tenant
const createTransporter = (tenant: any) => {
  const emailConfig = {
    host: tenant.email_host || process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: tenant.email_port || parseInt(process.env.EMAIL_PORT || '587'),
    secure: (tenant.email_port || parseInt(process.env.EMAIL_PORT || '587')) === 465,
    auth: {
      user: tenant.email_user || process.env.EMAIL_USER || '',
      pass: tenant.email_pass || process.env.EMAIL_PASS || ''
    }
  };

  return nodemailer.createTransporter(emailConfig);
};
```

---

## 🎯 Migration Strategy

### For Brand New Installation:

1. Start the server - master database will auto-create
2. Create first tenant via API:
```bash
curl -X POST http://localhost:5173/api/tenants/signup \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "ACME Corporation",
    "subdomain": "acme-corp",
    "contactEmail": "admin@acmecorp.com",
    "adminFirstName": "John",
    "adminLastName": "Doe",
    "adminPassword": "SecurePassword123!"
  }'
```

3. Login at: `http://acme-corp.localhost:5173/login`

### For Existing Installation (with Data):

**Option A: Migrate to Default Tenant**

1. Create master database and default tenant:
```bash
npm run migrate-to-multi-tenant
```

2. This will:
   - Create `databases/master.db`
   - Move `payroll.db` to `databases/tenant_default.db`
   - Create tenant record for "Default Company"
   - Create admin user

**Option B: Start Fresh**

1. Backup current `payroll.db`
2. Delete `payroll.db`
3. Start server (auto-creates master DB)
4. Create new tenants via signup API

---

## 🌐 Subdomain Setup

### Development (localhost):

1. **Option 1: Use hosts file**

Edit `/etc/hosts` (Mac/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
127.0.0.1 acme-corp.localhost
127.0.0.1 techstart.localhost
127.0.0.1 mycompany.localhost
```

2. **Option 2: Use .localhost domains**

Modern browsers support `.localhost` automatically:
- `http://acme-corp.localhost:5173`
- `http://techstart.localhost:5173`

### Production:

1. **Configure DNS Wildcard Record:**
```
*.payrollsmith.com  →  Your Server IP
```

2. **Update allowed origins in CORS:**
```typescript
app.use(cors({
  origin: /\.payrollsmith\.com$/,
  credentials: true
}));
```

3. **Configure SSL for wildcard:**
```bash
# Get wildcard SSL certificate
certbot certonly --manual --preferred-challenges dns \
  -d "*.payrollsmith.com" -d "payrollsmith.com"
```

---

## 📊 Database Structure

### Master Database (`databases/master.db`)

**Tenants Table:**
```sql
tenants:
- id (TEXT PRIMARY KEY)
- company_name (TEXT)
- subdomain (TEXT UNIQUE) -- e.g., 'acme-corp'
- database_name (TEXT)     -- e.g., 'tenant_acme-corp'
- status (TEXT)            -- 'active', 'suspended', 'trial'
- plan_type (TEXT)         -- 'trial', 'basic', 'pro'
- max_employees (INTEGER)
- email_host, email_port, email_user, email_pass
- subscription dates, contact info
```

**Tenant Users Table:**
```sql
tenant_users:
- id (TEXT PRIMARY KEY)
- tenant_id (TEXT FK)
- email (TEXT)
- password_hash (TEXT)
- role (TEXT)             -- 'admin', 'hr', 'manager'
- first_name, last_name
- UNIQUE(tenant_id, email)
```

### Tenant Databases (`databases/tenant_*.db`)

Each tenant gets their own database with all application tables:
- employees
- payslips
- payroll_runs
- allowances
- deductions
- company_settings
- etc.

---

## 🔐 Authentication Flow

### 1. Company Signup:
```
POST /api/tenants/signup
{
  "companyName": "ACME Corp",
  "subdomain": "acme-corp",
  "contactEmail": "admin@acme.com",
  "adminPassword": "password123"
}

Response:
{
  "success": true,
  "data": {
    "tenant": {...},
    "token": "jwt-token",
    "loginUrl": "http://acme-corp.localhost:5173/login"
  }
}
```

### 2. Login:
```
User visits: http://acme-corp.localhost:5173/login

POST /api/tenants/login
{
  "email": "admin@acme.com",
  "password": "password123",
  "subdomain": "acme-corp"
}

Response:
{
  "success": true,
  "data": {
    "user": {...},
    "tenant": {...},
    "token": "jwt-token"
  }
}
```

### 3. API Requests:
```
All subsequent API calls:
- Include JWT token in Authorization header
- Go to tenant-specific URL: acme-corp.localhost:5173
- Tenant middleware extracts subdomain
- Routes to correct tenant database
```

---

## 🧪 Testing the Multi-Tenant System

### Test 1: Create Multiple Tenants

```bash
# Create Tenant 1
curl -X POST http://localhost:5173/api/tenants/signup \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "ACME Corporation",
    "subdomain": "acme",
    "contactEmail": "admin@acme.com",
    "adminPassword": "password123"
  }'

# Create Tenant 2
curl -X POST http://localhost:5173/api/tenants/signup \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "TechStart Ltd",
    "subdomain": "techstart",
    "contactEmail": "admin@techstart.com",
    "adminPassword": "password123"
  }'
```

### Test 2: Verify Data Isolation

```bash
# Add employee to Tenant 1
curl -X POST http://acme.localhost:5173/api/sql/employees \
  -H "Authorization: Bearer <acme-jwt-token>" \
  -d '{"name": "John Doe", ...}'

# List employees from Tenant 2
curl http://techstart.localhost:5173/api/sql/employees \
  -H "Authorization: Bearer <techstart-jwt-token>"

# Should NOT see John Doe - data is isolated!
```

### Test 3: List All Tenants

```bash
curl http://localhost:5173/api/tenants/list
```

---

## 📝 Updating Frontend for Multi-Tenancy

### Update Login Page

Add subdomain detection:

```typescript
// src/pages/Login.tsx
const subdomain = window.location.hostname.split('.')[0];

const handleLogin = async () => {
  const response = await fetch('/api/tenants/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      subdomain
    })
  });
  // ... handle response
};
```

### Create Signup Page

```typescript
// src/pages/CompanySignup.tsx
const handleSignup = async () => {
  const response = await fetch('/api/tenants/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      companyName,
      subdomain,
      contactEmail,
      adminPassword
    })
  });
  
  if (response.ok) {
    const { data } = await response.json();
    window.location.href = data.loginUrl;
  }
};
```

---

## 🚀 Deployment Checklist

- [ ] Configure wildcard DNS (*.yourdomain.com)
- [ ] Get wildcard SSL certificate
- [ ] Update CORS to allow tenant subdomains
- [ ] Set up database backup system (per tenant)
- [ ] Configure email for each tenant or use shared
- [ ] Set up monitoring for tenant databases
- [ ] Create super admin panel for tenant management
- [ ] Implement subscription/billing integration
- [ ] Add tenant usage tracking
- [ ] Create data export functionality
- [ ] Test data isolation thoroughly
- [ ] Set up automated database backups
- [ ] Configure rate limiting per tenant
- [ ] Add tenant analytics dashboard

---

## 🔧 Troubleshooting

### Problem: "Tenant identification failed"
**Solution:** Ensure you're accessing via subdomain (e.g., `acme.localhost:5173`) not just `localhost:5173`

### Problem: "Company not found"
**Solution:** Tenant doesn't exist. Check `databases/master.db` tenants table or create via signup API

### Problem: "Cannot read property 'tenantDb' of undefined"
**Solution:** Tenant middleware not applied to route. Check server.ts route order.

### Problem: Subdomain not working in development
**Solution:** 
1. Use `.localhost` TLD (works in modern browsers)
2. Or add entries to `/etc/hosts` file
3. Or use `x-tenant-id` header for testing

---

## 📊 Monitoring Multi-Tenant System

### Key Metrics to Track:

1. **Per Tenant:**
   - Number of employees
   - Payslips generated
   - Database size
   - API requests
   - Email sent

2. **System-wide:**
   - Total tenants
   - Active vs suspended
   - Database connections
   - Total storage used

### Example Query:

```sql
-- Get tenant statistics
SELECT 
  t.company_name,
  t.status,
  t.created_at,
  COUNT(tu.id) as user_count
FROM tenants t
LEFT JOIN tenant_users tu ON t.id = tu.tenant_id
GROUP BY t.id;
```

---

## 🎉 Success!

Once implemented, you'll have a fully multi-tenant SaaS application where:
- ✅ Each company has complete data isolation
- ✅ Companies access via unique subdomains
- ✅ Automatic tenant identification
- ✅ Scalable architecture
- ✅ Easy onboarding for new companies
- ✅ Subscription management ready
- ✅ Email system per tenant

**Your PayrollSmith is now a true multi-tenant SaaS platform!** 🚀

