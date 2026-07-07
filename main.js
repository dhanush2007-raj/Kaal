const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow = null;
let blockerInterval = null;
let originalDNDState = null; // store to restore later

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 360,
    minHeight: 600,
    title: "Kaal",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'icon.png')
  });

  mainWindow.loadFile('index.html');
  Menu.setApplicationMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null;
    stopFocusSession();
  });
}

// Windows Focus / DND (Focus Assist) Registry Toggler
function setWindowsDND(enable) {
  const value = enable ? 0 : 1;
  const cmd = `powershell -Command "Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Notifications\\Settings' -Name 'NOC_GLOBAL_SETTING_TOASTS_ENABLED' -Value ${value} -ErrorAction SilentlyContinue"`;
  exec(cmd, (err) => {
    if (err) console.warn("DND config registry write warning:", err);
  });
}

// App Blocker Loop
function startFocusSession(config) {
  stopFocusSession(); // Clear existing if any

  console.log("Starting desktop focus session with config:", config);

  // 1. DND Activation
  if (config.dnd) {
    setWindowsDND(true);
  }

  // 2. Application Restrictions
  if (config.blockList && config.blockList.length > 0) {
    const list = config.blockList.map(a => a.toLowerCase().trim()).filter(Boolean);
    
    blockerInterval = setInterval(() => {
      exec('tasklist /nh /fo csv', (err, stdout) => {
        if (err || !stdout) return;
        
        const lines = stdout.split('\n');
        const runningProcesses = lines.map(line => {
          const match = line.match(/^"([^"]+)"/);
          return match ? match[1].toLowerCase().trim() : '';
        }).filter(Boolean);

        list.forEach(blockedApp => {
          if (runningProcesses.includes(blockedApp)) {
            console.log(`Kaal Focus Blocker: Terminating ${blockedApp}`);
            exec(`taskkill /f /im ${blockedApp}`, (killErr) => {
              if (killErr) console.warn(`Could not kill ${blockedApp}:`, killErr.message);
            });
          }
        });
      });
    }, 2000);
  }
}

function stopFocusSession() {
  console.log("Stopping desktop focus session. Restoring normal state.");
  
  // Clear blocker loop
  if (blockerInterval) {
    clearInterval(blockerInterval);
    blockerInterval = null;
  }

  // Restore Windows notifications
  setWindowsDND(false);
}

// IPC Handlers
ipcMain.on('start-focus', (event, config) => {
  startFocusSession(config);
});

ipcMain.on('stop-focus', (event) => {
  stopFocusSession();
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  stopFocusSession();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
