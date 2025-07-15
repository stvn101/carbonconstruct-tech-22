import { supabase } from '@/integrations/supabase/client';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

export interface MaterialSearchFilters {
  category?: string;
  region?: string;
  tags?: string[];
  carbonIntensity?: 'low' | 'medium' | 'high';
  recyclability?: 'High' | 'Medium' | 'Low';
  greenStarCompliant?: boolean;
  searchTerm?: string;
}

export interface MaterialLookupResult {
  material: ExtendedMaterialData;
  carbonFactor: number;
  confidence: number;
  alternatives?: ExtendedMaterialData[];
}

class MaterialDatabaseService {
  private cache = new Map<string, MaterialLookupResult>();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  async searchMaterials(filters: MaterialSearchFilters, limit = 50): Promise<ExtendedMaterialData[]> {
    try {
      // Check authentication before making query
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('Authentication required for material search');
        return [];
      }

      let query = supabase.from('unified_materials').select('*');

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.region) {
        query = query.eq('region', filters.region);
      }

      if (filters.carbonIntensity) {
        query = query.eq('carbon_intensity_category', filters.carbonIntensity);
      }

      if (filters.recyclability) {
        query = query.eq('recyclability', filters.recyclability);
      }

      if (filters.greenStarCompliant !== undefined) {
        query = query.eq('green_star_compliant', filters.greenStarCompliant);
      }

      if (filters.searchTerm) {
        query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      query = query.order('data_quality_rating', { ascending: false, nullsFirst: false });
      query = query.limit(limit);

      const { data, error } = await query;

      if (error) {
        console.error('Error searching materials:', error);
        return [];
      }

      return (data || []) as ExtendedMaterialData[];
    } catch (error) {
      console.error('Material search failed:', error);
      return [];
    }
  }

  async lookupMaterial(materialName: string, fallbackFactor = 1.0): Promise<MaterialLookupResult> {
    const cacheKey = `lookup_${materialName.toLowerCase()}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.confidence < this.cacheExpiry) {
      return cached;
    }

    try {
      // Use the database function for best material data
      const { data, error } = await supabase.rpc('get_best_material_data', {
        material_name: materialName
      });

      if (error) {
        console.error('Material lookup error:', error);
        return this.createFallbackResult(materialName, fallbackFactor);
      }

      if (!data || data.length === 0) {
        console.warn(`No material found for: ${materialName}`);
        return this.createFallbackResult(materialName, fallbackFactor);
      }

      const materialData = data[0];
      const carbonFactor = materialData.carbon_footprint_kgco2e_kg || fallbackFactor;
      
      // Get alternatives
      const alternatives = await this.findAlternatives(materialName, materialData.id);

      const result: MaterialLookupResult = {
        material: materialData,
        carbonFactor,
        confidence: this.calculateConfidence(materialData),
        alternatives
      };

      // Cache the result
      this.cache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Material database lookup failed:', error);
      return this.createFallbackResult(materialName, fallbackFactor);
    }
  }

  async findAlternatives(materialType: string, excludeId?: string): Promise<ExtendedMaterialData[]> {
    try {
      // Check authentication before making query
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('Authentication required for finding alternatives');
        return [];
      }

      let query = supabase
        .from('unified_materials')
        .select('*')
        .or(`alternative_to.eq.${materialType},material_type.eq.${materialType}`)
        .order('sustainability_score', { ascending: false, nullsFirst: false })
        .limit(5);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error finding alternatives:', error);
        return [];
      }

      return (data || []) as ExtendedMaterialData[];
    } catch (error) {
      console.error('Alternative lookup failed:', error);
      return [];
    }
  }

  async getMaterialsByCategory(category: string): Promise<ExtendedMaterialData[]> {
    try {
      // Check authentication before making query
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('Authentication required for materials by category');
        return [];
      }

      const { data, error } = await supabase
        .from('unified_materials')
        .select('*')
        .eq('category', category)
        .order('name')
        .limit(100);

      if (error) {
        console.error('Error getting materials by category:', error);
        return [];
      }

      return (data || []) as ExtendedMaterialData[];
    } catch (error) {
      console.error('Category lookup failed:', error);
      return [];
    }
  }

  async getPopularMaterials(limit = 20): Promise<ExtendedMaterialData[]> {
    try {
      // Check authentication before making query
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('Authentication required for popular materials');
        return [];
      }

      const { data, error } = await supabase
        .from('unified_materials')
        .select('*')
        .order('data_quality_rating', { ascending: false, nullsFirst: false })
        .order('sustainability_score', { ascending: false, nullsFirst: false })
        .limit(limit);

      if (error) {
        console.error('Error getting popular materials:', error);
        return [];
      }

      return (data || []) as ExtendedMaterialData[];
    } catch (error) {
      console.error('Popular materials lookup failed:', error);
      return [];
    }
  }

  private createFallbackResult(materialName: string, fallbackFactor: number): MaterialLookupResult {
    return {
      material: {
        id: `fallback-${Date.now()}`,
        name: materialName,
        carbon_footprint_kgco2e_kg: fallbackFactor,
        unit: 'kg',
        source: 'fallback',
        verification_status: 'unverified' as const,
        data_quality_rating: 1
      },
      carbonFactor: fallbackFactor,
      confidence: 10, // Low confidence for fallback
      alternatives: []
    };
  }

  private calculateConfidence(material: ExtendedMaterialData): number {
    let confidence = 50; // Base confidence

    // Increase confidence based on verification status
    if (material.verification_status === 'verified') confidence += 30;
    else if (material.verification_status === 'peer_reviewed') confidence += 20;

    // Increase confidence based on data quality rating
    if (material.data_quality_rating) {
      confidence += material.data_quality_rating * 2;
    }

    // Increase confidence if EPD data exists
    if (material.epd_registration_number) confidence += 15;

    // Cap at 95%
    return Math.min(confidence, 95);
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const materialDatabaseService = new MaterialDatabaseService();