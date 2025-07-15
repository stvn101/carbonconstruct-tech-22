
import React from 'react';
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import { GreenStarCalculator } from "@/components/greenstar";

const GreenStarPage: React.FC = () => {
  return (
    <motion.div 
      className="min-h-screen flex flex-col bg-carbon-50 dark:bg-carbon-900 overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>Green Star Materials Calculator | CarbonConstruct</title>
        <meta 
          name="description" 
          content="Calculate Green Star compliance for your construction materials with real-time responsible products guidelines assessment."
        />
      </Helmet>
      <Navbar />
      <main className="flex-grow pt-24 md:pt-28 px-4 pb-12 overflow-y-auto">
        <GreenStarCalculator />
      </main>
      <Footer />
    </motion.div>
  );
};

export default GreenStarPage;
