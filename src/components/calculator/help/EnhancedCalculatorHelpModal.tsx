import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Info, Target, Search, Zap, BookOpen, Star, Clock } from 'lucide-react';

interface HelpSection {
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
  isCompliance?: boolean;
  estimatedTime?: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

interface EnhancedCalculatorHelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  purpose: string;
  nccRelevance: string;
  sections: HelpSection[];
  quickStart?: string[];
  commonErrors?: string[];
  quickActions?: QuickAction[];
  completionRate?: number;
}

export const EnhancedCalculatorHelpModal: React.FC<EnhancedCalculatorHelpModalProps> = ({
  open,
  onOpenChange,
  title,
  purpose,
  nccRelevance,
  sections,
  quickStart = [],
  commonErrors = [],
  quickActions = [],
  completionRate = 0
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredSections = useMemo(() => {
    if (!searchQuery) return sections;
    return sections.filter(section => 
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sections, searchQuery]);

  const priorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(quickActions.map(action => action.category));
    return ['all', ...Array.from(cats)];
  }, [quickActions]);

  const filteredQuickActions = selectedCategory === 'all' 
    ? quickActions 
    : quickActions.filter(action => action.category === selectedCategory);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Target className="h-6 w-6 text-primary" />
            {title} - Enhanced Guide
          </DialogTitle>
          {completionRate > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                Progress: {completionRate}% Complete
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Enhanced Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Purpose & NCC Relevance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-primary/20 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Info className="h-4 w-4 text-blue-600" />
                  Purpose & Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{purpose}</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  NCC Compliance Status
                  <Badge variant="destructive" className="text-xs animate-pulse">
                    <Star className="h-3 w-3 mr-1" />
                    MANDATORY
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{nccRelevance}</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <Card className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="h-4 w-4 text-purple-600" />
                  Quick Setup Actions
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="text-xs"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredQuickActions.map((action, index) => (
                    <Card key={index} className="p-3 hover:shadow-md transition-shadow cursor-pointer" onClick={action.action}>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                          {action.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{action.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Quick Start */}
          {quickStart.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                  Step-by-Step Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {quickStart.map((step, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-slate-50/50 to-gray-50/50 dark:from-slate-950/20 dark:to-gray-950/20">
                      <span className="flex-shrink-0 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium shadow-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <span className="text-sm font-medium">{step}</span>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Step {index + 1} of {quickStart.length}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Enhanced Detailed Sections */}
          <div className="space-y-4">
            {filteredSections.map((section, index) => (
              <Card key={index} className={section.isCompliance ? "border-l-4 border-l-green-500" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    {section.icon}
                    {section.title}
                    {section.priority && (
                      <Badge variant={priorityColor(section.priority)} className="text-xs">
                        {section.priority.toUpperCase()}
                      </Badge>
                    )}
                    {section.isCompliance && (
                      <Badge variant="success" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        NCC Required
                      </Badge>
                    )}
                    {section.estimatedTime && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {section.estimatedTime}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {section.content}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enhanced Common Errors */}
          {commonErrors.length > 0 && (
            <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Critical Errors to Avoid
                  <Badge variant="warning" className="text-xs animate-pulse">
                    HIGH IMPACT
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {commonErrors.map((error, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-slate-900/20">
                      <span className="flex-shrink-0 w-2 h-2 bg-amber-600 rounded-full mt-2" />
                      <div>
                        <span className="text-sm font-medium text-foreground">{error}</span>
                        <div className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                          ⚠️ This error can cause compliance failures
                        </div>
                      </div>
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