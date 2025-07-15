// CarbonConstruct Quality Gates Configuration
export interface QualityGateConfig {
  coverage: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  performance: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    totalBlockingTime: number;
  };
  accessibility: {
    wcagLevel: 'AA' | 'AAA';
    violations: number;
  };
  security: {
    vulnerabilities: {
      critical: number;
      high: number;
      medium: number;
    };
  };
  bundle: {
    maxSize: number; // in KB
    unusedCode: number; // percentage
  };
}

export const qualityGateConfig: QualityGateConfig = {
  coverage: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80,
  },
  performance: {
    firstContentfulPaint: 2000, // ms
    largestContentfulPaint: 4000, // ms
    cumulativeLayoutShift: 0.1,
    totalBlockingTime: 300, // ms
  },
  accessibility: {
    wcagLevel: 'AA',
    violations: 0,
  },
  security: {
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 5, // Allow up to 5 medium severity issues
    },
  },
  bundle: {
    maxSize: 2048, // 2MB max bundle size
    unusedCode: 20, // Max 20% unused code
  },
};

/**
 * Validate quality gates
 * @param metrics - Current project metrics
 * @returns Quality gate results
 */
export const validateQualityGates = (metrics: any) => {
  const results = {
    passed: true,
    failures: [] as string[],
    warnings: [] as string[],
  };

  // Coverage checks
  if (metrics.coverage) {
    Object.entries(qualityGateConfig.coverage).forEach(([key, threshold]) => {
      if (metrics.coverage[key] < threshold) {
        results.passed = false;
        results.failures.push(`Coverage ${key}: ${metrics.coverage[key]}% < ${threshold}%`);
      }
    });
  }

  // Performance checks
  if (metrics.performance) {
    Object.entries(qualityGateConfig.performance).forEach(([key, threshold]) => {
      if (metrics.performance[key] > threshold) {
        results.passed = false;
        results.failures.push(`Performance ${key}: ${metrics.performance[key]} > ${threshold}`);
      }
    });
  }

  // Security checks
  if (metrics.security) {
    const vulns = metrics.security.vulnerabilities;
    if (vulns.critical > qualityGateConfig.security.vulnerabilities.critical) {
      results.passed = false;
      results.failures.push(`Critical vulnerabilities: ${vulns.critical} > 0`);
    }
    if (vulns.high > qualityGateConfig.security.vulnerabilities.high) {
      results.passed = false;
      results.failures.push(`High vulnerabilities: ${vulns.high} > 0`);
    }
    if (vulns.medium > qualityGateConfig.security.vulnerabilities.medium) {
      results.warnings.push(`Medium vulnerabilities: ${vulns.medium} > ${qualityGateConfig.security.vulnerabilities.medium}`);
    }
  }

  // Bundle size checks
  if (metrics.bundle) {
    if (metrics.bundle.size > qualityGateConfig.bundle.maxSize) {
      results.passed = false;
      results.failures.push(`Bundle size: ${metrics.bundle.size}KB > ${qualityGateConfig.bundle.maxSize}KB`);
    }
    if (metrics.bundle.unusedCode > qualityGateConfig.bundle.unusedCode) {
      results.warnings.push(`Unused code: ${metrics.bundle.unusedCode}% > ${qualityGateConfig.bundle.unusedCode}%`);
    }
  }

  return results;
};