# Quick Start: Multi-Tenancy Setup

## 🎯 Goal

Transform your PayrollSmith app from single-tenant to multi-tenant SaaS where each company gets their own isolated database.

## ⚡ Super Quick Start (5 minutes)

### Option 1: Fresh Installation (New Setup)

```bash
# 1. Start the server
npm run dev

# 2. In another terminal, create your first company
curl -X POST http://localhost:5173/api/tenants/signup \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "My Company Ltd",
    "subdomain": "mycompany",
    "contactEmail": "admin@mycompany.com",
    "adminFirstName": "John",
    "adminLastName": "Doe",
    "adminPassword": "SecurePassword123!"
  }'

# 3. Access your company at:
# http://mycompany.localhost:5173
```

### Option 2: Migrate Existing Data

```bash
# Run migration script
npm run migrate-to-multi-tenant

# Follow the prompts to:
# - Set company name
# - Choose subdomain
# - Create admin account

# Done! Access at: http://your-subdomain.localhost:5173
```

## 📝 What You Need to Know

### 1. **Database Structure**

**Before (Single-Tenant):**
```
payroll.db  ← All companies share this
```

**After (Multi-Tenant):**
```
databases/
├── master.db                 ← Tenant registry
├── tenant_acme-corp.db      ← ACME Corp's data
├── tenant_techstart.db      ← TechStart's data
└── tenant_mycompany.db      ← Your company's data
```

### 2. **Accessing Your App**

Each company gets a unique subdomain:
- `http://acme-corp.localhost:5173` → ACME Corporation
- `http://techstart.localhost:5173` → TechStart Ltd
- `http://mycompany.localhost:5173` → Your Company

### 3. **Creating New Companies**

**Via API:**
```bash
curl -X POST http://localhost:5173/api/tenants/signup \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "TechStart Ltd",
    "subdomain": "techstart",
    "contactEmail": "admin@techstart.com",
    "adminPassword": "password123"
  }'
```

