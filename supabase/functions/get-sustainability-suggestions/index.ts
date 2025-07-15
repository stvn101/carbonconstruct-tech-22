
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Define CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create Supabase client using environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Handle sustainability suggestions API requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user information from JWT token
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (user && !error) {
        userId = user.id;
      }
    }

    // Extract request data
    const { materials, transport, energy, options } = await req.json();
    
    // Record usage for tracking
    if (userId) {
      await recordGrokUsage(userId, 'sustainability_suggestions', {
        materialsCount: materials?.length || 0,
        transportCount: transport?.length || 0,
        energyCount: energy?.length || 0,
        optionsFormat: options?.format || 'basic'
      });
    }
    
    // Try to get AI-powered suggestions first, fallback to local analysis
    let suggestions;
    try {
      suggestions = await generateAISustainabilitySuggestions(materials, transport, energy, options);
    } catch (aiError) {
      console.log('AI analysis failed, using fallback:', aiError.message);
      suggestions = await generateFallbackSuggestions(materials, transport, energy, options);
    }

    // Return the response to the client
    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-sustainability-suggestions function:', error.message);
    
    // Return error response
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error occurred',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Function to generate AI-powered sustainability suggestions using Grok
async function generateAISustainabilitySuggestions(materials: any[], transport: any[], energy: any[], options: any): Promise<any> {
  const grokApiKey = Deno.env.get('GROK_API_KEY');
  
  if (!grokApiKey) {
    throw new Error('Grok API key not configured');
  }

  // Prepare context for AI analysis
  const analysisContext = {
    materials: materials?.map(m => ({
      name: m.name || m.type,
      quantity: m.quantity,
      carbonFootprint: m.carbonFootprint || m.factor,
      unit: m.unit,
      category: m.category || m.type
    })) || [],
    transport: transport?.map(t => ({
      mode: t.mode || t.type,
      distance: t.distance,
      weight: t.weight,
      carbonFootprint: t.carbonFootprint
    })) || [],
    energy: energy?.map(e => ({
      type: e.type || e.source,
      quantity: e.quantity,
      unit: e.unit,
      carbonFootprint: e.carbonFootprint
    })) || [],
    totalMaterials: materials?.length || 0,
    totalEmissions: calculateTotalEmissions(materials, transport, energy)
  };

  const prompt = `Analyze this construction project data and provide sustainability recommendations to reduce carbon footprint while maintaining NCC 2025 and NABERS compliance:

Project Data:
- Materials: ${analysisContext.totalMaterials} different materials
- Total estimated emissions: ${analysisContext.totalEmissions} kg CO2e
- Materials breakdown: ${JSON.stringify(analysisContext.materials, null, 2)}
- Transport data: ${JSON.stringify(analysisContext.transport, null, 2)}
- Energy data: ${JSON.stringify(analysisContext.energy, null, 2)}

Please provide:
1. Priority suggestions for immediate carbon reduction
2. Material substitution recommendations with specific alternatives
3. NCC 2025 compliance considerations
4. NABERS rating improvement strategies
5. Transport optimization opportunities
6. Energy efficiency recommendations

Focus on practical, implementable solutions for Australian construction projects.`;

  // Make request to Grok API
  const response = await fetch('https://api.xai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${grokApiKey}`
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: "You are a sustainability expert specializing in Australian construction, NCC 2025 compliance, and NABERS energy ratings. Provide practical, specific recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Grok API Error: ${errorData.error || response.statusText}`);
  }

  const grokResponse = await response.json();
  const aiAnalysis = grokResponse.choices[0].message.content;

  // Parse AI response into structured suggestions
  return parseAIResponse(aiAnalysis, analysisContext);
}

