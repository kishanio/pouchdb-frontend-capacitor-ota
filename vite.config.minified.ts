import { defineConfig } from "vite";
import { baseViteConfig } from "./vite.config.base";
import { compression } from "vite-plugin-compression2";

export default defineConfig({
  ...baseViteConfig,
  plugins: [
    ...(baseViteConfig.plugins || []),
    compression({
      include: /\.(js|css)$/,
      deleteOriginalAssets: true,
    }),
  ],
  build: {
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
