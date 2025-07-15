
import NavbarLogo from "@/components/navbar/NavbarLogo";
import { NavbarLinks } from "@/components/navbar/NavbarLinks";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserNavLinks } from "@/hooks/useUserNavLinks";
import { useAuth } from "@/contexts/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Crown } from "lucide-react";
import { Link } from "react-router-dom";

interface NavbarMainSectionProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  pageTitle?: string;
}

const NavbarMainSection = ({ isMenuOpen, setIsMenuOpen }: NavbarMainSectionProps) => {
  const isMobile = useIsMobile();
  const { publicNavLinks, userNavLinks } = useUserNavLinks();
  const { user, profile } = useAuth();

  // Determine which navigation links to show based on authentication
  const navigationLinks = user ? [...publicNavLinks, ...userNavLinks] : publicNavLinks;
  const isPremiumUser = profile?.subscription_tier === 'premium';

  return (
    <div className="flex flex-col h-[120px] w-full mx-auto px-6">
      {/* Mobile layout - two rows */}
      <div className="md:hidden flex flex-col h-full">
        {/* Top row - Logo centered */}
        <div className="flex items-center justify-center flex-1 py-3">
          <div className="scale-125">
            <NavbarLogo />
          </div>
        </div>
        
        {/* Bottom row - Navigation and Sign-in evenly spaced */}
        <div className="flex items-center justify-evenly py-3 border-t border-border/30">
          {/* Navigation dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-gray-100 dark:bg-gray-800 border-green-600 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-sm px-3 py-2"
              >
                Navigation <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 bg-gray-100 dark:bg-gray-800 border-green-600 rounded-xl" 
              align="start"
            >
              {/* Public navigation items */}
              <DropdownMenuLabel>General</DropdownMenuLabel>
              {publicNavLinks.map((link) => (
                <DropdownMenuItem key={link.path} asChild>
                  <Link 
                    to={link.path}
                    className="flex items-center gap-2 px-3 py-2 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                  >
                    {link.icon}
                    {link.title}
                  </Link>
                </DropdownMenuItem>
              ))}

              {/* User navigation items (premium features) */}
              {user && userNavLinks.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Crown className="h-3 w-3 text-amber-500" />
                    Premium Features
                  </DropdownMenuLabel>
                  {userNavLinks.map((link) => (
                    <DropdownMenuItem key={link.path} asChild>
                      <Link 
                        to={isPremiumUser ? link.path : '/pricing'}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                          isPremiumUser 
                            ? 'text-foreground hover:bg-gray-200 dark:hover:bg-gray-700' 
                            : 'text-muted-foreground hover:bg-amber-50 dark:hover:bg-amber-900/20'
                        }`}
                      >
                        {link.icon}
                        {link.title}
                        {!isPremiumUser && link.premium && (
                          <Crown className="h-3 w-3 text-amber-500 ml-auto" />
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Sign-in with matching button style */}
          <NavbarLinks />
        </div>
      </div>

      {/* Desktop layout - single row (original design) */}
      <div className="hidden md:flex items-center justify-between h-full">
        <div className="flex items-center">
          <NavbarLogo />
        </div>
        
        {/* Desktop navigation and sign-in */}
        <div className="flex items-center space-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-gray-100 dark:bg-gray-800 border-green-600 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl"
              >
                Navigation <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 bg-gray-100 dark:bg-gray-800 border-green-600 rounded-xl" 
              align="start"
            >
              {/* Public navigation items */}
              <DropdownMenuLabel>General</DropdownMenuLabel>
              {publicNavLinks.map((link) => (
                <DropdownMenuItem key={link.path} asChild>
                  <Link 
                    to={link.path}
                    className="flex items-center gap-2 px-3 py-2 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                  >
                    {link.icon}
                    {link.title}
                  </Link>
                </DropdownMenuItem>
              ))}

              {/* User navigation items (premium features) */}
              {user && userNavLinks.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Crown className="h-3 w-3 text-amber-500" />
                    Premium Features
                  </DropdownMenuLabel>
                  {userNavLinks.map((link) => (
                    <DropdownMenuItem key={link.path} asChild>
                      <Link 
                        to={isPremiumUser ? link.path : '/pricing'}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                          isPremiumUser 
                            ? 'text-foreground hover:bg-gray-200 dark:hover:bg-gray-700' 
                            : 'text-muted-foreground hover:bg-amber-50 dark:hover:bg-amber-900/20'
                        }`}
                      >
                        {link.icon}
                        {link.title}
                        {!isPremiumUser && link.premium && (
                          <Crown className="h-3 w-3 text-amber-500 ml-auto" />
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <NavbarLinks />
        </div>
      </div>
    </div>
  );
};

export default NavbarMainSection;
