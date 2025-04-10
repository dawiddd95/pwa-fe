// 🔧 Import funkcji do definiowania konfiguracji Vite
import { defineConfig } from 'vite';

// ⚛️ Import pluginu do obsługi Reacta (JSX, Fast Refresh itp.)
import react from '@vitejs/plugin-react';

// 📦 Import pluginu do konfiguracji PWA (manifest, service worker, caching)
import { VitePWA } from 'vite-plugin-pwa';

// 🚀 Eksportujemy konfigurację Vite
export default defineConfig({
  plugins: [
    // ✅ Dodajemy wsparcie dla Reacta w projekcie
    react(),

    // 🔌 Konfiguracja Progressive Web App (PWA)
    VitePWA({
      // 🔁 Service Worker będzie aktualizowany automatycznie
      registerType: 'autoUpdate',

      // 📄 Konfiguracja manifestu aplikacji (wymagany przez Android/iOS do instalacji)
      manifest: {
        name: 'Lead Capture App',            // Pełna nazwa aplikacji (np. dla splash screenu)
        short_name: 'Leads',                 // Krótka nazwa (np. pod ikoną na ekranie głównym)
        start_url: '/',                      // Strona startowa po kliknięciu ikony
        display: 'standalone',               // Wygląd jak natywna aplikacja (bez UI przeglądarki)
        background_color: '#ffffff',         // Kolor tła podczas uruchamiania aplikacji
        theme_color: '#317EFB',              // Kolor paska systemowego (np. Android)
        icons: [
          {
            src: '/icon-192.png',            // Ikona 192x192 (wymagana)
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',            // Ikona 512x512 (wymagana)
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
