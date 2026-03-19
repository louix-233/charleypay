# Database Setup Summary

## ✅ What's Been Implemented

Your PayrollSmith app now supports **both DynamoDB and SQL databases** with automatic switching based on configuration.

### Key Features

1. **Unified Database Adapter** (`src/api/config/database-adapter.ts`)
   - Single interface for both database types
   - Automatic routing based on `DATABASE_TYPE` environment variable
   - Supports SQL (SQLite/PostgreSQL) and DynamoDB

2. **Environment Configuration** (`src/api/config/environment.ts`)
   - Added database type selection
   - Configuration for all database types

3. **Server Initialization** (`server.ts`)
   - Automatically initializes the selected database type
   - Tests connection on startup

4. **Documentation**
   - `DUAL_DATABASE_GUIDE.md` - Complete guide on using both databases
   - Updated `env.example` with database configuration options

## 🚀 Quick Start

### Option 1: Use SQLite (Default)
```env
DATABASE_TYPE=sqlite
SQLITE_DB_PATH=./payroll.db
```

### Option 2: Use DynamoDB
```env
DATABASE_TYPE=dynamodb
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

### Option 3: Use PostgreSQL
```env
DATABASE_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=payrollsmith_gh
DB_USER=postgres
DB_PASSWORD=your_password
```

## 📝 Current Route Structure

Your app currently has two sets of routes:

1. **SQL Routes** (`/api/sql/*`) - Use SQLite directly
   - These routes import from `../config/database`
   - Work with SQL queries

2. **DynamoDB Routes** (`/api/*`) - Use DynamoDB directly  
   - These routes import from `../config/dynamodb`
   - Use DynamoDB-specific methods (`getById`, `scan`, `create`)

## 🔄 Using the Unified Adapter

For new routes or when migrating existing routes, use the unified adapter:

```typescript
import { dbUtils, TABLES } from '../config/database-adapter';

// Works with both SQL and DynamoDB
const employees = await dbUtils.getRows('SELECT * FROM employees'); // SQL
const employee = await dbUtils.getById(TABLES.EMPLOYEES, 'id'); // DynamoDB
```

## ⚠️ Important Notes

1. **DynamoDB-Specific Methods**: Routes using `getById()`, `scan()`, or `create()` directly are DynamoDB-specific. These won't work with SQL databases unless you use the unified adapter.

2. **SQL Queries**: Routes using SQL queries (`SELECT`, `INSERT`, etc.) work with SQL databases. The adapter attempts to translate simple SQL to DynamoDB operations, but complex queries may not work.

3. **Migration**: To make a route work with both databases:
   - Use the unified adapter from `database-adapter.ts`
   - Avoid database-specific methods when possible
   - Test with both database types

## 🎯 Next Steps (Optional)

If you want to make all routes work with both databases:

1. Update routes to use the unified adapter
2. Replace DynamoDB-specific calls with adapter methods
3. Test with both database types
4. Consider creating database-agnostic service layers

## 📚 Documentation

- See `DUAL_DATABASE_GUIDE.md` for detailed usage instructions
- See `env.example` for all configuration options

