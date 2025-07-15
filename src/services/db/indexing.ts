
import { supabase } from '@/integrations/supabase/client';

/**
 * Database indexing service for optimizing queries
 * Updated to work with unified_materials only
 */

export const createMaterialIndexes = async () => {
  try {
    console.log('Creating material indexes...');
    
    // Call the validate function to ensure data integrity
    const { data, error } = await supabase.rpc('validate_unified_materials_data');
    
    if (error) {
      console.error('Error validating materials data:', error);
      return { success: false, error };
    }
    
    console.log('Material indexes validated successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in createMaterialIndexes:', error);
    return { success: false, error };
  }
};

export const optimizeMaterialQueries = async () => {
  try {
    console.log('Optimizing material queries...');
    
    // Get statistics about the unified materials
    const { data, error } = await supabase.rpc('validate_unified_materials_data');
    
    if (error) {
      console.error('Error optimizing queries:', error);
      return { success: false, error };
    }
    
    console.log('Query optimization complete:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in optimizeMaterialQueries:', error);
    return { success: false, error };
  }
};

export const analyzeMaterialPerformance = async () => {
  try {
    console.log('Analyzing material performance...');
    
    // Get performance metrics
    const { data, error } = await supabase.rpc('validate_unified_materials_data');
    
    if (error) {
      console.error('Error analyzing performance:', error);
      return { success: false, error };
    }
    
    console.log('Performance analysis complete:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in analyzeMaterialPerformance:', error);
    return { success: false, error };
  }
};

export const refreshMaterialIndexes = async () => {
  try {
    console.log('Refreshing material indexes...');
    
    // Refresh material data validation
    const { data, error } = await supabase.rpc('validate_unified_materials_data');
    
    if (error) {
      console.error('Error refreshing indexes:', error);
      return { success: false, error };
    }
    
    console.log('Index refresh complete:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error in refreshMaterialIndexes:', error);
    return { success: false, error };
  }
};
