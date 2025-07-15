import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';

const SecurityNotice = () => {
  const handleReturnHome = () => {
    // Clear any security flags and return to home
    localStorage.removeItem('security_events');
    sessionStorage.clear();
    try {
      window.history.pushState({}, '', '/');
      window.location.reload();
    } catch (error) {
      window.location.reload();
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <SEO
        title="Security Notice - CarbonConstruct"
        description="Security notice and access restrictions for CarbonConstruct platform."
        canonical="/security-notice"
        type="article"
        noIndex={true}
        noFollow={true}
      />
      
      <Card className="max-w-2xl w-full border-2 border-red-200 dark:border-red-800 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
            <Shield className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-900 dark:text-red-100 flex items-center justify-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Security Notice
          </CardTitle>
          <CardDescription className="text-lg text-red-700 dark:text-red-300">
            Access has been temporarily restricted due to security concerns
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
              What happened?
            </h3>
            <p className="text-sm text-red-800 dark:text-red-200">
              Our security systems detected unusual activity that may indicate:
            </p>
            <ul className="list-disc list-inside text-sm text-red-800 dark:text-red-200 mt-2 space-y-1">
              <li>Multiple failed authentication attempts</li>
              <li>Suspicious request patterns</li>
              <li>Potential automated access attempts</li>
              <li>Unusual data access patterns</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Your Data is Safe
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This is a preventive measure. Your project data and personal information remain secure and encrypted. No data has been compromised.
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              What can you do?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">1</Badge>
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">Wait a few minutes</p>
                  <p className="text-xs text-green-800 dark:text-green-200">
                    Automatic restrictions usually lift within 15-30 minutes
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">2</Badge>
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">Clear your browser cache</p>
                  <p className="text-xs text-green-800 dark:text-green-200">
                    Sometimes clearing cache and cookies resolves the issue
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">3</Badge>
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">Contact support if persistent</p>
                  <p className="text-xs text-green-800 dark:text-green-200">
                    If the issue continues, reach out to support@carbonconstruct.com
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleRefresh}
              variant="default"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            
            <Button 
              onClick={handleReturnHome}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </div>
          
          <div className="border-t pt-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">
                Reference ID: SEC-{Date.now().toString(36).toUpperCase()}
              </p>
              <p className="text-xs text-muted-foreground">
                This incident has been logged for security review. 
                For immediate assistance, contact our security team at security@carbonconstruct.com
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm">
              🔒 Our Security Commitment
            </h4>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              CarbonConstruct employs enterprise-grade security measures including real-time threat detection, 
              encryption, and compliance with Australian Privacy Act 1988 to protect your construction project data.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SecurityNotice;