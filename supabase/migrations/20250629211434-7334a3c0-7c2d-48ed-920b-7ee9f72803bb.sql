
-- Unified Materials Database - Post-Cleanup Status
-- This migration file is now simplified after removing legacy tables

-- Ensure unified_materials has optimal indexes for performance
CREATE INDEX IF NOT EXISTS idx_unified_materials_search ON unified_materials USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_unified_materials_category_region ON unified_materials(category, region);
CREATE INDEX IF NOT EXISTS idx_unified_materials_carbon_footprint_desc ON unified_materials(carbon_footprint_kgco2e_kg DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_unified_materials_sustainability_score ON unified_materials(sustainability_score DESC NULLS LAST);

-- Create a view for easy material statistics
CREATE OR REPLACE VIEW material_statistics AS
SELECT 
  COUNT(*) as total_materials,
  COUNT(CASE WHEN carbon_footprint_kgco2e_kg IS NOT NULL AND carbon_footprint_kgco2e_kg > 0 THEN 1 END) as materials_with_carbon_data,
  COUNT(CASE WHEN category IS NOT NULL THEN 1 END) as materials_with_categories,
  COUNT(CASE WHEN epd_registration_number IS NOT NULL THEN 1 END) as materials_with_epd,
  COUNT(DISTINCT category) as unique_categories,
  COUNT(DISTINCT region) as unique_regions,
  AVG(carbon_footprint_kgco2e_kg) as avg_carbon_footprint,
  AVG(sustainability_score) as avg_sustainability_score
FROM unified_materials;

-- Create a function to get material recommendations based on carbon footprint
CREATE OR REPLACE FUNCTION get_low_carbon_alternatives(target_category text DEFAULT NULL)
RETURNS TABLE(
  name text,
  category text,
  carbon_footprint_kgco2e_kg double precision,
  sustainability_score integer,
  region text
) 
LANGUAGE sql
AS $$
  SELECT 
    um.name,
    um.category,
    um.carbon_footprint_kgco2e_kg,
    um.sustainability_score,
    um.region
  FROM unified_materials um
  WHERE 
    um.carbon_footprint_kgco2e_kg IS NOT NULL 
    AND um.carbon_footprint_kgco2e_kg > 0
    AND (target_category IS NULL OR um.category = target_category)
  ORDER BY 
    um.carbon_footprint_kgco2e_kg ASC,
    um.sustainability_score DESC NULLS LAST
  LIMIT 50;
$$;

-- Create a function to search materials with ranking
CREATE OR REPLACE FUNCTION search_materials_ranked(search_term text)
RETURNS TABLE(
  id uuid,
  name text,
  category text,
  carbon_footprint_kgco2e_kg double precision,
  sustainability_score integer,
  region text,
  tags text[],
  search_rank real
) 
LANGUAGE sql
AS $$
  SELECT 
    um.id,
    um.name,
    um.category,
    um.carbon_footprint_kgco2e_kg,
    um.sustainability_score,
    um.region,
    um.tags,
    ts_rank(to_tsvector('english', um.name), plainto_tsquery('english', search_term)) as search_rank
  FROM unified_materials um
  WHERE 
    to_tsvector('english', um.name) @@ plainto_tsquery('english', search_term)
    OR um.name ILIKE '%' || search_term || '%'
  ORDER BY 
    search_rank DESC,
    um.name ASC
  LIMIT 100;
$$;

-- Update the validation function to include EPD statistics
CREATE OR REPLACE FUNCTION validate_unified_materials_data()
RETURNS TABLE(
  total_materials integer,
  materials_with_carbon_data integer,
  materials_with_categories integer,
  materials_with_epd integer,
  data_quality_summary jsonb
) 
LANGUAGE plpgsql
AS $$
DECLARE
  total_count integer;
  carbon_data_count integer;
  category_count integer;
  epd_count integer;
BEGIN
  SELECT COUNT(*) INTO total_count FROM unified_materials;
  SELECT COUNT(*) INTO carbon_data_count FROM unified_materials 
    WHERE carbon_footprint_kgco2e_kg IS NOT NULL AND carbon_footprint_kgco2e_kg > 0;
  SELECT COUNT(*) INTO category_count FROM unified_materials WHERE category IS NOT NULL;
  SELECT COUNT(*) INTO epd_count FROM unified_materials WHERE epd_registration_number IS NOT NULL;
  
  RETURN QUERY
  SELECT 
    total_count,
    carbon_data_count,
    category_count,
    epd_count,
    jsonb_build_object(
      'total_materials', total_count,
      'with_carbon_data', carbon_data_count,
      'with_categories', category_count,
      'with_epd_data', epd_count,
      'carbon_data_completeness_pct', ROUND((carbon_data_count::decimal / NULLIF(total_count, 0)::decimal) * 100, 2),
      'category_completeness_pct', ROUND((category_count::decimal / NULLIF(total_count, 0)::decimal) * 100, 2),
      'epd_coverage_pct', ROUND((epd_count::decimal / NULLIF(total_count, 0)::decimal) * 100, 2),
      'database_status', 'unified_materials_only',
      'validation_timestamp', now()
    ) as data_quality_summary;
END;
$$;

-- Final comment: Database is now streamlined to use only unified_materials table
-- Legacy tables (materials, materials_backup, nabers_materials, material_categories) have been removed
-- EPD and Green Star infrastructure remains intact for future imports
