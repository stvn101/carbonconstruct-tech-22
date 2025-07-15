
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImportSession {
  sessionId: string;
  totalRecords: number;
  processedRecords: number;
  batchSize: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results: ImportResult[];
  startTime: string;
  lastBatchTime?: string;
}

interface ImportResult {
  batchNumber: number;
  batchSize: number;
  inserted: number;
  skipped: number;
  errors: number;
  processingTime: number;
  details: {
    insertedRecords: ProcessedRecord[];
    skippedRecords: ProcessedRecord[];
    erroredRecords: ProcessedRecord[];
  };
}

interface ProcessedRecord {
  originalIndex: number;
  name: string;
  epdNumber?: string;
  reason?: string;
  error?: string;
  action: 'inserted' | 'skipped' | 'error';
}

interface ValidationError {
  field: string;
  value: any;
  rule: string;
  message: string;
}

interface EPDMaterial {
  // Core identification
  name: string;
  description?: string;
  category?: string;
  
  // EPD specific fields
  epd_registration_number?: string;
  epd_publisher?: string;
  epd_validity_date?: string;
  
  // Carbon footprint data
  carbon_footprint_kgco2e_kg?: number;
  carbon_footprint_kgco2e_tonne?: number;
  factor?: number;
  
  // Scope emissions
  scope1_emissions?: number;
  scope2_emissions?: number;
  scope3_emissions?: number;
  
  // Material properties
  unit?: string;
  region?: string;
  tags?: string[];
  recyclability?: string;
  
  // NABERS specific
  declared_unit?: string;
  conversion_factor?: number;
  average_ef?: number;
  min_in_category_ef?: number;
  max_in_category_ef?: number;
  data_quality_rating?: number;
  
  // Sustainability metrics
  sustainability_score?: number;
  environmental_impact_score?: number;
  
  // Standards and compliance
  applicable_standards?: string[];
  ncc_requirements?: string;
  
  // LCA data
  lca_methodology?: string;
  
  // Additional properties
  notes?: string;
  source?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { materials, batchSize = 500, testMode = false, sessionId } = await req.json();

    if (!materials || !Array.isArray(materials)) {
      throw new Error('Materials array is required');
    }

    console.log(`🚀 Starting EPD import: ${materials.length} materials, batch size: ${batchSize}, test mode: ${testMode}`);

    const session: ImportSession = {
      sessionId: sessionId || crypto.randomUUID(),
      totalRecords: materials.length,
      processedRecords: 0,
      batchSize,
      status: 'processing',
      results: [],
      startTime: new Date().toISOString()
    };

    // If test mode, limit to first 100 records
    const materialsToProcess = testMode ? materials.slice(0, 100) : materials;
    console.log(`📊 Processing ${materialsToProcess.length} materials in ${testMode ? 'TEST' : 'PRODUCTION'} mode`);

    // Process materials in batches
    const batches = [];
    for (let i = 0; i < materialsToProcess.length; i += batchSize) {
      batches.push(materialsToProcess.slice(i, i + batchSize));
    }

    console.log(`🔄 Created ${batches.length} batches for processing`);

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const batchStartTime = Date.now();
      
      console.log(`📦 Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} records)`);

      const batchResult = await processBatch(supabase, batch, batchIndex + 1, i);
      session.results.push(batchResult);
      session.processedRecords += batch.length;
      session.lastBatchTime = new Date().toISOString();

      console.log(`✅ Batch ${batchIndex + 1} completed: ${batchResult.inserted} inserted, ${batchResult.skipped} skipped, ${batchResult.errors} errors`);

