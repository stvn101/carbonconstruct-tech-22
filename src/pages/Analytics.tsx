import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Download, 
  Calendar,
  Building,
  Target,
  AlertTriangle,
  CheckCircle,
  Globe,
  Factory,
  Zap
} from 'lucide-react';
import { ProjectPortfolioAnalytics } from '@/components/analytics/ProjectPortfolioAnalytics';
import { CarbonTrendAnalysis } from '@/components/analytics/CarbonTrendAnalysis';
import { ComplianceReporting } from '@/components/analytics/ComplianceReporting';
import { BenchmarkingDashboard } from '@/components/analytics/BenchmarkingDashboard';
import { PredictiveModeling } from '@/components/analytics/PredictiveModeling';
import { useAuth } from '@/contexts/auth';
import { RequireAuth } from '@/components/auth/RequireAuth';
import SEO from '@/components/SEO';

const Analytics = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('portfolio');

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
        <SEO 
          title="Analytics Dashboard - CarbonConstruct"
          description="Advanced carbon footprint analytics and reporting for construction projects"
          canonical="/analytics"
        />
        
        {/* Header */}
        <div className="bg-card shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-3">
                <div className="bg-primary p-2 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground">Analytics Dashboard</h1>
                  <p className="text-muted-foreground">Advanced carbon footprint reporting and business intelligence</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Portfolio Projects</div>
                  <div className="text-lg font-bold text-primary">12 Active</div>
                </div>
                
                <Button className="bg-primary hover:bg-primary/90">
                  <Download className="w-4 h-4 mr-2" />
                  Export Reports
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Portfolio Emissions</p>
                    <p className="text-2xl font-bold text-destructive">2,458 t CO₂-e</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">12% reduction YoY</span>
                    </div>
                  </div>
                  <Factory className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Compliance Score</p>
                    <p className="text-2xl font-bold text-green-600">94%</p>
                    <div className="flex items-center mt-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">Above target</span>
                    </div>
                  </div>
                  <Target className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <div className="flex items-center mt-2">
                      <Building className="h-4 w-4 text-blue-600 mr-1" />
                      <span className="text-sm text-blue-600">3 new this month</span>
                    </div>
                  </div>
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Energy Efficiency</p>
                    <p className="text-2xl font-bold text-yellow-600">87%</p>
                    <div className="flex items-center mt-2">
                      <Zap className="h-4 w-4 text-yellow-600 mr-1" />
                      <span className="text-sm text-yellow-600">Target: 85%</span>
                    </div>
                  </div>
                  <Zap className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Analytics Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full">
              <TabsTrigger value="portfolio" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span className="hidden sm:inline">Portfolio</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Trends</span>
              </TabsTrigger>
              <TabsTrigger value="compliance" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Compliance</span>
              </TabsTrigger>
              <TabsTrigger value="benchmarking" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Benchmarking</span>
              </TabsTrigger>
              <TabsTrigger value="predictive" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Predictive</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio">
              <ProjectPortfolioAnalytics />
            </TabsContent>

            <TabsContent value="trends">
              <CarbonTrendAnalysis />
            </TabsContent>

            <TabsContent value="compliance">
              <ComplianceReporting />
            </TabsContent>

            <TabsContent value="benchmarking">
              <BenchmarkingDashboard />
            </TabsContent>

            <TabsContent value="predictive">
              <PredictiveModeling />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RequireAuth>
  );
};

export default Analytics;