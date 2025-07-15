import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Link, Settings, Zap, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IntegrationConfig {
  id: string;
  name: string;
  status: 'connected' | 'available' | 'beta' | 'coming-soon';
  description: string;
  features: string[];
  apiEndpoint?: string;
  webhookUrl?: string;
  enabled: boolean;
}

export const ConstructionIntegrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([
    {
      id: 'procore',
      name: 'Procore',
      status: 'available',
      description: 'Sync project data and carbon tracking with Procore construction management platform',
      features: ['Project Sync', 'Real-time Updates', 'Material Tracking', 'Progress Reports'],
      apiEndpoint: 'https://api.procore.com/v1',
      enabled: false
    },
    {
      id: 'autodesk-acc',
      name: 'Autodesk Construction Cloud',
      status: 'available',
      description: 'Integrate with ACC for BIM-based carbon calculations and model analysis',
      features: ['BIM Integration', 'Model Analysis', 'Quantity Takeoffs', 'Design Optimization'],
      apiEndpoint: 'https://developer.api.autodesk.com/construction',
      enabled: false
    },
    {
      id: 'buildertrend',
      name: 'Buildertrend',
      status: 'available',
      description: 'Connect residential construction projects with automated carbon tracking',
      features: ['Project Management', 'Customer Portal', 'Material Orders', 'Schedule Sync'],
      apiEndpoint: 'https://api.buildertrend.net/v1.0',
      enabled: false
    },
    {
      id: 'plangrid',
      name: 'PlanGrid',
      status: 'connected',
      description: 'Field data collection and real-time construction progress tracking',
      features: ['Field Reports', 'Photo Documentation', 'Progress Tracking', 'Quality Control'],
      apiEndpoint: 'https://io.plangrid.com/projects',
      enabled: true
    },
    {
      id: 'fieldwire',
      name: 'Fieldwire',
      status: 'beta',
      description: 'Task management and field communication with carbon impact tracking',
      features: ['Task Management', 'Field Communication', 'Punch Lists', 'Photo Reports'],
      apiEndpoint: 'https://console.fieldwire.net/api/v3',
      enabled: false
    },
    {
      id: 'smartsheet',
      name: 'Smartsheet',
      status: 'coming-soon',
      description: 'Project planning and resource management with sustainability metrics',
      features: ['Project Planning', 'Resource Management', 'Gantt Charts', 'Dashboards'],
      enabled: false
    },
    {
      id: 'custom-api',
      name: 'Custom API',
      status: 'available',
      description: 'Build custom integrations using our comprehensive REST API',
      features: ['REST API', 'Webhooks', 'Real-time Sync', 'Custom Workflows'],
      apiEndpoint: 'https://api.carbonconstruct.com/v1',
      enabled: false
    }
  ]);

  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [webhookUrls, setWebhookUrls] = useState<Record<string, string>>({});
  const [testingIntegration, setTestingIntegration] = useState<string | null>(null);
  const { toast } = useToast();

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, enabled: !integration.enabled }
        : integration
    ));

    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      toast({
        title: `${integration.name} ${integration.enabled ? 'Disabled' : 'Enabled'}`,
        description: `Integration ${integration.enabled ? 'disconnected' : 'connected'} successfully.`,
      });
    }
  };

  const handleTestConnection = async (integrationId: string) => {
    setTestingIntegration(integrationId);
    
    // Simulate API test
    setTimeout(() => {
      setTestingIntegration(null);
      toast({
        title: "Connection Test",
        description: "Integration test completed successfully.",
      });
    }, 2000);
  };

  const handleSaveConfig = (integrationId: string) => {
    toast({
      title: "Configuration Saved",
      description: "Integration settings have been updated.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-300">Connected</Badge>;
      case 'available':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-300">Available</Badge>;
      case 'beta':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-300">Beta</Badge>;
      case 'coming-soon':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-950/20 dark:text-gray-300">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string, enabled: boolean) => {
    if (status === 'connected' && enabled) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (status === 'available') {
      return <Zap className="h-5 w-5 text-blue-600" />;
    }
    return <AlertCircle className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Construction Management Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(integration.status, integration.enabled)}
                      <h4 className="font-medium">{integration.name}</h4>
                    </div>
                    {getStatusBadge(integration.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Features</Label>
                    <div className="flex flex-wrap gap-1">
                      {integration.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {integration.status !== 'coming-soon' && (
                    <div className="flex items-center justify-between pt-2">
                      <Label className="text-sm">Enable Integration</Label>
                      <Switch
                        checked={integration.enabled}
                        onCheckedChange={() => handleToggleIntegration(integration.id)}
                        disabled={false}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Integration Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="api-keys" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="api-keys" className="space-y-4">
              {integrations.filter(i => i.status !== 'coming-soon').map((integration) => (
                <div key={integration.id} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">{integration.name} API Key</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestConnection(integration.id)}
                      disabled={testingIntegration === integration.id}
                    >
                      {testingIntegration === integration.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Test'
                      )}
                    </Button>
                  </div>
                  <Input
                    type="password"
                    placeholder="Enter API key..."
                    value={apiKeys[integration.id] || ''}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, [integration.id]: e.target.value }))}
                  />
                  <Button size="sm" onClick={() => handleSaveConfig(integration.id)}>
                    Save Configuration
                  </Button>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="webhooks" className="space-y-4">
              {integrations.filter(i => i.enabled).map((integration) => (
                <div key={integration.id} className="space-y-3 p-4 border rounded-lg">
                  <Label className="font-medium">{integration.name} Webhook URL</Label>
                  <Input
                    placeholder="https://your-webhook-url.com/endpoint"
                    value={webhookUrls[integration.id] || ''}
                    onChange={(e) => setWebhookUrls(prev => ({ ...prev, [integration.id]: e.target.value }))}
                  />
                  <div className="text-xs text-muted-foreground">
                    This URL will receive real-time updates from {integration.name}
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Sync Frequency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label>Update Interval</Label>
                      <select className="w-full p-2 border rounded">
                        <option value="real-time">Real-time</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Data Privacy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Encrypt Data</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Log API Calls</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};