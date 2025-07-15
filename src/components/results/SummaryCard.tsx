
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Leaf, AlertTriangle } from "lucide-react";
import { CalculationResult } from "@/lib/carbonCalculations";
import ScopeBadge, { EmissionScope } from "@/components/ui/scope-badge";
import EmbodiedCarbonClassifier from "@/components/ui/embodied-carbon-classifier";
import ComplianceFlag from "@/components/ui/compliance-flag";

interface SummaryCardProps {
  result: CalculationResult;
  scopeBreakdown?: {
    scope1: number;
    scope2: number; 
    scope3: number;
  };
  complianceStatus?: {
    ncc2025: 'compliant' | 'warning' | 'breach';
    nabers: 'compliant' | 'warning' | 'breach';
    greenstar: 'compliant' | 'warning' | 'breach';
  };
}

const SummaryCard = ({ result, scopeBreakdown, complianceStatus }: SummaryCardProps) => {
  // Calculate emission intensity category
  let intensityCategory = 'moderate';
  const emissionsPerUnit = result.totalEmissions;
  
  if (emissionsPerUnit < 100) {
    intensityCategory = 'low';
  } else if (emissionsPerUnit > 500) {
    intensityCategory = 'high';
  }

  // Calculate average carbon intensity for EC classification
  const averageCarbonIntensity = emissionsPerUnit / 1000; // Convert to reasonable scale for classification

  return (
    <Card className="border-carbon-200">
      <CardHeader>
        <CardTitle>Total Carbon Footprint</CardTitle>
        <CardDescription>
          The overall environmental impact of your project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Emissions with Scope Badges */}
        <div className="text-center space-y-3">
          <div>
            <span className="text-5xl font-bold text-carbon-600">
              {result.totalEmissions.toFixed(2)}
            </span>
            <span className="text-lg ml-2">kg CO2e</span>
          </div>
          
          {/* Embodied Carbon Classification */}
          <div className="flex justify-center">
            <EmbodiedCarbonClassifier 
              carbonIntensity={averageCarbonIntensity}
              size="lg"
            />
          </div>

          {/* Scope Breakdown */}
          {scopeBreakdown && (
            <div className="flex justify-center gap-2 flex-wrap">
              <ScopeBadge scope="scope1" size="sm" />
              <ScopeBadge scope="scope2" size="sm" />
              <ScopeBadge scope="scope3" size="sm" />
            </div>
          )}
        </div>

        {/* Scope Emissions Breakdown */}
        {scopeBreakdown && (
          <div className="space-y-3">
            <div className="text-sm font-medium">Emission Scopes Breakdown</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-red-50 rounded-lg">
                <ScopeBadge scope="scope1" size="sm" showTooltip={false} />
                <div className="text-lg font-semibold mt-1">{scopeBreakdown.scope1.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">kg CO₂e</div>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded-lg">
                <ScopeBadge scope="scope2" size="sm" showTooltip={false} />
                <div className="text-lg font-semibold mt-1">{scopeBreakdown.scope2.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">kg CO₂e</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <ScopeBadge scope="scope3" size="sm" showTooltip={false} />
                <div className="text-lg font-semibold mt-1">{scopeBreakdown.scope3.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">kg CO₂e</div>
              </div>
            </div>
          </div>
        )}

        {/* Compliance Status Flags */}
        {complianceStatus && (
          <div className="space-y-3">
            <div className="text-sm font-medium">Regulatory Compliance</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <ComplianceFlag 
                standard="ncc2025" 
                status={complianceStatus.ncc2025}
                variant="alert"
                size="sm"
              />
              <ComplianceFlag 
                standard="nabers" 
                status={complianceStatus.nabers}
                variant="alert"
                size="sm"
              />
              <ComplianceFlag 
                standard="greenstar" 
                status={complianceStatus.greenstar}
                variant="alert"
                size="sm"
              />
            </div>
          </div>
        )}
        
        <Alert className={
          intensityCategory === 'low' 
            ? "border-carbon-500 bg-carbon-50 text-carbon-800" 
            : intensityCategory === 'high'
              ? "border-red-500 bg-red-50 text-red-800"
              : "border-yellow-500 bg-yellow-50 text-yellow-800"
        }>
          <div className="flex items-center gap-2">
            {intensityCategory === 'low' ? (
              <Leaf className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertTitle className="font-medium">
              {intensityCategory === 'low' 
                ? 'Low Carbon Intensity' 
                : intensityCategory === 'high'
                  ? 'High Carbon Intensity'
                  : 'Moderate Carbon Intensity'
              }
            </AlertTitle>
          </div>
          <AlertDescription className="mt-2 text-sm">
            {intensityCategory === 'low' 
              ? 'Great job! Your project has relatively low carbon emissions. Continue these sustainable practices in future projects.'
              : intensityCategory === 'high'
                ? 'Your project has a significant carbon footprint. Consider implementing the suggested improvements to reduce emissions.'
                : 'Your project has a moderate carbon footprint. There is room for improvement - check the suggestions below.'
            }
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
