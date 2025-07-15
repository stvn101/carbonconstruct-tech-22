
import React, { useState, useEffect } from "react";
import { SustainabilityAnalyzerProps } from "@/components/sustainability/types";
import { MaterialAnalysisResult } from "@/types/sustainability";
import { useSustainabilitySuggestions } from "@/hooks/useSustainabilitySuggestions";
import { useMaterialAnalysis } from "@/hooks/sustainability/useMaterialAnalysis";
import { useComplianceChecks } from "@/hooks/sustainability/useComplianceChecks";

export function useSustainabilityAnalyzer({
  calculationInput,
  calculationResult
}: SustainabilityAnalyzerProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const { 
    suggestions,
    prioritySuggestions, 
    report,
    isLoading,
    error
  } = useSustainabilitySuggestions();
  
  // Safely extract breakdown data with null checks
  const materialBreakdown = calculationResult?.breakdownByMaterial || {};
  
  // Use extracted hooks
  const { 
    materialAnalysis,
    setMaterialAnalysis
  } = useMaterialAnalysis(
    calculationInput?.materials || [], 
    materialBreakdown
  );
  
  const {
    nccCompliance,
    nabersCompliance,
    isLoadingCompliance,
    runComplianceChecks
  } = useComplianceChecks();

  // Convert suggestion objects to strings when needed
  const convertSuggestionsToStrings = (suggestions: any[] | undefined): string[] => {
    if (!suggestions || suggestions.length === 0) return [];
    return suggestions.map(s => typeof s === 'string' ? s : (s.description || s.title || ''));
  };

  // Use material analysis data from report if available
  useEffect(() => {
    if (report?.materialAnalysis) {
      const defaultAnalysis: MaterialAnalysisResult = {
        materialScores: {},
        impactSummary: "",
        highImpactMaterials: [],
        sustainabilityScore: 0,
        sustainabilityPercentage: 0,
        recommendations: [],
        alternatives: {},
        sustainabilityIssues: []
      };
      
      setMaterialAnalysis({
        ...defaultAnalysis,
        ...report.materialAnalysis
      });
    }
  }, [report, setMaterialAnalysis]);
  
  // Navigate between tabs with animations
  const navigateTab = (direction: "next" | "prev") => {
    const tabs = ["dashboard", "compliance", "materials", "performance", "report"];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (direction === "next" && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else if (direction === "prev" && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  // Run compliance checks when needed
  const handleRunComplianceChecks = () => {
    const materials = calculationInput?.materials || [];
    const energy = calculationInput?.energy || [];
    runComplianceChecks(materials, energy);
  };

  // Ensure we have complete material analysis data with all required fields
  const completeAnalysis: MaterialAnalysisResult = {
    materialScores: materialAnalysis?.materialScores || {},
    impactSummary: materialAnalysis?.impactSummary || "",
    highImpactMaterials: materialAnalysis?.highImpactMaterials || [],
    sustainabilityScore: materialAnalysis?.sustainabilityScore || 0,
    sustainabilityPercentage: materialAnalysis?.sustainabilityPercentage || 0,
    recommendations: materialAnalysis?.recommendations || [],
    alternatives: materialAnalysis?.alternatives || {},
    sustainabilityIssues: materialAnalysis?.sustainabilityIssues || [],
    categories: materialAnalysis?.categories || {},
    materialCount: materialAnalysis?.materialCount || 0,
    sustainabilityStrengths: materialAnalysis?.sustainabilityStrengths || [],
    averageCarbonFootprint: materialAnalysis?.averageCarbonFootprint || 0,
    materialWithHighestFootprint: materialAnalysis?.materialWithHighestFootprint || null
  };
  
  const suggestionStrings = convertSuggestionsToStrings(suggestions);
  const priorityStrings = convertSuggestionsToStrings(prioritySuggestions);
  
  return {
    activeTab,
    setActiveTab,
    navigateTab,
    completeAnalysis,
    handleRunComplianceChecks,
    isLoadingCompliance,
    nccCompliance,
    nabersCompliance,
    priorityStrings,
    suggestionStrings,
    report,
    calculationInput: calculationInput || { materials: [], transport: [], energy: [] },
    calculationResult: calculationResult || { 
      totalCO2: 0, 
      totalEmissions: 0, 
      breakdownByCategory: { materials: 0, transport: 0, energy: 0 },
      breakdownByMaterial: {},
      breakdownByTransport: {},
      breakdownByEnergy: {},
      materialEmissions: 0,
      transportEmissions: 0,
      energyEmissions: 0,
      breakdown: { materials: 0, transport: 0, energy: 0 },
      sustainabilityScore: 50,
      timestamp: new Date().toISOString()
    }
  };
}
