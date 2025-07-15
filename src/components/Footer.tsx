
import React from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="contact" className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 flex flex-col items-center text-center">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/lovable-uploads/0aacd2f7-c0c5-4370-88aa-a5b60fe6a30a.png" 
                alt="CarbonConstruct Tech Logo" 
                className="h-8 w-8 object-contain mr-2"
              />
              <div className="flex flex-col">
                <span className="text-lg font-semibold leading-tight">CarbonConstruct</span>
                <span className="text-sm font-medium leading-tight -mt-1">Tech</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto text-center">
              Track, manage, and reduce your construction project's carbon footprint with our innovative SaaS platform.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="https://twitter.com/carbonconstructtech" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground rounded-xl">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/carbonconstructtech" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground rounded-xl">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/share/1DuxAP3BEc/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground rounded-xl">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/carbonconstructtech" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground rounded-xl">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/calculator" className="text-sm text-muted-foreground hover:text-foreground rounded-xl">Calculator</Link></li>
              <li><Link to="/materials" className="text-sm text-muted-foreground hover:text-foreground rounded-xl">Materials Database</Link></li>
              <li><Link to="/material-dashboard" className="text-sm text-muted-foreground hover:text-foreground rounded-xl">Analytics Dashboard</Link></li>
              <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground rounded-xl">Project Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground rounded-xl">About</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground rounded-xl">Contact</Link></li>
              <li><a href="mailto:info@carbonconstruct.com.au" className="text-sm text-muted-foreground hover:text-foreground rounded-xl">Email Us</a></li>
              <li><a href="tel:+61459148862" className="text-sm text-muted-foreground hover:text-foreground rounded-xl">Call Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground rounded-xl">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground rounded-xl">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground rounded-xl">Cookie Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground rounded-xl">Data Protection</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} CarbonConstruct Tech. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-muted-foreground text-center md:text-right">
                Building a sustainable future, one project at a time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
