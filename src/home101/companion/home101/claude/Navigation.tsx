import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SettingsModal from './SettingsModal';
import { 
  Home, 
  BarChart3, 
  Users, 
  Calculator, 
  Settings, 
  Bell,
  Search,
  Menu,
  X,
  Leaf
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Main operations dashboard'
  },
  {
    name: 'Scope 3 Tracking',
    href: '/scope3',
    icon: BarChart3,
    description: 'Comprehensive Scope 3 emissions tracking',
    badge: 'Enhanced'
  },
  {
    name: 'Supplier Portal',
    href: '/suppliers',
    icon: Users,
    description: 'Supplier engagement and data collection'
  },
  {
    name: 'Calculator',
    href: '/calculator',
    icon: Calculator,
    description: 'Advanced emissions calculator'
  },
  {
    name: 'Reporting',
    href: '/reporting',
    icon: BarChart3,
    description: 'Advanced reporting and analytics',
    badge: 'New'
  },
  {
    name: 'Data Collection',
    href: '/data-collection',
    icon: Settings,
    description: 'Guided data collection wizard'
  }
];

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return location === '/';
    }
    return location.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Carbon Companion</h1>
                  <p className="text-xs text-gray-500">Enhanced with Scope 3</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Items */}
            <div className="hidden md:flex items-center space-x-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={active ? 'default' : 'ghost'}
                      className={`relative px-4 py-2 ${active ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-gray-100'}`}
                      size="sm"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="whitespace-nowrap">{item.name}</span>
                      {item.badge && (
                        <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Search className="h-4 w-4" />
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>

              {/* Settings */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        active
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      <div className="flex-1">
                        <div className="flex items-center">
                          {item.name}
                          {item.badge && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}

