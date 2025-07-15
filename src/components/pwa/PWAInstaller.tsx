import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Smartphone, Monitor, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallerProps {
  showBanner?: boolean;
  position?: 'bottom' | 'top';
  theme?: 'light' | 'dark' | 'auto';
}

const PWAInstaller: React.FC<PWAInstallerProps> = ({
  showBanner = true,
  position = 'bottom',
  theme = 'auto'
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [userAgent, setUserAgent] = useState('');

  useEffect(() => {
    setUserAgent(navigator.userAgent);
    
    // Check if app is already installed
    const checkIfInstalled = () => {
      if ('standalone' in window.navigator) {
        setIsInstalled((window.navigator as any).standalone === true);
      } else if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    checkIfInstalled();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      const installEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(installEvent);
      setIsInstallable(true);
      
      // Show install banner if enabled and not dismissed
      const bannerDismissed = localStorage.getItem('pwa-banner-dismissed');
      if (showBanner && !bannerDismissed && !isInstalled) {
        setShowInstallBanner(true);
      }
      
      console.log('📱 PWA installation available');
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      
      toast({
        title: "App Installed Successfully",
        description: "CarbonConstruct has been installed and can be accessed from your home screen.",
      });
      
      console.log('✅ PWA installed successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [showBanner, isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast({
        title: "Installation Not Available",
        description: "PWA installation is not supported on this device or browser.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Show the installation prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ User accepted the PWA install prompt');
        toast({
          title: "Installing App",
          description: "CarbonConstruct is being installed...",
        });
      } else {
        console.log('❌ User dismissed the PWA install prompt');
        toast({
          title: "Installation Cancelled",
          description: "You can install the app later from the browser menu.",
        });
      }
      
      // Clear the saved prompt since it can only be used once
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('PWA installation error:', error);
      toast({
        title: "Installation Error",
        description: "There was an error installing the app. Please try again.",
        variant: "destructive",
      });
    }
  };

  const dismissBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
    
    // Allow showing banner again after 7 days
    setTimeout(() => {
      localStorage.removeItem('pwa-banner-dismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  const getInstallInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isChrome = /Chrome/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !isChrome;
    const isFirefox = /Firefox/.test(userAgent);
    const isEdge = /Edg/.test(userAgent);

    if (isIOS && isSafari) {
      return {
        icon: <Smartphone className="h-5 w-5" />,
        title: "Install on iOS",
        steps: [
          "Tap the Share button (square with arrow)",
          "Scroll down and tap 'Add to Home Screen'",
          "Tap 'Add' to confirm installation"
        ]
      };
    }

    if (isAndroid && isChrome) {
      return {
        icon: <Download className="h-5 w-5" />,
        title: "Install on Android",
        steps: [
          "Tap the menu (three dots) in Chrome",
          "Select 'Add to Home screen'",
          "Tap 'Add' to confirm installation"
        ]
      };
    }

    if (isChrome || isEdge) {
      return {
        icon: <Monitor className="h-5 w-5" />,
        title: "Install on Desktop",
        steps: [
          "Click the install icon in the address bar",
          "Or use browser menu > 'Install CarbonConstruct'",
          "Click 'Install' to confirm"
        ]
      };
    }

    return {
      icon: <Download className="h-5 w-5" />,
      title: "Install App",
      steps: [
        "Use your browser's install option",
        "Look for 'Add to Home Screen' in the menu",
        "Follow your browser's installation prompts"
      ]
    };
  };

  // Don't show anything if already installed
  if (isInstalled) {
    return null;
  }

  const instructions = getInstallInstructions();

  // Install Banner Component
  const InstallBanner = () => (
    <div 
      className={`
        fixed left-4 right-4 z-50 transition-all duration-300 ease-in-out
        ${position === 'top' ? 'top-4' : 'bottom-4'}
        ${showInstallBanner ? 'translate-y-0 opacity-100' : 
          position === 'top' ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0'
        }
      `}
    >
      <Card className="shadow-lg border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Install CarbonConstruct</h4>
                <p className="text-xs text-muted-foreground">
                  Get faster access and offline functionality
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isInstallable && (
                <Button size="sm" onClick={handleInstallClick} className="text-xs">
                  Install
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={dismissBanner}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Install Button Component for use in other components
  const InstallButton = () => (
    <Button
      onClick={handleInstallClick}
      disabled={!isInstallable}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Install App
    </Button>
  );

  // Full Install Card Component
  const InstallCard = () => (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {instructions.icon}
          {instructions.title}
        </CardTitle>
        <CardDescription>
          Install CarbonConstruct for the best experience with offline access and native performance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Offline Access</Badge>
          <Badge variant="secondary">Fast Loading</Badge>
          <Badge variant="secondary">Native Feel</Badge>
        </div>
        
        {isInstallable ? (
          <Button onClick={handleInstallClick} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Install Now
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium">Installation steps:</p>
            <ol className="text-sm text-muted-foreground space-y-1">
              {instructions.steps.map((step, index) => (
                <li key={index} className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary rounded-full text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
        
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Why install?</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Works offline for carbon calculations</li>
            <li>• Faster loading and better performance</li>
            <li>• Easy access from your home screen</li>
            <li>• Native app-like experience</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {showInstallBanner && <InstallBanner />}
      <div className="pwa-installer">
        {/* Export components for use elsewhere */}
        <div style={{ display: 'none' }}>
          <div data-component="install-button">
            <InstallButton />
          </div>
          <div data-component="install-card">
            <InstallCard />
          </div>
        </div>
      </div>
    </>
  );
};

export default PWAInstaller;

// Hook for PWA install status
export const usePWAInstall = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const checkInstallStatus = () => {
      if ('standalone' in window.navigator) {
        setIsInstalled((window.navigator as any).standalone === true);
      } else if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(installEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    checkInstallStatus();
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setIsInstallable(false);
      return outcome === 'accepted';
    }
    return false;
  };

  return {
    isInstallable,
    isInstalled,
    installApp
  };
};