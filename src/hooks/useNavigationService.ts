import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Centralized Navigation Service - Phase 3 Enhancement
 * Replaces window.location usage with React Router navigation
 */
export const useNavigationService = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = useCallback((path: string, options?: { replace?: boolean; state?: any }) => {
    navigate(path, options);
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goForward = useCallback(() => {
    navigate(1);
  }, [navigate]);

  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  const redirect = useCallback((url: string, external = false) => {
    if (external) {
      window.location.href = url;
    } else {
      navigate(url, { replace: true });
    }
  }, [navigate]);

  const getCurrentPath = useCallback(() => location.pathname, [location.pathname]);
  const getCurrentUrl = useCallback(() => window.location.href, []);
  const getOrigin = useCallback(() => window.location.origin, []);

  return {
    navigateTo,
    goBack,
    goForward,
    reload,
    redirect,
    getCurrentPath,
    getCurrentUrl,
    getOrigin,
    location
  };
};