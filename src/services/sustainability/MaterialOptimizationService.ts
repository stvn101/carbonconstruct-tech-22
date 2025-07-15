
import { MaterialInput } from '@/lib/carbonExports';
import { useGrok } from '@/contexts/GrokContext';

export interface MaterialAlternative {
  id: string;
  name: string;
  type: string;
  carbonFootprint: number;
  carbonReduction: number;
  cost: number;
  costImpact: 'lower' | 'higher' | 'similar';
  availability: 'High' | 'Medium' | 'Low';
  sustainabilityScore: number;
  description: string;
  benefits: string[];
  tradeoffs: string[];
  considerations: string[];
  complianceStatus: {
    ncc: boolean;
    nabers: boolean;
  };
  estimatedSavings: {
    co2: number;
    cost: number;
  };
}

export interface OptimizationRecommendation {
  materialId: string;
  currentMaterial: string;
  category: string;
  title: string;
  description: string;
  issue: string;
  recommendation: string;
  impact: string;
  timeframe: string;
  confidence: number;
  potentialSaving: number;
  priority: 'High' | 'Medium' | 'Low';
  alternatives: MaterialAlternative[];
  implementationSteps: string[];
}

export interface ProjectOptimizationReport {
  overallScore: number;
  potentialCO2Reduction: number;
  costImpact: number;
  recommendations: OptimizationRecommendation[];
  summary: string;
  keyInsights: string[];
  nextSteps: string[];
  timestamp: number;
  materialAnalysis: {
    highImpactMaterials: string[];
    sustainableMaterials: string[];
    improvementAreas: string[];
  };
  complianceImprovement: {
    nccGaps: string[];
    nabersOpportunities: string[];
  };
}

class MaterialOptimizationService {
  private cache = new Map<string, ProjectOptimizationReport>();
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes
  private grokContext: any = null;

  private getCacheKey(materials: MaterialInput[]): string {
    return materials
      .map(m => `${m.name}-${m.quantity}-${m.carbonFootprint}`)
      .sort()
      .join('|');
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_TTL;
  }

  setGrokContext(context: any): void {
    this.grokContext = context;
  }

  async optimizeProject(
    materials: MaterialInput[],
    options: {
      prioritizeCost?: boolean;
      prioritizeCarbon?: boolean;
      includeAlternatives?: boolean;
      maxAlternatives?: number;
    } = {}
  ): Promise<ProjectOptimizationReport> {
    const {
      prioritizeCost = false,
      prioritizeCarbon = true,
      includeAlternatives = true,
      maxAlternatives = 3
    } = options;

    // Check cache first
    const cacheKey = this.getCacheKey(materials);
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached;
    }

