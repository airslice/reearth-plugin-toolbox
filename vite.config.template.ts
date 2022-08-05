/// <reference types="vitest" />
/// <reference types="vite/client" />
import { resolve } from "path";

import react from "@vitejs/plugin-react";
import type { UserConfigExport, Plugin } from "vite";
// import { Plugin as importToCDN, autoComplete } from "vite-plugin-cdn-import";
import { viteSingleFile } from "vite-plugin-singlefile";

export const plugin = (name: string): UserConfigExport => ({
  build: {
    outDir: "dist/plugin",
    emptyOutDir: false,
    lib: {
      formats: ["iife"],
      // https://github.com/vitejs/vite/pull/7047
      entry: `src/widgets/${name}.ts`,
      name: `ReearthPluginST_${name}`,
      fileName: () => `${name}.js`,
    },
  },
});

export const web =
  (name: string): UserConfigExport =>
  () => ({
    plugins: [
      react(),
      viteSingleFile(),
      serverHeaders(),
      // importToCDN({
      //   modules: [autoComplete("react"), autoComplete("react-dom")],
      // }),
    ],
    publicDir: false,
    root: `./web/components/pages/${name}`,
    build: {
      outDir: `../../../../dist/web/${name}`,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./web/test/setup.ts",
    },
    resolve: {
      alias: [{ find: "@web", replacement: resolve(__dirname, "web") }],
    },
  });

const serverHeaders = (): Plugin => ({
  name: "server-headers",
  configureServer(server) {
    server.middlewares.use((_req, res, next) => {
      res.setHeader("Service-Worker-Allowed", "/");
      next();
    });
  },
});
