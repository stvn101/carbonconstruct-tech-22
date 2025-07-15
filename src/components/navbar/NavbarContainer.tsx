
import { motion } from "framer-motion";
import { useNavbarVisibility } from "@/hooks/use-navbar-visibility";
import { useTheme } from "@/components/ThemeProvider";

interface NavbarContainerProps {
  children: React.ReactNode;
  isPremiumUser: boolean;
  isDarkMode?: boolean;
}

const NavbarContainer = ({ children, isPremiumUser, isDarkMode }: NavbarContainerProps) => {
  const { isVisible, scrolled } = useNavbarVisibility();
  const { theme } = useTheme();
  
  // Use provided isDarkMode prop if available, otherwise compute it from theme context
  const effectiveDarkMode = isDarkMode !== undefined ? 
    isDarkMode : 
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  return (
    <motion.nav 
      className={`py-2 border-b fixed top-0 left-0 right-0 w-full z-navbar transition-all duration-300 
        h-[64px] md:h-[120px] ${
        scrolled 
          ? "border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm" 
          : "border-transparent bg-background"
      } ${
        isPremiumUser ? 'premium-user' : ''
      }`}
      initial={{ y: -120 }}
      animate={{ 
        y: isVisible ? 0 : -120,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      {children}
    </motion.nav>
  );
};

export default NavbarContainer;