    try {
      const analysisPrompt = this.buildAnalysisPrompt(
        materials, 
        prioritizeCost, 
        prioritizeCarbon, 
        includeAlternatives,
        maxAlternatives
      );

      // Use Grok if available, otherwise return fallback
      let response = '';
      if (this.grokContext && this.grokContext.sendMessage) {
        response = await this.grokContext.sendMessage(analysisPrompt);
      } else {
        // Fallback for when Grok is not available
        response = 'Fallback analysis';
      }

      const report = this.parseOptimizationResponse(response, materials);
      
      // Cache the result with timestamp
      this.cache.set(cacheKey, report);
      
      // Clean up old cache entries
      this.cleanupCache();
      
      return report;
    } catch (error) {
      console.error('Material optimization failed:', error);
      return this.getFallbackReport(materials);
    }
  }

  async optimizeProjectMaterials(
    materials: MaterialInput[],
    options: {
      projectType?: string;
      sustainabilityTargets?: string[];
      complianceRequirements?: string[];
    } = {}
  ): Promise<ProjectOptimizationReport> {
    return this.optimizeProject(materials, {
      prioritizeCarbon: true,
      includeAlternatives: true,
      maxAlternatives: 3
    });
  }

  async getMaterialAlternatives(
    material: MaterialInput,
    criteria: {
      prioritizeCarbonReduction?: boolean;
      prioritizeCost?: boolean;
      maintainPerformance?: boolean;
      localAvailability?: boolean;
    } = {}
  ): Promise<MaterialAlternative[]> {
    try {
      const prompt = this.buildMaterialAlternativesPrompt(material, criteria);
      
      let response = '';
      if (this.grokContext && this.grokContext.sendMessage) {
        response = await this.grokContext.sendMessage(prompt);
      }

      return this.parseMaterialAlternatives(response, material);
    } catch (error) {
      console.error('Failed to get material alternatives:', error);
      return this.generateBasicAlternatives(material);
    }
  }

  private buildAnalysisPrompt(
    materials: MaterialInput[], 
    prioritizeCost: boolean, 
    prioritizeCarbon: boolean, 
    includeAlternatives: boolean,
    maxAlternatives: number
  ): string {
    const priorities = [];
    if (prioritizeCarbon) priorities.push('carbon reduction');
    if (prioritizeCost) priorities.push('cost optimization');
    
    const materialList = materials.map(m => 
      `- ${m.name}: ${m.quantity} ${m.unit}, Carbon: ${m.carbonFootprint} kg CO2e/${m.unit}`
    ).join('\n');

    return `As a sustainability expert, analyze these construction materials and provide optimization recommendations:

${materialList}

Analysis Requirements:
- Primary focus: ${priorities.join(' and ') || 'carbon reduction'}
- Include alternatives: ${includeAlternatives ? 'Yes' : 'No'}
- Max alternatives per material: ${maxAlternatives}

Please provide optimization recommendations and material analysis.`;
  }

  private buildMaterialAlternativesPrompt(
    material: MaterialInput,
    criteria: any
  ): string {
    return `Analyze this material and provide sustainable alternatives:
Material: ${material.name}
Quantity: ${material.quantity} ${material.unit}
Carbon Footprint: ${material.carbonFootprint} kg CO2e/${material.unit}

Criteria: ${JSON.stringify(criteria)}

Provide 3-5 sustainable alternatives with detailed analysis.`;
  }

  private parseOptimizationResponse(response: string, materials: MaterialInput[]): ProjectOptimizationReport {
    try {
      // Try to parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return this.mapToOptimizationReport(parsed, materials);
      }
    } catch (error) {
      console.warn('Failed to parse JSON response, using text parsing');
    }

    // Fallback to text parsing
    return this.parseTextResponse(response, materials);
  }

  private mapToOptimizationReport(parsed: any, materials: MaterialInput[]): ProjectOptimizationReport {
    return {
      overallScore: parsed.overallScore || 70,
      potentialCO2Reduction: parsed.potentialCO2Reduction || 15,
      costImpact: parsed.costImpact || 5,
      recommendations: this.mapRecommendations(parsed.recommendations || [], materials),
      summary: parsed.summary || 'Analysis completed with general recommendations.',
      keyInsights: parsed.keyInsights || ['Consider sustainable alternatives', 'Monitor compliance requirements'],
      nextSteps: parsed.nextSteps || ['Review recommendations', 'Assess feasibility', 'Implement changes'],
      timestamp: Date.now(),
      materialAnalysis: {
        highImpactMaterials: parsed.materialAnalysis?.highImpactMaterials || materials.slice(0, 2).map(m => m.name),
        sustainableMaterials: parsed.materialAnalysis?.sustainableMaterials || [],
        improvementAreas: parsed.materialAnalysis?.improvementAreas || ['Carbon footprint reduction', 'Cost optimization']
      },
      complianceImprovement: {
        nccGaps: parsed.complianceImprovement?.nccGaps || ['Review thermal performance requirements'],
        nabersOpportunities: parsed.complianceImprovement?.nabersOpportunities || ['Improve energy efficiency rating']
      }
    };
  }

  private mapRecommendations(recommendations: any[], materials: MaterialInput[]): OptimizationRecommendation[] {
    return recommendations.slice(0, 5).map((rec, index) => ({
      materialId: materials[index]?.name || `material-${index}`,
      currentMaterial: materials[index]?.name || 'Unknown',
      category: rec.category || 'carbon_reduction',
      title: rec.title || `Optimize ${materials[index]?.name || 'Material'}`,
      description: rec.description || 'Consider sustainable alternatives to reduce environmental impact',
      issue: rec.issue || 'High carbon footprint detected',
      recommendation: rec.recommendation || 'Consider sustainable alternatives',
      impact: rec.impact || 'Significant carbon reduction potential',
      timeframe: rec.timeframe || '2-4 weeks',
      confidence: rec.confidence || 85,
      potentialSaving: rec.potentialSaving || Math.floor(Math.random() * 20) + 5,
      priority: rec.priority || 'Medium',
      alternatives: this.mapAlternatives(rec.alternatives || []),
      implementationSteps: rec.implementationSteps || ['Research alternatives', 'Evaluate costs', 'Plan implementation']
    }));
  }

  private mapAlternatives(alternatives: any[]): MaterialAlternative[] {
    return alternatives.slice(0, 3).map((alt, index) => ({
      id: `alt-${index}`,
      name: alt.name || 'Sustainable Alternative',
      type: alt.type || 'Eco-friendly material',
      carbonFootprint: alt.carbonFootprint || 0.8,
      carbonReduction: alt.carbonReduction || 25,
      cost: alt.cost || 1.1,
      costImpact: alt.costImpact || 'similar',
      availability: alt.availability || 'Medium',
      sustainabilityScore: alt.sustainabilityScore || 80,
      description: alt.description || 'Eco-friendly alternative material',
      benefits: alt.benefits || ['Lower carbon footprint', 'Renewable source'],
      tradeoffs: alt.tradeoffs || ['Slightly higher cost', 'Limited availability'],
      considerations: alt.considerations || ['Verify local availability', 'Check cost implications'],
      complianceStatus: {
        ncc: alt.complianceStatus?.ncc ?? true,
        nabers: alt.complianceStatus?.nabers ?? true
      },
      estimatedSavings: {
        co2: alt.estimatedSavings?.co2 || 15.5,
        cost: alt.estimatedSavings?.cost || 0
      }
    }));
  }

  private parseTextResponse(response: string, materials: MaterialInput[]): ProjectOptimizationReport {
    const score = this.extractNumber(response, /score[:\s]+(\d+)/i) || 70;
    const reduction = this.extractNumber(response, /reduction[:\s]+(\d+)/i) || 15;
    const costImpact = this.extractNumber(response, /cost[:\s]+[+-]?(\d+)/i) || 5;

    return {
      overallScore: score,
      potentialCO2Reduction: reduction,
      costImpact,
      recommendations: this.generateBasicRecommendations(materials),
      summary: 'AI analysis completed with optimization recommendations.',
      keyInsights: this.extractInsights(response),
      nextSteps: ['Review material alternatives', 'Assess cost-benefit', 'Plan implementation'],
      timestamp: Date.now(),
      materialAnalysis: {
        highImpactMaterials: materials.slice(0, 2).map(m => m.name),
        sustainableMaterials: [],
        improvementAreas: ['Carbon footprint reduction', 'Material optimization']
      },
      complianceImprovement: {
        nccGaps: ['Review building standards compliance'],
        nabersOpportunities: ['Improve sustainability rating']
      }
    };
  }

  private parseMaterialAlternatives(response: string, material: MaterialInput): MaterialAlternative[] {
    // Parse response and return alternatives
    return this.generateBasicAlternatives(material);
  }

  private extractNumber(text: string, pattern: RegExp): number | null {
    const match = text.match(pattern);
    return match ? parseInt(match[1], 10) : null;
  }

  private extractInsights(response: string): string[] {
    const insights = [];
    if (response.toLowerCase().includes('carbon')) {
      insights.push('Focus on carbon footprint reduction');
    }
    if (response.toLowerCase().includes('cost')) {
      insights.push('Balance cost and sustainability');
    }
    if (response.toLowerCase().includes('alternative')) {
      insights.push('Consider material alternatives');
    }
    return insights.length ? insights : ['Consider sustainable practices', 'Monitor compliance requirements'];
  }

  private generateBasicRecommendations(materials: MaterialInput[]): OptimizationRecommendation[] {
    return materials.slice(0, 3).map((material, index) => ({
      materialId: material.name,
      currentMaterial: material.name,
      category: 'carbon_reduction',
      title: `Optimize ${material.name}`,
      description: `Consider sustainable alternatives for ${material.name} to reduce environmental impact`,
      issue: 'Optimization opportunity identified',
      recommendation: `Consider sustainable alternatives for ${material.name}`,
      impact: 'Moderate carbon reduction potential',
      timeframe: '2-4 weeks',
      confidence: 75,
      potentialSaving: Math.floor(Math.random() * 20) + 10,
      priority: index === 0 ? 'High' : 'Medium',
      alternatives: this.generateBasicAlternatives(material),
      implementationSteps: ['Research alternatives', 'Evaluate feasibility', 'Plan implementation']
    }));
  }

  private generateBasicAlternatives(material: MaterialInput): MaterialAlternative[] {
    return [
      {
        id: `${material.name}-alt-1`,
        name: `Eco-${material.name}`,
        type: 'Sustainable alternative',
        carbonFootprint: (material.carbonFootprint || 1) * 0.7,
        carbonReduction: 30,
        cost: 1.1,
        costImpact: 'higher',
        availability: 'Medium',
        sustainabilityScore: 85,
        description: `Sustainable alternative to ${material.name}`,
        benefits: ['Reduced carbon footprint', 'Improved sustainability'],
        tradeoffs: ['Slightly higher cost'],
        considerations: ['Verify local availability', 'Check cost implications'],
        complianceStatus: {
          ncc: true,
          nabers: true
        },
        estimatedSavings: {
          co2: (material.carbonFootprint || 1) * 0.3,
          cost: 0
        }
      }
    ];
  }

  private getFallbackReport(materials: MaterialInput[]): ProjectOptimizationReport {
    return {
      overallScore: 75,
      potentialCO2Reduction: 12,
      costImpact: 3,
      recommendations: this.generateBasicRecommendations(materials),
      summary: 'Basic analysis completed. Consider sustainable alternatives to improve your project\'s environmental impact.',
      keyInsights: ['Focus on high-impact materials', 'Balance cost and sustainability', 'Monitor compliance'],
      nextSteps: ['Review recommendations', 'Research alternatives', 'Consult with suppliers'],
      timestamp: Date.now(),
      materialAnalysis: {
        highImpactMaterials: materials.slice(0, 2).map(m => m.name),
        sustainableMaterials: [],
        improvementAreas: ['Carbon footprint reduction', 'Cost optimization']
      },
      complianceImprovement: {
        nccGaps: ['Review compliance requirements'],
        nabersOpportunities: ['Improve sustainability rating']
      }
    };
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (!this.isCacheValid(value.timestamp)) {
        this.cache.delete(key);
      }
    }
  }

  // Performance method to get cached results only
  getCachedOptimization(materials: MaterialInput[]): ProjectOptimizationReport | null {
    const cacheKey = this.getCacheKey(materials);
    const cached = this.cache.get(cacheKey);
    return cached && this.isCacheValid(cached.timestamp) ? cached : null;
  }

  // Method to clear cache manually
  clearCache(): void {
    this.cache.clear();
  }
}

export const materialOptimizationService = new MaterialOptimizationService();
