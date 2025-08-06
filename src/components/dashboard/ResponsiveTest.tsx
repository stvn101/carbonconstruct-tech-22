import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';

interface ResponsiveTestProps {
  isMobile?: boolean;
  isTablet?: boolean;
}

export const ResponsiveTest: React.FC<ResponsiveTestProps> = ({ isMobile, isTablet }) => {
  return (
    <div className="space-y-4">
      {/* Mobile Test */}
      <Card className="block sm:hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Mobile Layout Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Dashboard is optimized for mobile viewing
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Tablet Test */}
      <Card className="hidden sm:block lg:hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tablet className="h-4 w-4" />
            Tablet Layout Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Dashboard is optimized for tablet viewing
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Desktop Test */}
      <Card className="hidden lg:block">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Desktop Layout Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Dashboard is optimized for desktop viewing
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};