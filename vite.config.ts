import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/kalku/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.png'],
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
            cleanupOutdatedCaches: true,
            clientsClaim: true,
            skipWaiting: true
          },
          manifest: {
            name: 'Gemini AI Calculator',
            short_name: 'Gemini Calc',
            description: 'A modern, feature-rich scientific calculator and unit converter.',
            theme_color: '#191022',
            background_color: '#191022',
            display: 'standalone',
            orientation: 'portrait',
            start_url: '/kalku/',
            scope: '/kalku/',
            id: '/kalku/',
            icons: [
              {
                src: '/kalku/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable'
              },
              {
                src: '/kalku/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable'
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      }
    };
});
