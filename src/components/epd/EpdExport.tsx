import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EPDStage } from '@/types/epd';

type StageEmissions = {
  A1?: number; A2?: number; A3?: number; A4?: number; A5?: number;
  B1?: number; B2?: number; B3?: number; B4?: number; B5?: number;
  B6?: number; B7?: number; C1?: number; C2?: number; C3?: number;
  C4?: number; D?: number;
};

interface EpdData {
  product_name: string;
  manufacturer_name: string;
  functional_unit: string;
  product_description: string;
  stages: StageEmissions;
  total_co2e: number;
  gwp_fossil: number;
  gwp_biogenic: number;
  gwp_total: number;
  status: string;
  verification_status: string;
  created_at: string;
  version_number: number;
  data_sources: string[];
}

interface EpdExportProps {
  data: EpdData;
  className?: string;
}

export const EpdExport: React.FC<EpdExportProps> = ({ data, className = "" }) => {
  const getStageDescription = (stage: string): string => {
    const descriptions: Record<string, string> = {
      A1: 'Raw material supply',
      A2: 'Transport to manufacturer',
      A3: 'Manufacturing',
      A4: 'Transport to construction site',
      A5: 'Installation process',
      B1: 'Use',
      B2: 'Maintenance',
      B3: 'Repair',
      B4: 'Replacement',
      B5: 'Refurbishment',
      B6: 'Operational energy use',
      B7: 'Operational water use',
      C1: 'Deconstruction/demolition',
      C2: 'Transport to waste processing',
      C3: 'Waste processing',
      C4: 'Final disposal',
      D: 'Benefits beyond system boundary'
    };
    return descriptions[stage] || stage;
  };

  const getStageGroup = (stage: string): string => {
    if (['A1', 'A2', 'A3'].includes(stage)) return 'Production';
    if (['A4', 'A5'].includes(stage)) return 'Construction';
    if (['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7'].includes(stage)) return 'Use Phase';
    if (['C1', 'C2', 'C3', 'C4'].includes(stage)) return 'End-of-Life';
    if (stage === 'D') return 'Benefits';
    return 'Other';
  };

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader className="text-center bg-primary/5">
          <CardTitle className="text-2xl font-bold">Environmental Product Declaration</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            In accordance with ISO 14025, EN 15804, and ISO 21930
          </p>
        </CardHeader>
      </Card>

      {/* Product Information */}
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Product Name</p>
              <p className="font-semibold">{data.product_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Manufacturer</p>
              <p className="font-semibold">{data.manufacturer_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Functional Unit</p>
              <p className="font-semibold">{data.functional_unit}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Version</p>
              <p className="font-semibold">v{data.version_number}</p>
            </div>
          </div>
          
          {data.product_description && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
              <p className="text-sm">{data.product_description}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Badge variant="outline">{data.status}</Badge>
            <Badge variant="secondary">{data.verification_status}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impact Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Impact Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-2xl font-bold text-primary">{data.total_co2e.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total CO₂e (kg)</p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{data.gwp_fossil.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">GWP Fossil (kg)</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{data.gwp_biogenic.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">GWP Biogenic (kg)</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{data.gwp_total.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">GWP Total (kg)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lifecycle Emissions */}
      <Card>
        <CardHeader>
          <CardTitle>Lifecycle Stage Emissions (kg CO₂e per {data.functional_unit})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border px-4 py-2 text-left">Stage</th>
                  <th className="border border-border px-4 py-2 text-left">Description</th>
                  <th className="border border-border px-4 py-2 text-left">Group</th>
                  <th className="border border-border px-4 py-2 text-right">Emissions (kg CO₂e)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.stages)
                  .filter(([_, value]) => value !== undefined && value !== null)
                  .map(([stage, value]) => (
                    <tr key={stage} className="hover:bg-muted/20">
                      <td className="border border-border px-4 py-2 font-mono font-semibold">{stage}</td>
                      <td className="border border-border px-4 py-2 text-sm">{getStageDescription(stage)}</td>
                      <td className="border border-border px-4 py-2">
                        <Badge variant="outline" className="text-xs">
                          {getStageGroup(stage)}
                        </Badge>
                      </td>
                      <td className="border border-border px-4 py-2 text-right font-mono">
                        {value!.toFixed(3)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources & Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.data_sources.map((source, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">{source}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Notice */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-amber-800 dark:text-amber-200">
              Important Notice - Verification Status
            </p>
            <p className="text-amber-700 dark:text-amber-300">
              This EPD has been automatically generated by the CarbonConstruct platform and is marked as 
              "{data.verification_status}". For official compliance purposes, third-party verification 
              by a qualified LCA consultant may be required.
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-4">
              Generated on: {new Date(data.created_at).toLocaleString()} | 
              Standards: ISO 14025, EN 15804, ISO 21930 | 
              Platform: CarbonConstruct EPD Generator
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};