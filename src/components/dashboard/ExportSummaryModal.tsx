import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  FileSpreadsheet, 
  Factory, 
  Truck, 
  Zap, 
  Target,
  Calendar,
  User,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { CalculationResult } from '@/lib/carbonCalculations';
import { ProjectData } from '@/utils/exportUtils';

interface ExportSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExport: (format: 'pdf' | 'csv') => void;
  projectData?: ProjectData;
  result?: CalculationResult;
  isExporting: boolean;
  exportType: 'pdf' | 'csv' | null;
}

export const ExportSummaryModal: React.FC<ExportSummaryModalProps> = ({
  isOpen,
  onClose,
  onConfirmExport,
  projectData,
  result,
  isExporting,
  exportType
}) => {
  if (!result || !projectData) return null;

  // Calculate compliance score
  const complianceScore = Math.min(100, Math.max(0, 
    100 - (result.totalEmissions / 10000) * 100
  ));

  const getComplianceLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'bg-green-500', icon: CheckCircle };
    if (score >= 70) return { level: 'Good', color: 'bg-blue-500', icon: CheckCircle };
    if (score >= 50) return { level: 'Fair', color: 'bg-yellow-500', icon: AlertTriangle };
    return { level: 'Poor', color: 'bg-red-500', icon: AlertTriangle };
  };

  const compliance = getComplianceLevel(complianceScore);

  // Calculate percentages
  const materialPercent = ((result.materialEmissions / result.totalEmissions) * 100).toFixed(1);
  const transportPercent = ((result.transportEmissions / result.totalEmissions) * 100).toFixed(1);
  const energyPercent = ((result.energyEmissions / result.totalEmissions) * 100).toFixed(1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Carbon Assessment Report
          </DialogTitle>
          <DialogDescription>
            Review your project summary before generating the export
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Overview */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Project Name</div>
                    <div className="text-sm text-muted-foreground">{projectData.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Generated</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emissions Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-destructive">
                  {(result.totalEmissions / 1000).toFixed(1)} t CO₂-e
                </div>
                <div className="text-sm text-muted-foreground">Total Carbon Footprint</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <Factory className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-lg font-semibold">
                    {(result.materialEmissions / 1000).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Materials ({materialPercent}%)
                  </div>
                </div>
                <div className="text-center">
                  <Truck className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-lg font-semibold">
                    {(result.transportEmissions / 1000).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Transport ({transportPercent}%)
                  </div>
                </div>
                <div className="text-center">
                  <Zap className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-lg font-semibold">
                    {(result.energyEmissions / 1000).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Energy ({energyPercent}%)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Score */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Compliance Assessment</div>
                    <div className="text-sm text-muted-foreground">
                      Green Star & NCC 2025 Ready
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{complianceScore.toFixed(0)}%</div>
                  <Badge variant="outline" className={`${compliance.color} text-white`}>
                    {compliance.level}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GHG Scopes */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="font-medium mb-3">GHG Protocol Scopes</div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-red-600">
                      {((result.scope1 || 0) / 1000).toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Scope 1</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-orange-600">
                      {((result.scope2 || 0) / 1000).toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Scope 2</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-yellow-600">
                      {((result.scope3 || 0) / 1000).toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Scope 3</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Contents */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="font-medium">Report Contents</div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>• Executive summary with total emissions</div>
                  <div>• Detailed breakdown by materials, transport, and energy</div>
                  <div>• GHG Protocol Scope 1, 2, and 3 analysis</div>
                  <div>• Compliance assessment and recommendations</div>
                  <div>• Visual charts and performance metrics</div>
                  <div>• CarbonConstruct branding and certification</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          
          <Button 
            onClick={() => onConfirmExport('csv')}
            variant="outline"
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {isExporting && exportType === 'csv' ? 'Exporting...' : 'Export CSV'}
          </Button>
          
          <Button 
            onClick={() => onConfirmExport('pdf')}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {isExporting && exportType === 'pdf' ? 'Exporting...' : 'Export PDF Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};