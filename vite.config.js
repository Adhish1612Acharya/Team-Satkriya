import { defineConfig } from "vite";
import path from "node:path"; // Use 'node:path' to ensure compatibility
import { fileURLToPath } from "url"; // Required to get the directory name
import react from "@vitejs/plugin-react";

// Fix for '__dirname' in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
