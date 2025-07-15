
-- EPD Deduplication Analysis - Fixed GROUP BY Version
-- Corrected GROUP BY clause to include all non-aggregate columns

-- First, let's get an overview of EPD duplicates
WITH epd_duplicates AS (
  SELECT 
    epd_registration_number,
    COUNT(*) as duplicate_count
  FROM unified_materials 
  WHERE epd_registration_number IS NOT NULL 
    AND epd_registration_number != ''
  GROUP BY epd_registration_number 
  HAVING COUNT(*) > 1
)
SELECT 
  'EPD_DUPLICATES_OVERVIEW' as analysis_type,
  COUNT(*) as total_duplicate_epd_numbers,
  SUM(duplicate_count) as total_duplicate_records,
  MAX(duplicate_count) as max_duplicates_per_epd,
  ROUND(AVG(duplicate_count), 1) as avg_duplicates_per_epd
FROM epd_duplicates;

-- Detailed analysis of each EPD duplicate set
WITH epd_analysis AS (
  SELECT 
    epd_registration_number,
    id,
    name,
    carbon_footprint_kgco2e_kg,
    carbon_footprint_kgco2e_tonne,
    category,
    data_quality_rating,
    source_hierarchy_level,
    verification_status,
    updated_at,
    created_at,
    -- Count non-null core fields to measure completeness
    (CASE WHEN name IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN carbon_footprint_kgco2e_kg IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN carbon_footprint_kgco2e_tonne IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN category IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN unit IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN region IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN description IS NOT NULL THEN 1 ELSE 0 END) as completeness_score,
    ROW_NUMBER() OVER (
      PARTITION BY epd_registration_number 
      ORDER BY 
        CASE source_hierarchy_level
          WHEN 'level_1_verified_epd' THEN 1
          WHEN 'level_2_peer_reviewed' THEN 2
          WHEN 'level_3_industry_average' THEN 3
          WHEN 'level_4_estimated' THEN 4
          ELSE 5
        END,
        data_quality_rating DESC NULLS LAST,
        (CASE WHEN name IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN carbon_footprint_kgco2e_kg IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN carbon_footprint_kgco2e_tonne IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN category IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN unit IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN region IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN description IS NOT NULL THEN 1 ELSE 0 END) DESC,
        updated_at DESC
    ) as keep_rank
  FROM unified_materials 
  WHERE epd_registration_number IS NOT NULL 
    AND epd_registration_number != ''
    AND epd_registration_number IN (
      SELECT epd_registration_number 
      FROM unified_materials 
      WHERE epd_registration_number IS NOT NULL 
        AND epd_registration_number != ''
      GROUP BY epd_registration_number 
      HAVING COUNT(*) > 1
    )
),
conflict_analysis AS (
  SELECT 
    epd_registration_number,
    COUNT(DISTINCT carbon_footprint_kgco2e_kg) as carbon_kg_variants,
    COUNT(DISTINCT carbon_footprint_kgco2e_tonne) as carbon_tonne_variants,
    COUNT(DISTINCT category) as category_variants,
    COUNT(DISTINCT name) as name_variants,
    -- Fixed STRING_AGG syntax - removed ORDER BY when using DISTINCT
    STRING_AGG(DISTINCT COALESCE(carbon_footprint_kgco2e_kg::text, 'NULL'), ', ') as carbon_kg_values,
    STRING_AGG(DISTINCT COALESCE(category, 'NULL'), ', ') as category_values,
    STRING_AGG(DISTINCT COALESCE(name, 'NULL'), ', ') as name_values
  FROM epd_analysis
  GROUP BY epd_registration_number
)
SELECT 
  'EPD_DEDUPLICATION_RECOMMENDATIONS' as analysis_type,
  ea.epd_registration_number,
  ARRAY_AGG(ea.id ORDER BY ea.keep_rank) as all_material_ids,
  (ARRAY_AGG(ea.id ORDER BY ea.keep_rank))[1] as recommended_keep_id,
  (ARRAY_AGG(ea.name ORDER BY ea.keep_rank))[1] as recommended_keep_name,
  (ARRAY_AGG(ea.source_hierarchy_level ORDER BY ea.keep_rank))[1] as recommended_source_level,
  (ARRAY_AGG(ea.data_quality_rating ORDER BY ea.keep_rank))[1] as recommended_data_quality,
  (ARRAY_AGG(ea.completeness_score ORDER BY ea.keep_rank))[1] as recommended_completeness,
  COUNT(*) as total_duplicates,
  COUNT(*) - 1 as records_to_delete,
  CASE 
    WHEN ca.carbon_kg_variants > 1 OR ca.carbon_tonne_variants > 1 OR ca.category_variants > 1
    THEN 'CONFLICT_DETECTED'
    ELSE 'NO_CONFLICT'
  END as conflict_status,
  CASE 
    WHEN ca.carbon_kg_variants > 1 THEN 'Carbon kg values conflict: ' || ca.carbon_kg_values || '; '
    ELSE ''
  END ||
  CASE 
    WHEN ca.category_variants > 1 THEN 'Categories conflict: ' || ca.category_values || '; '
    ELSE ''
  END ||
  CASE 
    WHEN ca.name_variants > 1 THEN 'Names vary: ' || ca.name_values || '; '
    ELSE ''
  END as conflict_details,
  'Recommended based on: ' || 
  CASE (ARRAY_AGG(ea.source_hierarchy_level ORDER BY ea.keep_rank))[1]
    WHEN 'level_1_verified_epd' THEN 'Level 1 EPD'
    WHEN 'level_2_peer_reviewed' THEN 'Level 2 Peer Reviewed'
    WHEN 'level_3_industry_average' THEN 'Level 3 Industry Average'
    WHEN 'level_4_estimated' THEN 'Level 4 Estimated'
    ELSE 'Unknown Level'
  END || 
  ', Quality: ' || COALESCE((ARRAY_AGG(ea.data_quality_rating ORDER BY ea.keep_rank))[1]::text, 'NULL') ||
  ', Completeness: ' || (ARRAY_AGG(ea.completeness_score ORDER BY ea.keep_rank))[1]::text || '/7' as recommendation_reason
