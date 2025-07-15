// Enhanced EPD Hash utility with Web Crypto API support
import { EPDRecord } from '@/types/epd';

/**
 * Creates a SHA-256 hash of an EPD record for integrity verification
 * Uses Web Crypto API for browser compatibility
 */
export async function hashEpd(epd: Partial<EPDRecord>): Promise<string> {
  try {
    // Create a normalized object excluding volatile fields
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

    // Convert to stable JSON string (sorted keys for consistency)
    const jsonString = JSON.stringify(hashableData, Object.keys(hashableData).sort());
    
    // Create SHA-256 hash using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(jsonString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  } catch (error) {
    console.error('Error creating EPD hash:', error);
    throw new Error('Failed to generate EPD hash');
  }
}

/**
 * Verifies if an EPD hash matches the current EPD data
 */
export async function verifyEpdHash(epd: Partial<EPDRecord>, expectedHash: string): Promise<boolean> {
  try {
    const currentHash = await hashEpd(epd);
    return currentHash === expectedHash;
  } catch (error) {
    console.error('Error verifying EPD hash:', error);
    return false;
  }
}

/**
 * Generates a short hash for display purposes (first 8 characters)
 */
export async function generateShortHash(epd: Partial<EPDRecord>): Promise<string> {
  const fullHash = await hashEpd(epd);
  return fullHash.substring(0, 8);
}

/**
 * Legacy Node.js-style hash function for server-side use
 * Note: This should only be used in server environments
 */
export function hashEpdSync(epd: object): string {
  if (typeof window !== 'undefined') {
    throw new Error('Synchronous hash function not available in browser. Use hashEpd() instead.');
  }
  
  // This would require Node.js crypto module
  const crypto = require('crypto');
  const raw = JSON.stringify(epd);
  return crypto.createHash('sha256').update(raw).digest('hex');
}