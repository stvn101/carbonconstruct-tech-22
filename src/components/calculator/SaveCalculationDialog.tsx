import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Save, Loader2, Clock, TrendingUp } from 'lucide-react';

interface SaveCalculationDialogProps {
  onSave: (name: string) => Promise<boolean>;
  isSaving: boolean;
  totalEmissions: number;
  complianceScore: number;
  children: React.ReactNode;
}

export const SaveCalculationDialog: React.FC<SaveCalculationDialogProps> = ({
  onSave,
  isSaving,
  totalEmissions,
  complianceScore,
  children
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const success = await onSave(name.trim());
    if (success) {
      setName('');
      setOpen(false);
    }
  };

  const generateName = () => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setName(`Carbon Calculation - ${date} ${time}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Save Calculation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Calculation Summary */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-red-600" />
                  <div>
                    <div className="text-sm text-muted-foreground">Total Emissions</div>
                    <div className="font-bold text-red-600">
                      {(totalEmissions / 1000).toFixed(1)} t CO₂-e
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-sm text-muted-foreground">Compliance</div>
                    <div className="font-bold text-green-600">
                      {complianceScore}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="calculation-name">Calculation Name</Label>
              <div className="flex gap-2">
                <Input
                  id="calculation-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter a name for your calculation..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateName}
                  className="shrink-0"
                >
                  <Clock className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!name.trim() || isSaving}
                className="flex-1"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};