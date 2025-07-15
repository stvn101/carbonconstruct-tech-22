import { supabase } from '@/integrations/supabase/client';
import { apiResponseHandler, ApiResponse } from '../api/ApiResponseHandler';

interface QueryConfig {
  enableCache?: boolean;
  cacheTTL?: number;
  batchSize?: number;
  timeout?: number;
  retries?: number;
}

export class QueryOptimizer {
  private defaultConfig: QueryConfig = {
    enableCache: true,
    cacheTTL: 300000, // 5 minutes
    batchSize: 100,
    timeout: 30000,
    retries: 2
  };

  async optimizedQuery<T>(
    queryBuilder: any,
    cacheKey: string,
    config: QueryConfig = {}
  ): Promise<ApiResponse<T[]>> {
    const options = { ...this.defaultConfig, ...config };

    return apiResponseHandler.handleRequest(
      async () => {
        const { data, error } = await queryBuilder;
        
        if (error) {
          throw new Error(`Database query failed: ${error.message}`);
        }
        
        return data;
      },
      {
        cache: options.enableCache,
        cacheKey,
        cacheTTL: options.cacheTTL,
        timeout: options.timeout,
        retries: options.retries
      }
    );
  }

  // Optimized material search with pagination and filtering
  async searchMaterials(
    searchTerm: string,
    filters: {
      category?: string;
      region?: string;
      maxCarbonFootprint?: number;
      sustainabilityScore?: number;
    } = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 50 }
  ): Promise<ApiResponse<any[]>> {
    const cacheKey = `materials-${searchTerm}-${JSON.stringify(filters)}-${pagination.page}-${pagination.limit}`;
    
    return this.optimizedQuery(
      await this.buildMaterialQuery(searchTerm, filters, pagination),
      cacheKey,
      { cacheTTL: 600000 } // 10 minutes for material data
    );
  }

  private async buildMaterialQuery(searchTerm: string, filters: any, pagination: any) {
    // Check authentication before building query
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required for material search');
    }

    let query = supabase
      .from('unified_materials')
      .select(`
        id,
        name,
        description,
        carbon_footprint_kgco2e_kg,
        sustainability_score,
        category,
        region,
        recyclability,
        green_star_compliant,
        sustainability_notes
      `)
      .order('sustainability_score', { ascending: false });

    // Apply search term
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters.region) {
      query = query.eq('region', filters.region);
    }
    
    if (filters.maxCarbonFootprint) {
      query = query.lte('carbon_footprint_kgco2e_kg', filters.maxCarbonFootprint);
    }
    
    if (filters.sustainabilityScore) {
      query = query.gte('sustainability_score', filters.sustainabilityScore);
    }

    // Apply pagination
    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;
    query = query.range(from, to);

    return query;
  }

  // Batch operations for better performance
  async batchInsertMaterials<T>(
    records: T[],
    batchSize: number = 100
  ): Promise<ApiResponse<any>> {
    // Check authentication before making batch insert
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required for batch insert');
    }

    const batches = [];
    
    for (let i = 0; i < records.length; i += batchSize) {
      batches.push(records.slice(i, i + batchSize));
    }

    const results = [];
    
    for (const batch of batches) {
      const result = await apiResponseHandler.handleRequest(
        async () => {
          const { data, error } = await supabase
            .from('unified_materials')
            .insert(batch);
          
          if (error) {
            throw new Error(`Batch insert failed: ${error.message}`);
          }
          
          return data;
        }
      );
      
      if (!result.success) {
        return result;
      }
      
      results.push(result.data);
    }

    return apiResponseHandler.success(results);
  }

  // Optimized project queries with related data
  async getProjectWithRelatedData(projectId: string): Promise<ApiResponse<any>> {
    const cacheKey = `project-${projectId}-full`;
    
    return this.optimizedQuery(
      supabase
        .from('projects')
        .select(`
          *,
          calculations(*),
          subcontractor_uploads(*),
          carbon_budgets(*)
        `)
        .eq('id', projectId)
        .single(),
      cacheKey,
      { cacheTTL: 180000 } // 3 minutes for project data
    );
  }

  // Get material validation statistics with caching
  async getMaterialValidationStats(): Promise<ApiResponse<any>> {
    const cacheKey = 'material-validation-stats';
    
    return this.optimizedQuery(
      supabase.rpc('validate_unified_materials_data'),
      cacheKey,
      { cacheTTL: 900000 } // 15 minutes for stats
    );
  }

  // Clear specific cache entries
  clearCache(pattern?: string) {
    if (pattern) {
      // Clear cache entries matching pattern (simplified implementation)
      apiResponseHandler.clearCache(pattern);
    } else {
      apiResponseHandler.clearCache();
    }
  }
}

export const queryOptimizer = new QueryOptimizer();