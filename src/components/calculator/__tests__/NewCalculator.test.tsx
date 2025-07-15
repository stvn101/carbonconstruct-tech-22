
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NewCalculator from '../NewCalculator';

describe('NewCalculator', () => {
  it('renders the calculator foundation', () => {
    render(<NewCalculator />);
    
    expect(screen.getByText('New Carbon Calculator')).toBeInTheDocument();
    expect(screen.getByText('Clean Slate Development')).toBeInTheDocument();
    expect(screen.getByText('Requirements gathering session')).toBeInTheDocument();
  });

  it('shows demo mode when enabled', () => {
    render(<NewCalculator demoMode={true} />);
    
    expect(screen.getByText('Demo Mode Active')).toBeInTheDocument();
  });

  it('does not show demo mode when disabled', () => {
    render(<NewCalculator demoMode={false} />);
    
    expect(screen.queryByText('Demo Mode Active')).not.toBeInTheDocument();
  });
});
