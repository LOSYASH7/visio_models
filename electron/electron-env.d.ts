/// <reference types="vite/client" />
/// <reference types="electron" />

declare namespace NodeJS {
  interface ProcessEnv {
    VSCODE_DEBUG?: 'true'
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬ dist-electron
     * │ ├─┬ main
     * │ │ └── index.js
     * │ └─┬ preload
     * │   └── index.js
     * ├─┬ dist
     * │ └── index.html
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Для Vite
interface ImportMetaEnv {
  readonly VITE_DEV_SERVER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}