// Function to parse AI response into structured format
function parseAIResponse(aiAnalysis: string, context: any): any {
  // Extract suggestions from AI response
  const lines = aiAnalysis.split('\n').filter(line => line.trim());
  const prioritySuggestions: string[] = [];
  const generalSuggestions: string[] = [];
  
  let currentSection = '';
  
  for (const line of lines) {
    if (line.toLowerCase().includes('priority') || line.toLowerCase().includes('immediate')) {
      currentSection = 'priority';
      continue;
    }
    
    if (line.trim().startsWith('-') || line.trim().startsWith('•') || /^\d+\./.test(line.trim())) {
      const suggestion = line.replace(/^[-•\d.\s]+/, '').trim();
      if (suggestion.length > 10) {
        if (currentSection === 'priority' && prioritySuggestions.length < 3) {
          prioritySuggestions.push(suggestion);
        } else {
          generalSuggestions.push(suggestion);
        }
      }
    }
  }

  return {
    suggestions: generalSuggestions.slice(0, 8), // Limit to 8 general suggestions
    prioritySuggestions: prioritySuggestions.slice(0, 3), // Limit to 3 priority suggestions
    metadata: {
      source: 'grok_ai',
      count: generalSuggestions.length + prioritySuggestions.length,
      categories: {
        material: generalSuggestions.filter(s => s.toLowerCase().includes('material')).length,
        transport: generalSuggestions.filter(s => s.toLowerCase().includes('transport')).length,
        energy: generalSuggestions.filter(s => s.toLowerCase().includes('energy')).length,
        compliance: generalSuggestions.filter(s => s.toLowerCase().includes('ncc') || s.toLowerCase().includes('nabers')).length,
        priority: prioritySuggestions.length
      },
      generatedAt: new Date().toISOString(),
      aiModel: 'grok',
      totalEmissions: context.totalEmissions
    },
    report: {
      summary: `${aiAnalysis.substring(0, 500)  }...`,
      fullAnalysis: aiAnalysis,
      recommendations: [...prioritySuggestions, ...generalSuggestions]
    }
  };
}

// Function to calculate total emissions from project data
function calculateTotalEmissions(materials: any[], transport: any[], energy: any[]): number {
  let total = 0;
  
  // Calculate materials emissions
  materials?.forEach(m => {
    const emissions = (m.carbonFootprint || m.factor || 0) * (m.quantity || 1);
    total += emissions;
  });
  
  // Calculate transport emissions
  transport?.forEach(t => {
    total += t.carbonFootprint || 0;
  });
  
  // Calculate energy emissions
  energy?.forEach(e => {
    total += e.carbonFootprint || 0;
  });
  
  return Math.round(total * 100) / 100; // Round to 2 decimal places
}

// Fallback function for when AI is not available
async function generateFallbackSuggestions(materials: any[], transport: any[], energy: any[], options: any): Promise<any> {
  const format = options?.format || 'basic';
  
  const generalSuggestions: string[] = [
    "Consider replacing high-carbon concrete with supplementary cementitious materials (SCMs)",
    "Source materials locally to reduce transportation emissions",
    "Implement renewable energy solutions for construction operations",
    "Prioritize materials with Environmental Product Declarations (EPDs)",
    "Use advanced insulation materials to improve energy efficiency",
    "Consider modular construction to reduce waste and improve efficiency",
    "Implement water conservation measures during construction",
    "Use recycled and reclaimed materials where structurally appropriate"
  ];
  
  const prioritySuggestions: string[] = [
    "Critical: Review steel specifications for recycled content opportunities",
    "Critical: Implement passive design strategies to meet NABERS energy targets"
  ];
  
  // Add material-specific suggestions based on what's in the project
  const materialTypes = new Set(materials?.map(m => m.type || m.category || 'unknown'));
  
  if (materialTypes.has('concrete')) {
    prioritySuggestions.push("High Impact: Replace Portland cement with geopolymer alternatives where possible");
  }
  
  if (materialTypes.has('steel')) {
    generalSuggestions.push("Consider using recycled steel with electric arc furnace production");
  }
  
  return {
    suggestions: generalSuggestions,
    prioritySuggestions,
    metadata: {
      source: 'fallback',
      count: generalSuggestions.length + prioritySuggestions.length,
      categories: {
        material: generalSuggestions.filter(s => s.includes('material')).length,
        transport: generalSuggestions.filter(s => s.includes('transport')).length,
        energy: generalSuggestions.filter(s => s.includes('energy')).length,
        general: generalSuggestions.filter(s => !s.includes('material') && !s.includes('transport') && !s.includes('energy')).length,
        priority: prioritySuggestions.length
      },
      generatedAt: new Date().toISOString(),
      aiModel: 'fallback'
    }
  };
}

// Function to record Grok API usage in the database
async function recordGrokUsage(userId: string, feature: string, metadata: any): Promise<void> {
  try {
    await supabase.from('grok_usage').insert({
      user_id: userId,
      feature,
      metadata,
      tokens_used: estimateTokensUsed(metadata),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to record Grok usage:', error);
  }
}

// Function to estimate tokens used based on request data
function estimateTokensUsed(metadata: any): number {
  const baseTokens = 150;
  const materialsTokens = (metadata.materialsCount || 0) * 25;
  const transportTokens = (metadata.transportCount || 0) * 20;
  const energyTokens = (metadata.energyCount || 0) * 20;
  
  const formatMultiplier = metadata.optionsFormat === 'comprehensive' ? 2.5 : 
                           metadata.optionsFormat === 'detailed' ? 1.8 : 1;
                           
  return Math.ceil((baseTokens + materialsTokens + transportTokens + energyTokens) * formatMultiplier);
}
