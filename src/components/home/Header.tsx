import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import { Logo } from "@/components/ui/Logo";
import { motion } from "framer-motion";
import { languages, type Language } from "@/utils/i18n";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  onSignOut: () => void;
  isAuthenticated?: boolean;
  currentLang: Language;
}

export const Header = ({ onSignOut, isAuthenticated, currentLang }: HeaderProps) => {
  const location = useLocation();

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-effect border-b border-blue-100/20 py-3 md:py-4 px-3 md:px-4 sticky top-0 z-50 shadow-sm"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex gap-1 md:gap-2">
            {Object.entries(languages).map(([code, name]) => (
              <Link
                key={code}
                to={`/${code}${location.pathname.slice(3)}`}
                className={`px-2 py-1 text-sm md:text-base rounded ${
                  currentLang === code
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-gray-100'
                }`}
              >
                {code.toUpperCase()}
              </Link>
            ))}
          </div>
          {isAuthenticated && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-slate-700 hover:bg-blue-50"
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
};