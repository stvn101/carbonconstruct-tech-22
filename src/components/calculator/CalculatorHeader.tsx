import React from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, Save, FileText, RotateCcw, Download } from 'lucide-react';
import { SaveCalculationDialog } from './SaveCalculationDialog';
import { CalculatorActions } from './hooks/useCalculatorActions';

interface CalculatorHeaderProps {
  totalEmissions: number;
  complianceScore: number;
  isSaving: boolean;
  user: any;
  actions: CalculatorActions;
  onSave: (name: string) => Promise<boolean>;
}

export const CalculatorHeader: React.FC<CalculatorHeaderProps> = ({
  totalEmissions,
  complianceScore,
  isSaving,
  user,
  actions,
  onSave
}) => {
  return (
    <div className="bg-card shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-lg">
              <Calculator className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">Carbon Calculator Pro</h1>
              <p className="text-muted-foreground">Comprehensive Environmental Impact Assessment with AI</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Emissions</div>
              <div className="text-lg font-bold text-destructive">
                {(totalEmissions / 1000).toFixed(1)} t CO₂-e
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={actions.resetAll}
                className="text-destructive hover:text-destructive"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => actions.exportData('pdf')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              
              <SaveCalculationDialog
                onSave={onSave}
                isSaving={isSaving}
                totalEmissions={totalEmissions}
                complianceScore={complianceScore}
              >
                <Button variant="outline">
                  <Save className="w-4 h-4 mr-2" />
                  {user ? 'Save' : 'Sign in to Save'}
                </Button>
              </SaveCalculationDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};