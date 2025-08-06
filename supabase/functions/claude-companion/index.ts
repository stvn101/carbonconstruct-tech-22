import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, calculationData, context = 'dashboard' } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create context-aware system prompt
    const systemPrompt = `You are Claude Companion, an AI assistant specialized in carbon footprint analysis and sustainability consulting for the Australian construction industry.

Your expertise includes:
- GHG Protocol Scope 1, 2, and 3 emissions analysis
- Green Star rating optimization
- NCC 2025 compliance guidance
- NABERS energy efficiency recommendations
- Material substitution for carbon reduction
- Transport route optimization
- Embodied carbon assessment

Current context: ${context}
Available calculation data: ${JSON.stringify(calculationData, null, 2)}

Provide specific, actionable advice focused on:
1. Reducing carbon emissions
2. Improving compliance scores
3. Cost-effective sustainability measures
4. Australian construction best practices

Keep responses concise but technical enough for construction professionals.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const advice = data.choices[0].message.content;

    // Production-ready logging (structured for analytics)
    const responseMetrics = {
      context,
      promptLength: prompt.length,
      responseLength: advice.length,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify({ 
      advice,
      context,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // Production error handling - structured logging
    return new Response(JSON.stringify({ 
      error: 'Service temporarily unavailable',
      fallback: "Unable to generate advice at this time. Please check your carbon calculation data and try again."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});