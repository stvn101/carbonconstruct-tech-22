
import { BarChart3 } from "lucide-react";

interface DashboardPreviewProps {
  onLoad?: () => void;
}

const DashboardPreview = ({ onLoad }: DashboardPreviewProps) => {
  // Let the parent know that dashboard content is loaded
  const handleContentLoad = () => {
    if (onLoad) onLoad();
  };

  return (
    <div className="md:w-1/2 flex justify-center animate-fade-in" onLoad={handleContentLoad}>
      <div className="relative w-full">
        <div className="absolute inset-0 bg-gradient-to-tr from-carbon-300 to-carbon-100 dark:from-carbon-700 dark:to-carbon-500 rounded-xl transform rotate-1"></div>
        <div className="relative bg-white dark:bg-gray-800 border border-border rounded-xl shadow-lg p-8 transform -rotate-1 h-full min-h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Project Carbon Dashboard</h3>
            <BarChart3 className="h-5 w-5 text-carbon-500" />
          </div>
          <div className="space-y-4">
            <div className="bg-secondary/50 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Carbon Score</span>
                <span className="text-sm font-bold text-carbon-600 dark:text-carbon-300">78/100</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-carbon-500 dark:bg-carbon-400 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: '78%' }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Materials", value: "42.3", unit: "tonnes CO₂e" },
                { title: "Transport", value: "28.7", unit: "tonnes CO₂e" },
                { title: "Energy", value: "15.2", unit: "tonnes CO₂e" },
                { title: "Total", value: "86.2", unit: "tonnes CO₂e" },
              ].map((item, index) => (
                <div 
                  key={item.title}
                  className="bg-secondary/50 p-3 rounded-xl hover:scale-105 hover:shadow-md transition-all duration-200"
                >
                  <div className="text-sm font-medium mb-1">{item.title}</div>
                  <div className="text-xl font-bold text-carbon-600 dark:text-carbon-300">{item.value}</div>
                  <div className="text-xs text-carbon-700 dark:text-carbon-400">{item.unit}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
