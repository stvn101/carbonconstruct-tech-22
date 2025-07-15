// types.ts
// Shared types for EPD export utilities

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'json';
  detailed?: boolean;
  compact?: boolean;
  includeMetadata?: boolean;
}

export interface StageEmissions {
  A1?: number; A2?: number; A3?: number; A4?: number; A5?: number;
  B1?: number; B2?: number; B3?: number; B4?: number; B5?: number;
  B6?: number; B7?: number; C1?: number; C2?: number; C3?: number;
  C4?: number; D?: number;
}

export interface EpdExportData {
  product_name: string;
  manufacturer_name: string;
  functional_unit: string;
  product_description?: string;
  stages: StageEmissions;
  total_co2e: number;
  gwp_fossil: number;
  gwp_biogenic: number;
  gwp_total: number;
  status: string;
  verification_status: string;
  created_at: string;
  version_number: number;
  data_sources: string[];
}

export interface ExportResult {
  success: boolean;
  filename?: string;
  error?: string;
  downloadUrl?: string;
}