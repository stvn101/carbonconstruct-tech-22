
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, CheckCircle, AlertTriangle, XCircle, TrendingUp } from 'lucide-react';
import { MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonExports";
import { ComplianceData } from "../compliance/types";
import MobileComplianceCard from "../mobile/MobileComplianceCard";
import GrokComplianceInsights from "../compliance/insights/GrokComplianceInsights";
import { useIsMobile } from "@/hooks/use-mobile";
import { useOfflineMode } from "@/hooks/useOfflineMode";
import { enhancedComplianceService } from "@/services/compliance/EnhancedComplianceService";
import { DetailedComplianceReport } from "@/services/compliance/ComplianceEngine";
import { toast } from "sonner";

interface ComplianceTabContentProps {
  nccData?: ComplianceData;
  nabersData?: ComplianceData;
  materials?: MaterialInput[];
  transport?: TransportInput[];
  energy?: EnergyInput[];
  onRunCheck: () => void;
  isLoading: boolean;
}

const ComplianceTabContent: React.FC<ComplianceTabContentProps> = ({
  nccData,
  nabersData,
  materials = [],
  transport = [],
  energy = [],
  onRunCheck,
  isLoading
}) => {
  const { isMobile } = useIsMobile();
  const { isOfflineMode } = useOfflineMode();
  const [enhancedReport, setEnhancedReport] = useState<DetailedComplianceReport | null>(null);
  const [isEnhancedLoading, setIsEnhancedLoading] = useState(false);

  // Memoize expensive calculations
  const hasEnoughData = useMemo(() => materials.length > 0, [materials.length]);
  const canRunCheck = useMemo(() => 
    !isLoading && !isOfflineMode && hasEnoughData, 
    [isLoading, isOfflineMode, hasEnoughData]
  );

  // Debounced enhanced compliance check
  const runEnhancedComplianceCheck = useCallback(async () => {
    if (!hasEnoughData || isOfflineMode) return;
    
    setIsEnhancedLoading(true);
    try {
      const report = await enhancedComplianceService.performComprehensiveCheck(
        materials,
        energy,
        { includeAIAnalysis: true, realTimeValidation: true }
      );
      setEnhancedReport(report);
    } catch (error) {
      console.error('Enhanced compliance check failed:', error);
      if (!isOfflineMode) {
        toast.error('Failed to run enhanced compliance check');
      }
    } finally {
      setIsEnhancedLoading(false);
    }
  }, [materials, energy, hasEnoughData, isOfflineMode]);

  // Auto-run enhanced compliance check when materials change (debounced)
  useEffect(() => {
    if (!hasEnoughData) return;
    
    const timer = setTimeout(() => {
      runEnhancedComplianceCheck();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timer);
  }, [materials, energy, runEnhancedComplianceCheck, hasEnoughData]);

  const getComplianceIcon = useCallback((compliant: boolean) => {
    return compliant ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  }, []);

  const getScoreColor = useCallback((score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  }, []);

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <h3 className="text-lg font-medium">Compliance Status</h3>
          <Button 
            onClick={onRunCheck} 
            disabled={!canRunCheck}
            size="sm"
            className="touch-target w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-3 w-3" />
                Check Compliance
              </>
            )}
          </Button>
        </div>

        {isOfflineMode && (
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                You're offline. Compliance checks will be available when you reconnect.
              </p>
            </CardContent>
          </Card>
        )}
        
        {enhancedReport && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Enhanced Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Overall Score</span>
                <Badge variant="outline" className={getScoreColor(enhancedReport.overall.score)}>
                  {enhancedReport.overall.score}/100
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{enhancedReport.overall.summary}</p>
            </CardContent>
          </Card>
        )}
        
        <div className="space-y-3">
          <MobileComplianceCard title="NCC 2025" data={nccData} />
          <MobileComplianceCard title="NABERS" data={nabersData} />
        </div>
        
        <GrokComplianceInsights
          nccData={nccData}
          nabersData={nabersData}
          className="mt-4"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <h3 className="text-xl font-medium">Compliance Analysis</h3>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button 
            onClick={runEnhancedComplianceCheck}
            disabled={isEnhancedLoading || !canRunCheck}
            variant="outline"
            size="sm"
            className="touch-target"
          >
            {isEnhancedLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Enhanced Check
              </>
            )}
          </Button>
          <Button 
            onClick={onRunCheck} 
            disabled={!canRunCheck}
            className="touch-target"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking Compliance...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Run Compliance Check
              </>
            )}
          </Button>
        </div>
      </div>

      {isOfflineMode && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              You're offline. Compliance checks will be available when you reconnect.
            </p>
          </CardContent>
        </Card>
      )}

      {enhancedReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-carbon-600" />
              Enhanced Compliance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(enhancedReport.overall.score)}`}>
                  {enhancedReport.overall.score}/100
                </div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(enhancedReport.ncc.score)}`}>
                  {enhancedReport.ncc.score}/100
                </div>
                <div className="text-sm text-muted-foreground">NCC 2025</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(enhancedReport.nabers.score * 20)}`}>
                  {enhancedReport.nabers.score} Stars
                </div>
                <div className="text-sm text-muted-foreground">NABERS Rating</div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Compliance Status</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getComplianceIcon(enhancedReport.ncc.compliant)}
                  <span className="text-sm">NCC 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  {getComplianceIcon(enhancedReport.nabers.compliant)}
                  <span className="text-sm">NABERS</span>
                </div>
              </div>
            </div>

            {(enhancedReport.ncc.violations.length > 0 || enhancedReport.nabers.violations.length > 0) && (
              <div className="mb-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1 text-yellow-600" />
                  Issues Found
                </h4>
                <div className="space-y-2">
                  {[...enhancedReport.ncc.violations, ...enhancedReport.nabers.violations].map((violation, index) => (
                    <div key={index} className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400">
                      <div className="text-sm font-medium">{violation.rule.message}</div>
                      <div className="text-xs text-muted-foreground mt-1">{violation.rule.remediation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground">{enhancedReport.overall.summary}</p>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>NCC 2025 Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            {nccData ? (
              <div className="space-y-3">
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  nccData.compliant 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {nccData.compliant ? 'Compliant' : 'Non-Compliant'}
                </div>
                <p className="text-sm text-muted-foreground">
                  Score: {nccData.score}/100
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Run a compliance check to see results
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>NABERS Rating</CardTitle>
          </CardHeader>
          <CardContent>
            {nabersData ? (
              <div className="space-y-3">
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  nabersData.compliant 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {nabersData.details?.rating || 0} Stars
                </div>
                <p className="text-sm text-muted-foreground">
                  Rating: {nabersData.score}/5
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Run a compliance check to see rating
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <GrokComplianceInsights
        nccData={nccData}
        nabersData={nabersData}
      />
    </div>
  );
};

export default ComplianceTabContent;
