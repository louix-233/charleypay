# Multi-Tenancy Architecture for PayrollSmith

## 🎯 Current Problem

**Issue**: The application currently uses a single SQLite database (`payroll.db`) shared by all users, which means:
- ❌ All companies see the same data
- ❌ No data isolation between tenants
- ❌ Security risk - data leakage possible
- ❌ Cannot scale to multiple companies

## ✅ Proposed Solution: Database-per-Tenant Architecture

Each company gets its own completely isolated SQLite database file.

### Architecture Options

## Option 1: Separate SQLite Database per Tenant (Recommended for Current Setup)

**Structure:**
```
databases/
├── tenant_acme-corp.db          # ACME Corporation's database
├── tenant_techstart.db          # TechStart Ltd's database
├── tenant_global-services.db    # Global Services Inc's database
└── master.db                    # Tenant registry and authentication
```

**Pros:**
- ✅ Complete data isolation
- ✅ Easy to implement with current SQLite setup
- ✅ Simple backup/restore per company
- ✅ Easy to export/delete company data
- ✅ No query overhead for filtering by tenant_id

**Cons:**
- ⚠️ More database files to manage
- ⚠️ Harder to do cross-tenant analytics
- ⚠️ Each tenant needs separate migrations

## Option 2: Single Database with Tenant ID (Shared Database)

**Structure:**
```sql
-- All tables include tenant_id column
CREATE TABLE employees (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,  -- Links to specific company
  name TEXT NOT NULL,
  ...
);

CREATE INDEX idx_employees_tenant ON employees(tenant_id);
```

**Pros:**
- ✅ Single database to manage
- ✅ Easier cross-tenant queries (for analytics)
- ✅ Single migration system
- ✅ Better for very large number of tenants

**Cons:**
- ⚠️ Risk of data leakage if queries miss tenant_id filter
- ⚠️ All queries must include tenant_id
- ⚠️ Harder to export/delete single tenant data
- ⚠️ Performance degradation as data grows

## Option 3: PostgreSQL with Schemas per Tenant (Best for Production)

**Structure:**
```sql
-- Each tenant gets their own schema
CREATE SCHEMA tenant_acme_corp;
CREATE SCHEMA tenant_techstart;
CREATE SCHEMA tenant_global_services;

-- Tables within each schema
CREATE TABLE tenant_acme_corp.employees (...);
CREATE TABLE tenant_techstart.employees (...);
```

**Pros:**
- ✅ Complete data isolation
- ✅ Single database server
- ✅ Better for scale
- ✅ Easier backups
- ✅ Better performance than SQLite
- ✅ Connection pooling
- ✅ ACID compliance

**Cons:**
- ⚠️ Requires PostgreSQL setup
- ⚠️ More complex infrastructure

---

## 🚀 Recommended Implementation Plan

### Phase 1: Implement Database-per-Tenant (SQLite)
**Timeline: Immediate**

This is the quickest path to multi-tenancy with your current setup.

### Phase 2: Migration to PostgreSQL with Schemas
**Timeline: Future (when scaling)**

Better long-term solution for production SaaS.

---

## 📋 Implementation Requirements

### 1. Master Database (Tenant Registry)
Stores all company/tenant information:

```sql
CREATE TABLE tenants (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,  -- e.g., 'acme-corp'
  database_name TEXT NOT NULL,      -- e.g., 'tenant_acme-corp'
  status TEXT DEFAULT 'active',     -- active, suspended, trial
  plan_type TEXT DEFAULT 'basic',   -- basic, pro, enterprise
  max_employees INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  subscription_ends_at TEXT,
  contact_email TEXT,
  contact_phone TEXT
);

CREATE TABLE tenant_users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  first_name TEXT,
  last_name TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  UNIQUE(tenant_id, email)
);
```

### 2. Tenant Identification Methods

#### Method A: Subdomain-based (Recommended)
- `acme-corp.payrollsmith.com` → ACME Corporation
- `techstart.payrollsmith.com` → TechStart Ltd
- `your-company.payrollsmith.com` → Your Company

#### Method B: Path-based
- `payrollsmith.com/acme-corp/...` → ACME Corporation
- `payrollsmith.com/techstart/...` → TechStart Ltd

#### Method C: Custom Domain
- `payroll.acmecorp.com` → ACME Corporation
- `hr.techstart.com` → TechStart Ltd

### 3. Tenant Context Middleware

```typescript
// Extract tenant from request
app.use(async (req, res, next) => {
  const subdomain = extractSubdomain(req.hostname);
  const tenant = await getTenantBySubdomain(subdomain);
  
  if (!tenant) {
    return res.status(404).json({ error: 'Company not found' });
  }
  
  req.tenant = tenant;
  req.db = await getOrCreateTenantDatabase(tenant.database_name);
  next();
});
```

