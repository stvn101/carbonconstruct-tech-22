import { useCallback } from 'react';
import { toast } from 'sonner';

export interface CalculatorActions {
  resetAll: () => void;
  resetCalculator: (calculatorType: string) => void;
  applyTemplate: (template: any) => void;
  exportData: (format: 'pdf' | 'csv' | 'json') => void;
}

export const useCalculatorActions = (
  calculatorData: any,
  updateHandlers: Record<string, (data: any) => void>,
  totalEmissions: number
) => {
  const resetAll = useCallback(() => {
    // Reset all calculator states
    Object.keys(updateHandlers).forEach(calculatorType => {
      updateHandlers[calculatorType]({});
    });

    toast("All calculators reset", {
      description: "All calculation data has been cleared",
    });
  }, [updateHandlers]);

  const resetCalculator = useCallback((calculatorType: string) => {
    if (updateHandlers[calculatorType]) {
      updateHandlers[calculatorType]({});
      toast(`${calculatorType.toUpperCase()} calculator reset`, {
        description: "Calculator data has been cleared",
      });
    }
  }, [updateHandlers]);

  const applyTemplate = useCallback((template: any) => {
    // Apply template defaults to relevant calculators
    template.calculatorTypes.forEach((calculatorType: string) => {
      const defaults = template.defaultValues[calculatorType];
      if (defaults && updateHandlers[calculatorType]) {
        updateHandlers[calculatorType](defaults);
      }
    });

    toast("Template applied", {
      description: `${template.name} defaults have been applied to calculators`,
    });
  }, [updateHandlers]);

  const exportData = useCallback(async (format: 'pdf' | 'csv' | 'json') => {
    try {
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          totalEmissions,
          calculatorsUsed: Object.keys(calculatorData).filter(key => 
            calculatorData[key] && Object.keys(calculatorData[key]).length > 0
          )
        },
        ...calculatorData
      };

      switch (format) {
        case 'csv':
          await exportToCSV(exportData);
          break;
        case 'json':
          await exportToJSON(exportData);
          break;
        case 'pdf':
          await exportToPDF(exportData);
          break;
      }

      toast("Export successful", {
        description: `Data exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast("Export failed", {
        description: "There was an error exporting your data",
      });
    }
  }, [calculatorData, totalEmissions]);

  return {
    resetAll,
    resetCalculator,
    applyTemplate,
    exportData
  };
};

// Export utility functions
const exportToCSV = async (data: any) => {
  const csvRows = [['Section', 'Metric', 'Value', 'Unit']];
  
  Object.keys(data).forEach(section => {
    if (section !== 'metadata' && data[section]) {
      const sectionData = data[section];
      Object.keys(sectionData).forEach(key => {
        if (typeof sectionData[key] === 'number') {
          csvRows.push([section.toUpperCase(), key, sectionData[key].toString(), '']);
        }
      });
    }
  });
  
  const csvContent = csvRows.map(row => row.join(',')).join('\n');
  downloadFile(csvContent, 'text/csv', 'carbon-calculator-export.csv');
};

const exportToJSON = async (data: any) => {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, 'application/json', 'carbon-calculator-export.json');
};

const exportToPDF = async (data: any) => {
  // Import jsPDF dynamically to avoid bundle size issues
  const jsPDF = (await import('jspdf')).default;
  await import('jspdf-autotable');
  
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Carbon Footprint Report', 20, 20);
  
  // Summary
  doc.setFontSize(14);
  doc.text(`Total Emissions: ${(data.metadata.totalEmissions / 1000).toFixed(2)} t CO₂-e`, 20, 40);
  doc.text(`Export Date: ${new Date(data.metadata.exportDate).toLocaleDateString()}`, 20, 50);
  
  // Data table
  const tableData: any[] = [];
  Object.keys(data).forEach(section => {
    if (section !== 'metadata' && data[section]) {
      const sectionData = data[section];
      Object.keys(sectionData).forEach(key => {
        if (typeof sectionData[key] === 'number') {
          tableData.push([section.toUpperCase(), key, sectionData[key].toFixed(2), 'kg CO₂-e']);
        }
      });
    }
  });
  
  (doc as any).autoTable({
    startY: 70,
    head: [['Calculator', 'Metric', 'Value', 'Unit']],
    body: tableData,
  });
  
  doc.save('carbon-footprint-report.pdf');
};

const downloadFile = (content: string, mimeType: string, filename: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};