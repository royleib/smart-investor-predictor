import { Button } from "@/components/ui/button";
import { LogOut, Globe } from 'lucide-react';
import { Logo } from "@/components/ui/Logo";
import { motion } from "framer-motion";
import { languages, type Language } from "@/utils/i18n";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
      className="glass-effect border-b border-blue-100/20 py-2 px-3 sticky top-0 z-50 shadow-sm"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language Dropdown for Mobile */}
          <div className="block sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm">
                {Object.entries(languages).map(([code, name]) => (
                  <DropdownMenuItem key={code} asChild>
                    <Link
                      to={`/${code}${location.pathname.slice(3)}`}
                      className={`w-full ${
                        currentLang === code ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      {name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Language Buttons for Desktop */}
          <div className="hidden sm:flex gap-1">
            {Object.entries(languages).map(([code, name]) => (
              <Link
                key={code}
                to={`/${code}${location.pathname.slice(3)}`}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  currentLang === code
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
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
              className="text-slate-700 hover:bg-blue-50 h-9"
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
};