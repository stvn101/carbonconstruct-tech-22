
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CalculationResult } from './carbonExports';

interface ExportData {
  materials: any[];
  transport: any[];
  energy: any[];
}

export const exportToPDF = async (result: CalculationResult, data: ExportData): Promise<void> => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Carbon Footprint Report', 20, 20);
  
  // Summary
  doc.setFontSize(14);
  doc.text(`Total Emissions: ${result.totalEmissions.toFixed(2)} kg CO₂e`, 20, 40);
  
  // Materials breakdown
  if (data.materials.length > 0) {
    doc.setFontSize(12);
    doc.text('Materials Breakdown:', 20, 60);
    
    const materialData = data.materials.map(m => [
      m.name || m.type,
      m.quantity?.toString() || '0',
      m.unit || '',
      (m.carbonFootprint || 0).toFixed(2)
    ]);
    
    (doc as any).autoTable({
      startY: 70,
      head: [['Material', 'Quantity', 'Unit', 'Emissions (kg CO₂e)']],
      body: materialData,
    });
  }
  
  // Save the PDF
  doc.save('carbon-footprint-report.pdf');
};
