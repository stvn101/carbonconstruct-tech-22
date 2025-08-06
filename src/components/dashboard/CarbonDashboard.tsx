import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  FileText, 
  FileSpreadsheet,
  Factory, 
  Truck, 
  Zap, 
  Leaf, 
  Target,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { CalculationResult } from '@/lib/carbonCalculations';
import { ProjectData, exportProjectToPDF, exportProjectToCSV } from '@/utils/exportUtils';
import { ExportSummaryModal } from './ExportSummaryModal';
import { ClaudeCompanion } from './ClaudeCompanion';
import { toast } from 'sonner';

interface CarbonDashboardProps {
  projectName?: string;
  result?: CalculationResult;
  projectData?: ProjectData;
}

export const CarbonDashboard: React.FC<CarbonDashboardProps> = ({
  projectName = "Carbon Assessment",
  result,
  projectData
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'pdf' | 'csv' | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Fallback for missing data
  if (!result) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No calculation results available. Please complete your carbon assessment first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Calculate compliance score
  const complianceScore = Math.min(100, Math.max(0, 
    100 - (result.totalEmissions / 10000) * 100
  ));

  const getComplianceLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'bg-green-500', textColor: 'text-green-700' };
    if (score >= 70) return { level: 'Good', color: 'bg-blue-500', textColor: 'text-blue-700' };
    if (score >= 50) return { level: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { level: 'Poor', color: 'bg-red-500', textColor: 'text-red-700' };
  };

  const compliance = getComplianceLevel(complianceScore);

  // Prepare chart data
  const emissionsData = [
    { name: 'Materials', value: result.materialEmissions, color: '#ef4444', percentage: ((result.materialEmissions / result.totalEmissions) * 100).toFixed(1) },
    { name: 'Transport', value: result.transportEmissions, color: '#f97316', percentage: ((result.transportEmissions / result.totalEmissions) * 100).toFixed(1) },
    { name: 'Energy', value: result.energyEmissions, color: '#eab308', percentage: ((result.energyEmissions / result.totalEmissions) * 100).toFixed(1) }
  ].filter(item => item.value > 0);

  const scopeData = [
    { name: 'Scope 1', value: result.scope1 || 0, color: '#dc2626' },
    { name: 'Scope 2', value: result.scope2 || 0, color: '#ea580c' },
    { name: 'Scope 3', value: result.scope3 || 0, color: '#ca8a04' }
  ];

  const handleExportClick = () => {
    if (!projectData) {
      toast.error('No project data available for export');
      return;
    }
    setShowExportModal(true);
  };

  const handleConfirmExport = async (type: 'pdf' | 'csv') => {
    if (!projectData) return;
    
    setIsExporting(true);
    setExportType(type);
    setShowExportModal(false);

    try {
      if (type === 'pdf') {
        await exportProjectToPDF(projectData);
        toast.success('Professional PDF report downloaded successfully');
      } else {
        exportProjectToCSV(projectData);
        toast.success('CSV data exported successfully');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export ${type.toUpperCase()}. Please try again.`);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{projectName}</h1>
          <p className="text-muted-foreground">Carbon Footprint Assessment Results</p>
        </div>
        
        {/* Export Controls */}
        <div className="flex gap-3">
          <Button 
            onClick={handleExportClick}
            disabled={isExporting || !projectData}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isExporting ? 'Exporting...' : 'Export Report'}
          </Button>
        </div>
      </div>

      {/* Export Summary Modal */}
      <ExportSummaryModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirmExport={handleConfirmExport}
        projectData={projectData}
        result={result}
        isExporting={isExporting}
        exportType={exportType}
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {(result.totalEmissions / 1000).toFixed(1)} t CO₂-e
            </div>
            <p className="text-xs text-muted-foreground">
              Total carbon footprint
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materials</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(result.materialEmissions / 1000).toFixed(1)} t CO₂-e
            </div>
            <p className="text-xs text-muted-foreground">
              {emissionsData.find(d => d.name === 'Materials')?.percentage || '0'}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transport</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(result.transportEmissions / 1000).toFixed(1)} t CO₂-e
            </div>
            <p className="text-xs text-muted-foreground">
              {emissionsData.find(d => d.name === 'Transport')?.percentage || '0'}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(result.energyEmissions / 1000).toFixed(1)} t CO₂-e
            </div>
            <p className="text-xs text-muted-foreground">
              {emissionsData.find(d => d.name === 'Energy')?.percentage || '0'}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emissions Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Emissions Breakdown by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
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
                  <Tooltip 
                    formatter={(value: number, name) => [
                      `${(value / 1000).toFixed(1)} t CO₂-e`, 
                      name
                    ]} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {emissionsData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scope Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>GHG Protocol Scopes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scopeData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${(value / 1000).toFixed(1)} t CO₂-e`, 'Emissions']} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {scopeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-3">
              {scopeData.map((scope, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{scope.name}</span>
                    <span>{(scope.value / 1000).toFixed(1)} t CO₂-e</span>
                  </div>
                  <Progress 
                    value={(scope.value / result.totalEmissions) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Compliance Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {complianceScore >= 70 ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              )}
              <div>
                <div className="text-2xl font-bold">{complianceScore.toFixed(0)}%</div>
                <Badge variant="outline" className={`${compliance.color} text-white`}>
                  {compliance.level}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Green Star Compatible</div>
              <div className="text-sm text-muted-foreground">NCC 2025 Ready</div>
            </div>
          </div>
          <Progress value={complianceScore} className="w-full mb-4" />
          <p className="text-sm text-muted-foreground">
            {complianceScore >= 90 
              ? "Excellent performance! Your project exceeds sustainability targets."
              : complianceScore >= 70
              ? "Good performance with room for minor improvements."
              : complianceScore >= 50
              ? "Fair performance. Consider implementing recommended optimizations."
              : "Significant improvements needed to meet sustainability standards."
            }
          </p>
        </CardContent>
      </Card>

      {/* Claude Companion AI Assistant */}
      <ClaudeCompanion result={result} />
    </div>
  );
};