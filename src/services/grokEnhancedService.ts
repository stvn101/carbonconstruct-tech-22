
import grokService, { GrokResponse } from './GrokService';
import { supabase } from '@/integrations/supabase/client';

export interface EnhancedMaterialAnalysis {
  materialId: string;
  materialName: string;
  nccCompliance: {
    status: boolean;
    details: string;
    requirements: string[];
  };
  nabersRating: {
    currentRating: string;
    potentialRating: string;
    improvementPath: string[];
  };
  greenStarEligibility: {
    eligible: boolean;
    points: number;
    categories: string[];
  };
  scopeEmissions: {
    scope1: { value: number; score: number; recommendations: string[] };
    scope2: { value: number; score: number; recommendations: string[] };
    scope3: { value: number; score: number; recommendations: string[] };
  };
  alternativeMaterials: {
    name: string;
    carbonReduction: number;
    costImpact: string;
    availability: string;
  }[];
  epdVerification: {
    hasEPD: boolean;
    epdNumber?: string;
    verificationLevel: number;
    confidence: number;
  };
}

class GrokEnhancedService {
  /**
   * Perform comprehensive material analysis including compliance, ratings, and alternatives
   */
  async analyzeComprehensiveMaterial(materialId: string): Promise<EnhancedMaterialAnalysis> {
    try {
      // Check authentication before making query
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required for material analysis');
      }

      // Get material data from database
      const { data: material, error } = await supabase
        .from('unified_materials')
        .select('*')
        .eq('id', materialId)
        .single();

      if (error || !material) {
        throw new Error(`Material not found: ${materialId}`);
      }

      // Call Grok for comprehensive analysis
      const analysisPrompt = `
        Analyze this construction material comprehensively:
        
        Material: ${material.name}
        Carbon Footprint: ${material.carbon_footprint_kgco2e_kg} kg CO2e/kg
        Scope 1 Emissions: ${material.scope1_emissions || 'N/A'}
        Scope 2 Emissions: ${material.scope2_emissions || 'N/A'}
        Scope 3 Emissions: ${material.scope3_emissions || 'N/A'}
        Recyclability: ${material.recyclability || 'Unknown'}
        EPD Number: ${material.epd_registration_number || 'None'}
        Verification Status: ${material.verification_status || 'Unverified'}
        
        Please analyze for:
        1. NCC 2025 compliance (Building Code of Australia)
        2. NABERS energy rating potential
        3. Green Star v1.3 eligibility and points
        4. Scope 1, 2, 3 emissions scoring (0-100)
        5. Alternative materials with carbon reduction potential
        6. EPD verification assessment
        
        Provide detailed recommendations for compliance and sustainability improvements.
      `;

      const grokResponse = await grokService.queryGrok({
        prompt: analysisPrompt,
        context: { material, analysisType: 'comprehensive' },
        mode: 'compliance_check'
      });

      // Parse and structure the response
      return this.parseGrokAnalysisResponse(grokResponse, material);

    } catch (error) {
      console.error('Enhanced material analysis failed:', error);
      throw error;
    }
  }

  /**
   * Get EPD verification recommendations from suppliers
   */
  async getEPDVerificationRecommendations(materialName: string): Promise<GrokResponse> {
    const prompt = `
      For the material "${materialName}", analyze:
      1. Available EPD databases and suppliers in Australia
      2. Required documentation for verification
      3. Steps to achieve 95% EPD rating
      4. Cost and timeline estimates for EPD certification
      5. Benefits for NCC compliance and NABERS/Green Star ratings
      
      Provide practical guidance for project managers and sustainability consultants.
    `;

    return await grokService.queryGrok({
      prompt,
      context: { materialName, focus: 'epd_verification' },
      mode: 'sustainability_advisor'
    });
  }

  /**
   * Analyze material recyclability and circular economy potential
   */
  async analyzeCircularEconomyPotential(materialId: string): Promise<GrokResponse> {
    try {
      // Check authentication before making query
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required for circular economy analysis');
      }

      const { data: material } = await supabase
        .from('unified_materials')
        .select('*')
        .eq('id', materialId)
        .single();

      if (!material) throw new Error('Material not found');

      const prompt = `
        Analyze the circular economy potential for: ${material.name}
        
        Current recyclability: ${material.recyclability}
        End-of-life options: ${material.end_of_life_options?.join(', ') || 'Not specified'}
        
        Provide:
        1. Circular economy score (traffic light: Red/Orange/Green)
        2. End-of-life pathway recommendations
        3. Reuse and recycling opportunities
        4. Waste reduction strategies
        5. Design for disassembly recommendations
        6. Local recycling infrastructure availability in Australia
      `;

      return await grokService.queryGrok({
        prompt,
        context: { material, focus: 'circular_economy' },
        mode: 'sustainability_advisor'
      });

    } catch (error) {
      console.error('Circular economy analysis failed:', error);
      throw error;
    }
  }

  /**
   * Parse Grok response into structured analysis
   */
  private parseGrokAnalysisResponse(grokResponse: GrokResponse, material: any): EnhancedMaterialAnalysis {
    // This would contain more sophisticated parsing logic
    // For now, returning a structured mock response based on material data
    
    const carbonFootprint = material.carbon_footprint_kgco2e_kg || 0;
    const hasEPD = !!material.epd_registration_number;
    
    return {
      materialId: material.id,
      materialName: material.name,
      nccCompliance: {
        status: carbonFootprint < 2.0, // Simplified logic
        details: `${grokResponse.response.substring(0, 200)  }...`,
        requirements: ['Thermal performance', 'Energy efficiency', 'Indoor air quality']
      },
      nabersRating: {
        currentRating: carbonFootprint < 1.0 ? '5-star' : carbonFootprint < 2.0 ? '4-star' : '3-star',
        potentialRating: '5-star',
        improvementPath: ['Reduce embodied carbon', 'Improve energy efficiency', 'Local sourcing']
      },
      greenStarEligibility: {
        eligible: carbonFootprint < 1.5,
        points: Math.max(0, Math.min(10, Math.round((2.0 - carbonFootprint) * 5))),
        categories: ['Materials', 'Energy', 'Emissions']
      },
      scopeEmissions: {
        scope1: {
          value: material.scope1_emissions || 0,
          score: Math.max(0, Math.min(100, 100 - (material.scope1_emissions || 0) * 20)),
          recommendations: ['Improve manufacturing efficiency', 'Use renewable energy']
        },
        scope2: {
          value: material.scope2_emissions || 0,
          score: Math.max(0, Math.min(100, 100 - (material.scope2_emissions || 0) * 20)),
          recommendations: ['Switch to green electricity', 'Energy efficiency measures']
        },
        scope3: {
          value: material.scope3_emissions || 0,
          score: Math.max(0, Math.min(100, 100 - (material.scope3_emissions || 0) * 15)),
          recommendations: ['Local sourcing', 'Sustainable transport', 'Supply chain optimization']
        }
      },
      alternativeMaterials: [
        {
          name: `Low-carbon ${material.name}`,
          carbonReduction: 25,
          costImpact: '+5-10%',
          availability: 'Available'
        }
      ],
      epdVerification: {
        hasEPD,
        epdNumber: material.epd_registration_number,
        verificationLevel: hasEPD ? 95 : material.verification_status === 'verified' ? 80 : 50,
        confidence: hasEPD ? 95 : 75
      }
    };
  }
}

export const grokEnhancedService = new GrokEnhancedService();
export default grokEnhancedService;
