
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Calculator, Database, BarChart3, Home, Phone, User } from "lucide-react";

const DesktopNav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link
        to="/"
        className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-carbon-600 ${
          isActive("/") ? "text-carbon-600" : "text-carbon-800"
        }`}
      >
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Link>
      <Link
        to="/calculator"
        className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-carbon-600 ${
          isActive("/calculator") ? "text-carbon-600" : "text-carbon-800"
        }`}
      >
        <Calculator className="h-4 w-4" />
        <span>Calculator</span>
      </Link>
      <Link
        to="/materials"
        className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-carbon-600 ${
          isActive("/materials") ? "text-carbon-600" : "text-carbon-800"
        }`}
      >
        <Database className="h-4 w-4" />
        <span>Materials</span>
      </Link>
      <Link
        to="/material-dashboard"
        className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-carbon-600 ${
          isActive("/material-dashboard") ? "text-carbon-600" : "text-carbon-800"
        }`}
      >
        <BarChart3 className="h-4 w-4" />
        <span>Analytics</span>
      </Link>
      <Link
        to="/about"
        className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-carbon-600 ${
          isActive("/about") ? "text-carbon-600" : "text-carbon-800"
        }`}
      >
        <User className="h-4 w-4" />
        <span>About</span>
      </Link>
      <Link
        to="/contact"
        className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-carbon-600 ${
          isActive("/contact") ? "text-carbon-600" : "text-carbon-800"
        }`}
      >
        <Phone className="h-4 w-4" />
        <span>Contact</span>
      </Link>
    </nav>
  );
};

export default DesktopNav;
