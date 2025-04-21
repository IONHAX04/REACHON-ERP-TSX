// electron.vite.config.ts
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src")
      }
    },
    plugins: [react()],
    server: {
      host: true,
      port: 5173
    },
    // Handling static assets like .xlsx files
    assetsInclude: ["**/*.xlsx"]
    // 👈 This tells Vite to treat .xlsx as assets
  }
});
export {
  electron_vite_config_default as default
};