      // Small delay between batches to prevent overwhelming the database
      if (batchIndex < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    session.status = 'completed';
    
    // Generate comprehensive report
    const finalReport = generateFinalReport(session);
    
    console.log(`🎉 Import completed: ${finalReport.summary.totalInserted} inserted, ${finalReport.summary.totalSkipped} skipped, ${finalReport.summary.totalErrors} errors`);

    return new Response(
      JSON.stringify(finalReport),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('❌ Import failed:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

async function processBatch(supabase: any, batch: EPDMaterial[], batchNumber: number, batchStartIndex: number): Promise<ImportResult> {
  const batchStartTime = Date.now();
  const result: ImportResult = {
    batchNumber,
    batchSize: batch.length,
    inserted: 0,
    skipped: 0,
    errors: 0,
    processingTime: 0,
    details: {
      insertedRecords: [],
      skippedRecords: [],
      erroredRecords: []
    }
  };

  for (let i = 0; i < batch.length; i++) {
    const material = batch[i];
    const originalIndex = batchStartIndex + i;
    
    try {
      // Step 1: Validate material
      const validationErrors = validateMaterial(material);
      if (validationErrors.length > 0) {
        result.errors++;
        result.details.erroredRecords.push({
          originalIndex,
          name: material.name || 'Unknown',
          epdNumber: material.epd_registration_number,
          reason: `Validation failed: ${validationErrors.map(e => e.message).join(', ')}`,
          action: 'error'
        });
        console.log(`❌ Validation failed for ${material.name}: ${validationErrors.map(e => e.message).join(', ')}`);
        continue;
      }

      // Step 2: Check for duplicates
      const duplicateCheck = await checkForDuplicates(supabase, material);
      if (duplicateCheck.isDuplicate) {
        result.skipped++;
        result.details.skippedRecords.push({
          originalIndex,
          name: material.name,
          epdNumber: material.epd_registration_number,
          reason: duplicateCheck.reason,
          action: 'skipped'
        });
        console.log(`⏭️ Skipped duplicate: ${material.name} - ${duplicateCheck.reason}`);
        continue;
      }

      // Step 3: Transform and insert material
      const transformedMaterial = transformMaterial(material);
      const { error } = await supabase
        .from('unified_materials')
        .insert(transformedMaterial);

      if (error) {
        result.errors++;
        result.details.erroredRecords.push({
          originalIndex,
          name: material.name,
          epdNumber: material.epd_registration_number,
          error: error.message,
          action: 'error'
        });
        console.log(`❌ Insert failed for ${material.name}: ${error.message}`);
      } else {
        result.inserted++;
        result.details.insertedRecords.push({
          originalIndex,
          name: material.name,
          epdNumber: material.epd_registration_number,
          action: 'inserted'
        });
        console.log(`✅ Inserted: ${material.name}`);
      }

    } catch (error) {
      result.errors++;
      result.details.erroredRecords.push({
        originalIndex,
        name: material.name || 'Unknown',
        epdNumber: material.epd_registration_number,
        error: error.message,
        action: 'error'
      });
      console.log(`❌ Processing error for ${material.name}: ${error.message}`);
    }
  }

  result.processingTime = Date.now() - batchStartTime;
  return result;
}

function validateMaterial(material: EPDMaterial): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  if (!material.name || material.name.trim().length === 0) {
    errors.push({
      field: 'name',
      value: material.name,
      rule: 'required',
      message: 'Material name is required'
    });
  }

  // EPD validation
  if (material.epd_registration_number && typeof material.epd_registration_number !== 'string') {
    errors.push({
      field: 'epd_registration_number',
      value: material.epd_registration_number,
      rule: 'type',
      message: 'EPD registration number must be a string'
    });
  }

  // Date validation
  if (material.epd_validity_date) {
    const date = new Date(material.epd_validity_date);
    if (isNaN(date.getTime())) {
      errors.push({
        field: 'epd_validity_date',
        value: material.epd_validity_date,
        rule: 'format',
        message: 'EPD validity date must be a valid date'
      });
    } else if (date < new Date()) {
      errors.push({
        field: 'epd_validity_date',
        value: material.epd_validity_date,
        rule: 'business',
        message: 'EPD validity date cannot be in the past'
      });
    }
  }

  // Numeric validation
  const numericFields = ['carbon_footprint_kgco2e_kg', 'factor', 'scope1_emissions', 'scope2_emissions', 'scope3_emissions'];
  numericFields.forEach(field => {
    const value = material[field as keyof EPDMaterial];
    if (value !== undefined && value !== null) {
      if (typeof value !== 'number' || isNaN(value)) {
        errors.push({
          field,
          value,
          rule: 'type',
          message: `${field} must be a valid number`
        });
      } else if (value < 0) {
        errors.push({
          field,
          value,
          rule: 'range',
          message: `${field} cannot be negative`
        });
      } else if (field.includes('carbon_footprint') && value > 10000) {
        errors.push({
          field,
          value,
          rule: 'range',
          message: `${field} seems unreasonably high (>10,000 kg CO2e/kg)`
        });
      }
    }
  });

  // Sustainability score validation
  if (material.sustainability_score !== undefined) {
    if (typeof material.sustainability_score !== 'number' || material.sustainability_score < 0 || material.sustainability_score > 100) {
      errors.push({
        field: 'sustainability_score',
        value: material.sustainability_score,
        rule: 'range',
        message: 'Sustainability score must be between 0 and 100'
      });
    }
  }

  return errors;
}

async function checkForDuplicates(supabase: any, material: EPDMaterial): Promise<{ isDuplicate: boolean; reason?: string }> {
  // Primary check: EPD registration number
  if (material.epd_registration_number) {
    const { data: epdMatch } = await supabase
      .from('unified_materials')
      .select('id, name, epd_registration_number')
      .eq('epd_registration_number', material.epd_registration_number)
      .maybeSingle();

    if (epdMatch) {
      return {
        isDuplicate: true,
        reason: `EPD registration number already exists: ${material.epd_registration_number} (existing: ${epdMatch.name})`
      };
    }
  }

  // Secondary check: Exact name match
  const { data: nameMatch } = await supabase
    .from('unified_materials')
    .select('id, name, epd_registration_number')
    .ilike('name', material.name)
    .maybeSingle();

  if (nameMatch) {
    // If existing record has EPD number but new one doesn't, it's likely a duplicate
    if (nameMatch.epd_registration_number && !material.epd_registration_number) {
      return {
        isDuplicate: true,
        reason: `Material name matches existing EPD record: ${nameMatch.name} (EPD: ${nameMatch.epd_registration_number})`
      };
    }
    
    // If neither has EPD number, consider exact name match as duplicate
    if (!nameMatch.epd_registration_number && !material.epd_registration_number) {
      return {
        isDuplicate: true,
        reason: `Exact material name already exists: ${nameMatch.name}`
      };
    }
  }

  return { isDuplicate: false };
}

function transformMaterial(material: EPDMaterial): any {
  return {
    // Core identification
    name: material.name.trim(),
    description: material.description || `${material.name} - EPD Material`,
    category: material.category || 'Construction Materials',
    
    // EPD specific
    epd_registration_number: material.epd_registration_number,
    epd_publisher: material.epd_publisher,
    epd_validity_date: material.epd_validity_date ? new Date(material.epd_validity_date).toISOString().split('T')[0] : null,
    
    // Carbon footprint (prioritize specific over general)
    carbon_footprint_kgco2e_kg: material.carbon_footprint_kgco2e_kg || material.factor || material.average_ef || 0,
    carbon_footprint_kgco2e_tonne: material.carbon_footprint_kgco2e_tonne || (material.carbon_footprint_kgco2e_kg ? material.carbon_footprint_kgco2e_kg * 1000 : null),
    factor: material.factor || material.carbon_footprint_kgco2e_kg || material.average_ef || 0,
    
    // Scope emissions
    scope1_emissions: material.scope1_emissions,
    scope2_emissions: material.scope2_emissions,
    scope3_emissions: material.scope3_emissions,
    
    // Material properties
    unit: material.unit || material.declared_unit || 'kg',
    region: material.region || 'Australia',
    tags: Array.isArray(material.tags) ? material.tags : ['epd', 'construction'],
    recyclability: material.recyclability || 'Medium',
    
    // CO2e ranges (from NABERS data)
    co2e_min: material.min_in_category_ef ? Math.round(material.min_in_category_ef) : null,
    co2e_max: material.max_in_category_ef ? Math.round(material.max_in_category_ef) : null,
    co2e_avg: material.average_ef ? Math.round(material.average_ef) : null,
    
    // Sustainability metrics
    sustainability_score: material.sustainability_score || 50,
    environmental_impact_score: material.environmental_impact_score || 50,
    
    // Standards and compliance
    applicable_standards: material.applicable_standards ? 
      (Array.isArray(material.applicable_standards) ? material.applicable_standards.join(', ') : material.applicable_standards) : 
      'AS/NZS 1170',
    ncc_requirements: material.ncc_requirements,
    
    // LCA and verification
    lca_methodology: material.lca_methodology || 'iso_14040_14044',
    source_hierarchy_level: material.epd_registration_number ? 'level_1_verified_epd' : 'level_3_industry_average',
    verification_status: material.epd_registration_number ? 'verified' : 'unverified',
    data_quality_rating: material.data_quality_rating || 7,
    
    // Metadata
    source: 'epd_import',
    notes: material.notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function generateFinalReport(session: ImportSession): any {
  const totalInserted = session.results.reduce((sum, r) => sum + r.inserted, 0);
  const totalSkipped = session.results.reduce((sum, r) => sum + r.skipped, 0);
  const totalErrors = session.results.reduce((sum, r) => sum + r.errors, 0);
  const totalProcessingTime = session.results.reduce((sum, r) => sum + r.processingTime, 0);

  const endTime = new Date().toISOString();
  const totalTime = new Date(endTime).getTime() - new Date(session.startTime).getTime();

  return {
    success: true,
    sessionId: session.sessionId,
    timestamp: endTime,
    
    // Field Mapping Summary
    fieldMapping: {
      description: "NABERS EPD to unified_materials field mapping",
      mappings: [
        { source: "name", target: "name", type: "direct", required: true },
        { source: "epd_registration_number", target: "epd_registration_number", type: "direct", note: "Primary duplicate detection key" },
        { source: "epd_publisher", target: "epd_publisher", type: "direct" },
        { source: "epd_validity_date", target: "epd_validity_date", type: "date_format", validation: "future_date_required" },
        { source: "carbon_footprint_kgco2e_kg", target: "carbon_footprint_kgco2e_kg", type: "numeric", validation: "positive_number" },
        { source: "average_ef", target: "factor", type: "fallback_mapping", note: "Used when carbon_footprint_kgco2e_kg not available" },
        { source: "declared_unit", target: "unit", type: "fallback_mapping", note: "Falls back to 'kg' if not provided" },
        { source: "scope1_emissions", target: "scope1_emissions", type: "numeric", validation: "positive_number" },
        { source: "scope2_emissions", target: "scope2_emissions", type: "numeric", validation: "positive_number" },
        { source: "scope3_emissions", target: "scope3_emissions", type: "numeric", validation: "positive_number" },
        { source: "min_in_category_ef", target: "co2e_min", type: "numeric_rounded" },
        { source: "max_in_category_ef", target: "co2e_max", type: "numeric_rounded" },
        { source: "data_quality_rating", target: "data_quality_rating", type: "numeric", default: 7 },
        { source: "auto_generated", target: "source_hierarchy_level", type: "conditional", logic: "level_1_verified_epd if EPD number exists, else level_3_industry_average" },
        { source: "auto_generated", target: "verification_status", type: "conditional", logic: "verified if EPD number exists, else unverified" },
        { source: "constant", target: "source", type: "fixed_value", value: "epd_import" },
        { source: "constant", target: "region", type: "default", value: "Australia" }
      ]
    },

    // Processing Summary
    summary: {
      totalRecords: session.totalRecords,
      processedRecords: session.processedRecords,
      totalInserted,
      totalSkipped,
      totalErrors,
      successRate: `${((totalInserted / session.processedRecords) * 100).toFixed(1)}%`,
      processingTime: `${(totalTime / 1000).toFixed(2)}s`,
      averageBatchTime: `${(totalProcessingTime / session.results.length / 1000).toFixed(2)}s`,
      batchSize: session.batchSize,
      totalBatches: session.results.length
    },

    // Validation Rules Applied
    validationRules: {
      required_fields: ["name"],
      data_types: {
        numeric_fields: ["carbon_footprint_kgco2e_kg", "factor", "scope1_emissions", "scope2_emissions", "scope3_emissions"],
        date_fields: ["epd_validity_date"],
        string_fields: ["name", "epd_registration_number", "epd_publisher"]
      },
      business_rules: [
        "EPD validity date must be in the future",
        "Carbon footprint values must be positive",
        "Carbon footprint values above 10,000 kg CO2e/kg flagged as suspicious",
        "Sustainability scores must be between 0-100"
      ]
    },

    // Duplicate Detection Summary
    duplicateDetection: {
      strategy: "Multi-level matching",
      criteria: [
        "Primary: EPD registration number exact match",
        "Secondary: Material name exact match (case-insensitive)",
        "Conflict resolution: Skip duplicates, log reasons"
      ],
      skippedDuplicates: session.results.reduce((sum, r) => sum + r.skipped, 0)
    },

    // Detailed Batch Results
    batchResults: session.results.map(result => ({
      batchNumber: result.batchNumber,
      batchSize: result.batchSize,
      processingTime: `${(result.processingTime / 1000).toFixed(2)}s`,
      results: {
        inserted: result.inserted,
        skipped: result.skipped,
        errors: result.errors
      },
      // Sample records for review
      sampleInserted: result.details.insertedRecords.slice(0, 3).map(r => ({ name: r.name, epdNumber: r.epdNumber })),
      sampleSkipped: result.details.skippedRecords.slice(0, 3).map(r => ({ name: r.name, reason: r.reason })),
      sampleErrors: result.details.erroredRecords.slice(0, 3).map(r => ({ name: r.name, error: r.error || r.reason }))
    })),

    // Data Quality Summary
    dataQuality: {
      recordsWithEPD: session.results.reduce((sum, r) => sum + r.details.insertedRecords.filter(rec => rec.epdNumber).length, 0),
      averageDataQualityRating: 7, // Would calculate from actual data
      sourceHierarchyDistribution: {
        level_1_verified_epd: session.results.reduce((sum, r) => sum + r.details.insertedRecords.filter(rec => rec.epdNumber).length, 0),
        level_3_industry_average: session.results.reduce((sum, r) => sum + r.details.insertedRecords.filter(rec => !rec.epdNumber).length, 0)
      }
    },

    // Next Steps
    nextSteps: totalErrors > 0 ? [
      "Review error records and fix data quality issues",
      "Re-run import for failed records if needed",
      "Verify inserted data quality in database",
      "Proceed with full production import if test batch successful"
    ] : [
      "Verify inserted data quality in database",
      "Proceed with full production import",
      "Set up monitoring for ongoing imports"
    ]
  };
}