### 4. Database Connection Management

```typescript
// Dynamic database connections
const tenantDatabases = new Map<string, Database>();

async function getTenantDatabase(tenantId: string): Promise<Database> {
  if (tenantDatabases.has(tenantId)) {
    return tenantDatabases.get(tenantId)!;
  }
  
  const dbPath = `./databases/tenant_${tenantId}.db`;
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  
  await initializeTenantTables(db);
  tenantDatabases.set(tenantId, db);
  
  return db;
}
```

---

## 🔐 Security Considerations

1. **Authentication**: User must belong to tenant
2. **Authorization**: All queries scoped to tenant database
3. **Data Leakage Prevention**: No cross-tenant queries possible
4. **Tenant Validation**: Always validate tenant before database access
5. **Rate Limiting**: Per-tenant rate limits
6. **Backup Isolation**: Each tenant's data backed up separately

---

## 📊 Database Migration Strategy

### For New Installations:
1. Create master database
2. On company signup, create new tenant database
3. Initialize all tables in tenant database
4. Create admin user for tenant

### For Existing Installation:
1. Create master database
2. Migrate current `payroll.db` to `tenant_default.db`
3. Create tenant record for existing company
4. Future companies get new databases

---

## 🎨 User Experience

### Company Signup Flow:
1. User visits `payrollsmith.com/signup`
2. Enters company details
3. Chooses subdomain: `[company-name].payrollsmith.com`
4. System creates:
   - Tenant record in master DB
   - New tenant database
   - Admin user account
5. User redirected to `company-name.payrollsmith.com/login`

### Login Flow:
1. User visits `company-name.payrollsmith.com/login`
2. System extracts `company-name` from subdomain
3. Looks up tenant in master DB
4. Authenticates user against tenant's database
5. All subsequent requests use that tenant's database

---

## 💾 Backup Strategy

### Per-Tenant Backups:
```bash
# Backup single tenant
sqlite3 databases/tenant_acme-corp.db ".backup databases/backups/tenant_acme-corp_2024-12-25.db"

# Automated daily backups
0 2 * * * /scripts/backup-all-tenants.sh
```

### Master Database Backup:
```bash
# Backup tenant registry
sqlite3 databases/master.db ".backup databases/backups/master_2024-12-25.db"
```

---

## 📈 Scaling Considerations

### Short-term (< 100 companies):
- ✅ Separate SQLite databases work well
- ✅ Simple to manage
- ✅ Good performance

### Medium-term (100-1000 companies):
- ⚠️ Consider migrating to PostgreSQL
- ⚠️ Use connection pooling
- ⚠️ Implement caching (Redis)

### Long-term (1000+ companies):
- 🚀 PostgreSQL with schemas mandatory
- 🚀 Load balancing
- 🚀 Database replication
- 🚀 Sharding by geography

---

## 🔧 Implementation Checklist

- [ ] Create master database schema
- [ ] Implement tenant identification middleware
- [ ] Create dynamic database connection manager
- [ ] Update all API routes to use tenant context
- [ ] Implement tenant signup/onboarding flow
- [ ] Create tenant management admin panel
- [ ] Update authentication to include tenant validation
- [ ] Implement per-tenant migrations
- [ ] Create backup/restore scripts
- [ ] Update email system to use tenant-specific settings
- [ ] Add tenant usage tracking
- [ ] Implement subscription management
- [ ] Create tenant analytics dashboard
- [ ] Add data export functionality
- [ ] Implement tenant deletion/suspension

---

## 🎯 Next Steps

1. **Choose Architecture**: Database-per-tenant (SQLite) recommended for quick start
2. **Implement Master Database**: Create tenant registry
3. **Add Tenant Middleware**: Extract and validate tenant from requests
4. **Update Database Layer**: Make all queries tenant-aware
5. **Create Signup Flow**: Allow new companies to register
6. **Update Email System**: Use tenant-specific email settings
7. **Test Thoroughly**: Ensure complete data isolation

---

## 📞 Questions to Answer

Before implementation, consider:

1. **Tenant Identification**: Subdomain, path, or custom domain?
2. **Signup Process**: Manual approval or automatic provisioning?
3. **Pricing Model**: Per-employee, flat rate, or tiered?
4. **Trial Period**: How long? Automatic conversion?
5. **Data Retention**: How long after subscription ends?
6. **Migration Plan**: How to handle existing data?
7. **Backup Strategy**: Frequency? Retention period?
8. **Compliance**: Data residency requirements?

---

This architecture ensures complete data isolation while maintaining scalability and ease of management. The database-per-tenant approach with SQLite is perfect for getting started quickly, with a clear path to PostgreSQL when needed.

