
-- Check the total count of materials in the database
SELECT 
  'TOTAL_MATERIALS' as check_type,
  COUNT(*) as total_count
FROM unified_materials;

-- Also check materials with valid carbon footprint data (what the UI typically filters for)
SELECT 
  'MATERIALS_WITH_CARBON_DATA' as check_type,
  COUNT(*) as count_with_carbon_data
FROM unified_materials 
WHERE carbon_footprint_kgco2e_kg IS NOT NULL 
  AND carbon_footprint_kgco2e_kg > 0;

-- Check materials by category to see distribution
SELECT 
  'MATERIALS_BY_CATEGORY' as check_type,
  category,
  COUNT(*) as count_per_category
FROM unified_materials 
WHERE category IS NOT NULL
GROUP BY category
ORDER BY count_per_category DESC;

-- Check for any materials that might be filtered out by common conditions
SELECT 
  'MATERIALS_FILTERED_CONDITIONS' as check_type,
  SUM(CASE WHEN name IS NULL OR name = '' THEN 1 ELSE 0 END) as missing_name,
  SUM(CASE WHEN carbon_footprint_kgco2e_kg IS NULL THEN 1 ELSE 0 END) as missing_carbon_footprint,
  SUM(CASE WHEN carbon_footprint_kgco2e_kg <= 0 THEN 1 ELSE 0 END) as zero_or_negative_carbon,
  SUM(CASE WHEN category IS NULL OR category = '' THEN 1 ELSE 0 END) as missing_category
FROM unified_materials;
