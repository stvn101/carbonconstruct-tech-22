import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Upload, Download, FileText, Database, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MigrationReport {
  total: number;
  inserted: number;
  skipped: number;
  errors: number;
  details: Array<{
    id: string;
    status: 'success' | 'error' | 'skipped';
    message: string;
  }>;
}

interface ProjectData {
  id?: string;
  name: string;
  description?: string;
  materials: any[];
  transport: any[];
  energy: any[];
  result?: any;
  tags?: string[];
  status?: string;
  total_emissions?: number;
  premium_only?: boolean;
}

export default function DataMigration() {
  const { user } = useAuth();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [migrationReport, setMigrationReport] = useState<MigrationReport | null>(null);
  const [previewData, setPreviewData] = useState<ProjectData[]>([]);

  const validateProjectData = (data: any): ProjectData | null => {
    try {
      // Required fields
      if (!data.name || typeof data.name !== 'string') {
        throw new Error('Missing or invalid project name');
      }

      // Ensure arrays exist
      const materials = Array.isArray(data.materials) ? data.materials : [];
      const transport = Array.isArray(data.transport) ? data.transport : [];
      const energy = Array.isArray(data.energy) ? data.energy : [];

      // Calculate total emissions if not provided
      const totalEmissions = data.total_emissions || 
        materials.reduce((sum, m) => sum + (m.carbonFootprint || 0), 0) +
        transport.reduce((sum, t) => sum + (t.carbonFootprint || 0), 0) +
        energy.reduce((sum, e) => sum + (e.carbonFootprint || 0), 0);

      return {
        name: data.name,
        description: data.description || '',
        materials,
        transport,
        energy,
        result: data.result || {},
        tags: Array.isArray(data.tags) ? data.tags : [],
        status: data.status || 'draft',
        total_emissions: totalEmissions,
        premium_only: Boolean(data.premium_only)
      };
    } catch (error) {
      console.error('Validation error:', error);
      return null;
    }
  };

  const parseFile = useCallback(async (file: File): Promise<ProjectData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          let parsedData: any[];

          if (file.name.endsWith('.json')) {
            const jsonData = JSON.parse(content);
            parsedData = Array.isArray(jsonData) ? jsonData : [jsonData];
          } else if (file.name.endsWith('.csv')) {
            // Basic CSV parsing - assumes first row is headers
            const lines = content.split('\n').filter(line => line.trim());
            const headers = lines[0].split(',').map(h => h.trim());
            
            parsedData = lines.slice(1).map(line => {
              const values = line.split(',').map(v => v.trim());
              const obj: any = {};
              
              headers.forEach((header, index) => {
                obj[header] = values[index] || '';
              });
              
              // Try to parse JSON fields
              ['materials', 'transport', 'energy', 'result', 'tags'].forEach(field => {
                if (obj[field]) {
                  try {
                    obj[field] = JSON.parse(obj[field]);
                  } catch {
                    // If not valid JSON, create empty array/object
                    obj[field] = field === 'result' ? {} : [];
                  }
                }
              });
              
              return obj;
            });
          } else {
            throw new Error('Unsupported file format. Please use JSON or CSV.');
          }

          const validatedData = parsedData
            .map(validateProjectData)
            .filter((item): item is ProjectData => item !== null);

          resolve(validatedData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFile(file);
    
    try {
      toast.info('Parsing file...');
      const data = await parseFile(file);
      setPreviewData(data);
      toast.success(`Parsed ${data.length} valid projects`);
    } catch (error) {
      toast.error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setPreviewData([]);
    }
  };

  const insertProject = async (projectData: ProjectData): Promise<{ success: boolean; message: string }> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user?.id,
          name: projectData.name,
          description: projectData.description,
          result: projectData.result,
          total: projectData.total_emissions || 0,
          region: 'AU',
          tags: projectData.tags || []
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, message: 'Project inserted successfully' };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown insertion error' 
      };
    }
  };

  const processMigration = async () => {
    if (!user?.id) {
      toast.error('You must be logged in to migrate data');
      return;
    }

    if (previewData.length === 0) {
      toast.error('No valid data to migrate');
      return;
    }

    setIsProcessing(true);
    setMigrationProgress(0);

    const report: MigrationReport = {
      total: previewData.length,
      inserted: 0,
      skipped: 0,
      errors: 0,
      details: []
    };

    for (let i = 0; i < previewData.length; i++) {
      const project = previewData[i];
      const progress = ((i + 1) / previewData.length) * 100;
      setMigrationProgress(progress);

      // Check if project already exists
      const { data: existingProject } = await supabase
        .from('projects')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', project.name)
        .single();

      if (existingProject) {
        report.skipped++;
        report.details.push({
          id: project.name,
          status: 'skipped',
          message: 'Project with this name already exists'
        });
        continue;
      }

      const result = await insertProject(project);
      
      if (result.success) {
        report.inserted++;
        report.details.push({
          id: project.name,
          status: 'success',
          message: result.message
        });
      } else {
        report.errors++;
        report.details.push({
          id: project.name,
          status: 'error',
          message: result.message
        });
      }

      // Small delay to prevent overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setMigrationReport(report);
    setIsProcessing(false);
    setMigrationProgress(100);

    toast.success(`Migration completed: ${report.inserted} inserted, ${report.skipped} skipped, ${report.errors} errors`);
  };

  const downloadTemplate = () => {
    const template = {
      name: "Sample Project",
      description: "Example project description",
      materials: [
        {
          name: "Concrete",
          type: "concrete",
          quantity: 100,
          unit: "kg",
          carbonFootprint: 12
        }
      ],
      transport: [
        {
          mode: "truck",
          distance: 50,
          weight: 100,
          carbonFootprint: 5
        }
      ],
      energy: [
        {
          type: "electricity",
          amount: 100,
          unit: "kWh",
          carbonFootprint: 94
        }
      ],
      tags: ["residential", "low-carbon"],
      status: "draft",
      total_emissions: 111,
      premium_only: false
    };

    const blob = new Blob([JSON.stringify([template], null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Data Migration</h1>
        <p className="text-muted-foreground">
          Import your existing project data from CSV or JSON files into CarbonConstruct
        </p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
          <TabsTrigger value="preview">Preview & Validate</TabsTrigger>
          <TabsTrigger value="results">Migration Results</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Project Data
              </CardTitle>
              <CardDescription>
                Upload a JSON or CSV file containing your project data. Make sure the data includes project names and carbon emission details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Select File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".json,.csv"
                  onChange={handleFileUpload}
                  className="mt-2"
                />
              </div>

              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Supported formats: JSON (recommended) and CSV. Download the template below to see the expected structure.
                </AlertDescription>
              </Alert>

              <Button 
                variant="outline" 
                onClick={downloadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Preview
              </CardTitle>
              <CardDescription>
                Review the parsed data before migration. Only valid projects will be processed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {previewData.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{previewData.length} projects ready for migration</Badge>
                    <Button 
                      onClick={processMigration}
                      disabled={isProcessing}
                      className="flex items-center gap-2"
                    >
                      {isProcessing ? 'Processing...' : 'Start Migration'}
                    </Button>
                  </div>

                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Migration Progress</span>
                        <span>{Math.round(migrationProgress)}%</span>
                      </div>
                      <Progress value={migrationProgress} />
                    </div>
                  )}

                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {previewData.map((project, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{project.name}</h4>
                              <p className="text-sm text-muted-foreground">{project.description}</p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline">{project.materials.length} materials</Badge>
                                <Badge variant="outline">{project.transport.length} transport</Badge>
                                <Badge variant="outline">{project.energy.length} energy</Badge>
                              </div>
                            </div>
                            <Badge>
                              {project.total_emissions?.toFixed(2)} kg CO₂e
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No data to preview. Please upload a file in the Upload Data tab.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Migration Results
              </CardTitle>
              <CardDescription>
                Detailed report of the migration process
              </CardDescription>
            </CardHeader>
            <CardContent>
              {migrationReport ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold">{migrationReport.total}</div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{migrationReport.inserted}</div>
                      <div className="text-sm text-muted-foreground">Inserted</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">{migrationReport.skipped}</div>
                      <div className="text-sm text-muted-foreground">Skipped</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">{migrationReport.errors}</div>
                      <div className="text-sm text-muted-foreground">Errors</div>
                    </Card>
                  </div>

                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {migrationReport.details.map((detail, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded">
                          {detail.status === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {detail.status === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
                          {detail.status === 'skipped' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                          
                          <div className="flex-1">
                            <div className="font-medium">{detail.id}</div>
                            <div className="text-sm text-muted-foreground">{detail.message}</div>
                          </div>
                          
                          <Badge 
                            variant={
                              detail.status === 'success' ? 'default' : 
                              detail.status === 'error' ? 'destructive' : 'secondary'
                            }
                          >
                            {detail.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No migration results yet. Complete the migration process to see results here.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}