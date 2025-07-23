import { defineConfig } from "vite";
import { baseViteConfig } from "./vite.config.base";

export default defineConfig({
  ...baseViteConfig,
  build: {
    sourcemap: true,
  },
});
