import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Download,
  Zap,
  Shield,
  Smartphone
} from 'lucide-react';
import { validateProductionReadiness, generateProductionReport } from '@/utils/productionValidation';

export const ProductionReadinessCheck: React.FC = () => {
  const [validation, setValidation] = useState(validateProductionReadiness());
  const [reportGenerated, setReportGenerated] = useState(false);

  useEffect(() => {
    setValidation(validateProductionReadiness());
  }, []);

  const downloadReport = () => {
    const report = generateProductionReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carbonConstruct-production-report-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setReportGenerated(true);
  };

  const getStatusBadge = () => {
    if (validation.isValid) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Production Ready</Badge>;
    }
    if (validation.errors.length > 0) {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Issues Detected</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Warnings Present</Badge>;
  };

  const getStatusIcon = () => {
    if (validation.isValid) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (validation.errors.length > 0) {
      return <XCircle className="h-5 w-5 text-red-600" />;
    }
    return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Production Readiness
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Production Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div>
              <div className="text-sm font-medium">PDF Export</div>
              <div className="text-xs text-muted-foreground">Professional branding</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Zap className="h-4 w-4 text-blue-600" />
            <div>
              <div className="text-sm font-medium">Claude AI</div>
              <div className="text-xs text-muted-foreground">Contextual advice</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
            <Smartphone className="h-4 w-4 text-purple-600" />
            <div>
              <div className="text-sm font-medium">Mobile Ready</div>
              <div className="text-xs text-muted-foreground">Responsive design</div>
            </div>
          </div>
        </div>

        {/* Validation Messages */}
        {validation.errors.length > 0 && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-1">Critical Issues:</div>
              <ul className="list-disc list-inside text-sm">
                {validation.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {validation.warnings.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-1">Warnings:</div>
              <ul className="list-disc list-inside text-sm">
                {validation.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {validation.recommendations.length > 0 && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-1">Recommendations:</div>
              <ul className="list-disc list-inside text-sm">
                {validation.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Demo Readiness */}
        {validation.isValid && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="font-medium text-green-800">
                🚀 Ready for Verifier Demos!
              </div>
            </div>
            <p className="text-sm text-green-700 mb-3">
              CarbonConstruct is production-ready with professional PDF exports, 
              AI-powered insights, and comprehensive compliance scoring.
            </p>
            <Button 
              onClick={downloadReport}
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {reportGenerated ? 'Report Downloaded' : 'Download Production Report'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};