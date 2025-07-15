
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Code, Download, Upload, Database, Server } from "lucide-react";

const EasyIntegration = () => {
  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center max-w-3xl mx-auto mb-6 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Seamless Integration</h1>
        <p className="text-sm md:text-lg text-muted-foreground mb-4 md:mb-8">
          Connect CarbonConstruct with your existing tools and software to streamline your workflow.
        </p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Tabs defaultValue="data-import" className="space-y-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8 w-full max-w-3xl mx-auto">
            <TabsTrigger value="data-import" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Upload className="h-4 w-4 mr-2" />
              Data Import
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Code className="h-4 w-4 mr-2" />
              API Access
            </TabsTrigger>
            <TabsTrigger value="export" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Download className="h-4 w-4 mr-2" />
              Data Export
            </TabsTrigger>
            <TabsTrigger value="software" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Server className="h-4 w-4 mr-2" />
              Software
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="data-import">
            <Card>
              <CardHeader>
                <CardTitle>Import Project Data</CardTitle>
                <CardDescription>
                  Import data from various sources to get started with your carbon calculations quickly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <Database className="h-10 w-10 text-carbon-600 dark:text-carbon-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Excel/CSV Import</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-4">
                      Import your material quantities and specifications from spreadsheets.
                    </p>
                    <Button variant="outline" className="w-full">Import Spreadsheet</Button>
                  </div>
                  
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <Server className="h-10 w-10 text-carbon-600 dark:text-carbon-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">BIM Model Import</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-4">
                      Extract material data directly from your BIM models.
                    </p>
                    <Button variant="outline" className="w-full">Import BIM Data</Button>
                  </div>
                  
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <Upload className="h-10 w-10 text-carbon-600 dark:text-carbon-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Project Templates</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-4">
                      Use pre-built templates for common construction project types.
                    </p>
                    <Button variant="outline" className="w-full">Browse Templates</Button>
                  </div>
                </div>
                
                <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                  <h3 className="text-lg font-medium mb-2">Supported File Formats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="bg-card p-3 rounded-lg border border-border mb-2">
                        <p className="font-bold text-card-foreground">.xlsx</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Excel</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-card p-3 rounded-lg border border-border mb-2">
                        <p className="font-bold text-card-foreground">.csv</p>
                      </div>
                      <p className="text-xs text-muted-foreground">CSV</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-card p-3 rounded-lg border border-border mb-2">
                        <p className="font-bold text-card-foreground">.ifc</p>
                      </div>
                      <p className="text-xs text-muted-foreground">IFC</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-card p-3 rounded-lg border border-border mb-2">
                        <p className="font-bold text-card-foreground">.json</p>
                      </div>
                      <p className="text-xs text-muted-foreground">JSON</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Integration</CardTitle>
                <CardDescription>
                  Connect your systems directly to CarbonConstruct using our comprehensive API.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700 mb-6">
                  <h3 className="text-lg font-medium mb-4">API Documentation</h3>
                  <div className="space-y-4">
                    <div className="bg-card p-4 rounded-lg border border-border">
                      <h4 className="font-medium mb-2 text-card-foreground">Authentication</h4>
                       <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                         {`curl -X POST https://api.carbonconstruct.com/auth \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@company.com", "password": "***"}'`}
                       </pre>
                    </div>
                    <div className="bg-card p-4 rounded-lg border border-border">
                      <h4 className="font-medium mb-2 text-card-foreground">Get Materials</h4>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
<code>curl -X GET https://api.carbonconstruct.com/materials \
  -H "Authorization: Bearer TOKEN"</code>
                      </pre>
                    </div>
                    <div className="bg-card p-4 rounded-lg border border-border">
                       <h4 className="font-medium mb-2 text-card-foreground">Calculate Emissions</h4>
                        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                         {`curl -X POST https://api.carbonconstruct.com/calculate \\
  -H "Authorization: Bearer TOKEN" \\
  -d '{"materials": [...], "transport": [...], "energy": [...]}'`}
                        </pre>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button>Full API Documentation</Button>
                  </div>
                </div>
                
                <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                  <h3 className="text-lg font-medium mb-4">API Keys</h3>
                  <p className="text-carbon-600 dark:text-carbon-300 mb-4">
                    Generate and manage API keys to connect your systems with CarbonConstruct.
                  </p>
                  <Button>Generate API Key</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Export Your Data</CardTitle>
                <CardDescription>
                  Export your project data and results in various formats.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <Download className="h-10 w-10 text-carbon-600 dark:text-carbon-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Report Generation</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-4">
                      Generate comprehensive reports of your carbon calculations and analysis.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        Excel
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        CSV
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <Database className="h-10 w-10 text-carbon-600 dark:text-carbon-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Data Export</h3>
                    <p className="text-sm text-carbon-600 dark:text-carbon-300 mb-4">
                      Export raw data for use in other systems or for backup purposes.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        JSON
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        XML
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        SQL
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                  <h3 className="text-lg font-medium mb-4">Scheduled Exports</h3>
                  <p className="text-carbon-600 dark:text-carbon-300 mb-4">
                    Set up automatic exports of your data on a regular schedule.
                  </p>
                  <Button>Configure Scheduled Exports</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="software">
            <Card>
              <CardHeader>
                <CardTitle>Software Integrations</CardTitle>
                <CardDescription>
                  Connect CarbonConstruct with other software tools in your workflow.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <div className="h-12 w-12 bg-card rounded-lg flex items-center justify-center mb-4">
                      <span className="text-lg font-bold text-primary">A</span>
                    </div>
                    <h4 className="text-lg font-semibold mb-3 text-foreground">Autodesk Revit</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Direct plugin integration for BIM workflows. Export material schedules and quantities with one click.
                    </p>
                    <Button variant="outline" size="sm">
                      Download Plugin
                    </Button>
                  </div>
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <div className="h-12 w-12 bg-card rounded-lg flex items-center justify-center mb-4">
                      <span className="text-lg font-bold text-primary">T</span>
                    </div>
                    <h4 className="text-lg font-semibold mb-3 text-foreground">Tekla Structures</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Automated steel detailing integration. Track material usage and carbon impact in real-time.
                    </p>
                    <Button variant="outline" size="sm">
                      View Integration
                    </Button>
                  </div>
                  <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                    <div className="h-12 w-12 bg-card rounded-lg flex items-center justify-center mb-4">
                      <span className="text-lg font-bold text-primary">G</span>
                    </div>
                    <h4 className="text-lg font-semibold mb-3 text-foreground">Graphisoft ArchiCAD</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect with ArchiCAD and BIMcloud.
                    </p>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg border border-carbon-100 dark:border-carbon-700">
                  <h3 className="text-lg font-medium mb-4">Custom Integrations</h3>
                  <p className="text-carbon-600 dark:text-carbon-300 mb-4">
                    Need to connect with another system? Our team can help build custom integrations.
                  </p>
                  <Button>Request Custom Integration</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default EasyIntegration;
