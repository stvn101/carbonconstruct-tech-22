/**
 * CarbonConstruct Claude/OpenAI Agent
 * Production-ready AI wrapper for carbon assessment insights
 */

export interface AgentResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class ClaudeAgent {
  private apiKey: string;
  private baseUrl = "https://api.openai.com/v1/chat/completions";

  constructor(apiKey?: string) {
    const envKey = (typeof process !== 'undefined' && (process as any).env?.OPENAI_API_KEY) || (import.meta as any).env?.VITE_OPENAI_API_KEY || '';
    this.apiKey = apiKey || envKey;
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required');
    }
  }

  async generateSummary(content: string): Promise<string> {
    const response = await this.makeRequest({
      model: "gpt-4.1-2025-04-14",
      messages: [
        { 
          role: "system", 
          content: "You are a carbon assessment expert for the Australian construction industry. Provide concise, actionable insights about carbon footprints, compliance, and optimization strategies. Focus on practical recommendations."
        },
        { role: "user", content }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.content;
  }

  async generateOptimizationAdvice(calculationData: any): Promise<string> {
    const prompt = `Based on this carbon calculation data:
${JSON.stringify(calculationData, null, 2)}

Provide 3 specific optimization recommendations focusing on:
1. Highest impact emission reductions
2. Cost-effective improvements
3. Australian compliance (Green Star, NCC 2025)

Keep recommendations practical and measurable.`;

    return this.generateSummary(prompt);
  }

  async generateComplianceAssessment(emissionsData: any): Promise<string> {
    const prompt = `Assess this project's compliance status:
Total Emissions: ${emissionsData.totalEmissions} kg CO₂-e
Material Emissions: ${emissionsData.materialEmissions} kg CO₂-e
Transport Emissions: ${emissionsData.transportEmissions} kg CO₂-e
Energy Emissions: ${emissionsData.energyEmissions} kg CO₂-e

Evaluate against:
- Green Star rating potential
- NCC 2025 compliance
- NABERS energy efficiency

Provide specific scores and improvement pathways.`;

    return this.generateSummary(prompt);
  }

  private async makeRequest(payload: any): Promise<AgentResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      
      return {
        content: json.choices[0].message.content,
        usage: json.usage ? {
          promptTokens: json.usage.prompt_tokens,
          completionTokens: json.usage.completion_tokens,
          totalTokens: json.usage.total_tokens
        } : undefined
      };
    } catch (error) {
      // Production error handling
      throw new Error(`Claude Agent failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Factory function for easy instantiation
export const createClaudeAgent = (apiKey?: string): ClaudeAgent => {
  return new ClaudeAgent(apiKey);
};

// Default export for common usage
export default ClaudeAgent;