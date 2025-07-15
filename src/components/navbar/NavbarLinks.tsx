
import { useAuth } from "@/contexts/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, LogIn, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { criticalFlowHandler } from "@/utils/errorHandling/CriticalFlowHandler";

export const NavbarLinks = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();

  // Mobile styling using semantic colors
  const mobileButtonStyle = isMobile 
    ? "bg-secondary border-primary text-foreground hover:bg-secondary/80 rounded-xl text-sm px-3 py-2" 
    : "";

  return (
    <div className="flex items-center space-x-2">
      {user ? (
        <>
          <Button 
            variant={isMobile ? "outline" : "ghost"} 
            size="sm" 
            asChild
            className={isMobile ? mobileButtonStyle : ""}
          >
            <Link to="/profile" className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </Button>
          <Button 
            variant={isMobile ? "outline" : "ghost"} 
            size="sm" 
            onClick={async () => {
              const result = await criticalFlowHandler.executeCriticalFlow(
                'auth-logout',
                `logout-${Date.now()}`,
                async () => {
                  await signOut();
                },
                {
                  timeout: 10000,
                  retries: 1,
                  requiresConnection: false
                }
              );
              
              if (result.success) {
                toast.success("Signed out successfully");
              }
            }}
            className={isMobile ? mobileButtonStyle : ""}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </>
      ) : (
        <Button 
          variant={isMobile ? "outline" : "ghost"} 
          size="sm" 
          asChild
          className={isMobile ? mobileButtonStyle : ""}
        >
          <Link to="/auth" className="flex items-center space-x-1">
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </Link>
        </Button>
      )}
    </div>
  );
};
