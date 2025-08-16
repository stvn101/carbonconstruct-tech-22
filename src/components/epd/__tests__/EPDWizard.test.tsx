import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { EPDWizard } from '../EPDWizard';
import { EPDService } from '@/services/epdService';

describe('EPDWizard draft flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(EPDService, 'createEPD').mockResolvedValue({ data: {}, error: null } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('clears draft after successful save', async () => {
    const onClose = vi.fn();
    const removeSpy = vi.spyOn(window.localStorage.__proto__, 'removeItem');
    render(<EPDWizard onClose={onClose} />);

    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: 'Widget' }
    });
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByText('Next'));
    }
    fireEvent.click(screen.getByText('Create EPD'));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(removeSpy).toHaveBeenCalledWith('epd_wizard_draft_v1');
  });
});
