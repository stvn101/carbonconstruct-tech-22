import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  Info, 
  TrendingDown, 
  Lightbulb,
  Target,
  Leaf
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HelpTooltipProps {
  content: string;
  title?: string;
  icon?: 'help' | 'info' | 'trend' | 'lightbulb' | 'target' | 'leaf';
  size?: 'sm' | 'md' | 'lg';
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  title,
  icon = 'help',
  size = 'sm'
}) => {
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  };

  const IconComponent = {
    help: HelpCircle,
    info: Info,
    trend: TrendingDown,
    lightbulb: Lightbulb,
    target: Target,
    leaf: Leaf
  }[icon];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto w-auto text-muted-foreground hover:text-foreground"
          >
            <IconComponent className={iconSizes[size]} />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          {title && <div className="font-medium mb-1">{title}</div>}
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HelpTooltip;