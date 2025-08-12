
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { EXTENDED_MATERIALS } from '@/lib/materials/index';
import { logger } from '@/services/logging/EnhancedLoggingService';
import { performanceMonitor } from '@/services/performance/PerformanceMonitor';
import { supabase } from '@/integrations/supabase/client';

export interface UseSimplifiedMaterialsReturn {
  allMaterials: ExtendedMaterialData[];
  filteredMaterials: ExtendedMaterialData[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  loading: boolean;
  error: Error | null;
  totalCount: number;
  refreshMaterials: () => void;
  resetFilters: () => void;
  categories: string[];
  tags: string[];
}

export const useSimplifiedMaterials = (): UseSimplifiedMaterialsReturn => {
  const [allMaterials, setAllMaterials] = useState<ExtendedMaterialData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize materials data with unified_materials fallback
  const initializeMaterials = useCallback(async () => {
    const timer = performanceMonitor.startTimer('materials-initialization');

    logger.info('Initializing simplified materials', 'UseSimplifiedMaterials');
    setLoading(true);
    setError(null);

    const loadLocal = () => {
      // Convert EXTENDED_MATERIALS object to array with proper typing
      const materialsArray: ExtendedMaterialData[] = Object.entries(EXTENDED_MATERIALS).map(([key, material]) => ({
        id: key,
        name: material.name,
        category: material.category || 'general',
        carbon_footprint_kgco2e_kg: material.factor,
        factor: material.factor,
        unit: material.unit,
        region: material.region,
        tags: material.tags || [],
        sustainabilityScore: material.sustainabilityScore,
        recyclability: material.recyclability,
        alternativeTo: material.alternativeTo,
        notes: material.notes,
        // Add additional properties for compatibility
        scope1_emissions: material.factor * 0.6,
        scope2_emissions: material.factor * 0.2,
        scope3_emissions: material.factor * 0.2,
        environmental_impact_score: material.sustainabilityScore,
        carbon_intensity_category: material.factor < 0.1 ? 'low' : material.factor < 0.5 ? 'medium' : 'high'
      }));

      setAllMaterials(materialsArray);
      logger.debug('Local materials initialized successfully', 'UseSimplifiedMaterials', {
        count: materialsArray.length
      });
    };

    try {
      const sourcePref = typeof window !== 'undefined' ? (localStorage.getItem('cc_materials_source') || 'auto') : 'auto';
      const tryUnified = sourcePref === 'unified' || sourcePref === 'auto';

      if (tryUnified) {
        const { data, error } = await supabase
          .from('unified_materials')
          .select('id,name,category,region,embodied_carbon,unit,source', { count: 'exact' })
          .limit(500);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const mapped: ExtendedMaterialData[] = data.map((row: any) => {
            const ec = typeof row.embodied_carbon === 'number' ? row.embodied_carbon : Number(row.embodied_carbon);
            const factor = Number.isFinite(ec) ? ec : undefined;
            const regionName = row.region === 'AU' ? 'Australia' : (row.region || 'Australia');
            const carbonIntensity = typeof factor === 'number'
              ? (factor < 0.1 ? 'low' : factor < 0.5 ? 'medium' : 'high')
              : undefined;

            return {
              id: row.id,
              name: row.name,
              category: row.category || 'general',
              carbon_footprint_kgco2e_kg: factor,
              factor,
              unit: row.unit || 'kg',
              region: regionName,
              tags: [row.category, regionName, row.source].filter(Boolean) as string[],
              recyclability: 'Medium',
              source: row.source,
              environmental_impact_score: undefined,
              carbon_intensity_category: carbonIntensity,
              scope1_emissions: typeof factor === 'number' ? factor * 0.6 : undefined,
              scope2_emissions: typeof factor === 'number' ? factor * 0.2 : undefined,
              scope3_emissions: typeof factor === 'number' ? factor * 0.2 : undefined,
            } as ExtendedMaterialData;
          });

          setAllMaterials(mapped);
          logger.debug('Unified materials loaded', 'UseSimplifiedMaterials', {
            count: mapped.length,
            sourcePref
          });
          return;
        }
      }

      // Fallback to local source
      loadLocal();
    } catch (err) {
      const e = err as Error;
      logger.info('Unified materials unavailable, falling back to local', 'UseSimplifiedMaterials', { error: e?.message });
      loadLocal();
    } finally {
      setLoading(false);
      timer();
    }
  }, []);

  useEffect(() => {
    initializeMaterials();
  }, [initializeMaterials]);

  // Memoized filtered materials
  const filteredMaterials = useMemo(() => {
    const timer = performanceMonitor.startTimer('materials-filtering');
    
    try {
      let filtered = allMaterials;

      // Apply search filter
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(material =>
          material.name.toLowerCase().includes(searchLower) ||
          material.category?.toLowerCase().includes(searchLower) ||
          material.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      // Apply category filter
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(material => material.category === selectedCategory);
      }

      // Apply tag filter
      if (selectedTag !== 'all') {
        filtered = filtered.filter(material => 
          material.tags?.includes(selectedTag)
        );
      }

      logger.debug('Materials filtered', 'UseSimplifiedMaterials', {
        totalCount: allMaterials.length,
        filteredCount: filtered.length,
        searchTerm,
        selectedCategory,
        selectedTag
      });

      return filtered;
    } finally {
      timer();
    }
  }, [allMaterials, searchTerm, selectedCategory, selectedTag]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(allMaterials.map(m => m.category).filter(Boolean))
    ).sort();
    return ['all', ...uniqueCategories];
  }, [allMaterials]);

  // Get unique tags
  const tags = useMemo(() => {
    const allTags = allMaterials.flatMap(m => m.tags || []);
    const uniqueTags = Array.from(new Set(allTags)).sort();
    return ['all', ...uniqueTags];
  }, [allMaterials]);

  const refreshMaterials = useCallback(() => {
    logger.info('Refreshing materials data', 'UseSimplifiedMaterials');
    initializeMaterials();
  }, [initializeMaterials]);

  const resetFilters = useCallback(() => {
    logger.debug('Resetting material filters', 'UseSimplifiedMaterials');
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTag('all');
  }, []);

  return {
    allMaterials,
    filteredMaterials,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    loading,
    error,
    totalCount: allMaterials.length,
    refreshMaterials,
    resetFilters,
    categories,
    tags
  };
};
