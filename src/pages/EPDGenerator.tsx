import React from 'react';
import { EPDGenerator } from '@/components/epd/EPDGenerator';
import Navbar from '@/components/navbar/Navbar';

const EPDGeneratorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-16">
        <EPDGenerator />
      </main>
    </div>
  );
};

export default EPDGeneratorPage;