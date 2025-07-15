import { useEffect } from 'react';

export interface AccessibilityConfig {
  enableKeyboardNavigation?: boolean;
  enableScreenReaderSupport?: boolean;
  enableHighContrast?: boolean;
  enableFocusManagement?: boolean;
  enableAriaLiveRegions?: boolean;
  skipToContentEnabled?: boolean;
}

const AccessibilityCore = ({
  enableKeyboardNavigation = true,
  enableScreenReaderSupport = true,
  enableHighContrast = true,
  enableFocusManagement = true,
  enableAriaLiveRegions = true,
  skipToContentEnabled = true
}: AccessibilityConfig) => {
  useEffect(() => {
    console.log('🔧 Initializing WCAG 2.1 AA Accessibility Enhancements...');
    
    const cleanupFunctions: (() => void)[] = [];

    // Skip to Content Link
    if (skipToContentEnabled) {
      const skipLink = document.createElement('a');
      skipLink.id = 'skip-to-content';
      skipLink.href = '#main-content';
      skipLink.innerText = 'Skip to main content';
      skipLink.className = `
        absolute -top-40 left-6 z-[9999] bg-primary text-primary-foreground 
        px-4 py-2 rounded-md font-medium transition-all duration-200
        focus:top-6 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
      `;
      skipLink.setAttribute('tabindex', '0');
      document.body.prepend(skipLink);
      
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content') || document.querySelector('main');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      });
      
      cleanupFunctions.push(() => skipLink.remove());
    }

    // Enhanced Keyboard Navigation
    if (enableKeyboardNavigation) {
      const style = document.createElement('style');
      style.id = 'accessibility-keyboard-styles';
      style.innerHTML = `
        body:not(.mouse-user) *:focus {
          outline: 2px solid hsl(var(--primary)) !important;
          outline-offset: 2px !important;
          border-radius: 2px !important;
        }
        
        body:not(.mouse-user) button:focus,
        body:not(.mouse-user) a:focus,
        body:not(.mouse-user) input:focus,
        body:not(.mouse-user) select:focus,
        body:not(.mouse-user) textarea:focus {
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.3) !important;
        }
        
        @media (prefers-contrast: high) {
          * { border-color: ButtonText !important; }
          button, input, select, textarea { border: 2px solid ButtonText !important; }
        }
        
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `;
      document.head.appendChild(style);
      
      const handleMouseDown = () => document.body.classList.add('mouse-user');
      const handleKeyDown = (event: KeyboardEvent) => {
        if (['Tab', 'Enter', ' '].includes(event.key)) {
          document.body.classList.remove('mouse-user');
        }
      };
      
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('keydown', handleKeyDown);
      
      cleanupFunctions.push(() => {
        style.remove();
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('keydown', handleKeyDown);
      });
    }

    // ARIA Live Regions
    if (enableAriaLiveRegions) {
      const politeRegion = document.createElement('div');
      politeRegion.id = 'aria-live-polite';
      politeRegion.setAttribute('aria-live', 'polite');
      politeRegion.setAttribute('aria-atomic', 'true');
      politeRegion.className = 'sr-only';
      document.body.appendChild(politeRegion);
      
      const assertiveRegion = document.createElement('div');
      assertiveRegion.id = 'aria-live-assertive';
      assertiveRegion.setAttribute('aria-live', 'assertive');
      assertiveRegion.setAttribute('aria-atomic', 'true');
      assertiveRegion.className = 'sr-only';
      document.body.appendChild(assertiveRegion);
      
      // Global announce function
      (window as any).announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
        const region = document.getElementById(`aria-live-${priority}`);
        if (region) {
          region.textContent = message;
          setTimeout(() => region.textContent = '', 1000);
        }
      };
      
      cleanupFunctions.push(() => {
        politeRegion.remove();
        assertiveRegion.remove();
        delete (window as any).announceToScreenReader;
      });
    }

    console.log('✅ WCAG 2.1 AA Accessibility enhancements initialized');
    
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [
    enableKeyboardNavigation,
    enableScreenReaderSupport,
    enableHighContrast,
    enableFocusManagement,
    enableAriaLiveRegions,
    skipToContentEnabled
  ]);

  return null;
};

export default AccessibilityCore;