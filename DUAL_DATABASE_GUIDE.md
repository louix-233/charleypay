# Dual Database Support Guide

PayrollSmith now supports both **DynamoDB** and **SQL** (SQLite/PostgreSQL) databases. You can switch between them using environment variables.

## 🎯 Quick Start

### 1. Choose Your Database Type

Set the `DATABASE_TYPE` environment variable to one of:
- `sqlite` - SQLite (default, local file-based database)
- `postgresql` - PostgreSQL (requires separate PostgreSQL server)
- `dynamodb` - AWS DynamoDB (requires AWS credentials)

### 2. Configure Environment Variables

#### For SQLite (Default)
```env
DATABASE_TYPE=sqlite
SQLITE_DB_PATH=./payroll.db
```

#### For PostgreSQL
```env
DATABASE_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=payrollsmith_gh
DB_USER=postgres
DB_PASSWORD=your_password
```

#### For DynamoDB
```env
DATABASE_TYPE=dynamodb
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

## 📊 Database Adapter

The app uses a unified database adapter that automatically routes queries to the appropriate database based on your configuration.

### Using the Adapter in Your Code

```typescript
import { dbUtils, testConnection, initializeTables } from '../config/database-adapter';

// Test connection
const connected = await testConnection();

// Initialize tables
await initializeTables();

// Use database operations (works with both SQL and DynamoDB)
const employees = await dbUtils.getRows('SELECT * FROM employees');
const employee = await dbUtils.getById('payroll-employees', 'employee-id'); // DynamoDB
const employee = await dbUtils.getRow('SELECT * FROM employees WHERE id = ?', ['employee-id']); // SQL
```

## 🔄 Switching Between Databases

### From SQLite to DynamoDB

1. Set environment variables:
```env
DATABASE_TYPE=dynamodb
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

2. Restart the server - tables will be auto-created in DynamoDB

### From DynamoDB to SQLite

1. Set environment variables:
```env
DATABASE_TYPE=sqlite
SQLITE_DB_PATH=./payroll.db
```

2. Restart the server - SQLite database will be created/used

## 📝 Database-Specific Features

### SQL (SQLite/PostgreSQL)
- ✅ Full SQL query support
- ✅ Complex joins and aggregations
- ✅ Transactions
- ✅ ACID compliance
- ✅ Local file-based (SQLite) or server-based (PostgreSQL)

### DynamoDB
- ✅ NoSQL document storage
- ✅ Auto-scaling
- ✅ Managed service (no server maintenance)
- ✅ High availability
- ✅ Pay-per-request pricing
- ⚠️ Limited query capabilities (no complex joins)
- ⚠️ Requires AWS account

## 🛠️ Implementation Details

### Database Adapter Interface

The adapter provides a unified interface for both database types:

```typescript
interface DatabaseAdapter {
  // Query operations
  query(text: string, params?: any[]): Promise<any>;
  getRow(text: string, params?: any[]): Promise<any>;
  getRows(text: string, params?: any[]): Promise<any[]>;
  
  // Write operations
  insert(text: string, params?: any[]): Promise<any>;
  update(text: string, params?: any[]): Promise<any>;
  delete(text: string, params?: any[]): Promise<any>;
  execute(text: string, params?: any[]): Promise<any>;
  
  // DynamoDB-specific (optional)
  create?(tableName: string, item: any): Promise<any>;
  getById?(tableName: string, id: string): Promise<any>;
  scan?(tableName: string, filter?: any): Promise<any[]>;
}
```

### How It Works

1. **Configuration**: The adapter reads `DATABASE_TYPE` from environment
2. **Factory Pattern**: Returns appropriate adapter (SQL or DynamoDB)
3. **Query Translation**: DynamoDB adapter translates SQL-like queries to DynamoDB operations
4. **Automatic Fallback**: If DynamoDB credentials are missing, falls back to SQLite

## 🔍 Current Route Implementation

The app currently has two sets of routes:

1. **SQL Routes** (`/api/sql/*`) - Use SQLite directly
   - `sql-employees.ts`
   - `sql-allowances.ts`
   - `sql-deductions.ts`
   - etc.

2. **DynamoDB Routes** (`/api/*`) - Use DynamoDB directly
   - `employees.ts`
   - `allowances.ts`
   - `deductions.ts`
   - etc.

### Migrating Routes to Use Unified Adapter

To make routes work with both databases, import from `database-adapter`:

```typescript
// Before (SQL only)
import { dbUtils } from '../config/database';

// Before (DynamoDB only)
import { dbUtils } from '../config/dynamodb';

// After (works with both)
import { dbUtils } from '../config/database-adapter';
```

## 🚀 Best Practices

1. **Development**: Use SQLite for local development (no setup required)
2. **Production**: Choose based on your needs:
   - **SQLite**: Simple deployments, single server
   - **PostgreSQL**: Complex queries, multi-user, production-ready
   - **DynamoDB**: Cloud-native, auto-scaling, managed service

3. **Testing**: Test with both databases to ensure compatibility

4. **Migration**: Export data from one database and import to another when switching

## 📋 Environment Variables Reference

```env
# Database Type (required)
DATABASE_TYPE=sqlite|postgresql|dynamodb

# SQLite Configuration
SQLITE_DB_PATH=./payroll.db

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=payrollsmith_gh
DB_USER=postgres
DB_PASSWORD=your_password

# DynamoDB Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# JWT Configuration
JWT_SECRET=your-secret-key

# Server Configuration
PORT=5173
NODE_ENV=development

# Tax Rates
SSNIT_RATE=0.055
NHIL_RATE=0.025
```

## 🆘 Troubleshooting

### DynamoDB Not Working
- Check AWS credentials are set correctly
- Verify AWS region is correct
- Ensure IAM user has DynamoDB permissions
- Check AWS CLI configuration: `aws configure list`

### SQLite Not Working
- Check file permissions for database directory
- Ensure SQLite path is writable
- Verify SQLite3 is installed

### PostgreSQL Not Working
- Verify PostgreSQL server is running
- Check connection credentials
- Ensure database exists
- Check firewall/network settings

### Switching Issues
- Clear any cached database connections
- Restart the server after changing `DATABASE_TYPE`
- Verify environment variables are loaded correctly

## 📚 Additional Resources

- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/)

