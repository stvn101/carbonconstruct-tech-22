import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { 
  createGreenStarProject, 
  fetchGreenStarProjects, 
  updateGreenStarProject,
  fetchGreenStarInitiatives,
  fetchGreenStarMaterials,
  type GreenStarProject 
} from '@/services/greenstarService';
import { 
  greenStarCalculationService,
  type GreenStarCalculationInput 
} from '@/services/greenstar/calculationService';
import { BuildingLayer } from '@/lib/greenstar/calculator';
import { 
  Calculator,
  Award,
  Building,
  Leaf,
  TrendingUp,
  FileText,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';

// Make ProjectMaterial JSON-serializable for Supabase
interface ProjectMaterial {
  id: string;
  name: string;
  quantity: number;
  cost: number;
  buildingLayer: string; // Changed from BuildingLayer enum to string
}

interface ComplianceBreakdown {
  overallScore: number;
  achievementLevel: string;
  creditsAchieved: number;
  totalCredits: number;
  recommendations: string[];
  layerBreakdown: Array<{
    buildingLayer: string;
    creditType: string;
    percentage: number;
    achieved: boolean;
    points: number;
    compliantCost: number;
    totalCost: number;
  }>;
}

const GreenStarCalculator: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [projects, setProjects] = useState<GreenStarProject[]>([]);
  const [currentProject, setCurrentProject] = useState<GreenStarProject | null>(null);
  const [initiatives, setInitiatives] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [complianceBreakdown, setComplianceBreakdown] = useState<ComplianceBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Project form state
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('Commercial');
  const [location, setLocation] = useState('Australia');
  const [targetRating, setTargetRating] = useState<'Good Practice' | 'Best Practice'>('Good Practice');
  
  // Materials state
  const [projectMaterials, setProjectMaterials] = useState<ProjectMaterial[]>([]);
  const [buildingLayerCosts, setBuildingLayerCosts] = useState<Record<string, number>>({
    [BuildingLayer.STRUCTURE]: 0,
    [BuildingLayer.ENVELOPE]: 0, 
    [BuildingLayer.SYSTEMS]: 0,
    [BuildingLayer.FINISHES]: 0
  });

  useEffect(() => {
    if (user) {
      loadProjects();
      loadInitiatives();
      loadMaterials();
      initializeCalculationService();
    }
  }, [user]);

  const initializeCalculationService = async () => {
    try {
      await greenStarCalculationService.initialize();
      console.log('Green Star calculation service initialized');
    } catch (error) {
      console.error('Failed to initialize calculation service:', error);
      toast({
        title: "Initialization Error",
        description: "Failed to initialize calculation service",
        variant: "destructive"
      });
    }
  };

  const loadProjects = async () => {
    if (!user) return;
    
    try {
      const data = await fetchGreenStarProjects(user.id);
      setProjects(data);
    } catch (error) {
      toast({
        title: "Error loading projects",
        description: "Failed to load Green Star projects",
        variant: "destructive"
      });
    }
  };

  const loadInitiatives = async () => {
    try {
      const data = await fetchGreenStarInitiatives();
      setInitiatives(data);
    } catch (error) {
      console.error('Error loading initiatives:', error);
    }
  };

  const loadMaterials = async () => {
    try {
      const data = await fetchGreenStarMaterials({ compliant_only: false });
      setMaterials(data);
    } catch (error) {
      console.error('Error loading materials:', error);
    }
  };

  const createNewProject = async () => {
    if (!user || !projectName.trim()) return;

    setIsLoading(true);
    try {
      const newProject = await createGreenStarProject({
        user_id: user.id,
        project_name: projectName,
        project_type: projectType,
        location,
        target_rating: targetRating,
        building_layer_costs: {},
        products: [],
        compliance_results: [],
        overall_score: 0,
        achieved_credits: 0,
        total_possible_credits: 0,
        achievement_level: 'None',
        recommendations: []
      });

      setCurrentProject(newProject);
      setProjects(prev => [newProject, ...prev]);
      setProjectName('');
      setProjectMaterials([]);
      setBuildingLayerCosts({
        [BuildingLayer.STRUCTURE]: 0,
        [BuildingLayer.ENVELOPE]: 0,
        [BuildingLayer.SYSTEMS]: 0,
        [BuildingLayer.FINISHES]: 0
      });
      
      toast({
        title: "Project created",
        description: `Green Star project "${newProject.project_name}" created successfully`
      });
    } catch (error) {
      toast({
        title: "Error creating project",
        description: "Failed to create Green Star project",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addMaterial = () => {
    const newMaterial: ProjectMaterial = {
      id: `material-${Date.now()}`,
      name: '',
      quantity: 0,
      cost: 0,
      buildingLayer: BuildingLayer.FINISHES // Convert enum to string
    };
    setProjectMaterials([...projectMaterials, newMaterial]);
  };

  const updateMaterial = (index: number, field: keyof ProjectMaterial, value: any) => {
    const updated = [...projectMaterials];
    updated[index] = { ...updated[index], [field]: value };
    setProjectMaterials(updated);
    
    // Update building layer costs
    updateBuildingLayerCosts(updated);
  };

  const removeMaterial = (index: number) => {
    const updated = projectMaterials.filter((_, i) => i !== index);
    setProjectMaterials(updated);
    updateBuildingLayerCosts(updated);
  };

  const updateBuildingLayerCosts = (materials: ProjectMaterial[]) => {
    const costs: Record<string, number> = {
      [BuildingLayer.STRUCTURE]: 0,
      [BuildingLayer.ENVELOPE]: 0,
      [BuildingLayer.SYSTEMS]: 0,
      [BuildingLayer.FINISHES]: 0
    };

    materials.forEach(material => {
      costs[material.buildingLayer] += material.cost;
    });

    setBuildingLayerCosts(costs);
  };

  const calculateRealCompliance = async () => {
    if (!currentProject || projectMaterials.length === 0) {
      toast({
        title: "Missing Data",
        description: "Please create a project and add materials before calculating",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);
    try {
      const totalCost = Object.values(buildingLayerCosts).reduce((sum, cost) => sum + cost, 0);
      
      // Convert materials for calculation input
      const calculationMaterials = projectMaterials.map(material => ({
        ...material,
        buildingLayer: material.buildingLayer as BuildingLayer
      }));

      const calculationInput: GreenStarCalculationInput = {
        projectId: currentProject.id!,
        projectName: currentProject.project_name,
        materials: calculationMaterials,
        buildingLayerCosts,
        totalProjectCost: totalCost
      };

      const summary = await greenStarCalculationService.calculateProjectCompliance(calculationInput);
      const breakdown = greenStarCalculationService.getComplianceBreakdown(summary);
      
      setComplianceBreakdown(breakdown);

      // Update project in database - serialize materials as JSON
      const updatedProject = {
        ...currentProject,
        total_project_cost: totalCost,
        building_layer_costs: buildingLayerCosts as any,
        products: projectMaterials as any, // JSON serialized
        overall_score: breakdown.overallScore,
        achieved_credits: breakdown.creditsAchieved,
        total_possible_credits: breakdown.totalCredits,
        achievement_level: breakdown.achievementLevel as any,
        recommendations: breakdown.recommendations
      };

      await updateGreenStarProject(updatedProject);
      setCurrentProject(updatedProject);

      toast({
        title: "Calculation Complete",
        description: `Overall compliance: ${breakdown.overallScore}% (${breakdown.achievementLevel})`
      });

    } catch (error) {
      console.error('Calculation failed:', error);
      toast({
        title: "Calculation Failed",
        description: "Failed to calculate Green Star compliance",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const overallScore = complianceBreakdown?.overallScore || 0;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <Award className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Green Star Materials Calculator</h1>
          <p className="text-gray-600">Real-time compliance calculation with Green Star Responsible Products Guidelines</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projects</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">Active Green Star projects</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Initiatives</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{initiatives.length}</div>
                <p className="text-xs text-muted-foreground">Recognized initiatives</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallScore}%</div>
                <p className="text-xs text-muted-foreground">Overall project compliance</p>
              </CardContent>
            </Card>
          </div>

          {complianceBreakdown && (
            <Card>
              <CardHeader>
                <CardTitle>Real-Time Compliance Results</CardTitle>
                <CardDescription>Detailed building layer compliance breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Score</span>
                  <Badge variant={overallScore >= 85 ? 'default' : overallScore >= 60 ? 'secondary' : 'destructive'}>
                    {complianceBreakdown.achievementLevel}
                  </Badge>
                </div>
                <Progress value={overallScore} className="h-2" />
                
                <Separator />
                
                <div className="space-y-3">
                  {complianceBreakdown.layerBreakdown.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {result.achieved ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">{result.buildingLayer}</p>
                          <p className="text-sm text-gray-600">{result.creditType}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{result.percentage}%</p>
                        <p className="text-sm text-gray-600">{result.points} points</p>
                      </div>
                    </div>
                  ))}
                </div>

                {complianceBreakdown.recommendations.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {complianceBreakdown.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>Set up a new Green Star compliance project with real-time calculation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Mixed Use">Mixed Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Project location"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetRating">Target Rating</Label>
                  <Select 
                    value={targetRating} 
                    onValueChange={(value: 'Good Practice' | 'Best Practice') => setTargetRating(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Good Practice">Good Practice</SelectItem>
                      <SelectItem value="Best Practice">Best Practice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={createNewProject} 
                disabled={isLoading || !projectName.trim()}
                className="w-full"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>

          {currentProject && (
            <Card>
              <CardHeader>
                <CardTitle>Project Materials: {currentProject.project_name}</CardTitle>
                <CardDescription>Add materials to calculate real Green Star compliance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Materials</h4>
                  <Button onClick={addMaterial} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Material
                  </Button>
                </div>

                <div className="space-y-3">
                  {projectMaterials.map((material, index) => (
                    <div key={material.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border rounded-lg">
                      <Input
                        placeholder="Material name"
                        value={material.name}
                        onChange={(e) => updateMaterial(index, 'name', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Quantity (kg)"
                        value={material.quantity}
                        onChange={(e) => updateMaterial(index, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                      <Input
                        type="number"
                        placeholder="Cost ($)"
                        value={material.cost}
                        onChange={(e) => updateMaterial(index, 'cost', parseFloat(e.target.value) || 0)}
                      />
                      <Select 
                        value={material.buildingLayer} 
                        onValueChange={(value) => updateMaterial(index, 'buildingLayer', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={BuildingLayer.STRUCTURE}>Structure</SelectItem>
                          <SelectItem value={BuildingLayer.ENVELOPE}>Envelope</SelectItem>
                          <SelectItem value={BuildingLayer.SYSTEMS}>Systems</SelectItem>
                          <SelectItem value={BuildingLayer.FINISHES}>Finishes</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeMaterial(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {projectMaterials.length > 0 && (
                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {Object.entries(buildingLayerCosts).map(([layer, cost]) => (
                        <div key={layer} className="text-center">
                          <p className="text-sm text-gray-600">{layer}</p>
                          <p className="font-medium">${cost.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={calculateRealCompliance} 
                      disabled={isCalculating}
                      className="w-full"
                    >
                      {isCalculating ? (
                        <>Calculating...</>
                      ) : (
                        <>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Calculate Green Star Compliance
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {projects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                         onClick={() => setCurrentProject(project)}>
                      <div>
                        <p className="font-medium">{project.project_name}</p>
                        <p className="text-sm text-gray-600">{project.project_type} • {project.location}</p>
                      </div>
                      <Badge variant="outline">{project.achievement_level || 'Not Calculated'}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Green Star Materials Database</CardTitle>
              <CardDescription>Browse materials with Green Star certifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                Material browser coming soon...
                <br />
                <span className="text-sm">Will show {materials.length} certified materials</span>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>Generate submission-ready Green Star reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Report generation coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GreenStarCalculator;
