
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaterialDatabase from "@/components/materials/MaterialDatabase";
import { useAuth } from "@/contexts/auth";

const MaterialDatabasePage = () => {
  const { profile } = useAuth();
  
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
          <MaterialDatabase />
        </div>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default MaterialDatabasePage;
