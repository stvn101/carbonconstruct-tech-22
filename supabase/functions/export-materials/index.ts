
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔄 Starting unified materials export...');

    // Get validation data
    const { data: validationData, error: validationError } = await supabase
      .rpc('validate_unified_materials_data');

    if (validationError) {
      console.error('Error getting validation data:', validationError);
      throw validationError;
    }

    // Get all unified materials
    const { data: unifiedMaterials, error: unifiedError } = await supabase
      .from('unified_materials')
      .select('*')
      .order('name');

    if (unifiedError) {
      console.error('Error fetching unified materials:', unifiedError);
      throw unifiedError;
    }

    // Get EPD data count
    const { data: epdData, error: epdError } = await supabase
      .from('epd_data')
      .select('id')
      .limit(1);

    const summary = validationData?.[0] || {
      total_materials: unifiedMaterials?.length || 0,
      materials_with_carbon_data: 0,
      materials_with_categories: 0,
      data_quality_summary: {}
    };

    console.log(`📊 Unified Materials Export:`);
    console.log(`- Total Materials: ${summary.total_materials}`);
    console.log(`- With Carbon Data: ${summary.materials_with_carbon_data}`);
    console.log(`- With Categories: ${summary.materials_with_categories}`);

    // Function to convert array to CSV
    function arrayToCSV(data: any[]): string {
      if (!data || data.length === 0) {
        return 'No data available';
      }

      const headers = Object.keys(data[0]);
      const csvHeaders = headers.join(',');
      
      const csvRows = data.map(row => {
        return headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) {
            return '';
          }
          if (Array.isArray(value)) {
            return `"${value.join('; ')}"`;
          }
          if (typeof value === 'object') {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',');
      });

      return [csvHeaders, ...csvRows].join('\n');
    }

    const csvContent = arrayToCSV(unifiedMaterials || []);

    console.log('✅ Unified materials export completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          ...summary,
          export_timestamp: new Date().toISOString(),
          epd_data_available: (epdData?.length || 0) > 0,
          database_status: 'unified_materials_only'
        },
        csv_files: {
          unified_materials: csvContent
        },
        materials: unifiedMaterials?.slice(0, 20) // First 20 for preview
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('❌ Export failed:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
