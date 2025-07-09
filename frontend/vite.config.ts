
import { reactRouter } from "@react-router/dev/vite";
import path from "path"
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/zadatak-konovo/backend',
        changeOrigin: true,
      },
      '/konovo-api': {
        target: 'https://zadatak.konovo.rs',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/konovo-api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
});
