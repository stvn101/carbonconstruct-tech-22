// CarbonConstruct Custom Cypress Commands

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login command for CarbonConstruct
       */
      login(email: string, password: string): Chainable<void>;
      
      /**
       * Test accessibility compliance
       */
      testA11y(context?: string, options?: any): Chainable<void>;
      
      /**
       * Test performance metrics
       */
      testPerformance(thresholds?: PerformanceThresholds): Chainable<void>;
      
      /**
       * Test mobile responsiveness
       */
      testMobileResponsive(): Chainable<void>;
      
      /**
       * Test carbon calculation workflow
       */
      testCarbonCalculation(projectData: any): Chainable<void>;
    }
  }
}

interface PerformanceThresholds {
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
}

// Custom login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should('not.include', '/auth');
});

// Accessibility testing command
Cypress.Commands.add('testA11y', (context?: string, options?: any) => {
  cy.checkA11y(context, {
    rules: {
      'color-contrast': { enabled: true },
      'keyboard-navigation': { enabled: true },
      'focus-management': { enabled: true },
    },
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
    ...options
  });
});

// Performance testing command
Cypress.Commands.add('testPerformance', (thresholds: PerformanceThresholds = {}) => {
  const defaultThresholds = {
    firstContentfulPaint: 2000,
    largestContentfulPaint: 4000,
    firstInputDelay: 100,
    cumulativeLayoutShift: 0.1,
    ...thresholds
  };
  
  cy.window().then((win) => {
    // Test Core Web Vitals
    const navigation = win.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = win.performance.getEntriesByType('paint');
    
    // First Contentful Paint
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
    if (fcp) {
      expect(fcp.startTime).to.be.lessThan(defaultThresholds.firstContentfulPaint);
    }
    
    // DOM Content Loaded
    const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
    expect(domContentLoaded).to.be.lessThan(3000);
    
    cy.task('log', `Performance metrics: FCP=${fcp?.startTime}ms, DCL=${domContentLoaded}ms`);
  });
});

// Mobile responsiveness testing
Cypress.Commands.add('testMobileResponsive', () => {
  const viewports = [
    { width: 320, height: 568, device: 'iPhone SE' },
    { width: 375, height: 667, device: 'iPhone 8' },
    { width: 768, height: 1024, device: 'iPad' },
    { width: 1024, height: 768, device: 'iPad Landscape' }
  ];
  
  viewports.forEach(viewport => {
    cy.viewport(viewport.width, viewport.height);
    cy.wait(500); // Allow for responsive transitions
    
    // Test basic responsiveness
    cy.get('body').should('be.visible');
    cy.get('[data-testid="navbar"]').should('be.visible');
    
    // Test touch interactions (simulate)
    cy.get('button').first().should('be.visible').and('have.css', 'min-height').and('match', /44px|48px/);
    
    cy.task('log', `Tested responsiveness for ${viewport.device}: ${viewport.width}x${viewport.height}`);
  });
});

// Carbon calculation workflow testing
Cypress.Commands.add('testCarbonCalculation', (projectData) => {
  cy.visit('/calculator');
  
  // Fill in project details
  cy.get('[data-testid="project-name"]').type(projectData.name);
  cy.get('[data-testid="project-type"]').select(projectData.type);
  
  // Add materials
  projectData.materials.forEach((material: any, index: number) => {
    cy.get('[data-testid="add-material"]').click();
    cy.get(`[data-testid="material-${index}-type"]`).select(material.type);
    cy.get(`[data-testid="material-${index}-quantity"]`).type(material.quantity.toString());
  });
  
  // Calculate results
  cy.get('[data-testid="calculate-button"]').click();
  
  // Verify results
  cy.get('[data-testid="total-emissions"]').should('contain', 'kg CO2e');
  cy.get('[data-testid="results-chart"]').should('be.visible');
  
  // Test compliance checks
  cy.get('[data-testid="compliance-tab"]').click();
  cy.get('[data-testid="ncc-compliance"]').should('be.visible');
  cy.get('[data-testid="nabers-rating"]').should('be.visible');
});