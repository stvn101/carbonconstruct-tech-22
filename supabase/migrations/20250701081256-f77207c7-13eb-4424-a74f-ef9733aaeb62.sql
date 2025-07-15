
-- First, let's check the actual columns in unified_materials table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'unified_materials' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
