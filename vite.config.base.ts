import { type UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { readFileSync } from "fs";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";
import { execSync } from "child_process";

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));

// Get build-time information
const getBuildInfo = () => {
  try {
    const gitCommit = execSync("git rev-parse --short HEAD").toString().trim();
    const buildTime = new Date().toISOString();
    return { gitCommit, buildTime };
  } catch {
    return { gitCommit: "unknown", buildTime: new Date().toISOString() };
  }
};

const { gitCommit, buildTime } = getBuildInfo();

export const baseViteConfig: UserConfig = {
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(packageJson.version),
    "import.meta.env.VITE_APP_NAME": JSON.stringify(packageJson.name),
   
    "import.meta.env.VITE_BUILD_TIME": JSON.stringify(buildTime),
    "import.meta.env.VITE_GIT_COMMIT": JSON.stringify(gitCommit),
    "import.meta.env.VITE_IS_DEVELOPMENT": JSON.stringify(
      process.env.NODE_ENV === "development"
    ),
    "import.meta.env.VITE_IS_PRODUCTION": JSON.stringify(
      process.env.NODE_ENV === "production"
    ),

    global: "window",
  },

  plugins: [
    react({
      tsDecorators: true,
    }),

    visualizer({ open: true }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};
