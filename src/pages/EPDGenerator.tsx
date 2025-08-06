import React from 'react';
import { EPDGenerator } from '@/components/epd/EPDGenerator';
import Navbar from '@/components/navbar/Navbar';

const EPDGeneratorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Ensures EPD Generator page includes full app layout and Home button for UX consistency */}
      <Navbar />
      <main className="pt-[80px] md:pt-[136px]">
        <EPDGenerator />
      </main>
    </div>
  );
};

export default EPDGeneratorPage;