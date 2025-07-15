// generateEpdJson.ts
// Browser-compatible JSON generation for EPD data

import { EPDRecord } from '@/types/epd';

interface EPDJsonExport {
  epd_info: {
    id: string;
    product_name: string;
    manufacturer_name: string;
    functional_unit: string;
    version_number: number;
    status: string;
    verification_status: string;
    iso_compliant: boolean;
  };
  environmental_impact: {
    total_co2e: number | null;
    gwp_fossil: number | null;
    gwp_biogenic: number | null;
    gwp_total: number | null;
  };
  lifecycle_stages: Record<string, any>;
  product_details: {
    description: string | null;
    manufacturer_location: string | null;
    manufacturer_abn: string | null;
  };
  metadata: {
    created_at: string;
    updated_at: string;
    submitted_at: string | null;
    verified_at: string | null;
    data_sources: any;
    export_timestamp: string;
    export_source: string;
  };
  compliance: {
    standards: string[];
    declaration_type: string;
    verification_note: string;
  };
}

export function generateEpdJson(epdData: EPDRecord): EPDJsonExport {
  return {
    epd_info: {
      id: epdData.id,
      product_name: epdData.product_name,
      manufacturer_name: epdData.manufacturer_name,
      functional_unit: epdData.functional_unit,
      version_number: epdData.version_number,
      status: epdData.status,
      verification_status: epdData.verification_status,
      iso_compliant: epdData.iso_compliant
    },
    environmental_impact: {
      total_co2e: epdData.total_co2e,
      gwp_fossil: epdData.gwp_fossil,
      gwp_biogenic: epdData.gwp_biogenic,
      gwp_total: epdData.gwp_total
    },
    lifecycle_stages: epdData.epd_stage_data,
    product_details: {
      description: epdData.product_description,
      manufacturer_location: epdData.manufacturer_location,
      manufacturer_abn: epdData.manufacturer_abn
    },
    metadata: {
      created_at: epdData.created_at,
      updated_at: epdData.updated_at,
      submitted_at: epdData.submitted_at,
      verified_at: epdData.verified_at,
      data_sources: epdData.data_sources,
      export_timestamp: new Date().toISOString(),
      export_source: 'CarbonConstruct EPD Generator'
    },
    compliance: {
      standards: ['ISO 14025', 'EN 15804', 'ISO 21930'],
      declaration_type: 'Type III Environmental Declaration',
      verification_note: 'This EPD was automatically generated and may require third-party verification for official compliance.'
    }
  };
}

export function downloadEpdJson(epdData: EPDRecord): void {
  const exportData = generateEpdJson(epdData);
  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `EPD_${epdData.product_name.replace(/[^a-zA-Z0-9]/g, '_')}_v${epdData.version_number}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Compact JSON export for API integration
export function generateCompactJson(epdData: EPDRecord): object {
  return {
    id: epdData.id,
    product: epdData.product_name,
    manufacturer: epdData.manufacturer_name,
    unit: epdData.functional_unit,
    version: epdData.version_number,
    status: epdData.status,
    emissions: {
      total: epdData.total_co2e,
      fossil: epdData.gwp_fossil,
      biogenic: epdData.gwp_biogenic,
      stages: epdData.epd_stage_data
    },
    verification: epdData.verification_status,
    created: epdData.created_at,
    standards: ['ISO 14025', 'EN 15804', 'ISO 21930']
  };
}

// Detailed JSON export for research/analysis
export function generateDetailedJson(epdData: EPDRecord): object {
  const stageBreakdown = Object.entries(epdData.epd_stage_data).reduce((acc, [stage, data]) => {
    if (data && typeof data === 'object' && 'co2e_value' in data) {
      acc[stage] = {
        value: (data as any).co2e_value,
        description: (data as any).description || null,
        data_source: (data as any).data_source || null
      };
    }
    return acc;
  }, {} as Record<string, any>);

  return {
    ...generateEpdJson(epdData),
    detailed_analysis: {
      stage_breakdown: stageBreakdown,
      carbon_intensity: epdData.total_co2e ? (epdData.total_co2e / 1).toFixed(6) : null,
      emission_factors: epdData.data_sources,
      quality_indicators: {
        iso_compliant: epdData.iso_compliant,
        verification_level: epdData.verification_status,
        data_completeness: Object.keys(stageBreakdown).length / 17 * 100 // 17 total stages
      }
    }
  };
}