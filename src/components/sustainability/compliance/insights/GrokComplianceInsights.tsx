
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain, RefreshCw, AlertCircle } from 'lucide-react';
import { useGrok } from '@/contexts/GrokContext';
import { ComplianceData } from '../types';
import GrokAnalysisStatus from './GrokAnalysisStatus';
import ComplianceAnalysisSection from './ComplianceAnalysisSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSimpleOfflineMode } from '@/hooks/useSimpleOfflineMode';
import { toast } from 'sonner';

interface GrokComplianceInsightsProps {
  nccData?: ComplianceData;
  nabersData?: ComplianceData;
  onGrokAnalysisComplete?: (nccAnalysis: string, nabersAnalysis: string) => void;
  className?: string;
}

const GrokComplianceInsights: React.FC<GrokComplianceInsightsProps> = ({
  nccData,
  nabersData,
  onGrokAnalysisComplete,
  className
}) => {
  const { askGrok, isConfigured, isProcessing } = useGrok();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [nccAnalysis, setNccAnalysis] = useState<string | null>(nccData?.grokAnalysis || null);
  const [nabersAnalysis, setNabersAnalysis] = useState<string | null>(nabersData?.grokAnalysis || null);
  const [error, setError] = useState<string | null>(null);
  const [backgroundProcessing, setBackgroundProcessing] = useState(false);
  const { isMobile } = useIsMobile();
  const { isOffline } = useSimpleOfflineMode();
  
  // Check if we have both compliance data sets
  const hasComplianceData = nccData && nabersData && 
    (typeof nccData.compliant !== 'undefined' || typeof nabersData.compliant !== 'undefined');
  
  // Auto-analyze when compliance data becomes available
  useEffect(() => {
    if (hasComplianceData && isConfigured && !isOffline && !nccAnalysis && !nabersAnalysis) {
      // Start background analysis automatically
      setBackgroundProcessing(true);
      analyzeComplianceData(true);
    }
  }, [hasComplianceData, isConfigured, isOffline]);
  
  // Function to analyze compliance data with Grok
  const analyzeComplianceData = async (isBackground = false) => {
    if (!hasComplianceData || !isConfigured || isProcessing || isOffline) {
      if (isOffline) {
        setError("You're currently offline. Please reconnect to use Grok AI services.");
        toast.error("Offline - cannot analyze compliance data");
      }
      return;
    }
    
    if (!isBackground) {
      setIsAnalyzing(true);
    }
    setError(null);
    
    try {
      // Create a structured context for Grok to analyze
      const complianceContext = {
        ncc: {
          compliant: nccData?.compliant,
          score: nccData?.score,
          details: nccData?.details
        },
        nabers: {
          compliant: nabersData?.compliant,
          score: nabersData?.score,
          rating: nabersData?.details?.rating,
          details: nabersData?.details
        }
      };
      
      await processComplianceAnalysis(complianceContext, isBackground);
      
    } catch (error) {
      const errorMessage = "Failed to analyze compliance data. Please check your connection and try again.";
      setError(errorMessage);
      console.error("Grok compliance analysis error:", error);
      
      if (!isBackground) {
        toast.error("Analysis failed - please try again");
      }
    } finally {
      setIsAnalyzing(false);
      setBackgroundProcessing(false);
    }
  };

  // Process both NCC and NABERS compliance analysis
  const processComplianceAnalysis = async (complianceContext: any, isBackground = false) => {
    try {
      // Analyze NCC compliance
      const nccResponse = await askGrok(
        "Analyze this NCC 2025 compliance data and provide insights on compliance issues, suggest improvements, and explain implications. Focus on practical suggestions that would help improve compliance.", 
        { compliance: complianceContext.ncc, type: 'NCC 2025' },
        'compliance_check'
      );
      
      if (nccResponse.error) {
        throw new Error(nccResponse.error);
      }
      
      // Analyze NABERS compliance
      const nabersResponse = await askGrok(
        "Analyze this NABERS compliance data and provide insights on the rating, suggest improvements to achieve higher ratings, and explain implications. Focus on practical energy efficiency measures.", 
        { compliance: complianceContext.nabers, type: 'NABERS' },
        'compliance_check'
      );
      
      if (nabersResponse.error) {
        throw new Error(nabersResponse.error);
      }
      
      // Store the analysis results
      const nccInsights = nccResponse.text || nccResponse.response;
      const nabersInsights = nabersResponse.text || nabersResponse.response;
      
      setNccAnalysis(nccInsights);
      setNabersAnalysis(nabersInsights);
      
      // Notify parent component of completion
      if (onGrokAnalysisComplete) {
        onGrokAnalysisComplete(nccInsights, nabersInsights);
      }
      
      if (!isBackground) {
        toast.success("Compliance analysis completed successfully");
      }
      
    } catch (error) {
      setError("Analysis failed. Please try again.");
      console.error("Error starting analysis:", error);
      
      if (!isBackground) {
        toast.error("Failed to complete compliance analysis");
      }
    }
  };
  
  if (!hasComplianceData) {
    return null;
  }
  
  return (
    <Card className={`mt-3 sm:mt-4 ${className}`}>
      <CardHeader className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-start sm:items-center ${isMobile ? 'space-y-2 pb-2' : 'justify-between pb-4'}`}>
        <div>
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Brain className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-carbon-600" />
            AI Compliance Insights
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            AI-powered analysis and recommendations for improving compliance
          </CardDescription>
        </div>
        {isConfigured && !isOffline && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => analyzeComplianceData(false)}
            disabled={isAnalyzing || isProcessing || backgroundProcessing}
            className={isMobile ? "w-full mt-2" : ""}
          >
            {isAnalyzing || backgroundProcessing ? (
              <>
                <RefreshCw className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                {backgroundProcessing ? "Processing..." : "Analyzing..."}
              </>
            ) : (
              <>
                <Brain className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                {nccAnalysis || nabersAnalysis ? "Refresh Analysis" : "Analyze"}
              </>
            )}
          </Button>
        )}
      </CardHeader>

      <CardContent className={isMobile ? "px-4" : ""}>
        <GrokAnalysisStatus 
          isConfigured={isConfigured}
          isOffline={isOffline}
          error={error}
          isAnalyzing={isAnalyzing || backgroundProcessing}
          hasAnalysis={!!(nccAnalysis || nabersAnalysis)}
        />
        
        <ComplianceAnalysisSection 
          nccData={nccData}
          nabersData={nabersData}
          nccAnalysis={nccAnalysis}
          nabersAnalysis={nabersAnalysis}
          isAnalyzing={isAnalyzing || backgroundProcessing}
        />
        
        {backgroundProcessing && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              AI is analyzing your compliance data in the background...
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GrokComplianceInsights;
