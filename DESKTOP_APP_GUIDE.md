# PayrollSmith Desktop App Guide

## 🖥️ Overview

PayrollSmith now has a **desktop application** built with Electron that works **offline** using SQLite for local data storage. The app automatically syncs data when an internet connection is available.

## ✨ Features

### Offline-First Architecture
- ✅ **Works completely offline** - All data stored locally in SQLite
- ✅ **Automatic sync** - Changes sync to cloud when online
- ✅ **Queue system** - Failed operations are queued and retried
- ✅ **No internet required** - Full functionality without connection

### Desktop Integration
- ✅ **Native menus** - File, Edit, View, Window, Help menus
- ✅ **System tray** - Minimize to tray, quick access
- ✅ **Keyboard shortcuts** - Standard desktop shortcuts
- ✅ **Auto-start** - Optional startup with system
- ✅ **Native notifications** - System notifications (coming soon)

### Data Management
- ✅ **Local SQLite database** - Fast, reliable, no server needed
- ✅ **Automatic backups** - Database stored in user data directory
- ✅ **Sync queue** - Tracks pending syncs
- ✅ **Conflict resolution** - Handles sync conflicts gracefully

## 🚀 Getting Started

### Development

1. **Install dependencies** (if not already done):
```bash
npm install
```

2. **Start development mode**:
```bash
npm run dev:electron
```

This will:
- Start the Vite dev server on port 5173
- Launch Electron when the server is ready
- Enable hot reload for both frontend and Electron

### Building for Production

1. **Build the desktop app**:
```bash
npm run build:electron
```

2. **Create distributable packages**:
```bash
npm run electron:dist
```

This creates installers for:
- **Windows**: `.exe` installer
- **macOS**: `.dmg` and `.app`
- **Linux**: `.AppImage`, `.deb`, `.rpm`

## 📁 Project Structure

```
payroll-smith/
├── electron/
│   ├── main.ts          # Electron main process
│   ├── preload.ts       # Preload script (IPC bridge)
│   └── tsconfig.json    # TypeScript config for Electron
├── src/
│   ├── services/
│   │   └── offlineService.ts  # Offline detection & sync
│   └── components/
│       └── OfflineIndicator.tsx  # UI indicator
├── scripts/
│   └── build-electron.js  # Build script
└── package.json
```

## 🔧 Configuration

### Database Location

The desktop app uses SQLite stored in the user's data directory:

- **Windows**: `%APPDATA%\payroll-smith\payroll.db`
- **macOS**: `~/Library/Application Support/payroll-smith/payroll.db`
- **Linux**: `~/.config/payroll-smith/payroll.db`

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database (always SQLite for desktop)
DATABASE_TYPE=sqlite
SQLITE_DB_PATH=./payroll.db

# Server (runs locally in Electron)
PORT=5173
NODE_ENV=production

# JWT
JWT_SECRET=your-secret-key

# Tax Rates
SSNIT_RATE=0.055
NHIL_RATE=0.025
```

## 📱 Offline Functionality

### How It Works

1. **Local Storage**: All data is stored in SQLite locally
2. **Sync Queue**: Changes are queued when offline
3. **Auto-Sync**: Automatically syncs when connection is restored
4. **Conflict Handling**: Last-write-wins for conflicts

### Offline Indicator

The app shows an offline indicator in the header:
- 🟢 **Green WiFi icon**: Online, all synced
- 🟡 **Yellow cloud**: Online, pending syncs
- 🔴 **Red WiFi-off**: Offline mode

### Manual Sync

Click the "Sync" button in the offline indicator to manually trigger a sync.

## 🎯 Usage

### Running the Desktop App

1. **Development**:
   ```bash
   npm run dev:electron
   ```

2. **Production** (after build):
   ```bash
   npm run start:electron
   ```

### Keyboard Shortcuts

- `Ctrl/Cmd + N` - New Employee
- `Ctrl/Cmd + P` - Process Payroll
- `Ctrl/Cmd + ,` - Settings
- `Ctrl/Cmd + Q` - Quit
- `F11` - Toggle Fullscreen
- `Ctrl/Cmd + R` - Reload

### System Tray

- **Click tray icon**: Show/hide window
- **Right-click**: Context menu with options
- **Minimize**: Window minimizes to tray

## 🔄 Sync Behavior

### When Online
- Changes sync immediately
- Queue is processed automatically
- Real-time updates

### When Offline
- All operations work normally
- Changes are queued locally
- Queue syncs when connection restored

### Sync Queue
- View pending syncs in the offline indicator
- Manual sync available
- Failed syncs retry automatically (up to 5 times)

## 🛠️ Development

### Electron Main Process

The main process (`electron/main.ts`) handles:
- Window management
- System tray
- Menu creation
- IPC handlers
- Security

### Preload Script

The preload script (`electron/preload.ts`) exposes safe APIs to the renderer:
- Database path access
- Window controls
- Online status
- Menu actions

### Offline Service

The offline service (`src/services/offlineService.ts`) provides:
- Online/offline detection
- Sync queue management
- Automatic sync
- Status notifications

## 📦 Building & Distribution

### Build Scripts

- `npm run build:electron` - Build Electron main/preload
- `npm run electron:pack` - Package app (no installer)
- `npm run electron:dist` - Create installers

### Build Configuration

Edit `package.json` to customize:
- App name, version
- Icons
- Installer options
- Code signing (for distribution)

### Distribution

Built installers are in `dist/` directory:
- Windows: `dist/PayrollSmith Setup 1.0.0.exe`
- macOS: `dist/PayrollSmith-1.0.0.dmg`
- Linux: `dist/PayrollSmith-1.0.0.AppImage`

## 🔒 Security

### Best Practices
- ✅ Context isolation enabled
- ✅ Node integration disabled
- ✅ Preload script for safe IPC
- ✅ External links open in browser
- ✅ No remote module

### Data Security
- Database stored in user data directory
- No cloud sync by default (optional)
- Local-first architecture

## 🐛 Troubleshooting

### App Won't Start
1. Check Node.js version (18+)
2. Run `npm install` again
3. Clear `node_modules` and reinstall

### Database Issues
1. Check database path permissions
2. Verify SQLite is installed
3. Check user data directory access

### Sync Not Working
1. Check internet connection
2. Verify API endpoints
3. Check browser console for errors
4. Review sync queue in offline indicator

### Build Errors
1. Ensure all dependencies installed
2. Check TypeScript compilation
3. Verify Electron version compatibility

## 📚 Additional Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Vite Plugin Electron](https://github.com/alex8088/vite-plugin-electron)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

## 🆘 Support

For issues or questions:
1. Check this guide
2. Review console logs
3. Check Electron DevTools (Ctrl+Shift+I)
4. File an issue on GitHub

---

**Note**: The desktop app is designed to work offline-first. All data is stored locally, and sync is optional. This makes it perfect for environments with unreliable internet connections.

