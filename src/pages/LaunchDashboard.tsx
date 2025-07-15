import React from 'react';
import { useEffect } from 'react';
import LaunchDashboard from '@/components/launch/LaunchDashboard';
import { useA11y } from '@/hooks/useA11y';
import SEO from '@/components/SEO';

const LaunchDashboardPage: React.FC = () => {
  useA11y({
    title: "Launch Dashboard - CarbonConstruct",
    announceRouteChanges: true,
  });

  return (
    <>
      <SEO 
        title="Launch Dashboard - CarbonConstruct"
        description="Monitor CarbonConstruct's production deployment status, metrics, and system health"
        canonical="/launch-dashboard"
        keywords="launch dashboard, deployment status, system health, production metrics"
        type="website"
      />
      <div className="min-h-screen bg-background">
        <LaunchDashboard />
      </div>
    </>
  );
};

export default LaunchDashboardPage;