import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import MaterialsDatabase from '@/components/materials/MaterialsDatabase';

const MaterialsDatabasePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        <MaterialsDatabase />
      </main>
      <Footer />
    </div>
  );
};

export default MaterialsDatabasePage;