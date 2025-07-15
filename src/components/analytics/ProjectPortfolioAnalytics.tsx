import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building, TrendingDown, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const projectData = [
  { name: 'Commercial Tower A', emissions: 450, target: 400, status: 'exceeded', compliance: 85 },
  { name: 'Residential Complex B', emissions: 320, target: 350, status: 'on-track', compliance: 92 },
  { name: 'Industrial Facility C', emissions: 680, target: 650, status: 'exceeded', compliance: 78 },
  { name: 'Office Building D', emissions: 280, target: 300, status: 'on-track', compliance: 95 },
  { name: 'Mixed-Use Development E', emissions: 520, target: 500, status: 'exceeded', compliance: 88 }
];

const emissionsByCategory = [
  { name: 'Materials', value: 45, color: '#ef4444' },
  { name: 'Transport', value: 20, color: '#f97316' },
  { name: 'Energy', value: 25, color: '#eab308' },
  { name: 'Waste', value: 10, color: '#22c55e' }
];

export const ProjectPortfolioAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Project Carbon Emissions vs Targets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="target" fill="hsl(var(--muted))" name="Target" />
                <Bar dataKey="emissions" fill="hsl(var(--destructive))" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Emissions Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emissionsByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {emissionsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Project Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Project Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectData.map((project, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{project.name}</h3>
                    <Badge variant={project.status === 'on-track' ? 'default' : 'destructive'}>
                      {project.status === 'on-track' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {project.status}
                    </Badge>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Emissions: {project.emissions} t CO₂-e</span>
                      <span>Target: {project.target} t CO₂-e</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Compliance Score:</span>
                      <Progress value={project.compliance} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{project.compliance}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {project.emissions > project.target ? (
                      <TrendingUp className="h-4 w-4 text-destructive" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      project.emissions > project.target ? 'text-destructive' : 'text-green-600'
                    }`}>
                      {project.emissions > project.target ? '+' : '-'}
                      {Math.abs(((project.emissions - project.target) / project.target) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">3/5</div>
              <div className="text-sm text-muted-foreground">Projects Over Target</div>
              <div className="mt-2">
                <Badge variant="destructive">Action Required</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">87.6%</div>
              <div className="text-sm text-muted-foreground">Average Compliance</div>
              <div className="mt-2">
                <Badge variant="default">Good Performance</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">-12%</div>
              <div className="text-sm text-muted-foreground">YoY Improvement</div>
              <div className="mt-2">
                <Badge variant="default">On Track</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};