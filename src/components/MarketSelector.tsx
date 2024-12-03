import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from 'lucide-react';

const markets = [
  { id: 'US', name: 'US Stock Market', description: 'NYSE & NASDAQ' },
  { id: 'EU', name: 'European Markets', description: 'Major European exchanges' },
  { id: 'ASIA', name: 'Asian Markets', description: 'Major Asian exchanges' },
];

interface MarketSelectorProps {
  onSelect: (market: string) => void;
}

export const MarketSelector = ({ onSelect }: MarketSelectorProps) => {
  return (
    <div className="space-y-4 p-4">
      {markets.map((market) => (
        <Card 
          key={market.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onSelect(market.id)}
        >
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-xl font-montserrat font-semibold">{market.name}</h3>
              <p className="text-gray-500">{market.description}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};