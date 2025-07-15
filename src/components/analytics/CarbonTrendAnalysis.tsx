import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingDown, TrendingUp, Calendar, Target } from 'lucide-react';

const monthlyTrends = [
  { month: 'Jan', emissions: 420, target: 400, reduction: 5 },
  { month: 'Feb', emissions: 380, target: 390, reduction: 8 },
  { month: 'Mar', emissions: 350, target: 380, reduction: 12 },
  { month: 'Apr', emissions: 330, target: 370, reduction: 15 },
  { month: 'May', emissions: 310, target: 360, reduction: 18 },
  { month: 'Jun', emissions: 295, target: 350, reduction: 22 }
];

const yearlyComparison = [
  { year: '2021', emissions: 2800, intensity: 45 },
  { year: '2022', emissions: 2650, intensity: 42 },
  { year: '2023', emissions: 2400, intensity: 38 },
  { year: '2024', emissions: 2200, intensity: 35 }
];

const categoryTrends = [
  { month: 'Jan', materials: 200, transport: 80, energy: 100, waste: 40 },
  { month: 'Feb', materials: 180, transport: 75, energy: 95, waste: 30 },
  { month: 'Mar', materials: 165, transport: 70, energy: 85, waste: 30 },
  { month: 'Apr', materials: 155, transport: 65, energy: 80, waste: 30 },
  { month: 'May', materials: 145, transport: 60, energy: 75, waste: 30 },
  { month: 'Jun', materials: 140, transport: 55, energy: 70, waste: 30 }
];

export const CarbonTrendAnalysis: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [comparisonType, setComparisonType] = useState('emissions');

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
              <SelectItem value="2years">Last 2 Years</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={comparisonType} onValueChange={setComparisonType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emissions">Total Emissions</SelectItem>
              <SelectItem value="intensity">Carbon Intensity</SelectItem>
              <SelectItem value="categories">By Categories</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Custom Range
        </Button>
      </div>

      {/* Trend Insights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Reduction</p>
                <p className="text-2xl font-bold text-green-600">22%</p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Best Performing</p>
                <p className="text-lg font-bold text-blue-600">Materials</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Forecast 2025</p>
                <p className="text-2xl font-bold text-primary">1.8k t</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Target Achievement</p>
                <p className="text-2xl font-bold text-green-600">85%</p>
              </div>
              <Badge variant="default" className="ml-2">On Track</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Carbon Emissions Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {comparisonType === 'emissions' && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="emissions" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={3}
                  name="Actual Emissions" 
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeDasharray="5 5"
                  name="Target" 
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {comparisonType === 'intensity' && (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={yearlyComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="intensity" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary) / 0.3)"
                  name="Carbon Intensity (kg CO₂-e/m²)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {comparisonType === 'categories' && (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={categoryTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="materials" 
                  stackId="1"
                  stroke="#ef4444" 
                  fill="#ef4444"
                  name="Materials" 
                />
                <Area 
                  type="monotone" 
                  dataKey="transport" 
                  stackId="1"
                  stroke="#f97316" 
                  fill="#f97316"
                  name="Transport" 
                />
                <Area 
                  type="monotone" 
                  dataKey="energy" 
                  stackId="1"
                  stroke="#eab308" 
                  fill="#eab308"
                  name="Energy" 
                />
                <Area 
                  type="monotone" 
                  dataKey="waste" 
                  stackId="1"
                  stroke="#22c55e" 
                  fill="#22c55e"
                  name="Waste" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Trend Analysis Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Trends Identified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <TrendingDown className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Material Emissions Declining</h4>
                  <p className="text-sm text-muted-foreground">30% reduction in material-related emissions over 6 months due to sustainable sourcing initiatives.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Transport Impact Stabilizing</h4>
                  <p className="text-sm text-muted-foreground">Transport emissions showing steady improvement with local supplier partnerships.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Energy Efficiency Gains</h4>
                  <p className="text-sm text-muted-foreground">Consistent energy emission reductions through renewable energy adoption.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Forecasting & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200">Projected 2025 Target Achievement</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Based on current trends, you're on track to exceed your 2025 carbon reduction targets by 15%.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">Focus Area: Transport Optimization</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Additional 8% reduction possible through enhanced logistics planning and electric vehicle adoption.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Monitor: Seasonal Variations</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Energy consumption shows seasonal patterns - consider renewable energy storage solutions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};