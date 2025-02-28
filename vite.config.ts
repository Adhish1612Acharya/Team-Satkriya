import { defineConfig } from "vite";
import path from "node:path"; // Use 'node:path' to ensure compatibility
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
