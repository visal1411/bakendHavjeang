import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
// In Docker: VITE_API_TARGET is not set, but the container can reach "backend:8080"
// Locally: falls back to "localhost:8080"
const apiTarget =
  process.env.DOCKER === "true"
    ? "http://backend:8080"
    : "http://localhost:8080";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    proxy: {
      "/api": {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
      "/socket.io": {
        target: apiTarget,
        changeOrigin: true,
        ws: true,
        secure: false,
      },
    },
  },
});
