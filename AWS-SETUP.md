# 🚀 AWS Setup Guide for PayrollSmith

This guide will help you configure AWS credentials for the PayrollSmith application to enable full backend functionality with DynamoDB.

## 📋 Prerequisites

1. **AWS Account**: You need an AWS account
2. **AWS CLI**: Install AWS CLI (optional but recommended)
3. **DynamoDB Access**: Your AWS account needs DynamoDB permissions

## 🔑 Step 1: Create AWS IAM User

### 1.1 Log into AWS Console
- Go to [AWS Console](https://console.aws.amazon.com/)
- Navigate to **IAM** (Identity and Access Management)

### 1.2 Create IAM User
1. Click **Users** → **Create user**
2. Enter username: `payrollsmith-user`
3. Select **Programmatic access**
4. Click **Next: Permissions**

### 1.3 Attach Permissions
1. Click **Attach existing policies directly**
2. Search for and select:
   - `AmazonDynamoDBFullAccess` (for full DynamoDB access)
   - Or create a custom policy with minimal permissions (see below)

### 1.4 Create Custom Policy (Optional - More Secure)
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:CreateTable",
                "dynamodb:DeleteTable",
                "dynamodb:DescribeTable",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Scan",
                "dynamodb:Query"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/payroll-*"
        }
    ]
}
```

### 1.5 Complete User Creation
1. Click **Next: Tags** (optional)
2. Click **Next: Review**
3. Click **Create user**

### 1.6 Save Credentials
**IMPORTANT**: Save the Access Key ID and Secret Access Key - you won't see the secret key again!

## 🔧 Step 2: Configure Credentials

### Option A: Environment Variables (Recommended)

#### Windows (PowerShell)
```powershell
$env:AWS_ACCESS_KEY_ID="your-access-key-id"
$env:AWS_SECRET_ACCESS_KEY="your-secret-access-key"
$env:AWS_REGION="us-east-1"
```

#### Windows (Command Prompt)
```cmd
set AWS_ACCESS_KEY_ID=your-access-key-id
set AWS_SECRET_ACCESS_KEY=your-secret-access-key
set AWS_REGION=us-east-1
```

#### Create .env file (Alternative)
Create a `.env` file in your project root:
```env
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Option B: AWS CLI Configuration
```bash
aws configure
```
Enter your credentials when prompted.

## 🌍 Step 3: Choose AWS Region

Recommended regions:
- **us-east-1** (N. Virginia) - Default, most services available
- **us-west-2** (Oregon) - Good performance
- **eu-west-1** (Ireland) - Good for European users
- **ap-southeast-1** (Singapore) - Good for Asian users

## 🗄️ Step 4: DynamoDB Tables

The application will automatically create these tables when it starts:

1. **payroll-users** - System users and authentication
2. **payroll-employees** - Employee records
3. **payroll-periods** - Payroll processing periods
4. **payroll-records** - Individual payroll calculations
5. **payroll-allowance-types** - Allowance type definitions
6. **payroll-employee-allowances** - Employee allowance assignments
7. **payroll-payslips** - Generated payslip records

## 🚀 Step 5: Test Configuration

1. **Start the server**:
   ```bash
   npm run dev
   ```

2. **Check the output**:
   - ✅ Should show: "🚀 Server running on http://localhost:5173"
   - ✅ Should show: "📊 API available at http://localhost:5173/api"
   - ✅ Should NOT show: "⚠️ Running in frontend-only mode"

3. **Test API endpoint**:
   ```bash
   curl http://localhost:5173/api/health
   ```
   Should return: `{"status":"OK","mode":"full"}`

## 🔒 Security Best Practices

1. **Never commit credentials** to version control
2. **Use IAM roles** in production (not access keys)
3. **Rotate access keys** regularly
4. **Use least privilege** principle for permissions
5. **Enable CloudTrail** for audit logging

## 🛠️ Troubleshooting

### Common Issues:

1. **"API routes not loaded"**
   - Check if AWS credentials are set correctly
   - Verify IAM user has DynamoDB permissions

2. **"Access Denied" errors**
   - Check IAM permissions
   - Verify region is correct

3. **"Table not found"**
   - Tables are created automatically on first use
   - Check DynamoDB console in your AWS region

4. **"Invalid credentials"**
   - Verify access key and secret key are correct
   - Check if credentials are expired

### Debug Commands:
```bash
# Test AWS credentials
aws sts get-caller-identity

# List DynamoDB tables
aws dynamodb list-tables --region us-east-1
```

## 📞 Support

If you encounter issues:
1. Check AWS CloudWatch logs
2. Verify IAM permissions
3. Test with AWS CLI first
4. Check the application logs for specific error messages

---

**Next Steps**: After configuring AWS credentials, restart the server and you'll have full backend functionality with DynamoDB!
