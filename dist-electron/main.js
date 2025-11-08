import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const isDev = process.env.NODE_ENV === 'development';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let mainWindow;
async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: join(__dirname, 'preload.js')
        },
        show: false,
        titleBarStyle: 'default'
    });
    if (isDev) {
        await mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        await mainWindow.loadFile(join(__dirname, '../dist/index.html'));
    }
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}
// IPC handlers
ipcMain.handle('get-app-version', () => {
    return app.getVersion();
});
ipcMain.handle('window-minimize', () => {
    mainWindow?.minimize();
});
ipcMain.handle('window-maximize', () => {
    if (mainWindow?.isMaximized()) {
        mainWindow.unmaximize();
    }
    else {
        mainWindow?.maximize();
    }
});
ipcMain.handle('window-close', () => {
    mainWindow?.close();
});
// Event handlers
app.whenReady().then(createWindow);
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
