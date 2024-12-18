import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import { Logo } from "@/components/ui/Logo";

interface HeaderProps {
  onSignOut: () => void;
}

export const Header = ({ onSignOut }: HeaderProps) => {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 py-6 px-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/20"
          onClick={onSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </header>
  );
};