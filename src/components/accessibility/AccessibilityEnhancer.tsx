// Legacy AccessibilityEnhancer - Refactored into AccessibilityCore
import AccessibilityCore, { AccessibilityConfig } from './AccessibilityCore';

/**
 * WCAG 2.1 AA Compliant Accessibility Enhancer (Refactored)
 * Provides comprehensive accessibility features for enterprise applications
 */
const AccessibilityEnhancer = (props: AccessibilityConfig) => {
  return <AccessibilityCore {...props} />;
};

export default AccessibilityEnhancer;