
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { CalculationResult } from "@/lib/carbonExports";

interface AreasOfConcernProps {
  calculationResult: CalculationResult;
}

export const AreasOfConcern: React.FC<AreasOfConcernProps> = ({ calculationResult }) => {
  const highCarbonAreas = [];
  
  // Lower thresholds for more realistic feedback (in kg CO2e)
  const MATERIAL_THRESHOLD = 1000; // 1 tonne CO2e
  const TRANSPORT_THRESHOLD = 500;  // 500 kg CO2e  
  const ENERGY_THRESHOLD = 1000;    // 1 tonne CO2e
  
  // Check for high material emissions
  if ((calculationResult.materialEmissions || 0) > MATERIAL_THRESHOLD) {
    highCarbonAreas.push({
      title: "High Material Emissions",
      description: `Your material emissions (${Math.round(calculationResult.materialEmissions || 0)} kg CO2e) are significant. Consider alternative materials with lower carbon footprints such as recycled content, bio-based materials, or locally sourced options.`,
      severity: "high"
    });
  }
  
  // Check for high transport emissions
  if ((calculationResult.transportEmissions || 0) > TRANSPORT_THRESHOLD) {
    highCarbonAreas.push({
      title: "High Transport Emissions", 
      description: `Your transport emissions (${Math.round(calculationResult.transportEmissions || 0)} kg CO2e) could be reduced. Source materials locally, consolidate shipments, or use lower-carbon transport methods like rail or sea freight.`,
      severity: "medium"
    });
  }
  
  // Check for high energy emissions
  if ((calculationResult.energyEmissions || 0) > ENERGY_THRESHOLD) {
    highCarbonAreas.push({
      title: "High Energy Consumption",
      description: `Energy usage (${Math.round(calculationResult.energyEmissions || 0)} kg CO2e) is a concern. Consider renewable alternatives, more efficient equipment, and energy management systems.`,
      severity: "high"
    });
  }

  // Check overall emissions intensity
  const totalEmissions = calculationResult.totalEmissions || 0;
  if (totalEmissions > 3000) {
    highCarbonAreas.push({
      title: "Overall Carbon Intensity",
      description: `Total project emissions (${Math.round(totalEmissions)} kg CO2e) are above average. Consider a holistic approach to carbon reduction across all project phases.`,
      severity: "critical"
    });
  }

  // Sort by severity
  const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
  highCarbonAreas.sort((a, b) => (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
          Areas of Concern
        </CardTitle>
      </CardHeader>
      <CardContent>
        {highCarbonAreas.length > 0 ? (
          <div className="space-y-4">
            {highCarbonAreas.map((area, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  area.severity === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                  area.severity === 'high' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
                  'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                }`}
              >
                <h3 className={`font-medium mb-1 ${
                  area.severity === 'critical' ? 'text-red-800 dark:text-red-400' :
                  area.severity === 'high' ? 'text-amber-800 dark:text-amber-400' :
                  'text-yellow-800 dark:text-yellow-400'
                }`}>
                  {area.title}
                  {area.severity === 'critical' && <span className="ml-2 text-xs font-bold">(CRITICAL)</span>}
                </h3>
                <p className={`text-sm ${
                  area.severity === 'critical' ? 'text-red-700 dark:text-red-300' :
                  area.severity === 'high' ? 'text-amber-700 dark:text-amber-300' :
                  'text-yellow-700 dark:text-yellow-300'
                }`}>
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-green-700 dark:text-green-300 font-medium">No significant areas of concern detected!</p>
            <p className="text-sm mt-2 text-muted-foreground">
              Your project shows good environmental performance. Continue monitoring as your project progresses and consider further optimization opportunities.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
