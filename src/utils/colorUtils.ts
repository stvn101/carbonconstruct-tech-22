/**
 * Color utilities for consistent semantic color usage across the application
 * This replaces hardcoded color values with theme-aware semantic tokens
 */

export const semanticColors = {
  // Status colors
  success: 'text-success',
  warning: 'text-warning', 
  error: 'text-destructive',
  info: 'text-info',
  
  // Background variants
  successBg: 'bg-success',
  warningBg: 'bg-warning',
  errorBg: 'bg-destructive',
  infoBg: 'bg-info',
  
  // Hover variants
  successHover: 'hover:bg-success/90',
  warningHover: 'hover:bg-warning/90',
  errorHover: 'hover:bg-destructive/90',
  infoHover: 'hover:bg-info/90',
  
  // Border variants
  successBorder: 'border-success',
  warningBorder: 'border-warning',
  errorBorder: 'border-destructive',
  infoBorder: 'border-info',
  
  // Light background variants for cards/alerts
  successLight: 'bg-success/10',
  warningLight: 'bg-warning/10',
  errorLight: 'bg-destructive/10',
  infoLight: 'bg-info/10',
} as const;

/**
 * Get status color class based on score or value
 */
export const getStatusColor = (score: number, thresholds = { good: 70, warning: 40 }) => {
  if (score >= thresholds.good) return semanticColors.success;
  if (score >= thresholds.warning) return semanticColors.warning;
  return semanticColors.error;
};

/**
 * Get background color class based on score or value
 */
export const getStatusBgColor = (score: number, thresholds = { good: 70, warning: 40 }) => {
  if (score >= thresholds.good) return semanticColors.successBg;
  if (score >= thresholds.warning) return semanticColors.warningBg;
  return semanticColors.errorBg;
};

/**
 * Get badge variant based on status
 */
export const getBadgeVariant = (status: 'success' | 'warning' | 'error' | 'info') => {
  switch (status) {
    case 'success': return 'default';
    case 'warning': return 'secondary';
    case 'error': return 'destructive';
    case 'info': return 'outline';
    default: return 'outline';
  }
};

/**
 * Compliance color mapping for different standards
 */
export const complianceColors = {
  ncc: {
    compliant: semanticColors.success,
    warning: semanticColors.warning,
    breach: semanticColors.error,
  },
  nabers: {
    excellent: semanticColors.success,
    good: semanticColors.info,
    average: semanticColors.warning,
    poor: semanticColors.error,
  },
  greenstar: {
    worldLeadership: semanticColors.success,
    excellence: semanticColors.info,
    bestPractice: semanticColors.warning,
    goodPractice: semanticColors.warning,
    notCertified: semanticColors.error,
  }
} as const;