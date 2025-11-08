import { app, ipcMain } from 'electron';
import { createRequire } from 'node:module';
const { autoUpdater } = createRequire(import.meta.url)('electron-updater');
export function update(win) {
    // Настройки auto-updater
    autoUpdater.autoDownload = false;
    autoUpdater.disableWebInstaller = false;
    autoUpdater.allowDowngrade = false;
    // События обновления
    autoUpdater.on('checking-for-update', () => { });
    autoUpdater.on('update-available', (arg) => {
        win.webContents.send('update-can-available', {
            update: true,
            version: app.getVersion(),
            newVersion: arg?.version
        });
    });
    autoUpdater.on('update-not-available', (arg) => {
        win.webContents.send('update-can-available', {
            update: false,
            version: app.getVersion(),
            newVersion: arg?.version
        });
    });
    // IPC handlers для обновлений
    ipcMain.handle('check-update', async () => {
        if (!app.isPackaged) {
            const error = new Error('The update feature is only available after the package.');
            return { message: error.message, error };
        }
        try {
            return await autoUpdater.checkForUpdatesAndNotify();
        }
        catch (error) {
            return { message: 'Network error', error };
        }
    });
    ipcMain.handle('start-download', (event) => {
        startDownload((error, progressInfo) => {
            if (error) {
                event.sender.send('update-error', { message: error.message, error });
            }
            else {
                event.sender.send('download-progress', progressInfo);
            }
        }, () => {
            event.sender.send('update-downloaded');
        });
    });
    ipcMain.handle('quit-and-install', () => {
        autoUpdater.quitAndInstall(false, true);
    });
}
function startDownload(callback, complete) {
    autoUpdater.on('download-progress', (info) => callback(null, info));
    autoUpdater.on('error', (error) => callback(error, null));
    autoUpdater.on('update-downloaded', complete);
    autoUpdater.downloadUpdate();
}
