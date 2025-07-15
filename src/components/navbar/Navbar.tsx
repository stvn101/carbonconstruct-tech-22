
// Refactored for clarity and separation of concerns
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavbarMainSection from "./NavbarMainSection";
import NavbarContainer from "@/components/navbar/NavbarContainer";
import { useAuth } from '@/contexts/auth';
import { useUserNavLinks } from "@/hooks/useUserNavLinks";
import ErrorBoundary from "@/components/ErrorBoundary";

// Newly extracted hooks for clarity
import { useIsDarkMode } from "@/hooks/navbar/useIsDarkMode";
import { useNavbarHeight } from "@/hooks/navbar/useNavbarHeight";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { profile } = useAuth();
  const { publicNavLinks } = useUserNavLinks();
  const isDarkMode = useIsDarkMode();
  const [navbarInitialized, setNavbarInitialized] = useState(false);
  const location = useLocation();

  useNavbarHeight("64px", "120px"); // Mobile height: 64px, Desktop height: 120px
  
  // Get current page title based on location
  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    const currentNavLink = publicNavLinks.find(link => link.path === currentPath);
    return currentNavLink?.title || "CarbonConstruct Tech";
  };
  
  // Initialize navbar after a brief delay to avoid hydration issues
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavbarInitialized(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!navbarInitialized) {
    // Return minimal navbar during initialization to avoid hydration mismatches
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/90 border-b border-border h-[64px] md:h-[120px]">
        <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-center">
          <img 
            src="/lovable-uploads/0aacd2f7-c0c5-4370-88aa-a5b60fe6a30a.png" 
            alt="CarbonConstruct Tech Logo" 
            className="h-8 w-8 object-contain"
          />
        </div>
      </nav>
    );
  }

  return (
    <ErrorBoundary feature="Navigation">
      <NavbarContainer
        isPremiumUser={profile?.subscription_tier === 'premium'}
        isDarkMode={isDarkMode}
      >
        <div className="container mx-auto px-4 md:px-6">
          <NavbarMainSection 
            isMenuOpen={isMenuOpen} 
            setIsMenuOpen={setIsMenuOpen} 
            pageTitle={getCurrentPageTitle()} 
          />
        </div>
      </NavbarContainer>
    </ErrorBoundary>
  );
};

export default Navbar;
