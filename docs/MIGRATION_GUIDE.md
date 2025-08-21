# CarbonConstruct Database Migration Guide

## 1. Import Format & File Structure

### Single JSON File Per Table (Recommended)
Each table should be exported as a separate JSON file with this structure:

```json
{
  "table_name": "projects",
  "data": [
    {
      "id": "uuid-here",
      "user_id": "uuid-here",
      "name": "Project Name",
      "description": "Description",
      "result": {
        "materials": [...],
        "transport": [...],
        "energy": [...],
        "materialEmissions": 0,
        "transportEmissions": 0,
        "energyEmissions": 0,
        "totalEmissions": 0
      },
      "total": 0,
      "region": "AU",
      "tags": ["tag1", "tag2"],
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## 2. Required File Structure for Each Table

### Core Tables (Independent - Import First)
1. **admins.json**
```json
{
  "table_name": "admins",
  "data": [
    {
      "id": "uuid",
      "email": "admin@example.com",
      "created_at": "timestamp"
    }
  ]
}
```

2. **unified_materials.json**
```json
{
  "table_name": "unified_materials", 
  "data": [
    {
      "id": "uuid",
      "name": "Material Name",
      "category": "Category",
      "embodied_carbon": 1.5,
      "unit": "kg",
      "data_quality": "Good",
      "source": "Source",
      "region": "AU",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

3. **verifiers.json**
```json
{
  "table_name": "verifiers",
  "data": [
    {
      "id": "uuid",
      "name": "Verifier Name",
      "email": "verifier@example.com",
      "certification": "ISO 14040",
      "active": true,
      "created_at": "timestamp"
    }
  ]
}
```

4. **projects.json**
```json
{
  "table_name": "projects",
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "name": "Project Name",
      "description": "Description",
      "result": {
        "materials": [
          {
            "id": "material-id",
            "name": "Concrete",
            "quantity": 100,
            "unit": "m3",
            "emissions": 50.5
          }
        ],
        "transport": [
          {
            "id": "transport-id", 
            "mode": "truck",
            "distance": 50,
            "emissions": 10.2
          }
        ],
        "energy": [
          {
            "id": "energy-id",
            "type": "electricity",
            "amount": 1000,
            "emissions": 25.3
          }
        ],
        "totalEmissions": 85.0,
        "materialEmissions": 50.5,
        "transportEmissions": 10.2,
        "energyEmissions": 25.3
      },
      "total": 85.0,
      "region": "AU", 
      "tags": ["construction", "residential"],
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

### Dependent Tables (Import After Core Tables)
5. **epd_records.json**
```json
{
  "table_name": "epd_records",
  "data": [
    {
      "id": "uuid",
      "material_id": "uuid-or-null",
      "company_id": "uuid-or-null", 
      "submitted_by": "uuid",
      "product_name": "Product Name",
      "product_description": "Description",
      "manufacturer_name": "Company Name",
      "manufacturer_location": "Location",
      "manufacturer_abn": "ABN",
      "functional_unit": "1 kg",
      "epd_stage_data": {
        "A1": 1.5,
        "A2": 0.5,
        "A3": 2.0
      },
      "total_co2e": 4.0,
      "gwp_fossil": 3.5,
      "gwp_biogenic": 0.5,
      "gwp_total": 4.0,
      "version_number": 1,
      "iso_compliant": true,
      "data_sources": ["source1", "source2"],
      "status": "verified",
      "verification_status": "Third-Party Verified",
      "epd_hash": "hash-string",
      "created_at": "timestamp",
      "updated_at": "timestamp",
      "submitted_at": "timestamp",
      "verified_at": "timestamp"
    }
  ]
}
```

6. **epd_stage_emissions.json**
```json
{
  "table_name": "epd_stage_emissions",
  "data": [
    {
      "id": "uuid",
      "epd_record_id": "uuid",
      "stage": "A1",
      "co2e_value": 1.5,
      "description": "Raw material supply",
      "data_source": "Industry average",
      "created_at": "timestamp"
    }
  ]
}
```

7. **epd_registry.json**
```json
{
  "table_name": "epd_registry",
  "data": [
    {
      "id": "uuid",
      "epd_record_id": "uuid",
      "short_hash": "abc123",
      "full_hash": "full-hash-string",
      "is_active": true,
      "publication_notes": "Notes",
      "created_at": "timestamp",
      "published_at": "timestamp"
    }
  ]
}
```

8. **epd_claude_logs.json**
```json
{
  "table_name": "epd_claude_logs",
  "data": [
    {
      "id": "uuid",
      "epd_id": "uuid-or-null",
      "user_id": "uuid",
      "prompt": "Prompt text",
      "response": "Response text",
      "context_data": {"key": "value"},
      "created_at": "timestamp"
    }
  ]
}
```

## 3. Import Order for FK Safety

### Phase 1: Independent Tables
1. `admins`
2. `unified_materials` 
3. `verifiers`
4. `projects`

### Phase 2: Dependent Tables
5. `epd_records` (depends on user_id)
6. `epd_stage_emissions` (depends on epd_record_id)
7. `epd_registry` (depends on epd_record_id)
8. `epd_claude_logs` (depends on user_id, optional epd_id)

## 4. Nested Arrays Handling

**Lovable stores nested arrays as JSONB in the `result` column of the `projects` table.**

- ✅ **Single file**: Include materials[], transport[], energy[] in the `result` JSONB field
- ❌ **Separate files**: Do NOT create separate files for nested arrays

## 5. Pre-Import SQL Commands

```sql
-- Disable RLS temporarily (run as service role)
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.unified_materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifiers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.epd_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.epd_stage_emissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.epd_registry DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.epd_claude_logs DISABLE ROW LEVEL SECURITY;

-- Disable triggers temporarily
ALTER TABLE public.unified_materials DISABLE TRIGGER ALL;
ALTER TABLE public.projects DISABLE TRIGGER ALL;
ALTER TABLE public.epd_records DISABLE TRIGGER ALL;
```

## 6. Post-Import SQL Commands

```sql
-- Re-enable RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unified_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epd_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epd_stage_emissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epd_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epd_claude_logs ENABLE ROW LEVEL SECURITY;

-- Re-enable triggers
ALTER TABLE public.unified_materials ENABLE TRIGGER ALL;
ALTER TABLE public.projects ENABLE TRIGGER ALL;
ALTER TABLE public.epd_records ENABLE TRIGGER ALL;

-- Verify counts
SELECT 'admins' as table_name, COUNT(*) as count FROM public.admins
UNION ALL
SELECT 'unified_materials', COUNT(*) FROM public.unified_materials
UNION ALL
SELECT 'verifiers', COUNT(*) FROM public.verifiers
UNION ALL
SELECT 'projects', COUNT(*) FROM public.projects
UNION ALL
SELECT 'epd_records', COUNT(*) FROM public.epd_records
UNION ALL
SELECT 'epd_stage_emissions', COUNT(*) FROM public.epd_stage_emissions
UNION ALL
SELECT 'epd_registry', COUNT(*) FROM public.epd_registry
UNION ALL
SELECT 'epd_claude_logs', COUNT(*) FROM public.epd_claude_logs;
```

## 7. Step-by-Step Import Process

### Option A: Via Data Migration UI
1. Navigate to `/data-migration` in Lovable
2. Upload each JSON file in the specified order
3. Review preview and validation
4. Execute migration for each table
5. Check migration reports

### Option B: Via Supabase SQL Editor
1. Access backend via Lovable's Backend tool
2. Run pre-import SQL commands
3. Use SQL INSERT statements for each table:

```sql
-- Example for projects table
INSERT INTO public.projects (
  id, user_id, name, description, result, total, region, tags, created_at, updated_at
) VALUES 
('uuid1', 'user-uuid1', 'Project 1', 'Description', '{"materials":[],"transport":[],"energy":[]}', 0, 'AU', '{}', '2024-01-01', '2024-01-01');
```

4. Run post-import SQL commands
5. Verify data integrity

### Option C: Programmatic via Edge Function
Create a bulk import edge function for large datasets.

## 8. Critical Notes

- **User Authentication**: Ensure `user_id` values exist in auth.users or create corresponding auth records first
- **UUID Consistency**: Maintain original UUIDs to preserve relationships
- **Timestamp Format**: Use ISO 8601 format: `2024-01-01T00:00:00.000Z`
- **JSONB Validation**: Ensure nested objects are valid JSON
- **File Size Limits**: For large datasets, split into smaller batches
- **Backup**: Always backup the target database before migration

## 9. Validation Queries

```sql
-- Check for orphaned records
SELECT 'epd_stage_emissions orphans' as check_name, COUNT(*) as count
FROM public.epd_stage_emissions e
LEFT JOIN public.epd_records r ON e.epd_record_id = r.id
WHERE r.id IS NULL;

-- Check for invalid user references
SELECT 'projects with invalid users' as check_name, COUNT(*) as count  
FROM public.projects p
LEFT JOIN auth.users u ON p.user_id = u.id
WHERE u.id IS NULL;
```