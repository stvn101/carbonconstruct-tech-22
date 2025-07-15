import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EPDRecord {
  id: string
  material_id?: string
  product_name: string
  manufacturer_name: string
  functional_unit: string
  product_description?: string
  epd_stage_data: Record<string, any>
  total_co2e?: number
  gwp_fossil?: number
  gwp_biogenic?: number
  gwp_total?: number
  version_number: number
  status: string
  verification_status: string
  iso_compliant: boolean
  data_sources: any
  created_at: string
  updated_at: string
}

interface EPDStageData {
  co2e_value: number
  description?: string
  data_source?: string
}

// Generate EPD PDF content as HTML
function generateEpdHtml(epd: EPDRecord): string {
  const stageDescriptions: Record<string, string> = {
    A1: 'Raw material supply',
    A2: 'Transport to manufacturer',
    A3: 'Manufacturing',
    A4: 'Transport to construction site',
    A5: 'Installation process',
    B1: 'Use',
    B2: 'Maintenance',
    B3: 'Repair',
    B4: 'Replacement',
    B5: 'Refurbishment',
    B6: 'Operational energy use',
    B7: 'Operational water use',
    C1: 'Deconstruction/demolition',
    C2: 'Transport to waste processing',
    C3: 'Waste processing',
    C4: 'Final disposal',
    D: 'Benefits beyond system boundary'
  }

  const stageRows = Object.entries(epd.epd_stage_data)
    .filter(([_, data]) => data && typeof data === 'object' && 'co2e_value' in data)
    .map(([stage, data]) => {
      const stageData = data as EPDStageData
      return `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-family: monospace;">${stage}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${stageDescriptions[stage] || stage}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${stageData.co2e_value.toFixed(3)}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">kg CO₂e</td>
        </tr>
      `
    }).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Environmental Product Declaration</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px; 
          line-height: 1.6;
        }
        .header { 
          text-align: center; 
          border-bottom: 2px solid #333; 
          padding-bottom: 20px; 
          margin-bottom: 30px;
        }
        .section { 
          margin-bottom: 25px; 
        }
        .section-title { 
          font-size: 18px; 
          font-weight: bold; 
          color: #333; 
          border-bottom: 1px solid #ccc; 
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 10px;
        }
        .info-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 15px;
          margin-bottom: 20px;
        }
        .info-item {
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 4px;
        }
        .info-label { 
          font-weight: bold; 
          color: #666; 
          font-size: 12px;
          margin-bottom: 5px;
        }
        .impact-summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin: 20px 0;
        }
        .impact-card {
          text-align: center;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #f8f9fa;
        }
        .impact-value {
          font-size: 24px;
          font-weight: bold;
          color: #007bff;
        }
        .impact-label {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
        .compliance-notice {
          background: #fff3cd;
          border: 1px solid #ffc107;
          padding: 15px;
          border-radius: 5px;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Environmental Product Declaration</h1>
        <p style="margin: 10px 0; color: #666;">In accordance with ISO 14025, EN 15804, and ISO 21930</p>
      </div>

      <div class="section">
        <div class="section-title">Product Information</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Product Name</div>
            <div>${epd.product_name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Manufacturer</div>
            <div>${epd.manufacturer_name}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Functional Unit</div>
            <div>${epd.functional_unit}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Version</div>
            <div>v${epd.version_number}</div>
          </div>
        </div>
        ${epd.product_description ? `
          <div style="margin-top: 15px;">
            <div class="info-label">Description</div>
            <p>${epd.product_description}</p>
          </div>
        ` : ''}
      </div>

      <div class="section">
        <div class="section-title">Environmental Impact Summary</div>
        <div class="impact-summary">
          <div class="impact-card">
            <div class="impact-value">${(epd.total_co2e || 0).toFixed(2)}</div>
            <div class="impact-label">Total CO₂e (kg)</div>
          </div>
          <div class="impact-card">
            <div class="impact-value">${(epd.gwp_fossil || 0).toFixed(2)}</div>
            <div class="impact-label">GWP Fossil (kg)</div>
          </div>
          <div class="impact-card">
            <div class="impact-value">${(epd.gwp_biogenic || 0).toFixed(2)}</div>
            <div class="impact-label">GWP Biogenic (kg)</div>
          </div>
          <div class="impact-card">
            <div class="impact-value">${(epd.gwp_total || 0).toFixed(2)}</div>
            <div class="impact-label">GWP Total (kg)</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Lifecycle Stage Emissions (kg CO₂e per ${epd.functional_unit})</div>
        <table style="border: 1px solid #ddd;">
          <thead style="background: #f5f5f5;">
            <tr>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Stage</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Description</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Emissions</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Unit</th>
            </tr>
          </thead>
          <tbody>
            ${stageRows}
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Data Sources & Methodology</div>
        ${Array.isArray(epd.data_sources) ? epd.data_sources.map((source: string) => `
          <div style="margin: 5px 0;">• ${source}</div>
        `).join('') : '<div>• CarbonConstruct EPD Generator</div>'}
      </div>

      <div class="compliance-notice">
        <div style="font-weight: bold; margin-bottom: 10px;">Verification & Compliance Notice</div>
        <p style="margin: 5px 0;">This EPD has been automatically generated by the CarbonConstruct platform.</p>
        <p style="margin: 5px 0;"><strong>Current status:</strong> ${epd.verification_status}</p>
        <p style="margin: 5px 0;">For official compliance purposes, third-party verification by a qualified LCA consultant may be required.</p>
        <div style="margin-top: 15px; font-size: 12px; color: #666;">
          Generated: ${new Date(epd.created_at).toLocaleString()} | 
          Platform: CarbonConstruct EPD Generator | 
          Standards: ISO 14025, EN 15804, ISO 21930
        </div>
      </div>
    </body>
    </html>
  `
}

// Generate CSV content
function generateEpdCsv(epd: EPDRecord): string {
  const csvRows: string[] = []
  
  // Header
  csvRows.push('Category,Field,Value')
  
  // Product Information
  csvRows.push(`Product Information,Product Name,${epd.product_name}`)
  csvRows.push(`Product Information,Manufacturer,${epd.manufacturer_name}`)
  csvRows.push(`Product Information,Functional Unit,${epd.functional_unit}`)
  csvRows.push(`Product Information,Version,v${epd.version_number}`)
  csvRows.push(`Product Information,Status,${epd.status}`)
  csvRows.push(`Product Information,Description,"${epd.product_description || 'N/A'}"`)
  
  // Environmental Impact
  csvRows.push(`Environmental Impact,Total CO2e (kg),${(epd.total_co2e || 0).toFixed(3)}`)
  csvRows.push(`Environmental Impact,GWP Fossil (kg),${(epd.gwp_fossil || 0).toFixed(3)}`)
  csvRows.push(`Environmental Impact,GWP Biogenic (kg),${(epd.gwp_biogenic || 0).toFixed(3)}`)
  csvRows.push(`Environmental Impact,GWP Total (kg),${(epd.gwp_total || 0).toFixed(3)}`)
  
  // Lifecycle Stages
  const stageDescriptions: Record<string, string> = {
    A1: 'Raw material supply',
    A2: 'Transport to manufacturer',
    A3: 'Manufacturing',
    A4: 'Transport to construction site',
    A5: 'Installation process',
    B1: 'Use',
    B2: 'Maintenance',
    B3: 'Repair',
    B4: 'Replacement',
    B5: 'Refurbishment',
    B6: 'Operational energy use',
    B7: 'Operational water use',
    C1: 'Deconstruction/demolition',
    C2: 'Transport to waste processing',
    C3: 'Waste processing',
    C4: 'Final disposal',
    D: 'Benefits beyond system boundary'
  }

  Object.entries(epd.epd_stage_data).forEach(([stage, stageData]) => {
    if (stageData && typeof stageData === 'object' && 'co2e_value' in stageData) {
      const value = (stageData as EPDStageData).co2e_value
      csvRows.push(`Lifecycle Stage,"${stage} - ${stageDescriptions[stage] || stage}",${value.toFixed(3)} kg CO2e`)
    }
  })
  
  // Metadata
  csvRows.push(`Metadata,Created At,${epd.created_at}`)
  csvRows.push(`Metadata,Verification Status,${epd.verification_status}`)
  csvRows.push(`Metadata,ISO Compliant,${epd.iso_compliant ? 'Yes' : 'No'}`)
  
  return csvRows.join('\n')
}

// Generate JSON content
function generateEpdJson(epd: EPDRecord): string {
  const exportData = {
    epd_info: {
      id: epd.id,
      product_name: epd.product_name,
      manufacturer_name: epd.manufacturer_name,
      functional_unit: epd.functional_unit,
      version_number: epd.version_number,
      status: epd.status,
      verification_status: epd.verification_status,
      iso_compliant: epd.iso_compliant
    },
    environmental_impact: {
      total_co2e: epd.total_co2e,
      gwp_fossil: epd.gwp_fossil,
      gwp_biogenic: epd.gwp_biogenic,
      gwp_total: epd.gwp_total
    },
    lifecycle_stages: epd.epd_stage_data,
    product_details: {
      description: epd.product_description,
    },
    metadata: {
      created_at: epd.created_at,
      updated_at: epd.updated_at,
      data_sources: epd.data_sources,
      export_timestamp: new Date().toISOString(),
      export_source: 'CarbonConstruct EPD Generator'
    },
    compliance: {
      standards: ['ISO 14025', 'EN 15804', 'ISO 21930'],
      declaration_type: 'Type III Environmental Declaration',
      verification_note: 'This EPD was automatically generated and may require third-party verification for official compliance.'
    }
  }

  return JSON.stringify(exportData, null, 2)
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { epdId } = await req.json()

    if (!epdId) {
      return new Response(
        JSON.stringify({ error: 'EPD ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log(`Starting EPD export for ID: ${epdId}`)

    // Fetch EPD record
    const { data: epd, error: fetchError } = await supabase
      .from('epd_records')
      .select('*')
      .eq('id', epdId)
      .single()

    if (fetchError || !epd) {
      console.error('EPD fetch error:', fetchError)
      return new Response(
        JSON.stringify({ error: `EPD not found: ${fetchError?.message}` }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Found EPD: ${epd.product_name}`)

    // Generate timestamp for unique filenames
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const baseName = `epd_${epd.id}_v${epd.version_number}_${timestamp}`

    // Generate file contents
    const htmlContent = generateEpdHtml(epd as EPDRecord)
    const csvContent = generateEpdCsv(epd as EPDRecord)
    const jsonContent = generateEpdJson(epd as EPDRecord)

    console.log('Generated file contents')

    // Convert HTML to simple text for basic PDF (in a real implementation, you'd use a proper HTML-to-PDF service)
    const textContent = htmlContent.replace(/<[^>]*>/g, '\n').replace(/\n+/g, '\n').trim()

    // Upload files to storage
    const uploads = await Promise.all([
      // Upload HTML (as PDF alternative for now)
      supabase.storage
        .from('epd-exports')
        .upload(`${epd.id}/${baseName}.html`, htmlContent, {
          contentType: 'text/html',
          upsert: true
        }),
      
      // Upload CSV
      supabase.storage
        .from('epd-exports')
        .upload(`${epd.id}/${baseName}.csv`, csvContent, {
          contentType: 'text/csv',
          upsert: true
        }),
      
      // Upload JSON
      supabase.storage
        .from('epd-exports')
        .upload(`${epd.id}/${baseName}.json`, jsonContent, {
          contentType: 'application/json',
          upsert: true
        })
    ])

    // Check for upload errors
    const uploadErrors = uploads.filter(upload => upload.error)
    if (uploadErrors.length > 0) {
      console.error('Upload errors:', uploadErrors)
      return new Response(
        JSON.stringify({ error: 'Failed to upload files', details: uploadErrors }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const [htmlUpload, csvUpload, jsonUpload] = uploads
    console.log('Files uploaded successfully')

    // Get public URLs for the uploaded files
    const { data: htmlUrl } = supabase.storage
      .from('epd-exports')
      .getPublicUrl(htmlUpload.data!.path)
    
    const { data: csvUrl } = supabase.storage
      .from('epd-exports')
      .getPublicUrl(csvUpload.data!.path)
    
    const { data: jsonUrl } = supabase.storage
      .from('epd-exports')
      .getPublicUrl(jsonUpload.data!.path)

    // Update EPD record with file URLs and status
    const { error: updateError } = await supabase
      .from('epd_records')
      .update({
        status: 'submitted_for_review',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', epdId)

    if (updateError) {
      console.error('Update error:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update EPD record', details: updateError }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('EPD record updated successfully')

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        epdId,
        files: {
          html: htmlUrl.publicUrl,
          csv: csvUrl.publicUrl,
          json: jsonUrl.publicUrl
        },
        message: 'EPD exported successfully and submitted for review'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('EPD export error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})