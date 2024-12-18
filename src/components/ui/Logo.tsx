import { Award } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-gray-100 p-2 rounded-lg">
        <Award className="h-6 w-6 text-gray-900" />
      </div>
      <span className="text-2xl font-montserrat font-bold text-gray-900">
        SmartPredict
      </span>
    </div>
  );
};