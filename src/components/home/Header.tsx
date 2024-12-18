import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import { Logo } from "@/components/ui/Logo";
import { motion } from "framer-motion";

interface HeaderProps {
  onSignOut: () => void;
  isAuthenticated?: boolean;
}

export const Header = ({ onSignOut, isAuthenticated }: HeaderProps) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-effect border-b border-blue-100/20 py-4 px-4 sticky top-0 z-50 shadow-sm"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        {isAuthenticated && (
          <Button 
            variant="ghost" 
            className="text-slate-700 hover:bg-blue-50"
            onClick={onSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        )}
      </div>
    </motion.header>
  );
};