
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useGrok } from '@/contexts/GrokContext';
import { Leaf, FileText, Shield, Star, Send, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';

const GrokSustainabilityChat = () => {
  const [userMessage, setUserMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const { askGrok, isProcessing, isConfigured } = useGrok();

  const sustainabilityActions = [
    {
      id: 'material-recommendations',
      title: 'Material Recommendations',
      description: 'Get sustainable material alternatives',
      icon: <Leaf className="h-4 w-4" />,
      mode: 'material_analysis' as const,
      prompt: 'What are the most sustainable construction materials for residential buildings in Australia, and what are their carbon footprints?'
    },
    {
      id: 'ncc-compliance',
      title: 'NCC 2025 Compliance',
      description: 'Check latest building code requirements',
      icon: <FileText className="h-4 w-4" />,
      mode: 'compliance_check' as const,
      prompt: 'What are the key changes in NCC 2025 for thermal performance and energy efficiency requirements?'
    },
    {
      id: 'green-star',
      title: 'Green Star Certification',
      description: 'Learn about Green Star requirements',
      icon: <Star className="h-4 w-4" />,
      mode: 'sustainability_advisor' as const,
      prompt: 'What are the requirements for achieving Green Star certification and how can I optimize my project for it?'
    },
    {
      id: 'nabers-ratings',
      title: 'NABERS Ratings',
      description: 'Understand NABERS energy ratings',
      icon: <Shield className="h-4 w-4" />,
      mode: 'compliance_check' as const,
      prompt: 'How do NABERS energy ratings work and what changes came into effect in January 2025?'
    }
  ];

  const handleQuickAction = async (prompt: string, mode: 'material_analysis' | 'compliance_check' | 'sustainability_advisor') => {
    if (!isConfigured) {
      toast.error('Grok AI is not configured. Please configure it first.');
      return;
    }

    try {
      const response = await askGrok(prompt, {}, mode);
      
      setConversation(prev => [
        ...prev,
        { role: 'user', content: prompt },
        { role: 'assistant', content: response.response || response.text || 'No response received' }
      ]);
    } catch (error) {
      toast.error('Failed to get AI response. Please try again.');
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || !isConfigured) return;

    try {
      const response = await askGrok(userMessage, {}, 'sustainability_advisor');
      
      setConversation(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: response.response || response.text || 'No response received' }
      ]);
      
      setUserMessage('');
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  if (!isConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Grok Sustainability Assistant
          </CardTitle>
          <CardDescription>
            AI-powered sustainability advice, compliance guidance, and Green Star certification help
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Leaf className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Grok AI Not Configured</h3>
            <p className="text-muted-foreground mb-4">
              Configure Grok AI to get expert sustainability advice and compliance guidance.
            </p>
            <Button onClick={() => window.location.href = '/grok-ai'}>
              Configure Grok AI
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Grok Sustainability Assistant
            <Badge variant="secondary">Specialized for Construction</Badge>
          </CardTitle>
          <CardDescription>
            Get expert advice on sustainable construction, compliance, and certifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {sustainabilityActions.map(action => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start text-left"
                onClick={() => handleQuickAction(action.prompt, action.mode)}
                disabled={isProcessing}
              >
                <div className="flex items-center gap-2 mb-2">
                  {action.icon}
                  <span className="font-medium">{action.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">{action.description}</span>
              </Button>
            ))}
          </div>

          {conversation.length > 0 && (
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {conversation.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Textarea
              placeholder="Ask about sustainable materials, NCC 2025 compliance, Green Star certification, NABERS ratings..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="flex-1"
              rows={3}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!userMessage.trim() || isProcessing}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrokSustainabilityChat;
