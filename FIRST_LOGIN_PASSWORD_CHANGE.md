# Employee First Login Password Change Feature

This document describes the implementation of a feature that requires employees to change their password on their first login to the staff portal.

## Overview

When an admin or HR manager enables portal access for an employee and sets an initial password, the employee will be forced to change that password on their first login for security reasons.

## Database Changes

New columns have been added to the `employees` table:

- `portal_access` (BOOLEAN) - Whether the employee has portal access enabled
- `portal_password` (VARCHAR(255)) - Hashed password for portal access
- `password_changed_at` (TIMESTAMP) - When the password was last changed
- `must_change_password` (BOOLEAN) - Flag to force password change
- `first_login` (BOOLEAN) - Flag to indicate if this is the first login

## Implementation Details

### Backend Changes

1. **Database Migration**: Run the migration script to add new columns:
   ```bash
   node backend/scripts/add-portal-password-fields.js
   ```

2. **Enhanced Authentication**: The staff login endpoint now checks for first login and issues temporary tokens when password change is required.

3. **Password Change Endpoint**: New endpoint `/api/staff-auth/change-password` for staff to change their passwords.

### Frontend Changes

1. **Password Change Component**: `PasswordChangeRequired.tsx` provides a secure interface for password changes with:
   - Password strength indicator
   - Real-time validation
   - Security requirements display

2. **Updated Staff Login**: The `StaffLogin.tsx` page now handles the password change flow seamlessly.

## User Flow

1. **Admin enables portal access**:
   - Admin sets initial password for employee
   - Employee record is marked with `first_login = true` and `must_change_password = true`

2. **Employee first login**:
   - Employee enters employee ID and initial password
   - System detects first login and issues temporary token
   - Employee is presented with password change form

3. **Password change**:
   - Employee must create a strong password meeting requirements:
     - At least 8 characters long
     - Contains uppercase and lowercase letters
     - Contains at least one number
     - Contains at least one special character
   - Password strength is validated in real-time
   - Once changed, employee gets full access token

4. **Subsequent logins**:
   - Employee uses their new password for normal login
   - No password change required

## API Endpoints

### Staff Authentication

- `POST /api/staff-auth/login` - Staff login with first-time password change detection
- `POST /api/staff-auth/change-password` - Change staff password (accepts temporary tokens)
- `GET /api/staff-auth/me` - Get current staff user info

### Employee Management (Admin)

- `POST /api/employees/:id/set-password` - Set initial password and enable portal access

## Security Features

- **Temporary tokens**: Limited to 1 hour and only allow password changes
- **Password requirements**: Strong password policy enforced
- **Automatic flags**: First login and password change flags managed automatically
- **Token refresh**: New full access token issued after successful password change

## Usage Instructions

### For Administrators

1. Navigate to employee management
2. Select an employee and choose "Enable Portal Access"
3. Set an initial temporary password
4. Inform the employee of their employee ID and temporary password
5. Employee will be forced to change password on first login

### For Employees

1. Go to staff portal login page
2. Enter your employee ID and the temporary password provided by HR
3. If this is your first login, you'll be prompted to create a new password
4. Create a strong password following the requirements
5. Once password is set, you'll have full access to the portal

## Testing

Run the migration script first:
```bash
node backend/scripts/add-portal-password-fields.js
```

Then test the flow:
1. Set a password for an employee via admin interface
2. Try logging in as that employee
3. Verify password change is required
4. Complete password change and verify full access

## Error Handling

- Invalid temporary tokens are handled gracefully
- Password strength validation provides clear feedback
- Network errors are caught and displayed to users
- Fallback to login form if password change fails