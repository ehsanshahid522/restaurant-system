const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

// Installed app files are read-only, so data lives in the user's AppData folder.
// In development (npm start) the project's own database folder is used.
function getDbDir() {
  return app.isPackaged
    ? path.join(app.getPath('userData'), 'database')
    : path.join(__dirname, 'database');
}

// On first run or update of the installed app, copy/refresh default menu/orders/settings.
function seedDatabase() {
  if (!app.isPackaged) return;
  const dbDir = getDbDir();
  const defaultsDir = path.join(__dirname, 'database');
  try {
    fs.mkdirSync(dbDir, { recursive: true });

    // Seed or refresh menu.json if newer flyer assets are available
    const menuTarget = path.join(dbDir, 'menu.json');
    const menuSource = path.join(defaultsDir, 'menu.json');
    if (fs.existsSync(menuSource)) {
      if (!fs.existsSync(menuTarget)) {
        fs.copyFileSync(menuSource, menuTarget);
      } else {
        try {
          const existing = JSON.parse(fs.readFileSync(menuTarget, 'utf-8'));
          const isComplete = Array.isArray(existing) && existing.length >= 80;
          if (!isComplete) {
            fs.copyFileSync(menuSource, menuTarget);
          }
        } catch (e) {
          fs.copyFileSync(menuSource, menuTarget);
        }
      }
    }

    ['orders.json', 'settings.json'].forEach((file) => {
      const target = path.join(dbDir, file);
      const source = path.join(defaultsDir, file);
      if (!fs.existsSync(target) && fs.existsSync(source)) {
        fs.copyFileSync(source, target);
      }
    });
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 860,
    minWidth: 1080,
    minHeight: 700,
    backgroundColor: '#0c0e12',
    icon: path.join(__dirname, 'assets', 'logo.png'),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers for offline disk sync
ipcMain.handle('read-json', async (event, filename) => {
  try {
    const filePath = path.join(getDbDir(), filename);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading JSON:', err);
  }
  return null;
});

ipcMain.handle('write-json', async (event, filename, content) => {
  try {
    const dbDir = getDbDir();
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const filePath = path.join(dbDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
    return { success: true };
  } catch (err) {
    console.error('Error writing JSON:', err);
    return { success: false, error: err.message };
  }
});

app.whenReady().then(() => {
  seedDatabase();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
