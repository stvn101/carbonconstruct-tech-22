
import React, { useState } from 'react';
import { useClaude } from '@/contexts/ClaudeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Key, Check, X } from 'lucide-react';

interface ClaudeConfigProps {
  onComplete?: () => void;
}

const ClaudeConfig: React.FC<ClaudeConfigProps> = ({ onComplete }) => {
  const { isConfigured, configureClaude, resetClaude } = useClaude();
  const [apiKey, setApiKey] = useState('');
  
  const handleConfigure = () => {
    configureClaude(apiKey);
    setApiKey('');
    if (onComplete) onComplete();
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Claude AI Configuration
          {isConfigured ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              <Check className="h-3 w-3 mr-1" /> Configured
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              <X className="h-3 w-3 mr-1" /> Not Configured
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Connect CarbonConstruct to Claude AI for advanced sustainability analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="api-key" className="text-sm font-medium">
              Anthropic API Key
            </label>
            <div className="flex">
              <div className="relative flex-grow">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your Anthropic API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key is securely stored and used only for communication with Claude AI.
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {isConfigured ? (
          <Button variant="destructive" onClick={resetClaude}>
            Reset API Key
          </Button>
        ) : (
          <Button variant="ghost">Cancel</Button>
        )}
        <Button 
          onClick={handleConfigure} 
          disabled={!apiKey.trim()}
        >
          {isConfigured ? 'Update' : 'Configure'} Claude AI
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClaudeConfig;
