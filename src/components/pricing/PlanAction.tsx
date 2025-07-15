
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlanActionProps {
  cta: string;
  planId: string;
  processing: string | null;
  hadTrial: boolean;
  isPopular: boolean;
  onAction: (planId: string) => void;
}

const PlanAction = ({ cta, planId, processing, hadTrial, isPopular, onAction }: PlanActionProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (planId === 'enterprise') {
      navigate('/contact', { state: { subject: 'Enterprise Plan Inquiry' } });
    } else {
      onAction(planId);
    }
  };

  return (
    <>
      <Button 
        className="w-full" 
        variant={isPopular ? "default" : "outline"}
        onClick={handleClick}
        disabled={!!processing && planId !== 'enterprise'}
      >
        {processing === planId && planId !== 'enterprise' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          cta
        )}
      </Button>
      {isPopular && !hadTrial && planId !== 'enterprise' && (
        <p className="w-full text-xs text-center mt-2 text-green-600">
          Includes 3-day free trial
        </p>
      )}
    </>
  );
};

export default PlanAction;
