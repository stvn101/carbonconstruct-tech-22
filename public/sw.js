// CarbonConstruct Service Worker
// Provides offline functionality and caching for PWA features

const CACHE_NAME = 'carbonconstruct-v1.0.0';
const STATIC_CACHE_NAME = 'carbonconstruct-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'carbonconstruct-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/offline.html'
];

// Routes that should work offline
const OFFLINE_ROUTES = [
  '/calculator',
  '/projects',
  '/dashboard',
  '/materials'
];

// Carbon calculation data for offline access
const CRITICAL_DATA_ENDPOINTS = [
  '/api/materials',
  '/api/carbon-factors',
  '/api/compliance-data'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Static assets cached');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('❌ Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim(); // Take control of all pages
      })
  );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Handle different types of requests with appropriate strategies
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirstStrategy(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirstStrategy(request));
  } else if (isPageRequest(request)) {
    event.respondWith(staleWhileRevalidateStrategy(request));
  } else {
    event.respondWith(networkFirstStrategy(request));
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'carbon-calculation') {
    event.waitUntil(syncCarbonCalculations());
  } else if (event.tag === 'project-save') {
    event.waitUntil(syncProjectData());
  }
});

// Push notifications for updates
self.addEventListener('push', (event) => {
  console.log('🔔 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-96x96.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('CarbonConstruct', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Caching Strategies

function cacheFirstStrategy(request) {
  return caches.match(request)
    .then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE_NAME)
              .then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        });
    })
    .catch(() => {
      // Return offline fallback for images
      if (request.destination === 'image') {
        return caches.match('/icon-192x192.png');
      }
    });
}

function networkFirstStrategy(request) {
  return fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const responseClone = networkResponse.clone();
        caches.open(DYNAMIC_CACHE_NAME)
          .then((cache) => cache.put(request, responseClone));
      }
      return networkResponse;
    })
    .catch(() => {
      return caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          
          throw new Error('No cached response available');
        });
    });
}

function staleWhileRevalidateStrategy(request) {
  const cachedResponsePromise = caches.match(request);
  const networkResponsePromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const responseClone = networkResponse.clone();
        caches.open(DYNAMIC_CACHE_NAME)
          .then((cache) => cache.put(request, responseClone));
      }
      return networkResponse;
    })
    .catch(() => null);
  
  return cachedResponsePromise
    .then((cachedResponse) => {
      return cachedResponse || networkResponsePromise;
    })
    .catch(() => {
      return networkResponsePromise;
    })
    .then((response) => {
      if (!response && request.mode === 'navigate') {
        return caches.match('/offline.html');
      }
      return response;
    });
}

// Helper Functions

function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf)$/);
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || 
         url.pathname.includes('supabase') ||
         CRITICAL_DATA_ENDPOINTS.some(endpoint => url.pathname.includes(endpoint));
}

function isPageRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
}

// Background Sync Functions

async function syncCarbonCalculations() {
  try {
    console.log('🔄 Syncing carbon calculations...');
    
    // Get pending calculations from IndexedDB
    const pendingCalculations = await getPendingCalculations();
    
    for (const calculation of pendingCalculations) {
      try {
        const response = await fetch('/api/calculations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(calculation)
        });
        
        if (response.ok) {
          await removePendingCalculation(calculation.id);
          console.log('✅ Synced calculation:', calculation.id);
        }
      } catch (error) {
        console.error('❌ Failed to sync calculation:', error);
      }
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

async function syncProjectData() {
  try {
    console.log('🔄 Syncing project data...');
    
    // Get pending project saves from IndexedDB
    const pendingProjects = await getPendingProjects();
    
    for (const project of pendingProjects) {
      try {
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(project)
        });
        
        if (response.ok) {
          await removePendingProject(project.id);
          console.log('✅ Synced project:', project.id);
        }
      } catch (error) {
        console.error('❌ Failed to sync project:', error);
      }
    }
  } catch (error) {
    console.error('❌ Project sync failed:', error);
  }
}

// IndexedDB helper functions (simplified)
async function getPendingCalculations() {
  // In a real implementation, this would use IndexedDB
  return JSON.parse(localStorage.getItem('pending_calculations') || '[]');
}

async function removePendingCalculation(id) {
  const pending = JSON.parse(localStorage.getItem('pending_calculations') || '[]');
  const filtered = pending.filter(calc => calc.id !== id);
  localStorage.setItem('pending_calculations', JSON.stringify(filtered));
}

async function getPendingProjects() {
  return JSON.parse(localStorage.getItem('pending_projects') || '[]');
}

async function removePendingProject(id) {
  const pending = JSON.parse(localStorage.getItem('pending_projects') || '[]');
  const filtered = pending.filter(proj => proj.id !== id);
  localStorage.setItem('pending_projects', JSON.stringify(filtered));
}

console.log('🔧 CarbonConstruct Service Worker loaded');