
import { MaterialInput, EnergyInput } from '@/lib/carbonExports';
import { complianceEngine, DetailedComplianceReport } from './ComplianceEngine';
import { fetchNccComplianceCheck, fetchNabersComplianceCheck } from '@/hooks/sustainability/sustainabilityService';

export interface EnhancedComplianceOptions {
  includeAIAnalysis?: boolean;
  saveToHistory?: boolean;
  projectId?: string;
  realTimeValidation?: boolean;
}

export class EnhancedComplianceService {
  public async performComprehensiveCheck(
    materials: MaterialInput[],
    energy: EnergyInput[],
    options: EnhancedComplianceOptions = {}
  ): Promise<DetailedComplianceReport> {
    console.log('Performing comprehensive compliance check...');

    // Run automated rule-based compliance check
    const automatedReport = await complianceEngine.checkCompliance(materials, energy);

    // Enhance with existing service data if available
    if (materials.length > 0) {
      try {
        const nccCheck = await fetchNccComplianceCheck(materials, { includeDetails: true });
        if (nccCheck && !nccCheck.error) {
          automatedReport.ncc.score = Math.max(automatedReport.ncc.score, nccCheck.score || 0);
          automatedReport.ncc.compliant = automatedReport.ncc.compliant && nccCheck.compliant;
        }
      } catch (error) {
        console.warn('Failed to fetch NCC compliance check:', error);
      }
    }

    if (energy.length > 0) {
      try {
        const nabersCheck = await fetchNabersComplianceCheck(energy, { targetRating: 4 });
        if (nabersCheck && !nabersCheck.error) {
          automatedReport.nabers.score = Math.max(automatedReport.nabers.score, nabersCheck.rating || 0);
          automatedReport.nabers.compliant = automatedReport.nabers.compliant && nabersCheck.compliant;
        }
      } catch (error) {
        console.warn('Failed to fetch NABERS compliance check:', error);
      }
    }

    // Save to history if requested
    if (options.saveToHistory && options.projectId) {
      await complianceEngine.saveComplianceReport(options.projectId, automatedReport);
    }

    return automatedReport;
  }

  public validateMaterialInRealTime(material: MaterialInput): {
    isCompliant: boolean;
    warnings: string[];
    suggestions: string[];
  } {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check carbon footprint
    if ((material.carbonFootprint || 0) > 50) {
      warnings.push('High carbon footprint material detected');
      suggestions.push('Consider low-carbon alternatives');
    }

    // Check for sustainable properties
    if (!material.type?.toLowerCase().includes('recycled') && 
        !material.type?.toLowerCase().includes('sustainable')) {
      suggestions.push('Look for recycled or sustainable material variants');
    }

    return {
      isCompliant: warnings.length === 0,
      warnings,
      suggestions
    };
  }

  public generateComplianceScore(materials: MaterialInput[], energy: EnergyInput[]): {
    overall: number;
    ncc: number;
    nabers: number;
    breakdown: Record<string, number>;
  } {
    // Calculate material sustainability score
    const materialScore = materials.length > 0 
      ? materials.reduce((sum, m) => sum + Math.min(100, Math.max(0, 100 - (m.carbonFootprint || 0))), 0) / materials.length
      : 0;

    // Calculate energy efficiency score
    const hasRenewable = energy.some(e => e.type?.toLowerCase().includes('renewable'));
    const energyScore = hasRenewable ? 80 : Math.max(0, 50 - (energy.reduce((sum, e) => sum + (e.amount || 0), 0) / 10));

    const nccScore = Math.round(materialScore * 0.7 + energyScore * 0.3);
    const nabersScore = Math.round(energyScore * 0.8 + materialScore * 0.2);
    const overallScore = Math.round((nccScore + nabersScore) / 2);

    return {
      overall: overallScore,
      ncc: nccScore,
      nabers: nabersScore,
      breakdown: {
        materials: materialScore,
        energy: energyScore,
        thermal: materialScore * 0.4,
        renewable: hasRenewable ? 100 : 0
      }
    };
  }
}

export const enhancedComplianceService = new EnhancedComplianceService();
