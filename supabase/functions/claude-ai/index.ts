
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Define CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle Claude API interactions
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract request data
    const { prompt, context, model, options } = await req.json();
    
    // Get API key from environment variables
    const claudeApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    
    if (!claudeApiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    console.log(`Processing Claude request with model: ${model}, prompt: ${prompt.substring(0, 50)}...`);

    // Prepare the request to Claude API
    const claudeRequest = {
      model: model || 'claude-3-5-sonnet-20241022',
      max_tokens: options?.maxTokens || 2048,
      temperature: options?.temperature || 0.7,
      messages: [
        {
          role: "user",
          content: constructPrompt(prompt, context)
        }
      ]
    };

    // Make request to Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${claudeApiKey}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(claudeRequest)
    });

    // Handle API response
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Claude API Error: ${errorData.error?.message || response.statusText}`);
    }

    const claudeResponse = await response.json();
    console.log('Claude response received successfully');

    // Return the response to the client
    return new Response(JSON.stringify({
      response: claudeResponse.content[0].text,
      usage: claudeResponse.usage,
      model: claudeResponse.model
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in claude-ai function:', error.message);
    
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

// Helper function to construct the prompt with context
function constructPrompt(prompt: string, context?: any): string {
  let fullPrompt = "You are Claude, an AI assistant integrated with CarbonConstruct, a sustainable construction management platform. " +
    "Focus on providing accurate, helpful information about sustainable construction materials, carbon footprint analysis, " +
    "and compliance with building standards like NCC 2025 and NABERS.\n\n";
  
  if (context && Object.keys(context).length > 0) {
    fullPrompt += `Context: ${JSON.stringify(context, null, 2)}\n\n`;
  }
  
  fullPrompt += `User request: ${prompt}`;
  
  return fullPrompt;
}
