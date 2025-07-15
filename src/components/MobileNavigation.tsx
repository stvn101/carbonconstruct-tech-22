
import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { useDevice } from '@/hooks/use-device';
import { useAuth } from '@/contexts/auth';
import { Crown, Brain } from 'lucide-react';

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const { isIOS } = useDevice();
  const { user, profile } = useAuth();
  
  const isPremiumUser = profile?.subscription_tier === 'premium';
  
  // Don't show mobile navigation on theme test page
  if (location.pathname === '/theme-test') return null;
  
  // Mobile navigation items - key features for authenticated users
  const mobileNavItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      ),
      premium: false
    },
    {
      path: '/calculator',
      label: 'Calculator',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      premium: false
    },
    {
      path: '/grok-ai',
      label: 'Grok AI',
      icon: <Brain className="w-5 h-5" />,
      premium: false, // Available for all signed-in users
      requiresAuth: true
    },
    {
      path: isPremiumUser ? '/sustainability' : '/pricing',
      label: 'Sustainability',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      premium: true
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      premium: false
    }
  ];
  
  // Filter items based on authentication state
  const filteredItems = mobileNavItems.filter(item => {
    if (item.requiresAuth && !user) {
      return false; // Don't show auth-required items for non-authenticated users
    }
    return true;
  });
  
  return (
    <nav 
      className={`
        fixed bottom-0 left-0 right-0 
        bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
        border-t border-border 
        sm:hidden z-50 
        transition-transform
        ${isIOS ? 'pb-[env(safe-area-inset-bottom)]' : ''}
      `}
      aria-label="Mobile navigation"
    >
      <div className="flex justify-around items-center px-2 py-1">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center px-2 py-2 min-h-[56px] w-full justify-center relative
              transition-colors duration-200
              ${isActive && item.path !== '/pricing'
                ? 'text-green-600 dark:text-green-400' 
                : 'text-muted-foreground hover:text-foreground'
              }
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset rounded-md
              touch-manipulation`
            }
            aria-label={item.label}
          >
            <div className="mb-1 transform transition-transform duration-200 scale-110 relative">
              {item.icon}
              {item.premium && !isPremiumUser && (
                <Crown className="h-2 w-2 text-warning absolute -top-1 -right-1" />
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;
