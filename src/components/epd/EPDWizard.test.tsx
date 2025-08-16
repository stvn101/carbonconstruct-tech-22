import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { EPDWizard } from './EPDWizard';

const DRAFT_KEY = 'epd_wizard_draft_v1';

beforeEach(() => {
  (import.meta as any).env = { VITE_DEV_MOCK_SAVE: 'true' };
  localStorage.setItem(
    DRAFT_KEY,
    JSON.stringify({
      product_name: '',
      product_description: '',
      functional_unit: '1 kg',
      manufacturer_name: '',
      manufacturer_location: '',
      manufacturer_abn: '',
      materials: [{ name: '', quantity: 0, unit: 'kg', carbon_footprint: 0 }],
      transport: { mode: 'truck', distance: 100, fuel_type: 'diesel' },
      energy: { electricity: 0, gas: 0, renewable_percentage: 0 },
      waste: { recycling_rate: 10, landfill_rate: 80, incineration_rate: 10 }
    })
  );
});

afterEach(() => {
  localStorage.clear();
});

test('clears draft when mock save flag is enabled', async () => {
  const onClose = vi.fn();
  render(<EPDWizard onClose={onClose} />);

  // fast-forward to final step
  for (let i = 0; i < 4; i++) {
    fireEvent.click(screen.getByText('Next'));
  }

  fireEvent.click(screen.getByText('Create EPD'));

  await waitFor(() => {
    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
  });
  expect(onClose).toHaveBeenCalled();
});
