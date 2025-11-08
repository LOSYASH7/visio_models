// electron/preload/index.ts - альтернативная версия
import { ipcRenderer } from 'electron';
// Простая версия без contextBridge
window.electronAPI = {
    minimize: () => ipcRenderer.invoke('window-minimize'),
    maximize: () => ipcRenderer.invoke('window-maximize'),
    close: () => ipcRenderer.invoke('window-close'),
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    platform: process.platform,
    versions: {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron
    }
};
