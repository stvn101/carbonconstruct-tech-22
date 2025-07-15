
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import claudeService, { ClaudeResponse, ClaudeModel } from '@/services/ClaudeService';
import { toast } from 'sonner';

// Estimate tokens in a message for usage tracking
const estimateTokens = (text: string): number => {
  // Simple estimation: ~4 chars per token on average
  return Math.ceil(text.length / 4);
};

interface ClaudeContextType {
  isConfigured: boolean;
  configureClaude: (apiKey: string) => void;
  resetClaude: () => void;
  askClaude: (prompt: string, context?: any, model?: ClaudeModel) => Promise<ClaudeResponse>;
  streamClaude: (prompt: string, context?: any, model?: ClaudeModel) => AsyncIterable<string>;
  isProcessing: boolean;
  lastResponse: ClaudeResponse | null;
}

const ClaudeContext = createContext<ClaudeContextType | undefined>(undefined);

export function ClaudeProvider({ children }: { children: ReactNode }) {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastResponse, setLastResponse] = useState<ClaudeResponse | null>(null);
  
  // Check if Claude service is configured on component mount
  useEffect(() => {
    const configStatus = claudeService.isApiConfigured();
    setIsConfigured(configStatus);
  }, []);
  
  const configureClaude = (apiKey: string) => {
    if (!apiKey || apiKey.trim() === '') {
      toast.error("Please provide a valid Claude API key");
      return;
    }
    
    try {
      claudeService.setApiKey(apiKey);
      setIsConfigured(true);
      toast.success("Claude AI services configured successfully");
    } catch (error) {
      toast.error("Failed to configure Claude AI services");
      console.error("Claude configuration error:", error);
    }
  };
  
  const resetClaude = () => {
    claudeService.setApiKey('');
    setIsConfigured(false);
  };
  
  const askClaude = async (prompt: string, context?: any, model?: ClaudeModel): Promise<ClaudeResponse> => {
    setIsProcessing(true);
    
    try {
      const response = await claudeService.queryClaude({ prompt, context, model });
      setLastResponse(response);
      return response;
    } catch (error) {
      const errorResponse: ClaudeResponse = {
        response: "Error processing your request. Please try again.",
        error: error instanceof Error ? error.message : String(error)
      };
      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Method for streaming responses (simulated for now)
  const streamClaude = (prompt: string, context?: any, model?: ClaudeModel): AsyncIterable<string> => {
    setIsProcessing(true);
    
    return {
      async *[Symbol.asyncIterator] () {
        try {
          const response = await askClaude(prompt, context, model);
          
          // Simulate streaming by yielding words
          const words = response.response.split(' ');
          for (const word of words) {
            yield `${word  } `;
            // Add a small delay between words to simulate streaming
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        } catch (error) {
          console.error("Error in Claude stream:", error);
          yield `Error: ${  error instanceof Error ? error.message : String(error)}`;
        } finally {
          setIsProcessing(false);
        }
      }
    };
  };
  
  const value = {
    isConfigured,
    configureClaude,
    resetClaude,
    askClaude,
    streamClaude,
    isProcessing,
    lastResponse
  };
  
  return (
    <ClaudeContext.Provider value={value}>
      {children}
    </ClaudeContext.Provider>
  );
}

export function useClaude() {
  const context = useContext(ClaudeContext);
  
  if (context === undefined) {
    throw new Error('useClaude must be used within a ClaudeProvider');
  }
  
  return context;
}
