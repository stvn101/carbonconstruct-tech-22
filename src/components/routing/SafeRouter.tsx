import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundaryWrapper from '@/components/error/ErrorBoundaryWrapper';
import { CriticalErrorFallback } from '@/components/error/CriticalErrorFallback';

interface SafeRouterProps {
  children: React.ReactNode;
}

export const SafeRouter: React.FC<SafeRouterProps> = ({ children }) => {
  return (
    <ErrorBoundaryWrapper 
      feature="Router"
      fallbackComponent={CriticalErrorFallback}
    >
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ErrorBoundaryWrapper>
  );
};