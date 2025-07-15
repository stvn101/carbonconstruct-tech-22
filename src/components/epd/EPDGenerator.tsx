import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EPDList } from './EPDList';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Award, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const EPDGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('list');
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">EPD Generator</h1>
            <p className="text-muted-foreground mt-2">
              Create ISO 14025 compliant Environmental Product Declarations for construction materials
            </p>
          </div>
          <Button 
            onClick={() => navigate('/epd/create')}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New EPD
          </Button>
        </div>

        {/* Compliance Notice */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100">ISO Compliance Standards</h3>
              <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                Generated EPDs follow ISO 14025, EN 15804, and ISO 21930 standards for construction products. 
                All declarations are marked as "Not Third-Party Verified" until submitted for professional review.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total EPDs</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Under Review</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">My EPDs</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <EPDList />
        </TabsContent>

        <TabsContent value="guidelines">
          <Card>
            <CardHeader>
              <CardTitle>EPD Creation Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">ISO Standards Compliance</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>ISO 14025:</strong> Type III environmental declarations</li>
                  <li>• <strong>EN 15804:</strong> Construction product specific rules</li>
                  <li>• <strong>ISO 21930:</strong> Sustainability in building construction</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Lifecycle Stages (A1-D)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Badge variant="outline">A1-A3: Production</Badge>
                    <p className="text-sm text-muted-foreground">Raw materials, transport, manufacturing</p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline">A4-A5: Construction</Badge>
                    <p className="text-sm text-muted-foreground">Transport to site, installation</p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline">B1-B7: Use</Badge>
                    <p className="text-sm text-muted-foreground">Operational impacts over building lifespan</p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline">C1-C4: End-of-life</Badge>
                    <p className="text-sm text-muted-foreground">Deconstruction, transport, processing, disposal</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Data Quality Requirements</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use verified emission factors where available</li>
                  <li>• Document all data sources and assumptions</li>
                  <li>• Include uncertainty and data quality indicators</li>
                  <li>• Follow functional unit specifications</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Concrete Products</h3>
                  <p className="text-sm text-muted-foreground">Pre-configured for concrete blocks, precast elements</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Steel Products</h3>
                  <p className="text-sm text-muted-foreground">Structural steel, reinforcement, profiles</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold">Timber Products</h3>
                  <p className="text-sm text-muted-foreground">Engineered wood, lumber, panels</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};