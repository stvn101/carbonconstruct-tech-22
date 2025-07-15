
import React, { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClaudeProvider } from "@/contexts/ClaudeContext";
import ClaudeChat from "@/components/claude/ClaudeChat";
import ClaudeConfig from "@/components/claude/ClaudeConfig";
import { useA11y } from "@/hooks/useA11y";
import { Brain, MessageSquare, Settings, BarChart3 } from "lucide-react";

function ClaudeAI() {
  const [activeTab, setActiveTab] = useState("chat");
  
  // Set page title and a11y features
  useA11y({
    title: "Claude AI - CarbonConstruct",
    announceRouteChanges: true,
    focusMainContentOnRouteChange: true
  });

  return (
    <ClaudeProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 pt-24 pb-12" id="main-content" tabIndex={-1}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-carbon-800 dark:text-carbon-100 mb-2">Claude AI Assistant</h1>
            <p className="text-carbon-600 dark:text-carbon-300">
              Leverage Anthropic's Claude AI to optimize your sustainable construction projects
            </p>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Chat</span>
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
            
            <TabsContent value="chat" className="w-full">
              <ClaudeChat placeholder="Ask Claude about sustainable construction materials, compliance, or best practices..." />
            </TabsContent>
            
            <TabsContent value="analysis">
              <div className="text-center py-12">
                <Brain className="h-16 w-16 mx-auto mb-4 text-carbon-500" />
                <h3 className="text-xl font-medium mb-2">Material Analysis Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced material sustainability analysis with Claude AI will be available soon.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <ClaudeConfig />
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    </ClaudeProvider>
  );
}

export default ClaudeAI;
