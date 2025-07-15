
import { MaterialInput, EnergyInput } from '@/lib/carbonExports';
import { supabase } from '@/integrations/supabase/client';

export interface ComplianceRule {
  id: string;
  standard: 'NCC2025' | 'NABERS';
  category: string;
  condition: (value: any) => boolean;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  remediation: string;
}

export interface ComplianceResult {
  compliant: boolean;
  score: number;
  violations: Array<{
    rule: ComplianceRule;
    materialId?: string;
    value: any;
    impact: 'high' | 'medium' | 'low';
  }>;
  recommendations: string[];
}

export interface DetailedComplianceReport {
  ncc: ComplianceResult;
  nabers: ComplianceResult;
  overall: {
    compliant: boolean;
    score: number;
    summary: string;
  };
  timestamp: string;
}

class ComplianceEngine {
  private nccRules: ComplianceRule[] = [
    {
      id: 'ncc-thermal-performance',
      standard: 'NCC2025',
      category: 'Section J',
      condition: (materials: MaterialInput[]) => 
        materials.some(m => m.type?.toLowerCase().includes('insulation')),
      severity: 'critical',
      message: 'Thermal performance requirements not met',
      remediation: 'Add appropriate insulation materials to meet NCC Section J requirements'
    },
    {
      id: 'ncc-glazing-standards',
      standard: 'NCC2025',
      category: 'Section J',
      condition: (materials: MaterialInput[]) => {
        const windows = materials.filter(m => 
          m.type?.toLowerCase().includes('window') || 
          m.type?.toLowerCase().includes('glazing')
        );
        return windows.length === 0 || windows.some(w => (w.carbonFootprint || 0) < 50);
      },
      severity: 'warning',
      message: 'Glazing may not meet energy efficiency standards',
      remediation: 'Consider upgrading to double-glazed or low-E windows'
    },
    {
      id: 'ncc-material-sustainability',
      standard: 'NCC2025',
      category: 'Section F8',
      condition: (materials: MaterialInput[]) => {
        const totalCarbonFootprint = materials.reduce((sum, m) => sum + (m.carbonFootprint || 0), 0);
        return totalCarbonFootprint / materials.length < 30;
      },
      severity: 'warning',
      message: 'Materials may exceed carbon intensity thresholds',
      remediation: 'Replace high-carbon materials with sustainable alternatives'
    }
  ];

  private nabersRules: ComplianceRule[] = [
    {
      id: 'nabers-energy-efficiency',
      standard: 'NABERS',
      category: 'Energy',
      condition: (energy: EnergyInput[]) => 
        energy.some(e => e.type?.toLowerCase().includes('renewable')),
      severity: 'critical',
      message: 'No renewable energy sources detected',
      remediation: 'Integrate solar panels or other renewable energy systems'
    },
    {
      id: 'nabers-energy-consumption',
      standard: 'NABERS',
      category: 'Energy',
      condition: (energy: EnergyInput[]) => {
        const totalConsumption = energy.reduce((sum, e) => sum + (e.amount || 0), 0);
        return totalConsumption < 150; // kWh/m²/year threshold
      },
      severity: 'warning',
      message: 'Energy consumption may exceed NABERS targets',
      remediation: 'Implement energy-efficient systems and building controls'
    }
  ];

  public async checkCompliance(
    materials: MaterialInput[],
    energy: EnergyInput[]
  ): Promise<DetailedComplianceReport> {
    console.log('Running automated compliance checks...');

    const nccResult = this.evaluateNCC(materials);
    const nabersResult = this.evaluateNABERS(energy);

    const overallScore = Math.round((nccResult.score + nabersResult.score) / 2);
    const overallCompliant = nccResult.compliant && nabersResult.compliant;

    return {
      ncc: nccResult,
      nabers: nabersResult,
      overall: {
        compliant: overallCompliant,
        score: overallScore,
        summary: this.generateSummary(nccResult, nabersResult)
      },
      timestamp: new Date().toISOString()
    };
  }

  private evaluateNCC(materials: MaterialInput[]): ComplianceResult {
    const violations: any[] = [];
    let passedRules = 0;

    for (const rule of this.nccRules) {
      try {
        const complies = rule.condition(materials);
        if (!complies) {
          violations.push({
            rule,
            value: materials,
            impact: this.determineImpact(rule.severity)
          });
        } else {
          passedRules++;
        }
      } catch (error) {
        console.warn(`Error evaluating rule ${rule.id}:`, error);
      }
    }

    const score = Math.round((passedRules / this.nccRules.length) * 100);
    const compliant = violations.filter(v => v.rule.severity === 'critical').length === 0;

    return {
      compliant,
      score,
      violations,
      recommendations: this.generateNCCRecommendations(violations)
    };
  }

  private evaluateNABERS(energy: EnergyInput[]): ComplianceResult {
    const violations: any[] = [];
    let passedRules = 0;

    for (const rule of this.nabersRules) {
      try {
        const complies = rule.condition(energy);
        if (!complies) {
          violations.push({
            rule,
            value: energy,
            impact: this.determineImpact(rule.severity)
          });
        } else {
          passedRules++;
        }
      } catch (error) {
        console.warn(`Error evaluating rule ${rule.id}:`, error);
      }
    }

    const score = energy.length > 0 ? Math.round((passedRules / this.nabersRules.length) * 100) : 0;
    const compliant = violations.filter(v => v.rule.severity === 'critical').length === 0;

    // Calculate NABERS star rating (0-5 stars)
    const starRating = Math.min(5, Math.max(0, Math.round(score / 20)));

    return {
      compliant: starRating >= 4,
      score: starRating,
      violations,
      recommendations: this.generateNABERSRecommendations(violations, energy)
    };
  }

  private determineImpact(severity: string): 'high' | 'medium' | 'low' {
    switch (severity) {
      case 'critical': return 'high';
      case 'warning': return 'medium';
      default: return 'low';
    }
  }

  private generateNCCRecommendations(violations: any[]): string[] {
    const recommendations = violations.map(v => v.rule.remediation);
    
    if (recommendations.length === 0) {
      recommendations.push('All NCC 2025 requirements appear to be met');
    }

    return [...new Set(recommendations)];
  }

  private generateNABERSRecommendations(violations: any[], energy: EnergyInput[]): string[] {
    const recommendations = violations.map(v => v.rule.remediation);
    
    if (energy.length === 0) {
      recommendations.push('Add energy consumption data to calculate NABERS rating');
    }

    if (recommendations.length === 0) {
      recommendations.push('Consider additional energy efficiency measures to achieve higher NABERS rating');
    }

    return [...new Set(recommendations)];
  }

  private generateSummary(nccResult: ComplianceResult, nabersResult: ComplianceResult): string {
    const nccStatus = nccResult.compliant ? 'compliant' : 'non-compliant';
    const nabersRating = `${nabersResult.score}-star`;
    
    return `Project is ${nccStatus} with NCC 2025 and achieves ${nabersRating} NABERS rating`;
  }

  // Remove compliance history methods since the column doesn't exist
  // These would need to be implemented if we add a compliance_history column to projects table
  public async getComplianceHistory(projectId: string): Promise<DetailedComplianceReport[]> {
    console.log('Compliance history feature not yet implemented');
    return [];
  }

  public async saveComplianceReport(projectId: string, report: DetailedComplianceReport): Promise<void> {
    console.log('Compliance report saving feature not yet implemented');
    // This would need to be implemented if we add a compliance_history column to projects table
  }
}

export const complianceEngine = new ComplianceEngine();
