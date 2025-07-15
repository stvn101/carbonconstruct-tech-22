
import { useState, useEffect } from 'react';

export function useDevice() {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroidDevice = /Android/.test(userAgent);
    const isMobileDevice = isIOSDevice || isAndroidDevice || window.innerWidth < 640;

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);
    setIsMobile(isMobileDevice);
  }, []);

  return {
    isIOS,
    isAndroid,
    isMobile,
    isDesktop: !isMobile
  };
}
