// CarbonConstruct E2E Testing Support
import 'cypress-axe';
import './commands';

// Global test setup
beforeEach(() => {
  // Inject axe-core for accessibility testing
  cy.injectAxe();
  
  // Performance monitoring
  cy.window().then((win) => {
    win.performance.mark('test-start');
  });
});

afterEach(() => {
  // Performance monitoring
  cy.window().then((win) => {
    win.performance.mark('test-end');
    win.performance.measure('test-duration', 'test-start', 'test-end');
    
    // Log performance metrics
    const measure = win.performance.getEntriesByName('test-duration')[0];
    cy.task('log', `Test completed in ${measure.duration}ms`);
  });
});