// EPD Hash utility for signature integrity
import { EPDRecord } from '@/types/epd';

export async function hashEpd(epd: Omit<EPDRecord, 'exportUrls'>): Promise<string> {
  // Create a normalized object excluding storage URLs and hash field
  const hashableData = {
    id: epd.id,
    product_name: epd.product_name,
    manufacturer_name: epd.manufacturer_name,
    functional_unit: epd.functional_unit,
    product_description: epd.product_description,
    epd_stage_data: epd.epd_stage_data,
    total_co2e: epd.total_co2e,
    gwp_fossil: epd.gwp_fossil,
    gwp_biogenic: epd.gwp_biogenic,
    gwp_total: epd.gwp_total,
    version_number: epd.version_number,
    status: epd.status,
    verification_status: epd.verification_status,
    iso_compliant: epd.iso_compliant,
    data_sources: epd.data_sources,
    created_at: epd.created_at,
    manufacturer_location: epd.manufacturer_location,
    manufacturer_abn: epd.manufacturer_abn
  };

  // Convert to stable JSON string
  const jsonString = JSON.stringify(hashableData, Object.keys(hashableData).sort());
  
  // Create SHA-256 hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(jsonString));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateEpdHash(epd: Omit<EPDRecord, 'exportUrls'>): Promise<string> {
  return await hashEpd(epd);
}