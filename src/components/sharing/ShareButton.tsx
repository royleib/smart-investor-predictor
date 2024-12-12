import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ShareButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
}

export const ShareButton = ({ 
  onClick, 
  icon: Icon, 
  label, 
  className, 
  variant = "default" 
}: ShareButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={className}
      variant={variant}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
};