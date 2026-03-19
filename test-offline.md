# Offline Capabilities Test Guide

This guide helps you test the PayrollSmith desktop app's offline functionality.

## Prerequisites

1. Build and run the Electron app:
   ```bash
   npm run dev:electron
   ```

2. Ensure you have some test data (employees, payroll records, etc.)

## Test Scenarios

### Test 1: Offline Detection

**Steps:**
1. Open the app in Electron
2. Check the header for the offline indicator
3. Disconnect your internet (disable WiFi/Ethernet)
4. Verify the indicator shows "Offline" status
5. Reconnect internet
6. Verify the indicator shows "Online" status

**Expected Results:**
- ✅ Indicator shows green WiFi icon when online
- ✅ Indicator shows red WiFi-off icon when offline
- ✅ Status updates automatically when connection changes

### Test 2: Create Data While Offline

**Steps:**
1. Ensure app is online and synced
2. Disconnect internet
3. Create a new employee
4. Create a new payroll record
5. Verify data appears in the UI immediately
6. Check the offline indicator shows pending sync count

**Expected Results:**
- ✅ Data is saved locally (SQLite)
- ✅ Data appears in UI immediately
- ✅ Offline indicator shows pending sync count (e.g., "2 pending")
- ✅ No errors in console

### Test 3: Sync Queue Persistence

**Steps:**
1. While offline, make several changes (create, update, delete)
2. Note the pending sync count
3. Close the app completely
4. Reopen the app (still offline)
5. Verify pending sync count is preserved
6. Go online
7. Verify items sync automatically

**Expected Results:**
- ✅ Sync queue persists across app restarts
- ✅ Pending sync count is preserved
- ✅ Items sync automatically when connection restored

### Test 4: Automatic Sync

**Steps:**
1. Make changes while offline
2. Note pending sync count
3. Reconnect internet
4. Wait a few seconds
5. Verify sync happens automatically
6. Check pending count decreases to 0

**Expected Results:**
- ✅ Sync starts automatically when online
- ✅ Pending count decreases as items sync
- ✅ Console shows sync progress
- ✅ All items sync successfully

### Test 5: Manual Sync

**Steps:**
1. Make changes while offline
2. Go online
3. Click "Sync" button in offline indicator
4. Verify sync happens immediately

**Expected Results:**
- ✅ Manual sync triggers immediately
- ✅ Pending items sync
- ✅ Status updates correctly

### Test 6: Retry Logic

**Steps:**
1. Make changes while offline
2. Go online but block API requests (use firewall or network settings)
3. Let sync attempts fail
4. Check console for retry messages
5. After 5 failed attempts, verify item is removed from queue

**Expected Results:**
- ✅ Failed syncs retry automatically
- ✅ Retry count increments
- ✅ Items removed after 5 failed retries
- ✅ Console shows warnings for removed items

### Test 7: View Data While Offline

**Steps:**
1. While online, load some data (employees, payroll, etc.)
2. Disconnect internet
3. Navigate through different pages
4. Verify all data is still accessible
5. Try searching/filtering data

**Expected Results:**
- ✅ All previously loaded data is accessible
- ✅ Search and filters work
- ✅ No "network error" messages
- ✅ UI remains responsive

### Test 8: Edit Data While Offline

**Steps:**
1. While offline, edit an existing employee
2. Update payroll records
3. Delete an item
4. Verify changes are saved locally
5. Go online and verify changes sync

**Expected Results:**
- ✅ Edits save to local database
- ✅ Changes appear immediately in UI
- ✅ Changes sync when online
- ✅ No data loss

## Testing Tools

### Browser DevTools (Electron)

1. Open DevTools: `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)
2. Go to Network tab
3. Throttle network to "Offline" to simulate offline mode
4. Or use "Slow 3G" to test sync behavior

### Console Logs

Watch the console for:
- `🔄 Syncing X pending items...`
- `✅ Synced: [operation] [endpoint]`
- `❌ Failed to sync: [operation] [endpoint]`
- `⚠️ Removing item after 5 failed retries`
- `📦 Loaded X items from sync queue`

### Check Sync Queue

In the browser console:
```javascript
// Check offline service status
window.offlineService?.getPendingSyncCount()
window.offlineService?.getSyncQueue()
```

## Common Issues

### Issue: Sync queue not persisting
**Solution:** Check browser localStorage is enabled and not cleared

### Issue: Offline indicator not showing
**Solution:** Verify `window.electronAPI` exists (Electron only feature)

### Issue: Sync not happening automatically
**Solution:** Check internet connection and API endpoint accessibility

### Issue: Data not saving offline
**Solution:** Verify SQLite database is working and DATABASE_TYPE=sqlite

## Success Criteria

✅ All test scenarios pass
✅ No data loss when going offline/online
✅ Sync queue works correctly
✅ Retry logic functions properly
✅ UI remains responsive offline
✅ Data persists across app restarts

