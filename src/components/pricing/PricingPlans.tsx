
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingPlan } from "@/types/pricing";
import PlanFeatures from "./PlanFeatures";
import PlanAction from "./PlanAction";

interface PricingPlansProps {
  plans: PricingPlan[];
  processing: string | null;
  hadTrial: boolean;
  onPlanAction: (planId: string) => void;
}

const PricingPlans = ({ plans, processing, hadTrial, onPlanAction }: PricingPlansProps) => {
  // Function to format price display
  const formatPrice = (price: number, planId: string): string => {
    if (planId === 'enterprise') {
      return "Price via negotiation";
    }
    return `$${(price / 100).toFixed(2)}`;
  };

  // Function to determine billing period display
  const getBillingPeriod = (price: number, planId: string): string => {
    if (planId === 'enterprise') {
      return "";
    }
    // If price is high enough to be annual (> $2000), show "year", otherwise "month"
    return price >= 200000 ? '/year' : '/month';
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <Card className={`h-full flex flex-col ${plan.popular ? 'border-carbon-500 shadow-lg shadow-carbon-100/20' : ''}`}>
            {plan.popular && (
              <div className="bg-carbon-500 text-white text-center py-1 text-sm font-medium">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <div className="mt-4">
                {plan.id === 'enterprise' ? (
                  <span className="text-2xl font-bold text-carbon-600">Price via negotiation</span>
                ) : (
                  <>
                    <span className="text-4xl font-bold">{formatPrice(plan.price, plan.id)}</span>
                    <span className="text-foreground/60 ml-2">{getBillingPeriod(plan.price, plan.id)}</span>
                  </>
                )}
              </div>
              <p className="text-foreground/80 mt-3 text-sm">{plan.description}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <PlanFeatures features={plan.features} notIncluded={plan.notIncluded} />
            </CardContent>
            <CardFooter>
              <PlanAction
                cta={plan.cta}
                planId={plan.id}
                processing={processing}
                hadTrial={hadTrial}
                isPopular={plan.popular}
                onAction={onPlanAction}
              />
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default PricingPlans;
