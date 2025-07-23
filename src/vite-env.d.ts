/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_WEBAPP_URL: string;
  VITE_AUTH_URL: string;
  VITE_ANDROIDAPP_DEEPLINK: string;
  VITE_APP_VERSION: string;
  VITE_APP_NAME: string;
  VITE_BUILD_TIME: string;
  VITE_GIT_COMMIT: string;
  VITE_IS_DEVELOPMENT: string;
  VITE_IS_PRODUCTION: string;
}

interface ImportMeta extends ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global variables defined in vite.config.base.ts
declare global {
  // Application metadata (from package.json)
  const appVersion: string;
  const appName: string;
  const appDescription: string;

  // Build information
  const buildTime: string;
  const gitCommit: string;

  // Environment flags
  const isDevelopment: boolean;
  const isProduction: boolean;

  // Global polyfills
  const global: Window;
}
