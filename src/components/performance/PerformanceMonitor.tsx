import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Zap, 
  Clock, 
  Eye, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { useAdvancedSecurity } from '@/components/security/AdvancedSecurityProvider';

const PerformanceMonitor: React.FC = () => {
  const { performanceStatus, refreshPerformanceStatus } = useAdvancedSecurity();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    refreshPerformanceStatus();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Monitor</h2>
          <p className="text-muted-foreground">
            Real-time performance metrics and optimization recommendations
          </p>
        </div>
        <Button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              <span className={getScoreColor(performanceStatus.score)}>
                {performanceStatus.score}
              </span>
            </div>
            <Progress 
              value={performanceStatus.score} 
              className="h-2"
            />
            <Badge variant={getScoreVariant(performanceStatus.score)} className="mt-2">
              {performanceStatus.score >= 90 ? 'Excellent' : 
               performanceStatus.score >= 70 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">First Contentful Paint</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceStatus.metrics.fcp ? 
                `${Math.round(performanceStatus.metrics.fcp)}ms` : 
                'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Good: &lt;1.8s
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Largest Contentful Paint</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceStatus.metrics.lcp ? 
                `${Math.round(performanceStatus.metrics.lcp)}ms` : 
                'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Good: &lt;2.5s
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">First Input Delay</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceStatus.metrics.fid ? 
                `${Math.round(performanceStatus.metrics.fid)}ms` : 
                'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Good: &lt;100ms
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Optimization Recommendations
              </CardTitle>
              <CardDescription>
                Actionable steps to improve your application's performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {performanceStatus.recommendations.length > 0 ? (
                <div className="space-y-3">
                  {performanceStatus.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      All performance metrics are optimal!
                    </p>
                    <p className="text-xs text-green-600">
                      Your application is performing well across all Core Web Vitals.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Performance Metrics</CardTitle>
              <CardDescription>
                Complete breakdown of all measured performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Core Web Vitals</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>First Contentful Paint (FCP):</span>
                      <span className="font-mono">
                        {performanceStatus.metrics.fcp ? 
                          `${Math.round(performanceStatus.metrics.fcp)}ms` : 
                          'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Largest Contentful Paint (LCP):</span>
                      <span className="font-mono">
                        {performanceStatus.metrics.lcp ? 
                          `${Math.round(performanceStatus.metrics.lcp)}ms` : 
                          'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>First Input Delay (FID):</span>
                      <span className="font-mono">
                        {performanceStatus.metrics.fid ? 
                          `${Math.round(performanceStatus.metrics.fid)}ms` : 
                          'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cumulative Layout Shift (CLS):</span>
                      <span className="font-mono">
                        {performanceStatus.metrics.cls ? 
                          performanceStatus.metrics.cls.toFixed(3) : 
                          'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Loading Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Time to First Byte (TTFB):</span>
                      <span className="font-mono">
                        {performanceStatus.metrics.ttfb ? 
                          `${Math.round(performanceStatus.metrics.ttfb)}ms` : 
                          'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>DOM Load Time:</span>
                      <span className="font-mono">
                        {performanceStatus.metrics.domLoadTime ? 
                          `${Math.round(performanceStatus.metrics.domLoadTime)}ms` : 
                          'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resource Load Time:</span>
                      <span className="font-mono">
                        {performanceStatus.metrics.resourceLoadTime ? 
                          `${Math.round(performanceStatus.metrics.resourceLoadTime)}ms` : 
                          'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                Historical performance data and trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Performance trending data will be available after collecting more metrics.</p>
                <p className="text-sm mt-2">
                  Continue using the application to build performance history.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceMonitor;