import { axe } from 'jest-axe';
import { RenderResult } from '@testing-library/react';
import { expect } from 'vitest';

/**
 * Test accessibility compliance using axe-core
 * @param container - The container element to test
 * @param options - Optional axe configuration
 */
export const testAccessibility = async (
  container: Element,
  options?: any
) => {
  const results = await axe(container, {
    rules: {
      // CarbonConstruct specific rules
      'color-contrast': { enabled: true },
      'keyboard-navigation': { enabled: true },
      'focus-management': { enabled: true },
      'aria-labels': { enabled: true },
      'heading-order': { enabled: true },
      'landmark-roles': { enabled: true },
      ...options?.rules
    },
    tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
    ...options
  });
  
  // Check for violations manually since jest-axe matcher isn't working with Vitest
  if (results.violations.length > 0) {
    const violationMessages = results.violations.map(violation => 
      `${violation.id}: ${violation.description}`
    ).join('\n');
    throw new Error(`Accessibility violations found:\n${violationMessages}`);
  }
  
  return results;
};

/**
 * Test keyboard navigation
 * @param element - Element to test keyboard navigation on
 */
export const testKeyboardNavigation = async (element: Element) => {
  // Test Tab navigation
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  // Test that all interactive elements are keyboard accessible
  focusableElements.forEach((el) => {
    expect(el).not.toHaveAttribute('tabindex', '-1');
  });
  
  return focusableElements;
};

/**
 * Test screen reader compatibility
 * @param container - Container to test
 */
export const testScreenReaderCompatibility = (container: Element) => {
  // Check for proper ARIA labels
  const interactiveElements = container.querySelectorAll(
    'button, [role="button"], input, select, textarea'
  );
  
  interactiveElements.forEach((element) => {
    const hasLabel = 
      element.hasAttribute('aria-label') ||
      element.hasAttribute('aria-labelledby') ||
      element.querySelector('label') ||
      element.textContent?.trim();
    
    expect(hasLabel).toBeTruthy();
  });
};

/**
 * Test focus management
 * @param container - Container to test
 */
export const testFocusManagement = (container: Element) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  // Test focus indicators
  focusableElements.forEach((element) => {
    // Simulate focus
    (element as HTMLElement).focus();
    const focusedElement = document.activeElement;
    expect(focusedElement).toBe(element);
  });
};