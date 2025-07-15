
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Calculator, Database, BarChart3, Home, Phone, User } from "lucide-react";

const MobileNav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden">
      <nav className="flex items-center justify-around bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50 py-2 safe-bottom">
        <Link
          to="/"
          className={`flex flex-col items-center space-y-1 p-2 touch-target ${
            isActive("/") ? "text-carbon-600" : "text-gray-600"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          to="/calculator"
          className={`flex flex-col items-center space-y-1 p-2 touch-target ${
            isActive("/calculator") ? "text-carbon-600" : "text-gray-600"
          }`}
        >
          <Calculator className="h-5 w-5" />
          <span className="text-xs">Calculator</span>
        </Link>
        <Link
          to="/materials"
          className={`flex flex-col items-center space-y-1 p-2 touch-target ${
            isActive("/materials") ? "text-carbon-600" : "text-gray-600"
          }`}
        >
          <Database className="h-5 w-5" />
          <span className="text-xs">Materials</span>
        </Link>
        <Link
          to="/material-dashboard"
          className={`flex flex-col items-center space-y-1 p-2 touch-target ${
            isActive("/material-dashboard") ? "text-carbon-600" : "text-gray-600"
          }`}
        >
          <BarChart3 className="h-5 w-5" />
          <span className="text-xs">Analytics</span>
        </Link>
        <Link
          to="/about"
          className={`flex flex-col items-center space-y-1 p-2 touch-target ${
            isActive("/about") ? "text-carbon-600" : "text-gray-600"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs">About</span>
        </Link>
        <Link
          to="/contact"
          className={`flex flex-col items-center space-y-1 p-2 touch-target ${
            isActive("/contact") ? "text-carbon-600" : "text-gray-600"
          }`}
        >
          <Phone className="h-5 w-5" />
          <span className="text-xs">Contact</span>
        </Link>
      </nav>
    </div>
  );
};

export default MobileNav;
