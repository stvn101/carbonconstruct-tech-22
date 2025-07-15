import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Download, 
  FileText, 
  TrendingUp, 
  Target,
  Calendar,
  Filter,
  Share,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface EmissionsData {
  category: string;
  emissions: number;
  percentage: number;
  dataQuality: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
  target?: number;
}

interface TimeSeriesData {
  period: string;
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
}

const scope3Data: EmissionsData[] = [
  { category: 'Purchased Goods & Services', emissions: 1250.5, percentage: 45.2, dataQuality: 'high', trend: 'down' },
  { category: 'Use of Sold Products', emissions: 890.3, percentage: 32.1, dataQuality: 'medium', trend: 'stable' },
  { category: 'Capital Goods', emissions: 320.8, percentage: 11.6, dataQuality: 'medium', trend: 'up' },
  { category: 'Fuel & Energy Related', emissions: 180.2, percentage: 6.5, dataQuality: 'high', trend: 'down' },
  { category: 'Upstream Transportation', emissions: 95.3, percentage: 3.4, dataQuality: 'medium', trend: 'stable' },
  { category: 'Business Travel', emissions: 78.9, percentage: 2.8, dataQuality: 'high', trend: 'down' },
  { category: 'Waste Generated', emissions: 45.7, percentage: 1.6, dataQuality: 'medium', trend: 'up' },
  { category: 'Employee Commuting', emissions: 32.1, percentage: 1.2, dataQuality: 'low', trend: 'stable' }
];

const timeSeriesData: TimeSeriesData[] = [
  { period: '2020', scope1: 450, scope2: 320, scope3: 2100, total: 2870 },
  { period: '2021', scope1: 420, scope2: 310, scope3: 2250, total: 2980 },
  { period: '2022', scope1: 380, scope2: 290, scope3: 2400, total: 3070 },
  { period: '2023', scope1: 350, scope2: 275, scope3: 2650, total: 3275 },
  { period: '2024', scope1: 320, scope2: 260, scope3: 2893, total: 3473 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

export default function AdvancedReporting() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'compliance'>('summary');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const totalEmissions = scope3Data.reduce((sum, item) => sum + item.emissions, 0);
  const highQualityData = scope3Data.filter(item => item.dataQuality === 'high').length;
  const dataCompleteness = (scope3Data.length / 15) * 100; // 15 total categories

  const getDataQualityColor = (quality: string) => {
    switch (quality) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const generateReport = (format: 'pdf' | 'excel' | 'csv') => {
    // This would trigger actual report generation
    console.log(`Generating ${format} report for ${reportType} type`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Reporting</h1>
          <p className="text-gray-600 mt-2">Comprehensive Scope 3 emissions analysis and reporting</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Scope 3 Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalEmissions.toFixed(1)} tCO₂e</div>
            <div className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
              5.2% vs last year
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Data Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{((highQualityData / scope3Data.length) * 100).toFixed(0)}%</div>
            <div className="text-sm text-gray-500">{highQualityData}/{scope3Data.length} high quality</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Categories Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{scope3Data.length}/15</div>
            <div className="text-sm text-gray-500">{dataCompleteness.toFixed(0)}% complete</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-lg font-semibold text-green-600">Compliant</span>
            </div>
            <div className="text-sm text-gray-500">GHG Protocol aligned</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Emissions by Category - Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Emissions by Category</CardTitle>
                <p className="text-sm text-gray-600">Distribution of Scope 3 emissions across categories</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={scope3Data.slice(0, 6)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="emissions"
                    >
                      {scope3Data.slice(0, 6).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value.toFixed(1)} tCO₂e`, 'Emissions']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Historical Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Historical Emissions Trends</CardTitle>
                <p className="text-sm text-gray-600">5-year emissions trajectory by scope</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`${value} tCO₂e`, '']} />
                    <Legend />
                    <Area type="monotone" dataKey="scope1" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="scope2" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="scope3" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Categories Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Emission Categories</CardTitle>
              <p className="text-sm text-gray-600">Highest contributing Scope 3 categories</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scope3Data.slice(0, 5).map((item, index) => (
                  <div key={item.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-bold text-gray-500">#{index + 1}</div>
                      <div>
                        <div className="font-medium">{item.category}</div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getDataQualityColor(item.dataQuality)}>
                            {item.dataQuality} quality
                          </Badge>
                          {getTrendIcon(item.trend)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{item.emissions.toFixed(1)} tCO₂e</div>
                      <div className="text-sm text-gray-500">{item.percentage.toFixed(1)}% of total</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emissions by Category</CardTitle>
              <p className="text-sm text-gray-600">Detailed breakdown of all Scope 3 categories</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={scope3Data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(1)} tCO₂e`, 'Emissions']} />
                  <Bar dataKey="emissions" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Year Trends</CardTitle>
              <p className="text-sm text-gray-600">Emissions trends across all scopes</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value} tCO₂e`, '']} />
                  <Legend />
                  <Line type="monotone" dataKey="scope1" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="scope2" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="scope3" stroke="#ffc658" strokeWidth={2} />
                  <Line type="monotone" dataKey="total" stroke="#ff7300" strokeWidth={3} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Trend Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scope 1 Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">-28.9%</div>
                <p className="text-sm text-gray-600">5-year reduction</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 rotate-180 mr-1" />
                  <span className="text-sm text-green-600">Improving</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scope 2 Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">-18.8%</div>
                <p className="text-sm text-gray-600">5-year reduction</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 rotate-180 mr-1" />
                  <span className="text-sm text-green-600">Improving</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scope 3 Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">+37.8%</div>
                <p className="text-sm text-gray-600">5-year increase</p>
                <div className="flex items-center mt-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">Needs attention</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>GHG Protocol Compliance</CardTitle>
                <p className="text-sm text-gray-600">Alignment with GHG Protocol standards</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Scope 3 Categories Covered</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="font-medium">8/15 Required</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Data Quality Standards</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="font-medium">Met</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Calculation Methodologies</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="font-medium">Compliant</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Uncertainty Assessment</span>
                  <div className="flex items-center">
                    <Info className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="font-medium">Partial</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reporting Standards</CardTitle>
                <p className="text-sm text-gray-600">Compliance with reporting frameworks</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>CDP Climate Change</span>
                  <Badge className="bg-green-100 text-green-800">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>TCFD Recommendations</span>
                  <Badge className="bg-green-100 text-green-800">Aligned</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>SBTi Requirements</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>EU CSRD</span>
                  <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
              <p className="text-sm text-gray-600">Steps to improve compliance and data quality</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Complete Missing Categories</h4>
                    <p className="text-sm text-yellow-700">7 Scope 3 categories still need data collection</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Improve Data Quality</h4>
                    <p className="text-sm text-blue-700">Engage suppliers for primary data collection</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Set Science-Based Targets</h4>
                    <p className="text-sm text-green-700">Current data supports SBTi target setting</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <p className="text-sm text-gray-600">Generate comprehensive reports in various formats</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => generateReport('pdf')}
            >
              <FileText className="h-6 w-6 mb-2" />
              <span>PDF Report</span>
              <span className="text-xs text-gray-500">Executive summary</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => generateReport('excel')}
            >
              <Download className="h-6 w-6 mb-2" />
              <span>Excel Export</span>
              <span className="text-xs text-gray-500">Detailed data</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => generateReport('csv')}
            >
              <FileText className="h-6 w-6 mb-2" />
              <span>CSV Data</span>
              <span className="text-xs text-gray-500">Raw emissions data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

