// CarbonConstruct E2E Tests - Carbon Calculator
describe('Carbon Calculator', () => {
  beforeEach(() => {
    cy.visit('/calculator');
  });

  it('should load calculator page successfully', () => {
    cy.get('[data-testid="calculator-container"]').should('be.visible');
    cy.testA11y();
    cy.testPerformance();
  });

  it('should calculate carbon emissions correctly', () => {
    const testProject = {
      name: 'Test Office Building',
      type: 'Commercial',
      materials: [
        { type: 'Concrete', quantity: 100 },
        { type: 'Steel', quantity: 50 }
      ]
    };

    cy.testCarbonCalculation(testProject);
  });

  it('should show compliance status', () => {
    cy.get('[data-testid="compliance-tab"]').click();
    cy.get('[data-testid="ncc-compliance"]').should('be.visible');
    cy.get('[data-testid="nabers-rating"]').should('be.visible');
    cy.testA11y('[data-testid="compliance-section"]');
  });

  it('should work on mobile devices', () => {
    cy.testMobileResponsive();
  });
});