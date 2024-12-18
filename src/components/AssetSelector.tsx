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
          className="cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200"
          onClick={() => onSelect(type.id)}
        >
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
              <type.icon className="h-6 w-6 text-gray-700" />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-montserrat font-semibold text-gray-900">{type.name}</h3>
              <p className="text-sm text-gray-600">{type.description}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};