
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import MaterialDashboard from '@/components/dashboard/MaterialDashboard';

const MaterialDashboardPage = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>Material Dashboard | CarbonConstruct</title>
        <meta 
          name="description" 
          content="Comprehensive material analytics dashboard with EPD ratings, recyclability tracking, and AI-powered insights."
        />
      </Helmet>
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <MaterialDashboard />
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default MaterialDashboardPage;
