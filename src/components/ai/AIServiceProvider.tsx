
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import aiService from '@/services/AIService';
import { toast } from 'sonner';

interface AIServiceContextType {
  isConfigured: boolean;
  configureAI: (apiKey: string) => void;
  resetAI: () => void;
}

const AIServiceContext = createContext<AIServiceContextType | undefined>(undefined);

export function AIServiceProvider({ children }: { children: ReactNode }) {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  
  // Check if AI service is already configured on mount
  useEffect(() => {
    // Check if there's a stored configuration (without exposing the actual key)
    const hasStoredConfig = localStorage.getItem('ai_service_configured') === 'true';
    if (hasStoredConfig) {
      setIsConfigured(true);
    }
  }, []);
  
  const configureAI = (apiKey: string) => {
    if (!apiKey || apiKey.trim().length === 0) {
      toast.error("Please provide a valid API key");
      return;
    }
    
    // Store the API key securely in the service
    aiService.setApiKey(apiKey);
    
    // Mark as configured without storing the actual key
    localStorage.setItem('ai_service_configured', 'true');
    setIsConfigured(true);
    toast.success("AI services configured successfully");
  };
  
  const resetAI = () => {
    aiService.setApiKey('');
    localStorage.removeItem('ai_service_configured');
    setIsConfigured(false);
    toast.info("AI services reset");
  };
  
  const value = {
    isConfigured,
    configureAI,
    resetAI
  };
  
  return (
    <AIServiceContext.Provider value={value}>
      {children}
    </AIServiceContext.Provider>
  );
}

export function useAIService() {
  const context = useContext(AIServiceContext);
  
  if (context === undefined) {
    throw new Error('useAIService must be used within an AIServiceProvider');
  }
  
  return context;
}