FROM epd_analysis ea
JOIN conflict_analysis ca ON ea.epd_registration_number = ca.epd_registration_number
GROUP BY 
  ea.epd_registration_number, 
  ca.carbon_kg_variants, 
  ca.carbon_tonne_variants, 
  ca.category_variants, 
  ca.name_variants,
  ca.carbon_kg_values, 
  ca.category_values, 
  ca.name_values
ORDER BY 
  CASE 
    WHEN ca.carbon_kg_variants > 1 OR ca.carbon_tonne_variants > 1 OR ca.category_variants > 1
    THEN 1 
    ELSE 2 
  END,
  COUNT(*) DESC,
  ea.epd_registration_number;

-- Summary statistics
WITH summary_stats AS (
  SELECT 
    epd_registration_number,
    COUNT(*) as duplicate_count,
    MAX(CASE 
      WHEN (SELECT COUNT(DISTINCT carbon_footprint_kgco2e_kg) 
            FROM unified_materials um2 
            WHERE um2.epd_registration_number = um.epd_registration_number 
              AND um2.carbon_footprint_kgco2e_kg IS NOT NULL) > 1 
      THEN 1 ELSE 0 
    END) as has_carbon_conflict,
    MAX(CASE 
      WHEN (SELECT COUNT(DISTINCT category) 
            FROM unified_materials um2 
            WHERE um2.epd_registration_number = um.epd_registration_number 
              AND um2.category IS NOT NULL) > 1 
      THEN 1 ELSE 0 
    END) as has_category_conflict
  FROM unified_materials um
  WHERE epd_registration_number IS NOT NULL 
    AND epd_registration_number != ''
    AND epd_registration_number IN (
      SELECT epd_registration_number 
      FROM unified_materials 
      WHERE epd_registration_number IS NOT NULL 
        AND epd_registration_number != ''
      GROUP BY epd_registration_number 
      HAVING COUNT(*) > 1
    )
  GROUP BY epd_registration_number
)
SELECT 
  'EPD_DEDUPLICATION_SUMMARY' as analysis_type,
  COUNT(*) as total_duplicate_epd_numbers,
  SUM(duplicate_count) as total_duplicate_records,
  SUM(duplicate_count - 1) as total_records_to_delete,
  SUM(has_carbon_conflict) as epds_with_carbon_conflicts,
  SUM(has_category_conflict) as epds_with_category_conflicts,
  ROUND(SUM(has_carbon_conflict)::decimal / COUNT(*)::decimal * 100, 1) as pct_carbon_conflicts,
  ROUND(SUM(has_category_conflict)::decimal / COUNT(*)::decimal * 100, 1) as pct_category_conflicts
FROM summary_stats;
