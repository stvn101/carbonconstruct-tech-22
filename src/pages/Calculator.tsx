
import React from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import CarbonCalculator from "@/components/CarbonCalculator";
import { useA11y } from "@/hooks/useA11y";

function Calculator() {
  // Set page title and a11y features
  useA11y({
    title: "Carbon Calculator - CarbonConstruct",
    announceRouteChanges: true,
    focusMainContentOnRouteChange: true
  });

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-emerald-50/20">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-28 pb-12 bg-gradient-to-b from-transparent to-emerald-50/10" id="main-content" tabIndex={-1}>
        <CarbonCalculator />
      </main>
      <Footer />
    </div>
  );
}

export default Calculator;
