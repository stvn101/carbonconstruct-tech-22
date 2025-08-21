
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Calculator,
  BarChart3,
  Award,
  Leaf,
  Settings,
  User,
  Upload
} from 'lucide-react';

const NavigationMenu = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Calculator',
      href: '/',
      icon: Calculator,
      description: 'Carbon footprint calculator'
    },
    {
      title: 'EPD Generator',
      href: '/epd-generator',
      icon: Settings,
      description: 'Environmental Product Declarations'
    },
    {
      title: 'Green Star',
      href: '/green-star',
      icon: Award,
      description: 'Green Star materials compliance'
    },
    {
      title: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      description: 'Project analytics and reports'
    },
    {
      title: 'Sustainability',
      href: '/sustainability',
      icon: Leaf,
      description: 'Sustainability insights'
    },
    {
      title: 'Profile',
      href: '/profile',
      icon: User,
      description: 'User profile and settings'
    },
    {
      title: 'Data Migration',
      href: '/data-migration',
      icon: Upload,
      description: 'Import existing project data'
    }
  ];

  return (
    <nav className="hidden md:flex space-x-1">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default NavigationMenu;
