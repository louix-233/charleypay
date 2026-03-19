# Email Sending System for Payslips - Setup Guide

This guide will help you configure and use the email sending system for sending payslips to employees.

## 📋 Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Configuration](#configuration)
4. [Gmail Setup](#gmail-setup)
5. [Testing](#testing)
6. [Usage](#usage)
7. [API Endpoints](#api-endpoints)
8. [Troubleshooting](#troubleshooting)

## ✨ Features

- **Individual Payslip Sending**: Send payslips to individual employees via email
- **Bulk Sending**: Send payslips to multiple employees at once
- **Period-based Sending**: Send all payslips for a specific month/year
- **Professional Email Templates**: Beautiful, responsive HTML email templates
- **Email Tracking**: Track which payslips have been sent
- **Error Handling**: Comprehensive error handling and reporting
- **Email Verification**: Test email configuration before sending

## 📦 Prerequisites

Before you can use the email sending system, ensure you have:

1. **Node.js** installed (already installed if your app is running)
2. **Nodemailer** package (already included in dependencies)
3. **Email Account** with SMTP access (Gmail recommended)
4. **App Password** for secure authentication (required for Gmail)

## ⚙️ Configuration

### Step 1: Copy Environment Variables

Copy the `.env.example` file to create your own `.env` file in the root directory:

```bash
cp env.example .env
```

### Step 2: Configure Email Settings

Add the following environment variables to your `.env` file:

```env
# Email Configuration (for sending payslips)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Important Notes:**
- `EMAIL_HOST`: SMTP server address (use `smtp.gmail.com` for Gmail)
- `EMAIL_PORT`: SMTP port (587 for TLS, 465 for SSL)
- `EMAIL_USER`: Your full email address
- `EMAIL_PASS`: Your email app password (NOT your regular password)

## 🔐 Gmail Setup

If you're using Gmail, follow these steps to create an App Password:

### Method 1: Using App Passwords (Recommended)

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled

2. **Create App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Enter "PayrollSmith Payslips" as the name
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env File**
   ```env
   EMAIL_USER=yourname@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

### Method 2: Using OAuth2 (Advanced)

For production environments, consider using OAuth2 authentication for better security.

### Alternative Email Providers

#### Outlook/Office 365
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

#### Custom SMTP Server
```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-password
```

## 🧪 Testing

### Step 1: Test Email Configuration

Before sending real payslips, verify your email configuration:

1. **Using the API Endpoint**

```bash
# Test email configuration
curl http://localhost:5173/api/sql/payslip-emails/test-config
```

Expected response:
```json
{
  "success": true,
  "message": "Email configuration is valid and working"
}
```

2. **Send a Test Email**

```bash
curl -X POST http://localhost:5173/api/sql/test-email/test \
  -H "Content-Type: application/json" \
  -d '{
    "employeeEmail": "test@example.com",
    "employeeName": "Test Employee",
    "companyName": "PayrollSmith"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Test payslip email sent successfully to test@example.com",
  "messageId": "<message-id@gmail.com>"
}
```

### Step 2: Send a Real Payslip (from UI)

1. Navigate to the **Payslips** page in your application
2. Find a payslip you want to send
3. Click the **Send** (✉️) button next to the payslip
4. Check the employee's email inbox for the payslip

## 📖 Usage

### From the UI (Recommended)

#### Send Individual Payslip

1. Go to **Payslips** page
2. Use filters to find the specific payslip
3. Click the **Send** button (envelope icon) for that payslip
4. Wait for confirmation toast message

#### Send Multiple Payslips (Bulk Send)

1. Go to **Payslips** page
2. Use filters to select the payslips you want to send (e.g., by month/year)
3. Click the **Send All Payslips** button at the top
4. Wait for the bulk send operation to complete
5. Review the summary of sent/failed emails

### Email Template Preview

The email includes:
- **Company branding** (with logo if configured)
- **Pay period** information
- **Earnings breakdown** (Basic Salary, Allowances, Reimbursements)
- **Deductions breakdown** (SSNIT, Tier 2, Tier 3, PAYE Tax)
- **Net Salary** (highlighted)
- Professional styling and responsive design

## 🔌 API Endpoints

### 1. Send Individual Payslip Email

**Endpoint:** `POST /api/sql/payslip-emails/send/:payslipId`

**Request Body:**
```json
{
  "companyName": "PayrollSmith"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payslip sent successfully to john.doe@example.com",
  "messageId": "<message-id@gmail.com>"
}
```

### 2. Send Bulk Payslips

**Endpoint:** `POST /api/sql/payslip-emails/send-bulk`

**Request Body:**
```json
{
  "payslipIds": ["payslip_123", "payslip_456"],
  "companyName": "PayrollSmith"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sent 2 of 2 payslips",
  "stats": {
    "total": 2,
    "successful": 2,
    "failed": 0,
    "skipped": 0
  }
}
```

### 3. Send Payslips for a Period

**Endpoint:** `POST /api/sql/payslip-emails/send-period`

**Request Body:**
```json
{
  "month": "December",
  "year": 2024,
  "companyName": "PayrollSmith"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sent 15 of 15 payslips for December 2024",
  "stats": {
    "total": 15,
    "successful": 15,
    "failed": 0,
    "skipped": 0
  }
}
```

### 4. Test Email Configuration

**Endpoint:** `GET /api/sql/payslip-emails/test-config`

**Response:**
```json
{
  "success": true,
  "message": "Email configuration is valid and working"
}
```

### 5. Send Test Email

**Endpoint:** `POST /api/sql/test-email/test`

**Request Body:**
```json
{
  "employeeEmail": "test@example.com",
  "employeeName": "Test Employee",
  "companyName": "PayrollSmith"
}
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. "Email configuration is missing"

**Problem:** Environment variables not set correctly

**Solution:**
- Verify `.env` file exists in the root directory
- Check that `EMAIL_USER` and `EMAIL_PASS` are set
- Restart the server after updating `.env`

#### 2. "Invalid login" or "Authentication failed"

**Problem:** Incorrect email credentials or app password

**Solution:**
- For Gmail, ensure you're using an App Password, not your regular password
- Verify the email and password are correct
- Check that 2-Factor Authentication is enabled for Gmail

#### 3. "Connection timeout" or "ETIMEDOUT"

**Problem:** Firewall or network blocking SMTP port

**Solution:**
- Check if port 587 (or 465) is open
- Try using port 465 with `secure: true` instead of 587
- Check your firewall settings
- Verify internet connection

#### 4. "Employee does not have an email address"

**Problem:** Employee record missing email

**Solution:**
- Update employee record to include email address
- Go to Employees page → Edit employee → Add email

#### 5. "Payslip not found"

**Problem:** Invalid payslip ID

**Solution:**
- Verify the payslip exists in the database
- Check the payslip ID is correct
- Regenerate payslips if necessary

#### 6. Rate Limiting

**Problem:** Too many emails sent too quickly

**Solution:**
- The system includes automatic rate limiting (500ms delay between emails)
- For large batches, consider sending in smaller groups
- Wait a few minutes between large batch sends

### Debug Mode

To enable detailed logging for email sending:

1. Check server console logs for detailed error messages
2. Look for `✅` (success) or `❌` (error) indicators in logs
3. Verify email service response codes

### Testing Email Delivery

1. **Check Spam Folder**: Sometimes emails may end up in spam
2. **Verify Email Address**: Ensure employee email addresses are correct
3. **Check Email Server Logs**: Look for delivery reports in your email provider

## 📊 Email Tracking

The system tracks email sending status:

- **email_sent**: Boolean flag indicating if email was sent
- **email_sent_at**: Timestamp of when email was sent

You can query this data from the payslips table to see which payslips have been sent.

## 🔒 Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use App Passwords** instead of regular passwords
3. **Enable 2-Factor Authentication** on your email account
4. **Rotate passwords** regularly
5. **Use environment-specific** email accounts for dev/staging/production
6. **Monitor email usage** to detect unauthorized access
7. **Set up SPF/DKIM records** for your domain (production)

## 📝 Email Template Customization

To customize the email template, edit:
- File: `src/api/services/emailService.ts`
- Function: `generatePayslipEmailTemplate()`

You can modify:
- Colors and styling
- Layout and structure
- Company branding
- Email content and wording

## 🎯 Production Deployment

For production environments:

1. **Use a dedicated email service** (SendGrid, AWS SES, Mailgun)
2. **Set up proper DNS records** (SPF, DKIM, DMARC)
3. **Monitor email delivery rates**
4. **Implement email bounce handling**
5. **Add unsubscribe functionality** if required
6. **Use queue system** for large batches
7. **Enable email logging and analytics**

## 📞 Support

If you encounter issues not covered in this guide:

1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with a simple email configuration first
4. Consult your email provider's SMTP documentation

## 🎉 Success!

Once configured, your payslip email system should be fully operational. Employees will receive professional, well-formatted payslips directly to their email addresses.

**Happy Sending! 📧**

