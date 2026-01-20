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
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
          manifest: {
            name: 'Gemini AI Calculator',
            short_name: 'Gemini Calc',
            description: 'A modern, feature-rich scientific calculator and unit converter.',
            theme_color: '#191022',
            background_color: '#191022',
            display: 'standalone',
            orientation: 'portrait',
            icons: [
              {
                src: 'icons/icon-72x72.png',
                sizes: '72x72',
                type: 'image/png'
              },
              {
                src: 'icons/icon-96x96.png',
                sizes: '96x96',
                type: 'image/png'
              },
              {
                src: 'icons/icon-128x128.png',
                sizes: '128x128',
                type: 'image/png'
              },
              {
                src: 'icons/icon-144x144.png',
                sizes: '144x144',
                type: 'image/png'
              },
              {
                src: 'icons/icon-152x152.png',
                sizes: '152x152',
                type: 'image/png'
              },
              {
                src: 'icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable'
              },
              {
                src: 'icons/icon-384x384.png',
                sizes: '384x384',
                type: 'image/png'
              },
              {
                src: 'icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png'
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
