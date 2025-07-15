import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Leaf, AlertTriangle, XCircle } from 'lucide-react';

export type EmbodiedCarbonLevel = 'low' | 'medium' | 'high';

interface EmbodiedCarbonClassifierProps {
  carbonIntensity: number; // kg CO₂e/kg
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showTooltip?: boolean;
  className?: string;
}

// Classification thresholds (kg CO₂e/kg)
const THRESHOLDS = {
  low: 50,
  medium: 150
};

const getClassification = (intensity: number): EmbodiedCarbonLevel => {
  if (intensity < THRESHOLDS.low) return 'low';
  if (intensity < THRESHOLDS.medium) return 'medium';
  return 'high';
};

const classificationConfig = {
  low: {
    label: 'Low EC',
    fullLabel: 'Low Embodied Carbon',
    color: 'bg-green-100 text-green-800 hover:bg-green-100',
    icon: Leaf,
    description: 'Materials with low embodied carbon (< 50 kg CO₂e/kg). Excellent sustainability choice.',
    borderColor: 'border-green-200'
  },
  medium: {
    label: 'Medium EC', 
    fullLabel: 'Medium Embodied Carbon',
    color: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
    icon: AlertTriangle,
    description: 'Materials with moderate embodied carbon (50-150 kg CO₂e/kg). Consider alternatives when possible.',
    borderColor: 'border-orange-200'
  },
  high: {
    label: 'High EC',
    fullLabel: 'High Embodied Carbon', 
    color: 'bg-red-100 text-red-800 hover:bg-red-100',
    icon: XCircle,
    description: 'Materials with high embodied carbon (> 150 kg CO₂e/kg). Explore low-carbon alternatives.',
    borderColor: 'border-red-200'
  }
};

const EmbodiedCarbonClassifier: React.FC<EmbodiedCarbonClassifierProps> = ({
  carbonIntensity,
  size = 'md',
  showIcon = true,
  showTooltip = true,
  className
}) => {
  const classification = getClassification(carbonIntensity);
  const config = classificationConfig[classification];
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  };

  const badge = (
    <Badge
      className={cn(
        config.color,
        config.borderColor,
        sizeClasses[size],
        'font-medium border flex items-center gap-1',
        className
      )}
    >
      {showIcon && <IconComponent className={iconSizes[size]} />}
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
          <div className="text-sm">
            <div className="font-medium">{config.fullLabel}</div>
            <div className="text-muted-foreground mt-1">
              {carbonIntensity.toFixed(1)} kg CO₂e/kg
            </div>
            <div className="mt-2 max-w-xs text-xs">
              {config.description}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EmbodiedCarbonClassifier;