import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Star, Leaf, Zap, Award, Link, Brain, BarChart3, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HelpButton } from './help';
import { CalculatorActions } from './hooks/useCalculatorActions';

interface CalculatorTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onHelpModalOpen: (modal: string) => void;
  actions: CalculatorActions;
}

export const CalculatorTabs: React.FC<CalculatorTabsProps> = ({
  activeTab,
  onTabChange,
  onHelpModalOpen,
  actions
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'ncc', label: 'NCC', icon: Building, help: true },
    { id: 'nabers', label: 'NABERS', icon: Star, help: true },
    { id: 'lca', label: 'LCA', icon: Leaf, help: true },
    { id: 'scope', label: 'Scope 1-3', icon: Zap, help: true },
    { id: 'leed', label: 'LEED', icon: Award, help: true },
    { id: 'breeam', label: 'BREEAM', icon: Award, help: true },
    { id: 'greenstar', label: 'Green Star', icon: Star, help: true },
    { id: 'construction', label: 'Integrations', icon: Link },
    { id: 'ai', label: 'AI Assistant', icon: Brain },
    { id: 'admin', label: 'Admin Status', icon: Shield }
  ];

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1">
        <TabsList className="grid grid-cols-5 lg:grid-cols-11 w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2 relative">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.help && (
                  <HelpButton 
                    onClick={() => onHelpModalOpen(tab.id)} 
                    className="ml-1" 
                    asIcon 
                  />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Calculator-specific reset button */}
      {activeTab !== 'dashboard' && activeTab !== 'construction' && activeTab !== 'ai' && activeTab !== 'admin' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => actions.resetCalculator(activeTab)}
          className="text-destructive hover:text-destructive"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset {activeTab.toUpperCase()}
        </Button>
      )}
    </div>
  );
};