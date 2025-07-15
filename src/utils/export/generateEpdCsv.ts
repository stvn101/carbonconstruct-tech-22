// generateEpdCsv.ts
// Browser-compatible CSV generation for EPD data

import { EPDRecord, EPDStage } from '@/types/epd';

interface CSVRow {
  category: string;
  field: string;
  value: string;
}

export function generateEpdCsv(epdData: EPDRecord): string {
  const csvRows: CSVRow[] = [];
  
  // Header
  csvRows.push({ category: 'Category', field: 'Field', value: 'Value' });
  
  // Product Information
  csvRows.push({ category: 'Product Information', field: 'Product Name', value: epdData.product_name });
  csvRows.push({ category: 'Product Information', field: 'Manufacturer', value: epdData.manufacturer_name });
  csvRows.push({ category: 'Product Information', field: 'Functional Unit', value: epdData.functional_unit });
  csvRows.push({ category: 'Product Information', field: 'Version', value: `v${epdData.version_number}` });
  csvRows.push({ category: 'Product Information', field: 'Status', value: epdData.status });
  csvRows.push({ category: 'Product Information', field: 'Description', value: `"${epdData.product_description || 'N/A'}"` });
  
  // Environmental Impact Summary
  csvRows.push({ category: 'Environmental Impact', field: 'Total CO2e (kg)', value: (epdData.total_co2e?.toFixed(3) || 'N/A') });
  csvRows.push({ category: 'Environmental Impact', field: 'GWP Fossil (kg)', value: (epdData.gwp_fossil?.toFixed(3) || 'N/A') });
  csvRows.push({ category: 'Environmental Impact', field: 'GWP Biogenic (kg)', value: (epdData.gwp_biogenic?.toFixed(3) || 'N/A') });
  csvRows.push({ category: 'Environmental Impact', field: 'GWP Total (kg)', value: (epdData.gwp_total?.toFixed(3) || 'N/A') });
  
  // Lifecycle Stages
  const stageDescriptions: Record<EPDStage, string> = {
    A1: 'Raw material supply',
    A2: 'Transport to manufacturer',
    A3: 'Manufacturing',
    A4: 'Transport to construction site',
    A5: 'Installation process',
    B1: 'Use',
    B2: 'Maintenance',
    B3: 'Repair',
    B4: 'Replacement',
    B5: 'Refurbishment',
    B6: 'Operational energy use',
    B7: 'Operational water use',
    C1: 'Deconstruction/demolition',
    C2: 'Transport to waste processing',
    C3: 'Waste processing',
    C4: 'Final disposal',
    D: 'Benefits beyond system boundary'
  };

  Object.entries(epdData.epd_stage_data).forEach(([stage, stageData]) => {
    if (stageData && typeof stageData === 'object' && 'co2e_value' in stageData) {
      const value = (stageData as any).co2e_value;
      csvRows.push({ 
        category: 'Lifecycle Stage', 
        field: `${stage} - ${stageDescriptions[stage as EPDStage]}`, 
        value: `${value.toFixed(3)} kg CO2e` 
      });
    }
  });
  
  // Metadata
  csvRows.push({ category: 'Metadata', field: 'Created At', value: epdData.created_at });
  csvRows.push({ category: 'Metadata', field: 'Verification Status', value: epdData.verification_status });
  csvRows.push({ category: 'Metadata', field: 'ISO Compliant', value: epdData.iso_compliant ? 'Yes' : 'No' });
  
  // Data Sources
  if (Array.isArray(epdData.data_sources)) {
    epdData.data_sources.forEach((source, index) => {
      csvRows.push({ 
        category: 'Data Sources', 
        field: `Source ${index + 1}`, 
        value: `"${source}"` 
      });
    });
  }
  
  // Convert to CSV string
  return csvRows.map(row => `${row.category},${row.field},${row.value}`).join('\n');
}

export function downloadEpdCsv(epdData: EPDRecord): void {
  const csvContent = generateEpdCsv(epdData);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `EPD_${epdData.product_name.replace(/[^a-zA-Z0-9]/g, '_')}_v${epdData.version_number}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Stage-focused CSV export for detailed analysis
export function generateStagesCsv(epdData: EPDRecord): string {
  const stageRows: string[] = [];
  
  // Header
  stageRows.push('Stage,Phase,Description,Emissions (kg CO2e),Unit');
  
  const stageDescriptions: Record<EPDStage, string> = {
    A1: 'Raw material supply',
    A2: 'Transport to manufacturer',
    A3: 'Manufacturing',
    A4: 'Transport to construction site',
    A5: 'Installation process',
    B1: 'Use',
    B2: 'Maintenance',
    B3: 'Repair',
    B4: 'Replacement',
    B5: 'Refurbishment',
    B6: 'Operational energy use',
    B7: 'Operational water use',
    C1: 'Deconstruction/demolition',
    C2: 'Transport to waste processing',
    C3: 'Waste processing',
    C4: 'Final disposal',
    D: 'Benefits beyond system boundary'
  };

  const getPhase = (stage: EPDStage): string => {
    if (['A1', 'A2', 'A3'].includes(stage)) return 'Production';
    if (['A4', 'A5'].includes(stage)) return 'Construction';
    if (['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7'].includes(stage)) return 'Use Phase';
    if (['C1', 'C2', 'C3', 'C4'].includes(stage)) return 'End-of-Life';
    if (stage === 'D') return 'Benefits';
    return 'Other';
  };

  Object.entries(epdData.epd_stage_data).forEach(([stage, stageData]) => {
    if (stageData && typeof stageData === 'object' && 'co2e_value' in stageData) {
      const value = (stageData as any).co2e_value;
      const stageKey = stage as EPDStage;
      stageRows.push(
        `${stage},${getPhase(stageKey)},"${stageDescriptions[stageKey]}",${value.toFixed(3)},kg CO2e`
      );
    }
  });
  
  return stageRows.join('\n');
}