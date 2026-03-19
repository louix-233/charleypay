import { defineConfig, UserConfigExport } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";


export default defineConfig(({ mode }): UserConfigExport => ({
  base: './', // Use relative paths for Electron compatibility
  server: {
    host: true, // allow external access
    port: 8080,
        strictPort: true,
    allowedHosts: [
      ".trycloudflare.com", // allow Cloudflare tunnels
      ".loca.lt",           // allow LocalTunnel tunnels
      ".ngrok-free.dev",     // Ngrok tunnels
      "localhost",
      "127.0.0.1"
    ],
    hmr: {
      overlay: false,
    },
    watch: {
      usePolling: false,
    },
  },
  plugins: [
    react(),
      ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
  esbuild: {
    target: "esnext",
  },
}));
