import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Target, TrendingUp, Award, Building, Zap, Leaf } from 'lucide-react';

const industryBenchmarks = [
  { category: 'Commercial Offices', industry: 45, company: 35, target: 40 },
  { category: 'Residential', industry: 38, company: 32, target: 35 },
  { category: 'Industrial', industry: 65, company: 58, target: 60 },
  { category: 'Mixed Use', industry: 42, company: 38, target: 40 },
  { category: 'Retail', industry: 35, company: 28, target: 32 }
];

const performanceMetrics = [
  { metric: 'Energy Efficiency', score: 85, max: 100 },
  { metric: 'Material Sustainability', score: 78, max: 100 },
  { metric: 'Water Management', score: 92, max: 100 },
  { metric: 'Waste Reduction', score: 88, max: 100 },
  { metric: 'Transport Optimization', score: 76, max: 100 },
  { metric: 'Renewable Energy', score: 82, max: 100 }
];

const peerComparison = [
  { company: 'Your Company', emissions: 35, efficiency: 85, sustainability: 78 },
  { company: 'Industry Leader', emissions: 28, efficiency: 95, sustainability: 92 },
  { company: 'Industry Average', emissions: 45, efficiency: 72, sustainability: 68 },
  { company: 'Peer Company A', emissions: 42, efficiency: 76, sustainability: 71 },
  { company: 'Peer Company B', emissions: 38, efficiency: 82, sustainability: 75 }
];

const targetAnalysis = [
  { 
    target: 'Net Zero by 2030',
    current: 35,
    required: 0,
    onTrack: false,
    timeRemaining: '6 years',
    annualReduction: 5.8
  },
  { 
    target: 'NABERS 5 Star',
    current: 4.2,
    required: 5.0,
    onTrack: true,
    timeRemaining: '2 years',
    annualReduction: 0.4
  },
  { 
    target: 'Green Star 6 Star',
    current: 5.1,
    required: 6.0,
    onTrack: true,
    timeRemaining: '1 year',
    annualReduction: 0.9
  }
];

export const BenchmarkingDashboard: React.FC = () => {
  const [benchmarkType, setBenchmarkType] = useState('intensity');
  const [industryFilter, setIndustryFilter] = useState('all');

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={benchmarkType} onValueChange={setBenchmarkType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="intensity">Carbon Intensity</SelectItem>
              <SelectItem value="efficiency">Energy Efficiency</SelectItem>
              <SelectItem value="sustainability">Sustainability Score</SelectItem>
              <SelectItem value="cost">Cost per tonne CO₂-e</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline">
          <Target className="h-4 w-4 mr-2" />
          Set New Targets
        </Button>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Industry Ranking</p>
                <p className="text-2xl font-bold text-primary">Top 15%</p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">vs Industry Avg</p>
                <p className="text-2xl font-bold text-green-600">-22%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Efficiency Score</p>
                <p className="text-2xl font-bold text-blue-600">85/100</p>
              </div>
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sustainability</p>
                <p className="text-2xl font-bold text-green-600">78/100</p>
              </div>
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Industry Benchmarking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Industry Carbon Intensity Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={industryBenchmarks} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="industry" fill="hsl(var(--muted))" name="Industry Average" />
                <Bar dataKey="target" fill="hsl(var(--primary))" name="Target" />
                <Bar dataKey="company" fill="hsl(var(--destructive))" name="Your Performance" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceMetrics}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Performance"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary) / 0.3)"
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Peer Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Peer Company Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {peerComparison.map((peer, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{peer.company}</h3>
                      {peer.company === 'Your Company' && (
                        <Badge variant="default" className="mt-1">You</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-sm text-muted-foreground">Carbon Intensity</div>
                    <div className={`text-lg font-bold ${
                      peer.company === 'Your Company' ? 'text-primary' : 
                      peer.emissions < 35 ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                      {peer.emissions} kg/m²
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Efficiency</div>
                    <div className={`text-lg font-bold ${
                      peer.company === 'Your Company' ? 'text-primary' : 
                      peer.efficiency > 80 ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                      {peer.efficiency}%
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Sustainability</div>
                    <div className={`text-lg font-bold ${
                      peer.company === 'Your Company' ? 'text-primary' : 
                      peer.sustainability > 75 ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                      {peer.sustainability}/100
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Target Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Target Achievement Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {targetAnalysis.map((target, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">{target.target}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-muted-foreground">
                          Current: {target.current}{target.target.includes('Star') ? ' stars' : ' kg CO₂-e/m²'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Target: {target.required}{target.target.includes('Star') ? ' stars' : ' kg CO₂-e/m²'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Time: {target.timeRemaining}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge variant={target.onTrack ? 'default' : 'destructive'}>
                    {target.onTrack ? 'On Track' : 'At Risk'}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-2">
                    Required: {target.annualReduction}/year
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Improvement Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Benchmarking Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Strengths</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-green-800 dark:text-green-200">Water Management</div>
                    <div className="text-sm text-muted-foreground">92% efficiency - top 10% in industry</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-green-800 dark:text-green-200">Waste Reduction</div>
                    <div className="text-sm text-muted-foreground">88% efficiency - above industry average</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Improvement Areas</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-orange-800 dark:text-orange-200">Transport Optimization</div>
                    <div className="text-sm text-muted-foreground">76% efficiency - potential 12% improvement</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-orange-800 dark:text-orange-200">Material Sustainability</div>
                    <div className="text-sm text-muted-foreground">78% score - industry leaders achieve 85%+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};