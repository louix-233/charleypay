# Quick Offline Test Guide

## 🚀 Quick Start

1. **Start the Electron app:**
   ```bash
   npm run dev:electron
   ```

2. **Open DevTools:**
   - Press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)
   - Or use menu: View → Toggle Developer Tools

3. **Load test utilities:**
   - Copy contents of `test-offline.js`
   - Paste into console and press Enter
   - Or run: `node test-offline.js` (if running in Node context)

4. **Run tests:**
   ```javascript
   // Quick test
   testOffline.testOfflineService()
   
   // Test database
   testOffline.testDatabase()
   
   // Monitor sync queue
   const stopMonitoring = testOffline.monitorSyncQueue()
   // Later: stopMonitoring()
   ```

## 📋 Manual Test Checklist

### ✅ Basic Offline Test (5 minutes)

- [ ] App loads while online
- [ ] Offline indicator shows green (online)
- [ ] Disconnect internet
- [ ] Offline indicator shows red (offline)
- [ ] Create a new employee while offline
- [ ] Verify employee appears in list
- [ ] Check offline indicator shows "1 pending"
- [ ] Reconnect internet
- [ ] Verify sync happens automatically
- [ ] Check offline indicator shows green (synced)

### ✅ Advanced Test (10 minutes)

- [ ] Make multiple changes offline (create, update, delete)
- [ ] Verify all changes saved locally
- [ ] Close app completely
- [ ] Reopen app (still offline)
- [ ] Verify pending sync count preserved
- [ ] Go online
- [ ] Verify all items sync
- [ ] Check console for sync logs

### ✅ Retry Logic Test (5 minutes)

- [ ] Make changes offline
- [ ] Go online but block API (firewall/network settings)
- [ ] Watch console for retry attempts
- [ ] Verify items removed after 5 failed retries
- [ ] Check console warnings

## 🔍 What to Look For

### Console Messages

**Good signs:**
- `🔄 Syncing X pending items...`
- `✅ Synced: [operation] [endpoint]`
- `📦 Loaded X items from sync queue`
- `✅ All items synced successfully`

**Warning signs:**
- `❌ Failed to sync: [operation] [endpoint]`
- `⚠️ Removing item after 5 failed retries`
- `⚠️ X items failed to sync`

### UI Indicators

- **Green WiFi icon**: Online, all synced
- **Yellow cloud icon**: Online, pending syncs
- **Red WiFi-off icon**: Offline mode

### Database

- Data should be accessible offline
- Changes should persist across app restarts
- SQLite database in user data directory

## 🐛 Troubleshooting

### Offline indicator not showing
- Verify you're running in Electron (not browser)
- Check `window.electronAPI` exists in console

### Sync not working
- Check internet connection
- Verify API endpoints are accessible
- Check console for errors

### Data not persisting
- Verify `DATABASE_TYPE=sqlite` in .env
- Check database file exists in user data directory
- Check console for database errors

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Basic Test: [ ] Pass [ ] Fail
Advanced Test: [ ] Pass [ ] Fail
Retry Logic Test: [ ] Pass [ ] Fail

Issues Found:
_________________________________
_________________________________
_________________________________

Notes:
_________________________________
_________________________________
_________________________________
```

