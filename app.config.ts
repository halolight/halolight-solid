import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    preset: "cloudflare-pages",
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      // API 代理配置 - 解决跨域问题
      proxy: {
        "/api": {
          target: process.env.VITE_API_BACKEND_URL || "http://localhost:3000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  },
});
