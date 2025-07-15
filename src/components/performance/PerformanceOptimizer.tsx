import React, { useEffect } from 'react';
import { debounce } from 'lodash';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({ children }) => {
  useEffect(() => {
    // Debounce resize events to prevent excessive re-renders
    const debouncedResize = debounce(() => {
      // Trigger a single resize event after debounce
      window.dispatchEvent(new Event('optimized-resize'));
    }, 150);

    // Optimize scroll events
    const debouncedScroll = debounce(() => {
      window.dispatchEvent(new Event('optimized-scroll'));
    }, 16); // ~60fps

    window.addEventListener('resize', debouncedResize);
    window.addEventListener('scroll', debouncedScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('scroll', debouncedScroll);
      debouncedResize.cancel();
      debouncedScroll.cancel();
    };
  }, []);

  // Add intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all elements with data-lazy attribute
    const lazyElements = document.querySelectorAll('[data-lazy]');
    lazyElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
};