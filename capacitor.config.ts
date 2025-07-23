import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.afkae.asseen',
  appName: 'As Seen',
  webDir: 'dist',
  server: {
    cleartext: true
  },
  android: {
    allowMixedContent: true,
  }
};

export default config;
