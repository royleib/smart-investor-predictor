import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from 'lucide-react';

const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', description: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft', description: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', description: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com', description: 'Consumer Cyclical' },
  { symbol: 'META', name: 'Meta Platforms', description: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc.', description: 'Automotive' },
];

interface StockSelectorProps {
  onSelect: (symbol: string) => void;
}

export const StockSelector = ({ onSelect }: StockSelectorProps) => {
  return (
    <div className="space-y-4 p-4">
      {stocks.map((stock) => (
        <Card 
          key={stock.symbol}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onSelect(stock.symbol)}
        >
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-xl font-montserrat font-semibold">{stock.name}</h3>
              <p className="text-sm text-gray-500">{stock.symbol} - {stock.description}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};