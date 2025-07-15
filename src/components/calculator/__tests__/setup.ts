
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Test utilities and mocks for calculator testing

export const mockCalculatorData = {
  materials: [],
  transport: [],
  energy: [],
  results: null
};

export const mockCalculatorContext = {
  data: mockCalculatorData,
  loading: false,
  error: null,
  actions: {
    calculate: vi.fn(),
    reset: vi.fn(),
    updateMaterials: vi.fn(),
    updateTransport: vi.fn(),
    updateEnergy: vi.fn()
  }
};

// Mock Supabase client for testing
export const mockSupabaseClient = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({ data: null, error: null }),
  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null })
};
