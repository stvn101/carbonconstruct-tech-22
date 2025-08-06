import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Target,
  Leaf,
  Building,
  Zap
} from 'lucide-react';
import { CalculationResult } from '@/lib/carbonCalculations';

interface ComplianceDashboardProps {
  result: CalculationResult;
}

export const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({ result }) => {
  // Calculate compliance scores
  const calculateGreenStarScore = () => {
    const emissionsPerSqm = result.totalEmissions / 1000; // Assuming 1000 sqm baseline
    if (emissionsPerSqm < 50) return { score: 95, level: '6 Star', status: 'excellent' };
    if (emissionsPerSqm < 75) return { score: 80, level: '5 Star', status: 'good' };
    if (emissionsPerSqm < 100) return { score: 65, level: '4 Star', status: 'fair' };
    return { score: 40, level: '3 Star', status: 'poor' };
  };

  const calculateNCCScore = () => {
    const intensityThreshold = 150; // kg CO2-e/m2 for NCC 2025
    const actualIntensity = result.totalEmissions / 1000;
    const compliance = Math.max(0, Math.min(100, ((intensityThreshold - actualIntensity) / intensityThreshold) * 100));
    
    return {
      score: compliance,
      level: compliance >= 80 ? 'Compliant' : compliance >= 60 ? 'Near Compliant' : 'Non-Compliant',
      status: compliance >= 80 ? 'excellent' : compliance >= 60 ? 'good' : 'poor'
    };
  };

  const calculateNABERSScore = () => {
    const energyRatio = result.energyEmissions / result.totalEmissions;
    let stars = 0;
    
    if (energyRatio < 0.3 && result.energyEmissions < 50000) stars = 6;
    else if (energyRatio < 0.4 && result.energyEmissions < 75000) stars = 5;
    else if (energyRatio < 0.5 && result.energyEmissions < 100000) stars = 4;
    else if (energyRatio < 0.6) stars = 3;
    else stars = 2;

    return {
      score: (stars / 6) * 100,
      level: `${stars} Stars`,
      status: stars >= 5 ? 'excellent' : stars >= 4 ? 'good' : stars >= 3 ? 'fair' : 'poor'
    };
  };

  const greenStar = calculateGreenStarScore();
  const ncc = calculateNCCScore();
  const nabers = calculateNABERSScore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'good': return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'fair': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default: return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fair': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Green Star */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Leaf className="h-5 w-5 text-green-600" />
              Green Star
            </CardTitle>
            {getStatusIcon(greenStar.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{greenStar.score}%</div>
              <Badge className={getStatusColor(greenStar.status)}>
                {greenStar.level}
              </Badge>
            </div>
            <Progress value={greenStar.score} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              Sustainable building design rating
            </p>
          </div>
        </CardContent>
      </Card>

      {/* NCC 2025 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building className="h-5 w-5 text-blue-600" />
              NCC 2025
            </CardTitle>
            {getStatusIcon(ncc.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{ncc.score.toFixed(0)}%</div>
              <Badge className={getStatusColor(ncc.status)}>
                {ncc.level}
              </Badge>
            </div>
            <Progress value={ncc.score} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              National Construction Code compliance
            </p>
          </div>
        </CardContent>
      </Card>

      {/* NABERS */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-orange-600" />
              NABERS
            </CardTitle>
            {getStatusIcon(nabers.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{nabers.score.toFixed(0)}%</div>
              <Badge className={getStatusColor(nabers.status)}>
                {nabers.level}
              </Badge>
            </div>
            <Progress value={nabers.score} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              Energy efficiency rating
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};