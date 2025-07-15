
import { 
  Home, 
  Calculator, 
  Database, 
  BarChart3, 
  User, 
  Leaf,
  Brain,
  MessageSquare,
  FolderOpen,
  Bell,
  Settings,
  FileText,
  Shield,
  BookOpen,
  HelpCircle,
  Info,
  Mail,
  DollarSign,
  Play
} from 'lucide-react';

export function useUserNavLinks() {
  // Public navigation - showcase of app features (no login required)
  const publicNavLinks = [
    {
      path: '/',
      title: 'Home',
      icon: <Home className="h-4 w-4" />,
      premium: false
    },
    {
      path: '/calculator',
      title: 'Calculator',
      icon: <Calculator className="h-4 w-4" />,
      premium: false
    },
    {
      path: '/epd-generator',
      title: 'EPD Generator',
      icon: <FileText className="h-4 w-4" />,
      premium: false
    },
    {
      path: '/materials',
      title: 'Materials Database',
      icon: <Database className="h-4 w-4" />,
      premium: false
    },
    {
      path: '/resources',
      title: 'Resources',
      icon: <BookOpen className="h-4 w-4" />,
      premium: false
    },
    {
      path: '/blog',
      title: 'Blog',
      icon: <FileText className="h-4 w-4" />,
      premium: false
    },
    {
      path: '/demo',
      title: 'Demo',
      icon: <Play className="h-4 w-4" />,
      premium: false
    },
    {
      path: '/help',
      title: 'Help',
      icon: <HelpCircle className="h-4 w-4" />,
      premium: false
    },
    {
      path: '/about',
      title: 'About',
      icon: <Info className="h-4 w-4" />,
      premium: false
    },
    {
      path: '/contact',
      title: 'Contact',
      icon: <Mail className="h-4 w-4" />,
      premium: false
    },
    {
      path: '/pricing',
      title: 'Pricing',
      icon: <DollarSign className="h-4 w-4" />,
      premium: false
    }
  ];

  // User navigation - for authenticated users (dashboard and premium features)
  const userNavLinks = [
    // Standard user features
    {
      path: '/grok-ai',
      title: 'Grok AI',
      icon: <Brain className="h-4 w-4" />,
      premium: false, // Available for all signed-in users
      description: 'Sustainability & Material Advisor'
    },
    // Premium features
    {
      path: '/sustainability',
      title: 'Sustainability',
      icon: <Leaf className="h-4 w-4" />,
      premium: true
    },
    {
      path: '/benchmarking',
      title: 'Analytics',
      icon: <BarChart3 className="h-4 w-4" />,
      premium: true
    },
    {
      path: '/projects',
      title: 'Projects',
      icon: <FolderOpen className="h-4 w-4" />,
      premium: true
    },
    {
      path: '/notifications',
      title: 'Notifications',
      icon: <Bell className="h-4 w-4" />,
      premium: true
    }
  ];

  return { publicNavLinks, userNavLinks };
}
