/// <reference types="vitest" />
/// <reference types="vite/client" />

import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import importToCDN, { autoComplete } from "vite-plugin-cdn-import";

export default defineConfig({
  plugins: [
    react(),
    importToCDN({
      modules: [autoComplete("react"), autoComplete("react-dom")],
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./web/test/setup.ts",
  },
  resolve: {
    alias: [
      { find: "@web", replacement: resolve(__dirname, "web") },
      { find: "@src", replacement: resolve(__dirname, "src") },
    ],
  },
});
