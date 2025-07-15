// CarbonConstruct E2E Tests - Accessibility Compliance
describe('Accessibility Compliance', () => {
  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/calculator', name: 'Calculator' },
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/materials', name: 'Materials Database' },
    { path: '/sustainability', name: 'Sustainability' },
  ];

  pages.forEach(page => {
    it(`should meet WCAG 2.1 AA standards on ${page.name}`, () => {
      cy.visit(page.path);
      cy.wait(1000); // Allow page to fully load
      
      // Test accessibility compliance
      cy.testA11y();
      
      // Test keyboard navigation
      cy.get('body').tab().should('have.focus');
      
      // Test focus management
      cy.get('button, [href], input, select, textarea').each(($el) => {
        cy.wrap($el).focus().should('have.focus');
      });
    });
  });

  it('should support screen readers', () => {
    cy.visit('/');
    
    // Check for proper heading structure
    cy.get('h1').should('exist');
    cy.get('h1').should('have.attr', 'role', 'heading');
    
    // Check for ARIA landmarks
    cy.get('[role="main"]').should('exist');
    cy.get('[role="navigation"]').should('exist');
    
    // Check for proper labels
    cy.get('input').each(($input) => {
      cy.wrap($input).should('satisfy', ($el) => {
        return $el.attr('aria-label') || 
               $el.attr('aria-labelledby') || 
               $el.siblings('label').length > 0;
      });
    });
  });

  it('should have sufficient color contrast', () => {
    cy.visit('/');
    cy.testA11y(null, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
  });
});