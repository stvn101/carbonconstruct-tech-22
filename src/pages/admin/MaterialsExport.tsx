
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MaterialsExportManager from '@/components/admin/MaterialsExportManager';

const MaterialsExportPage = () => {
  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Navbar />
      
      <main className="flex-grow pt-24 md:pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Materials Database Export</h1>
              <p className="text-muted-foreground">
                Export all materials data to CSV files before database cleanup
              </p>
            </div>
            
            <MaterialsExportManager />
          </div>
        </div>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default MaterialsExportPage;
