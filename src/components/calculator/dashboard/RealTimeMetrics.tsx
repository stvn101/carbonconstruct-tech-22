import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';

interface RealTimeMetricsProps {
  calculatorData: any;
  totalEmissions: number;
}

export const RealTimeMetrics: React.FC<RealTimeMetricsProps> = ({ calculatorData, totalEmissions }) => {
  const emissionsData = [
    { name: 'NCC', value: calculatorData.ncc?.totalEmissions || 0, color: '#ef4444' },
    { name: 'NABERS', value: calculatorData.nabers?.totalEmissions || 0, color: '#f97316' },
    { name: 'LCA', value: calculatorData.lca?.totalLCA || 0, color: '#eab308' },
    { name: 'Scope', value: calculatorData.scope?.totalEmissions || 0, color: '#22c55e' }
  ].filter(item => item.value > 0);

  const complianceData = [
    { 
      name: 'NCC', 
      score: calculatorData.ncc?.isCompliant ? 100 : 0,
      target: 80 
    },
    { 
      name: 'NABERS', 
      score: calculatorData.nabers?.overallRating ? calculatorData.nabers.overallRating * 16.67 : 0,
      target: 66.67 
    },
    { 
      name: 'LEED', 
      score: calculatorData.leed?.totalPoints ? (calculatorData.leed.totalPoints / 110) * 100 : 0,
      target: 36.36 
    },
    { 
      name: 'BREEAM', 
      score: calculatorData.breeam?.totalScore || 0,
      target: 55 
    }
  ];

  const trendData = [
    { month: 'Jan', emissions: 450 },
    { month: 'Feb', emissions: 380 },
    { month: 'Mar', emissions: 420 },
    { month: 'Apr', emissions: totalEmissions / 1000 || 0 },
  ];

  const calculateReduction = () => {
    const baseline = 500; // Example baseline
    const current = totalEmissions / 1000;
    return baseline > 0 ? ((baseline - current) / baseline * 100).toFixed(1) : 0;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Emissions Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Emissions Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {emissionsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emissionsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {emissionsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${(value / 1000).toFixed(1)} t CO₂-e`, 'Emissions']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No emissions data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Compliance Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']} />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Emissions Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-green-600" />
            Emissions Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value} t CO₂-e`, 'Emissions']} />
                <Line 
                  type="monotone" 
                  dataKey="emissions" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div>
              <div className="text-sm font-medium text-green-800 dark:text-green-300">Carbon Reduction</div>
              <div className="text-xs text-green-600 dark:text-green-400">vs. baseline</div>
            </div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {calculateReduction()}%
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div>
              <div className="text-sm font-medium text-blue-800 dark:text-blue-300">Standards Met</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">out of active</div>
            </div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {complianceData.filter(item => item.score >= item.target).length}/{complianceData.length}
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <div>
              <div className="text-sm font-medium text-purple-800 dark:text-purple-300">Total Emissions</div>
              <div className="text-xs text-purple-600 dark:text-purple-400">current period</div>
            </div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {(totalEmissions / 1000).toFixed(1)}t
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};