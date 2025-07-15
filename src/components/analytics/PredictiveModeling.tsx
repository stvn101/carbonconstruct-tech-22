import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar } from 'recharts';
import { Brain, TrendingUp, Target, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';

const forecastData = [
  { year: '2024', actual: 2200, predicted: 2180, target: 2000, confidence: 92 },
  { year: '2025', actual: null, predicted: 1950, target: 1800, confidence: 88 },
  { year: '2026', actual: null, predicted: 1720, target: 1600, confidence: 82 },
  { year: '2027', actual: null, predicted: 1580, target: 1400, confidence: 76 },
  { year: '2028', actual: null, predicted: 1450, target: 1200, confidence: 70 },
  { year: '2029', actual: null, predicted: 1320, target: 1000, confidence: 65 },
  { year: '2030', actual: null, predicted: 1200, target: 800, confidence: 60 }
];

const scenarioAnalysis = [
  {
    scenario: 'Business as Usual',
    2025: 2100,
    2027: 1800,
    2030: 1500,
    probability: 'High',
    description: 'Current trajectory with minimal changes'
  },
  {
    scenario: 'Accelerated Reduction',
    2025: 1800,
    2027: 1400,
    2030: 900,
    probability: 'Medium',
    description: 'Aggressive sustainability investments'
  },
  {
    scenario: 'Net Zero Target',
    2025: 1600,
    2027: 1000,
    2030: 0,
    probability: 'Low',
    description: 'Maximum effort with carbon offsets'
  }
];

const impactFactors = [
  { 
    factor: 'Renewable Energy Adoption', 
    impact: 25, 
    timeframe: '2-3 years',
    cost: 'High',
    feasibility: 85,
    description: 'Solar and wind power integration'
  },
  { 
    factor: 'Material Sourcing Optimization', 
    impact: 18, 
    timeframe: '1-2 years',
    cost: 'Medium',
    feasibility: 92,
    description: 'Local and recycled materials'
  },
  { 
    factor: 'Transport Electrification', 
    impact: 15, 
    timeframe: '3-5 years',
    cost: 'High',
    feasibility: 70,
    description: 'Electric vehicle fleet adoption'
  },
  { 
    factor: 'Energy Efficiency Upgrades', 
    impact: 12, 
    timeframe: '1-2 years',
    cost: 'Medium',
    feasibility: 95,
    description: 'Smart building systems'
  },
  { 
    factor: 'Waste Reduction Programs', 
    impact: 8, 
    timeframe: '6-12 months',
    cost: 'Low',
    feasibility: 98,
    description: 'Circular economy practices'
  }
];

const riskFactors = [
  {
    risk: 'Regulatory Changes',
    probability: 'High',
    impact: 'Medium',
    description: 'New climate disclosure requirements could increase compliance costs',
    mitigation: 'Early compliance preparation and monitoring'
  },
  {
    risk: 'Technology Limitations',
    probability: 'Medium',
    impact: 'High',
    description: 'Limited availability of low-carbon construction technologies',
    mitigation: 'Diversified technology partnerships and R&D investment'
  },
  {
    risk: 'Market Volatility',
    probability: 'Medium',
    impact: 'Medium',
    description: 'Price fluctuations in sustainable materials and technologies',
    mitigation: 'Long-term supply contracts and hedging strategies'
  }
];

export const PredictiveModeling: React.FC = () => {
  const [forecastPeriod, setForecastPeriod] = useState('2030');
  const [selectedScenario, setSelectedScenario] = useState('accelerated');

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2027">To 2027</SelectItem>
              <SelectItem value="2030">To 2030</SelectItem>
              <SelectItem value="2035">To 2035</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedScenario} onValueChange={setSelectedScenario}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Business as Usual</SelectItem>
              <SelectItem value="accelerated">Accelerated Reduction</SelectItem>
              <SelectItem value="netzero">Net Zero Target</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="bg-primary hover:bg-primary/90">
          <Brain className="h-4 w-4 mr-2" />
          Run New Forecast
        </Button>
      </div>

      {/* AI Forecast Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">2030 Prediction</p>
                <p className="text-2xl font-bold text-primary">1,200 t</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confidence Level</p>
                <p className="text-2xl font-bold text-green-600">85%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Target Gap</p>
                <p className="text-2xl font-bold text-orange-600">400 t</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <p className="text-2xl font-bold text-yellow-600">Medium</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Carbon Emissions Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="confidence" fill="hsl(var(--muted) / 0.3)" name="Confidence %" yAxisId="right" />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={3}
                name="Actual Emissions"
                connectNulls={false}
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Predicted Emissions"
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="hsl(var(--green-600))" 
                strokeWidth={2}
                name="Target"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Scenario Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Scenario Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scenarioAnalysis.map((scenario, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{scenario.scenario}</h3>
                    <Badge variant={scenario.probability === 'High' ? 'default' : 
                                  scenario.probability === 'Medium' ? 'secondary' : 'outline'}>
                      {scenario.probability} Probability
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{scenario.description}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-sm text-muted-foreground">2025</div>
                    <div className="text-lg font-bold">{scenario['2025']} t</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">2027</div>
                    <div className="text-lg font-bold">{scenario['2027']} t</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">2030</div>
                    <div className="text-lg font-bold">{scenario['2030']} t</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Factor Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            High-Impact Reduction Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {impactFactors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{factor.factor}</h3>
                    <Badge variant="default">{factor.impact}% Reduction</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{factor.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-muted-foreground">Timeframe: {factor.timeframe}</span>
                    <span className="text-sm text-muted-foreground">Cost: {factor.cost}</span>
                    <span className="text-sm text-muted-foreground">Feasibility: {factor.feasibility}%</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    factor.feasibility > 90 ? 'text-green-600' :
                    factor.feasibility > 75 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {factor.feasibility}%
                  </div>
                  <div className="text-sm text-muted-foreground">Feasibility</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Assessment & Mitigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskFactors.map((risk, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{risk.risk}</h3>
                      <Badge variant={risk.probability === 'High' ? 'destructive' : 'secondary'}>
                        {risk.probability} Probability
                      </Badge>
                      <Badge variant={risk.impact === 'High' ? 'destructive' : 'outline'}>
                        {risk.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{risk.description}</p>
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <h4 className="font-medium text-blue-800 dark:text-blue-200">Mitigation Strategy</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">{risk.mitigation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Generated Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Priority Actions (Next 12 months)</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <h5 className="font-medium text-green-800 dark:text-green-200">Implement Energy Efficiency Upgrades</h5>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    12% reduction potential with 95% feasibility and medium cost. Start with smart building systems.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <h5 className="font-medium text-blue-800 dark:text-blue-200">Optimize Material Sourcing</h5>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    18% reduction potential through local and recycled materials. Quick implementation possible.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Long-term Strategic Moves</h4>
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <h5 className="font-medium text-purple-800 dark:text-purple-200">Renewable Energy Investment</h5>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                    25% reduction potential. High cost but crucial for 2030 targets. Plan phased implementation.
                  </p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <h5 className="font-medium text-orange-800 dark:text-orange-200">Transport Electrification</h5>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    15% reduction potential. Start pilot program with key routes and scale gradually.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};