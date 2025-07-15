
-- Phase 1: Database Cleanup - Remove Legacy Material Tables and Views

-- Step 1: Drop dependent views first (CASCADE will handle dependencies)
DROP VIEW IF EXISTS material_analysis CASCADE;
DROP VIEW IF EXISTS consolidation_report CASCADE;
DROP VIEW IF EXISTS materials_unified_view CASCADE;
DROP VIEW IF EXISTS materials_view CASCADE;
DROP VIEW IF EXISTS dependent_view1 CASCADE;
DROP VIEW IF EXISTS dependent_view2 CASCADE;

-- Step 2: Drop legacy material tables (CASCADE will handle foreign key constraints)
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS materials_backup CASCADE;
DROP TABLE IF EXISTS nabers_materials CASCADE;
DROP TABLE IF EXISTS material_categories CASCADE;

-- Step 3: Clean up functions that reference deleted tables
DROP FUNCTION IF EXISTS get_material_categories() CASCADE;
DROP FUNCTION IF EXISTS get_materials() CASCADE;
DROP FUNCTION IF EXISTS refresh_material_categories() CASCADE;
DROP FUNCTION IF EXISTS update_sustainability_score() CASCADE;
DROP FUNCTION IF EXISTS set_manual_sustainability_score(integer, integer, text) CASCADE;
DROP FUNCTION IF EXISTS calculate_weighted_sustainability(double precision, integer, double precision) CASCADE;
DROP FUNCTION IF EXISTS calculate_total_co2e(jsonb) CASCADE;
DROP FUNCTION IF EXISTS update_nabers_materials_updated_at() CASCADE;

-- Step 4: Remove the temporary export function used for consolidation
DROP FUNCTION IF EXISTS export_consolidated_materials() CASCADE;

-- Step 5: Clean up any remaining sequences from deleted tables
DROP SEQUENCE IF EXISTS materials_id_seq CASCADE;
DROP SEQUENCE IF EXISTS material_categories_id_seq CASCADE;

-- Step 6: Update unified_materials to ensure it has all necessary indexes for performance
CREATE INDEX IF NOT EXISTS idx_unified_materials_name ON unified_materials USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_unified_materials_category ON unified_materials(category);
CREATE INDEX IF NOT EXISTS idx_unified_materials_region ON unified_materials(region);
CREATE INDEX IF NOT EXISTS idx_unified_materials_tags ON unified_materials USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_unified_materials_carbon_footprint ON unified_materials(carbon_footprint_kgco2e_kg);

-- Step 7: Create a function to validate unified_materials data integrity
CREATE OR REPLACE FUNCTION validate_unified_materials_data()
RETURNS TABLE(
  total_materials integer,
  materials_with_carbon_data integer,
  materials_with_categories integer,
  data_quality_summary jsonb
) 
LANGUAGE plpgsql
AS $$
DECLARE
  total_count integer;
  carbon_data_count integer;
  category_count integer;
BEGIN
  SELECT COUNT(*) INTO total_count FROM unified_materials;
  SELECT COUNT(*) INTO carbon_data_count FROM unified_materials 
    WHERE carbon_footprint_kgco2e_kg IS NOT NULL AND carbon_footprint_kgco2e_kg > 0;
  SELECT COUNT(*) INTO category_count FROM unified_materials WHERE category IS NOT NULL;
  
  RETURN QUERY
  SELECT 
    total_count,
    carbon_data_count,
    category_count,
    jsonb_build_object(
      'total_materials', total_count,
      'with_carbon_data', carbon_data_count,
      'with_categories', category_count,
      'data_completeness_pct', ROUND((carbon_data_count::decimal / total_count::decimal) * 100, 2),
      'validation_timestamp', now()
    ) as data_quality_summary;
END;
$$;

-- Step 8: Verify the cleanup was successful
SELECT 
  'unified_materials' as table_name,
  COUNT(*) as record_count,
  'ACTIVE - Primary materials table' as status
FROM unified_materials

UNION ALL

SELECT 
  'epd_data' as table_name,
  COUNT(*) as record_count,
  'ACTIVE - EPD records' as status
FROM epd_data

UNION ALL

SELECT 
  'green_star_projects' as table_name,
  COUNT(*) as record_count,
  'ACTIVE - Green Star compliance' as status
FROM green_star_projects;
