
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ComplianceData } from '../compliance/types';

interface MobileComplianceCardProps {
  title: string;
  data?: ComplianceData;
  className?: string;
}

const MobileComplianceCard: React.FC<MobileComplianceCardProps> = ({
  title,
  data,
  className
}) => {
  const getStatusIcon = () => {
    if (!data) return <AlertCircle className="h-4 w-4 text-gray-400" />;
    return data.compliant 
      ? <CheckCircle className="h-4 w-4 text-green-600" />
      : <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getStatusBadge = () => {
    if (!data) return <Badge variant="secondary">Not Checked</Badge>;
    return (
      <Badge variant={data.compliant ? "default" : "destructive"}>
        {data.compliant ? "Compliant" : "Non-Compliant"}
      </Badge>
    );
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span>{title}</span>
          </div>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {data && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Score:</span>
              <span className="font-medium">{data.score || 0}</span>
            </div>
            
            {title === "NABERS" && data.details?.rating && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rating:</span>
                <span className="font-medium">{data.details.rating} Stars</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileComplianceCard;
