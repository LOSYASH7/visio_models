// electron/preload/index.ts - альтернативная версия
import { ipcRenderer } from 'electron'

// Простая версия без contextBridge
(window as any).electronAPI = {
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
}

declare global {
  interface Window {
    electronAPI: {
      minimize: () => Promise<void>
      maximize: () => Promise<void>
      close: () => Promise<void>
      getAppVersion: () => Promise<string>
      platform: string
      versions: {
        node: string
        chrome: string
        electron: string
      }
    }
  }
}