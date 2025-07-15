import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertCircle, Info, Target } from 'lucide-react';

interface HelpSection {
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface CalculatorHelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  purpose: string;
  nccRelevance: string;
  sections: HelpSection[];
  quickStart?: string[];
  commonErrors?: string[];
}

export const CalculatorHelpModal: React.FC<CalculatorHelpModalProps> = ({
  open,
  onOpenChange,
  title,
  purpose,
  nccRelevance,
  sections,
  quickStart = [],
  commonErrors = []
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Target className="h-6 w-6 text-primary" />
            {title} - How to Use
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Purpose & NCC Relevance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Info className="h-4 w-4 text-blue-600" />
                  Purpose
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{purpose}</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  NCC Compliance
                  <Badge variant="outline" className="text-xs">Required</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{nccRelevance}</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Start */}
          {quickStart.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Start Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {quickStart.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Detailed Sections */}
          <div className="space-y-4">
            {sections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {section.content}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Common Errors */}
          {commonErrors.length > 0 && (
            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Common Errors to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {commonErrors.map((error, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-1.5 h-1.5 bg-amber-600 rounded-full mt-2" />
                      <span className="text-sm text-muted-foreground">{error}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};