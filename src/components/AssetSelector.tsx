import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Briefcase, Bitcoin, LineChart, DollarSign } from 'lucide-react';

const assetTypes = [
  { id: 'Stocks', name: 'Stocks', icon: Briefcase, description: 'Trade company shares' },
  { id: 'Crypto', name: 'Cryptocurrency', icon: Bitcoin, description: 'Digital assets' },
  { id: 'ETFs', name: 'ETFs', icon: LineChart, description: 'Exchange-traded funds' },
  { id: 'Forex', name: 'Forex', icon: DollarSign, description: 'Currency exchange' }
];

interface AssetSelectorProps {
  onSelect: (type: string) => void;
}

export const AssetSelector = ({ onSelect }: AssetSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {assetTypes.map((type) => (
        <Card 
          key={type.id}
          className="cursor-pointer hover:shadow-md transition-all duration-300 border border-[#E2E8F0] bg-white"
          onClick={() => onSelect(type.id)}
        >
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 bg-[#F8FAFC] rounded-full flex items-center justify-center mr-4">
              <type.icon className="h-6 w-6 text-[#475569]" />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-montserrat font-semibold text-[#334155]">{type.name}</h3>
              <p className="text-sm text-[#64748B]">{type.description}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-[#94A3B8]" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};