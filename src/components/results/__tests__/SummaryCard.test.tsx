
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import SummaryCard from '../SummaryCard';

describe('SummaryCard', () => {
  const mockResult = {
    materialEmissions: 100,
    transportEmissions: 50,
    energyEmissions: 25,
    totalEmissions: 175,
    breakdown: {
      materials: 57.14,
      transport: 28.57,
      energy: 14.29
    },
    breakdownByMaterial: {},
    breakdownByTransport: {},
    breakdownByEnergy: {},
    scope1: 10,
    scope2: 15,
    scope3: 150
  };

  it('renders the total emissions correctly', () => {
    render(<SummaryCard result={mockResult} />);
    expect(screen.getByText('175.00')).toBeInTheDocument();
    expect(screen.getByText('kg CO2e')).toBeInTheDocument();
  });

  it('shows correct intensity category for moderate emissions', () => {
    render(<SummaryCard result={mockResult} />);
    expect(screen.getByText('Moderate Carbon Intensity')).toBeInTheDocument();
  });

  it('shows correct intensity category for low emissions', () => {
    const lowResult = { 
      ...mockResult, 
      totalEmissions: 50,
      breakdown: {
        materials: 50,
        transport: 30,
        energy: 20
      },
      scope1: 5,
      scope2: 10,
      scope3: 35
    };
    render(<SummaryCard result={lowResult} />);
    expect(screen.getByText('Low Carbon Intensity')).toBeInTheDocument();
  });

  it('shows correct intensity category for high emissions', () => {
    const highResult = { 
      ...mockResult, 
      totalEmissions: 600,
      breakdown: {
        materials: 60,
        transport: 30,
        energy: 10
      },
      scope1: 50,
      scope2: 100,
      scope3: 450
    };
    render(<SummaryCard result={highResult} />);
    expect(screen.getByText('High Carbon Intensity')).toBeInTheDocument();
  });
});
