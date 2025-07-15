import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  TrendingUp, 
  Award, 
  Calculator, 
  Bookmark,
  AlertTriangle,
  Settings,
  BarChart3
} from 'lucide-react';

interface PersonalizationDashboardProps {
  profile: any;
  calculationHistory: any[];
  complianceAlerts: any[];
  favoriteMaterials: any[];
}

export const PersonalizationDashboard: React.FC<PersonalizationDashboardProps> = ({
  profile,
  calculationHistory,
  complianceAlerts,
  favoriteMaterials
}) => {
  const carbonGoals = profile?.carbon_footprint_goals || {};
  const achievements = profile?.achievement_badges || [];
  const quickTools = profile?.quick_access_tools || [];
  
  // Calculate carbon footprint progress
  const monthlyTarget = carbonGoals.monthly_target || 0;
  const currentMonthly = calculationHistory
    .filter(calc => {
      const calcDate = new Date(calc.created_at);
      const now = new Date();
      return calcDate.getMonth() === now.getMonth() && calcDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, calc) => sum + (calc.carbon_footprint || 0), 0);
  
  const progress = monthlyTarget > 0 ? Math.min((currentMonthly / monthlyTarget) * 100, 100) : 0;
  
  // Get recent calculations
  const recentCalculations = calculationHistory
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);
  
  // Get active alerts
  const activeAlerts = complianceAlerts.filter(alert => !alert.is_read);
  
  return (
    <div className="space-y-6">
      {/* Carbon Footprint Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Carbon Footprint Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Monthly Target</span>
              <span className="text-sm text-muted-foreground">
                {currentMonthly.toFixed(1)} / {monthlyTarget} kg CO₂-e
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress: {progress.toFixed(1)}%</span>
              <span className={progress > 100 ? 'text-red-500' : 'text-green-500'}>
                {progress > 100 ? 'Over target' : 'On track'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Quick Access Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickTools.length > 0 ? quickTools.map((tool, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                {tool}
              </Button>
            )) : (
              <p className="text-sm text-muted-foreground col-span-full">
                Configure your quick access tools in settings
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Alerts */}
      {activeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Compliance Alerts
              <Badge variant="destructive" className="ml-auto">
                {activeAlerts.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.severity === 'critical' ? 'bg-red-500' :
                    alert.severity === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                    {alert.related_standard && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {alert.related_standard.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Calculations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recent Calculations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCalculations.length > 0 ? recentCalculations.map((calc) => (
              <div key={calc.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium text-sm">
                    {calc.calculator_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(calc.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">
                    {calc.carbon_footprint?.toFixed(1) || 'N/A'} kg CO₂-e
                  </div>
                  <Badge 
                    variant={calc.compliance_status === 'compliant' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {calc.compliance_status || 'unknown'}
                  </Badge>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">
                No calculations yet. Start using the calculators to see your history here.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Favorite Materials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Favorite Materials
            <Badge variant="outline" className="ml-auto">
              {favoriteMaterials.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {favoriteMaterials.length > 0 ? favoriteMaterials.slice(0, 5).map((fav) => (
              <div key={fav.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <div className="font-medium text-sm">{fav.material?.name || 'Unknown'}</div>
                  <div className="text-xs text-muted-foreground">{fav.category}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {fav.material?.carbon_footprint_kgco2e_kg?.toFixed(2) || 'N/A'} kg CO₂-e/kg
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">
                Add materials to favorites while using the material database.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {achievements.map((badge, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {badge}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};