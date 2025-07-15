import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EPDWizard } from '@/components/epd/EPDWizard';

const EPDCreatePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/epd-generator')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to EPD Generator
        </Button>
        
        <nav className="text-sm text-muted-foreground">
          EPD Generator → Create New EPD
        </nav>
      </div>

      {/* Main Content */}
      <EPDWizard onClose={() => navigate('/epd-generator')} />
    </div>
  );
};

export default EPDCreatePage;