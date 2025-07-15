
import React from 'react';
import { useClaude } from '@/contexts/ClaudeContext';
import { useGrokChatLogic } from '@/components/grok/chat/useGrokChatLogic';
import GrokChatContainer from '@/components/grok/chat/GrokChatContainer';

interface ClaudeChatProps {
  placeholder?: string;
  className?: string;
}

const ClaudeChat: React.FC<ClaudeChatProps> = ({ 
  placeholder = "Ask Claude about sustainable construction...",
  className 
}) => {
  const { askClaude, isConfigured, isProcessing } = useClaude();
  
  // Reuse the existing chat logic but with Claude service
  const {
    messages,
    input,
    error,
    handleInputChange,
    handleSubmit
  } = useGrokChatLogic({
    askAI: askClaude,
    isConfigured,
    isProcessing
  });

  return (
    <GrokChatContainer
      messages={messages}
      error={error}
      title="Claude AI Assistant"
      isLoading={isProcessing}
      isConfigured={isConfigured}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default ClaudeChat;
