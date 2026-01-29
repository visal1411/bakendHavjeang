import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Ensure service worker is served correctly
  publicDir: "public",
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
});
