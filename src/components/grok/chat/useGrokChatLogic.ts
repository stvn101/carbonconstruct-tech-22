
import { useState, useRef, useEffect } from 'react';
// import { useChat } from 'ai/react';

// Mock useChat hook for now
const useChat = () => ({
  messages: [],
  input: '',
  handleInputChange: () => {},
  handleSubmit: () => {},
  append: () => {},
  reload: () => {},
  stop: () => {},
  isLoading: false,
  error: null
});
import { GrokChatMessage } from '@/types/grok';
import { useSimpleOfflineMode } from '@/hooks/useSimpleOfflineMode';

// Helper to get a chat message ID
const getMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

interface UseGrokChatLogicProps {
  initialContext?: string;
  askAI?: (prompt: string, context?: any) => Promise<any>;
  isConfigured?: boolean;
  isProcessing?: boolean;
}

export const useGrokChatLogic = ({ 
  initialContext, 
  askAI, 
  isConfigured: externalIsConfigured, 
  isProcessing: externalIsProcessing 
}: UseGrokChatLogicProps = {}) => {
  const [messages, setMessages] = useState<GrokChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOffline } = useSimpleOfflineMode();
  
  // Default configuration state when no external AI service is provided
  const [grokConfigured, setGrokConfigured] = useState(false);
  
  // Use external config state if provided, otherwise use local state
  const isConfigured = externalIsConfigured !== undefined ? externalIsConfigured : grokConfigured;
  
  // Clear error when going back online
  useEffect(() => {
    if (!isOffline && error?.includes('network') || error?.includes('offline')) {
      setError(null);
    }
  }, [isOffline, error]);

  // Mock input state for now since AI chat is disabled
  const [input, setInput] = useState('');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  const isLoading = false;

  // Add initial system message for context if provided
  useEffect(() => {
    if (initialContext && messages.length === 0) {
      setMessages([{
        id: getMessageId(),
        role: 'system',
        content: initialContext,
        timestamp: new Date()
      }]);
    }
  }, [initialContext, messages.length]);

  // Custom submit handler that integrates with external AI service or Vercel AI
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !isConfigured || (externalIsProcessing || isLoading) || isOffline) {
      // Show specific message if trying to submit while offline
      if (isOffline) {
        setError("You're currently offline. Please reconnect to use AI services.");
      }
      return;
    }
    
    // Add user message
    const userMessage: GrokChatMessage = {
      id: getMessageId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setError(null);
    
    try {
      if (askAI) {
        // Use external AI service (like Claude)
        const response = await askAI(input.trim());
        setMessages(prev => [...prev, {
          id: getMessageId(),
          role: 'assistant',
          content: response.response || response,
          timestamp: new Date()
        }]);
      } else {
        // TODO: Implement Grok AI chat when available
        setMessages(prev => [...prev, {
          id: getMessageId(),
          role: 'assistant',
          content: "Grok AI is currently not available. Please try again later.",
          timestamp: new Date()
        }]);
      }
      
      // Focus input for next message
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Error in AI chat:', error);
      
      // Show network-specific error if offline
      if (isOffline || (error instanceof Error && (error.message.includes('network') || error.message.includes('failed to fetch')))) {
        setError("Network connection issue. Please check your internet and try again.");
      } else {
        setError('Failed to get a response. Please try again.');
      }
    }
  };

  return {
    messages,
    error,
    isLoading: externalIsProcessing || isLoading,
    input,
    isConfigured,
    isOffline,
    handleInputChange,
    handleSubmit,
    inputRef
  };
};
