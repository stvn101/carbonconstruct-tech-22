import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
  calculatorData?: any;
  totalEmissions?: number;
  context?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const { message, conversationHistory = [], calculatorData = {}, totalEmissions = 0, context = '' }: ChatRequest = await req.json();

    // Build context for Claude
    const systemPrompt = `You are Claude Sonnet 4, an AI assistant specialized in carbon footprint analysis and sustainable construction practices. You are integrated into CarbonConstruct, a comprehensive environmental impact assessment platform.

Current Project Context:
- Total Emissions: ${(totalEmissions / 1000).toFixed(1)} t CO₂-e
- Calculator Data: ${JSON.stringify(calculatorData, null, 2)}
- Additional Context: ${context}

Your expertise includes:
- Carbon footprint analysis and reduction strategies
- NCC, NABERS, LEED, BREEAM, Green Star compliance
- Sustainable construction materials and practices
- Life Cycle Assessment (LCA) methodologies
- Scope 1, 2, and 3 emissions analysis
- Building energy efficiency optimization
- Cost-effective sustainability improvements

Provide practical, actionable advice with specific recommendations. Include numbers, percentages, and concrete steps where possible. Be concise but comprehensive in your responses.`;

    // Build conversation messages
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-8), // Keep last 8 messages for context
      { role: 'user', content: message }
    ];

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: messages.filter(m => m.role !== 'system'),
        system: systemPrompt
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API Error:', errorData);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.content[0]?.text || 'I apologize, but I encountered an issue generating a response. Please try again.';

    return new Response(JSON.stringify({ 
      response: aiResponse,
      usage: data.usage || null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in claude-ai-chat function:', error);
    
    // Fallback response for errors
    const fallbackResponse = `I'm experiencing technical difficulties right now. Here are some general recommendations based on your query:

**Carbon Reduction Strategies:**
- Material optimization: Switch to lower-carbon alternatives (potential 15-30% reduction)
- Energy efficiency: Improve building envelope performance 
- Renewable energy: Increase renewable energy percentage
- Transport optimization: Source materials locally when possible

**Compliance Guidelines:**
- NCC 2025: Focus on energy intensity ≤ 150 kWh/m² and 10% renewable energy minimum
- NABERS: Target 4+ star rating through operational efficiency
- Green Star: Prioritize Materials and Energy categories for maximum impact

Please try your question again, or contact support if the issue persists.`;

    return new Response(JSON.stringify({ 
      response: fallbackResponse,
      error: true,
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});