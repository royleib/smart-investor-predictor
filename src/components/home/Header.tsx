import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import { Logo } from "@/components/ui/Logo";

interface HeaderProps {
  onSignOut: () => void;
  isAuthenticated?: boolean;
}

export const Header = ({ onSignOut, isAuthenticated }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-4 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        {isAuthenticated && (
          <Button 
            variant="ghost" 
            className="text-gray-700 hover:bg-gray-100"
            onClick={onSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        )}
      </div>
    </header>
  );
};