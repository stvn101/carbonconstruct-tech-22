
import { Leaf, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";

interface FeatureCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  items: string[];
  explanationContent?: string;
}

const FeatureCard = ({ icon: Icon, title, description, items, explanationContent }: FeatureCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLearnMoreClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="h-full animate-fade-in hover:-translate-y-2 transition-transform duration-200">
        <Card className="border-carbon-100 h-full flex flex-col overflow-hidden group hover:border-carbon-300 transition-colors duration-300 bg-white dark:bg-gray-800 min-h-[450px] hover:shadow-lg">
          <CardHeader className="pb-2 relative">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-carbon-100 group-hover:bg-carbon-200 transition-colors duration-300">
              <Icon className="h-5 w-5 text-carbon-700 group-hover:text-carbon-800 transition-all duration-300" />
            </div>
            <CardTitle className="group-hover:text-carbon-800 dark:group-hover:text-carbon-200 transition-colors duration-300">{title}</CardTitle>
            <CardDescription className="group-hover:text-carbon-700 dark:group-hover:text-carbon-300 transition-colors duration-300">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <p className="text-sm text-muted-foreground group-hover:text-carbon-700 dark:group-hover:text-carbon-300 transition-colors duration-300">
              {description}
            </p>
            <ul className="mt-4 space-y-2 flex-1">
              {items.map((item, index) => (
                <li 
                  key={index}
                  className="flex items-start hover:translate-x-1 transition-transform duration-200"
                >
                  <div className="mr-2 mt-0.5 bg-carbon-100 rounded-full p-1 group-hover:bg-carbon-200 transition-colors duration-300">
                    <Leaf className="h-3 w-3 text-carbon-500 group-hover:text-carbon-600 transition-colors duration-300" />
                  </div>
                  <span className="text-sm group-hover:font-medium transition-all duration-300">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-carbon-100 group-hover:border-carbon-200 transition-colors duration-300">
              <button 
                className="text-sm text-carbon-600 hover:text-carbon-800 font-medium inline-flex items-center dark:text-carbon-300 dark:hover:text-carbon-100 transition-colors duration-300"
                onClick={handleLearnMoreClick}
              >
                Learn more
                <Info className="w-4 h-4 ml-1 group-hover:ml-2 transition-all duration-300" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-800 border border-carbon-100 dark:border-carbon-700">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <h3 className="font-semibold">Key Benefits</h3>
            <ul className="list-disc pl-5 space-y-2">
              {items.map((item, index) => (
                <li key={index} className="text-sm">{item}</li>
              ))}
            </ul>
            {explanationContent && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">How It Works</h3>
                <p className="text-sm text-muted-foreground">{explanationContent}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeatureCard;
