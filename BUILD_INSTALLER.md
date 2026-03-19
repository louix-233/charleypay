# Building Windows Installer for PayrollSmith

This guide will help you create a Windows `.exe` installer for the PayrollSmith desktop application.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Windows 10/11** (for building Windows installers)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Application

Build both the frontend and Electron main process:

```bash
npm run build:electron
```

This will:
- Build the React frontend (`dist/`)
- Compile the Electron main process (`dist-electron/`)

### 3. Create Windows Installer

Create the Windows installer:

```bash
npm run electron:dist
```

This will create a Windows installer in the `release/` directory:
- `PayrollSmith Setup 1.0.0.exe` - NSIS installer

## Build Scripts

- `npm run build` - Build frontend only
- `npm run build:electron` - Build frontend + Electron main process
- `npm run electron:dist` - Build everything and create Windows installer
- `npm run electron:dist:all` - Build installers for Windows, macOS, and Linux

## Installer Features

The Windows installer includes:

- ✅ **Customizable installation directory** - Users can choose where to install
- ✅ **Desktop shortcut** - Creates a shortcut on the desktop
- ✅ **Start menu shortcut** - Adds entry to Windows Start menu
- ✅ **Uninstaller** - Proper uninstallation support
- ✅ **Auto-updater ready** - Can be extended with auto-update functionality

## Output Location

After building, the installer will be in:
```
release/
  └── PayrollSmith Setup 1.0.0.exe
```

## Distribution

The installer can be distributed to users. They simply need to:
1. Download the `.exe` file
2. Run it
3. Follow the installation wizard
4. Launch PayrollSmith from the desktop shortcut or Start menu

## Troubleshooting

### Build Fails

1. **Clear node_modules and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Electron version compatibility**:
   ```bash
   npm list electron
   ```

3. **Verify all dependencies are installed**:
   ```bash
   npm install --save-dev electron-builder
   ```

### Installer Not Created

1. Check that `build:electron` completed successfully
2. Verify `dist/` and `dist-electron/` directories exist
3. Check for errors in the build output

### Icon Issues

If the icon doesn't appear:
1. Ensure `public/favicon.ico` exists
2. For better results, use a `.ico` file with multiple sizes (16x16, 32x32, 48x48, 256x256)

## Advanced Configuration

Edit `package.json` to customize:
- App name and version
- Installer options
- Icon paths
- Build targets

## Code Signing (Optional)

For distribution, you may want to code sign the installer:

1. Obtain a code signing certificate
2. Add to `package.json`:
   ```json
   "win": {
     "certificateFile": "path/to/certificate.pfx",
     "certificatePassword": "password"
   }
   ```

## Next Steps

After creating the installer:
1. Test it on a clean Windows machine
2. Verify all features work correctly
3. Consider adding auto-update functionality
4. Set up distribution channels (website, app store, etc.)

