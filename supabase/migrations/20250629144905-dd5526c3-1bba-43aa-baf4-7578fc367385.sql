
-- Fixed version: Identify and remove duplicate materials from unified_materials table
-- Keep the oldest record (first created) for each duplicate group

-- First, let's see what duplicates exist
SELECT 
  'EPD Registration Number Duplicates:' as duplicate_type,
  epd_registration_number,
  COUNT(*) as duplicate_count
FROM unified_materials 
WHERE epd_registration_number IS NOT NULL
GROUP BY epd_registration_number 
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Show exact name duplicates (for materials without EPD numbers)
SELECT 
  'Material Name Duplicates (no EPD):' as duplicate_type,
  name,
  COUNT(*) as duplicate_count
FROM unified_materials 
WHERE epd_registration_number IS NULL
GROUP BY name 
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Show detailed preview of what will be deleted (EPD duplicates)
SELECT 
  'EPD DUPLICATES TO DELETE:' as action,
  um.id,
  um.name,
  um.epd_registration_number,
  um.created_at,
  um.carbon_footprint_kgco2e_kg,
  'Keep oldest, delete this newer one' as reason
FROM unified_materials um
WHERE um.epd_registration_number IS NOT NULL
  AND um.created_at > (
    SELECT MIN(created_at) 
    FROM unified_materials um2 
    WHERE um2.epd_registration_number = um.epd_registration_number
  )
ORDER BY um.epd_registration_number, um.created_at;

-- Show detailed preview of what will be deleted (Name duplicates)
SELECT 
  'NAME DUPLICATES TO DELETE:' as action,
  um.id,
  um.name,
  um.created_at,
  um.carbon_footprint_kgco2e_kg,
  'Keep oldest, delete this newer one' as reason
FROM unified_materials um
WHERE um.epd_registration_number IS NULL
  AND um.created_at > (
    SELECT MIN(created_at) 
    FROM unified_materials um2 
    WHERE um2.name = um.name
      AND um2.epd_registration_number IS NULL
  )
ORDER BY um.name, um.created_at;

-- Execute the deletion of EPD duplicates (keeping oldest)
DELETE FROM unified_materials 
WHERE epd_registration_number IS NOT NULL
  AND created_at > (
    SELECT MIN(created_at) 
    FROM unified_materials um2 
    WHERE um2.epd_registration_number = unified_materials.epd_registration_number
  );

-- Execute the deletion of name duplicates (keeping oldest)
DELETE FROM unified_materials 
WHERE epd_registration_number IS NULL
  AND created_at > (
    SELECT MIN(created_at) 
    FROM unified_materials um2 
    WHERE um2.name = unified_materials.name
      AND um2.epd_registration_number IS NULL
  );

-- Show final summary
SELECT 
  'CLEANUP COMPLETE - Total materials remaining:' as summary,
  COUNT(*) as total_count
FROM unified_materials;

-- Final verification - should return no results if successful
SELECT 
  'VERIFICATION - EPD duplicates remaining (should be 0):' as check_type,
  epd_registration_number,
  COUNT(*) as count
FROM unified_materials 
WHERE epd_registration_number IS NOT NULL
GROUP BY epd_registration_number 
HAVING COUNT(*) > 1;

SELECT 
  'VERIFICATION - Name duplicates remaining (should be 0):' as check_type,
  name,
  COUNT(*) as count
FROM unified_materials 
WHERE epd_registration_number IS NULL
GROUP BY name 
HAVING COUNT(*) > 1;
