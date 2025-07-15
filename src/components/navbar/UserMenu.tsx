
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  User, 
  LogOut, 
  Calculator, 
  LayoutDashboard, 
  FileText, 
  Database,
  UserCircle,
  FolderPlus,
  Star,
  CreditCard,
  BarChart,
  Leaf,
  Brain,
  MessageSquare,
  FolderOpen,
  Bell,
  Crown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUserNavLinks } from "@/hooks/useUserNavLinks";

interface UserMenuProps {
  profile: any;
  isPremiumUser: boolean;
  isMobile: boolean;
  user: any;
  onLogout: () => Promise<void>;
}

const UserMenu = ({ profile, isPremiumUser, isMobile, user, onLogout }: UserMenuProps) => {
  const { userNavLinks } = useUserNavLinks();
  
  // Check if user has professional tier or higher
  const isProfessionalUser = user?.user_metadata?.subscription_tier === 'professional' || 
                           user?.user_metadata?.subscription_tier === 'premium';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {!isMobile && (
              <span className="hidden lg:inline max-w-[150px] truncate">
                {profile?.full_name || user.email}
              </span>
            )}
            {isPremiumUser && <Star className="h-3 w-3 text-yellow-500" />}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Account</span>
          {isPremiumUser && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
              Premium
            </Badge>
          )}
        </DropdownMenuLabel>
        
        {/* Dashboard and Profile */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="flex cursor-pointer items-center">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex cursor-pointer items-center">
              <UserCircle className="mr-2 h-4 w-4" />
              My Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* AI Features Section */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-semibold text-green-600 dark:text-green-400">
            AI Features
          </DropdownMenuLabel>
          
          {/* Grok AI - Available for all signed-in users */}
          <DropdownMenuItem asChild>
            <Link to="/grok-ai" className="flex cursor-pointer items-center">
              <Brain className="mr-2 h-4 w-4" />
              Grok AI
              <span className="ml-auto text-xs text-muted-foreground">Free</span>
            </Link>
          </DropdownMenuItem>

          {/* Claude AI - Professional tier only, show in user menu with context */}
          <DropdownMenuItem asChild>
            <Link 
              to={isProfessionalUser ? "/claude-ai" : "/pricing"} 
              className={`flex cursor-pointer items-center ${
                isProfessionalUser 
                  ? 'text-foreground hover:bg-accent' 
                  : 'text-muted-foreground hover:bg-amber-50 dark:hover:bg-amber-900/20'
              }`}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Claude AI
              {isProfessionalUser ? (
                <Crown className="h-3 w-3 text-amber-500 ml-auto" />
              ) : (
                <Crown className="h-3 w-3 text-amber-500 ml-auto" />
              )}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Premium Features Section */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Crown className="h-3 w-3" />
            Premium Features
          </DropdownMenuLabel>
          
          {userNavLinks.filter(link => link.premium).map((link) => (
            <DropdownMenuItem key={link.path} asChild>
              <Link 
                to={isPremiumUser ? link.path : '/pricing'} 
                className={`flex cursor-pointer items-center ${
                  isPremiumUser 
                    ? 'text-foreground hover:bg-accent' 
                    : 'text-muted-foreground hover:bg-amber-50 dark:hover:bg-amber-900/20'
                }`}
              >
                {link.icon && <span className="mr-2">{link.icon}</span>}
                {link.title}
                {!isPremiumUser && (
                  <Crown className="h-3 w-3 text-amber-500 ml-auto" />
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Free user upgrade prompt */}
        {!isPremiumUser && (
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="/pricing" className="flex cursor-pointer items-center text-yellow-600 dark:text-yellow-400">
                <Star className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
        )}
        
        {/* Common actions */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/projects/new" className="flex cursor-pointer items-center">
              <FolderPlus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/calculator" className="flex cursor-pointer items-center">
              <Calculator className="mr-2 h-4 w-4" />
              New Calculation
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        {/* Premium user subscription management */}
        {isPremiumUser && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/subscription" className="flex cursor-pointer items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Subscription
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onLogout}
          className="flex cursor-pointer items-center text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
