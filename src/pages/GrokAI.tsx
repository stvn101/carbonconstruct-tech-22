
import React, { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GrokProvider } from "@/contexts/GrokContext";
import GrokSustainabilityChat from "@/components/grok/GrokSustainabilityChat";
import GrokConfig from "@/components/grok/GrokConfig";
import { useA11y } from "@/hooks/useA11y";
import { Leaf, MessageSquare, Settings, BarChart3 } from "lucide-react";

function GrokAI() {
  const [activeTab, setActiveTab] = useState("sustainability");
  
  // Set page title and a11y features
  useA11y({
    title: "Grok AI - CarbonConstruct",
    announceRouteChanges: true,
    focusMainContentOnRouteChange: true
  });

  return (
    <GrokProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 pt-24 pb-12" id="main-content" tabIndex={-1}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-carbon-800 dark:text-carbon-100 mb-2">Grok AI Sustainability Assistant</h1>
            <p className="text-carbon-600 dark:text-carbon-300">
              Expert AI guidance for sustainable construction, compliance, and Green Star certification
            </p>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="sustainability" className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                <span>Sustainability</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sustainability" className="w-full">
              <GrokSustainabilityChat />
            </TabsContent>
            
            <TabsContent value="analysis">
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-carbon-500" />
                <h3 className="text-xl font-medium mb-2">Advanced Analysis Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced project analysis and reporting features will be available soon.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <GrokConfig />
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    </GrokProvider>
  );
}

export default GrokAI;
