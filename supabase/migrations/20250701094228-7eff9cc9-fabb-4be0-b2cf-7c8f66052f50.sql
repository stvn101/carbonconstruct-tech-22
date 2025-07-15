
-- Fixed Phase 1: Material Deduplication Implementation (Type Corrected)
-- Create comprehensive deduplication system with backup, analysis, and execution

-- Step 1: Create backup table for safety
CREATE TABLE IF NOT EXISTS unified_materials_backup AS 
SELECT * FROM unified_materials WHERE 1=0; -- Create structure only

-- Step 2: Create deduplication analysis function (TYPE FIXED)
CREATE OR REPLACE FUNCTION analyze_material_duplicates()
RETURNS TABLE(
  duplicate_group_name text,
  total_records bigint,
  records_to_keep integer,
  records_to_delete bigint,
  category text,
  epd_numbers text[],
  sample_ids uuid[]
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH duplicate_groups AS (
    SELECT 
      LOWER(TRIM(um.name)) as normalized_name,
      COUNT(*) as total_count,
      ARRAY_AGG(DISTINCT um.category ORDER BY um.category) as categories,
      ARRAY_AGG(DISTINCT um.epd_registration_number ORDER BY um.epd_registration_number) 
        FILTER (WHERE um.epd_registration_number IS NOT NULL) as epd_nums,
      ARRAY_AGG(um.id ORDER BY 
        CASE um.source_hierarchy_level
          WHEN 'level_1_verified_epd' THEN 1
          WHEN 'level_2_peer_reviewed' THEN 2  
          WHEN 'level_3_industry_average' THEN 3
          WHEN 'level_4_estimated' THEN 4
          ELSE 5
        END,
        um.data_quality_rating DESC NULLS LAST,
        um.updated_at DESC
      ) as all_ids
    FROM unified_materials um
    GROUP BY LOWER(TRIM(um.name))
    HAVING COUNT(*) > 1
  )
  SELECT 
    dg.normalized_name,
    dg.total_count,
    1 as records_to_keep,
    dg.total_count - 1 as records_to_delete,
    COALESCE(dg.categories[1], 'Unknown') as primary_category,
    dg.epd_nums,
    dg.all_ids[1:3] as sample_first_three_ids
  FROM duplicate_groups dg
  ORDER BY dg.total_count DESC, dg.normalized_name;
END;
$$;

-- Step 3: Create safe deduplication execution function (TYPE FIXED)
CREATE OR REPLACE FUNCTION execute_material_deduplication(
  dry_run boolean DEFAULT true,
  batch_size integer DEFAULT 50
)
RETURNS TABLE(
  action text,
  material_name text,
  records_processed integer,
  records_deleted integer,
  backup_created boolean
) 
LANGUAGE plpgsql
AS $$
DECLARE
  total_processed integer := 0;
  total_deleted integer := 0;
  backup_exists boolean := false;
  duplicate_record RECORD;
BEGIN
  -- Check if backup exists
  SELECT EXISTS(SELECT 1 FROM unified_materials_backup LIMIT 1) INTO backup_exists;
  
  -- Create full backup if not exists
  IF NOT backup_exists AND NOT dry_run THEN
    INSERT INTO unified_materials_backup SELECT * FROM unified_materials;
    backup_exists := true;
  END IF;
  
  -- Process duplicates in batches
  FOR duplicate_record IN 
    WITH duplicate_groups AS (
      SELECT 
        LOWER(TRIM(um.name)) as normalized_name,
        ARRAY_AGG(um.id ORDER BY 
          CASE um.source_hierarchy_level
            WHEN 'level_1_verified_epd' THEN 1
            WHEN 'level_2_peer_reviewed' THEN 2  
            WHEN 'level_3_industry_average' THEN 3
            WHEN 'level_4_estimated' THEN 4
            ELSE 5
          END,
          COALESCE(um.data_quality_rating, 0) DESC,
          um.updated_at DESC NULLS LAST
        ) as sorted_ids,
        um.name as original_name,
        COUNT(*)::integer as duplicate_count
      FROM unified_materials um
      GROUP BY LOWER(TRIM(um.name)), um.name
      HAVING COUNT(*) > 1
    )
    SELECT 
      dg.normalized_name,
      dg.original_name,
      dg.sorted_ids[2:] as ids_to_delete, -- Keep first, delete rest
      dg.duplicate_count
    FROM duplicate_groups dg
    LIMIT batch_size
  LOOP
    total_processed := total_processed + 1;
    
    IF NOT dry_run THEN
      -- Delete duplicate records (keeping the first/best one)
      DELETE FROM unified_materials 
      WHERE id = ANY(duplicate_record.ids_to_delete);
      
      total_deleted := total_deleted + array_length(duplicate_record.ids_to_delete, 1);
    END IF;
    
    -- Return progress info
    RETURN QUERY
    SELECT 
      CASE WHEN dry_run THEN 'DRY_RUN' ELSE 'EXECUTED' END,
      duplicate_record.original_name,
      1,
      CASE WHEN dry_run THEN 0 ELSE array_length(duplicate_record.ids_to_delete, 1) END,
      backup_exists;
  END LOOP;
  
  -- Return summary
  RETURN QUERY
  SELECT 
    'SUMMARY',
    'Total Processing Complete',
    total_processed,
    total_deleted,
    backup_exists;
END;
$$;

-- Step 4: Create monitoring function for future duplicate detection (TYPE FIXED)
CREATE OR REPLACE FUNCTION check_new_duplicates()
RETURNS TABLE(
  duplicate_name text,
  duplicate_count integer,
  created_recently boolean
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    LOWER(TRIM(um.name)) as normalized_name,
    COUNT(*)::integer as total_count,
    bool_or(um.created_at > now() - interval '7 days') as has_recent_entries
  FROM unified_materials um
  GROUP BY LOWER(TRIM(um.name))
  HAVING COUNT(*) > 1
  ORDER BY COUNT(*) DESC;
END;
$$;

-- Step 5: Create data quality validation function
CREATE OR REPLACE FUNCTION validate_deduplication_results()
RETURNS TABLE(
  validation_check text,
  status text,
  details jsonb
) 
LANGUAGE plpgsql
AS $$
DECLARE
  total_materials integer;
  total_duplicates integer;
  backup_count integer;
BEGIN
  -- Count current materials
  SELECT COUNT(*)::integer INTO total_materials FROM unified_materials;
  
  -- Count remaining duplicates
  SELECT COUNT(*)::integer INTO total_duplicates FROM (
    SELECT LOWER(TRIM(name))
    FROM unified_materials
    GROUP BY LOWER(TRIM(name))
    HAVING COUNT(*) > 1
  ) as dupe_check;
  
  -- Count backup records
  SELECT COUNT(*)::integer INTO backup_count FROM unified_materials_backup;
  
  RETURN QUERY VALUES
    ('TOTAL_MATERIALS', 'INFO', jsonb_build_object('count', total_materials)),
    ('REMAINING_DUPLICATES', 
     CASE WHEN total_duplicates = 0 THEN 'PASS' ELSE 'ATTENTION' END,
     jsonb_build_object('duplicate_groups', total_duplicates)),
    ('BACKUP_INTEGRITY', 
     CASE WHEN backup_count > 0 THEN 'PASS' ELSE 'MISSING' END,
     jsonb_build_object('backup_records', backup_count));
END;
$$;

-- Step 6: Run initial analysis
SELECT 'INITIAL_ANALYSIS' as phase, 'Starting deduplication analysis...' as status;
SELECT * FROM analyze_material_duplicates() LIMIT 20;
