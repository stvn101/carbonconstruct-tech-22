import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Package, Truck, Recycle } from 'lucide-react';

export type LifecyclePhase = 'embodied' | 'transport' | 'end-of-life' | 'all';

interface LifecyclePhaseFilterProps {
  activePhase: LifecyclePhase;
  onPhaseChange: (phase: LifecyclePhase) => void;
  emissionsByPhase?: {
    embodied: number;
    transport: number;
    endOfLife: number;
  };
  className?: string;
}

const phaseConfig = {
  embodied: {
    label: 'Embodied Carbon',
    shortLabel: 'Embodied',
    icon: Package,
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    activeColor: 'bg-green-500 text-white',
    description: 'Cradle-to-gate emissions (A1-A3)'
  },
  transport: {
    label: 'Transport',
    shortLabel: 'Transport', 
    icon: Truck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    activeColor: 'bg-blue-500 text-white',
    description: 'Transport to site (A4)'
  },
  'end-of-life': {
    label: 'End-of-Life',
    shortLabel: 'EOL',
    icon: Recycle,
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50 border-purple-200',
    activeColor: 'bg-purple-500 text-white',
    description: 'Disposal and benefits (C1-C4, D)'
  },
  all: {
    label: 'All Phases',
    shortLabel: 'All',
    icon: Package,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 border-gray-200', 
    activeColor: 'bg-gray-500 text-white',
    description: 'Complete lifecycle assessment'
  }
};

const LifecyclePhaseFilter: React.FC<LifecyclePhaseFilterProps> = ({
  activePhase,
  onPhaseChange,
  emissionsByPhase,
  className
}) => {
  const phases: LifecyclePhase[] = ['all', 'embodied', 'transport', 'end-of-life'];

  const formatEmissions = (value: number) => {
    if (value < 1000) return `${value.toFixed(1)} kg`;
    return `${(value / 1000).toFixed(1)} t`;
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">
            Lifecycle Phase Filter
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {phases.map((phase) => {
              const config = phaseConfig[phase];
              const IconComponent = config.icon;
              const isActive = activePhase === phase;
              
              let emissions = 0;
              if (emissionsByPhase && phase !== 'all') {
                switch (phase) {
                  case 'embodied':
                    emissions = emissionsByPhase.embodied;
                    break;
                  case 'transport':
                    emissions = emissionsByPhase.transport;
                    break;
                  case 'end-of-life':
                    emissions = emissionsByPhase.endOfLife;
                    break;
                }
              } else if (emissionsByPhase && phase === 'all') {
                emissions = emissionsByPhase.embodied + emissionsByPhase.transport + emissionsByPhase.endOfLife;
              }

              return (
                <Button
                  key={phase}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPhaseChange(phase)}
                  className={cn(
                    'flex flex-col h-auto p-3 text-center transition-all duration-200',
                    isActive 
                      ? config.activeColor
                      : `${config.bgColor} hover:${config.activeColor} ${config.color}`
                  )}
                >
                  <IconComponent className="h-4 w-4 mb-1" />
                  <span className="text-xs font-medium mb-1">
                    {config.shortLabel}
                  </span>
                  {emissionsByPhase && (
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        'text-xs px-1 py-0',
                        isActive ? 'bg-white/20 text-white' : 'bg-white/50'
                      )}
                    >
                      {formatEmissions(emissions)}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LifecyclePhaseFilter;