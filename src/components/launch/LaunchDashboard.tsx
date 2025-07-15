import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Rocket, 
  Activity, 
  Users, 
  Calculator, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  TrendingUp,
  Settings,
  BarChart3
} from 'lucide-react';
import LaunchService from '@/services/launch/LaunchService';
import DeploymentService from '@/services/deployment/DeploymentService';

const LaunchDashboard: React.FC = () => {
  const [launchService] = useState(() => new LaunchService());
  const [deploymentService] = useState(() => new DeploymentService());
  const [launchData, setLaunchData] = useState(launchService.getLaunchDashboard());
  const [deploymentData, setDeploymentData] = useState(deploymentService.generateLaunchReport());
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const updateData = () => {
      setLaunchData(launchService.getLaunchDashboard());
      setDeploymentData(deploymentService.generateLaunchReport());
      setLastUpdated(new Date());
    };

    // Update every 30 seconds
    const interval = setInterval(updateData, 30000);
    return () => clearInterval(interval);
  }, [launchService, deploymentService]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'healthy':
      case 'completed':
        return 'bg-green-500';
      case 'warning':
      case 'degraded':
        return 'bg-yellow-500';
      case 'critical':
      case 'failed':
      case 'rolled back':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Rocket className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Launch Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            CarbonConstruct production deployment status and metrics
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-lg sm:text-2xl font-bold">{launchData.overview.status}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(launchData.overview.status)}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Current Phase</p>
                <p className="text-lg sm:text-2xl font-bold">{launchData.overview.currentPhase}</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-lg sm:text-2xl font-bold">{launchData.metrics.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Calculations</p>
                <p className="text-lg sm:text-2xl font-bold">{launchData.metrics.successfulCalculations}</p>
              </div>
              <Calculator className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {launchData.recommendations.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Recommendations:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {launchData.recommendations.map((rec, index) => (
                <li key={index} className="text-sm">{rec}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="phases">Phases</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Launch Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Launch Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Launch Date:</span>
                    <span className="font-medium">
                      {launchData.overview.launchDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Days Since Launch:</span>
                    <span className="font-medium">{launchData.overview.daysSinceLaunch}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress:</span>
                      <span className="font-medium">
                        {launchData.phases.filter(p => p.status === 'completed').length} / {launchData.phases.length} phases
                      </span>
                    </div>
                    <Progress 
                      value={(launchData.phases.filter(p => p.status === 'completed').length / launchData.phases.length) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Error Rate:</span>
                    <span className={`font-medium ${launchData.metrics.errorRate > 2 ? 'text-red-500' : 'text-green-500'}`}>
                      {launchData.metrics.errorRate.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Uptime:</span>
                    <span className="font-medium text-green-500">
                      {launchData.metrics.performanceMetrics.uptimePercentage.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg Load Time:</span>
                    <span className="font-medium">
                      {(launchData.metrics.performanceMetrics.averageLoadTime / 1000).toFixed(2)}s
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Flags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Feature Flags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(launchData.featureFlags).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between p-2 rounded-lg border">
                    <span className="text-sm font-medium capitalize">
                      {feature.replace(/-/g, ' ')}
                    </span>
                    <Badge variant={enabled ? 'default' : 'secondary'}>
                      {enabled ? 'ON' : 'OFF'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Active Users:</span>
                    <span className="font-bold text-lg">{launchData.metrics.activeUsers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Successful Calculations:</span>
                    <span className="font-bold text-lg">{launchData.metrics.successfulCalculations}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>User Feedback:</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">
                          {launchData.metrics.userFeedback.positive}
                        </div>
                        <div className="text-xs text-green-600">Positive</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-lg font-bold text-gray-600">
                          {launchData.metrics.userFeedback.neutral}
                        </div>
                        <div className="text-xs text-gray-600">Neutral</div>
                      </div>
                      <div className="p-2 bg-red-50 rounded">
                        <div className="text-lg font-bold text-red-600">
                          {launchData.metrics.userFeedback.negative}
                        </div>
                        <div className="text-xs text-red-600">Negative</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Core Web Vitals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Core Web Vitals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>LCP (Largest Contentful Paint):</span>
                    <span className="font-medium">
                      {(launchData.metrics.performanceMetrics.coreWebVitals.lcp / 1000).toFixed(2)}s
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>FID (First Input Delay):</span>
                    <span className="font-medium">
                      {launchData.metrics.performanceMetrics.coreWebVitals.fid.toFixed(0)}ms
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>CLS (Cumulative Layout Shift):</span>
                    <span className="font-medium">
                      {launchData.metrics.performanceMetrics.coreWebVitals.cls.toFixed(3)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="phases" className="space-y-4">
          <div className="space-y-4">
            {launchData.phases.map((phase, index) => (
              <Card key={phase.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(phase.status)}`} />
                      {phase.name}
                    </CardTitle>
                    <Badge variant={
                      phase.status === 'completed' ? 'default' :
                      phase.status === 'active' ? 'secondary' :
                      phase.status === 'failed' ? 'destructive' : 'outline'
                    }>
                      {phase.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{phase.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Success Criteria:</h4>
                      <ul className="text-xs space-y-1">
                        {phase.successCriteria.map((criterion, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {criterion}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Rollback Criteria:</h4>
                      <ul className="text-xs space-y-1">
                        {phase.rollbackCriteria.map((criterion, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <AlertTriangle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                            {criterion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {phase.startTime && (
                    <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                      <span>Started: {phase.startTime.toLocaleString()}</span>
                      {phase.endTime && <span>Ended: {phase.endTime.toLocaleString()}</span>}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(deploymentData.health.entries()).map(([service, health]) => (
                    <div key={service} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {getHealthIcon(health.status)}
                        <div>
                          <p className="font-medium capitalize">{service.replace(/-/g, ' ')}</p>
                          <p className="text-xs text-muted-foreground">
                            Response: {health.responseTime}ms | Uptime: {health.uptime}%
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        health.status === 'healthy' ? 'default' :
                        health.status === 'degraded' ? 'secondary' : 'destructive'
                      }>
                        {health.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Deployment Readiness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Deployment Readiness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {deploymentData.readiness.score.toFixed(0)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Readiness Score</p>
                  </div>
                  
                  <Progress value={deploymentData.readiness.score} className="h-3" />
                  
                  <div className="space-y-2">
                    {deploymentData.readiness.checks.map((check, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{check.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{check.message}</span>
                          <Badge variant={
                            check.status === 'pass' ? 'default' :
                            check.status === 'warning' ? 'secondary' : 'destructive'
                          }>
                            {check.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LaunchDashboard;