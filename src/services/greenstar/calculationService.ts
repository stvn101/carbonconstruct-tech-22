
import { 
  ResponsibleProductsCalculator, 
  ProjectData, 
  CalculationSummary,
  BuildingLayer,
  CreditType,
  Product,
  Certification,
  ResponsibleProductValue
} from '@/lib/greenstar/calculator';
import { fetchGreenStarMaterials, fetchGreenStarInitiatives } from '@/services/greenstarService';

export interface GreenStarCalculationInput {
  projectId: string;
  projectName: string;
  materials: Array<{
    id: string;
    name: string;
    quantity: number;
    cost: number;
    buildingLayer: BuildingLayer;
  }>;
  buildingLayerCosts: Record<string, number>;
  totalProjectCost: number;
}

export class GreenStarCalculationService {
  private calculator: ResponsibleProductsCalculator;
  private materialsCache: any[] = [];
  private initiativesCache: any[] = [];
  
  constructor() {
    this.calculator = new ResponsibleProductsCalculator();
  }

  async initialize() {
    try {
      // Load materials and initiatives data
      const [materials, initiatives] = await Promise.all([
        fetchGreenStarMaterials({ compliant_only: false }),
        fetchGreenStarInitiatives()
      ]);
      
      this.materialsCache = materials;
      this.initiativesCache = initiatives;
      
      console.log(`Loaded ${materials.length} materials and ${initiatives.length} initiatives`);
    } catch (error) {
      console.error('Failed to initialize Green Star calculation service:', error);
      throw error;
    }
  }

  async calculateProjectCompliance(input: GreenStarCalculationInput): Promise<CalculationSummary> {
    if (this.materialsCache.length === 0) {
      await this.initialize();
    }

    // Convert input materials to Product format
    const products = await this.convertInputToProducts(input.materials);
    
    // Create project data
    const buildingLayerCosts = new Map<BuildingLayer, number>();
    Object.entries(input.buildingLayerCosts).forEach(([layer, cost]) => {
      buildingLayerCosts.set(layer as BuildingLayer, cost);
    });

    const projectData: ProjectData = {
      projectId: input.projectId,
      projectName: input.projectName,
      products,
      buildingLayerCosts,
      totalProjectCost: input.totalProjectCost,
      submissionDate: new Date()
    };

    // Calculate compliance using the real calculator
    const summary = this.calculator.calculateProjectCompliance(projectData);
    
    console.log('Green Star calculation completed:', {
      overallScore: summary.overallScore,
      achievementLevel: summary.achievementLevel,
      creditsAchieved: summary.achievedCredits
    });

    return summary;
  }

  private async convertInputToProducts(materials: GreenStarCalculationInput['materials']): Promise<Product[]> {
    const products: Product[] = [];

    for (const material of materials) {
      // Find matching material in database
      const dbMaterial = this.materialsCache.find(m => 
        m.name.toLowerCase().includes(material.name.toLowerCase()) ||
        material.name.toLowerCase().includes(m.name.toLowerCase())
      );

      // Get certifications for this material
      const certifications = await this.getMaterialCertifications(dbMaterial);

      const product: Product = {
        productId: material.id,
        productName: material.name,
        manufacturer: dbMaterial?.manufacturer || 'Unknown',
        description: dbMaterial?.description || `${material.name} for construction`,
        certifications,
        buildingLayers: [material.buildingLayer],
        cost: material.cost,
        quantity: material.quantity,
        unit: 'kg',
        category: dbMaterial?.category || 'General Construction',
        subcategory: dbMaterial?.subcategory || 'Standard'
      };

      products.push(product);
    }

    return products;
  }

  private async getMaterialCertifications(dbMaterial: any): Promise<Certification[]> {
    if (!dbMaterial?.green_star_certifications) {
      return [];
    }

    const certifications: Certification[] = [];

    for (const cert of dbMaterial.green_star_certifications) {
      const initiative = this.initiativesCache.find(i => i.initiative_id === cert.initiative_id);
      
      if (initiative) {
        const rpv: ResponsibleProductValue = {
          initiativeId: initiative.initiative_id,
          initiativeName: initiative.initiative_name,
          rpvScore: initiative.rpv_score,
          categories: initiative.categories || [],
          recognitionDate: new Date(initiative.recognition_date),
          isActive: initiative.is_active,
          description: initiative.description || ''
        };

        const certification: Certification = {
          initiativeId: cert.initiative_id,
          certificateNumber: cert.certificate_number,
          issueDate: new Date(cert.issue_date),
          expiryDate: cert.expiry_date ? new Date(cert.expiry_date) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year default
          rpv,
          verificationStatus: cert.verification_status || 'pending_verification'
        };

        certifications.push(certification);
      }
    }

    return certifications;
  }

  getComplianceBreakdown(summary: CalculationSummary) {
    return {
      overallScore: Math.round(summary.overallScore * 100),
      achievementLevel: summary.achievementLevel,
      creditsAchieved: summary.achievedCredits,
      totalCredits: summary.totalPossibleCredits,
      recommendations: summary.recommendations,
      layerBreakdown: summary.totalCompliance.map(result => ({
        buildingLayer: result.buildingLayer,
        creditType: result.creditType,
        percentage: Math.round(result.percentage * 100),
        achieved: result.achieved,
        points: result.pointsAwarded,
        compliantCost: result.compliantCost,
        totalCost: result.totalCost
      }))
    };
  }
}

export const greenStarCalculationService = new GreenStarCalculationService();
