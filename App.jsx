import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Calculator, Plus, Download, Upload, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { ResponsibleProductsCalculator, BuildingLayer, CreditType, AchievementLevel, createSampleProject, formatCurrency, formatPercentage, getAchievementColor } from './lib/calculator.js'
import './App.css'

function App() {
  const [calculator] = useState(new ResponsibleProductsCalculator())
  const [project, setProject] = useState(null)
  const [products, setProducts] = useState([])
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState('products')
  const [newProduct, setNewProduct] = useState({
    productId: '',
    productName: '',
    manufacturer: '',
    description: '',
    cost: '',
    quantity: '',
    unit: '',
    category: '',
    buildingLayers: [],
    certifications: []
  })

  useEffect(() => {
    // Load sample project on startup
    const sampleProject = createSampleProject()
    setProject(sampleProject)
    setProducts(sampleProject.products)
  }, [])

  const addProduct = () => {
    if (!newProduct.productName || !newProduct.cost) {
      alert('Please fill in at least Product Name and Cost')
      return
    }

    const product = {
      ...newProduct,
      productId: newProduct.productId || `PROD-${Date.now()}`,
      cost: parseFloat(newProduct.cost) || 0,
      quantity: parseFloat(newProduct.quantity) || 1,
      certifications: []
    }

    setProducts([...products, product])
    setNewProduct({
      productId: '',
      productName: '',
      manufacturer: '',
      description: '',
      cost: '',
      quantity: '',
      unit: '',
      category: '',
      buildingLayers: [],
      certifications: []
    })
  }

  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index)
    setProducts(updatedProducts)
  }

  const calculateCompliance = () => {
    if (products.length === 0) {
      alert('Please add some products first')
      return
    }

    // Create project data
    const buildingLayerCosts = new Map()
    Object.values(BuildingLayer).forEach(layer => {
      const layerCost = products
        .filter(product => product.buildingLayers.includes(layer))
        .reduce((sum, product) => sum + product.cost, 0)
      buildingLayerCosts.set(layer, layerCost)
    })

    const projectData = {
      projectId: project?.projectId || 'PROJ-' + Date.now(),
      projectName: project?.projectName || 'My Project',
      products,
      buildingLayerCosts,
      totalProjectCost: products.reduce((sum, product) => sum + product.cost, 0),
      submissionDate: new Date()
    }

    try {
      const summary = calculator.calculateProjectCompliance(projectData)
      setResults(summary)
      setActiveTab('results')
    } catch (error) {
      alert('Error calculating compliance: ' + error.message)
    }
  }

  const loadSampleData = () => {
    const sampleProject = createSampleProject()
    setProject(sampleProject)
    setProducts(sampleProject.products)
  }

  const exportResults = () => {
    if (!results) return

    const csvData = calculator.exportToCSV(results)
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `green-star-compliance-${Date.now()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getAchievementBadge = (level) => {
    const color = getAchievementColor(level)
    let variant = 'secondary'
    
    if (level === AchievementLevel.BEST_PRACTICE) variant = 'default'
    else if (level === AchievementLevel.GOOD_PRACTICE) variant = 'secondary'
    else variant = 'destructive'

    return (
      <Badge variant={variant} style={{ backgroundColor: color, color: 'white' }}>
        {level}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Green Star Materials Calculator</h1>
          </div>
          <p className="text-gray-600">
            Calculate compliance with Green Star Responsible Products Guidelines for sustainable building materials
          </p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="project">Project Info</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Product Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Product
                  </CardTitle>
                  <CardDescription>
                    Add building products to calculate compliance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productName">Product Name *</Label>
                      <Input
                        id="productName"
                        value={newProduct.productName}
                        onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})}
                        placeholder="e.g., Sustainable Steel Beams"
                      />
                    </div>
                    <div>
                      <Label htmlFor="manufacturer">Manufacturer</Label>
                      <Input
                        id="manufacturer"
                        value={newProduct.manufacturer}
                        onChange={(e) => setNewProduct({...newProduct, manufacturer: e.target.value})}
                        placeholder="e.g., GreenSteel Industries"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="cost">Cost (AUD) *</Label>
                      <Input
                        id="cost"
                        type="number"
                        value={newProduct.cost}
                        onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})}
                        placeholder="125000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Input
                        id="unit"
                        value={newProduct.unit}
                        onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                        placeholder="tonnes"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="buildingLayer">Building Layer</Label>
                    <Select onValueChange={(value) => setNewProduct({...newProduct, buildingLayers: [value]})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select building layer" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(BuildingLayer).map(layer => (
                          <SelectItem key={layer} value={layer}>{layer}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Brief description of the product"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={addProduct} className="flex-1">
                      Add Product
                    </Button>
                    <Button onClick={loadSampleData} variant="outline">
                      Load Sample Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Products List */}
              <Card>
                <CardHeader>
                  <CardTitle>Products ({products.length})</CardTitle>
                  <CardDescription>
                    Total Value: {formatCurrency(products.reduce((sum, p) => sum + p.cost, 0))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {products.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No products added yet</p>
                    ) : (
                      products.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{product.productName}</h4>
                            <p className="text-sm text-gray-600">{product.manufacturer}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline">{product.buildingLayers[0]}</Badge>
                              <Badge variant="secondary">{formatCurrency(product.cost)}</Badge>
                              {product.certifications.length > 0 && (
                                <Badge variant="default">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Certified
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => removeProduct(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {products.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <Button onClick={calculateCompliance} className="w-full" size="lg">
                        <Calculator className="h-4 w-4 mr-2" />
                        Calculate Compliance
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Project Info Tab */}
          <TabsContent value="project" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
                <CardDescription>
                  Overview of your project and building layers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Project Details</h3>
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {project?.projectName || 'My Project'}</p>
                      <p><strong>Total Products:</strong> {products.length}</p>
                      <p><strong>Total Cost:</strong> {formatCurrency(products.reduce((sum, p) => sum + p.cost, 0))}</p>
                      <p><strong>Certified Products:</strong> {products.filter(p => p.certifications.length > 0).length}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Building Layers</h3>
                    <div className="space-y-2">
                      {Object.values(BuildingLayer).map(layer => {
                        const layerProducts = products.filter(p => p.buildingLayers.includes(layer))
                        const layerCost = layerProducts.reduce((sum, p) => sum + p.cost, 0)
                        return (
                          <div key={layer} className="flex justify-between">
                            <span>{layer}:</span>
                            <span>{layerProducts.length} products ({formatCurrency(layerCost)})</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {!results ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
                  <p className="text-gray-600 mb-4">Add products and calculate compliance to see results</p>
                  <Button onClick={() => setActiveTab('products')}>
                    Add Products
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Overall Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Overall Compliance Results
                      <Button onClick={exportResults} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {formatPercentage(results.overallScore)}
                        </div>
                        <div className="text-sm text-gray-600">Overall Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {results.achievedCredits}/{results.totalPossibleCredits}
                        </div>
                        <div className="text-sm text-gray-600">Credits Achieved</div>
                      </div>
                      <div className="text-center">
                        {getAchievementBadge(results.achievementLevel)}
                        <div className="text-sm text-gray-600 mt-1">Achievement Level</div>
                      </div>
                      <div className="text-center">
                        <Progress value={results.overallScore} className="mb-2" />
                        <div className="text-sm text-gray-600">Progress</div>
                      </div>
                    </div>

                    {results.recommendations.length > 0 && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Recommendations:</strong>
                          <ul className="mt-2 space-y-1">
                            {results.recommendations.slice(0, 3).map((rec, index) => (
                              <li key={index} className="text-sm">• {rec}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Detailed Results */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Compliance by Building Layer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.values(BuildingLayer).map(layer => {
                        const layerResults = results.totalCompliance.filter(r => r.buildingLayer === layer)
                        if (layerResults.length === 0) return null

                        return (
                          <div key={layer} className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-3">{layer}</h3>
                            <div className="grid gap-3">
                              {layerResults.map((result, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                  <div className="flex-1">
                                    <h4 className="font-medium">{result.creditType}</h4>
                                    <p className="text-sm text-gray-600">
                                      {formatCurrency(result.compliantCost)} / {formatCurrency(result.totalCost)}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold">{formatPercentage(result.percentage)}</div>
                                    {getAchievementBadge(result.achievementLevel)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Green Star Materials Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  This calculator implements the logic from the Green Building Council of Australia's 
                  Responsible Products Guidelines Version A. It helps project teams calculate compliance 
                  with Green Star Responsible Products credits.
                </p>
                
                <div>
                  <h3 className="font-semibold mb-2">Key Features:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Cost-weighted percentage calculation methodology</li>
                    <li>Support for 4 building layers (Structure, Envelope, Systems, Finishes)</li>
                    <li>5 sustainability categories (Responsible, Healthy, Positive, Circular, Leadership)</li>
                    <li>Real-time compliance calculation</li>
                    <li>CSV export for detailed analysis</li>
                    <li>Sample data for testing and demonstration</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">How it Works:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Add your building products with costs and building layers</li>
                    <li>The calculator determines which products have valid certifications</li>
                    <li>Compliance is calculated as: (Compliant Product Cost / Total Product Cost) × 100</li>
                    <li>Results are compared against Good Practice and Best Practice thresholds</li>
                    <li>Points are awarded based on achievement levels</li>
                  </ol>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Note:</strong> This implementation is based on publicly available GBCA documentation. 
                    For official Green Star project submissions, always use the official GBCA Responsible Products Calculator.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

