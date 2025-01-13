import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, TrendingUp } from 'lucide-react';
import { type Language } from "@/utils/i18n";

interface USStocksListProps {
  onSelect: (symbol: string) => void;
  stocks: Array<{ symbol: string; name: string; description: string; }>;
}

export const USStocksList = ({ onSelect, stocks }: USStocksListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {stocks.map((stock) => (
        <Card 
          key={stock.symbol}
          className="cursor-pointer bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all hover:scale-105"
          onClick={() => onSelect(stock.symbol)}
        >
          <CardContent className="flex items-center p-6">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-montserrat font-semibold text-gray-800">{stock.name}</h3>
              <p className="text-sm text-gray-600">{stock.symbol} - {stock.description}</p>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};