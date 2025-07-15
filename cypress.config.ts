import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    
    // Performance testing thresholds
    env: {
      lighthouse: {
        performance: 90,
        accessibility: 100,
        'best-practices': 90,
        seo: 90,
        pwa: 80
      }
    },
    
    setupNodeEvents(on, config) {
      // Performance monitoring
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        lighthouse: require('@cypress/code-coverage/task'),
      });
      
      // Accessibility testing
      on('task', {
        a11yReport: require('cypress-axe/dist/task'),
      });
      
      return config;
    },
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
  },
});