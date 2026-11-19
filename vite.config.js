import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["img/*.png", "img/*.jpg"],
      manifest: {
        name: "DEEP — Um mergulho no autoconhecimento",
        short_name: "DEEP",
        description:
          "O game do Método DEEP de Ita Batista: descubra seu perfil comportamental e mergulhe nas fases Despertar, Entender, Empoderar e Potencializar.",
        lang: "pt-BR",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#0b1522",
        theme_color: "#0b1522",
        icons: [
          { src: "img/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
          { src: "img/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,svg}"],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: "CacheFirst",
            options: { cacheName: "fontes", expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } }
          }
        ]
      }
    })
  ]
});
