import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { appVersion } from './version';

// Cache busting and service worker management
const handleCacheBusting = async () => {
  const currentVersion = localStorage.getItem('appVersion');
  
  if (currentVersion !== appVersion) {
    console.log(`[Cache Busting] Version change detected: ${currentVersion} -> ${appVersion}`);
    
    // Clear caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    // Unregister old service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(registration => registration.unregister()));
    }
    
    // Update version
    localStorage.setItem('appVersion', appVersion);
    
    // Force reload if this isn't the first load
    if (currentVersion) {
      window.location.reload();
      return;
    }
  }
};

// Register service worker for PWA only in production builds
if (import.meta.env.MODE === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    await handleCacheBusting();
    
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.info('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.info('SW registration failed: ', registrationError);
      });
  });
} else {
  // Handle cache busting in development too
  handleCacheBusting().catch(console.error);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
