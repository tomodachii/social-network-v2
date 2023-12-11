import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [tsconfigPaths(), react(), splitVendorChunkPlugin()],
  build: {
    sourcemap: mode === "dev" || mode === "sit",
  },
}));
