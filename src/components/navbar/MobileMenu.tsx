
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "@/types/navigation";
import { cn } from "@/lib/utils";
import { useUserNavLinks } from "@/hooks/useUserNavLinks";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const location = useLocation();
  const { publicNavLinks } = useUserNavLinks();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-x-0 top-16 z-40 md:hidden px-4 pb-6 pt-2 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm overflow-y-auto max-h-[80vh]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <nav className="flex flex-col space-y-1 py-2">
            {publicNavLinks.map((link) => {
              const isActive = location.pathname === link.path;
              
              return (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={cn(
                    "flex items-center px-4 py-3 text-foreground/80 hover:text-foreground transition-colors rounded-md",
                    "hover:bg-accent hover:text-foreground min-h-[44px]",
                    isActive && "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 font-medium"
                  )}
                  onClick={() => {
                    onClose();
                  }}
                  role="menuitem"
                >
                  <span className="flex items-center">
                    {link.icon && <span className="mr-3">{link.icon}</span>}
                    {link.title}
                  </span>
                </Link>
              );
            })}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
