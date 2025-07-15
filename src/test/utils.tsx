
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { RegionProvider } from '@/contexts/RegionContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter>
      <AuthProvider>
        <ProjectProvider>
          <RegionProvider>
            {children}
          </RegionProvider>
        </ProjectProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
