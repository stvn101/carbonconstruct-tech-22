// Lighthouse CI Configuration for CarbonConstruct
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:5173/',
        'http://localhost:5173/calculator',
        'http://localhost:5173/dashboard',
        'http://localhost:5173/materials',
        'http://localhost:5173/sustainability'
      ],
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'Local:   http://localhost:5173',
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless',
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1.0 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:pwa': ['warn', { minScore: 0.8 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // CarbonConstruct specific metrics
        'unused-javascript': ['warn', { maxNumericValue: 100000 }],
        'unused-css-rules': ['warn', { maxNumericValue: 50000 }],
        'render-blocking-resources': ['error', { maxLength: 0 }],
      }
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};