
import { useEffect } from "react";

export function useNavbarHeight(mobileHeight: string = "64px", desktopHeight: string = "120px") {
  useEffect(() => {
    // Set CSS custom properties for both mobile and desktop heights
    document.documentElement.style.setProperty("--navbar-height-mobile", mobileHeight);
    document.documentElement.style.setProperty("--navbar-height-desktop", desktopHeight);
    
    // Set the default navbar height for mobile-first approach
    document.documentElement.style.setProperty("--navbar-height", mobileHeight);
  }, [mobileHeight, desktopHeight]);
}
