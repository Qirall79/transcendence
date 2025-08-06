import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "suppress-warnings",
      apply: "serve", // Only apply in dev mode
      configureServer(server) {
        return () => {
          server.middlewares.use((req, res, next) => {
            next();
          });
        };
      },
    },
  ],
  server: {
    host: true, // Needed for docker
    port: 5173, // Vite's default port
    watch: {
      usePolling: true, // Needed for Docker in some systems
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        warn(warning);
      },
    },
  },
  preview: {
	allowedHosts: ['ftranscendence.ddns.net']
  }
});
