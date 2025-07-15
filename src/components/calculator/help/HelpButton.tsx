import React from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpButtonProps {
  onClick: () => void;
  className?: string;
  asIcon?: boolean; // New prop to render as icon only for nested contexts
}

export const HelpButton: React.FC<HelpButtonProps> = ({ onClick, className, asIcon = false }) => {
  // If used inside interactive elements (like TabsTrigger), render as icon only
  if (asIcon) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={`inline-flex items-center justify-center h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors ${className}`}
        title="Help & Tutorial"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onClick();
          }
        }}
      >
        <HelpCircle className="h-3 w-3" />
      </div>
    );
  }

  // Default button implementation for standalone use
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center h-8 w-8 p-0 text-muted-foreground hover:text-foreground border-0 bg-transparent hover:bg-accent rounded-md transition-colors ${className}`}
      title="Help & Tutorial"
    >
      <HelpCircle className="h-4 w-4" />
    </button>
  );
};