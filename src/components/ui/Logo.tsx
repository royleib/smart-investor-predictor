import { Award } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Award className="h-8 w-8 text-blue-600" />
      <span className="text-2xl font-montserrat font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        SmartPredict
      </span>
    </div>
  );
};