import { defineConfig } from "vite";
import path from "node:path"; // Use 'node:path' to ensure compatibility
import react from "@vitejs/plugin-react";
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  // define: {
  //   'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY),
  // },
  root: 'frontend',
  plugins: [react()],
  envDir: '.',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
