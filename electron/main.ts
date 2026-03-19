const { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain, shell, net } = require('electron');
const { join } = require('path');
const path = require('path');

// Keep a global reference of the window object
let mainWindow: any = null;
let tray: any = null;
let isQuitting = false;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const isWindows = process.platform === 'win32';

// Start API server in production
function startApiServer() {
  if (!isDev || process.env.NODE_ENV === 'production') {
    try {
      console.log('🚀 Starting API server in production...');
      // Use process.resourcesPath if available, otherwise fallback to local path
      const serverPath = app.isPackaged 
        ? path.join(process.resourcesPath, 'app', 'dist-server', 'server.js')
        : path.join(__dirname, '..', 'dist-server', 'server.js');
      
      console.log('Server bundle path:', serverPath);
      
      // We use require to load the bundled CommonJS server
      // This will trigger the startServer() logic inside server.ts
      require(serverPath);
      console.log('✅ API server started successfully');
    } catch (error) {
      console.error('❌ Failed to start API server:', error);
    }
  }
}

// Get paths
const getAppPath = () => {
  if (isDev) {
    return __dirname;
  }
  // @ts-ignore - resourcesPath exists in Electron's process
  return path.join(process.resourcesPath || __dirname, 'app');
};

const getDistPath = () => {
  if (isDev) {
    return path.join(__dirname, '..', 'dist');
  }
  // In production, electron-builder packages files maintaining directory structure
  // Both dist/ and dist-electron/ are in the same directory in the packaged app
  // __dirname points to dist-electron/, so dist/ is at the same level
  // Use app.getAppPath() to get the app directory, then locate dist relative to it
  const appPath = app.getAppPath();
  // In packaged apps, dist is typically at the root of the app directory
  return path.join(appPath, 'dist');
};

// Database path for offline storage
const getDatabasePath = () => {
  const userDataPath = app.getPath('userData');
  return join(userDataPath, 'payroll.db');
};

// Create the application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#1a1a1a',
    titleBarStyle: isWindows ? 'default' : 'hiddenInset',
    frame: true,
    show: false, // Don't show until ready
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: false,
    },
    icon: isWindows 
      ? join(__dirname, '..', 'public', 'favicon.ico')
      : undefined,
  });

  // Load the app
  // When testing built app locally, use NODE_ENV=production to load from dist
  // Otherwise, in dev mode, try to load from dev server
  if (isDev && process.env.NODE_ENV !== 'production') {
    // Development: Load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
  } else {
    // Production or testing built files: Load from built files
    const distPath = getDistPath();
    const indexPath = join(distPath, 'index.html');
    console.log('Loading from:', indexPath);
    console.log('Dist path:', distPath);
    
    mainWindow.loadFile(indexPath).catch((error: Error) => {
      console.error('Failed to load file:', error);
      // Try loading as URL instead
      const fileUrl = `file://${indexPath.replace(/\\/g, '/')}`;
      console.log('Trying to load as URL:', fileUrl);
      mainWindow.loadURL(fileUrl).catch((urlError: Error) => {
        console.error('Failed to load URL:', urlError);
      });
    });
  }
  
  // Add error handlers
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', {
      errorCode,
      errorDescription,
      validatedURL
    });
  });
  
  mainWindow.webContents.on('crashed', (event, killed) => {
    console.error('Renderer process crashed:', killed);
  });
  
  mainWindow.webContents.on('unresponsive', () => {
    console.error('Renderer process became unresponsive');
  });

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    
    // Focus on window creation
    if (isDev) {
      mainWindow?.webContents.openDevTools();
    }
  });

  // Handle window close event (before window actually closes)
  mainWindow.on('close', (event) => {
    // On macOS, allow normal close behavior
    if (process.platform === 'darwin') {
      return;
    }
    
    // On Windows/Linux, minimize to tray instead of closing
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
      return;
    }
  });

  // Handle window closed (after window is destroyed)
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Prevent navigation to external URLs
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('http://localhost') && !url.startsWith('file://')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}

// Create system tray
function createTray() {
  const iconPath = isWindows
    ? join(__dirname, '..', 'public', 'favicon.ico')
    : join(__dirname, '..', 'public', 'favicon.ico');
  
  let icon;
  try {
    icon = nativeImage.createFromPath(iconPath);
    if (icon.isEmpty()) {
      icon = nativeImage.createEmpty();
    }
  } catch {
    icon = nativeImage.createEmpty();
  }
  
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show PayrollSmith',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createWindow();
        }
      },
    },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('PayrollSmith');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    } else {
      createWindow();
    }
  });
}

// Create application menu
function createMenu() {
  const template: any[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Employee',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'new-employee');
          },
        },
        {
          label: 'Process Payroll',
          accelerator: 'CmdOrCtrl+P',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'process-payroll');
          },
        },
        { type: 'separator' },
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'open-settings');
          },
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            isQuitting = true;
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo', label: 'Undo' },
        { role: 'redo', label: 'Redo' },
        { type: 'separator' },
        { role: 'cut', label: 'Cut' },
        { role: 'copy', label: 'Copy' },
        { role: 'paste', label: 'Paste' },
        { role: 'selectAll', label: 'Select All' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload', label: 'Reload' },
        { role: 'forceReload', label: 'Force Reload' },
        { role: 'toggleDevTools', label: 'Toggle Developer Tools' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Actual Size' },
        { role: 'zoomIn', label: 'Zoom In' },
        { role: 'zoomOut', label: 'Zoom Out' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Toggle Fullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize', label: 'Minimize' },
        { role: 'close', label: 'Close' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About PayrollSmith',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'show-about');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC Handlers
function setupIpcHandlers() {
  // Get database path
  ipcMain.handle('get-database-path', () => {
    return getDatabasePath();
  });

  // Get app version
  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });

  // Check online status
  ipcMain.handle('check-online-status', () => {
    // navigator.onLine is not available in the main process (Node.js context)
    // Use Electron's net.isOnline() instead, which works in the main process
    const isOnline = net.isOnline();
    if (mainWindow) {
      mainWindow.webContents.send('online-status-changed', isOnline);
    }
    return isOnline;
  });

  // Minimize to tray
  ipcMain.handle('minimize-to-tray', () => {
    if (mainWindow) {
      mainWindow.hide();
    }
  });

  // Get user data path
  ipcMain.handle('get-user-data-path', () => {
    return app.getPath('userData');
  });

  // Open external URL
  ipcMain.handle('open-external', (_, url: string) => {
    shell.openExternal(url);
  });
}

// App event handlers
app.whenReady().then(() => {
  startApiServer();
  createWindow();
  createMenu();
  createTray();
  setupIpcHandlers();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
});

app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  // On other platforms, the window close handler already prevents closing
  // and minimizes to tray, so we don't need to do anything here
  if (process.platform === 'darwin') {
    // macOS behavior: app stays running when all windows are closed
    return;
  }
  // For other platforms, if we reach here and isQuitting is true, quit the app
  // Otherwise, the window was already hidden to tray by the 'close' handler
  if (isQuitting) {
    app.quit();
  }
});

app.on('before-quit', () => {
  isQuitting = true;
});

// Security: Prevent new window creation
app.on('web-contents-created', (_, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

// Handle certificate errors (for development)
if (isDev) {
  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    // In development, ignore certificate errors
    event.preventDefault();
    callback(true);
  });
}
