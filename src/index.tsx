import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

// PWA Service Worker Kaydı
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Yeni içerik mevcut. Yenilemek ister misiniz?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('Uygulama çevrimdışı çalışmaya hazır.');
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
