import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { fileURLToPath } from "url";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
let mainWindow;
let controlWindow;
const isDev = process.env.NODE_ENV === "development";
const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: isDev ? false : true,
    frame: isDev ? true : false,
    alwaysOnTop: isDev ? false : true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    backgroundColor: isDev ? "#000000" : "#00000000",
    skipTaskbar: false,
    resizable: true,
    show: true
  });
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173/#/");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname$1, "../dist/index.html"), {
      hash: "#/"
    });
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};
const createControlWindow = () => {
  controlWindow = new BrowserWindow({
    width: 400,
    height: 500,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    title: "MentraSim Control Panel",
    show: true
  });
  if (isDev) {
    controlWindow.loadURL("http://localhost:5173/#/connect");
  } else {
    controlWindow.loadFile(path.join(__dirname$1, "../dist/index.html"), {
      hash: "#/connect"
    });
  }
  controlWindow.on("closed", () => {
    controlWindow = null;
  });
};
app.whenReady().then(() => {
  createMainWindow();
  createControlWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
      createControlWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});
