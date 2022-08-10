/// <reference types="vitest" />
/// <reference types="vite/client" />

import { resolve } from "path";

import react from "@vitejs/plugin-react";
import type { UserConfigExport, Plugin } from "vite";
import { Plugin as importToCDN, autoComplete } from "vite-plugin-cdn-import";
import { viteExternalsPlugin } from "vite-plugin-externals";
import { viteSingleFile } from "vite-plugin-singlefile";
import svgr from "vite-plugin-svgr";

export const plugin = (name: string): UserConfigExport => ({
  build: {
    outDir: "dist/plugin",
    emptyOutDir: false,
    lib: {
      formats: ["iife"],
      // https://github.com/vitejs/vite/pull/7047
      entry: `src/widgets/${name}.ts`,
      name: `ReearthPluginTB_${name}`,
      fileName: () => `${name}.js`,
    },
    reportCompressedSize: false,
  },
});

export const web =
  (name: string): UserConfigExport =>
  ({ mode }) => ({
    plugins: [
      react(),
      viteSingleFile(),
      serverHeaders(),
      svgr(),
      mode === "production" &&
        importToCDN({
          modules: [autoComplete("react"), autoComplete("react-dom")],
        }),
      mode === "production" &&
        viteExternalsPlugin({
          react: "React",
          "react-dom": "ReactDOM",
        }),
    ],
    publicDir: false,
    root: `./web/components/pages/${name}`,
    build: {
      outDir: `../../../../dist/web/${name}`,
      emptyOutDir: true,
      reportCompressedSize: false,
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
