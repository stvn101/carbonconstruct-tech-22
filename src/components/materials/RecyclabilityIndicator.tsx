
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Recycle } from 'lucide-react';

interface RecyclabilityIndicatorProps {
  recyclability?: 'High' | 'Medium' | 'Low' | string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RecyclabilityIndicator: React.FC<RecyclabilityIndicatorProps> = ({
  recyclability,
  showIcon = true,
  size = 'md',
  className = ''
}) => {
  if (!recyclability) return null;

  // Normalize recyclability value
  const normalizedRecyclability = recyclability.charAt(0).toUpperCase() + recyclability.slice(1).toLowerCase();
  
  // Traffic light colors based on recyclability
  const getTrafficLightStyle = (level: string) => {
    switch (level) {
      case 'High':
        return {
          color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
          emoji: '🟢',
          textColor: 'text-green-700'
        };
      case 'Medium':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100',
          emoji: '🟠',
          textColor: 'text-orange-700'
        };
      case 'Low':
        return {
          color: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
          emoji: '🔴',
          textColor: 'text-red-700'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100',
          emoji: '⚪',
          textColor: 'text-gray-700'
        };
    }
  };

  const style = getTrafficLightStyle(normalizedRecyclability);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <Badge 
      className={`${style.color} ${sizeClasses[size]} flex items-center gap-1 font-medium ${className}`}
      variant="outline"
    >
      {showIcon && <Recycle className="h-3 w-3" />}
      <span>{style.emoji}</span>
      <span>{normalizedRecyclability}</span>
    </Badge>
  );
};

export default RecyclabilityIndicator;
