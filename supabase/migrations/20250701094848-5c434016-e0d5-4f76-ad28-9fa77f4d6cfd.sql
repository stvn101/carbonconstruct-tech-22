
-- Let's analyze the duplicate detection to see what's being flagged
-- This will show us the actual material names and their details

WITH duplicate_analysis AS (
  SELECT 
    LOWER(TRIM(um.name)) as normalized_name,
    um.name as original_name,
    um.category,
    um.epd_registration_number,
    um.epd_publisher,
    um.carbon_footprint_kgco2e_kg,
    um.source_hierarchy_level,
    um.data_quality_rating,
    um.created_at,
    um.id,
    COUNT(*) OVER (PARTITION BY LOWER(TRIM(um.name))) as duplicate_count,
    ROW_NUMBER() OVER (
      PARTITION BY LOWER(TRIM(um.name)) 
      ORDER BY 
        CASE um.source_hierarchy_level
          WHEN 'level_1_verified_epd' THEN 1
          WHEN 'level_2_peer_reviewed' THEN 2  
          WHEN 'level_3_industry_average' THEN 3
          WHEN 'level_4_estimated' THEN 4
          ELSE 5
        END,
        um.data_quality_rating DESC NULLS LAST,
        um.updated_at DESC
    ) as quality_rank
  FROM unified_materials um
)
SELECT 
  'DUPLICATE_ANALYSIS' as analysis_type,
  normalized_name,
  duplicate_count,
  array_agg(
    json_build_object(
      'id', id,
      'original_name', original_name,
      'category', category,
      'epd_number', epd_registration_number,
      'publisher', epd_publisher,
      'carbon_footprint', carbon_footprint_kgco2e_kg,
      'source_level', source_hierarchy_level,
      'quality_rating', data_quality_rating,
      'created_at', created_at,
      'would_keep', CASE WHEN quality_rank = 1 THEN true ELSE false END
    ) ORDER BY quality_rank
  ) as material_details
FROM duplicate_analysis 
WHERE duplicate_count > 1
GROUP BY normalized_name, duplicate_count
ORDER BY duplicate_count DESC, normalized_name
LIMIT 10;
