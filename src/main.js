const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow, overlay;

app.on('ready', () => {
  // Ventana principal (controlador)
  mainWindow = new BrowserWindow({
    width: 400,
    height: 200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('src/index.html');

  // Ventana de overlay (atenuación)
  overlay = new BrowserWindow({
    fullscreen: true,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  overlay.loadFile('src/overlay.html');
  overlay.setIgnoreMouseEvents(true);

  // Comunicación entre ventanas
  ipcMain.on('adjust-dim', (_, level) => {
    overlay.webContents.send('update-opacity', level / 100);
  });
});
