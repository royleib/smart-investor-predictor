import { Award } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg shadow-lg">
        <Award className="h-6 w-6 text-white" />
      </div>
      <span className="text-2xl font-montserrat font-bold bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
        SmartPredict
      </span>
    </div>
  );
};