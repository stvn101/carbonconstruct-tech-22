
import { Link } from "react-router-dom";

const NavbarLogo = () => {
  return (
    <Link to="/" className="flex items-center space-x-4">
      <div className="h-12 w-12 flex items-center justify-center hover:scale-105 transition-transform">
        <img 
          src="/lovable-uploads/0aacd2f7-c0c5-4370-88aa-a5b60fe6a30a.png" 
          alt="CarbonConstruct Tech Logo" 
          className="h-12 w-12 object-contain"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-semibold bg-gradient-to-r from-carbon-600 to-carbon-400 bg-clip-text text-transparent leading-tight">
          CarbonConstruct
        </span>
        <span className="text-lg font-medium bg-gradient-to-r from-carbon-600 to-carbon-400 bg-clip-text text-transparent leading-tight -mt-1">
          Tech
        </span>
      </div>
    </Link>
  );
};

export default NavbarLogo;
