import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Shield, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

export type ComplianceStandard = 'ncc2025' | 'nabers' | 'greenstar';
export type ComplianceStatus = 'compliant' | 'warning' | 'breach' | 'unknown';

interface ComplianceFlagProps {
  standard: ComplianceStandard;
  status: ComplianceStatus;
  threshold?: number;
  currentValue?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'alert' | 'indicator';
  showDetails?: boolean;
  className?: string;
}

const standardConfig = {
  ncc2025: {
    label: 'NCC 2025',
    fullName: 'National Construction Code 2025',
    description: 'Australian building standards for energy efficiency and sustainability'
  },
  nabers: {
    label: 'NABERS',
    fullName: 'National Australian Built Environment Rating System', 
    description: 'Rating system for the environmental performance of buildings'
  },
  greenstar: {
    label: 'Green Star',
    fullName: 'Green Building Council of Australia Green Star',
    description: 'Sustainability rating tool for buildings in Australia'
  }
};

const statusConfig = {
  compliant: {
    label: 'Compliant',
    color: 'bg-green-100 text-green-800 hover:bg-green-100',
    borderColor: 'border-green-200',
    icon: CheckCircle,
    alertVariant: 'default' as const
  },
  warning: {
    label: 'Warning',
    color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100', 
    borderColor: 'border-yellow-200',
    icon: AlertTriangle,
    alertVariant: 'default' as const
  },
  breach: {
    label: 'Breach',
    color: 'bg-red-100 text-red-800 hover:bg-red-100',
    borderColor: 'border-red-200', 
    icon: XCircle,
    alertVariant: 'destructive' as const
  },
  unknown: {
    label: 'Unknown',
    color: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
    borderColor: 'border-gray-200',
    icon: Shield,
    alertVariant: 'default' as const
  }
};

const ComplianceFlag: React.FC<ComplianceFlagProps> = ({
  standard,
  status,
  threshold,
  currentValue,
  size = 'md',
  variant = 'badge',
  showDetails = true,
  className
}) => {
  const standardInfo = standardConfig[standard];
  const statusInfo = statusConfig[status];
  const IconComponent = statusInfo.icon;

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

  // Badge variant
  if (variant === 'badge') {
    const badge = (
      <Badge
        className={cn(
          statusInfo.color,
          statusInfo.borderColor,
          sizeClasses[size],
          'font-medium border flex items-center gap-1',
          className
        )}
      >
        <IconComponent className={iconSizes[size]} />
        {standardInfo.label}
      </Badge>
    );

    if (!showDetails) {
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
              <div className="font-medium">{standardInfo.fullName}</div>
              <div className="text-muted-foreground mt-1">
                Status: {statusInfo.label}
              </div>
              {threshold && currentValue && (
                <div className="mt-2 text-xs">
                  <div>Current: {currentValue.toFixed(1)}</div>
                  <div>Threshold: {threshold.toFixed(1)}</div>
                </div>
              )}
              <div className="mt-2 max-w-xs text-xs">
                {standardInfo.description}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Alert variant
  if (variant === 'alert') {
    return (
      <Alert className={cn(statusInfo.borderColor, className)} variant={statusInfo.alertVariant}>
        <IconComponent className="h-4 w-4" />
        <AlertDescription>
          <div className="flex justify-between items-start">
            <div>
              <span className="font-medium">{standardInfo.label}</span>
              <span className="ml-2">{statusInfo.label}</span>
            </div>
            {threshold && currentValue && (
              <div className="text-xs text-muted-foreground">
                {currentValue.toFixed(1)} / {threshold.toFixed(1)}
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Indicator variant (simple icon)
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <IconComponent className={cn(iconSizes[size], statusInfo.color.replace('bg-', 'text-').replace('-100', '-600'))} />
      {showDetails && (
        <span className={cn('text-sm', statusInfo.color.replace('bg-', 'text-').replace('-100', '-600'))}>
          {standardInfo.label}
        </span>
      )}
    </div>
  );
};

export default ComplianceFlag;