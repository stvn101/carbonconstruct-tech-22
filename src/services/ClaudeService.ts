
import { supabase } from "@/integrations/supabase/client";
import { handleGrokAPIError } from "@/utils/errorHandling/grokNetworkHandler";

export type ClaudeModel = 'claude-3-5-sonnet-20241022' | 'claude-3-haiku-20240307' | 'claude-3-opus-20240229';

export interface ClaudeRequest {
  prompt: string;
  context?: Record<string, any>;
  model?: ClaudeModel;
  options?: {
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  };
}

export interface ClaudeResponse {
  response: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
  model?: string;
  error?: string;
  metadata?: {
    processingTime?: number;
    modelVersion?: string;
    confidence?: number;
  };
}

class ClaudeService {
  private apiKey: string | null = null;
  private isConfigured: boolean = false;
  private readonly DEFAULT_TIMEOUT = 30000; // 30 seconds
  private readonly MAX_RETRIES = 2;

  constructor() {
    console.log("ClaudeService initialized");
  }

  public setApiKey(key: string): void {
    this.apiKey = key;
    this.isConfigured = !!key;
    console.log("Claude API key configured:", this.isConfigured);
  }

  public isApiConfigured(): boolean {
    return this.isConfigured;
  }

  private validateResponse(response: any): ClaudeResponse {
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response format from Claude API');
    }

    if (!response.response && !response.error) {
      throw new Error('Response missing required fields');
    }

    return {
      response: response.response || '',
      usage: response.usage,
      model: response.model,
      error: response.error,
      metadata: response.metadata
    };
  }

  public async queryClaude(request: ClaudeRequest): Promise<ClaudeResponse> {
    try {
      if (!this.isConfigured) {
        console.warn("Claude API is not configured");
        return {
          response: "Claude AI is not configured. Please configure your API key.",
          error: "API key not configured"
        };
      }

      console.log(`Sending Claude request with model ${request.model || 'claude-3-5-sonnet-20241022'}`);
      
      const startTime = Date.now();
      
      // Call the Supabase Edge Function with timeout
      const { data, error } = await Promise.race([
        supabase.functions.invoke('claude-ai', {
          body: {
            prompt: request.prompt,
            context: request.context || {},
            model: request.model || 'claude-3-5-sonnet-20241022',
            options: request.options
          }
        }),
        new Promise<{ data: null; error: Error }>((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), this.DEFAULT_TIMEOUT)
        )
      ]) as { data: any; error: any };

      if (error) {
        throw handleGrokAPIError(error, { context: 'queryClaude' });
      }

      const response = this.validateResponse(data);
      
      // Add processing time to metadata
      response.metadata = {
        ...response.metadata,
        processingTime: Date.now() - startTime
      };

      console.log("Claude API response received");
      return response;
    } catch (error) {
      console.error("Unexpected error in ClaudeService:", error);
      return {
        response: "An unexpected error occurred while connecting to Claude AI.",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  public async analyzeConstructionMaterial(materialData: any): Promise<ClaudeResponse> {
    return this.queryClaude({
      prompt: "Analyze this construction material for sustainability insights and possible improvements.",
      context: materialData,
      model: 'claude-3-5-sonnet-20241022',
      options: {
        temperature: 0.7,
        maxTokens: 1000
      }
    });
  }

  public async getSustainabilityAdvice(projectData: any): Promise<ClaudeResponse> {
    return this.queryClaude({
      prompt: "Provide sustainability improvement recommendations for this construction project.",
      context: projectData,
      model: 'claude-3-5-sonnet-20241022',
      options: {
        temperature: 0.8,
        maxTokens: 1500
      }
    });
  }

  public async checkCompliance(projectData: any): Promise<ClaudeResponse> {
    return this.queryClaude({
      prompt: "Check if this project complies with NCC 2025 and NABERS standards.",
      context: projectData,
      model: 'claude-3-5-sonnet-20241022',
      options: {
        temperature: 0.3,
        maxTokens: 2000
      }
    });
  }
}

// Export a singleton instance
const claudeService = new ClaudeService();
export default claudeService;