**Via Frontend** (You'll need to create a signup page):
```
GET /signup → Company signup form
POST /api/tenants/signup → Creates tenant
Redirect to http://subdomain.localhost:5173/login
```

## 🔧 Server Configuration

### Add Tenant Routes to `server.ts`

```typescript
// Around line 18 (with other route imports)
let tenantManagementRoutes;

// In loadApiRoutes() function (around line 52)
const tenantManagementModule = await import('./src/api/routes/tenant-management.ts');
tenantManagementRoutes = tenantManagementModule.default;

// Around line 86
console.log('✅ API routes loaded successfully');

// Before the return statement, initialize master DB:
// Initialize master database
try {
  const { initMasterDatabase } = await import('./src/api/config/tenant-database');
  await initMasterDatabase();
  console.log('✅ Master database initialized');
} catch (error) {
  console.error('⚠️  Master database initialization failed:', error);
}

return true;

// In the route setup section (around line 140), add:
// Tenant management routes (no middleware needed)
app.use('/api/tenants', tenantManagementRoutes);

// Apply tenant middleware to SQL routes
const { tenantMiddleware } = await import('./src/api/middleware/tenant');
app.use('/api/sql', tenantMiddleware);
```

## 🧪 Testing Multi-Tenancy

### Test 1: Create Two Companies

```bash
# Company 1
curl -X POST http://localhost:5173/api/tenants/signup \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "ACME Corp",
    "subdomain": "acme",
    "contactEmail": "admin@acme.com",
    "adminPassword": "pass123"
  }'

# Company 2
curl -X POST http://localhost:5173/api/tenants/signup \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "TechStart",
    "subdomain": "techstart",
    "contactEmail": "admin@techstart.com",
    "adminPassword": "pass123"
  }'
```

### Test 2: Verify Data Isolation

1. Visit `http://acme.localhost:5173/login`
2. Login with `admin@acme.com` / `pass123`
3. Add an employee: "John Doe"

4. Visit `http://techstart.localhost:5173/login`
5. Login with `admin@techstart.com` / `pass123`
6. Check employees - should be empty (no "John Doe")

✅ **Data is isolated!** Each company has their own database.

## 🌐 Subdomain Configuration

### Development (localhost)

**Option 1: Use .localhost (Easiest)**
Modern browsers support `.localhost` automatically:
- `http://acme.localhost:5173` ✅ Works!
- `http://techstart.localhost:5173` ✅ Works!

**Option 2: Edit hosts file**

Add to `/etc/hosts` (Mac/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):
```
127.0.0.1 acme.localhost
127.0.0.1 techstart.localhost
```

### Production

1. **Configure wildcard DNS:**
```
*.yourdomain.com → Your Server IP
```

2. **Get wildcard SSL:**
```bash
certbot certonly --manual -d "*.yourdomain.com" -d "yourdomain.com"
```

3. **Update CORS in server.ts:**
```typescript
app.use(cors({
  origin: /\.yourdomain\.com$/
}));
```

## 📧 Email Configuration

Each tenant can have their own email settings:

### Method 1: Per-Tenant Email (Best for SaaS)

Update tenant with their email settings:
```bash
curl -X PUT http://localhost:5173/api/tenants/tenant_xxx \
  -H "Content-Type: application/json" \
  -d '{
    "email_host": "smtp.gmail.com",
    "email_port": 587,
    "email_user": "notifications@acme.com",
    "email_pass": "app-password"
  }'
```

### Method 2: Shared Email (Simpler)

Use environment variables as default:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=notifications@yoursaas.com
EMAIL_PASS=your-app-password
```

Update `src/api/services/emailService.ts` to check tenant settings first, then fallback to env vars.

## ✅ Verification Checklist

After setup, verify:

- [ ] Multiple tenants can be created via `/api/tenants/signup`
- [ ] Each tenant accessible via unique subdomain
- [ ] Login works for each tenant
- [ ] Employees added to Tenant A don't appear in Tenant B
- [ ] Payslips are isolated per tenant
- [ ] Email sending works with tenant-specific settings
- [ ] Master database exists at `databases/master.db`
- [ ] Tenant databases exist at `databases/tenant_*.db`

## 🐛 Common Issues

### "Tenant identification failed"
**Cause:** Not accessing via subdomain
**Fix:** Use `http://subdomain.localhost:5173` not `http://localhost:5173`

### "Company not found"
**Cause:** Tenant doesn't exist in master DB
**Fix:** Create tenant via `/api/tenants/signup`

### Cannot access subdomain.localhost
**Cause:** Browser doesn't support .localhost or hosts file not updated
**Fix:** 
1. Try different browser (Chrome/Firefox support .localhost)
2. Add to hosts file
3. Use `?tenant=subdomain` query parameter for testing

### Master database not created
**Cause:** Server initialization issue
**Fix:** Run manually:
```bash
curl -X POST http://localhost:5173/api/tenants/initialize
```

## 📚 Next Steps

1. **Update Frontend**: Modify login page to detect subdomain
2. **Create Signup Page**: Build UI for company registration
3. **Update All Routes**: Ensure all API routes use `req.tenantDb`
4. **Add Subscription Billing**: Integrate payment processor
5. **Create Admin Dashboard**: Manage all tenants from one place
6. **Implement Data Export**: Allow companies to export their data
7. **Set Up Monitoring**: Track usage per tenant

## 📖 Full Documentation

- **`MULTI_TENANCY_ARCHITECTURE.md`** - Complete architecture overview
- **`MULTI_TENANCY_IMPLEMENTATION_GUIDE.md`** - Detailed implementation steps
- **`EMAIL_SETUP_GUIDE.md`** - Email system configuration

## 🎉 You're Ready!

Your PayrollSmith app is now a fully multi-tenant SaaS platform where each company has complete data isolation. Add new companies anytime via the signup API!

**Questions?** Check the full implementation guide or the architecture document.

