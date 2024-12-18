import { Award } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-[#F8FAFC] p-2 rounded-lg">
        <Award className="h-6 w-6 text-[#334155]" />
      </div>
      <span className="text-2xl font-montserrat font-bold bg-gradient-to-r from-[#334155] to-[#475569] bg-clip-text text-transparent">
        SmartPredict
      </span>
    </div>
  );
};