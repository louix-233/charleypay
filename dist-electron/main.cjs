"use strict";
const { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain, shell, net } = require("electron");
const { join } = require("path");
const path = require("path");
let mainWindow = null;
let tray = null;
let isQuitting = false;
const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
const isWindows = process.platform === "win32";
const getDistPath = () => {
  if (isDev) {
    return path.join(__dirname, "..", "dist");
  }
  const appPath = app.getAppPath();
  return path.join(appPath, "dist");
};
const getDatabasePath = () => {
  const userDataPath = app.getPath("userData");
  return join(userDataPath, "payroll.db");
};
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1e3,
    minHeight: 700,
    backgroundColor: "#1a1a1a",
    titleBarStyle: isWindows ? "default" : "hiddenInset",
    frame: true,
    show: false,
    // Don't show until ready
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: false
    },
    icon: isWindows ? join(__dirname, "..", "public", "favicon.ico") : void 0
  });
  if (isDev && process.env.NODE_ENV !== "production") {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    const distPath = getDistPath();
    const indexPath = join(distPath, "index.html");
    console.log("Loading from:", indexPath);
    console.log("Dist path:", distPath);
    mainWindow.loadFile(indexPath).catch((error) => {
      console.error("Failed to load file:", error);
      const fileUrl = `file://${indexPath.replace(/\\/g, "/")}`;
      console.log("Trying to load as URL:", fileUrl);
      mainWindow.loadURL(fileUrl).catch((urlError) => {
        console.error("Failed to load URL:", urlError);
      });
    });
  }
  mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
    console.error("Failed to load:", {
      errorCode,
      errorDescription,
      validatedURL
    });
  });
  mainWindow.webContents.on("crashed", (event, killed) => {
    console.error("Renderer process crashed:", killed);
  });
  mainWindow.webContents.on("unresponsive", () => {
    console.error("Renderer process became unresponsive");
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow == null ? void 0 : mainWindow.show();
    if (isDev) {
      mainWindow == null ? void 0 : mainWindow.webContents.openDevTools();
    }
  });
  mainWindow.on("close", (event) => {
    if (process.platform === "darwin") {
      return;
    }
    if (!isQuitting) {
      event.preventDefault();
      mainWindow == null ? void 0 : mainWindow.hide();
      return;
    }
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("http://localhost") && !url.startsWith("file://")) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}
function createTray() {
  const iconPath = isWindows ? join(__dirname, "..", "public", "favicon.ico") : join(__dirname, "..", "public", "favicon.ico");
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
      label: "Show PayrollSmith",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createWindow();
        }
      }
    },
    {
      label: "Quit",
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip("PayrollSmith");
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
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
function createMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "New Employee",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            mainWindow == null ? void 0 : mainWindow.webContents.send("menu-action", "new-employee");
          }
        },
        {
          label: "Process Payroll",
          accelerator: "CmdOrCtrl+P",
          click: () => {
            mainWindow == null ? void 0 : mainWindow.webContents.send("menu-action", "process-payroll");
          }
        },
        { type: "separator" },
        {
          label: "Settings",
          accelerator: "CmdOrCtrl+,",
          click: () => {
            mainWindow == null ? void 0 : mainWindow.webContents.send("menu-action", "open-settings");
          }
        },
        { type: "separator" },
        {
          label: "Quit",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            isQuitting = true;
            app.quit();
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo", label: "Undo" },
        { role: "redo", label: "Redo" },
        { type: "separator" },
        { role: "cut", label: "Cut" },
        { role: "copy", label: "Copy" },
        { role: "paste", label: "Paste" },
        { role: "selectAll", label: "Select All" }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload", label: "Reload" },
        { role: "forceReload", label: "Force Reload" },
        { role: "toggleDevTools", label: "Toggle Developer Tools" },
        { type: "separator" },
        { role: "resetZoom", label: "Actual Size" },
        { role: "zoomIn", label: "Zoom In" },
        { role: "zoomOut", label: "Zoom Out" },
        { type: "separator" },
        { role: "togglefullscreen", label: "Toggle Fullscreen" }
      ]
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize", label: "Minimize" },
        { role: "close", label: "Close" }
      ]
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About PayrollSmith",
          click: () => {
            mainWindow == null ? void 0 : mainWindow.webContents.send("menu-action", "show-about");
          }
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
function setupIpcHandlers() {
  ipcMain.handle("get-database-path", () => {
    return getDatabasePath();
  });
  ipcMain.handle("get-app-version", () => {
    return app.getVersion();
  });
  ipcMain.handle("check-online-status", () => {
    const isOnline = net.isOnline();
    if (mainWindow) {
      mainWindow.webContents.send("online-status-changed", isOnline);
    }
    return isOnline;
  });
  ipcMain.handle("minimize-to-tray", () => {
    if (mainWindow) {
      mainWindow.hide();
    }
  });
  ipcMain.handle("get-user-data-path", () => {
    return app.getPath("userData");
  });
  ipcMain.handle("open-external", (_, url) => {
    shell.openExternal(url);
  });
}
app.whenReady().then(() => {
  createWindow();
  createMenu();
  createTray();
  setupIpcHandlers();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform === "darwin") {
    return;
  }
  if (isQuitting) {
    app.quit();
  }
});
app.on("before-quit", () => {
  isQuitting = true;
});
app.on("web-contents-created", (_, contents) => {
  contents.on("new-window", (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});
if (isDev) {
  app.on("certificate-error", (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
  });
}
