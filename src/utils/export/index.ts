// index.ts
// Export utilities main entry point

export { generateEpdCsv, downloadEpdCsv, generateStagesCsv } from './generateEpdCsv';
export { generateEpdJson, downloadEpdJson, generateCompactJson, generateDetailedJson } from './generateEpdJson';
export type { ExportOptions, StageEmissions, EpdExportData, ExportResult } from './types';

// Main export function that handles all formats
import { EPDRecord } from '@/types/epd';
import { downloadEpdCsv } from './generateEpdCsv';
import { downloadEpdJson } from './generateEpdJson';

export async function exportEpd(
  epdData: EPDRecord, 
  format: 'csv' | 'json',
  options?: { detailed?: boolean }
): Promise<void> {
  try {
    switch (format) {
      case 'csv':
        downloadEpdCsv(epdData);
        break;
      case 'json':
        downloadEpdJson(epdData);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}