
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileSustainabilityTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
}

const MobileSustainabilityTabs: React.FC<MobileSustainabilityTabsProps> = ({
  activeTab,
  onTabChange,
  tabs
}) => {
  const { isMobile } = useIsMobile();
  
  if (!isMobile) return null;

  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < tabs.length - 1;

  const goToPrev = () => {
    if (canGoPrev) {
      onTabChange(tabs[currentIndex - 1].id);
    }
  };

  const goToNext = () => {
    if (canGoNext) {
      onTabChange(tabs[currentIndex + 1].id);
    }
  };

  return (
    <div className="flex items-center justify-between bg-background border-b border-border px-4 py-3 mb-4 sticky top-0 z-10 rounded-t-lg">
      <Button
        variant="ghost"
        size="sm"
        onClick={goToPrev}
        disabled={!canGoPrev}
        className="p-2 touch-target"
        aria-label="Previous tab"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center space-x-2 text-center">
        <span className="text-lg" role="img" aria-label={tabs[currentIndex]?.label}>
          {tabs[currentIndex]?.icon}
        </span>
        <div className="flex flex-col">
          <span className="font-medium text-sm">{tabs[currentIndex]?.label}</span>
          <span className="text-xs text-muted-foreground">
            {currentIndex + 1} of {tabs.length}
          </span>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={goToNext}
        disabled={!canGoNext}
        className="p-2 touch-target"
        aria-label="Next tab"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MobileSustainabilityTabs;
