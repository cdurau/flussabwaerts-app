import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"
import path from "path"

export default defineConfig({
    base: "/flussabwaerts-app/",
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate", // Automatisches Updaten der Service Worker
            includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
            manifest: {
                name: "Meine Flussabwaerts App",
                short_name: "Flussabwaerts",
                description: "Meine Flussabwaerts",
                theme_color: "#ffffff",
                icons: [
                    {
                        src: "pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png"
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png"
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable"
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    }
})
