
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, RefreshCw, WifiOff, X } from 'lucide-react';
import { ComplianceData } from '../types';
import { useIsMobile } from '@/hooks/use-mobile';

interface ComplianceAnalysisSectionProps {
  nccData?: ComplianceData;
  nabersData?: ComplianceData;
  nccAnalysis: string | null;
  nabersAnalysis: string | null;
  isAnalyzing: boolean;
  isOffline?: boolean;
}

const ComplianceAnalysisSection: React.FC<ComplianceAnalysisSectionProps> = ({
  nccData,
  nabersData,
  nccAnalysis,
  nabersAnalysis,
  isAnalyzing,
  isOffline = false
}) => {
  const { isMobile } = useIsMobile();

  const renderAnalysisSection = (
    title: string,
    analysis: string | null,
    compliant?: boolean,
    badgeText?: string
  ) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{title}</h3>
        <Badge 
          variant={compliant ? "default" : (isOffline ? "outline" : "destructive")}
          className="flex items-center text-xs"
        >
          {isOffline ? (
            <>
              <WifiOff className={`${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} mr-1`} />
              Offline
            </>
          ) : compliant ? (
            <>
              <Check className={`${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} mr-1`} />
              {badgeText || 'Compliant'}
            </>
          ) : (
            <>
              <X className={`${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} mr-1`} />
              {badgeText || 'Non-Compliant'}
            </>
          )}
        </Badge>
      </div>
      
      {isOffline && (
        <div className={`text-xs sm:text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 sm:p-3 rounded-md border border-amber-100 dark:border-amber-800`}>
          Unable to analyze compliance while offline. Please reconnect to the internet to access AI-powered insights.
        </div>
      )}
      
      {!isOffline && analysis ? (
        <div className="text-xs sm:text-sm text-carbon-700 dark:text-carbon-300 bg-carbon-50 dark:bg-carbon-800 p-2 sm:p-3 rounded-md border border-carbon-100 dark:border-carbon-700">
          {analysis}
        </div>
      ) : !isOffline && isAnalyzing ? (
        <div className={`h-16 sm:h-24 flex items-center justify-center text-xs sm:text-sm text-muted-foreground`}>
          <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
          Analyzing {title} compliance...
        </div>
      ) : !isOffline && (
        <div className="text-xs sm:text-sm text-muted-foreground italic">
          Click "Analyze" to get AI insights on {title} compliance
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* NCC 2025 Analysis */}
      {renderAnalysisSection(
        'NCC 2025',
        nccAnalysis,
        nccData?.compliant,
        nccData?.compliant ? 'Compliant' : 'Non-Compliant'
      )}
      
      {/* NABERS Analysis */}
      {renderAnalysisSection(
        'NABERS',
        nabersAnalysis,
        nabersData?.compliant,
        nabersData?.compliant 
          ? `${nabersData?.details?.rating || 0}-Star`
          : 'Below Target'
      )}
    </div>
  );
};

export default ComplianceAnalysisSection;
