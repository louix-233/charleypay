/**
 * Offline Capabilities Test Script
 * Run this in the browser console (DevTools) to test offline functionality
 */

// Test offline service
async function testOfflineService() {
  console.log('🧪 Testing Offline Service...\n');

  // Check if offline service exists
  if (typeof window === 'undefined' || !window.offlineService) {
    console.error('❌ Offline service not found. Make sure you\'re in Electron app.');
    return;
  }

  const service = window.offlineService;

  // Test 1: Check online status
  console.log('Test 1: Online Status');
  console.log('  Is Online:', service.getIsOnline());
  console.log('  Navigator Online:', navigator.onLine);
  console.log('');

  // Test 2: Check sync queue
  console.log('Test 2: Sync Queue');
  const queue = service.getSyncQueue();
  const pendingCount = service.getPendingSyncCount();
  console.log('  Pending Items:', pendingCount);
  console.log('  Queue:', queue);
  console.log('');

  // Test 3: Add test item to sync queue
  console.log('Test 3: Add Test Item');
  const testId = service.addToSyncQueue('create', '/api/test', { test: true });
  console.log('  Added item ID:', testId);
  console.log('  New pending count:', service.getPendingSyncCount());
  console.log('');

  // Test 4: Check queue persistence
  console.log('Test 4: Queue Persistence');
  const stored = localStorage.getItem('syncQueue');
  console.log('  Stored in localStorage:', stored ? 'Yes' : 'No');
  if (stored) {
    const parsed = JSON.parse(stored);
    console.log('  Stored items:', parsed.length);
  }
  console.log('');

  // Test 5: Manual sync (if online)
  if (service.getIsOnline()) {
    console.log('Test 5: Manual Sync');
    console.log('  Attempting sync...');
    try {
      await service.sync();
      console.log('  ✅ Sync completed');
      console.log('  Remaining pending:', service.getPendingSyncCount());
    } catch (error) {
      console.error('  ❌ Sync failed:', error);
    }
    console.log('');
  } else {
    console.log('Test 5: Manual Sync (Skipped - Offline)');
    console.log('');
  }

  // Test 6: Status change listener
  console.log('Test 6: Status Change Listener');
  const unsubscribe = service.onStatusChange((isOnline) => {
    console.log('  Status changed:', isOnline ? 'Online' : 'Offline');
  });
  console.log('  Listener registered');
  console.log('  (Disconnect/reconnect internet to test)');
  console.log('');

  console.log('✅ Tests completed!');
  console.log('\nTo remove test item:');
  console.log('  service.removeFromSyncQueue("' + testId + '")');
  console.log('\nTo clear all:');
  console.log('  service.clearSyncQueue()');

  return {
    service,
    testId,
    unsubscribe
  };
}

// Test database connectivity
async function testDatabase() {
  console.log('🧪 Testing Database...\n');

  if (typeof window === 'undefined' || !window.electronAPI) {
    console.error('❌ Electron API not found. Make sure you\'re in Electron app.');
    return;
  }

  try {
    const dbPath = await window.electronAPI.getDatabasePath();
    console.log('✅ Database Path:', dbPath);

    const userDataPath = await window.electronAPI.getUserDataPath();
    console.log('✅ User Data Path:', userDataPath);
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

// Monitor sync queue changes
function monitorSyncQueue() {
  if (typeof window === 'undefined' || !window.offlineService) {
    console.error('❌ Offline service not found.');
    return;
  }

  const service = window.offlineService;
  let lastCount = service.getPendingSyncCount();

  console.log('👀 Monitoring sync queue...');
  console.log('  Initial pending:', lastCount);
  console.log('  (Watch for changes)\n');

  const interval = setInterval(() => {
    const currentCount = service.getPendingSyncCount();
    if (currentCount !== lastCount) {
      console.log(`📊 Sync queue changed: ${lastCount} → ${currentCount}`);
      lastCount = currentCount;
    }
  }, 1000);

  // Return function to stop monitoring
  return () => {
    clearInterval(interval);
    console.log('🛑 Stopped monitoring');
  };
}

// Simulate offline mode (for testing)
function simulateOffline() {
  console.log('📴 Simulating offline mode...');
  console.log('  Note: This only affects the browser\'s navigator.onLine');
  console.log('  For real offline testing, disconnect your internet connection.');
  console.log('');
  console.log('  To simulate:');
  console.log('    1. Open DevTools → Network tab');
  console.log('    2. Set throttling to "Offline"');
  console.log('    3. Or disconnect WiFi/Ethernet');
}

// Export test functions
if (typeof window !== 'undefined') {
  window.testOffline = {
    testOfflineService,
    testDatabase,
    monitorSyncQueue,
    simulateOffline
  };

  console.log('✅ Offline test utilities loaded!');
  console.log('\nAvailable functions:');
  console.log('  testOffline.testOfflineService() - Run all offline service tests');
  console.log('  testOffline.testDatabase() - Test database paths');
  console.log('  testOffline.monitorSyncQueue() - Monitor sync queue changes');
  console.log('  testOffline.simulateOffline() - Show offline simulation guide');
  console.log('\nQuick test:');
  console.log('  testOffline.testOfflineService()');
}

