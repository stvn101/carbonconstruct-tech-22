import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, FileSpreadsheet, FileJson, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportManagerProps {
  calculatorData: any;
  totalEmissions: number;
}

export const ExportManager: React.FC<ExportManagerProps> = ({ calculatorData, totalEmissions }) => {
  const [selectedSections, setSelectedSections] = useState({
    dashboard: true,
    ncc: true,
    nabers: true,
    lca: true,
    scope: true,
    leed: true,
    breeam: true,
    greenstar: true
  });
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleSectionToggle = (section: string) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const generateExportData = () => {
    const exportData: any = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalEmissions,
        calculatorsUsed: Object.keys(selectedSections).filter(key => selectedSections[key])
      }
    };

    if (selectedSections.dashboard) {
      exportData.dashboard = {
        totalEmissions,
        complianceScore: calculateOverallCompliance(),
        summary: "Dashboard overview with key metrics"
      };
    }

    if (selectedSections.ncc && calculatorData.ncc) {
      exportData.ncc = calculatorData.ncc;
    }

    if (selectedSections.nabers && calculatorData.nabers) {
      exportData.nabers = calculatorData.nabers;
    }

    if (selectedSections.lca && calculatorData.lca) {
      exportData.lca = calculatorData.lca;
    }

    if (selectedSections.scope && calculatorData.scope) {
      exportData.scope = calculatorData.scope;
    }

    if (selectedSections.leed && calculatorData.leed) {
      exportData.leed = calculatorData.leed;
    }

    if (selectedSections.breeam && calculatorData.breeam) {
      exportData.breeam = calculatorData.breeam;
    }

    if (selectedSections.greenstar && calculatorData.greenStar) {
      exportData.greenstar = calculatorData.greenStar;
    }

    return exportData;
  };

  const calculateOverallCompliance = () => {
    let compliantCount = 0;
    let totalCount = 0;
    
    if (calculatorData.ncc?.isCompliant !== undefined) {
      totalCount++;
      if (calculatorData.ncc.isCompliant) compliantCount++;
    }
    if (calculatorData.nabers?.overallRating) {
      totalCount++;
      if (calculatorData.nabers.overallRating >= 4) compliantCount++;
    }
    if (calculatorData.leed?.certificationLevel) {
      totalCount++;
      if (calculatorData.leed.certificationLevel !== 'Not Certified') compliantCount++;
    }
    if (calculatorData.breeam?.rating) {
      totalCount++;
      if (calculatorData.breeam.rating !== 'Unclassified') compliantCount++;
    }
    
    return totalCount > 0 ? Math.round((compliantCount / totalCount) * 100) : 0;
  };

  const exportToCSV = (data: any) => {
    const csvRows = [];
    csvRows.push(['Section', 'Metric', 'Value', 'Unit']);
    
    // Dashboard data
    if (data.dashboard) {
      csvRows.push(['Dashboard', 'Total Emissions', data.dashboard.totalEmissions / 1000, 't CO₂-e']);
      csvRows.push(['Dashboard', 'Compliance Score', data.dashboard.complianceScore, '%']);
    }
    
    // Individual calculator data
    Object.keys(data).forEach(section => {
      if (section !== 'metadata' && section !== 'dashboard' && data[section]) {
        const sectionData = data[section];
        Object.keys(sectionData).forEach(key => {
          if (typeof sectionData[key] === 'number') {
            csvRows.push([section.toUpperCase(), key, sectionData[key], '']);
          }
        });
      }
    });
    
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carbon-calculator-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = (data: any) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carbon-calculator-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = async (data: any) => {
    try {
      // Import jsPDF dynamically to avoid bundle size issues
      const jsPDF = (await import('jspdf')).default;
      const autoTable = (await import('jspdf-autotable')).default;
      
      const doc = new jsPDF();
      
      // Header with branding
      doc.setFontSize(24);
      doc.setTextColor(40, 116, 166);
      doc.text('CarbonConstruct', 20, 20);
      
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text('Carbon Footprint Assessment Report', 20, 35);
      
      // Summary section
      doc.setFontSize(14);
      doc.text(`Total Emissions: ${(data.metadata.totalEmissions / 1000).toFixed(2)} t CO₂-e`, 20, 55);
      doc.text(`Compliance Score: ${calculateOverallCompliance()}%`, 20, 65);
      doc.text(`Export Date: ${new Date(data.metadata.exportDate).toLocaleDateString()}`, 20, 75);
      doc.text(`Calculators Used: ${data.metadata.calculatorsUsed.join(', ')}`, 20, 85);
      
      // Create detailed table data
      const tableData: any[] = [];
      Object.keys(data).forEach(section => {
        if (section !== 'metadata' && data[section]) {
          const sectionData = data[section];
          Object.keys(sectionData).forEach(key => {
            if (typeof sectionData[key] === 'number') {
              tableData.push([
                section.toUpperCase(), 
                key.replace(/([A-Z])/g, ' $1').trim(), 
                sectionData[key].toFixed(2), 
                key.includes('Emissions') ? 'kg CO₂-e' : ''
              ]);
            }
          });
        }
      });
      
      // Add table with styling
      (doc as any).autoTable({
        startY: 100,
        head: [['Calculator', 'Metric', 'Value', 'Unit']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [40, 116, 166] },
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 80 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 }
        }
      });
      
      // Footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(`Generated by CarbonConstruct | Page ${i} of ${pageCount}`, 20, 280);
        doc.text(new Date().toLocaleString(), 150, 280);
      }
      
      doc.save(`carbon-footprint-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF Export Error",
        description: "Failed to generate PDF. Please try again or use CSV/JSON export.",
        variant: "destructive",
      });
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const exportData = generateExportData();
      
      switch (exportFormat) {
        case 'csv':
          exportToCSV(exportData);
          break;
        case 'json':
          exportToJSON(exportData);
          break;
        case 'pdf':
          await exportToPDF(exportData);
          break;
        default:
          throw new Error('Unsupported export format');
      }
      
      toast({
        title: "Export Successful",
        description: `Data exported as ${exportFormat.toUpperCase()} format.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const shareData = async () => {
    const exportData = generateExportData();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Carbon Calculator Results',
          text: `Total Emissions: ${(totalEmissions / 1000).toFixed(1)} t CO₂-e`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      toast({
        title: "Data Copied",
        description: "Calculation results copied to clipboard.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export & Share Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Format Selection */}
        <div className="space-y-2">
          <Label>Export Format</Label>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF Report
                </div>
              </SelectItem>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV Data
                </div>
              </SelectItem>
              <SelectItem value="json">
                <div className="flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  JSON Data
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Section Selection */}
        <div className="space-y-3">
          <Label>Include Sections</Label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(selectedSections).map(([section, selected]) => (
              <div key={section} className="flex items-center space-x-2">
                <Checkbox
                  id={section}
                  checked={selected}
                  onCheckedChange={() => handleSectionToggle(section)}
                />
                <Label htmlFor={section} className="text-sm capitalize">
                  {section === 'greenstar' ? 'Green Star' : section}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex gap-3">
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={shareData}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Export Preview */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Export Preview</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>• Total Emissions: {(totalEmissions / 1000).toFixed(1)} t CO₂-e</div>
            <div>• Compliance Score: {calculateOverallCompliance()}%</div>
            <div>• Sections: {Object.values(selectedSections).filter(Boolean).length} selected</div>
            <div>• Format: {exportFormat.toUpperCase()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};