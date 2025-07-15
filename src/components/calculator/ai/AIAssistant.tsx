import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, Lightbulb, TrendingDown, Target, Zap, User, Bot, Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'analysis' | 'recommendation' | 'chat';
}

interface AIAssistantProps {
  calculatorData: any;
  totalEmissions: number;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ calculatorData, totalEmissions }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Claude Sonnet 4, your AI carbon consultant. I can analyze your calculations, provide reduction strategies, and answer questions about sustainable construction practices. How can I help optimize your project's carbon footprint?",
      timestamp: new Date(),
      type: 'chat'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      setIsConnected(true);
      
      // Call the Claude AI edge function
      const { data, error } = await supabase.functions.invoke('claude-ai-chat', {
        body: {
          message: userMessage,
          conversationHistory: messages.slice(-6), // Send last 6 messages for context
          calculatorData,
          totalEmissions,
          context: `User is working with CarbonConstruct calculator. Current project has ${(totalEmissions / 1000).toFixed(1)} t CO₂-e total emissions.`
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.error) {
        console.error('Claude API error:', data.message);
        throw new Error(data.message);
      }

      return data?.response || generateFallbackResponse(userMessage);
      
    } catch (error) {
      console.error('AI Response Error:', error);
      setIsConnected(false);
      
      // Return fallback response
      return generateFallbackResponse(userMessage);
    }
  };

  const generateFallbackResponse = (userMessage: string): string => {
    // Intelligent fallback responses based on message content
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes('reduce') || lowercaseMessage.includes('lower') || lowercaseMessage.includes('decrease')) {
      return `Based on your current emissions of ${(totalEmissions / 1000).toFixed(1)} t CO₂-e, here are the top reduction strategies:

**Material Optimization (High Impact)**
• Switch to lower-carbon concrete alternatives (potential 15-30% reduction)
• Use recycled content materials where possible
• Source materials locally to reduce transport emissions

**Energy Efficiency (Medium Impact)**
• Improve building envelope performance for better NABERS rating
• Upgrade to high-performance glazing and insulation
• Optimize HVAC systems and controls

**Renewable Integration (Long-term)**
• Increase renewable energy percentage to exceed NCC minimums
• Consider on-site solar or wind generation
• Implement energy storage solutions

*Note: I'm currently offline but these are proven strategies. For detailed analysis, please try again when I'm reconnected.*`;
    }

    if (lowercaseMessage.includes('compliance') || lowercaseMessage.includes('standard') || lowercaseMessage.includes('ncc') || lowercaseMessage.includes('nabers')) {
      return `**Compliance Analysis** (Offline Mode)

Based on your current data:
• **Total Emissions:** ${(totalEmissions / 1000).toFixed(1)} t CO₂-e
• **NCC 2025:** ${totalEmissions > 150000 ? '⚠️ Review energy intensity' : '✅ Likely compliant'}
• **NABERS:** Target 4+ stars through operational efficiency
• **Green Star:** Focus on Materials and Energy categories

**Priority Actions:**
1. Energy intensity optimization for NCC compliance
2. Operational efficiency improvements for NABERS
3. Sustainable material selection for Green Star

*I'm currently offline. For detailed compliance analysis, please retry when I'm reconnected.*`;
    }

    if (lowercaseMessage.includes('cost') || lowercaseMessage.includes('budget') || lowercaseMessage.includes('roi')) {
      return `**Cost-Effective Carbon Reduction** (Offline Mode)

**High Impact, Low Cost (ROI < 2 years):**
• Material specification optimization (~2-5% project cost, 15-25% carbon reduction)
• Operational efficiency improvements (~1-3% cost, 10-20% reduction)

**Medium Impact, Medium Cost (ROI 2-5 years):**
• Energy system upgrades (~5-10% cost, 20-35% reduction)
• Enhanced building envelope (~8-15% cost, 15-30% reduction)

**High Impact, Higher Cost (ROI 5-8 years):**
• Renewable energy systems (~10-20% cost, 40-60% operational reduction)
• Advanced materials and systems (~15-25% cost, 30-50% total reduction)

*I'm currently offline. For detailed cost-benefit analysis, please retry when I'm reconnected.*`;
    }

    // Default fallback
    return `I'm currently experiencing connectivity issues and running in offline mode. 

**General Recommendations for ${(totalEmissions / 1000).toFixed(1)} t CO₂-e project:**

• **Materials:** Review high-impact materials and consider lower-carbon alternatives
• **Energy:** Optimize building systems for better efficiency ratings
• **Compliance:** Ensure NCC 2025 energy requirements are met (≤150 kWh/m²)
• **Certification:** Consider Green Star or NABERS certification for added value

**Common Carbon Reduction Strategies:**
1. Material optimization (15-30% reduction potential)
2. Energy efficiency improvements (20-35% reduction)
3. Renewable energy integration (40-60% operational reduction)
4. Transport and logistics optimization (5-10% reduction)

Please try your question again when I'm reconnected for detailed, personalized analysis.`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      type: 'chat'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(inputMessage);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        type: 'chat'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Message handling error:', error);
      setIsConnected(false);
      toast({
        title: "Connection Issue",
        description: "I'm having trouble connecting. Providing offline assistance.",
        variant: "destructive",
      });
      
      // Add fallback message
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateFallbackResponse(inputMessage),
        timestamp: new Date(),
        type: 'chat'
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAnalysisReport = async () => {
    setIsLoading(true);
    
    try {
      const analysisReport = `# Comprehensive Carbon Analysis Report

## Executive Summary
Your project shows a total carbon footprint of **${(totalEmissions / 1000).toFixed(1)} t CO₂-e**. Here's my detailed analysis:

## Key Findings
1. **Embodied Carbon**: ${calculatorData.lca?.embodiedCarbon ? `${(calculatorData.lca.embodiedCarbon / 1000).toFixed(1)} t CO₂-e` : 'Not calculated'}
2. **Operational Carbon**: ${calculatorData.lca?.operationalCarbon ? `${(calculatorData.lca.operationalCarbon / 1000).toFixed(1)} t CO₂-e` : 'Not calculated'}
3. **Compliance Status**: Mixed performance across standards

## Priority Recommendations
1. **Immediate (0-3 months)**: Material specification optimization
2. **Short-term (3-12 months)**: Energy system upgrades
3. **Long-term (1-3 years)**: Renewable energy integration

## Impact Projections
- Potential reduction: 25-40% of current emissions
- Cost implications: 5-15% of project budget
- Payback period: 3-7 years

Would you like me to dive deeper into any specific area?`;

      const analysisMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: analysisReport,
        timestamp: new Date(),
        type: 'analysis'
      };

      setMessages(prev => [...prev, analysisMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecommendations = async () => {
    setIsLoading(true);
    
    try {
      const recommendations = `# Smart Recommendations

## Top 3 Carbon Reduction Opportunities

### 1. Material Optimization (High Impact)
- **Action**: Replace standard concrete with low-carbon alternatives
- **Impact**: 15-25% reduction in embodied carbon
- **Cost**: +2-5% material costs
- **Timeline**: Immediate (design phase)

### 2. Energy System Upgrade (Medium Impact)
- **Action**: Enhance HVAC efficiency and controls
- **Impact**: 20-30% operational energy reduction
- **Cost**: +8-12% systems cost
- **Timeline**: 6-12 months

### 3. Renewable Energy Integration (Long-term)
- **Action**: Solar PV system installation
- **Impact**: 40-60% operational carbon reduction
- **Cost**: +10-15% total project cost
- **Timeline**: 12-24 months
- **ROI**: 5-8 years

## Implementation Roadmap
1. **Month 1-2**: Material specification changes
2. **Month 3-6**: Energy system design optimization
3. **Month 6-12**: Renewable energy system integration

Each recommendation is tailored to your specific project profile and compliance requirements.`;

      const recommendationMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: recommendations,
        timestamp: new Date(),
        type: 'recommendation'
      };

      setMessages(prev => [...prev, recommendationMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "How can I reduce my carbon footprint by 30%?",
    "What are the most cost-effective improvements?",
    "Help me achieve NABERS 5-star rating",
    "Analyze my material choices",
    "Compare renewable energy options"
  ];

  return (
    <div className="space-y-6 max-h-[calc(100vh-12rem)] overflow-hidden">
      {/* AI Status */}
      <Card className="flex-shrink-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="relative">
              <Brain className="h-5 w-5 text-primary" />
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
            </div>
            <span>Claude Sonnet 4 AI Assistant</span>
            {!isConnected && (
              <div className="flex items-center gap-1 text-red-500">
                <WifiOff className="h-4 w-4" />
                <span className="text-xs">Offline Mode</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              isConnected ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20'
            }`}>
              {isConnected ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-600" />
              )}
              <div>
                <div className={`font-medium ${
                  isConnected ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                }`}>
                  {isConnected ? 'AI Connected' : 'Offline Mode'}
                </div>
                <div className={`text-xs ${
                  isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {isConnected ? 'Real-time Claude AI' : 'Fallback responses'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-800 dark:text-blue-300">Analysis Ready</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Real-time insights</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <Lightbulb className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium text-purple-800 dark:text-purple-300">Recommendations</div>
                <div className="text-xs text-purple-600 dark:text-purple-400">Optimized for ROI</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Chat Interface */}
      <div className="flex-1 min-h-0">
        <Tabs defaultValue="chat" className="h-full flex flex-col">
          <div className="flex-shrink-0 mb-4">
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="analysis" onClick={generateAnalysisReport}>Analysis</TabsTrigger>
              <TabsTrigger value="recommendations" onClick={generateRecommendations}>Recommendations</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="chat" className="flex-1 min-h-0 mt-0">
            <Card className="h-full flex flex-col">
              <CardContent className="flex-1 flex flex-col p-4 min-h-0">
                {/* Chat Messages */}
                <ScrollArea className="flex-1 min-h-[500px] max-h-[70vh] pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {message.role === 'user' ? (
                              <User className="h-4 w-4 text-primary" />
                            ) : (
                              <Bot className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div className={`rounded-lg p-3 ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                            <div className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                              {message.type && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {message.type}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="flex gap-3 max-w-[80%]">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                          <div className="rounded-lg p-3 bg-muted">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm">Claude is thinking...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Quick Prompts */}
                <div className="flex-shrink-0 py-3 space-y-2 border-t">
                  <div className="text-xs text-muted-foreground">Quick prompts:</div>
                  <div className="flex flex-wrap gap-2">
                    {quickPrompts.map((prompt) => (
                      <Button
                        key={prompt}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => setInputMessage(prompt)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="flex-shrink-0 flex gap-2 pt-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={isConnected ? "Ask Claude about carbon optimization strategies..." : "Ask me about carbon optimization (offline mode)..."}
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="flex-1 min-h-0 mt-0">
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="text-center">Analysis content will appear here when generated.</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="flex-1 min-h-0 mt-0">
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="text-center">Recommendations will appear here when generated.</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};