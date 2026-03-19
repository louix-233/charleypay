# Quick Build Guide - Windows Installer

## Build the Windows Installer

```bash
# Step 1: Install dependencies (if not already done)
npm install

# Step 2: Build the application
npm run build:electron

# Step 3: Create the Windows installer
npm run electron:dist
```

The installer will be created in the `release/` directory as:
- **PayrollSmith Setup 1.0.0.exe**

## What's Included

✅ NSIS installer with customizable installation directory  
✅ Desktop shortcut  
✅ Start menu shortcut  
✅ Uninstaller support  
✅ Application icon  

## Installation

Users can:
1. Download `PayrollSmith Setup 1.0.0.exe`
2. Run the installer
3. Choose installation directory (optional)
4. Launch from desktop or Start menu

## Troubleshooting

**Build fails?**
- Run `npm install` again
- Clear `node_modules` and reinstall
- Check Node.js version (needs v18+)

**No installer created?**
- Verify `dist/` and `dist-electron/` folders exist
- Check build output for errors
- Ensure electron-builder is installed: `npm list electron-builder`

