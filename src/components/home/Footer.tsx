import { Link } from "react-router-dom";
import { FileText, Shield, MessageSquare } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
          <Link 
            to="/privacy" 
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Shield className="w-4 h-4 mr-2" />
            Privacy Policy
          </Link>
          <Link 
            to="/disclaimer" 
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            Disclaimer
          </Link>
          <Link 
            to="/contact" 
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Us
          </Link>
        </div>
        <div className="text-center mt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Markets Prophet. All rights reserved.
        </div>
      </div>
    </footer>
  );
};