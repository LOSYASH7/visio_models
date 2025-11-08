import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let win = null;
async function createWindow() {
    Menu.setApplicationMenu(null);
    win = new BrowserWindow({
        title: 'Artif Visio',
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        show: true // ← ИЗМЕНЕНИЕ: сразу показывать окно
    });
    try {
        await win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
        // Принудительно фокусируем окно
        win.focus();
    }
    catch (error) {
        console.error('Failed to load URL:', error);
        // Если не загрузилось, все равно показываем окно
        win.show();
    }
}
// IPC handlers
ipcMain.handle('window-minimize', () => {
    win?.minimize();
});
ipcMain.handle('window-maximize', () => {
    if (win?.isMaximized()) {
        win.unmaximize();
    }
    else {
        win?.maximize();
    }
});
ipcMain.handle('window-close', () => {
    win?.close();
});
ipcMain.handle('get-app-version', () => {
    return app.getVersion();
});
// Event handlers
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    win = null;
    if (process.platform !== 'darwin')
        app.quit();
});
app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
    else {
        win.focus();
    }
});
