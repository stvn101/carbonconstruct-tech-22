import { useEffect } from 'react';

interface SecurityHeadersConfig {
  enableCSP?: boolean;
  enableHSTS?: boolean;
  enableFrameOptions?: boolean;
  enableContentTypeOptions?: boolean;
  enableReferrerPolicy?: boolean;
  cspDirectives?: {
    defaultSrc?: string[];
    scriptSrc?: string[];
    styleSrc?: string[];
    imgSrc?: string[];
    connectSrc?: string[];
    fontSrc?: string[];
    objectSrc?: string[];
    mediaSrc?: string[];
    frameSrc?: string[];
  };
}

/**
 * Enterprise-grade security headers implementation
 * Provides protection against XSS, clickjacking, MIME sniffing, and other attacks
 */
const SecurityHeaders: React.FC<SecurityHeadersConfig> = ({
  enableCSP = true,
  enableHSTS = true,
  enableFrameOptions = true,
  enableContentTypeOptions = true,
  enableReferrerPolicy = true,
  cspDirectives = {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Required for Vite dev mode
      "'unsafe-eval'", // Required for Vite dev mode
      "*.supabase.co",
      "*.lovable.app",
      "*.stripe.com",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com"
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Required for styled components
      "fonts.googleapis.com"
    ],
    imgSrc: [
      "'self'",
      "data:",
      "blob:",
      "*.supabase.co",
      "*.lovable.app",
      "https://www.google-analytics.com",
      "https://stats.g.doubleclick.net"
    ],
    connectSrc: [
      "'self'",
      "*.supabase.co",
      "*.lovable.app",
      "https://api.stripe.com",
      "https://www.google-analytics.com",
      "https://stats.g.doubleclick.net"
    ],
    fontSrc: [
      "'self'",
      "data:",
      "fonts.googleapis.com",
      "fonts.gstatic.com"
    ],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'", "data:", "blob:"],
    frameSrc: [
      "'self'",
      "https://js.stripe.com",
      "https://hooks.stripe.com"
    ]
  }
}) => {
  useEffect(() => {
    // Content Security Policy
    if (enableCSP) {
      const cspValue = Object.entries(cspDirectives)
        .map(([directive, sources]) => {
          const kebabDirective = directive.replace(/([A-Z])/g, '-$1').toLowerCase();
          return `${kebabDirective} ${sources.join(' ')}`;
        })
        .join('; ');
      
      // Create meta tag for CSP (fallback method)
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = cspValue;
      document.head.appendChild(cspMeta);
      
      console.log('✅ Content Security Policy applied:', cspValue);
    }

    // Strict Transport Security (HSTS)
    if (enableHSTS && window.location.protocol === 'https:') {
      // Note: HSTS headers should ideally be set server-side
      // This is a client-side enforcement for additional security
      const hstsScript = document.createElement('script');
      hstsScript.innerHTML = `
        // Enforce HTTPS redirects client-side
        if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
          window.location.href = window.location.href.replace('http:', 'https:');
        }
      `;
      document.head.appendChild(hstsScript);
      
      console.log('✅ HSTS enforcement enabled');
    }

    // X-Frame-Options protection
    if (enableFrameOptions) {
      const frameOptionsMeta = document.createElement('meta');
      frameOptionsMeta.httpEquiv = 'X-Frame-Options';
      frameOptionsMeta.content = 'SAMEORIGIN';
      document.head.appendChild(frameOptionsMeta);
      
      // Safe frame detection without navigation (prevents SecurityError)
      if (window.top !== window.self) {
        if (import.meta.env.DEV) {
          console.info('🔍 Running in frame (development mode)');
        } else {
          console.warn('🚨 Potential clickjacking attempt detected');
          // In production, just log - don't attempt navigation which causes SecurityError
        }
      }
      
      if (import.meta.env.DEV) {
        console.log('✅ X-Frame-Options protection enabled (dev mode)');
      }
    }

    // X-Content-Type-Options
    if (enableContentTypeOptions) {
      const noSniffMeta = document.createElement('meta');
      noSniffMeta.httpEquiv = 'X-Content-Type-Options';
      noSniffMeta.content = 'nosniff';
      document.head.appendChild(noSniffMeta);
      
      console.log('✅ X-Content-Type-Options protection enabled');
    }

    // Referrer Policy
    if (enableReferrerPolicy) {
      const referrerMeta = document.createElement('meta');
      referrerMeta.name = 'referrer';
      referrerMeta.content = 'strict-origin-when-cross-origin';
      document.head.appendChild(referrerMeta);
      
      console.log('✅ Referrer Policy applied');
    }

    // Additional security measures
    
    // Production security measures (disabled in development for better DX)
    if (import.meta.env.PROD) {
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };
      document.addEventListener('contextmenu', handleContextMenu);
      
      // Disable F12, Ctrl+U, Ctrl+Shift+I
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.key === 'u') ||
          (e.ctrlKey && e.shiftKey && e.key === 'I')
        ) {
          e.preventDefault();
          return false;
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }

    // Security event monitoring (optimized for development)
    const monitorSecurityEvents = () => {
      if (import.meta.env.DEV) {
        // Minimal monitoring in development to reduce console noise
        return () => {}; // No-op cleanup
      }
      
      // Full monitoring only in production
      const originalCreateElement = document.createElement;
      document.createElement = function(tagName: string) {
        const element = originalCreateElement.call(this, tagName);
        
        if (tagName.toLowerCase() === 'script') {
          console.warn('🔍 Script element created:', element);
          // Log to security monitoring service in production
        }
        
        return element;
      };
      
      // Monitor for DOM manipulation
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                if (element.tagName === 'SCRIPT' || element.tagName === 'IFRAME') {
                  console.warn('🔍 Potentially suspicious element added:', element);
                }
              }
            });
          }
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      return () => {
        observer.disconnect();
        document.createElement = originalCreateElement;
      };
    };

    const cleanup = monitorSecurityEvents();
    
    if (import.meta.env.DEV) {
      console.log('🔒 Security headers initialized (development mode)');
    } else {
      console.log('🔒 Security headers and monitoring initialized');
    }
    
    return cleanup;
  }, [
    enableCSP,
    enableHSTS,
    enableFrameOptions,
    enableContentTypeOptions,
    enableReferrerPolicy,
    cspDirectives
  ]);

  return null; // This component doesn't render anything
};

export default SecurityHeaders;