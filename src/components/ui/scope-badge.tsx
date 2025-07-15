import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type EmissionScope = 'scope1' | 'scope2' | 'scope3' | 'combined';

interface ScopeBadgeProps {
  scope: EmissionScope;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

const scopeConfig = {
  scope1: {
    label: 'Scope 1',
    color: 'bg-red-100 text-red-800 hover:bg-red-100',
    description: 'Direct emissions from owned or controlled sources (fuel combustion, company vehicles, etc.)'
  },
  scope2: {
    label: 'Scope 2', 
    color: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
    description: 'Indirect emissions from purchased electricity, steam, heating and cooling'
  },
  scope3: {
    label: 'Scope 3',
    color: 'bg-blue-100 text-blue-800 hover:bg-blue-100', 
    description: 'All other indirect emissions in the value chain (upstream and downstream activities)'
  },
  combined: {
    label: 'All Scopes',
    color: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
    description: 'Combined emissions across all scopes'
  }
};

const ScopeBadge: React.FC<ScopeBadgeProps> = ({ 
  scope, 
  size = 'md', 
  showTooltip = true,
  className 
}) => {
  const config = scopeConfig[scope];
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1', 
    lg: 'text-base px-3 py-1.5'
  };

  const badge = (
    <Badge 
      className={cn(
        config.color,
        sizeClasses[size],
        'font-medium border-0',
        className
      )}
    >
      {config.label}
    </Badge>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm max-w-xs">{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ScopeBadge;